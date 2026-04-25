package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.RoleRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoleResponse;
import com.rrms.rrms.services.IRoleService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Role Controller", description = "Controller for Role")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/roles")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class RolesController {

    IRoleService roleService;

    @Cacheable(value = "role")
    @GetMapping("/getAllRole")
    public ApiResponse<List<RoleResponse>> getAllRole() {
        List<RoleResponse> roleResponse = roleService.GetAllRoles();
        try {
            return ApiResponse.<List<RoleResponse>>builder()
                    .message("Lấy danh sách vai trò thành công")
                    .code(HttpStatus.OK.value())
                    .result(roleResponse)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<List<RoleResponse>>builder()
                    .message("Lấy danh sách vai trò thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }

    @GetMapping("/getRole/{id}")
    @Cacheable(value = "role", key = "#id")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable("id") UUID id) {
        try {
            RoleResponse roleResponse = roleService.findById(id);
            return ApiResponse.<RoleResponse>builder()
                    .message("Lấy thông tin vai trò thành công")
                    .code(HttpStatus.OK.value())
                    .result(roleResponse)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<RoleResponse>builder()
                    .message("Lấy thông tin vai trò thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }

    @GetMapping("/getRole/noCache/{id}")
    public ApiResponse<RoleResponse> getRoleByIdNoCache(@PathVariable("id") UUID id) {
        try {
            RoleResponse roleResponse = roleService.findById(id);
            return ApiResponse.<RoleResponse>builder()
                    .message("Lấy thông tin vai trò thành công")
                    .code(HttpStatus.OK.value())
                    .result(roleResponse)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<RoleResponse>builder()
                    .message("Lấy thông tin vai trò thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }

    @CacheEvict(value = "role", allEntries = true)
    @PostMapping("/createRole")
    public ApiResponse<RoleResponse> addRole(@RequestBody RoleRequest request) {
        try {
            RoleResponse roleResponse = roleService.createRole(request);
            return ApiResponse.<RoleResponse>builder()
                    .message("Tạo vai trò mới thành công")
                    .code(HttpStatus.CREATED.value())
                    .result(roleResponse)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<RoleResponse>builder()
                    .message("Tạo vai trò mới thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }

    @CachePut(value = "role", key = "#roleRequest.roleId")
    @PutMapping("/updateRole")
    public ApiResponse<RoleResponse> updateRole(@RequestBody RoleRequest roleRequest) {
        try {
            RoleResponse roleResponse = roleService.updateRole(roleRequest);
            return ApiResponse.<RoleResponse>builder()
                    .message("Cập nhật vai trò thành công")
                    .code(HttpStatus.OK.value())
                    .result(roleResponse)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<RoleResponse>builder()
                    .message("Cập nhật vai trò thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }

    @CacheEvict(value = "role", key = "#id")
    @DeleteMapping("/deleteRole/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable UUID id) {
        try {
            roleService.deleteRole(id);
            return ApiResponse.<Void>builder()
                    .message("Xóa vai trò thành công")
                    .code(HttpStatus.NO_CONTENT.value())
                    .result(null)
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<Void>builder()
                    .message("Xóa vai trò thất bại")
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result(null)
                    .build();
        }
    }
}
