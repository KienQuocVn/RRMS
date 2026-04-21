package com.rrms.rrms.controllers;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.services.IStatistics;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping({"/statistics", "/api/v1/statistics"})
@RequiredArgsConstructor
public class StatisticsController {

    private final IStatistics statisticsService;

    @GetMapping("/total-accounts")
    public ApiResponse<Long> getTotalAccounts() {
        return ApiResponse.<Long>builder()
                .message("Total accounts retrieved successfully")
                .result(statisticsService.getTotalAccounts())
                .build();
    }

    @GetMapping("/total-tenants")
    public ApiResponse<Long> getTotalTenants() {
        return ApiResponse.<Long>builder()
                .message("Total tenants retrieved successfully")
                .result(statisticsService.getTotalTenants())
                .build();
    }

    @GetMapping("/total-host-accounts")
    public ApiResponse<Long> getTotalHostAccounts() {
        return ApiResponse.<Long>builder()
                .message("Total host accounts retrieved successfully")
                .result(statisticsService.getTotalHostAccounts())
                .build();
    }

    @GetMapping("/total-motels")
    public ApiResponse<Long> getTotalMotels() {
        return ApiResponse.<Long>builder()
                .message("Total motels retrieved successfully")
                .result(statisticsService.getTotalMotels())
                .build();
    }

    @GetMapping("/total-account-last-week")
    public ApiResponse<Map<DayOfWeek, Long>> getAccountsCreatedLastWeek() {
        return ApiResponse.<Map<DayOfWeek, Long>>builder()
                .message("Weekly account statistics retrieved successfully")
                .result(statisticsService.getAccountsCreatedLastWeek())
                .build();
    }

    @GetMapping("/accounts-total-this-year")
    public ApiResponse<Map<Integer, Long>> getAccountsCreatedThisYear() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Current year account statistics retrieved successfully")
                .result(statisticsService.getAccountsCreatedThisYear())
                .build();
    }

    @GetMapping("/accounts-total-last-year")
    public ApiResponse<Map<Integer, Long>> getAccountsCreatedLastYear() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Last year account statistics retrieved successfully")
                .result(statisticsService.getAccountsCreatedLastYear())
                .build();
    }

    @GetMapping("/total-motel-by-month")
    public ApiResponse<Map<Integer, Long>> getTotalMotelsByMonth() {
        return ApiResponse.<Map<Integer, Long>>builder()
                .message("Monthly motel statistics retrieved successfully")
                .result(statisticsService.getTotalMotelsByMonth())
                .build();
    }

    @GetMapping("/account-recent-hosts")
    public ApiResponse<List<AccountResponse>> getRecentHosts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Recent hosts retrieved successfully")
                .result(statisticsService.getRecentHosts())
                .build();
    }
}
