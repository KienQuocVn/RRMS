package com.rrms.rrms.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String notificationId;
    private String title;
    private String subtitle;
    private String content;
    private String type; // MOTEL, ROOM, SERVICE, DEVICE, DEPOSIT, INVOICE, PAYMENT, CONTRACT, GENERAL
    private LocalDateTime createdAt;
    private String timeAgo;
    private Boolean isRead;
    private String link;
}
