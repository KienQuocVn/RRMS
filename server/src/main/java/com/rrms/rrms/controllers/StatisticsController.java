package com.rrms.rrms.controllers;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.services.IStatisticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Statistics Controller", description = "System-wide statistics for admin dashboards")
@RestController
@RequestMapping({"/statistics", "/api/v1/statistics"})
@RequiredArgsConstructor
public class StatisticsController {

    private final IStatisticsService statisticsService;

    @Operation(summary = "Get total account count")
    @GetMapping("/total-accounts")
    public ApiResponse<Long> getTotalAccounts() {
        return ApiResponse.<Long>builder()
                .message("Lấy tổng số tài khoản thành công")
                .result(statisticsService.getTotalAccounts())
                .build();
    }

    @Operation(summary = "Get total tenant count")
    @GetMapping("/total-tenants")
    public ApiResponse<Long> getTotalTenants() {
        return ApiResponse.<Long>builder()
                .message("Lấy tổng số người thuê thành công")
                .result(statisticsService.getTotalTenants())
                .build();
    }

    @Operation(summary = "Get total host account count")
    @GetMapping("/total-host-accounts")
    public ApiResponse<Long> getTotalHostAccounts() {
        return ApiResponse.<Long>builder()
                .message("Lấy tổng số tài khoản chủ trọ thành công")
                .result(statisticsService.getTotalHostAccounts())
                .build();
    }

    @Operation(summary = "Get total motel count")
    @GetMapping("/total-motels")
    public ApiResponse<Long> getTotalMotels() {
        return ApiResponse.<Long>builder()
                .message("Lấy tổng số nhà trọ thành công")
                .result(statisticsService.getTotalMotels())
                .build();
    }

    @Operation(summary = "Get account creation statistics for last week by day")
    @GetMapping("/total-account-last-week")
    public ApiResponse<Map<DayOfWeek, Long>> getAccountsCreatedLastWeek() {
        return ApiResponse.<Map<DayOfWeek, Long>>builder()
                .message("Lấy thống kê tài khoản trong tuần vừa qua thành công")
                .result(statisticsService.getAccountsCreatedLastWeek())
                .build();
    }

    @Operation(summary = "Get account creation statistics for current year by month")
    @GetMapping("/accounts-total-this-year")
    public ApiResponse<Map<Integer, Long>> getAccountsCreatedThisYear() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Lấy thống kê tài khoản trong năm hiện tại thành công")
                .result(statisticsService.getAccountsCreatedThisYear())
                .build();
    }

    @Operation(summary = "Get account creation statistics for last year by month")
    @GetMapping("/accounts-total-last-year")
    public ApiResponse<Map<Integer, Long>> getAccountsCreatedLastYear() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Lấy thống kê tài khoản trong năm trước thành công")
                .result(statisticsService.getAccountsCreatedLastYear())
                .build();
    }

    @Operation(summary = "Get motel creation statistics by month")
    @GetMapping("/total-motel-by-month")
    public ApiResponse<Map<Integer, Long>> getTotalMotelsByMonth() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Lấy thống kê nhà trọ theo tháng thành công")
                .result(statisticsService.getTotalMotelsByMonth())
                .build();
    }

    @Operation(summary = "Get recently registered host accounts")
    @GetMapping("/account-recent-hosts")
    public ApiResponse<List<AccountResponse>> getRecentHosts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Lấy danh sách chủ trọ đăng ký gần đây thành công")
                .result(statisticsService.getRecentHosts())
                .build();
    }
}
