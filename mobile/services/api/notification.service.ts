import { ApiResponse } from '@/types/common.types';
import { AppNotification } from '@/types/notification.types';

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const notificationService = {
  getNotifications: async (username?: string): Promise<ApiResponse<AppNotification[]>> => {
    const params = username ? { username } : undefined;
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params });
  },

  getUnreadCount: async (username?: string): Promise<ApiResponse<number>> => {
    const params = username ? { username } : undefined;
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, { params });
  },

  markAsRead: async (notificationId: string, username?: string): Promise<ApiResponse<void>> => {
    const params = username ? { username } : undefined;
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), null, { params });
  },
};
