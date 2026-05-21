/**
 * HoldingDepositScreen - Màn hình thống kê tiền cọc giữ chỗ
 * Dùng cho: Thống kê và quản lý tiền cọc giữ chỗ của khách đặt phòng trước
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

export default function HoldingDepositScreen() {
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
      <Text style={styles.headerTitle}>Thống kê tiền cọc giữ chỗ</Text>
    </View>
  );

  const AlertBanner = () => (
    <View
      style={[
        styles.alertBanner,
        { backgroundColor: "#E0F7FA", borderColor: "#4DD0E1" },
      ]}
    >
      <Ionicons
        name="bookmark"
        size={24}
        color="#00BCD4"
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.alertText, { color: "#00BCD4" }]}>
        Thống kê danh sách phòng hiện tại{" "}
        <Text style={{ fontWeight: "bold" }}>
          Đã thu tiền cọc giữ chỗ
        </Text>
      </Text>
    </View>
  );

  const HoldingCard = () => (
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
          <Text style={styles.descText}>Tiền đặt cọc giữ chỗ phòng trống</Text>

          <View style={styles.appStatusRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#00BCD4"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.appStatusText}>Dự kiến nhận phòng: 25/04/2026</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagBadge}>
              <View style={[styles.dot, { backgroundColor: "#00BCD4" }]} />
              <Text style={styles.tagText}>Đang giữ chỗ</Text>
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
            name="home-outline"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionGridText}>Nhận phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionGridBtn}>
          <Ionicons
            name="close-circle-outline"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionGridText}>Hủy giữ</Text>
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
          <Text style={styles.actionGridText}>In</Text>
        </TouchableOpacity>
      </View>

      {/* ── Money Summary Row ── */}
      <View style={styles.moneySummary}>
        <View style={[styles.moneyCol, { backgroundColor: "#F9FAFB" }]}>
          <Text style={styles.moneyLabel}>Tiền giữ chỗ</Text>
          <Text style={styles.moneyValue}>1.000.000 đ</Text>
        </View>
        <View
          style={[
            styles.moneyCol,
            { backgroundColor: "#E0F7FA", marginHorizontal: 8 },
          ]}
        >
          <Text style={styles.moneyLabel}>Đã nhận</Text>
          <Text style={[styles.moneyValue, { color: "#00BCD4" }]}>1.000.000 đ</Text>
        </View>
        <View style={[styles.moneyCol, { backgroundColor: "#F9FAFB" }]}>
          <Text style={styles.moneyLabel}>Hạn thanh lý</Text>
          <Text style={[styles.moneyValue, { color: Colors.textSecondary }]}>
            25/04
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
        <HoldingCard />
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
    backgroundColor: "#00BCD4",
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
    color: "#00BCD4",
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
