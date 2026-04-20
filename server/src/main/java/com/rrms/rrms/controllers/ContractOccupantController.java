package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.models.ContractOccupant;
import com.rrms.rrms.services.IContractOccupantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contract-occupants")
@RequiredArgsConstructor
public class ContractOccupantController {

    private final IContractOccupantService contractOccupantService;

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<ContractOccupant>> getByContract(@PathVariable UUID contractId) {
        return ResponseEntity.ok(contractOccupantService.getOccupantsByContract(contractId));
    }

    @PostMapping
    public ResponseEntity<ContractOccupant> save(@RequestBody ContractOccupant occupant) {
        return ResponseEntity.ok(contractOccupantService.save(occupant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        contractOccupantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
