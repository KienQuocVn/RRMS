package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.services.IBroker;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/broker")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class BrokerController {

    IBroker brokerService;

    @PostMapping("")
    public ApiResponse<BrokerResponse> createBroker(@RequestBody BrokerCreateRequest brokerRequest) {
        BrokerResponse brokerResponse = brokerService.createBroker(brokerRequest);
        return ApiResponse.<BrokerResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Tạo môi giới thành công")
                .result(brokerResponse)
                .build();
    }

    @GetMapping("{motelId}")
    public ApiResponse<List<BrokerResponse>> getAllBroker(@PathVariable String motelId) {
        List<BrokerResponse> brokerResponse = brokerService.getAllBroker(UUID.fromString(motelId));
        return ApiResponse.<List<BrokerResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy tất cả môi giới thành công")
                .result(brokerResponse)
                .build();
    }

    @PutMapping("{brokerId}")
    public ApiResponse<BrokerResponse> updateBroker(
            @PathVariable UUID brokerId, @RequestBody BrokerCreateRequest brokerRequest) {
        BrokerResponse brokerResponse = brokerService.updateBroker(brokerId, brokerRequest);
        return ApiResponse.<BrokerResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật môi giới thành công")
                .result(brokerResponse)
                .build();
    }

    @DeleteMapping("{brokerId}")
    public ApiResponse<Void> deleteBroker(@PathVariable UUID brokerId) {
        brokerService.deleteBroker(brokerId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Xóa môi giới thành công")
                .build();
    }
}
