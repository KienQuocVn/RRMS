package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.TemporaryContractRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.TemporaryContractResponse;
import com.rrms.rrms.services.ITemporaryContractService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "TemporaryContract Controller", description = "Controller for Temporary Contracts")
@RestController
@RequestMapping("/temporary-contracts")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class TemporaryContractController {

    ITemporaryContractService trcService;

    @GetMapping
    public ApiResponse<List<TemporaryContractResponse>> getAllTemRC() {
        List<TemporaryContractResponse> allContracts = trcService.findAll();
        return ApiResponse.<List<TemporaryContractResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng tạm thời thành công")
                .result(allContracts)
                .build();
    }

    @GetMapping("/account")
    public ApiResponse<List<TemporaryContractResponse>> getTemRCByAccount(@RequestParam String username) {
        List<TemporaryContractResponse> temRCResponses = trcService.findTRCByAccount_Username(username);
        return ApiResponse.<List<TemporaryContractResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng tạm thời theo tài khoản thành công")
                .result(temRCResponses)
                .build();
    }

    @GetMapping("/motel/{motelId}")
    public ApiResponse<TemporaryContractResponse> getTemRCByMotel(@PathVariable UUID motelId) {
        TemporaryContractResponse temRCResponse = trcService.findByMotelId(motelId);
        return ApiResponse.<TemporaryContractResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy thông tin đại diện theo nhà trọ thành công")
                .result(temRCResponse)
                .build();
    }

    @PostMapping
    public ApiResponse<TemporaryContractResponse> insertTemRC(@RequestBody TemporaryContractRequest contract) {
        TemporaryContractResponse createdContract = trcService.insert(contract);
        return ApiResponse.<TemporaryContractResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Tạo hợp đồng tạm thời thành công")
                .result(createdContract)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<TemporaryContractResponse> updateTemRC(
            @PathVariable UUID id, @RequestBody TemporaryContractRequest contract) {
        TemporaryContractResponse updatedContract = trcService.update(id, contract);
        return ApiResponse.<TemporaryContractResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Cập nhật hợp đồng tạm thời thành công")
                .result(updatedContract)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTemRC(@PathVariable UUID id) {
        trcService.delete(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .message("Xóa hợp đồng tạm thời thành công")
                .build();
    }
}
