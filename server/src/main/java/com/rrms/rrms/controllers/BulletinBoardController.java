package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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
        log.info("Get all bulletin board successfully");
        return ApiResponse.<List<BulletinBoardResponse>>builder()
                .message("Get all bulletin board successfully")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get bulletin board by id")
    @GetMapping("/{id}")
    public ApiResponse<BulletinBoardResponse> getBulletinBoardById(@PathVariable UUID id) {
        BulletinBoardResponse bulletinBoardResponse = bulletinBoardService.getBulletinBoardById(id);
        log.info("Get bulletin board by id successfully");
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Get bulletin board by id successfully")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Create bulletin board")
    @PostMapping("")
    public ApiResponse<BulletinBoardResponse> createBulletinBoard(
            @RequestBody BulletinBoardRequest bulletinBoardRequest) {
        BulletinBoardResponse bulletinBoardResponse = bulletinBoardService.createBulletinBoard(bulletinBoardRequest);
        log.info("Create bulletin board successfully");
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Create bulletin board successfully")
                .code(HttpStatus.CREATED.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Update bulletin board")
    @PutMapping("/{id}")
    public ApiResponse<BulletinBoardResponse> updateBulletinBoard(
            @RequestBody BulletinBoardRequest bulletinBoardRequest, @PathVariable("id") UUID id) {
        log.info("Update bulletin board with id: {}", id);
        BulletinBoardResponse bulletinBoardResponse =
                bulletinBoardService.updateBulletinBoard(id, bulletinBoardRequest);
        log.info("Update bulletin board successfully");
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Update bulletin board successfully")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get bulletin board table")
    @GetMapping("/table/{username}")
    public ApiResponse<List<BulletinBoardTableResponse>> getBulletinBoardTable(@PathVariable String username) {
        List<BulletinBoardTableResponse> bulletinBoardResponse = bulletinBoardService.getBulletinBoardTable(username);
        log.info("Get bulletin board table successfully");
        return ApiResponse.<List<BulletinBoardTableResponse>>builder()
                .message("Get bulletin board table successfully")
                .code(HttpStatus.OK.value())
                .result(bulletinBoardResponse)
                .build();
    }

    @Operation(summary = "Get inactive bulletin boards")
    @GetMapping("/inactive")
    public ApiResponse<List<BulletinBoardResponse>> getInactiveBulletinBoards() {
        List<BulletinBoardResponse> inactiveBulletinBoards = bulletinBoardService.getBulletinBoard();
        log.info("Get inactive bulletin boards successfully");
        return ApiResponse.<List<BulletinBoardResponse>>builder()
                .message("Get inactive bulletin boards successfully")
                .code(HttpStatus.OK.value())
                .result(inactiveBulletinBoards)
                .build();
    }

    @Operation(summary = "Approve bulletin board")
    @PutMapping("/{id}/approve")
    public ApiResponse<BulletinBoardResponse> approveBulletinBoard(@PathVariable UUID id) {
        BulletinBoardResponse updatedBoard = bulletinBoardService.approveBulletinBoard(id);
        log.info("Approve bulletin board successfully with id: {}", id);
        return ApiResponse.<BulletinBoardResponse>builder()
                .message("Approve bulletin board successfully")
                .code(HttpStatus.OK.value())
                .result(updatedBoard)
                .build();
    }

    @Operation(summary = "Delete bulletin board")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBulletinBoard(@PathVariable UUID id) {
        bulletinBoardService.deleteBulletinBoard(id);
        log.info("Delete bulletin board with id: {}", id);
        return ApiResponse.<Void>builder()
                .message("Delete bulletin board successfully")
                .code(HttpStatus.OK.value())
                .build();
    }

    @Operation(summary = "Search bulletin boards using Elasticsearch")
    @GetMapping("/search")
    public ApiResponse<List<BulletinBoardSearchResponse>> searchBulletinBoards(
            @RequestParam("address") String address) {
        log.info("Searching bulletin boards with address: {}", address);
        List<BulletinBoardSearchResponse> result = bulletinBoardService.searchBulletinBoards(address);

        log.info("Search bulletin board successfully, found: {}", result.size());
        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .message("Search bulletin board successfully")
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }
}
