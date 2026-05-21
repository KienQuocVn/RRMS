/**
 * Messages Screen - Màn hình danh sách Tin nhắn
 * Quản lý các cuộc trò chuyện và liên hệ
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

export default function MessagesScreen() {
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
            style={[styles.tab, styles.activeTab]}
            disabled={true}
            accessibilityLabel="Tab Tin nhắn đang chọn"
          >
            <View style={styles.tabContent}>
              <Ionicons
                name="chatbubble"
                size={16}
                color={Colors.success}
              />
              <View style={styles.tabTextWrap}>
                <Text style={[styles.tabTitle, styles.activeTabText]}>
                  Tin nhắn
                </Text>
                <Text style={styles.tabSubtitle}>3 - chưa đọc</Text>
              </View>
              <View style={styles.redDot} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.replace('/(mail-box-page)/notifications')}
            accessibilityLabel="Chuyển sang tab Thông báo"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={Colors.textPrimary}
              />
              <View style={styles.tabTextWrap}>
                <Text style={styles.tabTitle}>
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
      </ScrollView>
    </View>
  );
}

interface MessageItemProps {
  avatarColor: string;
  icon: any;
  iconColor: string;
  name: string;
  badge: string;
  badgeColor: string;
  message: string;
  time: string;
  unreadCount: number;
  isPinned?: boolean;
  showAvatarDot?: boolean;
}

function MessageItem({ 
  avatarColor, 
  icon, 
  iconColor, 
  name, 
  badge, 
  badgeColor, 
  message, 
  time, 
  unreadCount, 
  isPinned, 
  showAvatarDot 
}: MessageItemProps) {
  return (
    <TouchableOpacity 
      style={styles.messageItem}
      accessibilityLabel={`Tin nhắn từ ${name}`}
    >
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
});
