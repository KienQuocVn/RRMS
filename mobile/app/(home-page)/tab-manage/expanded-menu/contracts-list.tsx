/**
 * ContractsListScreen - Danh sách hợp đồng
 * Dùng cho: Hiển thị danh sách hợp đồng với bộ lọc theo phòng và trạng thái
 * Điều hướng từ: ManagementMenu > "Quản lý hợp đồng"
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
export default function ContractsListScreen() {
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
        <Text style={styles.headerTitle}>Danh sách hợp đồng</Text>
      </View>

      {/* ── Filter Dropdowns ── */}
      <View style={styles.filterDropdowns}>
        <TouchableOpacity
          style={styles.dropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Chọn phòng"
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownLabel}>Chọn phòng</Text>
            <Text style={styles.dropdownValue}>Chọn giá trị</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdown}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Trạng thái hợp đồng"
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownLabel}>Trạng thái hợp đồng</Text>
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
        <Text style={styles.emptyStateDesc}>
          Hiện tại chưa có hợp đồng nào được tạo. Hãy Lập hợp đồng mới
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
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Dropdowns
  filterDropdowns: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    paddingHorizontal: Spacing.xl,
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
    marginBottom: Spacing.sm,
  },
  emptyStateDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
