package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.RoomDeviceRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoomDeviceResponse;
import com.rrms.rrms.services.IRoomDeviceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "RoomDevice Controller", description = "Controller for mapping devices to rooms")
@RestController
@RequestMapping("/api/v1/room-devices")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class RoomDeviceController {

    IRoomDeviceService roomDeviceService;

    @Operation(summary = "Insert a room device")
    @PostMapping
    public ApiResponse<RoomDeviceResponse> insertRoomDevice(@RequestBody RoomDeviceRequest roomDeviceRequest) {
        RoomDeviceResponse roomDeviceResponse = roomDeviceService.insertRoomDevice(roomDeviceRequest);
        if (roomDeviceResponse != null) {
            log.info("Insert roomDevice successfully");
            return ApiResponse.<RoomDeviceResponse>builder()
                    .code(HttpStatus.CREATED.value())
                    .message("success")
                    .result(roomDeviceResponse)
                    .build();
        } else {
            log.error("Insert roomDevice failed");
            return ApiResponse.<RoomDeviceResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .build();
        }
    }

    @Operation(summary = "Delete a room device")
    @DeleteMapping("/{roomId}/devices/{motelDeviceId}")
    public ApiResponse<Void> deleteRoomDevice(
            @PathVariable("roomId") UUID roomId, @PathVariable("motelDeviceId") UUID motelDeviceId) {
        Boolean result = roomDeviceService.deleteByRoomAndAndMotelDevice(roomId, motelDeviceId);
        if (result) {
            log.info("delete roomDevice successfully");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .build();
        } else {
            log.error("delete roomDevice failed");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("error")
                    .build();
        }
    }

    @Operation(summary = "Get devices by room ID")
    @GetMapping("/{roomId}")
    public ApiResponse<List<RoomDeviceResponse>> getDeviceByRomId(@PathVariable("roomId") UUID roomId) {
        List<RoomDeviceResponse> getDeviceByRomId = roomDeviceService.getAllDeviceByRoomId(roomId);
        return ApiResponse.<List<RoomDeviceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("success")
                .result(getDeviceByRomId)
                .build();
    }

    @Operation(summary = "Update quantity of a room device")
    @PutMapping("/{roomId}/devices/{motelDeviceId}")
    public ApiResponse<Void> updateQuantityRoomDevice(
            @PathVariable("roomId") UUID roomId,
            @PathVariable("motelDeviceId") UUID motelDeviceId,
            @RequestParam("quantity") Integer quantity) {
        Boolean result = roomDeviceService.updateQuantity(roomId, motelDeviceId, quantity);
        if (result) {
            log.info("update quantity roomDevice successfully");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .build();
        } else {
            log.error("update quantity roomDevice failed");
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("error")
                    .build();
        }
    }
}
