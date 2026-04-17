/**
 * ZaloHistoryScreen - Lịch sử gửi Zalo
 * Dùng cho: Xem lịch sử gửi hóa đơn tự động qua ZALO theo tháng
 * Điều hướng từ: OtherActions > "Lịch sử gửi ZALO"
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
export default function ZaloHistoryScreen() {
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
          <Text style={styles.headerTitle}>Lịch sử gửi Zalo</Text>
          <Text style={styles.headerSubtitle}>Lịch sử gửi hóa đơn qua ZALO</Text>
        </View>
        <TouchableOpacity
          style={styles.previewBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Gửi xem trước"
        >
          <Ionicons name="send-outline" size={14} color={Colors.white} style={{ marginRight: 4 }} />
          <Text style={styles.previewBtnText}>Gửi xem trước</Text>
        </TouchableOpacity>
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
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cube-outline" size={64} color={Colors.gray300} />
          <View style={styles.emptySearchIcon}>
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
          </View>
        </View>
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Không có dữ liệu!</Text>
      </View>

      {/* ── Bottom Search Bar ── */}
      <View style={styles.bottomSearchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập số điện thoại..."
          placeholderTextColor={Colors.gray400}
          accessibilityLabel="Tìm kiếm theo số điện thoại"
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
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0068FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  previewBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.white,
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
