/**
 * MotelSettingsScreen - Cài đặt nhà cho thuê
 * Dùng cho: Tổng hợp các cài đặt cơ bản và nâng cao cho nhà trọ
 * Điều hướng từ: ManagementMenu > "Cài đặt nhà trọ"
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Interface ──
interface SettingsMenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isPro?: boolean;
}

// ── Settings Data ──
const BASIC_SETTINGS: SettingsMenuItem[] = [
  {
    id: 'room-groups',
    icon: 'grid-outline',
    title: 'Nhóm phòng theo dãy/tầng',
    description: 'Gom phòng theo là tầng, dãy, khu... để quản lý tốt hơn.',
  },
  {
    id: 'price-increase',
    icon: 'trending-up-outline',
    title: 'Tăng giá thuê',
    description: 'Tăng giá thuê cho tất cả phòng hoặc chỉ 1 số phòng',
  },
  {
    id: 'services',
    icon: 'apps-outline',
    title: 'Dịch vụ',
    description: 'Tiền điện, nước, tiền rác, tiền wifi hay các tiền phụ thu khác...',
  },
  {
    id: 'invoice-settings',
    icon: 'document-text-outline',
    title: 'Cài đặt hóa đơn',
    description: 'Các cài đặt hóa đơn như: Làm tròn, hình thức thanh toán, gửi tự qua ZALO, mã QR...',
  },
  {
    id: 'bank-account',
    icon: 'card-outline',
    title: 'Cài đặt tài khoản ngân hàng',
    description: 'Tài khoản cho khách thanh toán tiền thuê, gạch nợ tự động, hiện hiện mã QR trên hóa đơn',
    isPro: true,
  },
  {
    id: 'income-expense',
    icon: 'receipt-outline',
    title: 'Cài đặt thu/chi',
    description: 'Cài danh mục, báo cáo... thu/chi',
  },
  {
    id: 'tenant-app',
    icon: 'phone-portrait-outline',
    title: 'APP dành cho khách thuê',
    description: 'Mật khẩu tài khoản khách, cho phép cập nhật thông tin...',
    isPro: true,
  },
  {
    id: 'toggle-features',
    icon: 'settings-outline',
    title: 'Bật / Tắt tính năng',
    description: 'Bật / tắt chức năng như: quản lý xe, tài sản...',
  },
];

const ADVANCED_SETTINGS: SettingsMenuItem[] = [
  {
    id: 'rules',
    icon: 'book-outline',
    title: 'Nội quy và giờ giấc',
    description: 'Thêm nội quy và giờ giấc cho người thuê. Khi đăng tin bạn sẽ sử dụng thông tin này',
  },
  {
    id: 'amenities',
    icon: 'ellipsis-horizontal-outline',
    title: 'Tiện ích cho thuê',
    description: 'Khi đăng tin bạn sẽ sử dụng thông tin này để thu hút khách thuê trọ',
  },
];

// ── Component ──
export default function MotelSettingsScreen() {
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
        <Text style={styles.headerTitle}>Cài đặt nhà cho thuê</Text>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cài đặt cơ bản ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <View>
            <Text style={styles.sectionTitle}>Cài đặt cơ bản</Text>
            <Text style={styles.sectionSubtitle}>
              Một số thiết lập cơ bản cho hệ thống cho thuê của bạn
            </Text>
          </View>
        </View>

        {BASIC_SETTINGS.map((item) => (
          <SettingsRow key={item.id} item={item} />
        ))}

        {/* ── Cài đặt nâng cao ── */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.sm }]}>
          <View style={styles.sectionIndicator} />
          <View>
            <Text style={styles.sectionTitle}>Cài đặt nâng cao</Text>
            <Text style={styles.sectionSubtitle}>
              Một số thiết lập nâng cao cho hệ thống quản lý
            </Text>
          </View>
        </View>

        {ADVANCED_SETTINGS.map((item) => (
          <SettingsRow key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

// ── Settings Row Sub-Component ──
function SettingsRow({ item }: { item: SettingsMenuItem }) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityLabel={item.title}
    >
      <View style={styles.settingsIconWrap}>
        <Ionicons name={item.icon} size={22} color={Colors.textSecondary} />
      </View>
      <View style={styles.settingsContent}>
        <View style={styles.settingsTitleRow}>
          <Text style={styles.settingsTitle}>{item.title}</Text>
          {item.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        <Text style={styles.settingsDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
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
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionIndicator: {
    width: 4,
    height: 36,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Settings row
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingsContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  settingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  settingsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  settingsDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // PRO badge
  proBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
