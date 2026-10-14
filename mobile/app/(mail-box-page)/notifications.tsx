/**
 * Notifications Screen - Màn hình danh sách Thông báo
 * Quản lý và theo dõi các thông báo hoạt động từ hệ thống và nhà trọ
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { notificationService } from "@/services/api/notification.service";
import { AppNotification, NotificationType } from "@/types/notification.types";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load danh sách thông báo từ Backend API
  const fetchNotifications = useCallback(async () => {
    try {
      const username = user?.username;
      const response = await notificationService.getNotifications(username);
      if (response && response.result) {
        setNotifications(response.result);
        const unread = response.result.filter((item) => !item.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.warn("Lỗi khi tải danh sách thông báo:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handlePressNotification = async (item: AppNotification) => {
    if (!item.isRead) {
      // Đánh dấu đã đọc trong local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === item.notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Gọi API đánh dấu đã đọc
      try {
        await notificationService.markAsRead(
          item.notificationId,
          user?.username,
        );
      } catch (err) {
        console.warn("Lỗi khi đánh dấu thông báo đã đọc:", err);
      }
    }
  };

  // Gom nhóm thông báo theo ngày
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "ios" ? insets.top : 0 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftSpacer} />

        {/* Tab thông báo duy nhất (Đã ẩn tab Tin nhắn theo yêu cầu) */}
        <View style={styles.tabContainer}>
          <View
            style={[styles.tab, styles.activeTab]}
            accessibilityLabel="Tab Thông báo"
          >
            <View style={styles.tabContent}>
              <Ionicons name="notifications" size={18} color={Colors.success} />
              <View style={styles.tabTextWrap}>
                <Text style={[styles.tabTitle, styles.activeTabText]}>
                  Thông báo
                </Text>
                <Text style={styles.tabSubtitle}>{unreadCount} - chưa đọc</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Nút cài đặt thông báo */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(mail-box-page)/notification-settings")}
          accessibilityLabel="Cài đặt thông báo"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.success]}
            tintColor={Colors.success}
          />
        }
      >
        <View style={styles.notificationsContainer}>
          {isLoading && !isRefreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.success} />
              <Text style={styles.loadingText}>Đang tải thông báo...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="notifications-off-outline"
                  size={40}
                  color={Colors.gray400}
                />
              </View>
              <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
              <Text style={styles.emptySubtitle}>
                Các hoạt động tạo nhà trọ, phòng, dịch vụ, hóa đơn và thanh toán
                sẽ hiển thị tại đây.
              </Text>
            </View>
          ) : (
            groupedNotifications.map((group, groupIdx) => (
              <View key={`group-${groupIdx}`} style={styles.groupSection}>
                <Text style={styles.dateHeader}>{group.date}</Text>
                {group.items.map((item) => (
                  <NotificationCard
                    key={item.notificationId}
                    item={item}
                    onPress={() => handlePressNotification(item)}
                  />
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Phân loại icon và màu sắc cho từng loại thông báo
function getNotificationVisuals(type: NotificationType) {
  switch (type) {
    case "MOTEL":
      return {
        iconName: "home-city-outline",
        iconColor: "#3B82F6",
        bgColor: "#EFF6FF",
      };
    case "ROOM":
      return {
        iconName: "bed-outline",
        iconColor: "#4bcffa",
        bgColor: "#ECFDF5",
      };
    case "SERVICE":
      return {
        iconName: "lightning-bolt-outline",
        iconColor: "#F59E0B",
        bgColor: "#FFFBEB",
      };
    case "DEVICE":
      return {
        iconName: "package-variant-closed",
        iconColor: "#6366F1",
        bgColor: "#EEF2FF",
      };
    case "DEPOSIT":
      return {
        iconName: "bookmark-check-outline",
        iconColor: "#059669",
        bgColor: "#E6F4EA",
      };
    case "CONTRACT":
      return {
        iconName: "file-document-edit-outline",
        iconColor: "#8B5CF6",
        bgColor: "#F5F3FF",
      };
    case "INVOICE":
      return {
        iconName: "receipt-outline",
        iconColor: "#EF4444",
        bgColor: "#FEF2F2",
      };
    case "PAYMENT":
      return {
        iconName: "cash-check",
        iconColor: "#4bcffa",
        bgColor: "#E8F5E9",
      };
    default:
      return {
        iconName: "bell-outline",
        iconColor: "#6B7280",
        bgColor: "#F3F4F6",
      };
  }
}

interface NotificationCardProps {
  item: AppNotification;
  onPress: () => void;
}

function NotificationCard({ item, onPress }: NotificationCardProps) {
  const visuals = getNotificationVisuals(item.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotificationItem,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Thông báo: ${item.title}`}
    >
      <View style={styles.notifAvatarContainer}>
        <View
          style={[styles.notifAvatar, { backgroundColor: visuals.bgColor }]}
        >
          <MaterialCommunityIcons
            name={visuals.iconName as any}
            size={24}
            color={visuals.iconColor}
          />
        </View>
        {!item.isRead && <View style={styles.notifDot} />}
      </View>
      <View style={styles.notifInfo}>
        <Text style={[styles.notifTitle, !item.isRead && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.notifSubtitle}>{item.subtitle}</Text>
        <Text style={styles.notifTime}>{item.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Gom nhóm thông báo theo ngày tạo
function groupNotificationsByDate(
  items: AppNotification[],
): { date: string; items: AppNotification[] }[] {
  const groups: { [key: string]: AppNotification[] } = {};

  items.forEach((item) => {
    let dateStr = "Gần đây";
    if (item.createdAt) {
      try {
        const d = new Date(item.createdAt);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
          dateStr = "Hôm nay";
        } else if (d.toDateString() === yesterday.toDateString()) {
          dateStr = "Hôm qua";
        } else {
          dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
      } catch {
        dateStr = "Gần đây";
      }
    }

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(item);
  });

  return Object.keys(groups).map((key) => ({
    date: key,
    items: groups[key],
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerLeftSpacer: {
    width: 40,
    height: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
  },
  activeTab: {
    backgroundColor: "#e6f6ee",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabTextWrap: {
    alignItems: "flex-start",
  },
  tabTitle: {
    fontSize: FontSizes.base,
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
  scrollView: {
    flex: 1,
  },
  notificationsContainer: {
    padding: Spacing.base,
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
  },
  groupSection: {
    marginBottom: Spacing.md,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotificationItem: {
    borderLeftColor: Colors.success,
    backgroundColor: "#FAFCFA",
  },
  notifAvatarContainer: {
    marginRight: Spacing.base,
    position: "relative",
    justifyContent: "center",
  },
  notifAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
    position: "absolute",
    top: 2,
    right: 2,
  },
  notifInfo: {
    flex: 1,
    justifyContent: "center",
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  unreadTitle: {
    color: "#0F172A",
  },
  notifSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: Colors.gray400,
  },
  loadingContainer: {
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
});
