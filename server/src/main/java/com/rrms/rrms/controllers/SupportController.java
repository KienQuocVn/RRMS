package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.SupportRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.SupportResponse;
import com.rrms.rrms.services.ISupportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Support Controller", description = "Support ticket management for tenant housing requests")
@RestController
@RequestMapping({"/support", "/supports", "/api/v1/supports"})
public class SupportController {
    ISupportService supportService;

    @Operation(summary = "Create a new support ticket")
    @PostMapping({"", "/create"})
    public ResponseEntity<ApiResponse<SupportResponse>> createSupport(@RequestBody SupportRequest supportRequest) {
        SupportResponse result = supportService.createSupport(supportRequest);
        log.info("Support ticket created successfully");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SupportResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Support ticket created successfully")
                        .result(result)
                        .build());
    }

    @Operation(summary = "Get all support tickets")
    @GetMapping({"", "/getAll"})
    public ApiResponse<List<SupportResponse>> getAllSupports() {
        return ApiResponse.<List<SupportResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Support tickets retrieved successfully")
                .result(supportService.getAllSupports())
                .build();
    }

    @Operation(summary = "Get a support ticket by ID")
    @GetMapping("/{supportId}")
    public ApiResponse<SupportResponse> getSupportById(@PathVariable UUID supportId) {
        return ApiResponse.<SupportResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Support ticket retrieved successfully")
                .result(supportService.getSupportById(supportId))
                .build();
    }

    @Operation(summary = "Delete a support ticket by ID")
    @DeleteMapping("/{supportId}")
    public ApiResponse<Void> deleteSupport(@PathVariable UUID supportId) {
        supportService.deleteSupport(supportId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Support ticket deleted successfully")
                .build();
    }
}
