package com.rrms.rrms.controllers;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.TransactionRequest;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.models.Transaction;
import com.rrms.rrms.services.servicesImp.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/{username}")
    public ResponseEntity<List<Transaction>> getTransactionsByUsername(@PathVariable String username) {
        List<Transaction> transactions = transactionService.getTransactionsByUsername(username);
        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build(); // Tráº£ vá» 204 náº¿u khÃ´ng cÃ³ giao dá»‹ch
        }
        return ResponseEntity.ok(transactions); // Tráº£ vá» 200 vá»›i danh sÃ¡ch giao dá»‹ch
    }

    @PostMapping("/receipts")
    public ResponseEntity<TransactionResponse> createReceipt(
            @RequestBody TransactionRequest transactionDTO, @RequestParam String username) {
        transactionDTO.setTransactionType(true); // Äáº·t loáº¡i giao dá»‹ch lÃ  phiáº¿u thu
        TransactionResponse newTransaction = transactionService.createTransaction(transactionDTO, username);
        return ResponseEntity.ok(newTransaction);
    }

    @PostMapping("/expenses")
    public ResponseEntity<TransactionResponse> createExpense(
            @RequestBody TransactionRequest transactionDTO, @RequestParam String username) {
        transactionDTO.setTransactionType(false); // Äáº·t loáº¡i giao dá»‹ch lÃ  phiáº¿u chi
        TransactionResponse newTransaction = transactionService.createTransaction(transactionDTO, username);
        return ResponseEntity.ok(newTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID id, @RequestParam String username) {
        boolean isDeleted = transactionService.deleteTransaction(id, username);
        if (isDeleted) {
            return ResponseEntity.ok("XÃ³a thÃ nh cÃ´ng");
        } else {
            return ResponseEntity.status(404)
                    .body("Giao dá»‹ch khÃ´ng tá»“n táº¡i hoáº·c khÃ´ng thuá»™c tÃ i khoáº£n nÃ y");
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getSummary(@RequestParam String username) {
        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalIncome", transactionService.getTotalIncome(username));
        summary.put("totalExpense", transactionService.getTotalExpense(username));
        summary.put("profit", transactionService.getProfit(username));
        return ResponseEntity.ok(summary);
    }
}
