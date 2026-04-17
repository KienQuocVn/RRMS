/**
 * ExpandedMenu - "Menu mở rộng"
 * Cards: Quản lý môi giới, Tài khoản ngân hàng (PRO)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface ExpandedMenuProps {
  onBrokerPress?: () => void;
  onBankPress?: () => void;
  onLearnMorePress?: () => void;
}

export default function ExpandedMenu({
  onBrokerPress,
  onBankPress,
  onLearnMorePress,
}: ExpandedMenuProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Menu mở rộng</Text>
      <Text style={styles.sectionSubtitle}>Thiết lập tùy chọn nâng cao</Text>

      {/* Card 1: Quản lý môi giới */}
      <TouchableOpacity style={styles.card} onPress={onBrokerPress} activeOpacity={0.7}>
        <View style={[styles.cardIcon, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="megaphone-outline" size={28} color={Colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Quản lý môi giới</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            Giúp bạn quản lý môi giới lắp phòng của mình. Xây dựng quy trình lấy phòng, chính sách hoa hồng...
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
      </TouchableOpacity>

      {/* Card 2: Tài khoản ngân hàng */}
      <View style={styles.bankCard}>
        <View style={styles.bankCardTop}>
          <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="card-outline" size={28} color="#1976D2" />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>Tài khoản ngân hàng</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.cardDescription} numberOfLines={3}>
              Giúp khách thanh toán tiền thuê nhà, Gạch nợ TỰ ĐỘNG khi khách chuyển khoản & hiện thị mã QR, chuyển khoản nhanh hơn.
            </Text>
          </View>
        </View>

        {/* Bank card buttons */}
        <View style={styles.bankButtons}>
          <TouchableOpacity style={styles.outlineBtn} onPress={onLearnMorePress}>
            <Ionicons name="help-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.outlineBtnText}>Tìm hiểu thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledBtn} onPress={onBankPress}>
            <Text style={styles.filledBtnText}>Quản lý tài khoản</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
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
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  proBadge: {
    backgroundColor: Colors.error,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  bankCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  bankCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  bankButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  },
  outlineBtnText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.primary,
  },
  filledBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  filledBtnText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },
});
