/**
 * NotificationBanner - Banner nhắc bật thông báo
 * Có thể dismiss. Hiển thị icon chuông + message.
 */

import React, { useState } from "react";
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

interface NotificationBannerProps {
  onEnablePress?: () => void;
}

export default function NotificationBanner({
  onEnablePress,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setVisible(false)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color={Colors.gray400} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Bell icon with badge */}
        <View style={styles.iconWrap}>
          <Ionicons name="notifications" size={32} color={Colors.warning} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </View>

        {/* Message */}
        <View style={styles.textWrap}>
          <Text style={styles.title}>Cho phép điện thoại nhận thông báo!</Text>
          <Text style={styles.description}>
            Phần mềm sẽ không hoạt động đúng nếu bạn không cho phép nhận thông
            báo
          </Text>
        </View>
      </View>

      {/* Action button */}
      <TouchableOpacity style={styles.actionBtn} onPress={onEnablePress}>
        <Ionicons
          name="settings-outline"
          size={18}
          color={Colors.textPrimary}
        />
        <Text style={styles.actionText}>Cho phép nhận thông báo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    margin: Spacing.base,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.md,
  },
  closeBtn: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconWrap: {
    marginRight: Spacing.md,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray50,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
});
