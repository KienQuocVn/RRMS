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
                .message("Lấy tổng số phòng thành công")
                .result(totalRooms)
                .build();
    }

    @Operation(summary = "Get room counts grouped by contract status")
    @GetMapping("/room-counts")
    public ApiResponse<List<MotelRoomCountResponse>> getRoomCountsByContractStatus() {
        return ApiResponse.<List<MotelRoomCountResponse>>builder()
                .message("Lấy số lượng phòng theo trạng thái hợp đồng thành công")
                .result(motelService.getRoomCountsByContractStatus())
                .build();
    }

    @Operation(summary = "Get total tenant count for a motel")
    @GetMapping("/{motelId}/tenants/count")
    public ApiResponse<Integer> getTotalTenants(@PathVariable UUID motelId) {
        return ApiResponse.<Integer>builder()
                .message("Lấy tổng số người thuê thành công")
                .result(contractService.getTotalTenantsByMotelId(motelId))
                .build();
    }

    @Operation(summary = "Get tenant summary report")
    @GetMapping("/tenant/summary")
    public ApiResponse<List<TenantSummaryDTO>> getTenantSummary() {
        return ApiResponse.<List<TenantSummaryDTO>>builder()
                .message("Lấy báo cáo tổng hợp người thuê thành công")
                .result(tenantService.getTenantSummary())
                .build();
    }

    @Operation(summary = "Get total deposit amount for a motel")
    @GetMapping("/{motelId}/deposits")
    public ApiResponse<Double> getTotalDeposit(@PathVariable UUID motelId) {
        return ApiResponse.<Double>builder()
                .message("Lấy tổng tiền đặt cọc thành công")
                .result(motelService.calculateTotalDeposit(motelId))
                .build();
    }

    @Operation(summary = "Get total reservation deposit for a motel")
    @GetMapping("/{motelId}/reserve-deposits")
    public ApiResponse<Double> getTotalReserveDeposit(@PathVariable UUID motelId) {
        return ApiResponse.<Double>builder()
                .message("Lấy tổng tiền giữ chỗ thành công")
                .result(motelService.calculateTotalReserveDeposit(motelId))
                .build();
    }

    @Operation(summary = "Get total paid invoice amount for a motel")
    @GetMapping("/{motelId}/total-paid-invoices")
    public ApiResponse<BigDecimal> getTotalPaidInvoices(@PathVariable UUID motelId) {
        return ApiResponse.<BigDecimal>builder()
                .message("Lấy tổng tiền hóa đơn đã thanh toán thành công")
                .result(motelService.getTotalPaidInvoices(motelId))
                .build();
    }

    @Operation(summary = "Get total paid room price for a motel")
    @GetMapping("/{motelId}/total-paid-room-price")
    public ApiResponse<BigDecimal> getTotalPaidRoomPrice(@PathVariable UUID motelId) {
        return ApiResponse.<BigDecimal>builder()
                .message("Lấy tổng tiền phòng đã thanh toán thành công")
                .result(motelService.getTotalPaidRoomPrice(motelId))
                .build();
    }
}
