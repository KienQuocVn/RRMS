import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

interface SettingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  route: string;
  isPro?: boolean;
  hideDivider?: boolean;
}

const BASIC_SETTINGS: SettingItem[] = [
  {
    id: 'room-groups',
    icon: 'layers-outline',
    title: 'Nhóm phòng theo dãy/tầng',
    desc: 'Gom phòng theo lầu tầng, dãy, khu... để quản lý tốt hơn.',
    route: '/room-groups',
  },
  {
    id: 'price-increase',
    icon: 'cash-outline',
    title: 'Tăng giá thuê',
    desc: 'Tăng giá thuê cho tất cả phòng hoặc chỉ 1 số phòng',
    route: '/price-increase',
  },
  {
    id: 'services',
    icon: 'business-outline',
    title: 'Dịch vụ',
    desc: 'Tiền điện, nước, tiền rác, tiền wifi hay các tiền phụ thu khác...',
    route: '/services-settings',
  },
  {
    id: 'invoice-settings',
    icon: 'receipt-outline',
    title: 'Cài đặt hóa đơn',
    desc: 'Các cài đặt hóa đơn như: Làm tròn, hình thức thanh toán, gửi tự qua ZALO, mã QR...',
    route: '/invoice-settings',
  },
  {
    id: 'bank-account',
    icon: 'card-outline',
    title: 'Cài đặt tài khoản ngân hàng',
    desc: 'Tài khoản cho khách thanh toán tiền thuê, gạch nợ tự động, hiển hiện mã QR trên hóa đơn',
    route: '/bank-account',
    isPro: true,
  },
  {
    id: 'income-expense',
    icon: 'calculator-outline',
    title: 'Cài đặt thu/chi',
    desc: 'Cài danh mục, báo cáo... thu/chi',
    route: '/income-expense',
  },
  {
    id: 'tenant-app',
    icon: 'phone-portrait-outline',
    title: 'APP dành cho khách thuê',
    desc: 'Mật khẩu tài khoản khách, cho phép cập nhật thông tin...',
    route: '/tenant-app-settings',
    isPro: true,
  },
  {
    id: 'toggle-features',
    icon: 'settings-outline',
    title: 'Bật / Tắt tính năng',
    desc: 'Bật / tắt chức năng như: quản lý xe, tài sản...',
    route: '/toggle-features',
    hideDivider: true,
  },
];

const ADVANCED_SETTINGS: SettingItem[] = [
  {
    id: 'rules',
    icon: 'time-outline',
    title: 'Nội quy và giờ giấc',
    desc: 'Thêm nội quy và giờ giấc cho người thuê. Khi đăng tin bạn sẽ sử dụng thông tin này',
    route: '/rules-settings',
  },
  {
    id: 'amenities',
    icon: 'apps-outline',
    title: 'Tiện ích cho thuê',
    desc: 'Khi đăng tin bạn sẽ sử dụng thông tin này để thu hút khách thuê trọ',
    route: '/amenities-settings',
    hideDivider: true,
  },
];

function SettingsCardItem({ item, onPress }: { item: SettingItem; onPress: () => void }) {
  return (
    <>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={24} color={Colors.gray800} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.itemDesc}>{item.desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
      </TouchableOpacity>
      {!item.hideDivider && <View style={styles.divider} />}
    </>
  );
}

export default function MotelSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt nhà cho thuê</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenLine} />
            <View>
              <Text style={styles.sectionTitle}>Cài đặt cơ bản</Text>
              <Text style={styles.sectionDesc}>
                Một số thiết lập cơ bản cho hệ thống cho thuê của bạn
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            {BASIC_SETTINGS.map((item) => (
              <SettingsCardItem
                key={item.id}
                item={item}
                onPress={() => router.push(item.route as any)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenLine} />
            <View>
              <Text style={styles.sectionTitle}>Cài đặt nâng cao</Text>
              <Text style={styles.sectionDesc}>
                Một số thiết lập nâng cao cho hệ thống quản lý
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            {ADVANCED_SETTINGS.map((item) => (
              <SettingsCardItem
                key={item.id}
                item={item}
                onPress={() => router.push(item.route as any)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  greenLine: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: Spacing.sm,
    marginTop: 4,
    height: 18,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    paddingRight: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  iconContainer: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: Spacing.sm,
  },
  itemContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  proBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  itemDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.base,
    marginLeft: 55,
  },
});
