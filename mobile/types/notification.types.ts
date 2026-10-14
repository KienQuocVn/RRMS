/**
 * Notification Types
 * Định nghĩa kiểu dữ liệu cho thông báo và nhật ký hoạt động
 */

export type NotificationType =
  | 'MOTEL'
  | 'ROOM'
  | 'SERVICE'
  | 'DEVICE'
  | 'DEPOSIT'
  | 'INVOICE'
  | 'PAYMENT'
  | 'CONTRACT'
  | 'GENERAL';

export interface AppNotification {
  notificationId: string;
  title: string;
  subtitle: string;
  content?: string;
  type: NotificationType;
  createdAt: string;
  timeAgo: string;
  isRead?: boolean;
  link?: string;
}

export interface NotificationGroup {
  date: string;
  items: AppNotification[];
}
