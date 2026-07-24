/**
 * InvoiceDetailScreen - Chi tiết, thanh toán, hủy, xóa hóa đơn
 * Route: /tab-manage/management-menu/invoices/[id]
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
import { financeService } from "@/services/api/finance.service";
import { PaymentStatus } from "@/types/invoice.types";

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
export default function InvoiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);

  const loadInvoice = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      // Lấy data từ list đã có (hoặc refetch bằng ID nếu BE hỗ trợ)
      // Hiện tại backend không có GET /invoices/{id} riêng lẻ, nên dùng navigate params
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  const handleCollect = async () => {
    Alert.alert(
      "Xác nhận thu tiền",
      "Xác nhận khách đã thanh toán đầy đủ hóa đơn này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              await financeService.collectPayment(id!, {
                paymentMethod: "CASH",
              });
              Alert.alert("Thành công", "Đã thu tiền hóa đơn!", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể thu tiền.",
              );
            }
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Xác nhận hủy hóa đơn",
      "Bạn có chắc muốn hủy hóa đơn này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy HĐ",
          style: "destructive",
          onPress: async () => {
            try {
              await financeService.cancelInvoice(id!);
              Alert.alert("Thành công", "Đã hủy hóa đơn.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể hủy hóa đơn.",
              );
            }
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Xóa hóa đơn",
      "Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await financeService.deleteInvoice(id!);
              Alert.alert("Đã xóa", "Hóa đơn đã được xóa.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể xóa hóa đơn.",
              );
            }
          },
        },
      ],
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
        <Text style={styles.headerTitle}>Chi tiết hóa đơn</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* ID card */}
          <View style={styles.idCard}>
            <Ionicons name="receipt-outline" size={32} color="#20a9e7" />
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={styles.invoiceId}>Mã HĐ: #{id?.slice(-8)}</Text>
              <Text style={styles.invoiceNote}>
                Nhấn các nút bên dưới để thực hiện hành động
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Thao tác hóa đơn</Text>

            <TouchableOpacity
              style={styles.collectBtn}
              onPress={handleCollect}
              accessibilityLabel="Thu tiền hóa đơn"
            >
              <Ionicons
                name="cash-outline"
                size={20}
                color={Colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.actionBtnText}>Thu tiền (Tiền mặt)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              accessibilityLabel="Hủy hóa đơn"
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={Colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.actionBtnText}>Hủy hóa đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              accessibilityLabel="Xóa hóa đơn"
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={Colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.actionBtnText}>Xóa hóa đơn</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  idCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    ...Shadows.sm,
  },
  invoiceId: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  invoiceNote: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  collectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DB954",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#20a9e7",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  actionBtnText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base,
  },
});
