package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.BulletinBoardRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.BulletinBoardResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.dto.response.BulletinBoardTableResponse;
import com.rrms.rrms.services.IBulletinBoard;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/v1/bulletin-boards")
public class BulletinBoardController {

    IBulletinBoard bulletinBoardService;

    @GetMapping("")
    public ApiResponse<List<BulletinBoardResponse>> getAllBulletinBoards() {
        List<BulletinBoardResponse> bulletinBoardResponse = bulletinBoardService.getAllBulletinBoards();
        return ApiResponse.<List<BulletinBoardResponse>>builder()
                .message("Lấy tất cả bảng tin thành công")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get bulletin board by id")
    @GetMapping("/{id}")
    public ApiResponse<BulletinBoardResponse> getBulletinBoardById(@PathVariable UUID id) {
        BulletinBoardResponse bulletinBoardResponse = bulletinBoardService.getBulletinBoardById(id);
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Lấy bảng tin theo id thành công")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Create bulletin board")
    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<BulletinBoardResponse> createBulletinBoard(
            @RequestBody BulletinBoardRequest bulletinBoardRequest) {
        BulletinBoardResponse bulletinBoardResponse = bulletinBoardService.createBulletinBoard(bulletinBoardRequest);
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Tạo bảng tin thành công")
                .code(HttpStatus.CREATED.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Update bulletin board")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<BulletinBoardResponse> updateBulletinBoard(
            @RequestBody BulletinBoardRequest bulletinBoardRequest, @PathVariable("id") UUID id) {
        BulletinBoardResponse bulletinBoardResponse =
                bulletinBoardService.updateBulletinBoard(id, bulletinBoardRequest);
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Cập nhật bảng tin thành công")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get bulletin board table")
    @GetMapping("/table/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<List<BulletinBoardTableResponse>> getBulletinBoardTable(@PathVariable String username) {
        List<BulletinBoardTableResponse> bulletinBoardResponse = bulletinBoardService.getBulletinBoardTable(username);
        return ApiResponse.<List<BulletinBoardTableResponse>>builder()
                .message("Lấy bảng tin theo bảng thành công")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get inactive bulletin boards")
    @GetMapping("/inactive")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<BulletinBoardResponse>> getInactiveBulletinBoards() {
        List<BulletinBoardResponse> inactiveBulletinBoards = bulletinBoardService.getBulletinBoard();
        return ApiResponse.<List<BulletinBoardResponse>>builder()
                .message("Lấy các bảng tin không hoạt động thành công")
                .code(HttpStatus.OK.value())
                .result(inactiveBulletinBoards)
                .build();
    }

    @Operation(summary = "Approve bulletin board")
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<BulletinBoardResponse> approveBulletinBoard(@PathVariable UUID id) {
        BulletinBoardResponse updatedBoard = bulletinBoardService.approveBulletinBoard(id);
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Duyệt bảng tin thành công")
                .code(HttpStatus.OK.value())
                .result(updatedBoard)
                .build();
    }

    @Operation(summary = "Delete bulletin board")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<Void> deleteBulletinBoard(@PathVariable UUID id) {
        bulletinBoardService.deleteBulletinBoard(id);
        return ApiResponse.<Void>builder()
                .message("Xóa bảng tin thành công")
                .code(HttpStatus.OK.value())
                .build();
    }

    @Operation(summary = "Search bulletin boards using Elasticsearch")
    @GetMapping("/search")
    public ApiResponse<List<BulletinBoardSearchResponse>> searchBulletinBoards(
            @RequestParam("address") String address) {
        List<BulletinBoardSearchResponse> result = bulletinBoardService.searchBulletinBoards(address);

        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .message("Tìm kiếm bảng tin thành công")
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }
}
