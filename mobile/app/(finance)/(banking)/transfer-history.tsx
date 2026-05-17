/**
 * TransferHistoryScreen - Danh sách booking / Lịch sử khách chuyển khoản
 * Dùng cho: Xem lịch sử giao dịch chuyển khoản, booking môi giới
 * Điều hướng từ: OtherActions > "Lịch sử KHÁCH CHUYỂN KHOẢN"
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
export default function TransferHistoryScreen() {
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
          <Text style={styles.headerTitle}>Danh sách booking</Text>
          <Text style={styles.headerSubtitle}>Môi giới tìm khách chuyên nghiệp</Text>
        </View>
        <TouchableOpacity
          style={styles.historyBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Lịch sử"
        >
          <Ionicons name="time-outline" size={20} color={Colors.textPrimary} />
          <Text style={styles.historyBtnText}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập mã giao dịch..."
            placeholderTextColor={Colors.gray400}
            accessibilityLabel="Tìm kiếm mã giao dịch"
          />
          <TouchableOpacity
            style={styles.searchIconInner}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Tìm kiếm"
          >
            <Ionicons name="search" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Bộ lọc"
        >
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>1</Text>
          </View>
          <Ionicons name="filter-outline" size={20} color={Colors.textPrimary} />
          <Text style={styles.filterBtnText}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {/* ── Empty State with Illustration ── */}
      <View style={styles.emptyStateContainer}>
        {/* Illustration icons */}
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationCard}>
            <View style={styles.illustrationLine} />
            <View style={styles.illustrationLineShort} />
            <View style={[styles.illustrationDot, { backgroundColor: '#FF9800', top: 8, left: 8 }]} />
            <View style={[styles.illustrationDot, { backgroundColor: '#E91E63', bottom: 12, left: 16 }]} />
          </View>
          <View style={styles.illustrationBulb}>
            <Ionicons name="bulb-outline" size={24} color={Colors.white} />
          </View>
          <View style={[styles.sparkle, { top: 4, left: 20 }]}>
            <Ionicons name="add" size={12} color="#9C27B0" />
          </View>
        </View>

        <Text style={styles.emptyTitle}>Thất thoát doanh thu vì phòng trống</Text>
        <Text style={styles.emptyDesc}>
          Đừng lo bạn chỉ cần booking chuyên viên chúng tôi sẽ hỗ trợ bạn lắp phòng với độ phủ cao và tốc độ lắp phòng nhanh LOIZIDO đã hỗ trợ các chủ nhà lắp phòng nhanh chóng
        </Text>

        {/* Add button */}
        <TouchableOpacity
          style={styles.addBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Thêm booking"
        >
          <Ionicons name="add-circle-outline" size={20} color={Colors.textSuccess} style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm mới"
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
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyBtnText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    textDecorationLine: 'underline',
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  searchInputWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingRight: Spacing['2xl'],
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  searchIconInner: {
    position: 'absolute',
    right: Spacing.md,
  },
  filterBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
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
  filterBtnText: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  illustrationWrap: {
    width: 140,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  illustrationCard: {
    width: 100,
    height: 80,
    backgroundColor: '#FFF9C4',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    position: 'relative',
  },
  illustrationLine: {
    width: '70%',
    height: 6,
    backgroundColor: '#FFE082',
    borderRadius: 3,
    marginBottom: 8,
    marginTop: 16,
  },
  illustrationLineShort: {
    width: '50%',
    height: 6,
    backgroundColor: '#FFE082',
    borderRadius: 3,
  },
  illustrationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  illustrationBulb: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#26C6DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  emptyTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptyDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['3xl'],
    width: '100%',
  },
  addBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: '#4CAF50',
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
