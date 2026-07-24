/**
 * ContractDetailScreen - Chi tiết, Sửa, Xóa hợp đồng
 * Route: /tab-manage/management-menu/contracts/[id]
 * API: GET /contracts/{id}, PUT /contracts/{id}, DELETE /contracts/{id}
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
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
import { contractService } from "@/services/api/contract.service";
import { ContractResponse, ContractStatus } from "@/types/contract.types";

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: "Đang hiệu lực", color: "#1DB954", bg: "#E8F8EE" },
  PENDING: { label: "Chờ ký", color: "#20a9e7", bg: "#FFF3E0" },
  ENDED: { label: "Đã kết thúc", color: "#9E9E9E", bg: "#F5F5F5" },
};

// ── Component ──
export default function ContractDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<ContractResponse | null>(null);

  const loadContract = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await contractService.getContractById(id);
      setContract(data);
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin hợp đồng.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa hợp đồng này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await contractService.deleteContract(id!);
            Alert.alert("Thành công", "Đã xóa hợp đồng.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (err: any) {
            Alert.alert(
              "Lỗi",
              err?.response?.data?.message || "Không thể xóa hợp đồng.",
            );
          }
        },
      },
    ]);
  };

  const handleEndContract = () => {
    Alert.alert(
      "Kết thúc hợp đồng",
      "Bạn có chắc muốn kết thúc hợp đồng này sớm không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              await contractService.updateStatus({
                roomId: (contract as any)?.roomId ?? "",
                newStatus: "ENDED",
              });
              Alert.alert("Thành công", "Hợp đồng đã được kết thúc.", [
                {
                  text: "OK",
                  onPress: () => {
                    loadContract();
                  },
                },
              ]);
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message ||
                  "Không thể cập nhật trạng thái.",
              );
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.success} />
      </View>
    );
  }

  if (!contract) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Không tìm thấy hợp đồng</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const st = STATUS_LABELS[contract.status] ?? STATUS_LABELS.ENDED;

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
        <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
        {contract.status !== ContractStatus.ENDED && (
          <TouchableOpacity
            style={styles.endBtn}
            onPress={handleEndContract}
            accessibilityLabel="Kết thúc hợp đồng"
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={Colors.error}
            />
            <Text style={styles.endBtnText}>Kết thúc</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadgeLarge, { backgroundColor: st.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: st.color }]} />
            <Text style={[styles.statusLabelLarge, { color: st.color }]}>
              {st.label}
            </Text>
          </View>
          <Text style={styles.contractIdText}>Mã HĐ: #{id?.slice(-8)}</Text>
        </View>

        {/* Thông tin hợp đồng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hợp đồng</Text>
          <DetailRow
            label="Giá thuê"
            value={`${Number(contract.price ?? 0).toLocaleString("vi-VN")} đ/tháng`}
          />
          <DetailRow
            label="Giá thực tế"
            value={`${Number(contract.actualPrice ?? 0).toLocaleString("vi-VN")} đ`}
          />
          <DetailRow
            label="Tiền cọc"
            value={`${Number(contract.deposit ?? 0).toLocaleString("vi-VN")} đ`}
          />
          <DetailRow
            label="Công nợ"
            value={`${Number(contract.debt ?? 0).toLocaleString("vi-VN")} đ`}
          />
          <DetailRow label="Thời hạn thuê" value={contract.leaseTerm ?? "—"} />
          <DetailRow
            label="Chu kỳ thu"
            value={contract.collectioncycle ?? "—"}
          />
        </View>

        {/* Thời gian */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <DetailRow label="Ngày vào ở" value={contract.moveinDate ?? "—"} />
          <DetailRow
            label="Ngày hết hạn HĐ"
            value={contract.closeContract ?? "—"}
          />
          <DetailRow label="Ngày ký HĐ" value={contract.signcontract ?? "—"} />
          <DetailRow label="Ngày lập HĐ" value={contract.createdate ?? "—"} />
        </View>

        {/* Mô tả */}
        {contract.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.descText}>{contract.description}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            accessibilityLabel="Xóa hợp đồng"
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.white}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.deleteBtnText}>Xóa hợp đồng</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  endBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  endBtnText: { fontSize: FontSizes.sm, color: Colors.error, marginLeft: 2 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  errorText: { fontSize: FontSizes.lg, color: Colors.textSecondary },
  retryBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryBtnText: { color: Colors.white, fontWeight: FontWeights.bold },
  scroll: { flex: 1 },
  statusCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusLabelLarge: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },
  contractIdText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: { fontSize: FontSizes.md, color: Colors.textSecondary },
  detailValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
    textAlign: "right",
    flex: 1,
    marginLeft: Spacing.md,
  },
  descText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  actionsSection: { marginHorizontal: Spacing.base, marginTop: Spacing.xl },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  deleteBtnText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base,
  },
});
