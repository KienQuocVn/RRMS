/**
 * TenantsListScreen - Danh sách khách thuê
 * Dùng cho: Hiển thị danh sách khách thuê với bộ lọc, tìm kiếm, chia sẻ excel
 * Điều hướng từ: ManagementMenu > "Quản lý khách thuê"
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

// ── Component ──
export default function TenantsListScreen() {
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
          <Ionicons name="arrow-back" size={24} color={Colors.textSuccess} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách khách thuê</Text>
      </View>

      {/* ── Action Bar ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.exportBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chia sẻ excel"
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.exportBtnText}>Chia sẻ excel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.oldTenantBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quản lý khách cũ"
        >
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.oldTenantBtnText}>Quản lý khách cũ</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.white}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      </View>

      {/* ── Filter & Search Row ── */}
      <View style={styles.filterSearchRow}>
        <TouchableOpacity
          style={styles.dropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn phòng"
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownLabel}>Chọn phòng</Text>
            <Text style={styles.dropdownValue}>Chọn giá trị</Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={18}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.searchInputWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập SĐT/tên tìm kiếm..."
            placeholderTextColor={Colors.gray400}
            accessibilityLabel="Tìm kiếm khách thuê"
          />
          <Ionicons
            name="search"
            size={20}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
        </View>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cube-outline" size={64} color={Colors.gray300} />
        </View>
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Chưa có khách thuê nào...</Text>
        <Text style={styles.emptyStateHint}>
          Bạn chưa "Lập hợp đồng mới" nào cho nhà trọ của bạn
        </Text>
      </View>
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
    color: Colors.textSuccess,
  },

  // Action bar
  actionBar: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  exportBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  oldTenantBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textSuccess,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  oldTenantBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },

  // Filter & Search
  filterSearchRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdown: {
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dropdownValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textSuccess,
  },
  searchInputWrap: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingRight: Spacing["2xl"],
    fontSize: FontSizes.sm,
    color: Colors.textSuccess,
  },
  searchIcon: {
    position: "absolute",
    right: Spacing.md,
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["5xl"],
  },
  emptyIconWrap: {
    marginBottom: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textSuccess,
    marginBottom: Spacing.xs,
  },
  emptyStateDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  emptyStateHint: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
