/**
 * ExpandedMenu - "Menu mở rộng"
 * Cards: Quản lý môi giới
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

interface ExpandedMenuProps {
  onBrokerPress?: () => void;
  onBankPress?: () => void;
  onLearnMorePress?: () => void;
}

export default function ExpandedMenu({
  onBrokerPress,
}: ExpandedMenuProps) {
  const router = useRouter();

  const handleBrokerPress = () => {
    if (onBrokerPress) {
      onBrokerPress();
    } else {
      router.push("/tab-manage/expanded-menu/broker-management" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Menu mở rộng</Text>
      <Text style={styles.sectionSubtitle}>Thiết lập tùy chọn nâng cao</Text>

      {/* Card 1: Quản lý môi giới */}
      <TouchableOpacity
        style={styles.card}
        onPress={handleBrokerPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Quản lý môi giới"
      >
        <View style={[styles.cardIcon, { backgroundColor: Colors.success }]}>
          <Ionicons name="megaphone-outline" size={28} color={Colors.white} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Quản lý môi giới</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            Giúp bạn quản lý môi giới lắp phòng của mình. Xây dựng quy trình lấy
            phòng, chính sách hoa hồng...
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
