/**
 * ServiceSummaryScreen - Tổng kết khách sử dụng dịch vụ
 * Call API backend 100% dữ liệu thực tế:
 * 1. Lấy danh sách nhà trọ và nhà trọ đang quản lý của chủ trọ.
 * 2. Lấy toàn bộ danh sách dịch vụ của nhà trọ (3 dịch vụ -> 3 tab, nhiều hơn -> thêm tab cuộn ngang).
 * 3. Lấy toàn bộ danh sách phòng của nhà trọ từ backend (/api/v1/rooms/motel/{motelId}).
 * 4. Tính toán mức sử dụng và số tiền dịch vụ của từng phòng theo tháng/năm đã chọn từ hóa đơn & chỉ số.
 * 5. Footer Card tính tổng mức sử dụng và tổng tiền thu của toàn bộ phòng trọ.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { financeService } from "@/services/api/finance.service";
import { roomService } from '@/services/api/room.service';
import { safeAsyncStorage } from '@/services/storage/safe-async-storage';
import { apiClient } from '@/services/api/client';
import { MotelResponse, MotelServiceResponse } from '@/types/motel.types';
import { MotelServiceItem } from '@/types/service-settings.types';

interface ServiceTabItem {
  id: string;
  name: string;
  price: number;
  chargetype: string;
}

interface RoomServiceUsageItem {
  roomId: string;
  roomName: string;
  usage: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

export default function ServiceSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  // Mặc định tháng/năm hiện tại
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear(),
  );
  const [monthModalVisible, setMonthModalVisible] = useState<boolean>(false);
  const [motelModalVisible, setMotelModalVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Dữ liệu nhà trọ thật từ API
  const [motels, setMotels] = useState<MotelResponse[]>([]);
  const [currentMotel, setCurrentMotel] = useState<MotelResponse | null>(null);

  // Dữ liệu dịch vụ thật của nhà trọ (các tabs)
  const [services, setServices] = useState<ServiceTabItem[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");

  // Toàn bộ danh sách phòng của nhà trọ từ API
  const [rooms, setRooms] = useState<any[]>([]);

  // Danh sách hóa đơn & chỉ số thực tế từ API
  const [invoices, setInvoices] = useState<any[]>([]);
  const [meterReadings, setMeterReadings] = useState<any[]>([]);

  // Chuẩn hóa so sánh tên dịch vụ (bỏ dấu, khoảng trắng, chữ hoa/thường)
  const normalizeServiceName = (str: string = ""): string => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  // Chuẩn hóa tên đơn vị tính
  const normalizeUnit = (serviceName: string, chargetype?: string): string => {
    if (
      chargetype &&
      ![
        "METER",
        "FIXED",
        "PER_PERSON",
        "FREE",
        "THEO DONG HO",
        "THEO ĐỒNG HỒ",
      ].includes(chargetype.toUpperCase())
    ) {
      return chargetype;
    }
    const lower = (serviceName || "").toLowerCase();
    if (lower.includes("điện") || lower.includes("dien")) return "KWh";
    if (lower.includes("nước") || lower.includes("nuoc")) return "m3";
    if (lower.includes("xe") || lower.includes("giữ xe")) return "Chiếc";
    if (lower.includes("người") || lower.includes("nguoi")) return "Người";
    return "Tháng";
  };

  // Tải dữ liệu thật từ Backend API
  const loadData = useCallback(async () => {
    if (!user?.username) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      // 1. Gọi API lấy danh sách nhà trọ thuộc tài khoản
      const motelRes = await motelService.getMotelsByAccount(user.username);
      const mList: MotelResponse[] = motelRes.result || [];
      setMotels(mList);

      // Xác định nhà trọ đang chọn
      let targetMotelId =
        (params.motelId as string) ||
        (await safeAsyncStorage.getItem("rrms_active_motel_id"));
      let targetMotel =
        mList.find((m) => m.motelId === targetMotelId) || mList[0] || null;

      if (targetMotel) {
        targetMotelId = targetMotel.motelId;
        await safeAsyncStorage.setItem("rrms_active_motel_id", targetMotelId);
      }
      setCurrentMotel(targetMotel);

      if (!targetMotelId) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // 2. Gọi đồng thời các API backend thật:
      // - Chi tiết nhà trọ & dịch vụ (/api/v1/motels/{id})
      // - Toàn bộ danh sách phòng (/api/v1/rooms/motel/{id})
      // - Hóa đơn của nhà trọ (/invoices/motel/{id})
      // - Chỉ số điện nước (/api/v1/meter-readings/motel/{id})
      const [motelDetailRes, roomsRes, invoicesRes, meterRes] =
        await Promise.allSettled([
          motelService.getMotelById(targetMotelId),
          roomService.getRoomsByMotel(targetMotelId),
          financeService.getInvoicesByMotel(targetMotelId, { size: 500 }),
          apiClient
            .get(`/api/v1/meter-readings/motel/${targetMotelId}`)
            .catch(() =>
              apiClient.get(`/api/meter-readings/motel/${targetMotelId}`),
            ),
        ]);

      // 3. Phân tích danh sách dịch vụ của nhà trọ (Load số tab tương ứng)
      let motelServicesList: MotelServiceResponse[] = [];
      if (
        motelDetailRes.status === "fulfilled" &&
        motelDetailRes.value?.result
      ) {
        motelServicesList = motelDetailRes.value.result.motelServices || [];
      }

      // Nếu trong motel detail rỗng, gọi thêm API motel-services
      if (motelServicesList.length === 0) {
        try {
          const allServicesRes: any = await apiClient.get(
            "/api/v1/motel-services",
          );
          const all = allServicesRes?.result || allServicesRes?.data || [];
          motelServicesList = all.filter(
            (s: any) => s.motelId === targetMotelId,
          );
        } catch (e) {
          console.warn("Lỗi khi lấy motel-services phụ:", e);
        }
      }

      const tabs: ServiceTabItem[] = motelServicesList.map((s, idx) => ({
        id: s.motelServiceId || `service-${idx}`,
        name: s.nameService || "Dịch vụ",
        price: Number(s.price || 0),
        chargetype: normalizeUnit(s.nameService || "", s.chargetype),
      }));
      setServices(tabs);

      // Đặt tab mặc định
      setActiveServiceId((prev) =>
        tabs.some((t) => t.id === prev) ? prev : tabs[0]?.id || "",
      );

      // 4. Phân tích toàn bộ danh sách phòng của nhà trọ
      let roomsList: any[] = [];
      if (roomsRes.status === "fulfilled" && roomsRes.value) {
        const rVal: any = roomsRes.value;
        roomsList = rVal?.result || rVal?.data?.result || rVal?.data || [];
      }
      setRooms(roomsList);

      // 5. Phân tích danh sách hóa đơn thật
      let invList: any[] = [];
      if (invoicesRes.status === "fulfilled" && invoicesRes.value) {
        const iVal: any = invoicesRes.value;
        invList =
          iVal?.result?.content ||
          iVal?.result?.items ||
          iVal?.result ||
          iVal?.data ||
          [];
      }
      setInvoices(invList);

      // 6. Phân tích chỉ số điện nước thật
      let mrList: any[] = [];
      if (meterRes.status === "fulfilled" && meterRes.value) {
        const mVal: any = meterRes.value;
        mrList = mVal?.result || mVal?.data?.result || mVal?.data || [];
      }
      setMeterReadings(mrList);
    } catch (error) {
      console.warn("Lỗi khi tải dữ liệu thật từ backend:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.username, params.motelId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Điều hướng tháng
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Tab dịch vụ đang chọn
  const activeService = useMemo(() => {
    return (
      services.find((s) => s.id === activeServiceId) || services[0] || null
    );
  }, [services, activeServiceId]);

  // Lọc hóa đơn theo tháng và năm đã chọn
  const invoicesInSelectedMonth = useMemo(() => {
    return invoices.filter((inv) => {
      if (inv.invoiceCreateMonth) {
        const str = String(inv.invoiceCreateMonth);
        const parts = str.split("-");
        if (parts.length >= 2) {
          const y = Number(parts[0]);
          const m = Number(parts[1]);
          if (y === selectedYear && m === selectedMonth) return true;
        }
      }
      if (inv.invoiceCreateDate) {
        const d = new Date(inv.invoiceCreateDate);
        if (!isNaN(d.getTime())) {
          return (
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === selectedYear
          );
        }
      }
      return false;
    });
  }, [invoices, selectedMonth, selectedYear]);

  // Lọc chỉ số điện nước theo tháng và năm đã chọn
  const meterReadingsInSelectedMonth = useMemo(() => {
    return meterReadings.filter((mr) => {
      if (!mr.readingDate) return false;
      const d = new Date(mr.readingDate);
      if (isNaN(d.getTime())) return false;
      return (
        d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
      );
    });
  }, [meterReadings, selectedMonth, selectedYear]);

  // Tính toán dữ liệu mức sử dụng và tiền dịch vụ cho TẤT CẢ các phòng trọ của nhà trọ
  const roomUsageList = useMemo<RoomServiceUsageItem[]>(() => {
    if (!activeService || rooms.length === 0) {
      return [];
    }

    const activeNorm = normalizeServiceName(activeService.name);
    const unit = activeService.chargetype;
    const defaultUnitPrice = activeService.price || 0;

    return rooms.map((room) => {
      const roomId = room.roomId || room.id || "";
      const roomName =
        room.name ||
        room.nameRoom ||
        `Phòng ${room.roomNumber || ""}`.trim() ||
        "Phòng";

      let usage = 0;
      let unitPrice = defaultUnitPrice;
      let totalAmount = 0;
      let hasData = false;

      // 1. Kiểm tra trong hóa đơn của tháng đó
      const matchedInvoice = invoicesInSelectedMonth.find(
        (inv) =>
          (roomId && inv.roomId === roomId) ||
          (inv.roomName &&
            inv.roomName.trim().toLowerCase() ===
              roomName.trim().toLowerCase()),
      );

      if (matchedInvoice && Array.isArray(matchedInvoice.serviceDetails)) {
        const matchedDetail = matchedInvoice.serviceDetails.find((dt: any) => {
          const dtNorm = normalizeServiceName(dt.serviceName || "");
          return (
            dtNorm === activeNorm ||
            dtNorm.includes(activeNorm) ||
            activeNorm.includes(dtNorm)
          );
        });

        if (matchedDetail) {
          usage = Number(matchedDetail.quantity ?? 1);
          unitPrice = Number(matchedDetail.servicePrice ?? defaultUnitPrice);
          totalAmount = Number(matchedDetail.totalPrice ?? usage * unitPrice);
          hasData = true;
        }
      }

      // 2. Nếu chưa có hóa đơn, kiểm tra chỉ số meter readings của tháng đó
      if (!hasData) {
        const matchedReading = meterReadingsInSelectedMonth.find((mr) => {
          const isRoom =
            (roomId && mr.roomId === roomId) ||
            (mr.roomName &&
              mr.roomName.trim().toLowerCase() ===
                roomName.trim().toLowerCase());
          const mrNorm = normalizeServiceName(mr.serviceName || "");
          const isService =
            mrNorm === activeNorm ||
            mrNorm.includes(activeNorm) ||
            activeNorm.includes(mrNorm);
          return isRoom && isService;
        });

        if (matchedReading) {
          usage = Number(matchedReading.usageAmount ?? 0);
          unitPrice = defaultUnitPrice;
          totalAmount = usage * unitPrice;
          hasData = true;
        }
      }

      // 3. Nếu không có dữ liệu phát sinh trong tháng: mức sử dụng = 0, tiền = 0
      if (!hasData) {
        usage = 0;
        unitPrice = defaultUnitPrice;
        totalAmount = 0;
      }

      return {
        roomId,
        roomName,
        usage,
        unit,
        unitPrice,
        totalAmount,
      };
    });
  }, [
    rooms,
    activeService,
    invoicesInSelectedMonth,
    meterReadingsInSelectedMonth,
  ]);

  // Tổng hợp mức sử dụng và tổng tiền thu của TOÀN BỘ phòng trọ
  const totals = useMemo(() => {
    const totalUsage = roomUsageList.reduce((acc, cur) => acc + cur.usage, 0);
    const totalRevenue = roomUsageList.reduce(
      (acc, cur) => acc + cur.totalAmount,
      0,
    );
    return { totalUsage, totalRevenue };
  }, [roomUsageList]);

  // Format tiền tệ
  const formatCurrency = (val: number): string => {
    if (!val && val !== 0) return "0";
    return Math.round(val)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Chọn nhà trọ khác
  const handleSelectMotel = async (motel: MotelResponse) => {
    setCurrentMotel(motel);
    setMotelModalVisible(false);
    await safeAsyncStorage.setItem("rrms_active_motel_id", motel.motelId);
    loadData();
  };

  return (
    <View style={styles.container}>
      {/* ── 1. Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Tổng kết khách sử dụng dịch vụ</Text>
          {currentMotel && (
            <TouchableOpacity
              style={styles.motelBadge}
              onPress={() => setMotelModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="home-outline" size={13} color="#4bcffa" />
              <Text style={styles.motelBadgeText} numberOfLines={1}>
                {currentMotel.motelName}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#4bcffa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── 2. Month Selector Card ── */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthNavBtn}
          onPress={handlePrevMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tháng trước"
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={Colors.textPrimary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.monthNavText}>{"Tháng\ntrước"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthCenter}
          onPress={() => setMonthModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.monthCenterLabel}>Tháng sử dụng</Text>
          <Text style={styles.monthCenterValue}>
            Tháng {selectedMonth}, {selectedYear}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthNavBtn}
          onPress={handleNextMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tháng tiếp theo"
        >
          <Text style={styles.monthNavText}>{"Tháng\ntiếp theo"}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textPrimary}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      {/* ── 3. Tabs dịch vụ (Số tab theo dịch vụ có trong nhà trọ) ── */}
      <View style={styles.tabsContainer}>
        {services.length === 0 && !isLoading ? (
          <View style={styles.noServiceTab}>
            <Text style={styles.noServiceText}>
              Nhà trọ chưa cấu hình dịch vụ
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {services.map((service) => {
              const isActive = service.id === activeService?.id;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => setActiveServiceId(service.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {service.name}
                  </Text>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── 4. Bảng danh sách phòng sử dụng ── */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableColHeader, styles.colRoom]}>Phòng</Text>
        <Text style={[styles.tableColHeader, styles.colUsage]}>
          Mức sử dụng
        </Text>
        <Text style={[styles.tableColHeader, styles.colPrice]}>Đơn giá</Text>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !isRefreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#4bcffa" />
            <Text style={styles.loadingText}>
              Đang tải dữ liệu từ backend...
            </Text>
          </View>
        ) : rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={54} color={Colors.gray300} />
            <Text style={styles.emptyStateTitle}>Nhà trọ chưa có phòng</Text>
            <Text style={styles.emptyStateDesc}>
              Vui lòng tạo phòng trọ trong phần Quản lý phòng.
            </Text>
          </View>
        ) : roomUsageList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={54} color={Colors.gray300} />
            <Text style={styles.emptyStateTitle}>Không có dữ liệu</Text>
            <Text style={styles.emptyStateDesc}>
              Khách thuê chưa sử dụng {activeService?.name || "dịch vụ"} trong
              Tháng {selectedMonth}/{selectedYear}.
            </Text>
          </View>
        ) : (
          roomUsageList.map((item, index) => (
            <View
              key={item.roomId || `room-${index}`}
              style={[
                styles.tableRow,
                index === roomUsageList.length - 1 && styles.tableRowLast,
              ]}
            >
              <Text
                style={[styles.rowText, styles.colRoom, styles.roomNameText]}
                numberOfLines={1}
              >
                {item.roomName}
              </Text>
              <Text style={[styles.rowText, styles.colUsage, styles.usageText]}>
                {`${item.usage} ${item.unit} x ${formatCurrency(item.unitPrice)}đ`}
              </Text>
              <Text
                style={[
                  styles.rowText,
                  styles.colPrice,
                  styles.totalAmountText,
                ]}
              >
                {`${formatCurrency(item.totalAmount)} đ`}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── 5. Footer Card Tổng kết (Cố định ở đáy màn hình, tính tổng toàn bộ phòng trọ) ── */}
      {activeService && (
        <View
          style={[
            styles.footerCard,
            { bottom: insets.bottom > 0 ? insets.bottom + 8 : 16 },
          ]}
        >
          <View style={styles.footerColLeft}>
            <Text style={styles.footerLabel}>Tên dịch vụ</Text>
            <Text style={styles.footerServiceName} numberOfLines={1}>
              {activeService.name}
            </Text>
          </View>

          <View style={styles.footerColCenter}>
            <Text style={styles.footerLabel}>Sử dụng</Text>
            <Text style={styles.footerUsageValue} numberOfLines={1}>
              {`${totals.totalUsage} ${activeService.chargetype}`}
            </Text>
          </View>

          <View style={styles.footerColRight}>
            <Text style={styles.footerLabel}>Tổng tiền thu</Text>
            <Text style={styles.footerTotalAmount} numberOfLines={1}>
              {`${formatCurrency(totals.totalRevenue)} đ`}
            </Text>
          </View>
        </View>
      )}

      {/* ── Modal chọn nhanh tháng ── */}
      <Modal
        visible={monthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Chọn tháng sử dụng ({selectedYear})
            </Text>
            <View style={styles.monthsGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                const isSelected = selectedMonth === m;
                return (
                  <TouchableOpacity
                    key={`month-${m}`}
                    style={[
                      styles.monthItem,
                      isSelected && styles.selectedMonthItem,
                    ]}
                    onPress={() => {
                      setSelectedMonth(m);
                      setMonthModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.monthItemText,
                        isSelected && styles.selectedMonthItemText,
                      ]}
                    >
                      Tháng {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal chọn nhà trọ ── */}
      <Modal
        visible={motelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMotelModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMotelModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn nhà trọ xem tổng kết</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {motels.map((m) => {
                const isSelected = m.motelId === currentMotel?.motelId;
                return (
                  <TouchableOpacity
                    key={m.motelId}
                    style={[
                      styles.motelSelectRow,
                      isSelected && styles.selectedMotelSelectRow,
                    ]}
                    onPress={() => handleSelectMotel(m)}
                  >
                    <Ionicons
                      name="home"
                      size={18}
                      color={isSelected ? "#4bcffa" : "#6B7280"}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={[
                        styles.motelSelectText,
                        isSelected && styles.selectedMotelSelectText,
                      ]}
                      numberOfLines={1}
                    >
                      {m.motelName}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#4bcffa"
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // 1. Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: FontWeights.bold,
    color: "#111827",
  },
  motelBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  motelBadgeText: {
    fontSize: 12,
    color: "#4bcffa",
    fontWeight: FontWeights.medium,
    maxWidth: 220,
  },

  // 2. Month Selector Card
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.sm,
  },
  monthNavBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthNavText: {
    fontSize: FontSizes.sm,
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: FontWeights.medium,
  },
  monthCenter: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  monthCenterLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  monthCenterValue: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: "#2563EB",
  },

  // 3. Tabs Bar
  tabsContainer: {
    backgroundColor: Colors.white,
    marginTop: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
  },
  noServiceTab: {
    paddingVertical: 14,
    alignItems: "center",
  },
  noServiceText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {},
  tabText: {
    fontSize: 15,
    fontWeight: FontWeights.medium,
    color: "#374151",
  },
  activeTabText: {
    color: "#4bcffa",
    fontWeight: FontWeights.bold,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: "#4bcffa",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // 4. Bảng danh sách
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  tableColHeader: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: "#111827",
  },
  colRoom: {
    flex: 1.2,
    textAlign: "left",
  },
  colUsage: {
    flex: 2.0,
    textAlign: "center",
  },
  colPrice: {
    flex: 1.2,
    textAlign: "right",
  },

  scrollList: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  rowText: {
    fontSize: 14,
  },
  roomNameText: {
    color: "#111827",
    fontWeight: FontWeights.medium,
  },
  usageText: {
    color: "#374151",
  },
  totalAmountText: {
    color: "#111827",
    fontWeight: FontWeights.bold,
  },

  // Trạng thái trống & Loading
  centerLoading: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: "#374151",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  // 5. Footer Card Tổng kết
  footerCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: "#22C55E",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadows.md,
  },
  footerColLeft: {
    flex: 1.2,
    alignItems: "flex-start",
  },
  footerColCenter: {
    flex: 1.2,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  footerColRight: {
    flex: 1.4,
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 4,
  },
  footerServiceName: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: "#111827",
  },
  footerUsageValue: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: "#111827",
  },
  footerTotalAmount: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: "#4bcffa",
  },

  // Modal chọn tháng
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    ...Shadows.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  monthItem: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  selectedMonthItem: {
    backgroundColor: "#4bcffa",
    borderColor: "#4bcffa",
  },
  monthItemText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: FontWeights.medium,
  },
  selectedMonthItemText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },

  // Modal chọn nhà trọ
  motelSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  selectedMotelSelectRow: {
    backgroundColor: "#F0FDF4",
  },
  motelSelectText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  selectedMotelSelectText: {
    color: "#4bcffa",
    fontWeight: FontWeights.bold,
  },
});
