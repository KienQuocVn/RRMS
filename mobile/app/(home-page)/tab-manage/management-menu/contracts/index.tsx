/**
 * ContractsListScreen - Danh sách hợp đồng
 * Gọi API thực từ backend: GET /contracts/motel/{motelId}
 * Điều hướng từ: ManagementMenu > "Quản lý hợp đồng"
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { contractService } from "@/services/api/contract.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { ContractResponse, ContractStatus } from "@/types/contract.types";
import { MotelResponse } from "@/types/motel.types";

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: "Đang hiệu lực", color: "#1DB954", bg: "#E8F8EE" },
  PENDING: { label: "Chờ ký", color: "#20a9e7", bg: "#FFF3E0" },
  ENDED: { label: "Đã kết thúc", color: "#9E9E9E", bg: "#F5F5F5" },
};

// ── Component ──
export default function ContractsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const loadData = useCallback(async () => {
    if (!user?.username) return;
    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const list = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const targetId = params.motelId || storedId;
      const motel = list.find((m) => m.motelId === targetId) ?? list[0] ?? null;
      if (!motel) {
        setIsLoading(false);
        return;
      }
      setActiveMotel(motel);
      const data = await contractService.getContractsByMotel(motel.motelId);
      const items = data?.result?.items ?? data?.result ?? [];
      setContracts(Array.isArray(items) ? items : []);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tải danh sách hợp đồng.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, params.motelId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = filterStatus
    ? contracts.filter((c) => c.status === filterStatus)
    : contracts;

  const renderItem = ({ item }: { item: ContractResponse }) => {
    const st = STATUS_LABELS[item.status] ?? STATUS_LABELS.ENDED;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/tab-manage/management-menu/contracts/[id]",
            params: { id: item.contractId },
          } as any)
        }
        activeOpacity={0.8}
        accessibilityLabel={`Hợp đồng ${item.contractId}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="document-text-outline" size={20} color="#20a9e7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              Hợp đồng #{item.contractId?.slice(-8)}
            </Text>
            <Text style={styles.cardSub}>
              Ngày lập: {item.createdate ?? "—"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusText, { color: st.color }]}>
              {st.label}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardBody}>
          <InfoRow
            icon="cash-outline"
            label="Giá thuê"
            value={`${Number(item.price ?? 0).toLocaleString("vi-VN")} đ`}
          />
          <InfoRow
            icon="wallet-outline"
            label="Tiền cọc"
            value={`${Number(item.deposit ?? 0).toLocaleString("vi-VN")} đ`}
          />
          <InfoRow
            icon="calendar-outline"
            label="Ngày vào"
            value={item.moveinDate ?? "—"}
          />
          <InfoRow
            icon="time-outline"
            label="Ngày hết hạn"
            value={item.closeContract ?? "—"}
          />
        </View>
        <View style={styles.cardFooter}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Danh sách hợp đồng</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push("/tab-manage/management-menu/contracts/add" as any)
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Thêm hợp đồng"
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Filter ── */}
      <View style={styles.filterRow}>
        {["", "ACTIVE", "PENDING", "ENDED"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.filterChip,
              filterStatus === s && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(s)}
            accessibilityLabel={s || "Tất cả"}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === s && styles.filterChipTextActive,
              ]}
            >
              {s === "" ? "Tất cả" : (STATUS_LABELS[s]?.label ?? s)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Motel name ── */}
      {activeMotel && (
        <View style={styles.motelBar}>
          <Ionicons
            name="business-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.motelBarText}>{activeMotel.motelName}</Text>
          <Text style={styles.motelBarCount}>({filtered.length} hợp đồng)</Text>
        </View>
      )}

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="document-text-outline"
            size={64}
            color={Colors.gray300}
          />
          <Text style={styles.emptyTitle}>Không có hợp đồng nào</Text>
          <Text style={styles.emptyDesc}>Nhấn nút + để lập hợp đồng mới</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.contractId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push("/tab-manage/management-menu/contracts/add" as any)
        }
        accessibilityLabel="Thêm hợp đồng mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={14}
        color={Colors.textSecondary}
        style={{ marginRight: 4 }}
      />
      <Text style={styles.infoLabel}>{label}: </Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
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
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: { backgroundColor: "#20a9e7", borderColor: "#20a9e7" },
  filterChipText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.white, fontWeight: FontWeights.bold },
  motelBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  motelBarText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  motelBarCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  listContent: { padding: Spacing.base, paddingBottom: 100, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: "#20a9e7",
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F3E5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: { fontSize: FontSizes.xs, fontWeight: FontWeights.bold },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  cardBody: { gap: 6 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  infoValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  cardFooter: { alignItems: "flex-end", marginTop: Spacing.sm },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
});
