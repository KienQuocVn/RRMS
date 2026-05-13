/**
 * AssetsListScreen - Danh sách tài sản
 * Dùng cho: Hiển thị danh sách tài sản trong nhà cho thuê (sofa, tủ lạnh, bàn...)
 * Điều hướng từ: ManagementMenu > "Quản lý tài sản"
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
export default function AssetsListScreen() {
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
        <Text style={styles.headerTitle}>Danh sách tài sản</Text>
      </View>

      {/* ── Empty State Card ── */}
      <View style={styles.emptyCard}>
        {/* Asset Icons Row */}
        <View style={styles.assetIconsRow}>
          <View style={[styles.assetIconWrap, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="bed-outline" size={36} color="#FF7043" />
          </View>
          <View style={[styles.assetIconWrap, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="cube-outline" size={36} color="#42A5F5" />
          </View>
          <View style={[styles.assetIconWrap, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="desktop-outline" size={36} color="#AB47BC" />
          </View>
        </View>

        {/* Empty Message */}
        <Text style={styles.emptyTitle}>Hiện nhà cho có tài sản nào!</Text>
        <Text style={styles.emptyDesc}>
          Vui lòng thêm tài sản vào nhà cho thuê để quản lý
        </Text>
      </View>

      {/* ── Empty Area ── */}
      <View style={styles.emptyArea} />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm tài sản mới"
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
    backgroundColor: Colors.white,
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

  // Empty card
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  assetIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  assetIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Empty area below card
  emptyArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
