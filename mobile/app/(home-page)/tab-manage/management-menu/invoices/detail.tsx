import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { financeService } from "@/services/api/finance.service";
import { InvoiceResponse } from "@/types/invoice.types";

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";

const GREEN = "#2b7ed7";
const ORANGE = "#F45C16";
const BORDER = "#D7D7D7";
const PAGE_BG = "#EEF3F2";
const BLUE = "#2F80ED";
const SHEET_MAX_HEIGHT = Dimensions.get("window").height * 0.8;

const STATUS_LABELS: Record<string, string> = {
  UNPAID: "Chưa thu",
  PARTIALLY_PAID: "Khách nợ",
  PAID: "Đã thu",
  CANCELLED: "Hủy",
};

function formatMoney(value?: number) {
  return `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;
}

function formatDate(value?: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("vi-VN");
}

function formatInvoiceMonth(value?: string) {
  const [year, month] = String(value ?? "").split("-");
  if (!year || !month) {
    return "--";
  }

  return `T.${Number(month)}, ${year}`;
}

function StatusPill({ label }: { label: string }) {
  return (
    <View style={styles.statusPill}>
      <View style={styles.statusDot} />
      <Text style={styles.statusPillText}>{label}</Text>
    </View>
  );
}

function ActionCard({
  destructive,
  filled,
  icon,
  label,
}: {
  destructive?: boolean;
  filled?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={[styles.actionCard, destructive && styles.actionCardDanger]}>
      <View
        style={[
          styles.actionIcon,
          filled && styles.actionIconFilled,
          destructive && styles.actionIconDanger,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={filled || destructive ? Colors.white : "#000"}
        />
      </View>
      <Text style={[styles.actionText, destructive && styles.actionTextDanger]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function AmountRow({
  date,
  label,
  note,
  value,
}: {
  date?: string;
  label: string;
  note?: string;
  value: string;
}) {
  return (
    <View style={styles.amountRow}>
      <View style={styles.amountLeft}>
        <Text style={styles.amountRowLabel}>{label}</Text>
        {note ? <Text style={styles.amountNote}>{note}</Text> : null}
        {date ? <Text style={styles.amountDate}>{date}</Text> : null}
      </View>
      <View style={styles.amountRight}>
        <Text style={styles.amountRowLabel}>Thành tiền</Text>
        <Text style={styles.amountValue}>{value}</Text>
      </View>

    </View>
  );
}

export default function InvoiceDetailFigmaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    invoiceId?: string;
    totalAmount?: string;
    roomName?: string;
  }>();
  const insets = useSafeAreaInsets();
  const invoiceId = String(params.id || params.invoiceId || "");
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manualSent, setManualSent] = useState(false);
  const [showCollectSheet, setShowCollectSheet] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendReceipt, setSendReceipt] = useState(false);
  const [collectNote, setCollectNote] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const totalAmount = Number(invoice?.totalAmount ?? params.totalAmount ?? 0);
  const roomName = invoice?.roomName ? `Phòng ${invoice.roomName}` : params.roomName || "Phòng";
  const paidAmount = useMemo(() => {
    const transactions = (invoice as any)?.transactions;
    if (Array.isArray(transactions)) {
      return transactions.reduce(
        (sum, transaction) => sum + Number(transaction?.amount ?? transaction?.totalAmount ?? 0),
        0,
      );
    }

    return invoice?.paymentStatus === "PAID" ? totalAmount : 0;
  }, [invoice, totalAmount]);
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);

  const loadInvoice = useCallback(async () => {
    if (!invoiceId) {
      setIsLoading(false);
      Alert.alert("Lỗi", "Không tìm thấy mã hóa đơn để xem chi tiết.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await financeService.getInvoiceById(invoiceId);
      setInvoice(response?.result ?? response);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || error?.message || "Không thể tải chi tiết hóa đơn.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    void loadInvoice();
  }, [loadInvoice]);

  const handleCollectSuccess = async () => {
    if (isCollecting) {
      return;
    }
    if (!invoiceId) {
      Alert.alert("Thu tiền thất bại", "Không tìm thấy mã hóa đơn để thu tiền.");
      return;
    }

    setIsCollecting(true);
    try {
      await financeService.collectPayment(invoiceId, {
        totalAmount,
        paymentName: "Khách thuê",
        description: collectNote || `Thu tiền hóa đơn ${formatInvoiceMonth(String(invoice?.invoiceCreateMonth ?? ""))}`,
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      await loadInvoice();
      setShowCollectSheet(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert(
        "Thu tiền thất bại",
        error?.response?.data?.message || error?.message || "Không thể gọi API thu tiền.",
      );
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top + 12 : 28 },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết hóa đơn</Text>
        <TouchableOpacity style={styles.settingButton}>
          <Ionicons name="settings" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      ) : !invoice ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Không tìm thấy hóa đơn</Text>
        </View>
      ) : (
        <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 170 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionGrid}>
          <ActionCard filled icon="print" label="In phiếu" />
          <ActionCard icon="share-social-outline" label="Gửi h.đơn" />
          <ActionCard icon="call-outline" label="Gọi điện" />
          <ActionCard destructive icon="close" label="Hủy h.đơn" />
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.roomTitle}>{roomName}</Text>
          <Text style={styles.tenantName}>Khách thuê</Text>

          <View style={styles.infoGrid}>
            <InfoCell label="Hóa đơn tháng" value={formatInvoiceMonth(String(invoice.invoiceCreateMonth ?? ""))} />
            <InfoCell label="Ngày lập hóa đơn" value={formatDate(String(invoice.invoiceCreateDate ?? ""))} />
            <InfoCell label="Hạn nạp tiền" value={formatDate(String(invoice.dueDate ?? ""))} />
          </View>

          <View style={styles.reasonBlock}>
            <View>
              <Text style={styles.reasonLabel}>Lý do thu</Text>
              <Text style={styles.reasonValue}>{invoice.invoiceReason || "Thu tiền hóa đơn"}</Text>
            </View>
            <View style={styles.statusStack}>
              <StatusPill label={STATUS_LABELS[String(invoice.paymentStatus)] ?? "Chưa thu"} />
              <StatusPill label="Chưa gửi phiếu" />
            </View>
          </View>

          <AmountRow
            label="Tiền thuê nhà"
            note={`Giá: ${formatMoney(invoice.roomPrice)}`}
            date={`${formatDate(String(invoice.moveinDate ?? ""))} - ${formatDate(String(invoice.moveInDueDate ?? ""))}`}
            value={formatMoney(invoice.roomPrice)}
          />
          {Number(invoice.deposit ?? 0) > 0 ? (
            <AmountRow label="Thu tiền cọc" value={formatMoney(invoice.deposit)} />
          ) : null}
          {invoice.serviceDetails?.map((service) => (
            <AmountRow
              key={service.serviceId}
              label={service.serviceName}
              note={`SL: ${service.quantity ?? 1}, giá: ${formatMoney(service.price)}`}
              value={formatMoney(service.totalPrice)}
            />
          ))}
          {invoice.deviceDetails?.map((device) => (
            <AmountRow
              key={device.deviceId}
              label={device.deviceName}
              note={`SL: ${device.quantity ?? 1}, giá: ${formatMoney(device.price)}`}
              value={formatMoney(device.totalPrice)}
            />
          ))}
          {invoice.additionItems?.map((item, index) => (
            <AmountRow
              key={`${item.name}-${index}`}
              label={item.name}
              note={item.description}
              value={formatMoney(item.amount)}
            />
          ))}

          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>Tổng cộng kỳ này</Text>
            <Text style={styles.totalValue}>{formatMoney(totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.paidSection}>
          <Text style={styles.paidTitle}>Đã trả</Text>
          <Text style={styles.paidDesc}>
            Chưa trả lần nào, 1 phiếu có thể thu nhiều lần.
          </Text>

          <View style={styles.collectSummary}>
            <View>
              <Text style={styles.collectLabel}>Số lần thanh toán</Text>
              <Text style={styles.collectValue}>{(invoice as any)?.transactions?.length ?? 0} lần</Text>
            </View>
            <View style={styles.collectRight}>
              <Text style={styles.collectLabel}>Còn phải thu</Text>
              <Text style={styles.collectValue}>{formatMoney(remainingAmount)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <TouchableOpacity
          style={styles.manualRow}
          onPress={() => setManualSent((value) => !value)}
        >
          <View style={[styles.checkbox, manualSent && styles.checkboxActive]}>
            {manualSent ? <Ionicons name="checkmark" size={22} color={GREEN} /> : null}
          </View>
          <Text style={styles.manualText}>
            Đánh dấu đã gửi hóa đơn nợ thủ công cho khách
          </Text>
        </TouchableOpacity>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#000" />
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.collectButton}
            onPress={() => setShowCollectSheet(true)}
          >
            <Ionicons name="cash" size={22} color={Colors.white} />
            <Text style={styles.collectButtonText}>Thu tiền</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CollectPaymentSheet
        visible={showCollectSheet}
        note={collectNote}
        sendReceipt={sendReceipt}
        onClose={() => setShowCollectSheet(false)}
        onNoteChange={setCollectNote}
        onSubmit={handleCollectSuccess}
        onToggleSend={() => setSendReceipt((value) => !value)}
        isSubmitting={isCollecting}
        totalAmount={totalAmount}
      />

      <CollectSuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace("/tab-manage/management-menu/rooms/rooms-list" as any);
        }}
      />
        </>
      )}
    </View>
  );
}

function CollectPaymentSheet({
  note,
  onClose,
  onNoteChange,
  onSubmit,
  onToggleSend,
  sendReceipt,
  visible,
  isSubmitting,
  totalAmount,
}: {
  note: string;
  onClose: () => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onToggleSend: () => void;
  sendReceipt: boolean;
  visible: boolean;
  isSubmitting: boolean;
  totalAmount: number;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <View style={[styles.collectSheet, { paddingBottom: insets.bottom + Spacing.base }]}>
          <View style={styles.dragHandle} />
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
          >
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderIcon}>
                <Ionicons name="pricetag-outline" size={26} color="#000" />
              </View>
              <View>
                <Text style={styles.sheetTitle}>Thu tiền hóa đơn</Text>
                <Text style={styles.sheetSubtitle}>Có thể thu nhiều lần</Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            <Text style={styles.sheetLabel}>
              Nhập số tiền khách trả kỳ này<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.moneyInputWrap}>
              <TextInput
                style={styles.moneyInput}
                value={totalAmount.toLocaleString("vi-VN")}
                keyboardType="numeric"
                editable={false}
              />
              <View style={styles.currencyBox}>
                <Text style={styles.currencyText}>đ</Text>
              </View>
            </View>

            <View style={styles.sheetFieldRow}>
              <TouchableOpacity style={styles.selectField}>
                <View>
                  <Text style={styles.sheetLabel}>
                    P.thức thanh toán<Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.selectValue}>Chọn giá trị</Text>
                </View>
                <Ionicons name="chevron-down" size={22} color="#000" />
              </TouchableOpacity>

              <View style={styles.dateField}>
                <View>
                  <Text style={styles.sheetLabel}>Ngày thu/chi</Text>
                  <Text style={styles.selectValue}>25/07/2026</Text>
                </View>
                <TouchableOpacity style={styles.clearDateButton}>
                  <Ionicons name="close" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sheetLabel}>Ghi chú khi thanh toán</Text>
            <TextInput
              style={styles.noteField}
              value={note}
              onChangeText={onNoteChange}
              placeholder="Ghi chú khi thanh toán"
              placeholderTextColor="#888"
            />

            <Text style={styles.sheetLabel}>Hình ảnh chứng từ</Text>
            <View style={styles.proofBox}>
              <Ionicons name="document-text-outline" size={48} color={GREEN} />
              <Text style={styles.proofText}>Tối đa thêm được 2 hình ảnh</Text>
              <View style={styles.proofActions}>
                <TouchableOpacity style={styles.proofAction}>
                  <Ionicons name="aperture-outline" size={24} color="#000" />
                  <Text style={styles.proofActionText}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proofAction}>
                  <Ionicons name="add" size={26} color="#000" />
                  <Text style={styles.proofActionText}>Thêm từ thư viện</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.sendReceiptRow} onPress={onToggleSend}>
              <View style={[styles.sendCheckbox, sendReceipt && styles.sendCheckboxActive]}>
                {sendReceipt ? <Ionicons name="checkmark" size={18} color={BLUE} /> : null}
              </View>
              <View style={styles.sendReceiptTextWrap}>
                <Text style={styles.sendReceiptTitle}>Gửi ZALO & APP khách thuê</Text>
                <Text style={styles.sendReceiptSub}>Tự động gửi phiếu thu</Text>
              </View>
              <View style={styles.debtWrap}>
                <Text style={styles.debtLabel}>Khách đang nợ</Text>
                <Text style={styles.debtValue}>0 đ</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetFooterActions}>
              <TouchableOpacity style={styles.sheetCloseButton} onPress={onClose}>
                <Ionicons name="close" size={22} color="#000" />
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetSubmitButton} onPress={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Ionicons name="cash" size={20} color={Colors.white} />
                )}
                <Text style={styles.sheetSubmitText}>
                  {isSubmitting ? "Đang thu tiền..." : "Thực hiện thu tiền"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function CollectSuccessModal({
  onClose,
  visible,
}: {
  onClose: () => void;
  visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.successBackdrop}>
        <View style={styles.successDialog}>
          <Ionicons name="checkmark-circle-outline" size={76} color={GREEN} />
          <Text style={styles.successDialogTitle}>Thông báo thành công</Text>
          <Text style={styles.successDialogText}>
            Khách thuê đã thanh toán xong kỳ thu này!
          </Text>
          <View style={styles.successWarning}>
            <Text style={styles.successWarningText}>
              • 🚫 Gửi qua App khách thuê thất bại!. Hợp đồng chưa có kết nối với khách thuê
            </Text>
          </View>
          <TouchableOpacity style={styles.successDialogButton} onPress={onClose}>
            <Text style={styles.successDialogButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    minHeight: 96,
    justifyContent: "center",
  },
  actionCardDanger: {
    borderColor: ORANGE,
  },
  actionGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.base,
  },
  actionIcon: {
    alignItems: "center",
    borderColor: "#000",
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  actionIconDanger: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  actionIconFilled: {
    backgroundColor: "#000",
  },
  actionText: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  actionTextDanger: {
    color: ORANGE,
  },
  amountDate: {
    color: "#000",
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
  },
  amountLeft: {
    flex: 1,
  },
  amountNote: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
  },
  amountRight: {
    alignItems: "flex-end",
    minWidth: 112,
  },
  amountRow: {
    borderTopColor: BORDER,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.base,
  },
  amountRowLabel: {
    color: "#555",
    fontSize: FontSizes.sm,
  },
  amountValue: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderColor: Colors.gray300,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginRight: Spacing.sm,
    width: 40,
  },
  checkbox: {
    alignItems: "center",
    borderColor: "#000",
    borderRadius: 3,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  checkboxActive: {
    borderColor: GREEN,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    flex: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    height: 50,
    justifyContent: "center",
  },
  closeText: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
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
    borderRadius: BorderRadius.lg,
    flex: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    height: 50,
    justifyContent: "center",
  },
  collectButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  collectSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: SHEET_MAX_HEIGHT,
  },
  collectLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  collectRight: {
    alignItems: "flex-end",
  },
  collectSummary: {
    backgroundColor: "#20a9e722",
    borderColor: "#20a9e722",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    minHeight: 76,
    padding: Spacing.base,
  },
  collectValue: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
  },
  container: {
    backgroundColor: PAGE_BG,
    flex: 1,
  },
  clearDateButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  currencyBox: {
    alignItems: "center",
    backgroundColor: "#F5FBEE",
    borderRadius: BorderRadius.md,
    height: 48,
    justifyContent: "center",
    marginRight: Spacing.sm,
    width: 48,
  },
  currencyText: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  dateField: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: Spacing.md,
  },
  debtLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
    textAlign: "right",
  },
  debtValue: {
    color: GREEN,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: 2,
    textAlign: "right",
  },
  debtWrap: {
    alignItems: "flex-end",
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.base,
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopColor: BORDER,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  footerActions: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  dragHandle: {
    alignSelf: "center",
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    height: 4,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    width: 46,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  header: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray100,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  headerTitle: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  infoCell: {
    alignItems: "center",
    borderLeftColor: BORDER,
    borderLeftWidth: 1,
    flex: 1,
    paddingVertical: Spacing.md,
  },
  infoGrid: {
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: Spacing.xl,
    overflow: "hidden",
  },
  infoLabel: {
    color: "#555",
    fontSize: FontSizes.sm,
  },
  infoValue: {
    color: "#000",
    fontSize: FontSizes.md,
    marginTop: 4,
  },
  manualRow: {
    alignItems: "center",
    backgroundColor: "#F2F6F5",
    flexDirection: "row",
    gap: Spacing.md,
    minHeight: 66,
    paddingHorizontal: Spacing.base,
  },
  manualText: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  paidDesc: {
    color: ORANGE,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    textAlign: "right",
  },
  paidSection: {
    backgroundColor: Colors.white,
    borderTopColor: PAGE_BG,
    borderTopWidth: 18,
    paddingTop: Spacing.xl,
  },
  paidTitle: {
    color: "#000",
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.base,
    textAlign: "right",
  },
  moneyInput: {
    color: GREEN,
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
  moneyInputWrap: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: "row",
    height: 72,
    marginTop: Spacing.sm,
  },
  noteField: {
    borderColor: BORDER,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    color: "#000",
    fontSize: FontSizes.md,
    height: 56,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  proofAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  proofActions: {
    flexDirection: "row",
    gap: Spacing.xl,
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  proofActionText: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  proofBox: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xl,
  },
  proofText: {
    color: "#000",
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  reasonBlock: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xl,
  },
  reasonLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  reasonValue: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
  },
  roomTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  selectField: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: Spacing.md,
  },
  selectValue: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginTop: 4,
  },
  sendCheckbox: {
    alignItems: "center",
    borderColor: BLUE,
    borderRadius: 5,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  sendCheckboxActive: {
    backgroundColor: Colors.white,
  },
  sendReceiptRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  sendReceiptSub: {
    color: "#000",
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  sendReceiptTextWrap: {
    flex: 1,
  },
  sendReceiptTitle: {
    color: BLUE,
    fontSize: FontSizes.md,
  },
  settingButton: {
    alignItems: "center",
    borderColor: "#000",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  statusDot: {
    backgroundColor: ORANGE,
    borderRadius: 6,
    height: 12,
    width: 12,
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
  statusPillText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  statusStack: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  required: {
    color: "#FF3434",
    fontWeight: FontWeights.bold,
  },
  sheetBackdrop: {
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetCloseButton: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    flex: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    height: 50,
    justifyContent: "center",
  },
  sheetCloseText: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  sheetDivider: {
    backgroundColor: BORDER,
    height: 1,
    marginHorizontal: -Spacing.base,
    marginVertical: Spacing.base,
  },
  sheetFieldRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sheetFooter: {
    borderTopColor: BORDER,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  sheetFooterActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
  },
  sheetHeaderIcon: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  sheetLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  sheetScroll: {
    flexShrink: 1,
  },
  sheetScrollContent: {
    paddingBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  sheetSubmitButton: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: BorderRadius.lg,
    flex: 2,
    flexDirection: "row",
    gap: Spacing.sm,
    height: 50,
    justifyContent: "center",
  },
  sheetSubmitText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  sheetSubtitle: {
    color: "#555",
    fontSize: FontSizes.md,
    marginTop: 3,
  },
  sheetTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  successBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  successDialog: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: Spacing.base,
    width: "100%",
  },
  successDialogButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.md,
    height: 54,
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  successDialogButtonText: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  successDialogText: {
    color: "#000",
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  successDialogTitle: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.md,
  },
  successWarning: {
    alignSelf: "stretch",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    padding: Spacing.base,
  },
  successWarningText: {
    color: "#F02D2D",
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  tenantName: {
    color: "#444",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginTop: 4,
    textAlign: "center",
  },
  totalBlock: {
    alignItems: "flex-end",
    borderTopColor: BORDER,
    borderTopWidth: 1,
    paddingVertical: Spacing.lg,
  },
  totalLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  totalValue: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
  },
});
