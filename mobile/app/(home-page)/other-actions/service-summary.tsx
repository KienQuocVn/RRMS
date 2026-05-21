/**
 * ServiceSummaryScreen - Tổng kết khách sử dụng dịch vụ
 * Dùng cho: Thống kê dịch vụ điện nước, wifi... khách sử dụng theo tháng
 * Điều hướng từ: OtherActions > "Tổng kết dịch vụ khách sử dụng"
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Component ──
export default function ServiceSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tổng kết khách sử dụng dịch vụ</Text>
      </View>

      {/* ── Month Selector ── */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthNavBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tháng trước"
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={styles.monthNavText}>{'Tháng\ntrước'}</Text>
        </TouchableOpacity>

        <View style={styles.monthCenter}>
          <Text style={styles.monthCenterLabel}>Tháng sử dụng</Text>
          <Text style={styles.monthCenterValue}>Tháng 4, 2026</Text>
        </View>

        <TouchableOpacity
          style={styles.monthNavBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tháng tiếp theo"
        >
          <Text style={styles.monthNavText}>{'Tháng\ntiếp theo'}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Khách thuê chưa sử dụng dịch vụ trong tháng{'\n'}
          <Text style={styles.emptyStateMonth}>4/2026</Text>
        </Text>
      </View>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Month selector
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  monthNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  monthCenter: {
    alignItems: 'center',
  },
  monthCenterLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  monthCenterValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: '#FF9800',
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateMonth: {
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
  },
});
