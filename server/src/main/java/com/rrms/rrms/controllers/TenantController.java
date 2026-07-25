package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.TenantRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.TenantResponse;
import com.rrms.rrms.services.ITenantService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/tenant")
public class TenantController {

    ITenantService tenantService;

    @RequestMapping("")
    public ApiResponse<List<TenantResponse>> getAllTenants() {
        List<TenantResponse> tenantResponses = tenantService.getAllTenants();
        return ApiResponse.<List<TenantResponse>>builder()
                .message("Lấy danh sách người thuê thành công")
                .code(HttpStatus.OK.value())
                .result(tenantResponses)
                .build();
    }

    @Operation(summary = "Get tenant by id")
    @GetMapping("/tenant-id")
    public ApiResponse<TenantResponse> getTenantById(@RequestParam UUID id) {
        TenantResponse tenantResponse = tenantService.findById(id);
        return ApiResponse.<TenantResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin người thuê thành công")
                .result(tenantResponse)
                .build();
    }

    @Operation(summary = "Add tenant by id")
    @PostMapping("/insert/{roomId}")
    public ApiResponse<TenantResponse> insertTenant(
            @RequestBody TenantRequest tenantRequest, @PathVariable UUID roomId) {
        TenantResponse tenantResponse = tenantService.insert(roomId, tenantRequest);
        return ApiResponse.<TenantResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm người thuê thành công")
                .result(tenantResponse)
                .build();
    }

    @Operation(summary = "Update tenant by id")
    @PutMapping("/{id}")
    public ApiResponse<TenantResponse> updateTenant(
            @PathVariable("id") UUID id, @RequestBody TenantRequest tenantRequest) {
        if (id != null && tenantRequest != null) {
            TenantResponse tenantResponse = tenantService.update(id, tenantRequest);
            return ApiResponse.<TenantResponse>builder()
                    .code(HttpStatus.OK.value())
                    .message("Cập nhật người thuê thành công")
                    .result(tenantResponse)
                    .build();
        }
        return ApiResponse.<TenantResponse>builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Cập nhật người thuê thất bại")
                .result(null)
                .build();
    }

    @Operation(summary = "Delete tenant by id")
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteTenant(@PathVariable("id") UUID id) {
        try {
            tenantService.delete(id);
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("Xóa người thuê thành công")
                    .result(true)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Xóa người thuê thất bại")
                    .result(false)
                    .build();
        }
    }

    @Operation(summary = "Delete tenant by id")
    @DeleteMapping("/room/{roomID}")
    public ApiResponse<Boolean> deleteTenantByRoomId(@PathVariable("roomID") UUID roomID) {
        try {
            tenantService.deleteByRoomId(roomID);
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("Xóa người thuê theo phòng thành công")
                    .result(true)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Xóa người thuê theo phòng thất bại")
                    .result(false)
                    .build();
        }
    }

    @RequestMapping("/roomId/{roomId}")
    public ApiResponse<List<TenantResponse>> getAllTenantsRoomId(@PathVariable("roomId") UUID roomId) {
        List<TenantResponse> tenantResponses = tenantService.getAllTenantsRoomId(roomId);
        return ApiResponse.<List<TenantResponse>>builder()
                .message("Lấy danh sách người thuê theo phòng thành công")
                .code(HttpStatus.OK.value())
                .result(tenantResponses)
                .build();
    }

    @Operation(summary = "Get all tenants by motel id")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<List<TenantResponse>> getAllTenantsByMotelId(@PathVariable("motelId") UUID motelId) {
        List<TenantResponse> tenantResponses = tenantService.getAllTenantsByMotelId(motelId);
        return ApiResponse.<List<TenantResponse>>builder()
                .message("Lấy danh sách người thuê theo nhà trọ thành công")
                .code(HttpStatus.OK.value())
                .result(tenantResponses)
                .build();
    }
}
