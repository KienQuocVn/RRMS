/**
 * AuthLogo - Logo và tagline RRMS
 * Dùng chung cho tất cả màn hình auth (Login, Register, ForgotPassword).
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";

interface AuthLogoProps {
  /** Kích thước logo - nhỏ hơn cho Register/ForgotPassword */
  size?: "normal" | "small";
}

export default function AuthLogo({ size = "normal" }: AuthLogoProps) {
  const logoSize = size === "normal" ? 80 : 60;

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={[styles.appName, size === "small" && styles.appNameSmall]}>
          RRMS
        </Text>
        <Text style={[styles.tagline, size === "small" && styles.taglineSmall]}>
          Quản lý <Text style={styles.taglineHighlight}>NHÀ CHO THUÊ</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
  logo: {
    marginBottom: Spacing.sm,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  appNameSmall: {
    fontSize: FontSizes.xl,
  },
  tagline: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  taglineSmall: {
    fontSize: FontSizes.sm,
  },
  taglineHighlight: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
  },
});
