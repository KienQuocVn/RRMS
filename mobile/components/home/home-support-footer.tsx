/**
 * HomeSupportFooter - "Kênh hỗ trợ của chúng tôi"
 * Hiển thị hotline + Zalo ở cuối trang chủ
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { AppConstants } from '@/constants/theme';

export default function HomeSupportFooter() {
  const handleCallPress = () => {
    Linking.openURL(`tel:${AppConstants.SUPPORT_PHONE}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.liveIndicator} />
        <View>
          <Text style={styles.title}>Kênh hỗ trợ của chúng tôi</Text>
          <Text style={styles.subtitle}>{AppConstants.SUPPORT_AVAILABLE}</Text>
        </View>
      </View>

      {/* Hotline */}
      <TouchableOpacity style={styles.supportRow} onPress={handleCallPress}>
        <Ionicons name="call-outline" size={24} color={Colors.textPrimary} />
        <Text style={styles.supportText}>
          Gọi điện trực tiếp <Text style={styles.statusText}>(sẵn sàng)</Text>
        </Text>
      </TouchableOpacity>

      {/* Zalo */}
      <TouchableOpacity style={styles.supportRow}>
        <View style={styles.zaloIcon}>
          <Text style={styles.zaloText}>Zalo</Text>
        </View>
        <Text style={styles.supportText}>
          Chat/Gọi điện qua Zalo <Text style={styles.statusText}>(sẵn sàng)</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  liveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  supportText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  statusText: {
    color: Colors.textSecondary,
    fontWeight: FontWeights.regular,
  },
  zaloIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.zaloBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zaloText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeights.bold,
  },
});
