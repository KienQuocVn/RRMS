package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.models.ContractOccupant;
import com.rrms.rrms.services.IContractOccupantService;

@RestController
@RequestMapping("/api/contract-occupants")
public class ContractOccupantController {

    @Autowired
    private IContractOccupantService contractOccupantService;

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
