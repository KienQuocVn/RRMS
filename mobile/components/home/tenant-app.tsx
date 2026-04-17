/**
 * TenantApp - "APP dành riêng khách thuê"
 * Card giới thiệu app khách thuê với rating, buttons chia sẻ/cài đặt
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface TenantAppProps {
  onSharePress?: () => void;
  onInstallPress?: () => void;
  onLearnMorePress?: () => void;
}

export default function TenantApp({ onSharePress, onInstallPress, onLearnMorePress }: TenantAppProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>APP dành riêng khách thuê</Text>
      <Text style={styles.sectionSubtitle}>
        Dùng để nhận hóa đơn hàng tháng, thông báo, thanh toán tiền...
      </Text>

      <View style={styles.card}>
        {/* App info row */}
        <View style={styles.appInfoRow}>
          <View style={styles.appIconWrap}>
            <Ionicons name="apps" size={28} color={Colors.primary} />
          </View>
          <View style={styles.appInfo}>
            <View style={styles.appNameRow}>
              <Text style={styles.appName}>APP cho khách thuê</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Miễn phí</Text>
              </View>
            </View>
            {/* Rating */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#FFC107" />
              ))}
              <Ionicons name="star-half" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>4.4 - 1.000+ Rating</Text>
            </View>
            <Text style={styles.appDescription} numberOfLines={2}>
              Hơn <Text style={styles.highlight}>10.000+</Text> khách thuê tiềm năng. Gửi hóa đơn tự động, báo cáo sự cố, chốt đồng hồ...
            </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Website https://rrms.vn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineBtn} onPress={onSharePress}>
            <Ionicons name="share-outline" size={16} color={Colors.primary} />
            <Text style={styles.outlineBtnText}>Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledBtn} onPress={onInstallPress}>
            <Ionicons name="download-outline" size={16} color={Colors.white} />
            <Text style={styles.filledBtnText}>Cài đặt</Text>
          </TouchableOpacity>
        </View>

        {/* Learn more */}
        <TouchableOpacity style={styles.learnMoreBtn} onPress={onLearnMorePress}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.learnMoreText}>Tìm hiểu thêm</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
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
  appInfoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  appIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  appInfo: {
    flex: 1,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  appName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  freeBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  freeBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  appDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  highlight: {
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  linkText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
  },
  outlineBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.primary,
  },
  filledBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  filledBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
  },
  learnMoreText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
