/**
 * AuthButton - Button đa năng cho auth screens
 * Variants: primary (filled xanh lá), outline, social (Zalo, Apple).
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

type ButtonVariant = "primary" | "outline" | "social-zalo" | "social-apple";

interface AuthButtonProps {
  /** Nội dung hiển thị trên button */
  title: string;
  /** Kiểu button */
  variant?: ButtonVariant;
  /** Callback khi nhấn */
  onPress?: () => void;
  /** Trạng thái loading */
  loading?: boolean;
  /** Vô hiệu hóa button */
  disabled?: boolean;
  /** Icon name (Ionicons) hiển thị bên trái */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Màu icon custom */
  iconColor?: string;
}

export default function AuthButton({
  title,
  variant = "primary",
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconColor,
}: AuthButtonProps) {
  const buttonStyles = getButtonStyles(variant);
  const textStyles = getTextStyles(variant);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, buttonStyles, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={iconColor || textStyles.color}
              style={styles.icon}
            />
          )}
          <Text style={[styles.textBase, textStyles]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ============================================================
// Style helpers theo variant
// ============================================================

function getButtonStyles(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: Colors.primary,
        borderWidth: 0,
        ...Shadows.sm,
      };
    case "outline":
      return {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.primary,
      };
    case "social-zalo":
      return {
        backgroundColor: Colors.zaloBlue,
        borderWidth: 0,
      };
    case "social-apple":
      return {
        backgroundColor: Colors.black,
        borderWidth: 0,
      };
    default:
      return {};
  }
}

function getTextStyles(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return { color: Colors.white };
    case "outline":
      return { color: Colors.primary };
    case "social-zalo":
      return { color: Colors.white };
    case "social-apple":
      return { color: Colors.white };
    default:
      return { color: Colors.textPrimary };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: Spacing.sm,
  },
  textBase: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
  },
  disabled: {
    opacity: 0.6,
  },
});
