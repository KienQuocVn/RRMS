import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface MoreMenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subLabel?: string;
  badge?: { text: string; bg: string };
  stars?: boolean;
  rightText?: string;
  rightSubText?: string;
  hideChevron?: boolean;
}

const MORE_ITEMS: MoreMenuItem[] = [
  { id: 'company', icon: 'globe-outline', label: 'Công ty, nhóm - Q.lý thành viên', subLabel: 'Thêm tài khoản cùng sử dụng phần mềm' },
  { id: 'rrms-plus', icon: 'gift-outline', label: 'RRMS Plus+', badge: { text: 'PRO', bg: '#E67E22' } },
  { id: 'brand', icon: 'bookmark-outline', label: 'Cài đặt thương hiệu tòa nhà', subLabel: 'Cài đặt logo thương hiệu, website...' },
  { id: 'owner-info', icon: 'person-outline', label: 'Thông tin đại diện chủ tòa nhà', subLabel: 'Thông tin dùng làm mẫu hợp đồng, tạm trú cho khách thuê.' },
  { id: 'digital-signature', icon: 'pencil-outline', label: 'Cài đặt chữ ký số', subLabel: 'Dùng để thiết lập chữ ký hợp đồng, tạm trú cho khách thuê.', badge: { text: 'Mới', bg: '#27AE60' } },
  { id: 'change-password', icon: 'key-outline', label: 'Đổi mật khẩu' },
  { id: 'link-phone', icon: 'person-add-outline', label: 'Liên kết số điện thoại', subLabel: 'Bạn đang đăng nhập bằng normal', badge: { text: 'Gấp', bg: '#E74C3C' } },
  { id: 'permissions', icon: 'shield-outline', label: 'Cài đặt quyền phần mềm', subLabel: 'Cung cấp quyền giúp phần mềm hoạt động' },
  { id: 'notifications', icon: 'settings-outline', label: 'Cài đặt thông báo' },
  { id: 'help-center', icon: 'chatbubble-outline', label: 'Trung tâm trợ giúp' },
  { id: 'share-app', icon: 'share-social-outline', label: 'Chia sẻ APP khách thuê', subLabel: 'Khách kết nối với bạn, nhận hóa đơn tự động & nhiều tiện ích khác' },
  { id: 'rate-app', icon: 'cube-outline', label: 'Đánh giá phần mềm', subLabel: 'Một đánh giá tốt giúp RRMS thêm động lực hoàn thiện', stars: true },
  { id: 'app-info', icon: 'information-circle-outline', label: 'Thông tin phần mềm' },
  { id: 'privacy', icon: 'shield-checkmark-outline', label: 'Chính sách bảo mật' },
  { id: 'terms', icon: 'document-text-outline', label: 'Điều khoản sử dụng' },
  { id: 'version', icon: 'layers-outline', label: 'Phiên bản phần mềm', rightText: 'Version: 3.0.6 / 6', rightSubText: 'production', hideChevron: true },
  { id: 'os', icon: 'phone-portrait-outline', label: 'Hệ điều hành', rightText: 'IOS 18', rightSubText: 'iPhone', hideChevron: true },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public/boy' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Xin chào! Kiến Quốc</Text>
              <Text style={styles.profileGreeting}>Chúc bạn một ngày làm việc hiệu quả!</Text>
              <View style={styles.verifiedBadge}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedText}>Đã xác minh</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileDivider} />
          <View style={styles.profileBottom}>
             <View>
               <Text style={styles.customerCodeLabel}>Mã khách hàng</Text>
               <Text style={styles.customerCodeValue}>#26OW00013430</Text>
             </View>
             <TouchableOpacity style={styles.copyBtn}>
               <Text style={styles.copyBtnText}>Sao chép</Text>
               <Ionicons name="copy-outline" size={16} color={Colors.gray800} />
             </TouchableOpacity>
          </View>
        </View>

        {/* List Menu */}
        <View style={styles.listCard}>
          {MORE_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={24} color={Colors.gray700} />
                </View>
                
                <View style={styles.menuContent}>
                   <View style={styles.menuHeaderRow}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.badge && (
                        <View style={[styles.badge, { backgroundColor: item.badge.bg }]}>
                          <Text style={styles.badgeText}>{item.badge.text}</Text>
                        </View>
                      )}
                   </View>
                   {item.subLabel && <Text style={styles.menuSubLabel}>{item.subLabel}</Text>}
                   
                   {item.stars && (
                     <View style={styles.starsContainer}>
                       {[...Array(5)].map((_, i) => (
                         <Ionicons key={i} name="star" size={16} color="#F1C40F" style={{ marginRight: 2 }} />
                       ))}
                     </View>
                   )}
                </View>

                {item.rightText ? (
                  <View style={styles.rightDetail}>
                     <Text style={styles.rightText}>{item.rightText}</Text>
                     {item.rightSubText && <Text style={styles.rightSubText}>{item.rightSubText}</Text>}
                  </View>
                ) : null}

                {!item.hideChevron && (
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
                )}
              </TouchableOpacity>
              
              {index < MORE_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        {/* Social Card */}
        <View style={styles.socialCard}>
           <Text style={styles.socialTitle}>Chúng tôi trên mạng xã hội</Text>
           <Text style={styles.socialDesc}>
             Theo dõi chúng tôi và cộng đồng để có thể thêm kinh nghiệm từ cộng đồng.
           </Text>
           <View style={styles.socialGrid}>
              <TouchableOpacity style={[styles.socialBtn, { borderColor: '#E74C3C' }]}>
                 <Ionicons name="logo-youtube" size={18} color="#E74C3C" />
                 <Text style={[styles.socialBtnText, { color: '#E74C3C' }]}>Youtube</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, { borderColor: '#3B5998' }]}>
                 <Ionicons name="logo-facebook" size={18} color="#3B5998" />
                 <Text style={[styles.socialBtnText, { color: '#3B5998' }]}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, { borderColor: '#000000' }]}>
                 <Ionicons name="logo-tiktok" size={18} color="#000000" />
                 <Text style={[styles.socialBtnText, { color: '#000000' }]}>Tiktok</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, { borderColor: '#0084FF' }]}>
                 <View style={styles.zaloIconWrapper}>
                   <Text style={styles.zaloIconText}>Zalo</Text>
                 </View>
                 <Text style={[styles.socialBtnText, { color: '#0084FF' }]}>ZALO</Text>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Equivalent to gray50
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.base,
  },

  // Profile Card
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  profileGreeting: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: FontSizes.xs,
    color: '#4CAF50',
    fontWeight: '600',
  },
  profileDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.base,
  },
  profileBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
  },
  customerCodeLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerCodeValue: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.primary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  copyBtnText: {
    fontSize: FontSizes.sm,
    color: Colors.gray800,
    fontWeight: '500',
  },

  // List Card
  listCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  menuContent: {
    flex: 1,
    justifyContent: 'center',
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuLabel: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginRight: Spacing.xs,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuSubLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray500,
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 55, // align with text
  },
  rightDetail: {
    alignItems: 'flex-end',
    marginRight: Spacing.sm,
  },
  rightText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  rightSubText: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  logoutText: {
    color: Colors.error,
    fontSize: FontSizes.base,
    fontWeight: '500',
  },

  // Social Card
  socialCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing['2xl'],
  },
  socialTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  socialDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  socialBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  socialBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  zaloIconWrapper: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  zaloIconText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
