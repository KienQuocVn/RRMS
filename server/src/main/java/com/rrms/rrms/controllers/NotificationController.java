package com.rrms.rrms.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.NotificationResponse;
import com.rrms.rrms.services.INotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Notification Controller", description = "Quản lý thông báo và nhật ký hoạt động hệ thống")
@RestController
@RequestMapping({"/notifications", "/api/v1/notifications"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationController {

    INotificationService notificationService;

    @Operation(summary = "Lấy danh sách thông báo")
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getNotifications(
            @RequestParam(value = "username", required = false) String username) {
        String targetUsername = resolveUsername(username);

        List<NotificationResponse> result = notificationService.getNotifications(targetUsername);
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách thông báo thành công")
                .result(result)
                .build();
    }

    @Operation(summary = "Lấy số lượng thông báo chưa đọc")
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam(value = "username", required = false) String username) {
        String targetUsername = resolveUsername(username);

        long count = notificationService.getUnreadCount(targetUsername);
        return ApiResponse.<Long>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy số lượng thông báo chưa đọc thành công")
                .result(count)
                .build();
    }

    @Operation(summary = "Đánh dấu thông báo đã đọc")
    @PostMapping("/mark-read/{id}")
    public ApiResponse<Void> markAsRead(
            @PathVariable String id, @RequestParam(value = "username", required = false) String username) {
        String targetUsername = resolveUsername(username);
        notificationService.markAsRead(id, targetUsername);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Đánh dấu đã đọc thành công")
                .build();
    }

    private String resolveUsername(String username) {
        if (username != null && !username.trim().isEmpty()) {
            return username.trim();
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {
            return authentication.getName();
        }
        return "";
    }
}
