package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.PermissionRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.PermissionResponse;
import com.rrms.rrms.services.IPermissionService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Permission Controller", description = "Controller for Permission")
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping({"/permissions", "/api/v1/permissions"})
public class PermissionController {

    IPermissionService permissionService;

    @GetMapping({"", "/getAllPermission"})
    public ApiResponse<List<PermissionResponse>> getAllPermission() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .message("Lấy danh sách quyền thành công")
                .result(permissionService.getAllPermissions())
                .build();
    }

    @PostMapping({"", "/createPermission"})
    public ResponseEntity<ApiResponse<PermissionResponse>> addPermission(@RequestBody PermissionRequest request) {
        PermissionResponse permissionResponse = permissionService.createPermission(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PermissionResponse>builder()
                        .message("Tạo quyền mới thành công")
                        .result(permissionResponse)
                        .build());
    }

    @PutMapping({"/{id}", "/updatePermission"})
    public ApiResponse<PermissionResponse> updatePermission(
            @PathVariable(name = "id", required = false) UUID id, @RequestBody PermissionRequest permissionRequest) {
        if (id != null) {
            permissionRequest.setPermissionId(id);
        }
        PermissionResponse updatedPermission = permissionService.updatePermission(permissionRequest);
        return ApiResponse.<PermissionResponse>builder()
                .message("Cập nhật quyền thành công")
                .result(updatedPermission)
                .build();
    }

    @DeleteMapping({"/{id}", "/deletePermission/{id}"})
    public ApiResponse<Void> deletePermission(@PathVariable UUID id) {
        permissionService.deletePermission(id);
        return ApiResponse.<Void>builder().message("Xóa quyền thành công").build();
    }
}
