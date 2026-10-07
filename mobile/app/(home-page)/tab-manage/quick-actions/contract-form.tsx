import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Switch,
  Modal,
  Image,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { contractService } from "@/services/api/contract.service";
import { roomService } from "@/services/api/room.service";
import { tenantService } from "@/services/api/tenant.service";
import { useAuth } from "@/hooks/use-auth";
import { RoomReservation } from "@/types/deposit.types";
import { CalendarDateField } from "@/components/ui/calendar-date-picker-modal";

export default function ContractFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const params = useLocalSearchParams<{
    roomId: string;
    roomName: string;
    roomPrice: string;
    roomDeposit: string;
    motelId?: string;
    reservationId?: string;
    reservationData?: string;
  }>();

  const roomId = params.roomId || "";
  const roomName = params.roomName || "Phòng";
  const initialPrice = Number(params.roomPrice || 0);
  const initialDeposit = Number(params.roomDeposit || 0);
  const motelId = params.motelId || "";

  // Dữ liệu cọc giữ chỗ (nếu có)
  const existingReservation: RoomReservation | null = useMemo(() => {
    if (!params.reservationData) return null;
    try {
      return JSON.parse(params.reservationData);
    } catch {
      return null;
    }
  }, [params.reservationData]);

  const hasReservation = !!existingReservation || !!params.reservationId;

  // Helper định dạng ngày DD/MM/YYYY
  const getTodayStr = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()}`;
  };

  const parseDateParts = (value: string) => {
    const trimmed = value.trim();
    const displayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    const day = displayMatch
      ? Number(displayMatch[1])
      : isoMatch
        ? Number(isoMatch[3])
        : NaN;
    const month = displayMatch
      ? Number(displayMatch[2])
      : isoMatch
        ? Number(isoMatch[2])
        : NaN;
    const year = displayMatch
      ? Number(displayMatch[3])
      : isoMatch
        ? Number(isoMatch[1])
        : NaN;

    if (![day, month, year].every(Number.isFinite)) return null;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return { day, month, year };
  };

  const toDisplayDate = (value?: string | null): string => {
    if (!value) return "";
    const parts = parseDateParts(value);
    return parts
      ? `${String(parts.day).padStart(2, "0")}/${String(parts.month).padStart(2, "0")}/${parts.year}`
      : "";
  };

  const toBackendDate = (d: string): string => {
    const parts = parseDateParts(d);
    if (!parts) throw new Error(`Ngày không hợp lệ: ${d || "chưa chọn"}`);
    return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  };

  // Tính ngày kết thúc từ ngày bắt đầu và số tháng
  const calculateEndDate = (startDateStr: string, months: number): string => {
    if (!startDateStr || months <= 0) return "";
    const parts = parseDateParts(startDateStr);
    if (!parts) return "";
    const targetMonth = parts.month - 1 + months;
    const targetYear = parts.year + Math.floor(targetMonth / 12);
    const normalizedMonth = targetMonth % 12;
    const lastDayOfMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
    const day = Math.min(parts.day, lastDayOfMonth);
    return `${String(day).padStart(2, "0")}/${String(normalizedMonth + 1).padStart(2, "0")}/${targetYear}`;
  };

  // ── State Form ──
  // 1. Thông tin thời hạn
  const [leaseTerm, setLeaseTerm] = useState<string>("12");
  const [leaseTermLabel, setLeaseTermLabel] =
    useState<string>("12 tháng (1 năm)");
  const [showLeasePicker, setShowLeasePicker] = useState<boolean>(false);
  const initialMoveInDate =
    toDisplayDate(existingReservation?.moveInDate) || getTodayStr();
  const [moveInDate, setMoveInDate] = useState<string>(initialMoveInDate);
  const [endDate, setEndDate] = useState<string>(() =>
    calculateEndDate(initialMoveInDate, 12),
  );

  // 2. Thông tin khách thuê
  const [countTenant, setCountTenant] = useState<string>("1");
  const [tenantName, setTenantName] = useState<string>(
    existingReservation?.nameTenant || "",
  );
  const [tenantPhone, setTenantPhone] = useState<string>(
    existingReservation?.phoneTenant || "",
  );
  const [useApp, setUseApp] = useState<boolean>(true);
  const [showReservationInfoModal, setShowReservationInfoModal] =
    useState<boolean>(false);
  const [showOtherTenantInfoModal, setShowOtherTenantInfoModal] =
    useState<boolean>(false);

  // Thông tin mở rộng của khách
  const [tenantCccd, setTenantCccd] = useState<string>("");
  const [tenantBirthday, setTenantBirthday] = useState<string>("");
  const [tenantGender, setTenantGender] = useState<"MALE" | "FEMALE">("MALE");
  const [tenantAddress, setTenantAddress] = useState<string>("");
  const [tenantJob, setTenantJob] = useState<string>("");

  // 3. Thông tin giá trị hợp đồng
  const [price, setPrice] = useState<string>(
    initialPrice > 0 ? Number(initialPrice).toLocaleString("vi-VN") : "300.000",
  );
  const [deposit, setDeposit] = useState<string>(
    existingReservation?.deposit
      ? Number(existingReservation.deposit).toLocaleString("vi-VN")
      : initialDeposit > 0
        ? Number(initialDeposit).toLocaleString("vi-VN")
        : "300.000",
  );
  const [collectionCycle, setCollectionCycle] = useState<string>("1");
  const [invoiceDate, setInvoiceDate] = useState<string>("1");

  // Templates từ backend
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [contractTemplate, setContractTemplate] =
    useState<string>("Mẫu mặc định");
  const [showTemplatePicker, setShowTemplatePicker] = useState<boolean>(false);

  // 4. Dịch vụ
  const [services, setServices] = useState<any[]>([
    {
      id: "1",
      name: "Tiền điện",
      price: 1700,
      unit: "KWh",
      status: "Chưa sử dụng",
    },
    {
      id: "2",
      name: "Tiền nước",
      price: 18000,
      unit: "Khối",
      status: "Chưa sử dụng",
    },
  ]);
  const [showServicesModal, setShowServicesModal] = useState<boolean>(false);

  // 5. Quản lý tài sản (nội thất)
  const [assets, setAssets] = useState<any[]>([]);
  const [showAssetsModal, setShowAssetsModal] = useState<boolean>(false);

  // 6. Hình ảnh
  const [images, setImages] = useState<string[]>([]);

  // 7. Môi giới
  const [broker, setBroker] = useState<string>("");
  const [brokerCommissionRate, setBrokerCommissionRate] =
    useState<string>("0%");
  const [brokerCommissionAmount, setBrokerCommissionAmount] =
    useState<string>("0");
  const [createExpenseReceipt, setCreateExpenseReceipt] =
    useState<boolean>(true);
  const [showBrokerPicker, setShowBrokerPicker] = useState<boolean>(false);

  // State thông báo thành công (Bottom Sheet popup)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdContractData, setCreatedContractData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load danh sách mẫu hợp đồng, dịch vụ và tài sản từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Tải mẫu hợp đồng
        try {
          const templatesRes = motelId
            ? await contractService.getTemplatesByMotel(motelId)
            : await contractService.getTemplates();
          const tList = Array.isArray(templatesRes)
            ? templatesRes
            : templatesRes?.result || [];
          if (tList.length > 0) {
            setAvailableTemplates(tList);
            setSelectedTemplateId(
              tList[0].contractTemplateId || tList[0].id || "",
            );
            setContractTemplate(
              tList[0].templateName || tList[0].name || "Mẫu mặc định",
            );
          }
        } catch {
          // fallback
        }

        // 2. Tải dịch vụ & thiết bị của phòng
        if (roomId) {
          const [servicesRes, devicesRes] = await Promise.allSettled([
            roomService.getServicesByRoom(roomId),
            roomService.getDevicesByRoom(roomId),
          ]);

          if (
            servicesRes.status === "fulfilled" &&
            servicesRes.value?.result?.length
          ) {
            const apiServices = servicesRes.value.result.map((s: any) => ({
              id:
                s.roomServiceId ||
                s.service?.motelServiceId ||
                String(Math.random()),
              name: s.service?.serviceName || s.serviceName || "Dịch vụ",
              price: s.service?.price || s.price || 0,
              unit: s.service?.unit || s.unit || "tháng",
              status: "Chưa sử dụng",
            }));
            if (apiServices.length > 0) setServices(apiServices);
          }

          if (
            devicesRes.status === "fulfilled" &&
            devicesRes.value?.result?.length
          ) {
            const apiDevices = devicesRes.value.result.map((d: any) => ({
              id:
                d.roomDeviceId ||
                d.device?.motelDeviceId ||
                String(Math.random()),
              name: d.device?.name || d.name || "Tài sản",
              quantity: d.quantity || 1,
              status: d.status || "Tốt",
            }));
            setAssets(apiDevices);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchData();
  }, [roomId, motelId]);

  // Cập nhật ngày kết thúc khi thay đổi thời hạn
  const handleSelectLeaseTerm = (months: number, label: string) => {
    setLeaseTerm(String(months));
    setLeaseTermLabel(label);
    setShowLeasePicker(false);
    if (moveInDate) {
      setEndDate(calculateEndDate(moveInDate, months));
    }
  };

  // Upload hình ảnh mô phỏng
  const handleAddImage = (type: "camera" | "library") => {
    if (images.length >= 6) {
      Alert.alert("Giới hạn", "Tối đa thêm được 6 hình ảnh.");
      return;
    }
    const mockImage = `https://picsum.photos/400/300?random=${Date.now()}`;
    setImages((prev) => [...prev, mockImage]);
    Alert.alert(
      "Thành công",
      type === "camera"
        ? "Đã chụp ảnh chứng từ mới"
        : "Đã thêm ảnh từ thư viện",
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate các trường có dấu * màu đỏ
  const validateForm = (): boolean => {
    // 1. Ngày vào ở *
    if (!moveInDate.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập Ngày vào ở (*)");
      return false;
    }

    // 2. Tổng số thành viên *
    const memberCount = parseInt(countTenant.trim(), 10);
    if (!countTenant.trim() || isNaN(memberCount) || memberCount < 1) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập Tổng số thành viên (*) hợp lệ (tối thiểu 1 người)",
      );
      return false;
    }

    // 3. Tên khách *
    if (!tenantName.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập Tên khách (*)");
      return false;
    }

    // 4. SĐT khách (ZALO) *
    const cleanPhone = tenantPhone.trim().replace(/[\s.-]/g, "");
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone) {
      Alert.alert("Thông báo", "Vui lòng nhập SĐT khách (ZALO) (*)");
      return false;
    }
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert(
        "Thông báo",
        "SĐT khách (ZALO) (*) không đúng định dạng Việt Nam (VD: 0913126822 hoặc +84913126822)",
      );
      return false;
    }

    // 5. Giá thuê *
    const rawPrice = Number(price.replace(/\D/g, ""));
    if (!price.trim() || isNaN(rawPrice) || rawPrice <= 0) {
      Alert.alert("Thông báo", "Vui lòng nhập Giá thuê (*) hợp lệ");
      return false;
    }

    // 6. Chu kỳ thu tiền *
    const cycleNum = parseInt(collectionCycle.trim(), 10);
    if (!collectionCycle.trim() || isNaN(cycleNum) || cycleNum < 1) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập Chu kỳ thu tiền (*) hợp lệ (tối thiểu 1 tháng)",
      );
      return false;
    }

    // 7. Ngày làm hóa đơn (Thu tiền) *
    if (!invoiceDate.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập Ngày làm hóa đơn (Thu tiền) (*)");
      return false;
    }

    // 8. Mẫu hợp đồng *
    if (!contractTemplate.trim()) {
      Alert.alert("Thông báo", "Vui lòng chọn Mẫu hợp đồng (*)");
      return false;
    }

    return true;
  };

  // Submit tạo hợp đồng mới
  const handleSubmitContract = async () => {
    if (!validateForm()) return;
    if (!parseDateParts(moveInDate) || (endDate && !parseDateParts(endDate))) {
      Alert.alert("Thông báo", "Ngày vào ở hoặc ngày kết thúc không hợp lệ. Vui lòng chọn lại từ lịch.");
      return;
    }

    setIsSubmitting(true);
    let createdTenantId: string | null = null;

    try {
      const rawPrice = Number(price.replace(/\D/g, ""));
      const rawDeposit = Number(deposit.replace(/\D/g, "")) || 0;
      const rawCountTenant = parseInt(countTenant, 10) || 1;

      // Hợp đồng bắt buộc có khách thuê. Không nuốt lỗi ở bước tạo khách,
      // vì nếu tiếp tục thì backend sẽ trả về "Tenant id is required".
      if (!roomId) {
        throw new Error("Không xác định được phòng cần lập hợp đồng.");
      }

      const tenantPayload = {
        fullName: tenantName.trim(),
        phone: tenantPhone.trim(),
        // CCCD là trường tùy chọn; không gửi giá trị giả có thể trùng dữ liệu.
        cccd: tenantCccd.trim() || undefined,
        birthday: tenantBirthday ? toBackendDate(tenantBirthday) : undefined,
        gender: tenantGender,
        address: tenantAddress.trim() || undefined,
        job: tenantJob.trim() || undefined,
        role: true,
        typeOfTenant: false,
        temporaryResidence: false,
        informationVerify: false,
      };
      const tenantRes = await tenantService.insertTenant(roomId, tenantPayload);
      const tenantData = tenantRes?.result ?? tenantRes;
      createdTenantId = tenantData?.tenantId || tenantData?.id || null;
      if (!createdTenantId) {
        throw new Error("Không nhận được mã khách thuê từ máy chủ.");
      }

      // 2. Tìm templateId hợp lệ
      let templateIdToUse = selectedTemplateId;
      if (!templateIdToUse && availableTemplates.length > 0) {
        templateIdToUse =
          availableTemplates[0].contractTemplateId || availableTemplates[0].id;
      }
      if (!templateIdToUse) {
        // Fallback lấy lại templates
        try {
          const tRes = await contractService.getTemplates();
          const list = Array.isArray(tRes) ? tRes : tRes?.result || [];
          if (list.length > 0) {
            templateIdToUse = list[0].contractTemplateId || list[0].id;
          }
        } catch {
          // ignore
        }
      }

      // 3. Payload tạo Contract
      const contractPayload: any = {
        roomId: roomId,
        username: user?.username || "admin",
        tenantId: createdTenantId,
        contractTemplateId: templateIdToUse || undefined,
        moveInDate: toBackendDate(moveInDate),
        closeContract: endDate ? toBackendDate(endDate) : undefined,
        leaseTerm: leaseTerm || "12",
        price: rawPrice,
        actualPrice: rawPrice,
        deposit: rawDeposit,
        collectionCycle: collectionCycle,
        description: `Hợp đồng phòng ${roomName}. Số thành viên: ${rawCountTenant}`,
        countTenant: rawCountTenant,
        signContract: "Khách chưa ký",
        language: "VN",
        status: "ACTIVE",
      };

      const res = await contractService.createContract(contractPayload);
      setCreatedContractData({
        ...res,
        roomId,
        roomName,
        price: rawPrice,
        deposit: rawDeposit,
        tenantName: tenantName.trim(),
        tenantPhone: tenantPhone.trim(),
      });

      // Mở modal thông báo thành công (Bottom Sheet)
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert(
        "Lỗi tạo hợp đồng",
        error?.response?.data?.message ||
          error?.message ||
          "Không thể hoàn tất tạo hợp đồng. Vui lòng kiểm tra lại kết nối mạng.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Actions trong thông báo thành công ──
  // 1. Thu tiền tháng đầu tiên
  const handleGoToFirstMonthInvoice = () => {
    setShowSuccessModal(false);
    router.push({
      pathname: "/(home-page)/tab-manage/management-menu/invoices/add",
      params: {
        roomId: roomId,
        roomName: roomName,
        roomPrice: String(createdContractData?.price || price),
        roomDeposit: String(createdContractData?.deposit || deposit),
        tenantName: tenantName,
        tenantPhone: tenantPhone,
        invoiceType: "FIRST_MONTH",
      },
    });
  };

  // 2. Chia sẻ APP khách thuê
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Tải ngay ứng dụng LOZIDO để theo dõi hợp đồng thuê phòng ${roomName}, thanh toán hóa đơn và nhận thông báo từ chủ nhà: https://lozido.vn/download`,
      });
    } catch {
      // ignore
    }
  };

  // 3. Chia sẻ mã kết nối APP khách thuê
  const handleShareConnectCode = () => {
    Alert.alert(
      "Mã kết nối APP khách thuê",
      `Mã kết nối của phòng ${roomName} là: ${roomId.slice(0, 8).toUpperCase()}\n\nKhách thuê nhập mã này trong App LOZIDO để tự động liên kết hợp đồng.`,
      [
        {
          text: "Chia sẻ mã",
          onPress: () => {
            Share.share({
              message: `Mã kết nối phòng ${roomName} trên app LOZIDO: ${roomId.slice(0, 8).toUpperCase()}`,
            });
          },
        },
        { text: "Đóng", style: "cancel" },
      ],
    );
  };

  // 4. Về trang chủ
  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.replace("/(home-page)");
  };

  // 5. Đóng - Lập hợp đồng khác
  const handleCloseAndCreateOther = () => {
    setShowSuccessModal(false);
    router.replace("/(home-page)/tab-manage/quick-actions/contract");
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lập hợp đồng mới</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SECTION 1: Thông tin thời hạn hợp đồng ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>
                Thông tin thời hạn hợp đồng
              </Text>
              <Text style={styles.sectionSubtitle}>
                Thiết lập thời hạn cho hợp đồng mới
              </Text>
            </View>
          </View>

          {/* Thời hạn hợp đồng Dropdown */}
          <Text style={styles.fieldLabel}>Thời hạn hợp đồng</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            activeOpacity={0.7}
            onPress={() => setShowLeasePicker(true)}
          >
            <Text style={styles.dropdownValueText}>
              {leaseTermLabel || "Chọn giá trị"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Row: Ngày vào ở & Ngày kết thúc */}
          <View style={styles.twoColRow}>
            {/* Ngày vào ở */}
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                Ngày vào ở <Text style={styles.requiredStar}>*</Text>
              </Text>
              <CalendarDateField
                value={moveInDate}
                title="Ngày vào ở"
                containerStyle={styles.inputWithIconWrap}
                textStyle={styles.inputFlex}
                onChange={(date) => {
                  setMoveInDate(date);
                  if (leaseTerm) setEndDate(calculateEndDate(date, Number(leaseTerm)));
                }}
              />
            </View>

            {/* Ngày kết thúc */}
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Ngày kết thúc</Text>
              <CalendarDateField value={endDate} title="Ngày kết thúc" containerStyle={styles.inputWithIconWrap} textStyle={styles.inputFlex} onChange={setEndDate} />
            </View>
          </View>
        </View>

        {/* ── SECTION 2: Thông tin khách thuê ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>Thông tin khách thuê</Text>
              <Text style={styles.sectionSubtitle}>
                Quét mã QR thẻ căn cước, khách cũ.
              </Text>
            </View>
          </View>

          {/* 2 Nút thao tác nhanh */}
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Chọn khách",
                  "Chức năng chọn khách cũ từ danh bạ khách thuê.",
                )
              }
            >
              <View style={styles.quickActionIconCircle}>
                <Ionicons name="search" size={16} color={Colors.textPrimary} />
              </View>
              <View style={styles.quickActionTextWrap}>
                <Text style={styles.quickActionTitle}>Chọn khách</Text>
                <Text style={styles.quickActionSub}>
                  Nhập khách cũ / hiện tại
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Quét mã QR",
                  "Mở camera quét nhanh thông tin CCCD gắn chip của khách.",
                )
              }
            >
              <View style={styles.quickActionBadge}>
                <Text style={styles.quickActionBadgeText}>⚡ Nhanh+</Text>
              </View>
              <View style={styles.quickActionIconCircle}>
                <Ionicons
                  name="scan-outline"
                  size={16}
                  color={Colors.textPrimary}
                />
              </View>
              <View style={styles.quickActionTextWrap}>
                <Text style={styles.quickActionTitle}>Nhập từ QR</Text>
                <Text style={styles.quickActionSub}>Nhập nhanh từ QR</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Banner chú ý phòng cọc */}
          {hasReservation && (
            <View style={styles.infoAlertBanner}>
              <Ionicons
                name="information-circle"
                size={20}
                color={Colors.success}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.infoAlertText}>
                Chú ý: phòng đang ở trạng thái đặt cọc. Một số thông tin khách
                và số tiền cọc giữ chỗ... sẽ tự động thêm vào. Bạn có thể chỉnh
                sửa
              </Text>
            </View>
          )}

          {/* Tổng số thành viên */}
          <Text style={styles.fieldLabel}>
            Tổng số thành viên <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputWithBadgeWrap}>
            <TextInput
              style={styles.inputFlex}
              value={countTenant}
              onChangeText={setCountTenant}
              keyboardType="number-pad"
              placeholder="1"
            />
            <View style={styles.innerUnitBadge}>
              <Text style={styles.innerUnitText}>Người</Text>
            </View>
          </View>

          {/* Tên khách & SĐT Zalo */}
          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                Tên khách <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputStandard}
                value={tenantName}
                onChangeText={setTenantName}
                placeholder="Nhập họ tên"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                SĐT khách (ZALO) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputStandard}
                value={tenantPhone}
                onChangeText={setTenantPhone}
                placeholder="0913-126-822"
                placeholderTextColor={Colors.gray400}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Note cam */}
          <Text style={styles.orangeNoteText}>
            * Nhập SĐT ZALO hệ thống sẽ TỰ ĐỘNG gửi hóa đơn hàng tháng cho khách
          </Text>

          {/* Checkbox sử dụng App */}
          <TouchableOpacity
            style={styles.checkboxCard}
            activeOpacity={0.8}
            onPress={() => setUseApp(!useApp)}
          >
            <View
              style={[styles.checkboxBox, useApp && styles.checkboxBoxActive]}
            >
              {useApp && (
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              )}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxTitle}>
                Sử dụng APP - Dành cho khách thuê
              </Text>
              <Text style={styles.checkboxSubtitle}>
                Gửi hóa đơn tự động cho khách, hợp đồng online vv...
              </Text>
            </View>
          </TouchableOpacity>

          {/* Xem thông tin cọc giữ chỗ */}
          {hasReservation && (
            <TouchableOpacity
              style={styles.viewDepositBtn}
              activeOpacity={0.7}
              onPress={() => setShowReservationInfoModal(true)}
            >
              <Text style={styles.viewDepositBtnText}>
                Xem thông tin cọc giữ chỗ
              </Text>
            </TouchableOpacity>
          )}

          {/* Thông tin khác của khách */}
          <TouchableOpacity
            style={styles.otherInfoBtn}
            activeOpacity={0.7}
            onPress={() => setShowOtherTenantInfoModal(true)}
          >
            <Ionicons
              name="expand-outline"
              size={18}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.otherInfoBtnText}>
              Thông tin khác của khách
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── SECTION 3: Thông tin giá trị hợp đồng ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>
                Thông tin giá trị hợp đồng
              </Text>
              <Text style={styles.sectionSubtitle}>
                Thiết lập giá thuê, mẫu hợp đồng
              </Text>
            </View>
          </View>

          {/* Giá thuê & Tiền cọc */}
          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                Giá thuê <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWithBadgeWrap}>
                <TextInput
                  style={styles.inputFlex}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="number-pad"
                  placeholder="300.000"
                />
                <Text style={styles.unitSuffixText}>đ</Text>
              </View>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Tiền cọc hợp đồng</Text>
              <View style={styles.inputWithBadgeWrap}>
                <TextInput
                  style={styles.inputFlex}
                  value={deposit}
                  onChangeText={setDeposit}
                  keyboardType="number-pad"
                  placeholder="300.000"
                />
                <Text style={styles.unitSuffixText}>đ</Text>
              </View>
            </View>
          </View>

          <Text style={styles.orangeNoteText}>
            * CHÚ Ý: Sau khi làm hợp đồng bạn phải lập "Hóa đơn tháng đầu tiên"
            để thu tiền thuê và tiền cọc
          </Text>

          {/* Warning cọc giữ chỗ */}
          {hasReservation && (
            <View style={styles.warningAlertBox}>
              <Ionicons
                name="warning-outline"
                size={22}
                color="#E65100"
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningAlertTitle}>
                  Số tiền cọc giữ chỗ:
                </Text>
                <Text style={styles.warningAlertSubtitle}>
                  Số tiền cọc giữ chỗ khách cọc trước đó là:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {existingReservation?.deposit
                      ? Number(existingReservation.deposit).toLocaleString(
                          "vi-VN",
                        )
                      : deposit}{" "}
                    đ
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Chu kỳ thu tiền & Ngày làm hóa đơn */}
          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                Chu kỳ thu tiền <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWithButtonWrap}>
                <TextInput
                  style={styles.inputCycleFlex}
                  value={collectionCycle}
                  onChangeText={setCollectionCycle}
                  keyboardType="number-pad"
                />
                <View style={styles.innerSmallBadge}>
                  <Text style={styles.innerSmallBadgeText}>tháng</Text>
                </View>
                <TouchableOpacity
                  style={styles.samplePatternBtn}
                  onPress={() => setCollectionCycle("1")}
                >
                  <Text style={styles.samplePatternText}># Mẫu</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>
                Ngày làm hóa đơn <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWithButtonWrap}>
                <TextInput
                  style={styles.inputCycleFlex}
                  value={invoiceDate}
                  onChangeText={setInvoiceDate}
                  placeholder="Ngày thu"
                  placeholderTextColor={Colors.gray400}
                />
                <TouchableOpacity
                  style={styles.samplePatternBtn}
                  onPress={() => setInvoiceDate("1")}
                >
                  <Text style={styles.samplePatternText}># Mẫu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Mẫu hợp đồng */}
          <Text style={styles.fieldLabel}>
            Mẫu hợp đồng <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            activeOpacity={0.7}
            onPress={() => setShowTemplatePicker(true)}
          >
            <Text style={styles.dropdownValueText}>{contractTemplate}</Text>
            {!!contractTemplate && (
              <TouchableOpacity
                onPress={() => setContractTemplate("")}
                style={styles.clearIconBtn}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.gray400}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <Text style={styles.graySmallNote}>
            * Bạn có thể vào{" "}
            <Text style={{ color: "#E65100" }}>"phiên bản máy tính"</Text> để
            chỉnh sửa mẫu văn bản hợp đồng theo ý bạn
          </Text>
        </View>

        {/* ── SECTION 4: Dịch vụ sử dụng cho hợp đồng này ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>
                Dịch vụ sử dụng cho hợp đồng này
              </Text>
              <Text style={styles.sectionSubtitle}>
                Tiền điện, nước, rác, wifi...
              </Text>
            </View>
          </View>

          {/* Service List Card */}
          <View style={styles.serviceListCard}>
            {services.map((svc, idx) => (
              <View
                key={svc.id}
                style={[
                  styles.serviceRowItem,
                  idx < services.length - 1 && styles.serviceRowDivider,
                ]}
              >
                <View>
                  <Text style={styles.serviceItemName}>{svc.name}</Text>
                  <Text style={styles.serviceItemPrice}>
                    {Number(svc.price).toLocaleString("vi-VN")} đ/1 {svc.unit}
                  </Text>
                </View>
                <View style={styles.serviceStatusBadge}>
                  <View style={styles.grayDot} />
                  <Text style={styles.serviceStatusText}>{svc.status}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Nút chỉnh sửa dịch vụ */}
          <TouchableOpacity
            style={styles.editOutlineBtn}
            activeOpacity={0.7}
            onPress={() => setShowServicesModal(true)}
          >
            <Ionicons
              name="pencil-outline"
              size={16}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editOutlineBtnText}>Chỉnh sửa dịch vụ</Text>
          </TouchableOpacity>
        </View>

        {/* ── SECTION 5: Quản lý tài sản (nội thất) ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>
                Quản lý tài sản (nội thất)
              </Text>
              <Text style={styles.sectionSubtitle}>
                Bạn có muốn thêm bớt các tài sản phòng sử dụng?
              </Text>
            </View>
          </View>

          {assets.length === 0 ? (
            <View style={styles.emptyAssetBox}>
              <View style={styles.assetIconsRow}>
                <View
                  style={[
                    styles.assetIconCircle,
                    { backgroundColor: "#FFEBEE" },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>🛋️</Text>
                </View>
                <View
                  style={[
                    styles.assetIconCircle,
                    { backgroundColor: "#E3F2FD" },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>🗑️</Text>
                </View>
                <View
                  style={[
                    styles.assetIconCircle,
                    { backgroundColor: "#EDE7F6" },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>🪑</Text>
                </View>
              </View>
              <Text style={styles.emptyAssetText}>
                Chưa có tài sản nào để quản lý...
              </Text>
            </View>
          ) : (
            <View style={styles.serviceListCard}>
              {assets.map((ast, idx) => (
                <View
                  key={ast.id}
                  style={[
                    styles.serviceRowItem,
                    idx < assets.length - 1 && styles.serviceRowDivider,
                  ]}
                >
                  <Text style={styles.serviceItemName}>{ast.name}</Text>
                  <Text style={styles.serviceItemPrice}>
                    SL: {ast.quantity}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Nút chỉnh sửa tài sản */}
          <TouchableOpacity
            style={styles.editOutlineBtn}
            activeOpacity={0.7}
            onPress={() => setShowAssetsModal(true)}
          >
            <Ionicons
              name="pencil-outline"
              size={16}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editOutlineBtnText}>Chỉnh sửa tài sản</Text>
          </TouchableOpacity>
        </View>

        {/* ── SECTION 6: Hình ảnh, file chứng từ ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>Hình ảnh, file chứng từ</Text>
              <Text style={styles.sectionSubtitle}>
                Hình ảnh CCCD, hình ảnh hợp đồng
              </Text>
            </View>
          </View>

          <View style={styles.uploadIllustrationBox}>
            <View style={styles.uploadDocIconWrap}>
              <Ionicons
                name="document-text-outline"
                size={36}
                color={Colors.success}
              />
              <View style={styles.uploadCloudBadge}>
                <Ionicons
                  name="cloud-upload"
                  size={16}
                  color={Colors.success}
                />
              </View>
            </View>
            <Text style={styles.maxImagesText}>
              Tối đa thêm được 6 hình ảnh
            </Text>
            <View style={styles.uploadButtonsRow}>
              <TouchableOpacity
                style={styles.uploadRoundBtn}
                onPress={() => handleAddImage("camera")}
              >
                <Ionicons
                  name="camera-outline"
                  size={20}
                  color={Colors.textPrimary}
                />
                <Text style={styles.uploadRoundBtnText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadRoundBtn}
                onPress={() => handleAddImage("library")}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.textPrimary}
                />
                <Text style={styles.uploadRoundBtnText}>Thêm từ thư viện</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Thumbnail preview images */}
          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((img, i) => (
                <View key={i} style={styles.imageThumbWrap}>
                  <Image source={{ uri: img }} style={styles.imageThumb} />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => handleRemoveImage(i)}
                  >
                    <Ionicons name="close" size={14} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── SECTION 7: Môi giới ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>#</Text>
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>Môi giới</Text>
              <Text style={styles.sectionSubtitle}>
                Chọn môi giới thực hiện giới thiệu hợp đồng
              </Text>
            </View>
          </View>

          <View style={styles.warningAlertBox}>
            <Ionicons
              name="warning-outline"
              size={20}
              color="#E65100"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.warningAlertSubtitle}>
              Để thêm môi giới vui lòng truy cập phiên bản máy tính
            </Text>
          </View>

          {/* Môi giới & Hoa hồng */}
          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Môi giới</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                activeOpacity={0.7}
                onPress={() => setShowBrokerPicker(true)}
              >
                <Text style={styles.dropdownValueText}>
                  {broker || "Chọn giá trị"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={Colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Hoa hồng</Text>
              <View style={styles.inputWithIconWrap}>
                <TextInput
                  style={styles.inputFlex}
                  value={brokerCommissionRate}
                  onChangeText={setBrokerCommissionRate}
                  placeholder="0%"
                />
                {!!brokerCommissionRate && (
                  <TouchableOpacity
                    onPress={() => setBrokerCommissionRate("")}
                    style={styles.clearIconBtn}
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={Colors.gray400}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Số tiền hoa hồng */}
          <Text style={styles.fieldLabel}>Số tiền hoa hồng</Text>
          <View style={styles.inputWithBadgeWrap}>
            <TextInput
              style={styles.inputFlex}
              value={brokerCommissionAmount}
              onChangeText={setBrokerCommissionAmount}
              keyboardType="number-pad"
              placeholder="0"
            />
            <Text style={styles.unitSuffixText}>đ</Text>
          </View>

          {/* Tạo phiếu chi Switch */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Tạo phiếu chi</Text>
              <Text style={styles.switchSubtitle}>
                Tạo phiếu chi tiền hoa hồng cho môi giới
              </Text>
            </View>
            <Switch
              value={createExpenseReceipt}
              onValueChange={setCreateExpenseReceipt}
              trackColor={{ false: Colors.gray300, true: Colors.success }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FIXED BOTTOM BAR ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom:
              Platform.OS === "ios" ? insets.bottom + 8 : Spacing.md,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.88}
          onPress={handleSubmitContract}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name="add"
                size={22}
                color={Colors.white}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.submitBtnText}>Thêm hợp đồng mới</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── SUCCESS BOTTOM SHEET MODAL (Theo đúng hình mẫu) ── */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.successModalBackdrop}>
          <View
            style={[
              styles.successSheetContainer,
              {
                paddingBottom:
                  Platform.OS === "ios" ? insets.bottom + 12 : Spacing.lg,
              },
            ]}
          >
            {/* Header Icon Checkmark tròn xanh lá */}
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color={Colors.white} />
            </View>

            {/* Tiêu đề chúc mừng màu xanh lá */}
            <Text style={styles.successHeaderTitle}>
              Chúc mừng bạn đã thêm hợp đồng thành công!
            </Text>

            {/* Menu List tùy chọn hành động */}
            <View style={styles.successActionListCard}>
              {/* Option 1: Thu tiền tháng đầu tiên */}
              <TouchableOpacity
                style={styles.successActionItem}
                activeOpacity={0.7}
                onPress={handleGoToFirstMonthInvoice}
              >
                <View style={styles.successActionIconWrap}>
                  <Text style={styles.dollarIconText}>$</Text>
                </View>
                <View style={styles.successActionTextWrap}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text style={styles.successActionTitleGreen}>
                      Thu tiền tháng đầu tiên
                    </Text>
                    <View style={styles.suggestBadge}>
                      <Text style={styles.suggestBadgeText}>Đề xuất</Text>
                    </View>
                  </View>
                  <Text style={styles.successActionSubtitle}>
                    Thu tiền tháng đầu tiên & tiền cọc (nếu có)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.successItemDivider} />

              {/* Option 2: Chia sẻ APP khách thuê */}
              <TouchableOpacity
                style={styles.successActionItem}
                activeOpacity={0.7}
                onPress={handleShareApp}
              >
                <View style={styles.successActionIconWrap}>
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color={Colors.textPrimary}
                  />
                </View>
                <View style={styles.successActionTextWrap}>
                  <Text style={styles.successActionTitleBold}>
                    Chia sẻ APP khách thuê
                  </Text>
                  <Text style={styles.successActionSubtitle}>
                    LOZIDO - tìm trọ, căn hộ, vé xe, việc làm & kết nối với chủ
                    nhà
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.successItemDivider} />

              {/* Option 3: Chia sẻ mã kết nối APP khách thuê */}
              <TouchableOpacity
                style={styles.successActionItem}
                activeOpacity={0.7}
                onPress={handleShareConnectCode}
              >
                <View style={styles.successActionIconWrap}>
                  <Ionicons
                    name="scan-outline"
                    size={20}
                    color={Colors.textPrimary}
                  />
                </View>
                <View style={styles.successActionTextWrap}>
                  <Text style={styles.successActionTitleBold}>
                    Chia sẻ mã kết nối APP khách thuê
                  </Text>
                  <Text style={styles.successActionSubtitle}>
                    Chia sẻ mã kết nối, giúp khách thuê kết nối với bạn & nhận
                    được hóa đơn tự động, ký hợp đồng online vv...
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.successItemDivider} />

              {/* Option 4: Về trang chủ */}
              <TouchableOpacity
                style={styles.successActionItem}
                activeOpacity={0.7}
                onPress={handleGoHome}
              >
                <View style={styles.successActionIconWrap}>
                  <Ionicons
                    name="home-outline"
                    size={20}
                    color={Colors.textPrimary}
                  />
                </View>
                <View style={styles.successActionTextWrap}>
                  <Text style={styles.successActionTitleBold}>
                    Về trang chủ
                  </Text>
                  <Text style={styles.successActionSubtitle}>
                    Về trang chủ để tiếp tục quản lý
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Button màu cam: Đóng - Lập hợp đồng khác */}
            <TouchableOpacity
              style={styles.orangeCloseBtn}
              activeOpacity={0.88}
              onPress={handleCloseAndCreateOther}
            >
              <Text style={styles.orangeCloseBtnText}>
                Đóng - Lập hợp đồng khác
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── OTHER MODALS ── */}

      {/* 1. Modal Thời hạn hợp đồng */}
      <Modal visible={showLeasePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn thời hạn hợp đồng</Text>
              <TouchableOpacity onPress={() => setShowLeasePicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {[
              { months: 1, label: "1 tháng" },
              { months: 3, label: "3 tháng" },
              { months: 6, label: "6 tháng" },
              { months: 12, label: "12 tháng (1 năm)" },
              { months: 24, label: "24 tháng (2 năm)" },
            ].map((item) => (
              <TouchableOpacity
                key={item.months}
                style={styles.modalOptionItem}
                onPress={() => handleSelectLeaseTerm(item.months, item.label)}
              >
                <Text style={styles.modalOptionText}>{item.label}</Text>
                {leaseTerm === String(item.months) && (
                  <Ionicons name="checkmark" size={20} color={Colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 2. Modal Thông tin cọc giữ chỗ */}
      <Modal
        visible={showReservationInfoModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết cọc giữ chỗ</Text>
              <TouchableOpacity
                onPress={() => setShowReservationInfoModal(false)}
              >
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBodyTextWrap}>
              <Text style={styles.modalRowText}>
                <Text style={{ fontWeight: "bold" }}>Người cọc: </Text>
                {existingReservation?.nameTenant || tenantName}
              </Text>
              <Text style={styles.modalRowText}>
                <Text style={{ fontWeight: "bold" }}>SĐT: </Text>
                {existingReservation?.phoneTenant || tenantPhone}
              </Text>
              <Text style={styles.modalRowText}>
                <Text style={{ fontWeight: "bold" }}>Tiền cọc: </Text>
                {Number(existingReservation?.deposit || deposit).toLocaleString(
                  "vi-VN",
                )}{" "}
                đ
              </Text>
              <Text style={styles.modalRowText}>
                <Text style={{ fontWeight: "bold" }}>Ngày cọc: </Text>
                {existingReservation?.createDate || "Hôm nay"}
              </Text>
              <Text style={styles.modalRowText}>
                <Text style={{ fontWeight: "bold" }}>Ghi chú cọc: </Text>
                {existingReservation?.note || "Không có ghi chú"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowReservationInfoModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Modal Thông tin khác của khách */}
      <Modal
        visible={showOtherTenantInfoModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin bổ sung của khách</Text>
              <TouchableOpacity
                onPress={() => setShowOtherTenantInfoModal(false)}
              >
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 360 }}>
              <Text style={styles.fieldLabel}>Số CCCD/CMND</Text>
              <TextInput
                style={styles.textInputStandard}
                value={tenantCccd}
                onChangeText={setTenantCccd}
                placeholder="Nhập số CCCD"
                keyboardType="number-pad"
              />

              <Text style={styles.fieldLabel}>Ngày sinh (DD/MM/YYYY)</Text>
              <CalendarDateField value={tenantBirthday} title="Ngày sinh" containerStyle={styles.inputWithIconWrap} textStyle={styles.inputFlex} onChange={setTenantBirthday} />

              <Text style={styles.fieldLabel}>Giới tính</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderChip,
                    tenantGender === "MALE" && styles.genderChipActive,
                  ]}
                  onPress={() => setTenantGender("MALE")}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      tenantGender === "MALE" && styles.genderChipTextActive,
                    ]}
                  >
                    Nam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderChip,
                    tenantGender === "FEMALE" && styles.genderChipActive,
                  ]}
                  onPress={() => setTenantGender("FEMALE")}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      tenantGender === "FEMALE" && styles.genderChipTextActive,
                    ]}
                  >
                    Nữ
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Địa chỉ thường trú</Text>
              <TextInput
                style={styles.textInputStandard}
                value={tenantAddress}
                onChangeText={setTenantAddress}
                placeholder="Xã/Phường, Huyện/Quận, Tỉnh/TP"
              />

              <Text style={styles.fieldLabel}>Nghề nghiệp</Text>
              <TextInput
                style={styles.textInputStandard}
                value={tenantJob}
                onChangeText={setTenantJob}
                placeholder="Sinh viên / Nhân viên văn phòng..."
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowOtherTenantInfoModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Lưu thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Modal Mẫu hợp đồng */}
      <Modal visible={showTemplatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mẫu hợp đồng</Text>
              <TouchableOpacity onPress={() => setShowTemplatePicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {(availableTemplates.length > 0
              ? availableTemplates.map((t) => ({
                  id: t.contractTemplateId || t.id,
                  name: t.templateName || t.name,
                }))
              : [
                  { id: "1", name: "Mẫu mặc định" },
                  { id: "2", name: "Mẫu hợp đồng thuê phòng trọ ngắn hạn" },
                  { id: "3", name: "Mẫu hợp đồng thuê nhà nguyên căn" },
                  { id: "4", name: "Mẫu hợp đồng phòng cao cấp (Studio)" },
                ]
            ).map((tpl) => (
              <TouchableOpacity
                key={tpl.id}
                style={styles.modalOptionItem}
                onPress={() => {
                  setSelectedTemplateId(tpl.id);
                  setContractTemplate(tpl.name);
                  setShowTemplatePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{tpl.name}</Text>
                {(selectedTemplateId === tpl.id ||
                  contractTemplate === tpl.name) && (
                  <Ionicons name="checkmark" size={20} color={Colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 5. Modal Chỉnh sửa dịch vụ */}
      <Modal visible={showServicesModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa dịch vụ phòng</Text>
              <TouchableOpacity onPress={() => setShowServicesModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 350 }}>
              {services.map((s, idx) => (
                <View key={s.id} style={styles.serviceEditItem}>
                  <Text style={styles.serviceItemName}>{s.name}</Text>
                  <View style={styles.twoColRow}>
                    <TextInput
                      style={[
                        styles.textInputStandard,
                        { flex: 1, marginRight: 8 },
                      ]}
                      value={String(s.price)}
                      onChangeText={(val) => {
                        const updated = [...services];
                        updated[idx].price = Number(val.replace(/\D/g, ""));
                        setServices(updated);
                      }}
                      keyboardType="number-pad"
                    />
                    <TextInput
                      style={[styles.textInputStandard, { width: 90 }]}
                      value={s.unit}
                      onChangeText={(val) => {
                        const updated = [...services];
                        updated[idx].unit = val;
                        setServices(updated);
                      }}
                      placeholder="Đơn vị"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowServicesModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. Modal Chỉnh sửa tài sản */}
      <Modal visible={showAssetsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quản lý tài sản phòng</Text>
              <TouchableOpacity onPress={() => setShowAssetsModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.editOutlineBtn, { marginBottom: 12 }]}
              onPress={() => {
                setAssets((prev) => [
                  ...prev,
                  { id: String(Date.now()), name: "Giường nệm", quantity: 1 },
                ]);
              }}
            >
              <Ionicons name="add" size={18} color={Colors.textPrimary} />
              <Text style={styles.editOutlineBtnText}>+ Thêm tài sản</Text>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 300 }}>
              {assets.map((ast, idx) => (
                <View key={ast.id} style={styles.serviceEditItem}>
                  <View style={styles.twoColRow}>
                    <TextInput
                      style={[
                        styles.textInputStandard,
                        { flex: 1, marginRight: 8 },
                      ]}
                      value={ast.name}
                      onChangeText={(val) => {
                        const copy = [...assets];
                        copy[idx].name = val;
                        setAssets(copy);
                      }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setAssets(assets.filter((_, i) => i !== idx))
                      }
                      style={styles.clearIconBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={Colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowAssetsModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. Modal Chọn môi giới */}
      <Modal visible={showBrokerPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn người môi giới</Text>
              <TouchableOpacity onPress={() => setShowBrokerPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {[
              "Không có môi giới",
              "Nguyễn Văn A (Môi giới 1)",
              "Trần Thị B (Môi giới 2)",
            ].map((brk) => (
              <TouchableOpacity
                key={brk}
                style={styles.modalOptionItem}
                onPress={() => {
                  setBroker(brk === "Không có môi giới" ? "" : brk);
                  setShowBrokerPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{brk}</Text>
                {broker === brk && (
                  <Ionicons name="checkmark" size={20} color={Colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },

  /* ── SECTION CARD ── */
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2b7ed7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  iconBadgeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  /* ── FIELDS & INPUTS ── */
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  requiredStar: {
    color: "#EF4444",
  },
  dropdownInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  dropdownValueText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  twoColRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  colHalf: {
    flex: 1,
  },
  textInputStandard: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  inputWithIconWrap: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  inputWithBadgeWrap: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  inputWithButtonWrap: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingLeft: Spacing.sm,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  inputFlex: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    height: "100%",
  },
  inputCycleFlex: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    height: "100%",
    paddingHorizontal: 4,
  },
  clearIconBtn: {
    padding: 4,
  },
  rightIcon: {
    marginLeft: 6,
  },
  innerUnitBadge: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  innerUnitText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  innerSmallBadge: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  innerSmallBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  samplePatternBtn: {
    backgroundColor: "#20a9e722",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  samplePatternText: {
    fontSize: FontSizes.xs,
    color: "#2b7ed7",
    fontWeight: "bold",
  },
  unitSuffixText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  orangeNoteText: {
    fontSize: FontSizes.xs,
    color: "#E65100",
    marginTop: 6,
    lineHeight: 16,
  },
  graySmallNote: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  /* ── SECTION 2 SPECIFICS ── */
  quickActionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20a9e722",
    borderWidth: 1,
    borderColor: "#20a9e722",
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    position: "relative",
  },
  quickActionBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: "#FEF08A",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  quickActionBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#854D0E",
  },
  quickActionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickActionTextWrap: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  quickActionSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  infoAlertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b7ed7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  infoAlertText: {
    flex: 1,
    fontSize: FontSizes.xs,
    color: "#166534",
    lineHeight: 16,
  },
  checkboxCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20a9e722",
    borderWidth: 1,
    borderColor: "#20a9e722",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  checkboxBoxActive: {
    backgroundColor: "#2b7ed7",
    borderColor: "#2b7ed7",
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: "#0284C7",
  },
  checkboxSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  viewDepositBtn: {
    backgroundColor: "#2b7ed7",
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  viewDepositBtnText: {
    color: "#2b7ed7",
    fontSize: FontSizes.sm,
    fontWeight: "bold",
  },
  otherInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    marginTop: Spacing.sm,
  },
  otherInfoBtnText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },

  /* ── SECTION 3 SPECIFICS ── */
  warningAlertBox: {
    flexDirection: "row",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    alignItems: "center",
  },
  warningAlertTitle: {
    fontSize: FontSizes.xs,
    fontWeight: "bold",
    color: "#C2410C",
  },
  warningAlertSubtitle: {
    fontSize: FontSizes.xs,
    color: "#C2410C",
    marginTop: 1,
  },

  /* ── SECTION 4 SPECIFICS ── */
  serviceListCard: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
  },
  serviceRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  serviceRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  serviceItemName: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  serviceItemPrice: {
    fontSize: FontSizes.base,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  serviceStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  grayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray400,
    marginRight: 4,
  },
  serviceStatusText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  editOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    marginTop: Spacing.md,
  },
  editOutlineBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  /* ── SECTION 5 SPECIFICS ── */
  emptyAssetBox: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  assetIconsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  assetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyAssetText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  /* ── SECTION 6 SPECIFICS ── */
  uploadIllustrationBox: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  uploadDocIconWrap: {
    position: "relative",
    marginBottom: 8,
  },
  uploadCloudBadge: {
    position: "absolute",
    bottom: -4,
    right: -8,
  },
  maxImagesText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  uploadRoundBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    gap: 6,
  },
  uploadRoundBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  imageThumbWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  imageThumb: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── SECTION 7 SPECIFICS ── */
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.base,
  },
  switchTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* ── FIXED BOTTOM BAR ── */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.lg,
  },
  submitBtn: {
    backgroundColor: "#2b7ed7",
    height: 48,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: "bold",
  },

  /* ── SUCCESS BOTTOM SHEET MODAL ── */
  successModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  successSheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    alignItems: "center",
    ...Shadows.lg,
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  successHeaderTitle: {
    fontSize: FontSizes.base,
    fontWeight: "bold",
    color: "#2b7ed7",
    textAlign: "center",
    marginBottom: Spacing.base,
  },
  successActionListCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  successActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  successActionIconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  dollarIconText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  successActionTextWrap: {
    flex: 1,
  },
  titleWithBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  successActionTitleGreen: {
    fontSize: FontSizes.base,
    fontWeight: "bold",
    color: "#2b7ed7",
  },
  successActionTitleBold: {
    fontSize: FontSizes.base,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  suggestBadge: {
    backgroundColor: "#EA580C",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  suggestBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  successActionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  successItemDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: Spacing.base,
  },
  orangeCloseBtn: {
    width: "100%",
    backgroundColor: "#EA580C",
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  orangeCloseBtnText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: "bold",
  },

  /* ── STANDARD MODALS ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.base,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  modalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalOptionText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  modalBodyTextWrap: {
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  modalRowText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    backgroundColor: "#2b7ed7",
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: Spacing.base,
  },
  modalCloseBtnText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: FontSizes.base,
  },
  genderRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: 4,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray300,
    alignItems: "center",
  },
  genderChipActive: {
    backgroundColor: "#2b7ed7",
    borderColor: "#2b7ed7",
  },
  genderChipText: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  genderChipTextActive: {
    color: Colors.white,
  },
  serviceEditItem: {
    marginBottom: Spacing.sm,
  },
});
