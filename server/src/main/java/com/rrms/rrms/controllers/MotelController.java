package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.MotelRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MotelResponse;
import com.rrms.rrms.services.IMotelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Motel Controller", description = "Controller for Motel operations (ADMIN & HOST)")
@RestController
@RequestMapping("/api/v1/motels")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class MotelController {
    IMotelService motelService;

    @Operation(summary = "Get all motels")
    @GetMapping
    public ApiResponse<List<MotelResponse>> getMotels() {
        List<MotelResponse> motelResponses = motelService.findAll();
        log.info("Get all motels successfully");
        return ApiResponse.<List<MotelResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(motelResponses)
                .build();
    }

    @Operation(summary = "Get motel by ID")
    @GetMapping("/{id}")
    public ApiResponse<MotelResponse> getMotelById(@PathVariable UUID id) {
        MotelResponse motelResponse = motelService.findById(id);
        return ApiResponse.<MotelResponse>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(motelResponse)
                .build();
    }

    @Operation(summary = "Get motels by account username")
    @GetMapping("/account/{username}")
    public ApiResponse<List<MotelResponse>> getMotelsByAccount(@PathVariable String username) {
        List<MotelResponse> motelResponses = motelService.findMotelByAccount_Username(username);
        return ApiResponse.<List<MotelResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(motelResponses)
                .build();
    }

    @Operation(summary = "Create a new motel")
    @PostMapping
    public ApiResponse<MotelResponse> createMotel(@RequestBody MotelRequest motelRequest) {
        MotelResponse motelResponse = motelService.insert(motelRequest);
        log.info("Create motel successfully");
        return ApiResponse.<MotelResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("success")
                .result(motelResponse)
                .build();
    }

    @Operation(summary = "Update motel by ID")
    @PutMapping("/{id}")
    public ApiResponse<MotelResponse> updateMotel(@PathVariable("id") UUID id, @RequestBody MotelRequest motelRequest) {
        MotelResponse motelResponse = motelService.update(id, motelRequest);
        log.info("Update motel successfully");
        return ApiResponse.<MotelResponse>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(motelResponse)
                .build();
    }

    @Operation(summary = "Delete motel by ID")
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteMotel(@PathVariable("id") UUID id) {
        try {
            motelService.delete(id);
            log.info("Delete motel successfully");
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(true)
                    .build();
        } catch (Exception e) {
            log.error("Delete motel failed", e);
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }
}
