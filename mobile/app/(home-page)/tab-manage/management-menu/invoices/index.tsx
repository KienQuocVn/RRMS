/**
 * InvoicesListScreen - Danh sách hóa đơn
 * Gọi API thực từ backend: GET /invoices/motel/{motelId}
 * Điều hướng từ: ManagementMenu > "Quản lý hóa đơn"
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
import { financeService } from "@/services/api/finance.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { PaymentStatus, InvoiceResponse } from "@/types/invoice.types";
import { MotelResponse } from "@/types/motel.types";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> =
  {
    PAID: { label: "Đã thanh toán", color: "#1DB954", bg: "#E8F8EE" },
    UNPAID: { label: "Chưa thanh toán", color: "#F44336", bg: "#FEECEC" },
    PARTIALLY_PAID: {
      label: "Thanh toán 1 phần",
      color: "#20a9e7",
      bg: "#FFF3E0",
    },
    CANCELLED: { label: "Đã hủy", color: "#9E9E9E", bg: "#F5F5F5" },
  };

// ── Component ──
export default function InvoicesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const loadData = useCallback(async () => {
    if (!user?.username) return;
    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const list = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        list.find((m: any) => m.motelId === storedId) ?? list[0] ?? null;
      if (!motel) {
        setIsLoading(false);
        return;
      }
      setActiveMotel(motel);

      const res = await financeService.getInvoicesByMotel(motel.motelId, {
        size: 50,
      });
      const items = res?.result?.items ?? res?.result?.content ?? res?.result ?? [];
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
    loadData();
  }, [loadData]);

  const filtered = filterStatus
    ? invoices.filter((i) => i.paymentStatus === filterStatus)
    : invoices;

  const renderItem = ({ item }: { item: InvoiceResponse }) => {
    const st = STATUS_MAP[item.paymentStatus] ?? STATUS_MAP.UNPAID;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/tab-manage/management-menu/invoices/[id]",
            params: { id: item.invoiceId },
          } as any)
        }
        activeOpacity={0.8}
        accessibilityLabel={`Hóa đơn phòng ${item.roomName}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt-outline" size={20} color="#20a9e7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              Phòng: {item.roomName ?? "—"}
            </Text>
            <Text style={styles.cardSub}>
              Tháng: {item.invoiceCreateMonth ?? "—"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusText, { color: st.color }]}>
              {st.label}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Tổng tiền</Text>
          <Text style={styles.amountValue}>
            {Number(item.totalAmount ?? 0).toLocaleString("vi-VN")} đ
          </Text>
        </View>
        <View style={styles.cardFooterRow}>
          <Text style={styles.cardDate}>{item.invoiceCreateDate ?? ""}</Text>
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
        <Text style={styles.headerTitle}>Tất cả hóa đơn</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push("/tab-manage/management-menu/invoices/add" as any)
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Lập hóa đơn"
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Filter ── */}
      <View style={styles.filterRow}>
        {[
          { key: "", label: "Tất cả" },
          { key: "UNPAID", label: "Chưa TT" },
          { key: "PAID", label: "Đã TT" },
          { key: "PARTIALLY_PAID", label: "Một phần" },
          { key: "CANCELLED", label: "Đã hủy" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              filterStatus === f.key && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(f.key)}
            accessibilityLabel={f.label}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === f.key && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Motel bar ── */}
      {activeMotel && (
        <View style={styles.motelBar}>
          <Ionicons
            name="business-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.motelBarText}>{activeMotel.motelName}</Text>
          <Text style={styles.motelBarCount}>({filtered.length} hóa đơn)</Text>
        </View>
      )}

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={64} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Không có hóa đơn nào</Text>
          <Text style={styles.emptyDesc}>Nhấn + để lập hóa đơn mới</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.invoiceId}
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
          router.push("/tab-manage/management-menu/invoices/add" as any)
        }
        accessibilityLabel="Lập hóa đơn mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
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
    backgroundColor: "#FFF3E0",
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
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: { fontSize: FontSizes.md, color: Colors.textSecondary },
  amountValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  cardDate: { fontSize: FontSizes.sm, color: Colors.textSecondary },
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
