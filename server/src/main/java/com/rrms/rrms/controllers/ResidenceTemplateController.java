package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.ResidenceTemplateRequest;
import com.rrms.rrms.dto.response.ResidenceTemplateResponse;
import com.rrms.rrms.services.IResidenceTemplateService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "ResidenceTemplate Controller", description = "Controller for ResidenceTemplate (Tờ khai tạm trú)")
@RestController
@RequestMapping("/residence-templates")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class ResidenceTemplateController {

    private final IResidenceTemplateService residenceTemplateService;

    // Tạo mới mẫu tờ khai tạm trú
    @PostMapping
    public ResponseEntity<ResidenceTemplateResponse> createResidenceTemplate(
            @RequestBody ResidenceTemplateRequest request) {
        ResidenceTemplateResponse response = residenceTemplateService.createResidenceTemplate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Lấy mẫu tờ khai theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ResidenceTemplateResponse> getResidenceTemplateById(@PathVariable UUID id) {
        ResidenceTemplateResponse response = residenceTemplateService.getResidenceTemplateById(id);
        return response != null
                ? ResponseEntity.ok(response)
                : ResponseEntity.notFound().build();
    }

    // Lấy tất cả mẫu tờ khai
    @GetMapping
    public ResponseEntity<List<ResidenceTemplateResponse>> getAllResidenceTemplates() {
        List<ResidenceTemplateResponse> responses = residenceTemplateService.getAllResidenceTemplates();
        return ResponseEntity.ok(responses);
    }

    // Lấy danh sách mẫu tờ khai theo Motel ID
    @GetMapping("/motel/{motelId}")
    public ResponseEntity<List<ResidenceTemplateResponse>> getResidenceTemplatesByMotelId(@PathVariable UUID motelId) {
        List<ResidenceTemplateResponse> responses = residenceTemplateService.getResidenceTemplatesByMotelId(motelId);
        return ResponseEntity.ok(responses);
    }

    // Cập nhật mẫu tờ khai
    @PutMapping("/{id}")
    public ResponseEntity<ResidenceTemplateResponse> updateResidenceTemplate(
            @PathVariable UUID id, @RequestBody ResidenceTemplateRequest request) {
        ResidenceTemplateResponse response = residenceTemplateService.updateResidenceTemplate(id, request);
        return response != null
                ? ResponseEntity.ok(response)
                : ResponseEntity.notFound().build();
    }

    // Xóa mẫu tờ khai
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResidenceTemplate(@PathVariable UUID id) {
        residenceTemplateService.deleteResidenceTemplate(id);
        return ResponseEntity.noContent().build();
    }
}
