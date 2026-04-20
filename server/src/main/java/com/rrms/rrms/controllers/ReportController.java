package com.rrms.rrms.controllers;

import java.math.BigDecimal;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.response.MotelRoomCountResponse;
import com.rrms.rrms.dto.response.TenantSummaryDTO;
import com.rrms.rrms.services.IMotelService;
import com.rrms.rrms.services.ITenantService;
import com.rrms.rrms.services.servicesImp.ContractService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {
    private final IMotelService motelService;

    private final ContractService contractService;

    private final ITenantService tenantService;

    @GetMapping("/total-rooms")
    public ResponseEntity<?> getTotalRooms(@RequestParam UUID motelId, @RequestParam String username) {
        var totalRooms = motelService.getTotalRooms(motelId, username);

        if (totalRooms.isPresent()) {
            return ResponseEntity.ok(totalRooms.get());
        } else {
            return ResponseEntity.status(404).body("KhÃ´ng tÃ¬m tháº¥y nhÃ  trá»");
        }
    }

    @GetMapping("/room-counts")
    public List<MotelRoomCountResponse> getRoomCountsByContractStatus() {
        return motelService.getRoomCountsByContractStatus();
    }

    // Láº¥y tá»•ng sá»‘ ngÆ°á»i thuÃª theo nhÃ  trá»
    @GetMapping("/{motelId}/tenants/count")
    public ResponseEntity<Integer> getTotalTenants(@PathVariable UUID motelId) {
        Integer totalTenants = contractService.getTotalTenantsByMotelId(motelId);
        return ResponseEntity.ok(totalTenants);
    }

    // TÃ³m táº¯t thÃ´ng tin ngÆ°á»i thuÃª
    @GetMapping("/tenant/summary")
    public List<TenantSummaryDTO> getTenantSummary() {
        return tenantService.getTenantSummary();
    }

    // Tá»•ng tiá»n cá»c
    @GetMapping("/{motelId}/deposits")
    public ResponseEntity<Double> getTotalDeposit(@PathVariable UUID motelId) {
        Double totalDeposit = motelService.calculateTotalDeposit(motelId);
        return ResponseEntity.ok(totalDeposit);
    }

    // Tá»•ng tiá»n giá»¯ chÃ¢n
    @GetMapping("/{motelId}/reserve-deposits")
    public ResponseEntity<Double> getTotalReserveDeposit(@PathVariable UUID motelId) {
        Double totalReserveDeposit = motelService.calculateTotalReserveDeposit(motelId);
        return ResponseEntity.ok(totalReserveDeposit);
    }
    // tá»•ng tiá»n hÃ³a Ä‘Æ¡n Ä‘Ã£ thanh toÃ¡n
    @GetMapping("/{motelId}/total-paid-invoices")
    public ResponseEntity<BigDecimal> getTotalPaidInvoices(@PathVariable UUID motelId) {
        BigDecimal totalPaidInvoices = motelService.getTotalPaidInvoices(motelId);
        return ResponseEntity.ok(totalPaidInvoices);
    }
    // tá»•ng tiá»n phÃ²ng Ä‘Ã£ thanh toÃ¡n
    @GetMapping("/{motelId}/total-paid-room-price")
    public ResponseEntity<BigDecimal> getTotalPaidRoomPrice(@PathVariable UUID motelId) {
        BigDecimal totalPaidRoomPrice = motelService.getTotalPaidRoomPrice(motelId);
        return ResponseEntity.ok(totalPaidRoomPrice);
    }
}
