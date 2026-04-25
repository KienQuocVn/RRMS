package com.rrms.rrms.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rrms.rrms.dto.request.RoomReviewRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.RoomReviewResponse;
import com.rrms.rrms.services.IRoomReview;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Room Review Controller")
@RestController
@Slf4j
@RequestMapping("/room-reviews")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoomReviewController {
    IRoomReview roomReviewService;

    @Operation(summary = "Create room review")
    @PostMapping
    public ApiResponse<RoomReviewResponse> createRoomReview(@RequestBody RoomReviewRequest roomReviewRequest) {
        RoomReviewResponse response = roomReviewService.createRoomReview(roomReviewRequest);
        return ApiResponse.<RoomReviewResponse>builder()
                .message("Tạo đánh giá phòng thành công")
                .code(HttpStatus.CREATED.value())
                .result(response)
                .build();
    }
}
