/**
 * Notifications Screen - Màn hình danh sách Thông báo
 * Quản lý các thông báo từ hệ thống và nhà trọ
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => router.push('/new-chat')}
          accessibilityLabel="Tạo cuộc trò chuyện mới"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={24} color={Colors.success} />
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.replace('/inbox')}
            accessibilityLabel="Chuyển sang tab Tin nhắn"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={Colors.textPrimary}
              />
              <View style={styles.tabTextWrap}>
                <Text style={styles.tabTitle}>
                  Tin nhắn
                </Text>
                <Text style={styles.tabSubtitle}>3 - chưa đọc</Text>
              </View>
            </View>
            <View style={styles.redDotAbsolute} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, styles.activeTab]}
            disabled={true}
            accessibilityLabel="Tab Thông báo đang chọn"
          >
            <View style={styles.tabContent}>
              <Ionicons
                name="notifications"
                size={18}
                color={Colors.success}
              />
              <View style={styles.tabTextWrap}>
                <Text style={[styles.tabTitle, styles.activeTabText]}>
                  Thông báo
                </Text>
                <Text style={styles.tabSubtitle}>0 - chưa đọc</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => router.push('/(mail-box-page)/notification-settings')}
          accessibilityLabel="Cài đặt thông báo"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsContainer}>
          <Text style={styles.dateHeader}>18/4/2026</Text>
          
          <NotificationItem 
            title="💰 Nhà trọ Quoc lập hóa đơn nhanh"
            subtitle="Kiến Quốc: lập hóa đơn nhanh"
            time="4 phút trước"
          />
          <NotificationItem 
            title="🎉 Phòng 1, Nhà trọ Quoc lập hợp đồng"
            subtitle="Kiến Quốc: ghi nhận khách mới vào thuê"
            time="9 phút trước"
          />
          <NotificationItem 
            title="📌 Phòng 1, Nhà trọ Quoc cọc giữ chỗ"
            subtitle="Kiến Quốc: cọc giữ chỗ với số tiền 3.000.000đ"
            time="9 phút trước"
          />
          <NotificationItem 
            title="📌 Phòng 1, Nhà trọ Quoc kết thúc hợp đồng"
            subtitle="Kiến Quốc: kết thúc hợp đồng"
            time="10 phút trước"
          />
          <NotificationItem 
            title="📌 Phòng 1, Nhà trọ Quoc xóa 1 khách"
            subtitle="Kiến Quốc: xóa khách thuê cho Phòng 1"
            time="10 phút trước"
          />
          <NotificationItem 
            title="💵 Phòng 1, Nhà trọ Quoc thanh toán 🎉 xong hóa đơn T.4/2026"
            subtitle="Kiến Quốc: thanh toán xong hóa đơn T.4/2026, với số tiền: 3.000.000đ, phương thức: Tiền mặt"
            time="10 phút trước"
          />
        </View>
      </ScrollView>
    </View>
  );
}

interface NotificationItemProps {
  title: string;
  subtitle: string;
  time: string;
}

function NotificationItem({ title, subtitle, time }: NotificationItemProps) {
  return (
    <TouchableOpacity 
      style={styles.notificationItem}
      accessibilityLabel={`Thông báo: ${title}`}
    >
      <View style={styles.notifAvatarContainer}>
        <View style={styles.notifAvatar}>
          <MaterialCommunityIcons name="storefront-outline" size={24} color="#8BC34A" />
        </View>
        <View style={styles.notifDot} />
      </View>
      <View style={styles.notifInfo}>
        <Text style={styles.notifTitle}>{title}</Text>
        <Text style={styles.notifSubtitle}>{subtitle}</Text>
        <Text style={styles.notifTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
  },
  activeTab: {
    backgroundColor: '#e6f6ee',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabTextWrap: {
    alignItems: 'flex-start',
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  activeTabText: {
    color: Colors.success,
  },
  tabSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  redDotAbsolute: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    position: 'absolute',
    top: 6,
    right: 8,
  },
  scrollView: {
    flex: 1,
  },
  notificationsContainer: {
    padding: Spacing.base,
    backgroundColor: '#F3F4F6',
    minHeight: '100%',
  },
  dateHeader: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  notifAvatarContainer: {
    marginRight: Spacing.base,
    position: 'relative',
  },
  notifAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  notifInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  notifSubtitle: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
