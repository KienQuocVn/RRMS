package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.LoginHistoryResponse;
import com.rrms.rrms.services.ILoginHistoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * LoginHistoryController - API quản lý lịch sử đăng nhập thiết bị
 * Chỉ cho phép người dùng xem và xóa lịch sử đăng nhập của chính họ
 */
@Tag(name = "Login History Controller", description = "API quản lý lịch sử đăng nhập thiết bị")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping({"/api/v1/login-history", "/login-history"})
public class LoginHistoryController {

    private final ILoginHistoryService loginHistoryService;

    @Operation(summary = "Lấy lịch sử đăng nhập thiết bị của tài khoản đang đăng nhập")
    @GetMapping("/me")
    public ApiResponse<List<LoginHistoryResponse>> getMyLoginHistory(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        List<LoginHistoryResponse> histories = loginHistoryService.getLoginHistoryByUsername(username);
        return ApiResponse.<List<LoginHistoryResponse>>builder()
                .message("Lấy lịch sử đăng nhập thành công")
                .result(histories)
                .build();
    }

    @Operation(summary = "Lấy lịch sử đăng nhập theo username (dùng khi truyền tường minh)")
    @GetMapping("/{username}")
    public ApiResponse<List<LoginHistoryResponse>> getLoginHistoryByUsername(
            @PathVariable String username, @AuthenticationPrincipal Jwt jwt) {
        // Chỉ cho xem của chính mình
        String requester = jwt.getSubject();
        String targetUser = username.equals("me") ? requester : username;
        List<LoginHistoryResponse> histories = loginHistoryService.getLoginHistoryByUsername(targetUser);
        return ApiResponse.<List<LoginHistoryResponse>>builder()
                .message("Lấy lịch sử đăng nhập thành công")
                .result(histories)
                .build();
    }

    @Operation(summary = "Xóa một bản ghi lịch sử đăng nhập (xóa phiên thiết bị)")
    @DeleteMapping("/{historyId}")
    public ApiResponse<Void> deleteLoginHistory(@PathVariable UUID historyId, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        loginHistoryService.deleteLoginHistory(historyId, username);
        return ApiResponse.<Void>builder()
                .message("Đã xóa bản ghi đăng nhập thành công")
                .build();
    }

    @Operation(summary = "Lấy lịch sử đăng nhập từ request header (fallback)")
    @GetMapping("/by-username")
    public ApiResponse<List<LoginHistoryResponse>> getByUsernameParam(
            @RequestParam String username, HttpServletRequest request) {
        List<LoginHistoryResponse> histories = loginHistoryService.getLoginHistoryByUsername(username);
        return ApiResponse.<List<LoginHistoryResponse>>builder()
                .message("Lấy lịch sử đăng nhập thành công")
                .result(histories)
                .build();
    }
}
