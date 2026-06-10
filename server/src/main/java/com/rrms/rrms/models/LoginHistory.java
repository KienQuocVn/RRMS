package com.rrms.rrms.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * LoginHistory - Lưu lịch sử đăng nhập của người dùng
 * Mỗi lần đăng nhập thành công sẽ tạo 1 bản ghi ở đây
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
        name = "login_histories",
        indexes = {
            @Index(name = "idx_login_history_username", columnList = "username"),
            @Index(name = "idx_login_history_login_at", columnList = "login_at")
        })
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "BINARY(16)")
    UUID id;

    /** Username của tài khoản đăng nhập */
    @Column(name = "username", nullable = false, length = 255)
    String username;

    /** IP address của thiết bị đăng nhập */
    @Column(name = "ip_address", length = 45)
    String ipAddress;

    /** User-Agent string từ browser/app */
    @Column(name = "user_agent", columnDefinition = "TEXT")
    String userAgent;

    /** Loại thiết bị: WEB, MOBILE, TABLET */
    @Column(name = "device_type", length = 20)
    String deviceType;

    /** Tên thiết bị (ví dụ: Chrome on Windows, Safari on iPhone) */
    @Column(name = "device_name", length = 255)
    String deviceName;

    /** Hệ điều hành */
    @Column(name = "os_name", length = 100)
    String osName;

    /** Phiên bản hệ điều hành */
    @Column(name = "os_version", length = 50)
    String osVersion;

    /** Trình duyệt hoặc app */
    @Column(name = "browser_name", length = 100)
    String browserName;

    /** Phiên bản trình duyệt */
    @Column(name = "browser_version", length = 50)
    String browserVersion;

    /** Thời điểm đăng nhập */
    @Column(name = "login_at", nullable = false)
    LocalDateTime loginAt;

    /** Trạng thái đăng nhập: SUCCESS, FAILED */
    @Column(name = "status", length = 20)
    String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", insertable = false, updatable = false)
    Account account;
}
