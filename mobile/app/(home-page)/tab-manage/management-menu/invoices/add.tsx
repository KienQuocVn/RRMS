import React, { useMemo, useState } from "react";
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
import { contractService } from "@/services/api/contract.service";
import { financeService } from "@/services/api/finance.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";

const GREEN = "#2b7ed7";
const ORANGE = "#F45C16";
const BLUE = "#2F80ED";
const BORDER = "#D7D7D7";
const MUTED = "#666666";
const SOFT_BG = "#F2F6F5";
const PALE_GREEN = "#20a9e722";
const SUCCESS_SHEET_MAX_HEIGHT = Dimensions.get("window").height * 0.8;

const money = (value: number) => value.toLocaleString("vi-VN");

export default function AddInvoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    contractId?: string;
    motelId?: string;
    roomId?: string;
    roomName?: string;
    roomPrice?: string;
  }>();
  const insets = useSafeAreaInsets();
  const [deposit, setDeposit] = useState("2.000.000");
  const [note, setNote] = useState("");
  const [sendApp, setSendApp] = useState(true);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  const roomAmount = Number(params.roomPrice || 0) || 800000;
  const depositAmount = Number(deposit.replace(/\D/g, "")) || 0;
  const serviceAmount = 0;
  const total = useMemo(
    () => roomAmount + depositAmount + serviceAmount,
    [depositAmount, roomAmount],
  );

  const resolveContractId = async () => {
    if (params.contractId) {
      return params.contractId;
    }

    const motelId = params.motelId || (await safeAsyncStorage.getItem("rrms_active_motel_id"));
    if (!motelId) {
      throw new Error("Không tìm thấy nhà trọ đang chọn để lập hóa đơn.");
    }

    const contractsResponse: any = await contractService.getContractsByMotel(motelId);
    const contracts = contractsResponse?.result ?? contractsResponse ?? [];
    const matchedContract =
      contracts.find((contract: any) => contract.roomId === params.roomId || contract.room?.roomId === params.roomId) ??
      contracts.find((contract: any) => String(contract.status ?? "").toUpperCase() === "ACTIVE") ??
      contracts[0];

    if (!matchedContract?.contractId) {
      throw new Error("Phòng này chưa có hợp đồng để lập hóa đơn.");
    }

    return matchedContract.contractId;
  };

  const handleCreateInvoice = async () => {
    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const contractId = await resolveContractId();
      const response = await financeService.createInvoice({
        contractId,
        invoiceReason: "Thu tiền tháng đầu tiên",
        invoiceCreateMonth: "2026-07",
        invoiceCreateDate: "2026-07-25",
        dueDate: "2026-07-30",
        dueDateofmoveinDate: "2026-08-05",
        serviceDetails: [],
        deviceDetails: [],
        additionItems:
          depositAmount > 0
            ? [{ reason: "Thu tiền cọc", amount: depositAmount, isAddition: true }]
            : [],
      });

      const invoice = response?.result ?? response;
      if (!invoice?.invoiceId) {
        throw new Error("Backend đã tạo hóa đơn nhưng không trả về mã hóa đơn.");
      }

      setCreatedInvoice(invoice);
      setShowSuccessSheet(true);
    } catch (error: any) {
      Alert.alert(
        "Lập hóa đơn thất bại",
        error?.response?.data?.message || error?.message || "Không thể gọi API lập hóa đơn.",
      );
    } finally {
      setIsCreating(false);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lập hóa đơn</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 176 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthBlock}>
          <Text style={styles.monthLabel}>Lập hóa đơn tháng</Text>
          <Text style={styles.monthValue}>[ T.7/2026 ]</Text>
        </View>

        <View style={styles.formArea}>
          <FieldCard
            active
            icon="enter-outline"
            label="Lý do lập hóa đơn"
            value="Thu tiền tháng đầu tiên"
          />
          <FieldCard label="Hạn đóng tiền" value="30/07/2026" />
        </View>

        <SectionHeader
          title="Thu tiền tháng đầu tiên"
          subtitle={
            <>
              vào <Text style={styles.orangeText}>25/07/2026</Text>. Chu kỳ{" "}
              <Text style={styles.orangeText}>1 tháng, ngày 5 thu</Text>
            </>
          }
          badge="0"
          rightIcon="clipboard-outline"
        />

        <View style={styles.dateRow}>
          <FieldCard compact label="Từ ngày" value="25/07/2026" />
          <FieldCard compact label="Đến ngày" value="05/08/2026" />
        </View>

        <SummaryCard
          left={
            <>
              <Text style={styles.summaryText}>
                <Text style={styles.orangeBold}>0</Text> tháng,{" "}
                <Text style={styles.orangeBold}>12</Text> ngày
              </Text>
              <Text style={styles.summaryMoney}>x 2.000.000 đ</Text>
            </>
          }
          rightLabel="Thành tiền"
          rightValue={`${money(roomAmount)} đ`}
        />

        <Divider />

        <SectionHeader
          title="Thu tiền cọc"
          subtitle="Thu tiền cọc nếu có phát sinh"
        />
        <View style={styles.amountInputWrap}>
          <TextInput
            style={styles.amountInput}
            value={deposit}
            onChangeText={setDeposit}
            keyboardType="numeric"
            accessibilityLabel="Số tiền cọc"
          />
          <TouchableOpacity style={styles.sampleButton}>
            <Text style={styles.sampleIcon}>#</Text>
            <Text style={styles.sampleText}>Chọn mẫu</Text>
          </TouchableOpacity>
        </View>
        <SummaryCard
          left={
            <>
              <Text style={styles.summaryText}>Số tiền cọc cần thu</Text>
              <Text style={styles.summaryOrange}>{money(depositAmount)} đ</Text>
            </>
          }
          rightLabel="Thành tiền"
          rightValue={`${money(depositAmount)} đ`}
        />

        <Divider />

        <SectionHeader
          title="Dịch vụ tính tiền"
          subtitle="Chốt mức khách sử dụng để tính tiền"
        />
        <View style={styles.serviceBox}>
          <ServiceRow title="Tiền điện" price="1.700 đ/1 KWh" />
          <ServiceRow title="Tiền nước" price="18.000 đ/1 Khối" />
        </View>
        <TouchableOpacity style={styles.grayButton}>
          <Ionicons name="pencil" size={22} color="#000" />
          <Text style={styles.grayButtonText}>Chốt dịch vụ</Text>
        </TouchableOpacity>
        <SummaryCard
          left={
            <>
              <Text style={styles.summaryText}>Tính tiền dịch vụ</Text>
              <Text style={styles.summaryText}>
                <Text style={styles.orangeBold}>0</Text> tháng,{" "}
                <Text style={styles.orangeBold}>12</Text> ngày
              </Text>
            </>
          }
          rightLabel="Thành tiền"
          rightValue={`${money(serviceAmount)} đ`}
        />

        <Divider />

        <SectionHeader
          title="Giảm trừ / cộng thêm"
          subtitle="Giảm trừ covid, hỗ trợ, sinh nhật, cộng thêm tiền phạt..."
        />
        <TouchableOpacity style={styles.grayButton}>
          <Ionicons name="add" size={26} color="#000" />
          <Text style={styles.grayButtonText}>Thêm mục cộng thêm / giảm trừ</Text>
        </TouchableOpacity>

        <Divider />

        <SectionHeader title="Ghi chú" subtitle="Nhập ghi chú về hóa đơn" />
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Nhập ghi chú về hóa đơn"
          placeholderTextColor="#8E8E8E"
          multiline
          accessibilityLabel="Nhập ghi chú về hóa đơn"
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setSendApp((value) => !value)}
          accessibilityLabel="Gửi ZALO và APP khách thuê"
        >
          <View style={[styles.checkbox, sendApp && styles.checkboxChecked]}>
            {sendApp ? <Ionicons name="checkmark" size={20} color={BLUE} /> : null}
          </View>
          <View style={styles.footerTextWrap}>
            <Text style={styles.sendTitle}>Gửi ZALO & APP khách thuê</Text>
            <Text style={styles.sendSubtitle}>Tự động gửi ZALO & APP khách thuê</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{money(total)} đ</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateInvoice} disabled={isCreating}>
          {isCreating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="document-attach" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.createButtonText}>
            {isCreating ? "Đang lập hóa đơn..." : "Lập hóa đơn"}
          </Text>
        </TouchableOpacity>
      </View>

      <InvoiceSuccessSheet
        visible={showSuccessSheet}
        invoice={createdInvoice}
        roomName={params.roomName}
        total={Number(createdInvoice?.totalAmount ?? total)}
        onClose={() => setShowSuccessSheet(false)}
        onNavigate={(path) => {
          setShowSuccessSheet(false);
          router.push(path as any);
        }}
      />
    </View>
  );
}

function InvoiceSuccessSheet({
  onClose,
  onNavigate,
  invoice,
  roomName,
  total,
  visible,
}: {
  onClose: () => void;
  onNavigate: (path: string) => void;
  invoice: any;
  roomName?: string;
  total: number;
  visible: boolean;
}) {
  const insets = useSafeAreaInsets();
  const actions = [
    {
      icon: "document-text-outline" as const,
      title: "Chi tiết hóa đơn",
      subtitle: "Bạn có thể thu tiền, in, chia sẻ hóa đơn",
      path: `/tab-manage/management-menu/invoices/detail?invoiceId=${invoice?.invoiceId ?? ""}&totalAmount=${total}&roomName=${encodeURIComponent(roomName || invoice?.roomName || "Phòng 1")}`,
    },
    {
      icon: "return-down-back-outline" as const,
      title: "Lập hóa đơn khác",
      subtitle: "Quay về danh sách và lập hóa đơn khác",
      path: "/tab-manage/management-menu/invoices/add",
    },
    {
      icon: "settings-outline" as const,
      title: "Cài đặt hóa đơn",
      subtitle: "Bật tắt tự động gửi zalo, làm tròn...",
      path: "/tab-manage/management-menu/invoice-settings",
    },
    {
      icon: "home-outline" as const,
      title: "Về trang chủ",
      subtitle: "Về trang chủ để tiếp tục quản lý",
      path: "/tab-manage",
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.successBackdrop}>
        <View style={[styles.successSheet, { paddingBottom: insets.bottom + Spacing.base }]}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.successScrollContent}
            showsVerticalScrollIndicator={false}
            style={styles.successScroll}
          >
          <View style={styles.successGlow}>
            <View style={styles.successDot} />
          </View>
          <Text style={styles.successTitle}>
            Hóa đơn T.7/2026 đã được thêm thành công!
          </Text>
          <Text style={styles.successAmountLine}>
            Số tiền cần thu là: <Text style={styles.successAmount}>{money(total)}đ</Text>
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningBullet}>
              • 🚫 Gửi hóa đơn ZALO thất bại!. Xem lịch sử để giải quyết vấn đề.
              {"\n"}  Không thể hóa đơn qua ZALO!
            </Text>
            <Text style={styles.warningBullet}>
              • 🚫 Gửi qua App khách thuê thất bại!. Hợp đồng chưa có kết nối với khách thuê
            </Text>
          </View>

          <View style={styles.successMenu}>
            {actions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.successMenuItem}
                onPress={() => onNavigate(item.path)}
              >
                <Ionicons name={item.icon} size={24} color="#000" />
                <View style={styles.successMenuText}>
                  <Text style={styles.successMenuTitle}>{item.title}</Text>
                  <Text style={styles.successMenuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#777" />
              </TouchableOpacity>
            ))}
          </View>
          </ScrollView>

          <TouchableOpacity style={styles.successCloseButton} onPress={onClose}>
            <Text style={styles.successCloseText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function RequiredLabel({ label }: { label: string }) {
  return (
    <Text style={styles.fieldLabel}>
      {label}
      <Text style={styles.required}>*</Text>
    </Text>
  );
}

function FieldCard({
  active,
  compact,
  icon,
  label,
  value,
}: {
  active?: boolean;
  compact?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={[
        styles.fieldCard,
        active && styles.fieldCardActive,
        compact && styles.fieldCompact,
      ]}
    >
      {icon ? (
        <View style={styles.fieldIcon}>
          <Ionicons name={icon} size={22} color="#000" />
        </View>
      ) : null}
      <View style={styles.fieldText}>
        <RequiredLabel label={label} />
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
      <TouchableOpacity style={styles.clearButton}>
        <Ionicons name="close" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
  badge,
  rightIcon,
}: {
  title: string;
  subtitle: React.ReactNode;
  badge?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.hashBox}>
        <Text style={styles.hashText}>#</Text>
      </View>
      <View style={styles.sectionText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {rightIcon ? (
        <View style={styles.headerAction}>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          <Ionicons name={rightIcon} size={22} color="#000" />
        </View>
      ) : null}
    </View>
  );
}

function SummaryCard({
  left,
  rightLabel,
  rightValue,
}: {
  left: React.ReactNode;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <View>{left}</View>
      <View style={styles.summaryRight}>
        <Text style={styles.summaryText}>{rightLabel}</Text>
        <Text style={styles.summaryTotal}>{rightValue}</Text>
      </View>
    </View>
  );
}

function ServiceRow({ title, price }: { title: string; price: string }) {
  return (
    <View style={styles.serviceRow}>
      <View>
        <Text style={styles.serviceName}>{title}</Text>
        <Text style={styles.servicePrice}>{price}</Text>
      </View>
      <View style={styles.serviceStatus}>
        <Text style={styles.serviceNumber}>Số: Không sử dụng</Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusPillText}>Không sử dụng</Text>
        </View>
      </View>
      <View style={styles.noImage}>
        <Text style={styles.noImageText}>Không{"\n"}ảnh</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  amountInput: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.md,
  },
  amountInputWrap: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    overflow: "hidden",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderColor: Colors.gray300,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  badge: {
    alignItems: "center",
    backgroundColor: ORANGE,
    borderColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    top: -16,
    width: 28,
    zIndex: 2,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
  checkbox: {
    alignItems: "center",
    borderColor: BLUE,
    borderRadius: 5,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  checkboxChecked: {
    backgroundColor: "#FFFFFF",
  },
  checkboxRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  clearButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: BorderRadius.lg,
    bottom: Spacing.base,
    flexDirection: "row",
    gap: 10,
    height: 50,
    justifyContent: "center",
    left: Spacing.base,
    position: "absolute",
    right: Spacing.base,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  dateRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  divider: {
    backgroundColor: SOFT_BG,
    height: 14,
    marginTop: Spacing.md,
  },
  fieldCard: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    minHeight: 64,
    padding: Spacing.sm,
  },
  fieldCardActive: {
    borderColor: GREEN,
    borderWidth: 2,
  },
  fieldCompact: {
    flex: 1,
    minHeight: 64,
  },
  fieldIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: BORDER,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  fieldLabel: {
    color: "#222222",
    fontSize: FontSizes.sm,
  },
  fieldText: {
    flex: 1,
  },
  fieldValue: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginTop: 4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderColor: BORDER,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    minHeight: 116,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    position: "absolute",
    right: 0,
  },
  footerTextWrap: {
    flex: 1,
  },
  formArea: {
    gap: Spacing.md,
    padding: Spacing.base,
  },
  grayButton: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    gap: 12,
    height: 50,
    justifyContent: "center",
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
  },
  grayButtonText: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  hashBox: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: BorderRadius.lg,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  hashText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "400",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E7ECEF",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  headerAction: {
    alignItems: "center",
    borderColor: "#000",
    borderRadius: 20,
    borderWidth: 1.5,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  monthBlock: {
    alignItems: "center",
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.xl,
  },
  monthLabel: {
    color: "#111111",
    fontSize: FontSizes.base,
  },
  monthValue: {
    color: "#2b7ed7",
    fontSize: FontSizes.xl,
    marginTop: 4,
  },
  muted: {
    color: MUTED,
  },
  noImage: {
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    height: 60,
    justifyContent: "center",
    width: 56,
  },
  noImageText: {
    color: "#222222",
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  noteInput: {
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    color: "#000",
    fontSize: FontSizes.md,
    height: 120,
    margin: Spacing.base,
    padding: Spacing.base,
    textAlignVertical: "top",
  },
  orangeBold: {
    color: ORANGE,
    fontWeight: "700",
  },
  orangeText: {
    color: ORANGE,
  },
  required: {
    color: "#FF3434",
    fontWeight: "700",
  },
  sampleButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: PALE_GREEN,
    borderLeftColor: "#E1E8DD",
    borderLeftWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: Spacing.base,
  },
  sampleIcon: {
    color: GREEN,
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  sampleText: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    textDecorationLine: "underline",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: Spacing.md,
    minHeight: 76,
    paddingHorizontal: Spacing.base,
  },
  sectionSubtitle: {
    color: MUTED,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  sendSubtitle: {
    color: "#000",
    fontSize: FontSizes.sm,
    marginTop: 4,
  },
  sendTitle: {
    color: BLUE,
    fontSize: FontSizes.base,
  },
  serviceBox: {
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    overflow: "hidden",
  },
  serviceName: {
    color: "#000",
    fontSize: FontSizes.base,
  },
  serviceNumber: {
    color: "#111111",
    fontSize: FontSizes.sm,
  },
  servicePrice: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: 8,
  },
  serviceRow: {
    alignItems: "center",
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 82,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  serviceStatus: {
    alignItems: "flex-end",
    flex: 1,
  },
  statusDot: {
    backgroundColor: "#DDDDDD",
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#FFF7F2",
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPillText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: PALE_GREEN,
    borderColor: "#20a9e722",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    minHeight: 72,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  summaryMoney: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: 8,
  },
  summaryOrange: {
    color: ORANGE,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: 6,
  },
  summaryRight: {
    alignItems: "flex-end",
  },
  summaryText: {
    color: "#111111",
    fontSize: FontSizes.base,
  },
  summaryTotal: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: 8,
  },
  totalLabel: {
    color: "#000",
    fontSize: FontSizes.base,
    textAlign: "right",
  },
  totalValue: {
    color: GREEN,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: 4,
    textAlign: "right",
  },
  totalWrap: {
    alignItems: "flex-end",
    position: "absolute",
    right: 16,
    top: 12,
  },
  successAmount: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  successAmountLine: {
    color: "#222",
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
  },
  successBackdrop: {
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "flex-end",
  },
  successCloseButton: {
    alignItems: "center",
    backgroundColor: ORANGE,
    borderRadius: BorderRadius.lg,
    height: 50,
    justifyContent: "center",
    marginTop: Spacing.base,
  },
  successCloseText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  successDot: {
    backgroundColor: "#2b7ed7",
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  successGlow: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#20a9e722",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    marginBottom: 56,
    width: 36,
  },
  successMenu: {
    borderColor: BORDER,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.base,
    overflow: "hidden",
  },
  successMenuItem: {
    alignItems: "center",
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: Spacing.base,
    minHeight: 66,
    paddingHorizontal: Spacing.md,
  },
  successMenuSubtitle: {
    color: MUTED,
    fontSize: FontSizes.sm,
    marginTop: 3,
  },
  successMenuText: {
    flex: 1,
  },
  successMenuTitle: {
    color: "#000",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  successScroll: {
    flexShrink: 1,
  },
  successScrollContent: {
    paddingBottom: Spacing.sm,
  },
  successSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: SUCCESS_SHEET_MAX_HEIGHT,
    paddingHorizontal: Spacing.base,
    paddingTop: 56,
  },
  successTitle: {
    color: "#2b7ed7",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  warningBox: {
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.base,
  },
  warningBullet: {
    color: "#F02D2D",
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
});
