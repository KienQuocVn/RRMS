package com.rrms.rrms.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.ResolveViolationReportRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.ViolationReportCaseResponse;
import com.rrms.rrms.dto.response.ViolationReportStatsResponse;
import com.rrms.rrms.services.IViolationReportService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/violation-reports")
public class ViolationReportController {

    IViolationReportService violationReportService;

    @Operation(summary = "Get aggregated violation report cases for admin dashboard")
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<ViolationReportCaseResponse>> getViolationReports() {
        return ApiResponse.<List<ViolationReportCaseResponse>>builder()
                .message("Lấy danh sách báo cáo vi phạm thành công")
                .code(HttpStatus.OK.value())
                .result(violationReportService.getAggregatedCases())
                .build();
    }

    @Operation(summary = "Get violation report quick stats")
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<ViolationReportStatsResponse> getViolationReportStats() {
        return ApiResponse.<ViolationReportStatsResponse>builder()
                .message("Lấy thống kê báo cáo vi phạm thành công")
                .code(HttpStatus.OK.value())
                .result(violationReportService.getStats())
                .build();
    }

    @Operation(summary = "Resolve a violation report case")
    @PutMapping("/resolve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<ViolationReportCaseResponse> resolveViolationReport(
            @RequestBody ResolveViolationReportRequest request) {
        return ApiResponse.<ViolationReportCaseResponse>builder()
                .message("Xử lý báo cáo vi phạm thành công")
                .code(HttpStatus.OK.value())
                .result(violationReportService.resolveCase(request.getCaseKey(), request))
                .build();
    }
}
