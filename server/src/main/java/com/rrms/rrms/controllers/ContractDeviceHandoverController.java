package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.models.ContractDeviceHandover;
import com.rrms.rrms.services.IContractDeviceHandoverService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contract-device-handovers")
@RequiredArgsConstructor
public class ContractDeviceHandoverController {

    private final IContractDeviceHandoverService contractDeviceHandoverService;

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<ContractDeviceHandover>> getByContract(@PathVariable UUID contractId) {
        return ResponseEntity.ok(contractDeviceHandoverService.getHandoversByContract(contractId));
    }

    @PostMapping
    public ResponseEntity<ContractDeviceHandover> save(@RequestBody ContractDeviceHandover handover) {
        return ResponseEntity.ok(contractDeviceHandoverService.save(handover));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        contractDeviceHandoverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
