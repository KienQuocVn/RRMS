/**
 * RoomDepositScreen - Màn hình thống kê tiền cọc phòng
 * Dùng cho: Thống kê và quản lý các phòng hiện tại đã thu tiền cọc của khách thuê khi đang ở
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

export default function RoomDepositScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const Header = () => (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
        },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thống kê tiền cọc</Text>
    </View>
  );

  const AlertBanner = () => (
    <View
      style={[
        styles.alertBanner,
        { backgroundColor: "#E8F5E9", borderColor: "#81C784" },
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={24}
        color={Colors.success}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.alertText, { color: Colors.success }]}>
        Thống kê danh sách phòng hiện tại{" "}
        <Text style={{ fontWeight: "bold" }}>
          Đã thu tiền cọc
        </Text>
      </Text>
    </View>
  );

  const DepositCard = () => (
    <View style={styles.card}>
      {/* ── Top Info Row ── */}
      <View style={styles.cardHeader}>
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <View style={styles.dateBadgeTop}>
            <Text style={styles.dateBadgeTopText}>T.4</Text>
          </View>
          <View style={styles.dateBadgeBottom}>
            <Text style={styles.dateBadgeBottomText}>2026</Text>
          </View>
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <Text style={styles.roomTitle}>
            Phòng 1 <Text style={styles.dateSubtext}>(18/04/2026)</Text>
          </Text>
          <Text style={styles.descText}>Tiền đặt cọc hợp đồng thuê</Text>

          <View style={styles.appStatusRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color={Colors.success}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.appStatusText}>Hợp đồng đang hiệu lực</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              <Text style={styles.tagText}>Đã thu cọc</Text>
            </View>
          </View>
        </View>

        {/* Detail Button */}
        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailBtnText}>Chi tiết</Text>
          <Ionicons name="chevron-forward" size={12} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* ── Action Buttons Row ── */}
      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.actionGridBtn, styles.actionCall]}>
          <Ionicons
            name="call"
            size={16}
            color="#2196F3"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.actionGridText, { color: "#2196F3" }]}>Gọi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionGridBtn}>
          <Ionicons
            name="cash-outline"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionGridText}>Hoàn cọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionGridBtn}>
          <Ionicons
            name="add-circle-outline"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionGridText}>Thu thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionGridBtn, { borderRightWidth: 0 }]}
        >
          <Ionicons
            name="print-outline"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionGridText}>In phiếu</Text>
        </TouchableOpacity>
      </View>

      {/* ── Money Summary Row ── */}
      <View style={styles.moneySummary}>
        <View style={[styles.moneyCol, { backgroundColor: "#F9FAFB" }]}>
          <Text style={styles.moneyLabel}>Tiền cọc yêu cầu</Text>
          <Text style={styles.moneyValue}>3.000.000 đ</Text>
        </View>
        <View
          style={[
            styles.moneyCol,
            { backgroundColor: "#E8F5E9", marginHorizontal: 8 },
          ]}
        >
          <Text style={styles.moneyLabel}>Đã thu</Text>
          <Text style={[styles.moneyValue, { color: "#4CAF50" }]}>3.000.000 đ</Text>
        </View>
        <View style={[styles.moneyCol, { backgroundColor: "#FFF3E0" }]}>
          <Text style={styles.moneyLabel}>Còn thiếu</Text>
          <Text style={[styles.moneyValue, { color: "#F57C00" }]}>
            0 đ
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <AlertBanner />
        <DepositCard />
      </ScrollView>
    </View>
  );
}

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
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing["4xl"],
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  dateBadge: {
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginRight: Spacing.sm,
  },
  dateBadgeTop: {
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    alignItems: "center",
  },
  dateBadgeTopText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  dateBadgeBottom: {
    backgroundColor: Colors.white,
    paddingVertical: 4,
    alignItems: "center",
  },
  dateBadgeBottomText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  infoCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  roomTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 13,
    fontWeight: "normal",
    color: Colors.textSecondary,
  },
  descText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  appStatusText: {
    fontSize: 12,
    color: Colors.success,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailBtnText: {
    color: "#2196F3",
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 2,
  },
  actionGrid: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  actionGridBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    backgroundColor: Colors.white,
  },
  actionCall: {
    backgroundColor: "#F0F8FF",
  },
  actionGridText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  moneySummary: {
    flexDirection: "row",
  },
  moneyCol: {
    flex: 1,
    borderRadius: 6,
    padding: Spacing.sm,
    alignItems: "center",
  },
  moneyLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  moneyValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
