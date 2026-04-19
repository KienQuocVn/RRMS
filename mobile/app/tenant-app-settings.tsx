/**
 * TenantAppSettingsScreen - Cài đặt APP khách thuê
 * Dùng cho: Cấu hình các quyền và tính năng APP dành cho khách thuê
 * Điều hướng từ: ManagementMenu > "Cài đặt APP khách thuê"
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Interface ──
interface SettingToggleItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  defaultValue: boolean;
  helpLink?: string;
}

// ── Settings Data ──
const SETTING_TOGGLES: SettingToggleItem[] = [
  {
    id: 'auto-create-account',
    icon: 'person-circle-outline',
    iconBgColor: '#E8F5E9',
    iconColor: '#66BB6A',
    title: 'Tự động tạo tài khoản cho khách',
    description: 'Tự động tạo tài khoản cho khách sử dụng APP khi lập hợp đồng bằng SĐT',
    defaultValue: false,
  },
  {
    id: 'allow-meter-reading',
    icon: 'flash-outline',
    iconBgColor: '#E3F2FD',
    iconColor: '#42A5F5',
    title: 'Cho phép khách chốt đồng hồ',
    description: 'Khi tới kỳ hóa đơn khách thuê tự chốt điện nước.\nGiúp bạn tiết kiệm thời gian',
    defaultValue: false,
    helpLink: 'Tìm hiểu tính năng',
  },
  {
    id: 'allow-edit-tenant-info',
    icon: 'people-circle',
    iconBgColor: '#E8F5E9',
    iconColor: '#66BB6A',
    title: 'Cho phép thêm, sửa thông tin khách thuê',
    description: 'Khách có thể tự thêm thành viên, sửa thông tin thành viên',
    defaultValue: true,
  },
  {
    id: 'allow-edit-vehicle',
    icon: 'bicycle-outline',
    iconBgColor: '#FFF3E0',
    iconColor: '#FF9800',
    title: 'Cho phép thêm, sửa thông tin xe',
    description: 'Khách có thể tự thêm sửa thông tin xe của mình',
    defaultValue: true,
  },
  {
    id: 'allow-end-contract',
    icon: 'document-text-outline',
    iconBgColor: '#FCE4EC',
    iconColor: '#EF5350',
    title: 'Cho phép báo kết thúc hợp đồng online',
    description: 'Khách có thể báo kết thúc hợp đồng trên APP của mình',
    defaultValue: true,
  },
];

// ── Component ──
export default function TenantAppSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [password, setPassword] = useState('RRMS');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    SETTING_TOGGLES.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultValue }), {} as Record<string, boolean>)
  );

  const handleToggle = (id: string) => {
    setToggleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <Text style={styles.headerTitle}>Cài đặt APP khách thuê</Text>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Info Banner ── */}
        <TouchableOpacity
          style={styles.infoBanner}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Tìm hiểu APP dành cho khách thuê"
        >
          <View style={styles.infoBannerIcon}>
            <Ionicons name="phone-portrait-outline" size={28} color="#4CAF50" />
          </View>
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Tìm hiểu APP dành cho khách thuê</Text>
            <Text style={styles.infoBannerDesc}>
              Gửi hóa đơn tự động, hợp đồng online, tự chốt đồng hồ...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* ── Auto Create Account Toggle ── */}
        <SettingToggleRow
          item={SETTING_TOGGLES[0]}
          value={toggleStates[SETTING_TOGGLES[0].id]}
          onToggle={() => handleToggle(SETTING_TOGGLES[0].id)}
        />

        {/* ── Password Section ── */}
        <View style={styles.passwordSection}>
          <Text style={styles.passwordLabel}>
            Mật khẩu tài khoản cho khách <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.passwordHint}>
            Mật khẩu mặc định dùng tạo tài khoản cho khách
          </Text>
          <View style={styles.passwordInputWrap}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor={Colors.gray400}
              accessibilityLabel="Mật khẩu tài khoản cho khách"
            />
          </View>
          <Text style={styles.passwordWarning}>
            * Nhắc nhở khách thay đổi mật khẩu đăng nhập lần đầu tiên!
          </Text>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Remaining Toggle Settings ── */}
        {SETTING_TOGGLES.slice(1).map((item) => (
          <SettingToggleRow
            key={item.id}
            item={item}
            value={toggleStates[item.id]}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={styles.saveButtonWrap}>
        <TouchableOpacity
          style={styles.saveButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Lưu thay đổi"
        >
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Setting Toggle Row Sub-Component ──
function SettingToggleRow({
  item,
  value,
  onToggle,
}: {
  item: SettingToggleItem;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: item.iconBgColor }]}>
        <Ionicons name={item.icon} size={22} color={item.iconColor} />
      </View>
      <View style={styles.toggleContent}>
        <Text style={styles.toggleTitle}>{item.title}</Text>
        <Text style={styles.toggleDesc}>{item.description}</Text>
        {item.helpLink && (
          <TouchableOpacity
            style={styles.helpLinkRow}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={item.helpLink}
          >
            <Ionicons name="help-circle-outline" size={14} color={Colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.helpLinkText}>{item.helpLink}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.gray300}
      />
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

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['2xl'],
  },

  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  infoBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoBannerDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  toggleContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  toggleTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  helpLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  helpLinkText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },

  // Password section
  passwordSection: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  passwordLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
  },
  passwordHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  passwordInputWrap: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    height: 48,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  passwordWarning: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    fontStyle: 'italic',
  },

  // Divider
  divider: {
    height: 8,
    backgroundColor: Colors.gray100,
  },

  // Save button
  saveButtonWrap: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  saveButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
