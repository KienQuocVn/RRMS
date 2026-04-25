package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.MotelDeviceRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MotelDeviceResponse;
import com.rrms.rrms.services.IMotelDeviceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Motel Device Controller", description = "Controller for mapping devices to motels")
@RestController
@RequestMapping("/api/v1/motel-devices")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class MotelDeviceController {

    IMotelDeviceService motelDeviceService;

    @Operation(summary = "Get all motel devices by motel ID")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<List<MotelDeviceResponse>> getMotelDevices(@PathVariable("motelId") UUID motelId) {
        List<MotelDeviceResponse> motelResponses = motelDeviceService.getAllMotelDevicesByMotel(motelId);
        log.info("Get all motel devices successfully for motel: {}", motelId);
        return ApiResponse.<List<MotelDeviceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(motelResponses)
                .build();
    }

    @Operation(summary = "Insert a new motel device")
    @PostMapping
    public ApiResponse<MotelDeviceResponse> insertMotelDevice(@RequestBody MotelDeviceRequest motelDeviceRequest) {
        MotelDeviceResponse motelResponses = motelDeviceService.insertMotelDevice(motelDeviceRequest);
        if (motelResponses != null) {
            log.info("Insert motel device successfully");
            return ApiResponse.<MotelDeviceResponse>builder()
                    .code(HttpStatus.CREATED.value())
                    .message("success")
                    .result(motelResponses)
                    .build();
        } else {
            log.error("Insert motel device failed");
            return ApiResponse.<MotelDeviceResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .build();
        }
    }

    @Operation(summary = "Delete motel device by ID")
    @DeleteMapping("/{motelDeviceId}")
    public ApiResponse<Void> deleteMotelDevice(@PathVariable("motelDeviceId") UUID motelDeviceId) {
        boolean result = motelDeviceService.deleteMotelDevice(motelDeviceId);
        if (result) {
            log.info("Delete motel device successfully");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .build();
        } else {
            log.error("Delete motel device failed");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .build();
        }
    }
}
