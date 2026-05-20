/**
 * Inbox Screen - Hộp thư
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/new-chat')}>
          <Ionicons name="add" size={24} color={Colors.success} />
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
            onPress={() => setActiveTab('messages')}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={activeTab === 'messages' ? 'chatbubble' : 'chatbubble-outline'}
                size={16}
                color={activeTab === 'messages' ? Colors.success : Colors.textPrimary}
              />
              <View style={styles.tabTextWrap}>
                <Text style={[styles.tabTitle, activeTab === 'messages' && styles.activeTabText]}>
                  Tin nhắn
                </Text>
                <Text style={styles.tabSubtitle}>3 - chưa đọc</Text>
              </View>
              {activeTab === 'messages' && <View style={styles.redDot} />}
            </View>
            {activeTab !== 'messages' && <View style={styles.redDotAbsolute} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
            onPress={() => setActiveTab('notifications')}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={activeTab === 'notifications' ? 'notifications' : 'notifications-outline'}
                size={18}
                color={activeTab === 'notifications' ? Colors.success : Colors.textPrimary}
              />
              <View style={styles.tabTextWrap}>
                <Text style={[styles.tabTitle, activeTab === 'notifications' && styles.activeTabText]}>
                  Thông báo
                </Text>
                <Text style={styles.tabSubtitle}>0 - chưa đọc</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notification-settings')}>
          <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'messages' ? (
          <>
            <MessageItem
              avatarColor="#e6f6ee"
              icon="robot-outline"
              iconColor={Colors.success}
              name="RRMS BOT - Tin từ hệ thống"
              badge="BOT"
              badgeColor={Colors.success}
              message="Xin chào!, Tôi là Admin Bot của hệ thống RRMS. Tôi sẽ hỗ trợ bạn về chính sách và..."
              time="Vừa xong"
              unreadCount={1}
              isPinned
            />
            <MessageItem
              avatarColor="#e6f4cd"
              icon="chatprocessing-outline"
              iconColor="#8cbd46"
              name="RRMS CSKH"
              badge="CSKH"
              badgeColor="#2E65F3"
              message="Xin chào!, Em là nhân viên chăm sóc khách hàng. Em rất vui khi là người được hỗ trợ qu..."
              time="Vừa xong"
              unreadCount={1}
              isPinned
            />
            <MessageItem
              avatarColor="#ffe3e3"
              icon="home-outline"
              iconColor={Colors.error}
              name="Nhà trọ Quoc"
              badge="Nhà trọ"
              badgeColor="#786c96"
              message="Xin chào các bạn!, Đây là nhóm trao đổi trong Nhà trọ Quoc nhé. Các bạn có thể tra..."
              time="Vừa xong"
              unreadCount={1}
              isPinned
              showAvatarDot
            />
          </>
        ) : (
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
        )}
      </ScrollView>
    </View>
  );
}

function MessageItem({ avatarColor, icon, iconColor, name, badge, badgeColor, message, time, unreadCount, isPinned, showAvatarDot }: any) {
  return (
    <TouchableOpacity style={styles.messageItem}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
        </View>
        {showAvatarDot && <View style={styles.avatarDot} />}
      </View>
      <View style={styles.messageInfo}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName} numberOfLines={1}>{name}</Text>
          <View style={styles.messageTimeWrap}>
            {isPinned && <MaterialCommunityIcons name="pin" size={14} color={Colors.error} style={styles.pinIcon} />}
            <Text style={styles.messageTime}>{time}</Text>
          </View>
        </View>
        <View style={styles.messageSubHeader}>
          <View style={[styles.badgeContainer, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageText} numberOfLines={1}>{message}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function NotificationItem({ title, subtitle, time }: any) {
  return (
    <TouchableOpacity style={styles.notificationItem}>
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
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    position: 'absolute',
    top: 0,
    right: -10,
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
  messageItem: {
    flexDirection: 'row',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  avatarContainer: {
    marginRight: Spacing.base,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  messageInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  messageTimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    transform: [{ rotate: '45deg' }],
    marginRight: 4,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  messageSubHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
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
