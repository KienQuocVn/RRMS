/**
 * FinanceSummaryScreen - Thu / chi & Tổng kết
 * Quản lý và thống kê các khoản thu, chi theo ngày và theo tháng
 * Gọi API backend thực tế đồng bộ hoàn toàn với Frontend Web (NavContentAdmin/IncomeSummary)
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { financeService } from "@/services/api/finance.service";

interface TransactionItem {
  id: string;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string; // DD/MM/YYYY
  creatorName: string;
  amount: number;
  isIncome: boolean;
  paymentMethod: string;
  source: string;
}

interface DateGroup {
  dayNumber: string; // "01"
  dayOfWeek: string; // "Thứ năm"
  monthYear: string; // "Tháng 10/2026"
  dateKey: string;
  totalAmount: number;
  items: TransactionItem[];
}

export default function FinanceSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Mặc định tháng 10 năm 2026 (hoặc tháng hiện tại)
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [monthModalVisible, setMonthModalVisible] = useState<boolean>(false);

  // Tất cả giao dịch thật từ API
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Dữ liệu tổng hợp tính từ giao dịch thật của tháng đang chọn
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
  });

  // Dữ liệu nhóm theo ngày của tháng đang chọn
  const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);

  // Tổng kết từ API (khi không có data local để tính)
  const [apiSummary, setApiSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
  });

  // Bóc tách mảng dữ liệu an toàn giống utils/apiAdapters.js của Frontend Web
  const parseApiArray = (response: any): any[] => {
    if (!response) return [];
    // Ưu tiên page items (pagination)
    if (Array.isArray(response?.result?.items)) return response.result.items;
    if (Array.isArray(response?.result?.content))
      return response.result.content;
    if (Array.isArray(response?.result)) return response.result;
    if (Array.isArray(response?.data?.result?.items))
      return response.data.result.items;
    if (Array.isArray(response?.data?.result)) return response.data.result;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  };

  const parseSummaryFromApi = (response: any) => {
    const payload =
      response?.result ?? response?.data?.result ?? response?.data ?? response;
    if (!payload || typeof payload !== "object") {
      return { totalIncome: 0, totalExpense: 0, profit: 0 };
    }
    return {
      totalIncome: Number(payload.totalIncome || 0),
      totalExpense: Number(payload.totalExpense || 0),
      profit: Number(payload.profit || 0),
    };
  };

  // Xử lý và lọc giao dịch theo tháng/năm — giống matchesSelectedPeriod + displaySummary của web
  const processTransactions = useCallback(
    (
      transactions: any[],
      paymentList: any[],
      month: number,
      year: number,
    ) => {
      // Lọc theo tháng/năm (giống matchesSelectedPeriod với reportScope='month')
      const periodTransactions = transactions.filter((t) => {
        if (!t.transactionDate) return false;
        const d = new Date(t.transactionDate);
        if (isNaN(d.getTime())) return false;
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      // Chuyển đổi sang TransactionItem chuẩn
      const parsedItems: TransactionItem[] = periodTransactions.map((t, idx) => {
        // transactionType===true → Thu, false → Chi (giống web)
        const isIncome = t.transactionType === true;
        const amt = Math.abs(Number(t.amount) || 0);
        const rawDate = t.transactionDate;
        const dateObj = new Date(rawDate);
        const d = String(dateObj.getDate()).padStart(2, "0");
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const y = dateObj.getFullYear();

        // Phương thức thanh toán: ưu tiên từ transaction, fallback danh sách payments
        let paymentMethodName = t.payment?.paymentName || t.paymentName || "";
        if (!paymentMethodName && paymentList.length > 0) {
          paymentMethodName = paymentList[0]?.paymentName || "Tiền mặt";
        }
        if (!paymentMethodName) paymentMethodName = "Tiền mặt";

        return {
          id: t.transactionId?.toString() || `trans-${idx}`,
          category:
            t.category || (isIncome ? "Thu tiền hàng tháng" : "Chi phí khác"),
          description:
            t.paymentDescription ||
            (isIncome ? "Khoản thu hệ thống" : "Khoản chi hệ thống"),
          date: rawDate,
          dateFormatted: `${d}/${m}/${y}`,
          // Người tạo: payerName (giống field 'Người thanh toán / nhận' của web)
          creatorName: t.payerName || user?.fullName || "",
          amount: amt,
          isIncome,
          paymentMethod: paymentMethodName,
          source: t.invoice ? "Hệ thống tạo" : "Người dùng tạo",
        };
      });

      // Tính summary từ visibleTransactions giống web (displaySummary)
      // Web: transactions.length === 0 ? summary (API) : displaySummary (local)
      if (parsedItems.length > 0) {
        const totalIncome = parsedItems
          .filter((item) => item.isIncome)
          .reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = parsedItems
          .filter((item) => !item.isIncome)
          .reduce((sum, item) => sum + item.amount, 0);
        setSummary({
          totalIncome,
          totalExpense,
          profit: totalIncome - totalExpense,
        });
      }
      // Nếu không có giao dịch trong tháng → giữ apiSummary (set từ fetchData)

      // Nhóm theo ngày (mới nhất trước)
      setDateGroups(groupTransactionsByDate(parsedItems));
    },
    [user?.fullName],
  );

  // Tải dữ liệu thật từ Backend API
  const fetchData = useCallback(async () => {
    const username = user?.username;
    if (!username) {
      setIsLoading(false);
      setIsRefreshing(false);
      setAllTransactions([]);
      setDateGroups([]);
      return;
    }

    try {
      // Gọi đồng thời 3 API giống trang web /quanlytro/:motelId/thu-chi-tong-ket
      const [transRes, paymentsRes, summaryRes] = await Promise.allSettled([
        financeService.getTransactionsByUsername(username, {
          size: 200,
          sortBy: "transactionDate",
          sortDirection: "DESC",
        }),
        financeService.getPaymentList(),
        financeService.getTransactionSummary(username),
      ]);

      // 1. Parse danh sách phương thức thanh toán
      let paymentList: any[] = [];
      if (paymentsRes.status === "fulfilled" && paymentsRes.value) {
        paymentList = parseApiArray(paymentsRes.value);
        setPayments(paymentList);
      }

      // 2. Parse tổng kết từ API (fallback khi không có data local)
      if (summaryRes.status === "fulfilled" && summaryRes.value) {
        setApiSummary(parseSummaryFromApi(summaryRes.value));
      }

      // 3. Parse danh sách giao dịch thật
      let transList: any[] = [];
      if (transRes.status === "fulfilled" && transRes.value) {
        transList = parseApiArray(transRes.value);
        setAllTransactions(transList);
      }

      // 4. Xử lý dữ liệu thật theo tháng/năm đã chọn
      processTransactions(transList, paymentList, selectedMonth, selectedYear);
    } catch (error) {
      console.warn("Lỗi khi tải dữ liệu thu chi từ backend:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.username, selectedMonth, selectedYear, processTransactions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Khi thay đổi tháng chọn
  const handleSelectMonth = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setMonthModalVisible(false);
    processTransactions(allTransactions, payments, month, year);
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
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
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thu / chi & Tổng kết</Text>

        <TouchableOpacity
          style={styles.settingsBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Cài đặt"
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color="#2563EB"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.settingsBtnText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* ── Month & Filter Bar ── */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Bộ lọc"
        >
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>1</Text>
          </View>
          <MaterialCommunityIcons
            name="filter-variant"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthDropdown}
          onPress={() => setMonthModalVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn tháng"
        >
          <Text style={styles.monthDropdownText}>
            Tháng {selectedMonth}, {selectedYear}
          </Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Content ScrollView ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.success]}
            tintColor={Colors.success}
          />
        }
      >
        {/* ── Summary Overview Card ── */}
        {/* summaryToDisplay: giống web — dùng apiSummary khi chưa có data local, dùng summary khi đã tính từ filtered transactions */}
        {(() => {
          const summaryToDisplay =
            allTransactions.length === 0 ? apiSummary : summary;
          return (
            <View style={styles.summaryCard}>
              <View style={styles.summaryCol}>
                <View style={styles.summaryLabelRow}>
                  <FontAwesome5
                    name="dollar-sign"
                    size={13}
                    color="#4bcffa"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.summaryLabel}>Khoản thu</Text>
                </View>
                <Text style={styles.incomeValue}>
                  + {formatCurrency(summaryToDisplay.totalIncome)} đ
                </Text>
              </View>

              <View style={styles.summaryCol}>
                <View style={styles.summaryLabelRow}>
                  <Text style={styles.summaryLabel}>Khoản chi</Text>
                  <MaterialCommunityIcons
                    name="arrow-collapse-right"
                    size={16}
                    color="#F97316"
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <Text style={styles.expenseValue}>
                  - {formatCurrency(summaryToDisplay.totalExpense)} đ
                </Text>
              </View>

              <View style={styles.summaryCol}>
                <View style={styles.summaryLabelRow}>
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={16}
                    color="#4bcffa"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.summaryLabel}>Tổng kết</Text>
                </View>
                <Text style={styles.profitValue}>
                  {formatCurrency(summaryToDisplay.profit)} đ
                </Text>
              </View>
            </View>
          );
        })()}

        {/* ── Date Group Sections ── */}
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.success} />
            <Text style={styles.loadingText}>Đang tải dữ liệu thu chi...</Text>
          </View>
        ) : dateGroups.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="cube-outline" size={60} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Không có dữ liệu!</Text>
            <Text style={styles.emptyDesc}>
              Không có phiếu thu chi nào trong Tháng {selectedMonth}/
              {selectedYear}.
            </Text>
          </View>
        ) : (
          dateGroups.map((group) => (
            <View key={group.dateKey} style={styles.dateGroupContainer}>
              {/* Group Header */}
              <View style={styles.dateGroupHeader}>
                <View style={styles.dateLeft}>
                  {/* Vòng tròn số ngày */}
                  <View style={styles.dayCircle}>
                    <Text style={styles.dayCircleText}>{group.dayNumber}</Text>
                  </View>
                  <View style={styles.dateTextCol}>
                    <Text style={styles.dayOfWeekText}>{group.dayOfWeek}</Text>
                    <Text style={styles.monthYearText}>{group.monthYear}</Text>
                  </View>
                </View>

                {/* Tổng cộng ngày */}
                <View style={styles.dateRight}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(group.totalAmount)} đ
                  </Text>
                </View>
              </View>

              {/* Danh sách các giao dịch trong ngày */}
              <View style={styles.itemsList}>
                {group.items.map((item, itemIdx) => (
                  <View
                    key={item.id}
                    style={[
                      styles.transactionItem,
                      itemIdx < group.items.length - 1 &&
                        styles.itemBorderBottom,
                    ]}
                  >
                    {/* Icon Tag */}
                    <View style={styles.tagIconBox}>
                      <Ionicons name="pricetag" size={20} color="#111827" />
                    </View>

                    {/* Middle Info */}
                    <View style={styles.itemCenterCol}>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View style={styles.itemMetaRow}>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.metaText}>
                            {item.dateFormatted}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="person-outline"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.metaText}>
                            {item.creatorName}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right Info: Amount & Badges */}
                    <View style={styles.itemRightCol}>
                      <Text
                        style={[
                          styles.itemAmount,
                          item.isIncome
                            ? styles.incomeAmountColor
                            : styles.expenseAmountColor,
                        ]}
                      >
                        {item.isIncome ? "+" : "-"}
                        {formatCurrency(item.amount)} đ
                      </Text>

                      <View style={styles.badgesCol}>
                        <View style={styles.paymentMethodBadge}>
                          <Text style={styles.paymentMethodText}>
                            {item.paymentMethod}
                          </Text>
                        </View>
                        <View style={styles.sourceBadge}>
                          <Text style={styles.sourceBadgeText}>
                            {item.source}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Floating Action Button (FAB) ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        accessibilityLabel="Thêm giao dịch thu chi mới"
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>

      {/* ── Modal chọn tháng ── */}
      <Modal
        visible={monthModalVisible}
        transparent={true}
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
              Chọn tháng báo cáo ({selectedYear})
            </Text>
            <View style={styles.monthsGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <TouchableOpacity
                  key={`month-${m}`}
                  style={[
                    styles.monthItem,
                    selectedMonth === m && styles.selectedMonthItem,
                  ]}
                  onPress={() => handleSelectMonth(m, selectedYear)}
                >
                  <Text
                    style={[
                      styles.monthItemText,
                      selectedMonth === m && styles.selectedMonthItemText,
                    ]}
                  >
                    Tháng {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Helpers ──

function formatCurrency(val: number): string {
  if (!val && val !== 0) return "0";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getDayOfWeek(date: Date): string {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return days[date.getDay()];
}

function groupTransactionsByDate(items: TransactionItem[]): DateGroup[] {
  const groupsMap: { [key: string]: TransactionItem[] } = {};

  items.forEach((item) => {
    const key = item.date;
    if (!groupsMap[key]) {
      groupsMap[key] = [];
    }
    groupsMap[key].push(item);
  });

  const sortedDates = Object.keys(groupsMap).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return sortedDates.map((dateKey) => {
    const groupItems = groupsMap[dateKey];
    const d = new Date(dateKey);
    const dayNum = String(d.getDate()).padStart(2, "0");
    const dayOfWeek = getDayOfWeek(d);
    const monthYear = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
    const total = groupItems.reduce(
      (sum, item) => (item.isIncome ? sum + item.amount : sum - item.amount),
      0,
    );

    return {
      dayNumber: dayNum,
      dayOfWeek: dayOfWeek,
      monthYear: monthYear,
      dateKey: dateKey,
      totalAmount: total,
      items: groupItems,
    };
  });
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  settingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: "#EFF6FF",
  },
  settingsBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: "#2563EB",
  },

  // Filter Bar
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EA580C",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeights.bold,
  },
  monthDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  monthDropdownText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 90,
  },

  // Summary Card
  summaryCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.sm,
  },
  summaryCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: "#EA580C",
  },
  profitValue: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: "#4bcffa",
  },

  // Date Group
  dateGroupContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    ...Shadows.sm,
  },
  dateGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  dayCircleText: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  dateTextCol: {
    justifyContent: "center",
  },
  dayOfWeekText: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  monthYearText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateRight: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Transactions List
  itemsList: {
    backgroundColor: Colors.white,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tagIconBox: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  itemCenterCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#4B5563",
  },
  itemRightCol: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    marginBottom: 6,
  },
  incomeAmountColor: {
    color: "#4bcffa",
  },
  expenseAmountColor: {
    color: "#DC2626",
  },
  badgesCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  paymentMethodBadge: {
    backgroundColor: "#4B5563",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paymentMethodText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.medium,
  },
  sourceBadge: {
    backgroundColor: "#4bcffa",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sourceBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.medium,
  },

  // Loading & Empty
  loadingContainer: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...Shadows.sm,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  // FAB
  fab: {
    position: "absolute",
    right: Spacing.base,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4bcffa",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
    elevation: 6,
  },

  // Modal Chọn tháng
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.base,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
    textAlign: "center",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  monthItem: {
    width: "30%",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMonthItem: {
    backgroundColor: "#4bcffa",
    borderColor: "#4bcffa",
  },
  monthItemText: {
    fontSize: 13,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  selectedMonthItemText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
});
