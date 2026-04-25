package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.MotelServiceRequest;
import com.rrms.rrms.dto.request.MotelServiceUpdateRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MotelServiceResponse;
import com.rrms.rrms.services.IMotelServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Motel Service Controller", description = "Controller for Motel services mapping")
@RequestMapping("/api/v1/motel-services")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class MotelServiceController {

    IMotelServiceService motelServiceService;

    @Operation(summary = "Create a new MotelService mapping")
    @PostMapping
    public ApiResponse<MotelServiceResponse> createMotelService(@RequestBody MotelServiceRequest request) {
        MotelServiceResponse response = motelServiceService.createMotelService(request);
        return ApiResponse.<MotelServiceResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo mới dịch vụ cho nhà trọ thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Update MotelService mapping by Motel ID")
    @PutMapping("/motel/{motelId}")
    public ApiResponse<MotelServiceResponse> updateMotelServiceByMotelId(
            @PathVariable UUID motelId, @RequestBody MotelServiceUpdateRequest request) {
        MotelServiceResponse updatedService = motelServiceService.updateMotelServiceById(motelId, request);
        return ApiResponse.<MotelServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật dịch vụ theo nhà trọ thành công")
                .result(updatedService)
                .build();
    }

    @Operation(summary = "Update a MotelService mapping by ID")
    @PutMapping("/{id}")
    public ApiResponse<MotelServiceResponse> updateMotelService(
            @PathVariable UUID id, @RequestBody MotelServiceUpdateRequest request) {
        MotelServiceResponse response = motelServiceService.updateMotelService(id, request);
        return ApiResponse.<MotelServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật dịch vụ thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Get all MotelService mappings")
    @GetMapping
    public ApiResponse<List<MotelServiceResponse>> getAllMotelServices() {
        List<MotelServiceResponse> responses = motelServiceService.getAllMotelServices();
        return ApiResponse.<List<MotelServiceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách dịch vụ của nhà trọ thành công")
                .result(responses)
                .build();
    }

    @Operation(summary = "Get a MotelService mapping by ID")
    @GetMapping("/{id}")
    public ApiResponse<MotelServiceResponse> getMotelServiceById(@PathVariable UUID id) {
        MotelServiceResponse response = motelServiceService.getMotelServiceById(id);
        return ApiResponse.<MotelServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin dịch vụ thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Delete an existing MotelService mapping")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMotelService(@PathVariable UUID id) {
        motelServiceService.deleteMotelService(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa dịch vụ khỏi nhà trọ thành công")
                .build();
    }
}
