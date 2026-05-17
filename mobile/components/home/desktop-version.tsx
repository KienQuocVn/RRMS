/**
 * DesktopVersion - "Quản lý trên MÁY TÍNH"
 * Card hướng dẫn truy cập phiên bản web
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

export default function DesktopVersion() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quản lý trên MÁY TÍNH</Text>
      <Text style={styles.sectionSubtitle}>
        Trải nghiệm tốt hơn với phiên bản MÁY TÍNH
      </Text>

      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="desktop-outline" size={28} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>Phiên bản máy tính</Text>
            <Text style={styles.cardDescription}>
              Ngoài điện thoại & Ipad bạn có thể quản lý bằng máy tính.
            </Text>
          </View>
        </View>

        {/* Instructions box */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            <Text style={styles.bold}>Bước 1:</Text> Vui lòng truy cập{" "}
            <Text style={styles.bold}>"bằng máy tính"</Text> vào{"\n"}
            <Text style={styles.linkText}>https://rrms.vn</Text>
          </Text>
          <Text style={[styles.instructionText, { marginTop: 8 }]}>
            <Text style={styles.bold}>Bước 2:</Text> Đăng nhập & quản lý
          </Text>
        </View>
      </View>
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerText: {
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
  instructionBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  instructionText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: FontWeights.bold,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
    textDecorationLine: "underline",
  },
});
