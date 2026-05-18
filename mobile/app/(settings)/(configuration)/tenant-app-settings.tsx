import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontWeights, Shadows } from '@/constants/theme';

interface SettingToggleItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  defaultValue: boolean;
  helpLink?: string;
  iconTint?: string;
}

const SETTING_TOGGLES: SettingToggleItem[] = [
  {
    id: 'auto-create-account',
    icon: 'person-add-outline',
    title: 'Tự động tạo tài khoản cho khách',
    description: 'Tự động tạo tài khoản cho khách sử dụng APP khi lập hợp đồng bằng SĐT',
    defaultValue: false,
    iconTint: '#3CC5D6',
  },
  {
    id: 'allow-meter-reading',
    icon: 'speedometer-outline',
    title: 'Cho phép khách chốt đồng hồ',
    description: 'Khi tới kỳ hóa đơn khách thuê tự chốt điện nước. Giúp bạn tiết kiệm thời gian',
    defaultValue: false,
    helpLink: 'Tìm hiểu tính năng',
    iconTint: '#6B7280',
  },
  {
    id: 'allow-edit-tenant-info',
    icon: 'shield-checkmark-outline',
    title: 'Cho phép thêm, sửa thông tin khách thuê',
    description: 'Khách có thể tự thêm thành viên, sửa thông tin thành viên',
    defaultValue: true,
    iconTint: '#5CC4FF',
  },
  {
    id: 'allow-edit-vehicle',
    icon: 'bicycle-outline',
    title: 'Cho phép thêm, sửa thông tin xe',
    description: 'Khách có thể tự thêm sửa thông tin xe của mình',
    defaultValue: true,
    iconTint: '#FF7A59',
  },
  {
    id: 'allow-end-contract',
    icon: 'home-outline',
    title: 'Cho phép báo kết thúc hợp đồng online',
    description: 'Khách có thể báo kết thúc hợp đồng trên APP của mình',
    defaultValue: true,
    iconTint: '#FF9C3B',
  },
];

function Toggle({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.toggle, value && styles.toggleActive]} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );
}

export default function TenantAppSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [password, setPassword] = useState('lozido123');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    SETTING_TOGGLES.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultValue }), {} as Record<string, boolean>)
  );

  const handleToggle = (id: string) => {
    setToggleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt APP khách thuê</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerWrap}>
          <TouchableOpacity style={styles.infoBanner} activeOpacity={0.85}>
            <View style={styles.bannerIconWrap}>
              <Ionicons name="phone-portrait-outline" size={24} color="#35C4D8" />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Tìm hiểu APP dành cho khách thuê</Text>
              <Text style={styles.bannerDesc}>
                Gửi hóa đơn tự động, hợp đồng online, tự chốt đồng hồ...
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#2E85FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <SettingRow
            item={SETTING_TOGGLES[0]}
            value={toggleStates[SETTING_TOGGLES[0].id]}
            onToggle={() => handleToggle(SETTING_TOGGLES[0].id)}
          />

          <View style={styles.divider} />

          <View style={styles.passwordSection}>
            <Text style={styles.fieldLabel}>
              Mật khoản tài khoản cho khách <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.fieldHint}>Mật khẩu mặc định dùng tạo tài khoản cho khách</Text>

            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor="#A0A7B1"
            />

            <Text style={styles.warningText}>* Nhắc nhở khách thay đổi mật khẩu đăng nhập lần đầu tiên!</Text>
          </View>

          <View style={styles.divider} />

          {SETTING_TOGGLES.slice(1).map((item) => (
            <View key={item.id}>
              <SettingRow
                item={item}
                value={toggleStates[item.id]}
                onToggle={() => handleToggle(item.id)}
              />
              {item.id !== SETTING_TOGGLES[SETTING_TOGGLES.length - 1].id && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingRow({
  item,
  value,
  onToggle,
}: {
  item: SettingToggleItem;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIconCircle}>
        <Ionicons name={item.icon} size={22} color={item.iconTint || '#6B7280'} />
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingDesc}>{item.description}</Text>
        {item.helpLink ? (
          <TouchableOpacity style={styles.helpLink} activeOpacity={0.85}>
            <Ionicons name="help-circle-outline" size={16} color="#2E85FF" />
            <Text style={styles.helpLinkText}>{item.helpLink}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Toggle value={value} onPress={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF2F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  bannerWrap: {
    backgroundColor: '#EDF2F3',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E85FF',
    borderRadius: 14,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  bannerIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F5FBFF',
  },
  bannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  contentSection: {
    backgroundColor: Colors.white,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    paddingRight: 14,
  },
  settingTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  helpLinkText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#2E85FF',
    textDecorationLine: 'underline',
  },
  passwordSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  required: {
    color: '#F24B3A',
  },
  fieldHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
    marginBottom: 10,
  },
  passwordInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#F07F2F',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9DDE2',
    marginLeft: 16,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5B5B5B',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  toggleActive: {
    backgroundColor: '#DFF5E3',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BDBDBD',
  },
  toggleThumbActive: {
    backgroundColor: '#7ED321',
    alignSelf: 'flex-end',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#13AA47',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  saveButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
