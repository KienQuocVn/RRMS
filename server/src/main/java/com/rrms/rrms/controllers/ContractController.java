package com.rrms.rrms.controllers;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.ContractRequest;
import com.rrms.rrms.dto.response.ContractResponse;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.services.IContractService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Contract Controller", description = "Controller for Contract")
@RestController
@Slf4j
@RequestMapping("/contracts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class ContractController {

    private final IContractService contractService;

    // Táº¡o má»›i há»£p Ä‘á»“ng
    @PostMapping
    public ResponseEntity<ContractResponse> createContract(@RequestBody ContractRequest request) {
        ContractResponse response = contractService.createContract(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Láº¥y há»£p Ä‘á»“ng theo ID
    @GetMapping("/{contractId}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable UUID contractId) {
        ContractResponse response = contractService.getContractById(contractId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Cáº­p nháº­t há»£p Ä‘á»“ng
    @PutMapping("/{contractId}")
    public ResponseEntity<ContractResponse> updateContract(
            @PathVariable UUID contractId, @RequestBody ContractRequest request) {
        ContractResponse response = contractService.updateContract(contractId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // XÃ³a há»£p Ä‘á»“ng
    @DeleteMapping("/{contractId}")
    public ResponseEntity<Void> deleteContract(@PathVariable UUID contractId) {
        contractService.deleteContract(contractId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // XÃ³a há»£p Ä‘á»“ng theo room Id
    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<Void> deleteContractByRoomId(@PathVariable UUID roomId) {
        contractService.deleteContractByRoomId(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/motel/{motelId}")
    public ResponseEntity<List<ContractResponse>> getAllContractsByMotelId(@PathVariable UUID motelId) {
        List<ContractResponse> responses = contractService.getAllContractsByMotelId(motelId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    // Láº¥y há»£p Ä‘á»“ng theo ID
    @GetMapping("room/{roomId}")
    public ResponseEntity<ContractResponse> getContractByRoomId(@PathVariable UUID roomId) {
        ContractResponse response = contractService.getAllContractsByRoomId(roomId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update-status")
    public ResponseEntity<String> updateContractStatus(
            @RequestParam UUID roomId,
            @RequestParam ContractStatus newStatus,
            @RequestParam(name = "reportCloseDate", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy")
                    Date reportCloseDate) {

        // Thá»±c hiá»‡n cáº­p nháº­t tráº¡ng thÃ¡i há»£p Ä‘á»“ng
        int updatedRows = contractService.updateContractStatus(roomId, newStatus, reportCloseDate);

        if (updatedRows > 0) {
            return ResponseEntity.ok("Contract status updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("No contracts found for the given roomId.");
        }
    }

    @PutMapping("/update-contract")
    public ResponseEntity<String> updateContractDetailChangeRoom(
            @RequestParam UUID ContractId,
            @RequestParam UUID roomId,
            @RequestParam Double deposit,
            @RequestParam Double price,
            @RequestParam Double debt) {

        // Thá»±c hiá»‡n cáº­p nháº­t tráº¡ng thÃ¡i há»£p Ä‘á»“ng
        contractService.updateContractDetailsByContractId(ContractId, roomId, deposit, price, debt);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update-status-by-days-difference")
    public String updateContractsByDaysDifference(
            @RequestParam ContractStatus newStatus, @RequestParam int thresholdDays) {
        try {
            contractService.updateContractsBasedOnDaysDifference(newStatus, thresholdDays);
            return "Contracts updated successfully.";
        } catch (Exception e) {
            return "Failed to update contracts: " + e.getMessage();
        }
    }

    @PutMapping("/update-status-by-days-difference2")
    public String updateContractsByDaysDifference2(
            @RequestParam ContractStatus newStatus, @RequestParam int thresholdDays) {
        try {
            contractService.updateContractsBasedOnDaysDifference2(newStatus, thresholdDays);
            return "Contracts updated successfully.";
        } catch (Exception e) {
            return "Failed to update contracts: " + e.getMessage();
        }
    }

    @PutMapping("/update-close-contract")
    public ResponseEntity<String> updateCloseContract(
            @RequestParam UUID contractId,
            @RequestParam(name = "newCloseContract", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy")
                    Date newCloseContract) {
        if (newCloseContract == null) {
            return ResponseEntity.badRequest()
                    .body("NgÃ y káº¿t thÃºc há»£p Ä‘á»“ng khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng Ä‘Æ°á»£c cung cáº¥p!");
        }

        try {
            contractService.updateCloseContract(contractId, newCloseContract);
            return ResponseEntity.ok("Cáº­p nháº­t ngÃ y káº¿t thÃºc há»£p Ä‘á»“ng thÃ nh cÃ´ng!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
