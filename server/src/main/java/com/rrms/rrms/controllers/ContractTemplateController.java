package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.ContractTemplateRequest;
import com.rrms.rrms.dto.response.ContractTemplateResponse;
import com.rrms.rrms.services.IContractTemplateService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "ContractTemplate Controller", description = "Controller for ContractTemplate")
@RestController
@RequestMapping("/contract-templates")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class ContractTemplateController {

    private final IContractTemplateService contractTemplateService;

    // Táº¡o má»›i má»™t Contract Template
    @PostMapping
    public ResponseEntity<ContractTemplateResponse> createContractTemplate(
            @RequestBody ContractTemplateRequest request) {
        ContractTemplateResponse response = contractTemplateService.createContractTemplate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Láº¥y thÃ´ng tin cá»§a má»™t Contract Template theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ContractTemplateResponse> getContractTemplateById(@PathVariable UUID id) {
        ContractTemplateResponse response = contractTemplateService.getContractTemplateById(id);
        return response != null
                ? ResponseEntity.ok(response)
                : ResponseEntity.notFound().build();
    }

    // Láº¥y danh sÃ¡ch táº¥t cáº£ Contract Templates
    @GetMapping
    public ResponseEntity<List<ContractTemplateResponse>> getAllContractTemplates() {
        List<ContractTemplateResponse> responses = contractTemplateService.getAllContractTemplates();
        return ResponseEntity.ok(responses);
    }

    // Láº¥y danh sÃ¡ch Contract Templates theo Motel ID
    @GetMapping("/motel/{motelId}")
    public ResponseEntity<List<ContractTemplateResponse>> getContractTemplatesByMotelId(@PathVariable UUID motelId) {
        List<ContractTemplateResponse> responses = contractTemplateService.getContractTemplatesByMotelId(motelId);
        return ResponseEntity.ok(responses);
    }

    // Cáº­p nháº­t thÃ´ng tin cá»§a má»™t Contract Template
    @PutMapping("/{id}")
    public ResponseEntity<ContractTemplateResponse> updateContractTemplate(
            @PathVariable UUID id, @RequestBody ContractTemplateRequest request) {
        ContractTemplateResponse response = contractTemplateService.updateContractTemplate(id, request);
        return response != null
                ? ResponseEntity.ok(response)
                : ResponseEntity.notFound().build();
    }

    // XÃ³a má»™t Contract Template theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContractTemplate(@PathVariable UUID id) {
        contractTemplateService.deleteContractTemplate(id);
        return ResponseEntity.noContent().build();
    }
}
