import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { contractService } from "@/services/api/contract.service";
import { motelService } from "@/services/api/motel.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { ContractResponse } from "@/types/contract.types";
import { MotelResponse } from "@/types/motel.types";

const GREEN = "#2b7ed7";
const MONEY_GREEN = "#2b7ed7";
const ORANGE = "#F05A1A";
const PAGE_BG = "#EEF3F2";

const STATUS_OPTIONS = [
  { key: "ACTIVE", label: "Trong thời hạn hợp đồng", color: GREEN },
  { key: "PENDING", label: "Chờ ký hợp đồng", color: ORANGE },
  { key: "IATExpire", label: "Sắp hết hạn", color: ORANGE },
  { key: "ReportEnd", label: "Báo kết thúc", color: ORANGE },
  { key: "Stake", label: "Đã đặt cọc", color: MONEY_GREEN },
  { key: "ENDED", label: "Đã kết thúc", color: Colors.gray500 },
];

const BACKEND_TO_LEGACY_STATUS: Record<string, string> = {
  EXPIRING: "IATExpire",
  TERMINATED: "ReportEnd",
  DEPOSITED: "Stake",
};

function formatMoney(value?: number) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}

function formatDate(value?: string) {
  if (!value) return "25/07/2026";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function resolveStatus(status?: string) {
  const normalizedStatus = normalizeContractStatus(status);
  return STATUS_OPTIONS.find((item) => item.key === normalizedStatus) ?? STATUS_OPTIONS[0];
}

function normalizeContractStatus(status?: string) {
  if (!status) return "ACTIVE";
  return BACKEND_TO_LEGACY_STATUS[status] ?? status;
}

function extractContractItems(response: any): ContractResponse[] {
  const candidates = [
    response,
    response?.data,
    response?.result,
    response?.data?.result,
    response?.items,
    response?.content,
    response?.result?.items,
    response?.result?.content,
    response?.data?.result?.items,
    response?.data?.result?.content,
  ];

  const items = candidates.find(Array.isArray);
  return items ?? [];
}

function getContractRoomName(item: ContractResponse, index: number) {
  const contract = item as ContractResponse & {
    roomName?: string;
    room?: { name?: string; roomName?: string };
  };
  const roomName = contract.roomName ?? contract.room?.name ?? contract.room?.roomName;
  return roomName ? `Phòng ${roomName}` : `Phòng ${index + 1}`;
}

export default function ContractsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedActionContract, setSelectedActionContract] = useState<{
    contract: ContractResponse;
    index: number;
  } | null>(null);

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
      const targetId = params.motelId || storedId;
      const motel =
        motels.find((item: MotelResponse) => item.motelId === targetId) ??
        motels[0] ??
        null;

      if (!motel) {
        setActiveMotel(null);
        setContracts([]);
        return;
      }

      setActiveMotel(motel);
      const data = await contractService.getContractsByMotel(motel.motelId);
      setContracts(extractContractItems(data));
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tải danh sách hợp đồng.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.motelId, user?.username]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const roomOptions = useMemo(
    () =>
      contracts.map((contract, index) => ({
        key: contract.contractId,
        label: getContractRoomName(contract, index),
      })),
    [contracts],
  );

  const visibleContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesRoom = !selectedRoom || contract.contractId === selectedRoom;
      const matchesStatus =
        !selectedStatus || normalizeContractStatus(contract.status) === selectedStatus;
      return matchesRoom && matchesStatus;
    });
  }, [contracts, selectedRoom, selectedStatus]);

  const renderContract = ({
    item,
    index,
  }: {
    item: ContractResponse;
    index: number;
  }) => {
    const status = resolveStatus(item.status);
    const roomName = getContractRoomName(item, index);
    const contractCode = item.contractId?.slice(-6) ?? "60628";
    const depositCollected = item.signcontract ? `${formatMoney(item.deposit)}đ` : "Chưa thu";
    const closeDate = item.closeContract ? formatDate(item.closeContract) : "Vô thời hạn";

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.contractCard}
        onPress={() =>
          router.push({
            pathname: "/tab-manage/management-menu/contracts/[id]",
            params: { id: item.contractId },
          } as any)
        }
      >
        <View style={styles.cardTopRow}>
          <View style={styles.statusIconCircle}>
            <Ionicons name="clipboard" size={26} color={Colors.white} />
          </View>

          <View style={styles.cardMain}>
            <Text style={styles.roomTitle} numberOfLines={1}>
              <Text style={styles.roomTitleUnderline}>{roomName}</Text> - #{contractCode}
            </Text>
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text style={styles.statusPillText}>{status.label}</Text>
            </View>
            <View style={styles.warningLine}>
              <View style={styles.warningItem}>
                <Ionicons name="information-circle-outline" size={14} color={ORANGE} />
                <Text style={styles.warningText}>Chưa sử dụng app</Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close" size={14} color={ORANGE} />
                <Text style={styles.warningText}>Chưa ký hợp đồng</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            activeOpacity={0.7}
            onPress={() => setSelectedActionContract({ contract: item, index })}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.moneyGrid}>
          <MoneyBox label="Giá thuê" value={`${formatMoney(item.price)}đ`} />
          <MoneyBox label="Mức cọc" value={`${formatMoney(item.deposit)}đ`} blue />
          <MoneyBox label="Đã thu cọc" value={depositCollected} orange />
        </View>

        <View style={styles.dateGrid}>
          <DateBox label="Ngày lập" value={formatDate(item.createdate)} />
          <DateBox label="Ngày vào ở" value={formatDate(item.moveinDate)} />
          <DateBox label="Hạn kết thúc" value={closeDate} />
        </View>
      </TouchableOpacity>
    );
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
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách hợp đồng</Text>
      </View>

      <View style={styles.filterPanel}>
        <TouchableOpacity style={styles.filterInput} onPress={() => setShowRoomModal(true)}>
          <View>
            <Text style={styles.filterLabel}>Chọn phòng</Text>
            <Text style={styles.filterValue}>
              {selectedRoom
                ? roomOptions.find((room) => room.key === selectedRoom)?.label
                : "Chọn giá trị"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterInput}
          onPress={() => setShowStatusModal(true)}
        >
          <View>
            <Text style={styles.filterLabel}>Trạng thái hợp đồng</Text>
            <Text style={styles.filterValue}>
              {selectedStatus ? resolveStatus(selectedStatus).label : "Chọn giá trị"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {activeMotel ? (
        <View style={styles.motelHint}>
          <Text style={styles.motelHintText}>
            {activeMotel.motelName} ({visibleContracts.length} hợp đồng)
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      ) : visibleContracts.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="document-text-outline" size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Không có hợp đồng nào</Text>
          <Text style={styles.emptyDesc}>Thử đổi bộ lọc để xem danh sách khác.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleContracts}
          keyExtractor={(item) => item.contractId}
          renderItem={renderContract}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}

      <OptionModal
        visible={showRoomModal}
        title="Chọn phòng"
        options={roomOptions}
        selectedKey={selectedRoom}
        onSelect={setSelectedRoom}
        onClose={() => setShowRoomModal(false)}
      />
      <OptionModal
        visible={showStatusModal}
        title="Trạng thái hợp đồng"
        options={STATUS_OPTIONS.map((status) => ({
          key: status.key,
          label: status.label,
          color: status.color,
        }))}
        selectedKey={selectedStatus}
        onSelect={setSelectedStatus}
        onClose={() => setShowStatusModal(false)}
      />
      <ContractActionSheet
        selected={selectedActionContract}
        onClose={() => setSelectedActionContract(null)}
        onOpenDetail={(contractId) => {
          setSelectedActionContract(null);
          router.push({
            pathname: "/tab-manage/management-menu/contracts/[id]",
            params: { id: contractId },
          } as any);
        }}
      />
    </View>
  );
}

function MoneyBox({
  blue,
  label,
  orange,
  value,
}: {
  blue?: boolean;
  label: string;
  orange?: boolean;
  value: string;
}) {
  return (
    <View style={[styles.moneyBox, blue && styles.moneyBoxBlue, orange && styles.moneyBoxOrange]}>
      <View style={styles.moneyLabelRow}>
        <Ionicons name="document-text" size={14} color={MONEY_GREEN} />
        <Text style={styles.moneyLabel}>{label}</Text>
      </View>
      <Text style={[styles.moneyValue, orange && styles.moneyValueOrange]}>{value}</Text>
    </View>
  );
}

function ContractActionSheet({
  onClose,
  onOpenDetail,
  selected,
}: {
  onClose: () => void;
  onOpenDetail: (contractId: string) => void;
  selected: { contract: ContractResponse; index: number } | null;
}) {
  const contract = selected?.contract;
  const status = resolveStatus(contract?.status);
  const slideY = useRef(new Animated.Value(420)).current;

  useEffect(() => {
    if (selected) {
      slideY.setValue(420);
      Animated.timing(slideY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, slideY]);

  return (
    <Modal
      visible={Boolean(selected)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.actionSheetBackdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.actionSheetDim}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.actionSheetAnimatedWrap,
            { transform: [{ translateY: slideY }] },
          ]}
        >
          <View style={styles.actionSheetHandle} />
          <View style={styles.actionSheet}>
          <View style={styles.actionStatusBox}>
            <Ionicons name="information-circle-outline" size={22} color={status.color} />
            <Text style={styles.actionStatusText}>
              {`Trạng thái "${status.label}"`}
            </Text>
          </View>

          <View style={styles.actionMenu}>
            <ActionSheetItem
              icon="eye-outline"
              label="Xem thông tin hợp đồng"
              onPress={() => contract?.contractId && onOpenDetail(contract.contractId)}
            />
            <ActionSheetItem
              icon="create-outline"
              label="Chỉnh sửa hợp đồng"
              onPress={() => contract?.contractId && onOpenDetail(contract.contractId)}
            />
            <ActionSheetItem
              icon="document-text-outline"
              label="Xem văn bản hợp đồng"
              description="Xem mẫu thông tin chi tiết hợp đồng"
              onPress={onClose}
            />
            <ActionSheetItem
              icon="print-outline"
              label="In hợp đồng"
              onPress={onClose}
            />
            <ActionSheetItem
              icon="share-social-outline"
              label="Chia sẻ hợp đồng"
              description="Chia sẻ đường dẫn hợp đồng khách thuê có thể truy cập và xem"
              onPress={onClose}
            />
            <ActionSheetItem
              icon="qr-code-outline"
              label="Chia sẻ mã QR cho khách kết nối"
              description="Mã giúp khách kết nối với Nhà trọ của bạn, giúp gửi hóa đơn tự động..."
              onPress={onClose}
            />
          </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function ActionSheetItem({
  description,
  icon,
  label,
  onPress,
}: {
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} activeOpacity={0.75} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#000" style={styles.actionItemIcon} />
      <View style={styles.actionItemTextWrap}>
        <Text style={styles.actionItemLabel}>{label}</Text>
        {description ? (
          <Text style={styles.actionItemDescription}>{description}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray500} />
    </TouchableOpacity>
  );
}

function DateBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dateBox}>
      <Text style={styles.dateLabel}>{label}</Text>
      <Text style={styles.dateValue}>{value}</Text>
    </View>
  );
}

function OptionModal({
  onClose,
  onSelect,
  options,
  selectedKey,
  title,
  visible,
}: {
  onClose: () => void;
  onSelect: (key: string) => void;
  options: { key: string; label: string; color?: string }[];
  selectedKey: string;
  title: string;
  visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => {
              onSelect("");
              onClose();
            }}
          >
            <Text style={styles.optionText}>Tất cả</Text>
          </TouchableOpacity>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.optionRow}
              onPress={() => {
                onSelect(selectedKey === option.key ? "" : option.key);
                onClose();
              }}
            >
              {option.color ? (
                <View style={[styles.optionDot, { backgroundColor: option.color }]} />
              ) : null}
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    alignItems: "center",
    borderBottomColor: Colors.gray200,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionItemDescription: {
    color: Colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  actionItemIcon: {
    marginRight: 12,
    width: 24,
  },
  actionItemLabel: {
    color: "#000",
    fontSize: 12,
    fontWeight: FontWeights.bold,
  },
  actionItemTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  actionMenu: {
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  actionSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flex: 1,
    padding: 10,
    width: "100%",
  },
  actionSheetAnimatedWrap: {
    height: "50%",
    width: "100%",
  },
  actionSheetBackdrop: {
    backgroundColor: "rgba(0,0,0,0.58)",
    flex: 1,
    justifyContent: "flex-end",
  },
  actionSheetDim: {
    flex: 1,
  },
  actionSheetHandle: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 4,
    height: 7,
    marginBottom: 10,
    width: 54,
  },
  actionStatusBox: {
    alignItems: "center",
    backgroundColor: "#F7FCF2",
    borderColor: "#7CCB45",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  actionStatusText: {
    color: "#000",
    flex: 1,
    fontSize: 12,
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
  cardMain: {
    flex: 1,
  },
  cardTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 6,
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    marginTop: Spacing.md,
    minHeight: 50,
  },
  closeButtonText: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  container: {
    backgroundColor: PAGE_BG,
    flex: 1,
  },
  contractCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 8,
    ...Shadows.sm,
  },
  dateBox: {
    borderLeftColor: Colors.gray300,
    borderLeftWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 8,
  },
  dateGrid: {
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 8,
    overflow: "hidden",
  },
  dateLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  dateValue: {
    color: "#000",
    fontSize: 11,
    marginTop: 2,
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
    backgroundColor: Colors.white,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: Spacing.sm,
  },
  filterLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  filterPanel: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  filterValue: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginTop: 2,
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
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  listContent: {
    gap: 8,
    padding: 8,
    paddingBottom: 80,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.lg,
    width: "100%",
  },
  modalTitle: {
    color: "#000",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  moneyBox: {
    alignItems: "center",
    backgroundColor: "#EFFBEF",
    borderRadius: BorderRadius.md,
    flex: 1,
    minHeight: 42,
    padding: 5,
  },
  moneyBoxBlue: {
    backgroundColor: "#F1F5FF",
  },
  moneyBoxOrange: {
    backgroundColor: "#FFF6F2",
  },
  moneyGrid: {
    flexDirection: "row",
    gap: 5,
    marginTop: 8,
  },
  moneyLabel: {
    color: "#000",
    fontSize: 10,
  },
  moneyLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  moneyValue: {
    color: "#000",
    fontSize: 11,
    fontWeight: FontWeights.bold,
    marginTop: 2,
  },
  moneyValueOrange: {
    color: ORANGE,
  },
  moreButton: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  motelHint: {
    paddingHorizontal: 8,
    paddingTop: 2,
  },
  motelHintText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  optionDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  optionRow: {
    alignItems: "center",
    borderBottomColor: Colors.gray200,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    minHeight: 52,
  },
  optionText: {
    color: "#000",
    fontSize: FontSizes.base,
  },
  roomTitle: {
    color: "#000",
    fontSize: 13,
  },
  roomTitleUnderline: {
    fontWeight: FontWeights.bold,
    textDecorationLine: "underline",
  },
  statusDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  statusIconCircle: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  statusPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusPillText: {
    color: "#000",
    fontSize: 10,
  },
  warningItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  warningLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 5,
  },
  warningText: {
    color: ORANGE,
    fontSize: 10,
  },
});
