package com.rrms.rrms.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * LoginHistoryResponse - DTO trả về thông tin lịch sử đăng nhập
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginHistoryResponse {
    UUID id;
    String username;
    String ipAddress;
    String deviceType;
    String deviceName;
    String osName;
    String osVersion;
    String browserName;
    String browserVersion;
    LocalDateTime loginAt;
    String status;
}
