/**
 * BankAccountScreen - Quản lý TK ngân hàng
 * Dùng cho: Kết nối tài khoản ngân hàng với , hiển thị thông tin, mã QR, gạch nợ tự động
 * Điều hướng từ: ExpandedMenu > "Quản lý tài khoản"
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

// ── Interface ──
interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

// ── Features Data ──
const FEATURES: FeatureItem[] = [
  {
    id: "show-info",
    title: "Hiển thị thông tin",
    description:
      "Hiển thị tài khoản ngân hàng của bạn trên hóa đơn giúp khách thanh toán dễ dàng",
  },
  {
    id: "show-qr",
    title: "Hiển thị mã QR",
    description: "Thanh toán nhanh hơn với mã QR trên hóa đơn",
  },
  {
    id: "auto-debit",
    title: "Gạch nợ tự động",
    description:
      "Khi khách chuyển khoản hệ thống tự động hoàn thành hóa đơn không cần làm thủ công",
  },
  {
    id: "cash-flow",
    title: "Quản lý dòng tiền",
    description: "Giúp bạn thống kê tiền ra, tiền vào tài khoản",
  },
];

// ── Component ──
export default function BankAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Quản lý TK ngân hàng</Text>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Connection Banner ── */}
        <View style={styles.connectionBanner}>
          {/* Top icons row */}
          <View style={styles.connectionIconsRow}>
            <View
              style={[styles.connectionIcon, { backgroundColor: "#E8F5E9" }]}
            >
              <Ionicons name="analytics-outline" size={28} color="#4CAF50" />
            </View>
            <View style={styles.connectionLine}>
              <View style={styles.lineSegment} />
              <View style={styles.connectionMiddleIcon}>
                <Ionicons
                  name="swap-horizontal"
                  size={20}
                  color={Colors.white}
                />
              </View>
              <View style={styles.lineSegment} />
            </View>
            <View
              style={[styles.connectionIcon, { backgroundColor: "#E3F2FD" }]}
            >
              <Ionicons name="film-outline" size={28} color="#1976D2" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.connectionTitle}>
            Kết nối tài khoản với RRMS
          </Text>
          <Text style={styles.connectionDesc}>
            Các ngân hàng hợp tác với RRMS
          </Text>

          {/* Bank logos */}
          <View style={styles.bankLogosRow}>
            <View style={styles.bankLogoWrap}>
              <View style={styles.freeLabel}>
                <Text style={styles.freeLabelText}>Miễn phí GD</Text>
              </View>
              <Text style={styles.bankLogoText}>BIDV</Text>
              <View style={styles.bankLogoDots}>
                <View
                  style={[styles.bankDot, { backgroundColor: "#FF9800" }]}
                />
                <View
                  style={[styles.bankDot, { backgroundColor: "#4CAF50" }]}
                />
                <View
                  style={[styles.bankDot, { backgroundColor: "#2196F3" }]}
                />
                <View
                  style={[styles.bankDot, { backgroundColor: "#F44336" }]}
                />
              </View>
            </View>
            <View style={styles.bankLogoWrap}>
              <Text style={styles.bankLogoTextMB}>
                <Text style={styles.mbStar}>✦ </Text>MB
              </Text>
            </View>
          </View>
        </View>

        {/* ── Features List ── */}
        <View style={styles.featuresCard}>
          {FEATURES.map((feature, index) => (
            <View
              key={feature.id}
              style={[
                styles.featureRow,
                index < FEATURES.length - 1 && styles.featureRowBorder,
              ]}
            >
              <View style={styles.featureCheckIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.learnMoreBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Tìm hiểu"
          >
            <Ionicons
              name="help-circle-outline"
              size={18}
              color="#4CAF50"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.learnMoreText}>Tìm hiểu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addAccountBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Thêm tài khoản"
          >
            <Ionicons
              name="add"
              size={18}
              color={Colors.white}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.addAccountText}>Thêm tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm tài khoản mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing["4xl"],
  },

  // Connection banner
  connectionBanner: {
    backgroundColor: "#E8F5E9",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  connectionIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  connectionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  connectionLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.sm,
  },
  lineSegment: {
    width: 28,
    height: 2,
    backgroundColor: Colors.gray300,
  },
  connectionMiddleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray500,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  connectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  connectionDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bankLogosRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  bankLogoWrap: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: "relative",
  },
  freeLabel: {
    position: "absolute",
    top: -8,
    left: -4,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeLabelText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: FontWeights.bold,
  },
  bankLogoText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#1565C0",
  },
  bankLogoDots: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  bankDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  bankLogoTextMB: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#1976D2",
  },
  mbStar: {
    color: "#7B1FA2",
  },

  // Features card
  featuresCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  featureCheckIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Action buttons
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  learnMoreBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  learnMoreText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: "#4CAF50",
  },
  addAccountBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  addAccountText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
});
