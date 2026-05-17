/**
 * FinanceSummaryScreen - Thu / chi & Tổng kết
 * Dùng cho: Quản lý khoản thu, chi và tổng kết tài chính theo tháng
 * Điều hướng từ: OtherActions > "Khoản thu / chi & Tổng kết"
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
export default function FinanceSummaryScreen() {
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
        <Text style={styles.headerTitle}>Thu / chi & Tổng kết</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Cài đặt"
        >
          <Ionicons name="settings-outline" size={18} color={Colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={styles.settingsBtnText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* ── Month Filter ── */}
      <View style={styles.monthFilter}>
        <TouchableOpacity
          style={styles.filterIconWrap}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Bộ lọc"
        >
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>1</Text>
          </View>
          <Ionicons name="filter-outline" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.monthDropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn tháng"
        >
          <Text style={styles.monthText}>Tháng 4, 2026</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Summary Cards ── */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="trending-up" size={14} color={Colors.textSuccess} style={{ marginRight: 4 }} />
              <Text style={styles.summaryLabel}>Khoản thu</Text>
            </View>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>+ 0 đ</Text>
          </View>
          <View style={styles.summaryCol}>
            <View style={styles.summaryLabelRow}>
              <Text style={styles.summaryLabel}>Khoản chi</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.textPrimary} style={{ marginLeft: 4 }} />
            </View>
            <Text style={[styles.summaryValue, { color: Colors.error }]}>- 0 đ</Text>
          </View>
          <View style={styles.summaryCol}>
            <View style={styles.summaryLabelRow}>
              <View style={styles.totalIcon}>
                <Ionicons name="calculator-outline" size={10} color={Colors.white} />
              </View>
              <Text style={styles.summaryLabel}>Tổng kết</Text>
            </View>
            <Text style={[styles.summaryValue, { color: '#FF9800' }]}>0 đ</Text>
          </View>
        </View>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cube-outline" size={64} color={Colors.gray300} />
          <View style={styles.emptySearchIcon}>
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
          </View>
        </View>
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Không có phiếu thu chi nào...</Text>
      </View>

      {/* ── Empty area below ── */}
      <View style={styles.emptyArea} />

      {/* ── Download Icon ── */}
      <TouchableOpacity
        style={styles.downloadBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Tải xuống"
      >
        <Ionicons name="chevron-down" size={28} color={Colors.textSuccess} />
        <Ionicons name="chevron-down" size={28} color={Colors.textSuccess} style={{ marginTop: -18 }} />
      </TouchableOpacity>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm phiếu thu chi"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
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
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  settingsBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },

  // Month filter
  monthFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterIconWrap: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeights.bold,
  },
  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCol: {
    alignItems: 'flex-start',
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  totalIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  // Empty state card
  emptyCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyIconWrap: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  emptySearchIcon: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyStateDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Empty area
  emptyArea: {
    flex: 1,
  },

  // Download button
  downloadBtn: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    alignItems: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
