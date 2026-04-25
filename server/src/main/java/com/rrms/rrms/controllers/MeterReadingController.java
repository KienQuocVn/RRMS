package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.MeterReadingRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MeterReadingResponse;
import com.rrms.rrms.services.IMeterReadingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Meter Reading Controller", description = "Utility meter reading management (electricity, water)")
@RestController
@RequestMapping({"/api/meter-readings", "/api/v1/meter-readings"})
@RequiredArgsConstructor
public class MeterReadingController {

    private final IMeterReadingService meterReadingService;

    @Operation(summary = "Get all meter readings by motel ID")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<List<MeterReadingResponse>> getAllByMotel(@PathVariable UUID motelId) {
        return ApiResponse.<List<MeterReadingResponse>>builder()
                .message("Meter readings retrieved successfully")
                .result(meterReadingService.getAllByMotel(motelId))
                .build();
    }

    @Operation(summary = "Get all meter readings by room ID")
    @GetMapping("/room/{roomId}")
    public ApiResponse<List<MeterReadingResponse>> getAllByRoom(@PathVariable UUID roomId) {
        return ApiResponse.<List<MeterReadingResponse>>builder()
                .message("Meter readings retrieved successfully")
                .result(meterReadingService.getAllByRoom(roomId))
                .build();
    }

    @Operation(summary = "Create a new meter reading")
    @PostMapping
    public ResponseEntity<ApiResponse<MeterReadingResponse>> save(@RequestBody MeterReadingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<MeterReadingResponse>builder()
                        .message("Meter reading created successfully")
                        .result(meterReadingService.save(request))
                        .build());
    }

    @Operation(summary = "Delete a meter reading by ID")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        meterReadingService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Meter reading deleted successfully")
                .build();
    }
}
