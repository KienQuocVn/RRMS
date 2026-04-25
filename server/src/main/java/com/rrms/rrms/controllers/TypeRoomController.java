package com.rrms.rrms.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.TypeRoomRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.TypeRoomResponse;
import com.rrms.rrms.services.ITypeRoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Type Room Controller", description = "Controller for Room Types")
@RestController
@Slf4j
@RequestMapping("/api/v1/type-rooms")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class TypeRoomController {
    ITypeRoomService typeRoomService;

    @Operation(summary = "Create a new room type")
    @PostMapping
    public ApiResponse<TypeRoomResponse> createTypeRoom(@RequestBody TypeRoomRequest typeRoomRequest) {
        return ApiResponse.<TypeRoomResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo loại phòng thành công")
                .result(typeRoomService.createTypeRoom(typeRoomRequest))
                .build();
    }

    @Operation(summary = "Get all room types")
    @GetMapping
    public ApiResponse<List<TypeRoomResponse>> findAllTypeRooms() {
        return ApiResponse.<List<TypeRoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách loại phòng thành công")
                .result(typeRoomService.findAllTypeRooms())
                .build();
    }
}
