package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.RoomServiceRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoomServiceDetailResponse;
import com.rrms.rrms.dto.response.RoomServiceResponse;
import com.rrms.rrms.services.IRoomServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Room Service Mapping Controller", description = "Controller for mapping utilities/amenities to rooms")
@RestController
@Slf4j
@RequestMapping("/api/v1/room-services")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class RoomServiceController {
    IRoomServiceService roomServiceService;

    @Operation(summary = "Create room service mapping")
    @PostMapping
    public ApiResponse<RoomServiceResponse> createRoomService(@RequestBody RoomServiceRequest roomServiceRequest) {
        RoomServiceResponse response = roomServiceService.createRoomService(roomServiceRequest);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo dịch vụ cho phòng thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Update room service mapping by ID")
    @PutMapping("/{roomServiceId}")
    public ApiResponse<RoomServiceResponse> updateRoomService(
            @PathVariable UUID roomServiceId, @RequestBody RoomServiceRequest request) {
        RoomServiceResponse response = roomServiceService.updateRoomService(roomServiceId, request);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật dịch vụ phòng thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Get room service mapping by ID")
    @GetMapping("/{roomServiceId}")
    public ApiResponse<RoomServiceResponse> getRoomServiceById(@PathVariable UUID roomServiceId) {
        RoomServiceResponse response = roomServiceService.getRoomServiceById(roomServiceId);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin dịch vụ phòng thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Delete room service mapping")
    @DeleteMapping("/{roomServiceId}")
    public ApiResponse<Void> deleteRoomService(@PathVariable UUID roomServiceId) {
        roomServiceService.deleteRoomService(roomServiceId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa dịch vụ phòng thành công")
                .build();
    }

    @Operation(summary = "Get all room service mappings")
    @GetMapping
    public ApiResponse<List<RoomServiceResponse>> findAll() {
        List<RoomServiceResponse> response = roomServiceService.findAll();
        return ApiResponse.<List<RoomServiceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách dịch vụ phòng thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Get room services by Room ID")
    @GetMapping("/room/{roomId}")
    public ApiResponse<List<RoomServiceDetailResponse>> findByRoomId(@PathVariable UUID roomId) {
        List<RoomServiceDetailResponse> response = roomServiceService.findByRoomId(roomId);
        return ApiResponse.<List<RoomServiceDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách dịch vụ theo phòng thành công")
                .result(response)
                .build();
    }
}
