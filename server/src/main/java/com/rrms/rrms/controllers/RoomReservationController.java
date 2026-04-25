package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.RoomReservationRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoomReservationResponse;
import com.rrms.rrms.services.IRoomReservationService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Room Reservation Controller", description = "Controller for Room Reservations")
@RestController
@Slf4j
@RequestMapping("/room-reservations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class RoomReservationController {

    IRoomReservationService roomReservationService;

    @PostMapping
    public ApiResponse<RoomReservationResponse> createRoomReservation(@RequestBody RoomReservationRequest request) {
        RoomReservationResponse response = roomReservationService.createRoomReservation(request);
        return ApiResponse.<RoomReservationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo đặt phòng thành công")
                .result(response)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomReservationResponse> getRoomReservationById(@PathVariable UUID id) {
        RoomReservationResponse response = roomReservationService.getRoomReservationById(id);
        return ApiResponse.<RoomReservationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin đặt phòng thành công")
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoomReservationResponse>> getAllRoomReservations() {
        List<RoomReservationResponse> responses = roomReservationService.getAllRoomReservations();
        return ApiResponse.<List<RoomReservationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách đặt phòng thành công")
                .result(responses)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomReservationResponse> updateRoomReservation(
            @PathVariable UUID id, @RequestBody RoomReservationRequest request) {
        RoomReservationResponse response = roomReservationService.updateRoomReservation(id, request);
        return ApiResponse.<RoomReservationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật đặt phòng thành công")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoomReservation(@PathVariable UUID id) {
        roomReservationService.deleteRoomReservation(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .message("Xóa đặt phòng thành công")
                .build();
    }

    @GetMapping("/room/{roomId}")
    public ApiResponse<List<RoomReservationResponse>> getRoomReservationsByRoomId(@PathVariable UUID roomId) {
        List<RoomReservationResponse> responses = roomReservationService.getRoomReservationsByRoomId(roomId);
        return ApiResponse.<List<RoomReservationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách đặt phòng theo phòng thành công")
                .result(responses)
                .build();
    }
}
