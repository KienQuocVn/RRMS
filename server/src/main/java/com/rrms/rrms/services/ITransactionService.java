package com.rrms.rrms.services;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.rrms.rrms.dto.request.TransactionRequest;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.dto.response.TransactionSummaryResponse;

/**
 * Service interface for Transaction operations.
 * Handles receipts (income) and expenses tracking.
 */
public interface ITransactionService {

    Page<TransactionResponse> getTransactionsByUsername(String username, Pageable pageable);

    TransactionResponse createTransaction(TransactionRequest transactionRequest, String username);

    void deleteTransaction(UUID id, String username);

    TransactionSummaryResponse getSummary(String username);

    BigDecimal getTotalIncome(String username);

    BigDecimal getTotalExpense(String username);

    BigDecimal getProfit(String username);
}
