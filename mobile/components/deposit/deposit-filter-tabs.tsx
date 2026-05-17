import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "@/constants/theme";
import { FilterTab } from "@/types/deposit.types";

interface DepositFilterTabsProps {
  activeFilter: FilterTab;
  setActiveFilter: (filter: FilterTab) => void;
}

export const DepositFilterTabs = ({
  activeFilter,
  setActiveFilter,
}: DepositFilterTabsProps) => (
  <View style={styles.filterContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterTabs}
    >
      {/* Tab: Tất cả */}
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === "all" && styles.filterTabActive,
        ]}
        onPress={() => setActiveFilter("all")}
        activeOpacity={0.7}
      >
        <Ionicons
          name="funnel-outline"
          size={14}
          color={activeFilter === "all" ? Colors.white : Colors.textSuccess}
          style={{ marginRight: 4 }}
        />
        <Text
          style={
            activeFilter === "all"
              ? styles.filterTextActive
              : styles.filterTextInactive
          }
        >
          Tất cả
        </Text>
        <View style={[styles.tabBadge, { backgroundColor: "#FF9800" }]}>
          <Text style={styles.tabBadgeText}>5</Text>
        </View>
      </TouchableOpacity>

      {/* Tab: Đang cọc giữ chỗ */}
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === "depositing"
            ? styles.filterTabActive
            : styles.filterTabInactive,
        ]}
        onPress={() => setActiveFilter("depositing")}
        activeOpacity={0.7}
      >
        <Text
          style={
            activeFilter === "depositing"
              ? styles.filterTextActive
              : styles.filterTextInactive
          }
        >
          Đang cọc giữ chỗ
        </Text>
        <View style={[styles.tabBadge, { backgroundColor: "#FF5722" }]}>
          <Text style={styles.tabBadgeText}>0</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    zIndex: 1,
  },
  filterTabs: {
    paddingHorizontal: Spacing.base,
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
    paddingTop: 12,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    position: "relative",
    overflow: "visible",
  },
  filterTabActive: {
    backgroundColor: Colors.textSuccess,
  },
  filterTabInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  filterTextActive: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  filterTextInactive: {
    color: Colors.textSuccess,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  tabBadge: {
    position: "absolute",
    top: -8,
    right: -6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
});
