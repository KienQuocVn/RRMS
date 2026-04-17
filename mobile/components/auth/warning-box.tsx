/**
 * WarningBox - Box cảnh báo/thông tin
 * Dùng cho Forgot Password screen (cảnh báo xác minh SĐT).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface WarningBoxProps {
  /** Nội dung cảnh báo */
  message: string;
  /** Variant hiển thị */
  variant?: 'warning' | 'info' | 'error';
}

export default function WarningBox({ message, variant = 'warning' }: WarningBoxProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <View style={[styles.container, { backgroundColor: variantStyles.bg, borderColor: variantStyles.border }]}>
      <Ionicons
        name={variantStyles.icon as any}
        size={20}
        color={variantStyles.iconColor}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: variantStyles.textColor }]}>{message}</Text>
    </View>
  );
}

function getVariantStyles(variant: 'warning' | 'info' | 'error') {
  switch (variant) {
    case 'warning':
      return {
        bg: Colors.warningLight,
        border: Colors.warningBorder,
        icon: 'warning-outline',
        iconColor: Colors.warning,
        textColor: Colors.gray800,
      };
    case 'info':
      return {
        bg: '#E3F2FD',
        border: '#90CAF9',
        icon: 'information-circle-outline',
        iconColor: Colors.info,
        textColor: Colors.gray800,
      };
    case 'error':
      return {
        bg: '#FFEBEE',
        border: '#EF9A9A',
        icon: 'alert-circle-outline',
        iconColor: Colors.error,
        textColor: Colors.gray800,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  icon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
