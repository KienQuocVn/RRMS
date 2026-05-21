/**
 * InvoicesListScreen - Tất cả hóa đơn
 * Dùng cho: Hiển thị danh sách hóa đơn với bộ lọc theo tháng và trạng thái
 * Điều hướng từ: ManagementMenu > "Quản lý hóa đơn"
 */

import React, { useState } from 'react';
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
export default function InvoicesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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
        <Text style={styles.headerTitle}>Tất cả hóa đơn</Text>
      </View>

      {/* ── Filter Bar ── */}
      <View style={styles.filterBar}>
        <View style={styles.filterLabelRow}>
          <Ionicons name="filter-outline" size={16} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.filterLabel}>Lọc theo</Text>
        </View>
        <TouchableOpacity
          style={styles.advancedSearch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tìm nâng cao"
        >
          <Text style={styles.advancedSearchText}>Tìm nâng cao</Text>
          <Ionicons name="arrow-down" size={14} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Filter Dropdowns ── */}
      <View style={styles.filterDropdowns}>
        <TouchableOpacity
          style={styles.dropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn tháng lập hóa đơn"
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownLabel}>Tháng lập hóa đơn</Text>
            <Text style={styles.dropdownValue}>Chọn tháng</Text>
          </View>
          <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn trạng thái hóa đơn"
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownLabel}>Trạng thái hóa đơn</Text>
            <Text style={styles.dropdownValue}>Chọn giá trị</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Empty State ── */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cube-outline" size={64} color={Colors.gray300} />
          <View style={styles.emptySearchIcon}>
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
          </View>
        </View>
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Không có hóa đơn nào</Text>
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
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  advancedSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  advancedSearchText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    textDecorationLine: 'underline',
  },

  // Dropdowns
  filterDropdowns: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dropdownValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing['5xl'],
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
});
