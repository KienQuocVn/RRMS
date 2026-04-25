package com.rrms.rrms.controllers;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MotelRoomCountResponse;
import com.rrms.rrms.dto.response.TenantSummaryDTO;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.services.IContractService;
import com.rrms.rrms.services.IMotelService;
import com.rrms.rrms.services.ITenantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Report Controller", description = "Motel financial and occupancy reports")
@RestController
@RequestMapping({"/report", "/api/v1/reports"})
@RequiredArgsConstructor
public class ReportController {
    private final IMotelService motelService;
    private final IContractService contractService;
    private final ITenantService tenantService;

    @Operation(summary = "Get total room count for a motel")
    @GetMapping("/total-rooms")
    public ApiResponse<Integer> getTotalRooms(@RequestParam UUID motelId, @RequestParam String username) {
        Integer totalRooms = motelService
                .getTotalRooms(motelId, username)
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));

        return ApiResponse.<Integer>builder()
                .message("Total rooms retrieved successfully")
                .result(totalRooms)
                .build();
    }

    @Operation(summary = "Get room counts grouped by contract status")
    @GetMapping("/room-counts")
    public ApiResponse<List<MotelRoomCountResponse>> getRoomCountsByContractStatus() {
        return ApiResponse.<List<MotelRoomCountResponse>>builder()
                .message("Room counts retrieved successfully")
                .result(motelService.getRoomCountsByContractStatus())
                .build();
    }

    @Operation(summary = "Get total tenant count for a motel")
    @GetMapping("/{motelId}/tenants/count")
    public ApiResponse<Integer> getTotalTenants(@PathVariable UUID motelId) {
        return ApiResponse.<Integer>builder()
                .message("Total tenants retrieved successfully")
                .result(contractService.getTotalTenantsByMotelId(motelId))
                .build();
    }

    @Operation(summary = "Get tenant summary report")
    @GetMapping("/tenant/summary")
    public ApiResponse<List<TenantSummaryDTO>> getTenantSummary() {
        return ApiResponse.<List<TenantSummaryDTO>>builder()
                .message("Tenant summary retrieved successfully")
                .result(tenantService.getTenantSummary())
                .build();
    }

    @Operation(summary = "Get total deposit amount for a motel")
    @GetMapping("/{motelId}/deposits")
    public ApiResponse<Double> getTotalDeposit(@PathVariable UUID motelId) {
        return ApiResponse.<Double>builder()
                .message("Total deposit retrieved successfully")
                .result(motelService.calculateTotalDeposit(motelId))
                .build();
    }

    @Operation(summary = "Get total reservation deposit for a motel")
    @GetMapping("/{motelId}/reserve-deposits")
    public ApiResponse<Double> getTotalReserveDeposit(@PathVariable UUID motelId) {
        return ApiResponse.<Double>builder()
                .message("Total reserve deposit retrieved successfully")
                .result(motelService.calculateTotalReserveDeposit(motelId))
                .build();
    }

    @Operation(summary = "Get total paid invoice amount for a motel")
    @GetMapping("/{motelId}/total-paid-invoices")
    public ApiResponse<BigDecimal> getTotalPaidInvoices(@PathVariable UUID motelId) {
        return ApiResponse.<BigDecimal>builder()
                .message("Total paid invoices retrieved successfully")
                .result(motelService.getTotalPaidInvoices(motelId))
                .build();
    }

    @Operation(summary = "Get total paid room price for a motel")
    @GetMapping("/{motelId}/total-paid-room-price")
    public ApiResponse<BigDecimal> getTotalPaidRoomPrice(@PathVariable UUID motelId) {
        return ApiResponse.<BigDecimal>builder()
                .message("Total paid room price retrieved successfully")
                .result(motelService.getTotalPaidRoomPrice(motelId))
                .build();
    }
}
