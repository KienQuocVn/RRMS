package com.rrms.rrms.services.servicesImp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.response.LoginHistoryResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.LoginHistory;
import com.rrms.rrms.repositories.LoginHistoryRepository;
import com.rrms.rrms.services.ILoginHistoryService;
import com.rrms.rrms.utils.DeviceDetector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * LoginHistoryService - Xử lý nghiệp vụ lịch sử đăng nhập thiết bị
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginHistoryService implements ILoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;

    @Override
    @Transactional
    public void recordLoginSuccess(Account account, HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            String platformVersion = request.getHeader("Sec-CH-UA-Platform-Version");
            String ipAddress = DeviceDetector.extractClientIp(request);
            String deviceType = DeviceDetector.detectDeviceType(userAgent);
            String osName = DeviceDetector.detectOsName(userAgent, platformVersion);
            String osVersion = DeviceDetector.detectOsVersion(userAgent);
            String browserName = DeviceDetector.detectBrowserName(userAgent);
            String browserVersion = DeviceDetector.detectBrowserVersion(userAgent);
            String deviceName = DeviceDetector.buildDeviceName(browserName, osName);

            LoginHistory loginHistory = LoginHistory.builder()
                    .username(account.getUsername())
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .deviceType(deviceType)
                    .deviceName(deviceName)
                    .osName(osName)
                    .osVersion(osVersion)
                    .browserName(browserName)
                    .browserVersion(browserVersion)
                    .loginAt(LocalDateTime.now())
                    .status("SUCCESS")
                    .build();

            loginHistoryRepository.save(loginHistory);
            log.info("Recorded login for user={} ip={} device={}", account.getUsername(), ipAddress, deviceName);
        } catch (Exception e) {
            // Không để lỗi tracking làm gián đoạn luồng đăng nhập
            log.warn("Failed to record login history for user={}: {}", account.getUsername(), e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoginHistoryResponse> getLoginHistoryByUsername(String username) {
        return loginHistoryRepository.findByUsernameOrderByLoginAtDesc(username).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLoginHistory(UUID historyId, String requestingUsername) {
        LoginHistory history =
                loginHistoryRepository.findById(historyId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // Chỉ cho phép xóa lịch sử của chính mình
        if (!history.getUsername().equals(requestingUsername)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        loginHistoryRepository.deleteById(historyId);
    }

    private LoginHistoryResponse toResponse(LoginHistory h) {
        return LoginHistoryResponse.builder()
                .id(h.getId())
                .username(h.getUsername())
                .ipAddress(h.getIpAddress())
                .deviceType(h.getDeviceType())
                .deviceName(h.getDeviceName())
                .osName(h.getOsName())
                .osVersion(h.getOsVersion())
                .browserName(h.getBrowserName())
                .browserVersion(h.getBrowserVersion())
                .loginAt(h.getLoginAt())
                .status(h.getStatus())
                .build();
    }
}
