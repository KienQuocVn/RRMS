/**
 * SupportFooter - Phần hỗ trợ cuối trang auth
 * Hiển thị: hotline, Zalo, phiên bản app.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { AppConstants } from '@/constants/theme';

interface SupportFooterProps {
  /** Hiển thị section hỗ trợ chi tiết (hotline, Zalo) */
  showSupportDetails?: boolean;
}

export default function SupportFooter({ showSupportDetails = true }: SupportFooterProps) {
  const handleCallPress = () => {
    Linking.openURL(`tel:${AppConstants.SUPPORT_PHONE}`);
  };

  return (
    <View style={styles.container}>
      {showSupportDetails && (
        <View style={styles.supportCard}>
          {/* Header hỗ trợ */}
          <View style={styles.supportHeader}>
            <View style={styles.liveIndicator} />
            <View style={styles.supportHeaderText}>
              <Text style={styles.supportTitle}>Hỗ trợ việc đăng nhập</Text>
              <Text style={styles.supportSubtitle}>{AppConstants.SUPPORT_AVAILABLE}</Text>
            </View>
          </View>

          {/* Hotline */}
          <TouchableOpacity style={styles.supportRow} onPress={handleCallPress}>
            <Ionicons name="call-outline" size={22} color={Colors.textPrimary} />
            <Text style={styles.supportRowText}>
              Gọi điện trực tiếp{' '}
              <Text style={styles.supportRowStatus}>(sẵn sàng)</Text>
            </Text>
          </TouchableOpacity>

          {/* Zalo */}
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.zaloIcon}>
              <Text style={styles.zaloIconText}>Zalo</Text>
            </View>
            <Text style={styles.supportRowText}>
              Chat/Gọi điện qua Zalo{' '}
              <Text style={styles.supportRowStatus}>(sẵn sàng)</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Version */}
      <Text style={styles.version}>
        Phiên bản {AppConstants.APP_VERSION} - {AppConstants.COPYRIGHT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  supportCard: {
    width: '100%',
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  supportHeader: {
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
  supportHeaderText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  supportSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  supportRowText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    fontWeight: FontWeights.medium,
  },
  supportRowStatus: {
    color: Colors.textSecondary,
    fontWeight: FontWeights.regular,
  },
  zaloIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.zaloBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zaloIconText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: FontWeights.bold,
  },
  version: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
