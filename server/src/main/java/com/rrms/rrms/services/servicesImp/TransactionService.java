package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.TransactionRequest;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.dto.response.TransactionSummaryResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.PaymentStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.models.Transaction;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.InvoiceRepository;
import com.rrms.rrms.repositories.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsByUsername(String username, Pageable pageable) {
        Account account = getAccount(username);
        return transactionRepository.findByAccount(account, pageable).map(this::mapTransaction);
    }

    public TransactionResponse createTransaction(TransactionRequest transactionRequest, String username) {
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionRequest.getAmount());
        transaction.setPayerName(transactionRequest.getPayerName());
        transaction.setPaymentDescription(
                transactionRequest.getPaymentDescription() == null
                        ? "Manual transaction"
                        : transactionRequest.getPaymentDescription());
        transaction.setCategory(
                transactionRequest.getCategory() == null ? "GENERAL" : transactionRequest.getCategory());
        transaction.setTransactionDate(
                transactionRequest.getTransactionDate() == null
                        ? java.time.LocalDate.now()
                        : transactionRequest.getTransactionDate());
        transaction.setTransactionType(transactionRequest.isTransactionType());
        transaction.setAccount(getAccount(username));

        if (transactionRequest.getInvoiceId() != null) {
            Invoice invoice = invoiceRepository
                    .findDetailedByInvoiceId(transactionRequest.getInvoiceId())
                    .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
            transaction.setInvoice(invoice);
        }

        Transaction savedTransaction = transactionRepository.save(transaction);

        if (savedTransaction.getInvoice() != null) {
            updateInvoiceStatus(savedTransaction.getInvoice().getInvoiceId());
        }

        return mapTransaction(savedTransaction);
    }

    public void deleteTransaction(UUID id, String username) {
        Account account = getAccount(username);
        Transaction transaction =
                transactionRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (!transaction.getAccount().equals(account)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        transactionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public TransactionSummaryResponse getSummary(String username) {
        Account account = getAccount(username);
        BigDecimal totalIncome = transactionRepository.sumAmountByTransactionTypeAndAccount(true, account);
        BigDecimal totalExpense = transactionRepository.sumAmountByTransactionTypeAndAccount(false, account);

        return TransactionSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .profit(totalIncome.subtract(totalExpense))
                .build();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalIncome(String username) {
        return getSummary(username).getTotalIncome();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalExpense(String username) {
        return getSummary(username).getTotalExpense();
    }

    @Transactional(readOnly = true)
    public BigDecimal getProfit(String username) {
        return getSummary(username).getProfit();
    }

    private void updateInvoiceStatus(UUID invoiceId) {
        Invoice invoice = invoiceRepository
                .findDetailedByInvoiceId(invoiceId)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        double totalServiceAmount = invoice.getDetailInvoices().stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();

        double totalAddition = invoice.getAdditionItems() == null
                ? 0
                : invoice.getAdditionItems().stream()
                        .mapToDouble(charge -> charge.getIsAddition() ? charge.getAmount() : -charge.getAmount())
                        .sum();

        double totalInvoiceAmount = invoice.getContract().getPrice() + totalServiceAmount + totalAddition;

        BigDecimal totalPaid = transactionRepository.findByInvoice(invoice).stream()
                .filter(Transaction::isTransactionType)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalPaid.compareTo(BigDecimal.valueOf(totalInvoiceAmount)) >= 0) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            invoice.setPaymentStatus(PaymentStatus.UNPAID);
        }

        invoiceRepository.save(invoice);
    }

    private Account getAccount(String username) {
        return accountRepository.findById(username).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    private TransactionResponse mapTransaction(Transaction transaction) {
        return new TransactionResponse(
                transaction.getTransactionId(),
                transaction.getAmount(),
                transaction.getPayerName(),
                transaction.getPaymentDescription(),
                transaction.getCategory(),
                transaction.getTransactionDate(),
                transaction.isTransactionType());
    }
}
