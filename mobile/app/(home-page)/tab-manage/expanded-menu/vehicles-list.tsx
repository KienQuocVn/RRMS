/**
 * VehiclesListScreen - Danh sách phương tiện
 * Dùng cho: Hiển thị danh sách xe/phương tiện của khách thuê
 * Điều hướng từ: ManagementMenu > "Danh sách xe"
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
export default function VehiclesListScreen() {
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
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Danh sách phương tiện</Text>
          <Text style={styles.headerSubtitle}>Quản lý phương tiện</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Thêm phương tiện"
        >
          <Ionicons
            name="add"
            size={16}
            color={Colors.textPrimary}
            style={{ marginRight: 2 }}
          />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* ── Vehicle Count ── */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>0 Phương tiện</Text>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cube-outline" size={64} color={Colors.gray300} />
          <View style={styles.emptySearchIcon}>
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
          </View>
        </View>
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Không có dữ liệu!</Text>
      </View>

      {/* ── Bottom Search Bar ── */}
      <View style={styles.bottomSearchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập phòng/Tên khách/Biển số..."
          placeholderTextColor={Colors.gray400}
          accessibilityLabel="Tìm kiếm phương tiện"
        />
        <TouchableOpacity
          style={styles.searchIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tìm kiếm"
        >
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
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
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  addButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },

  // Count bar
  countBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  countText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Spacing["5xl"],
  },
  emptyIconWrap: {
    position: "relative",
    marginBottom: Spacing.lg,
  },
  emptySearchIcon: {
    position: "absolute",
    top: -8,
    right: -12,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyStateDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // Bottom search bar
  bottomSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  searchIconBtn: {
    marginLeft: Spacing.md,
  },
});
