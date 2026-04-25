package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.RoomRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoomResponse;
import com.rrms.rrms.services.IRoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Room Controller", description = "Controller for Room operations (ADMIN & HOST)")
@RestController
@Slf4j
@RequestMapping("/api/v1/rooms")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class RoomController {

    IRoomService roomService;

    @Operation(summary = "Create a new room")
    @PostMapping
    public ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest) {
        log.info("Create room for motelId: {}", roomRequest.getMotelId());
        RoomResponse createdRoom = roomService.createRoom(roomRequest);
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo phòng mới thành công")
                .result(createdRoom)
                .build();
    }

    @Operation(summary = "Get room details by ID")
    @GetMapping("/{roomId}")
    public ApiResponse<RoomResponse> getRoomById(@PathVariable UUID roomId) {
        RoomResponse roomDetail = roomService.getRoomByIdStandard(roomId);
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin phòng thành công")
                .result(roomDetail)
                .build();
    }

    @Operation(summary = "Get all rooms")
    @GetMapping
    public ApiResponse<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ApiResponse.<List<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách phòng thành công")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Update room by ID")
    @PutMapping("/{roomId}")
    public ApiResponse<RoomResponse> updateRoom(@PathVariable UUID roomId, @RequestBody RoomRequest roomRequest) {
        log.info("Update room ID: {}", roomId);
        RoomResponse updatedRoom = roomService.updateRoom(roomId, roomRequest);
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật phòng thành công")
                .result(updatedRoom)
                .build();
    }

    @Operation(summary = "Delete room by ID")
    @DeleteMapping("/{roomId}")
    public ApiResponse<Void> deleteRoom(@PathVariable UUID roomId) {
        log.info("Delete room ID: {}", roomId);
        roomService.deleteRoomStandard(roomId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa phòng thành công")
                .build();
    }

    @Operation(summary = "Get all rooms by motel ID")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<List<RoomResponse>> getRoomsByMotelId(@PathVariable UUID motelId) {
        List<RoomResponse> rooms = roomService.getRoomsByMotelId(motelId);
        return ApiResponse.<List<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách phòng theo nhà trọ thành công")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Get all rooms by motel ID without active contracts")
    @GetMapping("/motel/{motelId}/without-contract")
    public ApiResponse<List<RoomResponse>> getRoomsByMotelIdWithoutContract(@PathVariable UUID motelId) {
        List<RoomResponse> rooms = roomService.getRoomsByMotelIdNullContract(motelId);
        return ApiResponse.<List<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách phòng chưa có hợp đồng thành công")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Get all rooms by motel ID with active contracts")
    @GetMapping("/motel/{motelId}/with-contract")
    public ApiResponse<List<RoomResponse>> getRoomsByMotelIdWithContract(@PathVariable UUID motelId) {
        List<RoomResponse> rooms = roomService.getRoomsByMotelIdContract(motelId);
        return ApiResponse.<List<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách phòng đang có hợp đồng thành công")
                .result(rooms)
                .build();
    }
}
