/**
 * QuickActions - "Thao tác thường dùng"
 * Grid 3 cột x 2 hàng: Cọc giữ chỗ, Lập hợp đồng, Thanh lý, ...
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

interface QuickActionItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number | string;
  iconColor?: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "deposit",
    icon: "cash-outline",
    label: "Cọc giữ chỗ",
    iconColor: Colors.success,
  },
  {
    id: "contract",
    icon: "document-text-outline",
    label: "Lập hợp đồng mới",
    badge: 5,
    iconColor: "#FF9800",
  },
  {
    id: "checkout",
    icon: "log-out-outline",
    label: "Thanh lý\n(Trả phòng)",
    iconColor: "#2196F3",
  },
  {
    id: "invoice",
    icon: "receipt-outline",
    label: "Lập hóa đơn",
    iconColor: "#9C27B0",
  },
  {
    id: "bill",
    icon: "calculator-outline",
    label: "Chốt & Lập\nhóa đơn",
    iconColor: "#FF5722",
  },
  {
    id: "collect",
    icon: "wallet-outline",
    label: "Hóa đơn\ncần thu tiền",
    iconColor: "#E91E63",
  },
];

interface QuickActionsProps {
  onItemPress?: (id: string) => void;
}

export default function QuickActions({ onItemPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thao tác thường dùng</Text>
      <Text style={styles.sectionSubtitle}>
        Thực hiện tác vụ nhanh để quản lý nhà trọ
      </Text>

      <View style={styles.grid}>
        {QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => onItemPress?.(item.id)}
            activeOpacity={0.7}
          >
            {/* Icon container */}
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: `${item.iconColor}15` },
              ]}
            >
              <Ionicons name={item.icon} size={28} color={item.iconColor} />
              {/* Badge */}
              {item.badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "30%",
    alignItems: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  itemLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 16,
  },
});
