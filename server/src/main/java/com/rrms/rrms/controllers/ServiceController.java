package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.ServiceRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.ServiceResponse;
import com.rrms.rrms.services.IService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Service Controller")
@RestController
@Slf4j
@RequestMapping("/service")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ServiceController {

    IService service;

    // ── Create ────────────────────────────────────────────────────────────────

    @Operation(summary = "Tạo dịch vụ mới")
    @PostMapping
    public ApiResponse<ServiceResponse> createService(@Valid @RequestBody ServiceRequest serviceRequest) {
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo dịch vụ thành công")
                .result(service.createService(serviceRequest))
                .build();
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Operation(summary = "Lấy danh sách tất cả dịch vụ")
    @GetMapping
    public ApiResponse<List<ServiceResponse>> getAllServices() {
        return ApiResponse.<List<ServiceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách dịch vụ thành công")
                .result(service.getAllServices())
                .build();
    }

    @Operation(summary = "Lấy thông tin dịch vụ theo ID")
    @GetMapping("/{id}")
    public ApiResponse<ServiceResponse> getServiceById(@PathVariable UUID id) {
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin dịch vụ thành công")
                .result(service.getServiceById(id))
                .build();
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Operation(summary = "Cập nhật dịch vụ theo ID")
    @PutMapping("/{id}")
    public ApiResponse<ServiceResponse> updateService(
            @PathVariable UUID id, @Valid @RequestBody ServiceRequest serviceRequest) {
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật dịch vụ thành công")
                .result(service.updateService(id, serviceRequest))
                .build();
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Operation(summary = "Xóa dịch vụ theo ID")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteService(@PathVariable UUID id) {
        service.deleteService(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa dịch vụ thành công")
                .build();
    }
}
