import React, { useState } from 'react';
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
import { Colors, Spacing, FontWeights, Shadows } from '@/constants/theme';

interface FeatureItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  enabled: boolean;
  iconTint: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'assets',
    icon: 'cube-outline',
    title: 'Chức năng quản lý tài sản',
    description: 'Dùng để quản lý tài sản khi khách thuê sử dụng',
    enabled: true,
    iconTint: '#F59E0B',
  },
  {
    id: 'vehicles',
    icon: 'bicycle-outline',
    title: 'Chức năng quản lý xe',
    description: 'Dùng để quản lý xe của khách thuê',
    enabled: true,
    iconTint: '#FF7A59',
  },
  {
    id: 'posting',
    icon: 'cloud-upload-outline',
    title: 'Tính năng đăng tin tiếp cận khách thuê',
    description: 'Đăng tin tìm khách thuê, khách tiềm năng... trên hệ thống LOZIDO',
    enabled: true,
    iconTint: '#36C5F0',
  },
  {
    id: 'tasks',
    icon: 'clipboard-outline',
    title: 'Quản lý công việc',
    description: 'Báo cáo sự cố, hệ thống tự động nhắc việc, tạo việc cá nhân, nhân viên',
    enabled: true,
    iconTint: '#F97316',
  },
  {
    id: 'files',
    icon: 'document-text-outline',
    title: 'Hình ảnh, File chứng từ hợp đồng',
    description: 'Hình ảnh CCCD, hình ảnh hợp đồng giấy',
    enabled: true,
    iconTint: '#14B8A6',
  },
  {
    id: 'broker',
    icon: 'people-outline',
    title: 'Quản lý môi giới',
    description: 'Bạn có làm việc với môi giới? Bạn có thể lưu trữ, chi hoa hồng...',
    enabled: true,
    iconTint: '#A855F7',
  },
  {
    id: 'sms',
    icon: 'chatbubble-ellipses-outline',
    title: 'Gửi tin nhắn SMS tự động cho khách thuê',
    description: 'Khi lập hóa đơn bạn có muốn gửi tin nhắn SMS tiền nhà cho khách thuê hay không ?',
    enabled: false,
    iconTint: '#84CC16',
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

export default function ToggleFeaturesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [featureState, setFeatureState] = useState<Record<string, boolean>>(
    FEATURES.reduce((acc, item) => ({ ...acc, [item.id]: item.enabled }), {} as Record<string, boolean>)
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bật / tắt chức năng</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listSection}>
          {FEATURES.map((item, index) => (
            <View key={item.id}>
              <View style={styles.featureRow}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name={item.icon} size={22} color={item.iconTint} />
                </View>

                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.description}</Text>
                </View>

                <Toggle
                  value={featureState[item.id]}
                  onPress={() => setFeatureState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                />
              </View>

              {index < FEATURES.length - 1 && <View style={styles.divider} />}
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
  listSection: {
    backgroundColor: Colors.white,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  featureIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
    paddingRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
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
