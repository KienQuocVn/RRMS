/**
 * BrokerManagementScreen - Quản lý môi giới
 * Dùng cho: Quản lý danh sách môi giới, dẫn khách, lắp phòng cấp tốc
 * Điều hướng từ: ExpandedMenu > "Quản lý môi giới"
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Component ──
export default function BrokerManagementScreen() {
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
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Quản lý môi giới</Text>
          <Text style={styles.headerSubtitle}>Dẫn khách, lắp phòng cấp tốc</Text>
        </View>
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
        <Text style={styles.emptyStateDesc}>Không có dữ liệu!</Text>
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm môi giới mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      {/* ── Bottom Search Bar ── */}
      <View style={styles.bottomSearchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên/sdt môi giới"
          placeholderTextColor={Colors.gray400}
          accessibilityLabel="Tìm kiếm môi giới"
        />
        <TouchableOpacity
          style={styles.searchIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tìm kiếm"
        >
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
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

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },

  // Bottom search bar
  bottomSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  searchIconBtn: {
    marginLeft: Spacing.md,
  },
});
