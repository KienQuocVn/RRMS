package com.rrms.rrms.controllers;

import java.util.UUID;

import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.TransactionRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.PageResponse;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.dto.response.TransactionSummaryResponse;
import com.rrms.rrms.services.ITransactionService;
import com.rrms.rrms.utils.PageableUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Transaction Controller", description = "Income/expense transaction management")
@RestController
@RequestMapping({"/transactions", "/api/v1/transactions"})
@RequiredArgsConstructor
public class TransactionController {

    private final ITransactionService transactionService;

    @Operation(summary = "Get transactions by username with pagination")
    @GetMapping("/{username}")
    public ApiResponse<PageResponse<TransactionResponse>> getTransactionsByUsername(
            @PathVariable String username,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        return ApiResponse.<PageResponse<TransactionResponse>>builder()
                .message("Transactions retrieved successfully")
                .result(PageResponse.from(transactionService.getTransactionsByUsername(
                        username,
                        PageableUtils.of(page, size, sortBy == null ? "transactionDate" : sortBy, sortDirection))))
                .build();
    }

    @Operation(summary = "Create a receipt (income transaction)")
    @PostMapping("/receipts")
    public ApiResponse<TransactionResponse> createReceipt(
            @RequestBody TransactionRequest transactionRequest, @RequestParam String username) {
        transactionRequest.setTransactionType(true);
        return ApiResponse.<TransactionResponse>builder()
                .message("Receipt created successfully")
                .result(transactionService.createTransaction(transactionRequest, username))
                .build();
    }

    @Operation(summary = "Create an expense transaction")
    @PostMapping("/expenses")
    public ApiResponse<TransactionResponse> createExpense(
            @RequestBody TransactionRequest transactionRequest, @RequestParam String username) {
        transactionRequest.setTransactionType(false);
        return ApiResponse.<TransactionResponse>builder()
                .message("Expense created successfully")
                .result(transactionService.createTransaction(transactionRequest, username))
                .build();
    }

    @Operation(summary = "Delete a transaction by ID")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTransaction(@PathVariable UUID id, @RequestParam String username) {
        transactionService.deleteTransaction(id, username);
        return ApiResponse.<Void>builder()
                .message("Transaction deleted successfully")
                .build();
    }

    @Operation(summary = "Get transaction summary (income, expense, profit)")
    @GetMapping("/summary")
    public ApiResponse<TransactionSummaryResponse> getSummary(@RequestParam String username) {
        return ApiResponse.<TransactionSummaryResponse>builder()
                .message("Transaction summary retrieved successfully")
                .result(transactionService.getSummary(username))
                .build();
    }
}
