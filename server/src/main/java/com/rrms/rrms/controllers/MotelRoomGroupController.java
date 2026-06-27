package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.MotelRoomGroupRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.MotelRoomGroupResponse;
import com.rrms.rrms.services.IMotelRoomGroupService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Motel Room Group Controller", description = "Controller for motel floor/room groups")
@RequestMapping("/api/v1/motel-room-groups")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class MotelRoomGroupController {

    IMotelRoomGroupService motelRoomGroupService;

    @Operation(summary = "Get room groups by motel ID")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<List<MotelRoomGroupResponse>> getByMotelId(@PathVariable UUID motelId) {
        List<MotelRoomGroupResponse> responses = motelRoomGroupService.getByMotelId(motelId);
        return ApiResponse.<List<MotelRoomGroupResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách tầng thành công")
                .result(responses)
                .build();
    }

    @Operation(summary = "Create a room group for motel")
    @PostMapping
    public ApiResponse<MotelRoomGroupResponse> create(@RequestBody MotelRoomGroupRequest request) {
        MotelRoomGroupResponse response = motelRoomGroupService.create(request);
        return ApiResponse.<MotelRoomGroupResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Thêm tầng thành công")
                .result(response)
                .build();
    }

    @Operation(summary = "Delete a room group")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        motelRoomGroupService.delete(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa tầng thành công")
                .build();
    }
}
