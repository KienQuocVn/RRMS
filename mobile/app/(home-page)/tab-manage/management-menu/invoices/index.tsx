import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { financeService } from "@/services/api/finance.service";
import { motelService } from "@/services/api/motel.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { InvoiceResponse } from "@/types/invoice.types";
import { MotelResponse } from "@/types/motel.types";

const GREEN = "#2b7ed7";
const ORANGE = "#FF5A00";
const RED = "#E92B2B";
const BLUE = "#2F80ED";
const PAGE_BG = "#EEF3F2";
const SHEET_HEIGHT = Dimensions.get("window").height * 0.44;

const STATUS_OPTIONS = [
  { key: "UNPAID", label: "Chưa thu tiền", color: ORANGE, short: "Chưa thu" },
  { key: "PARTIALLY_PAID", label: "Khách nợ tiền thuê", color: RED, short: "Khách nợ" },
  { key: "PAID", label: "Đã thu xong", color: GREEN, short: "Đã thu" },
  { key: "CANCELLED", label: "Hủy", color: "#6B7280", short: "Hủy" },
];

const MONTHS = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1;
  return {
    key: `${month}`.padStart(2, "0"),
    label: `${month}`.padStart(2, "0"),
    year: "2026",
  };
});

function formatMoney(value?: number) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}

function resolveStatus(status?: string) {
  return (
    STATUS_OPTIONS.find((item) => item.key === status) ?? STATUS_OPTIONS[0]
  );
}

function resolveMonthValue(invoice?: InvoiceResponse) {
  const raw = String(invoice?.invoiceCreateMonth ?? "");
  const match = raw.match(/\d{1,2}/);
  return match ? match[0].padStart(2, "0") : "07";
}

export default function InvoicesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCollectInvoice, setSelectedCollectInvoice] =
    useState<InvoiceResponse | null>(null);
  const [collectAmount, setCollectAmount] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.username) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const motels = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        motels.find((item: MotelResponse) => item.motelId === storedId) ??
        motels[0] ??
        null;

      if (!motel) {
        setActiveMotel(null);
        setInvoices([]);
        return;
      }

      setActiveMotel(motel);
      const res = await financeService.getInvoicesByMotel(motel.motelId, {
        size: 50,
      });
      const items =
        res?.result?.items ?? res?.result?.content ?? res?.result ?? [];
      setInvoices(Array.isArray(items) ? items : []);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tải danh sách hóa đơn.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const visibleInvoices = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesStatus =
        !selectedStatus || invoice.paymentStatus === selectedStatus;
      const matchesMonth =
        !selectedMonth || resolveMonthValue(invoice) === selectedMonth;
      const matchesSearch =
        !normalizedSearch ||
        String(invoice.roomName ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesMonth && matchesSearch;
    });
  }, [invoices, searchQuery, selectedMonth, selectedStatus]);

  const openCollectSheet = useCallback((invoice: InvoiceResponse) => {
    setSelectedCollectInvoice(invoice);
    setCollectAmount(formatMoney(Number(invoice.totalAmount ?? 0)));
  }, []);

  const closeCollectSheet = useCallback(() => {
    if (!isCollecting) {
      setSelectedCollectInvoice(null);
      setCollectAmount("");
    }
  }, [isCollecting]);

  const handleCollectPayment = useCallback(async () => {
    if (!selectedCollectInvoice?.invoiceId) {
      return;
    }

    const numericAmount = Number(collectAmount.replace(/[^\d]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền khách trả kỳ này.");
      return;
    }

    setIsCollecting(true);
    try {
      const res = await financeService.collectPayment(selectedCollectInvoice.invoiceId, {
        totalAmount: numericAmount,
        paymentName: "Tiền mặt",
        description: `Thu nhanh hóa đơn phòng ${selectedCollectInvoice.roomName ?? ""}`.trim(),
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      const updatedInvoice = res?.result ?? selectedCollectInvoice;
      const nextStatus =
        updatedInvoice?.paymentStatus ??
        (numericAmount >= Number(selectedCollectInvoice.totalAmount ?? 0)
          ? "PAID"
          : "PARTIALLY_PAID");

      setInvoices((current) =>
        current.map((invoice) =>
          invoice.invoiceId === selectedCollectInvoice.invoiceId
            ? { ...invoice, ...updatedInvoice, paymentStatus: nextStatus }
            : invoice,
        ),
      );
      setSelectedCollectInvoice(null);
      setCollectAmount("");
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể thu tiền hóa đơn này.",
      );
    } finally {
      setIsCollecting(false);
    }
  }, [collectAmount, selectedCollectInvoice]);

  const renderInvoice = ({ item }: { item: InvoiceResponse }) => {
    const status = resolveStatus(item.paymentStatus);
    const month = resolveMonthValue(item);
    const totalAmount = Number(item.totalAmount ?? 2800000);
    const isPaid = item.paymentStatus === "PAID";
    const paidAmount = isPaid ? totalAmount : 0;
    const remainingAmount = Math.max(totalAmount - paidAmount, 0);

    return (
      <View style={styles.invoiceCard}>
        <View style={styles.invoiceHeader}>
          <View style={[styles.monthBadge, isPaid && styles.monthBadgePaid]}>
            <View style={[styles.monthBadgeTop, isPaid && styles.monthBadgeTopPaid]}>
              <Text style={styles.monthBadgeText}>T.{Number(month)}</Text>
            </View>
            <Text style={styles.monthBadgeYear}>2026</Text>
          </View>

          <View style={styles.invoiceInfo}>
            <View style={styles.roomLine}>
              <Text style={styles.roomName} numberOfLines={1}>
                {item.roomName ? `Phòng ${item.roomName}` : "Phòng 1"}
              </Text>
              <Text style={styles.invoiceDate}>
                ({item.invoiceCreateDate ?? "25/07/2026"})
              </Text>
            </View>
            <Text style={styles.invoiceReason} numberOfLines={1}>
              {item.invoiceReason ?? "Thu tiền tháng đầu tiên"}
            </Text>
            <View style={styles.warningRow}>
              <Ionicons name="information-circle-outline" size={13} color={ORANGE} />
              <Text style={styles.warningText}>Khách chưa cài APP</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push({
                pathname: "/tab-manage/management-menu/invoices/detail",
                params: { id: item.invoiceId },
              } as any)
            }
          >
            <Text style={styles.detailText}>Chi tiết</Text>
            <Ionicons name="chevron-forward" size={16} color={BLUE} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusPillRow}>
          <StatusPill color={status.color} label={status.short} />
          <StatusPill color={ORANGE} label="Chưa gửi phiếu" />
        </View>

        <View style={styles.actionRow}>
          <ActionCell active icon="call" label="Gọi" />
          {!isPaid ? (
            <ActionCell
              icon="cash"
              label="Thu nhanh"
              onPress={() => openCollectSheet(item)}
            />
          ) : null}
          <ActionCell icon="paper-plane-outline" label="Gửi h.đơn" />
          <ActionCell icon="print" label="In" />
        </View>

        <View style={styles.amountGrid}>
          <AmountBox label="Tổng số" value={`${formatMoney(totalAmount)} đ`} />
          <AmountBox label="Đã trả" value={`${formatMoney(paidAmount)} đ`} green />
          <AmountBox
            label="Còn lại"
            value={`${formatMoney(remainingAmount)} đ`}
            green={isPaid}
            red={!isPaid}
          />
        </View>
      </View>
    );
  };

  const emptyContent = isLoading ? (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={GREEN} />
    </View>
  ) : (
    <View style={styles.center}>
      <Ionicons name="receipt-outline" size={40} color={Colors.gray300} />
      <Text style={styles.emptyTitle}>Không có hóa đơn nào</Text>
      <Text style={styles.emptyDesc}>
        Thử đổi bộ lọc hoặc tìm bằng tên phòng khác.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top + 12 : 28 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={19} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tất cả hóa đơn</Text>
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.filterTopRow}>
          <View style={styles.filterTitleRow}>
            <Ionicons name="filter" size={16} color="#000" />
            <Text style={styles.filterTitle}>Lọc theo</Text>
          </View>
          <TouchableOpacity
            style={styles.advancedButton}
            onPress={() => setIsAdvancedOpen((value) => !value)}
          >
            <Text style={styles.advancedText}>Tìm nâng cao</Text>
            <Ionicons
              name={isAdvancedOpen ? "arrow-up" : "arrow-down"}
              size={16}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterInputsRow}>
          <TouchableOpacity
            style={styles.filterInput}
            onPress={() => setShowMonthModal(true)}
          >
            <View>
              <Text style={styles.filterLabel}>Tháng lập hóa đơn</Text>
              <Text style={styles.filterValue}>
                {selectedMonth ? `T.${Number(selectedMonth)}/2026` : "Chọn tháng"}
              </Text>
            </View>
            <Ionicons name="calendar-outline" size={16} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterInput}
            onPress={() => setShowStatusModal(true)}
          >
            <View>
              <Text style={styles.filterLabel}>Trạng thái hóa đơn</Text>
              <Text style={styles.filterValue}>
                {selectedStatus
                  ? resolveStatus(selectedStatus).label
                  : "Chọn giá trị"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        {isAdvancedOpen ? (
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Nhập tên phòng..."
              placeholderTextColor={Colors.gray400}
            />
            <Ionicons name="search" size={18} color="#000" />
          </View>
        ) : null}
      </View>

      {activeMotel ? (
        <View style={styles.motelHint}>
          <Text style={styles.motelHintText}>
            {activeMotel.motelName} ({visibleInvoices.length} hóa đơn)
          </Text>
        </View>
      ) : null}

      {isLoading || visibleInvoices.length === 0 ? (
        emptyContent
      ) : (
        <FlatList
          data={visibleInvoices}
          keyExtractor={(item, index) => item.invoiceId ?? String(index)}
          renderItem={renderInvoice}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}

      <MonthModal
        visible={showMonthModal}
        selectedMonth={selectedMonth}
        onSelect={setSelectedMonth}
        onClose={() => setShowMonthModal(false)}
      />
      <StatusModal
        visible={showStatusModal}
        selectedStatus={selectedStatus}
        onSelect={setSelectedStatus}
        onClose={() => setShowStatusModal(false)}
      />
      <CollectPaymentSheet
        amount={collectAmount}
        invoice={selectedCollectInvoice}
        isCollecting={isCollecting}
        onAmountChange={(value) =>
          setCollectAmount(formatMoney(Number(value.replace(/[^\d]/g, ""))))
        }
        onClose={closeCollectSheet}
        onSubmit={handleCollectPayment}
      />
    </View>
  );
}

function StatusPill({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.statusPill}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={styles.statusPillText}>{label}</Text>
    </View>
  );
}

function ActionCell({
  active,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCell, active && styles.actionCellActive]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={16} color={active ? BLUE : "#000"} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function AmountBox({
  green,
  label,
  red,
  value,
}: {
  green?: boolean;
  label: string;
  red?: boolean;
  value: string;
}) {
  return (
    <View style={[styles.amountBox, red && styles.amountBoxRed]}>
      <Text style={styles.amountLabel}>{label}</Text>
      <Text
        style={[
          styles.amountValue,
          green && styles.amountValueGreen,
          red && styles.amountValueRed,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function CollectPaymentSheet({
  amount,
  invoice,
  isCollecting,
  onAmountChange,
  onClose,
  onSubmit,
}: {
  amount: string;
  invoice: InvoiceResponse | null;
  isCollecting: boolean;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const totalAmount = Number(invoice?.totalAmount ?? 0);
  const numericAmount = Number(amount.replace(/[^\d]/g, ""));
  const remainingAmount = Math.max(totalAmount - numericAmount, 0);
  const today = new Date().toLocaleDateString("vi-VN");
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_HEIGHT + 40)).current;

  useEffect(() => {
    if (!invoice) {
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(SHEET_HEIGHT + 40);
      return;
    }

    sheetTranslateY.setValue(SHEET_HEIGHT + 40);
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 230,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [backdropOpacity, invoice, sheetTranslateY]);

  return (
    <Modal
      visible={Boolean(invoice)}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetBackdrop}
      >
        <Animated.View style={[styles.sheetDimArea, { opacity: backdropOpacity }]}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sheetMotion, { transform: [{ translateY: sheetTranslateY }] }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.collectSheet}>
          <View style={styles.collectHeader}>
            <View style={styles.collectIconCircle}>
              <Ionicons name="pricetag-outline" size={20} color="#000" />
            </View>
            <View style={styles.collectTitleWrap}>
              <Text style={styles.collectTitle}>
                Thu tiền {invoice?.roomName ? `Phòng ${invoice.roomName}` : "Phòng 1"}
              </Text>
              <Text style={styles.collectSubtitle}>Có thể thu nhiều lần</Text>
            </View>
          </View>

          <View style={styles.sheetDivider} />

          <Text style={styles.collectLabel}>Nhập số tiền khách trả kỳ này *</Text>
          <View style={styles.moneyInputWrap}>
            <TextInput
              value={amount}
              onChangeText={onAmountChange}
              keyboardType="numeric"
              style={styles.moneyInput}
              editable={!isCollecting}
            />
            <View style={styles.currencyPill}>
              <Text style={styles.currencyText}>đ</Text>
            </View>
          </View>

          <View style={styles.collectMetaRow}>
            <View style={styles.collectMetaBox}>
              <Text style={styles.collectMetaLabel}>P.thức thanh toán *</Text>
              <Text style={styles.collectMetaValue}>Tiền mặt</Text>
              <View style={styles.collectMetaClose}>
                <Ionicons name="close" size={14} color="#000" />
              </View>
            </View>
            <View style={styles.collectMetaBox}>
              <Text style={styles.collectMetaLabel}>Ngày thu/chi</Text>
              <Text style={styles.collectMetaValue}>{today}</Text>
              <View style={styles.collectMetaClose}>
                <Ionicons name="close" size={14} color="#000" />
              </View>
            </View>
          </View>

          <View style={styles.collectFooter}>
            <Text style={styles.collectNote}>
              Bạn có thể thu nhiều lần nếu khách đóng không đủ
            </Text>
            <View style={styles.collectDebtWrap}>
              <Text style={styles.collectDebtLabel}>Khách đang nợ</Text>
              <Text style={styles.collectDebtValue}>{formatMoney(remainingAmount)} đ</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.collectButton, isCollecting && styles.collectButtonDisabled]}
            onPress={onSubmit}
            disabled={isCollecting}
          >
            {isCollecting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="receipt" size={15} color={Colors.white} />
                <Text style={styles.collectButtonText}>Thực hiện thu tiền</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MonthModal({
  onClose,
  onSelect,
  selectedMonth,
  visible,
}: {
  onClose: () => void;
  onSelect: (month: string) => void;
  selectedMonth: string;
  visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.monthModalCard}>
          <Text style={styles.modalTitle}>Tháng lập hóa đơn</Text>
          <View style={styles.yearRow}>
            <Text style={styles.yearText}>2025</Text>
            <Text style={[styles.yearText, styles.yearActive]}>2026</Text>
            <Text style={styles.yearText}>2027</Text>
          </View>
          <View style={styles.yearProgress}>
            <View style={styles.yearProgressActive} />
          </View>
          <View style={styles.monthGrid}>
            {MONTHS.map((month) => {
              const active = selectedMonth === month.key;
              return (
                <TouchableOpacity
                  key={month.key}
                  style={styles.monthCell}
                  onPress={() => onSelect(month.key)}
                >
                  <Text style={styles.monthNumber}>{month.label}</Text>
                  <Text style={styles.monthYear}>{month.year}</Text>
                  {active ? <View style={styles.monthActiveDot} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.modalDivider} />
          <TouchableOpacity style={styles.monthCloseButton} onPress={onClose}>
            <Ionicons name="close" size={16} color="#000" />
            <Text style={styles.monthCloseText}>Đóng chọn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function StatusModal({
  onClose,
  onSelect,
  selectedStatus,
  visible,
}: {
  onClose: () => void;
  onSelect: (status: string) => void;
  selectedStatus: string;
  visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.statusModalCard}>
          <View style={styles.statusModalTitleRow}>
            <Ionicons name="list" size={17} color="#000" />
            <Text style={styles.statusModalTitle}>Trạng thái hóa đơn</Text>
          </View>
          <View style={styles.modalDivider} />
          {STATUS_OPTIONS.map((status) => {
            const active = selectedStatus === status.key;
            return (
              <TouchableOpacity
                key={status.key}
                style={styles.statusOption}
                onPress={() => onSelect(active ? "" : status.key)}
              >
                <View style={[styles.statusOptionDot, { backgroundColor: status.color }]} />
                <Text style={styles.statusOptionText}>{status.label}</Text>
              </TouchableOpacity>
            );
          })}
          <View style={styles.modalDivider} />
          <TouchableOpacity style={styles.statusCloseButton} onPress={onClose}>
            <Text style={styles.statusCloseText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionCell: {
    alignItems: "center",
    borderLeftColor: Colors.gray300,
    borderLeftWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    minHeight: 46,
  },
  actionCellActive: {
    backgroundColor: "#EEF4FF",
    borderLeftWidth: 0,
  },
  actionLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  actionRow: {
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  advancedButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  advancedText: {
    color: "#000",
    fontSize: FontSizes.sm,
    textDecorationLine: "underline",
  },
  amountBox: {
    backgroundColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    flex: 1,
    minHeight: 50,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  amountBoxRed: {
    backgroundColor: "#FFF6F2",
  },
  amountGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  amountLabel: {
    color: "#333333",
    fontSize: FontSizes.sm,
  },
  amountValue: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginTop: 4,
  },
  amountValueGreen: {
    color: GREEN,
    textAlign: "center",
  },
  amountValueRed: {
    color: RED,
    textAlign: "right",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderColor: Colors.gray300,
    borderRadius: 20,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    marginRight: Spacing.sm,
    width: 34,
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  collectButton: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    marginTop: Spacing.base,
    minHeight: 46,
  },
  collectButtonDisabled: {
    opacity: 0.7,
  },
  collectButtonText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  collectDebtLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
    textAlign: "right",
  },
  collectDebtValue: {
    color: GREEN,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: 2,
    textAlign: "right",
  },
  collectDebtWrap: {
    flex: 1,
  },
  collectFooter: {
    alignItems: "flex-start",
    borderTopColor: Colors.gray300,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    marginHorizontal: -Spacing.md,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  collectHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  collectIconCircle: {
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  collectLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  collectMetaBox: {
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 54,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    position: "relative",
  },
  collectMetaClose: {
    alignItems: "center",
    backgroundColor: Colors.gray300,
    borderRadius: 22,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 10,
    width: 34,
  },
  collectMetaLabel: {
    color: "#000",
    fontSize: FontSizes.xs,
    paddingRight: 36,
  },
  collectMetaRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  collectMetaValue: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginTop: 4,
    paddingRight: 36,
  },
  collectNote: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 19,
  },
  collectSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: SHEET_HEIGHT,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    width: "100%",
  },
  collectSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 4,
  },
  collectTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  collectTitleWrap: {
    flex: 1,
  },
  container: {
    backgroundColor: PAGE_BG,
    flex: 1,
  },
  currencyPill: {
    alignItems: "center",
    backgroundColor: "#F5FBEE",
    borderRadius: BorderRadius.md,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  currencyText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  detailButton: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 28,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  detailText: {
    color: BLUE,
    fontSize: FontSizes.sm,
  },
  emptyDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  filterInput: {
    alignItems: "center",
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: Spacing.sm,
  },
  filterInputsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.base,
  },
  filterLabel: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
  },
  filterPanel: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray100,
    borderBottomWidth: 1,
    padding: Spacing.md,
  },
  filterTitle: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  filterTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterValue: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginTop: 4,
  },
  header: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray100,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  invoiceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  invoiceDate: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  invoiceHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceReason: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    marginTop: 6,
  },
  listContent: {
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingBottom: 80,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.58)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalDivider: {
    backgroundColor: Colors.gray300,
    height: 1,
    marginTop: Spacing.lg,
  },
  modalTitle: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
  monthActiveDot: {
    backgroundColor: "#68C747",
    borderRadius: 4,
    height: 8,
    position: "absolute",
    right: 18,
    top: 18,
    width: 8,
  },
  monthBadge: {
    borderColor: ORANGE,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
    width: 54,
  },
  monthBadgePaid: {
    borderColor: GREEN,
  },
  monthBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  monthBadgeTop: {
    alignItems: "center",
    backgroundColor: ORANGE,
    minHeight: 40,
    justifyContent: "center",
  },
  monthBadgeTopPaid: {
    backgroundColor: GREEN,
  },
  monthBadgeYear: {
    color: "#000",
    fontSize: FontSizes.sm,
    paddingVertical: 6,
    textAlign: "center",
  },
  monthCell: {
    alignItems: "center",
    minHeight: 72,
    position: "relative",
    width: "25%",
  },
  monthCloseButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    paddingTop: Spacing.lg,
  },
  monthCloseText: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.xl,
  },
  monthModalCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    width: "100%",
  },
  monthNumber: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  monthYear: {
    color: "#000",
    fontSize: FontSizes.base,
    marginTop: 2,
  },
  motelHint: {
    backgroundColor: PAGE_BG,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  motelHintText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  roomLine: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  roomName: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  searchBox: {
    alignItems: "center",
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: Spacing.base,
    minHeight: 46,
    paddingHorizontal: Spacing.sm,
  },
  searchInput: {
    color: Colors.textPrimary,
    flex: 1,
    fontSize: FontSizes.sm,
    paddingVertical: 8,
  },
  sheetBackdrop: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetDimArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.58)",
  },
  sheetMotion: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetDivider: {
    backgroundColor: Colors.gray300,
    height: 1,
    marginHorizontal: -Spacing.md,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 4,
    height: 6,
    marginBottom: 10,
    width: 52,
  },
  moneyInput: {
    color: GREEN,
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
  moneyInputWrap: {
    alignItems: "center",
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: Spacing.sm,
  },
  statusCloseButton: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    marginTop: Spacing.md,
    minHeight: 54,
  },
  statusCloseText: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  statusDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  statusModalCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.lg,
    width: "100%",
  },
  statusModalTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  statusModalTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
  },
  statusOption: {
    alignItems: "center",
    borderBottomColor: Colors.gray300,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: Spacing.md,
    minHeight: 66,
  },
  statusOptionDot: {
    borderRadius: 9,
    height: 18,
    width: 18,
  },
  statusOptionText: {
    color: "#000",
    fontSize: FontSizes.base,
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusPillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 78,
    marginTop: Spacing.sm,
  },
  statusPillText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  warningRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  warningText: {
    color: ORANGE,
    fontSize: FontSizes.sm,
  },
  yearActive: {
    color: GREEN,
  },
  yearProgress: {
    backgroundColor: "#BDE8DC",
    height: 4,
    marginTop: Spacing.base,
  },
  yearProgressActive: {
    alignSelf: "center",
    backgroundColor: GREEN,
    height: 4,
    width: "34%",
  },
  yearRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacing.xl,
  },
  yearText: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
});
