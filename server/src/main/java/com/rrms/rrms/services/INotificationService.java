package com.rrms.rrms.services;

import java.util.List;

import com.rrms.rrms.dto.response.NotificationResponse;

public interface INotificationService {

    List<NotificationResponse> getNotifications(String username);

    long getUnreadCount(String username);

    void markAsRead(String notificationId, String username);
}
