package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.TransactionRequest;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.enums.PaymentStatus;
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

    public List<Transaction> getTransactionsByUsername(String username) {
        Account account = accountRepository.findById(username).orElse(null);
        if (account != null) {
            return transactionRepository.findByAccount(account);
        }
        return List.of(); // Tráº£ vá» danh sÃ¡ch rá»—ng náº¿u khÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n
    }

    public TransactionResponse createTransaction(TransactionRequest transactionDTO, String username) {
        // Táº¡o Ä‘á»‘i tÆ°á»£ng Transaction tá»« TransactionRequest
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setPayerName(transactionDTO.getPayerName());
        transaction.setPaymentDescription(transactionDTO.getPaymentDescription());
        transaction.setCategory(transactionDTO.getCategory());
        transaction.setTransactionDate(transactionDTO.getTransactionDate());
        transaction.setTransactionType(transactionDTO.isTransactionType());

        // Láº¥y Invoice tá»« invoiceId (náº¿u request cÃ³ truyá»n)
        if (transactionDTO.getInvoiceId() != null) {
            Invoice invoice = invoiceRepository
                    .findById(transactionDTO.getInvoiceId())
                    .orElseThrow(() -> new RuntimeException("Invoice not found"));
            transaction.setInvoice(invoice);
        }

        // TÃ¬m tÃ i khoáº£n dá»±a trÃªn username
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        // LiÃªn káº¿t giao dá»‹ch vá»›i tÃ i khoáº£n
        transaction.setAccount(account);

        // LÆ°u giao dá»‹ch vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Tá»± Ä‘á»™ng kiá»ƒm tra vÃ  cáº­p nháº­t tráº¡ng thÃ¡i hÃ³a Ä‘Æ¡n
        if (transaction.getInvoice() != null) {
            updateInvoiceStatus(transaction.getInvoice().getInvoiceId());
        }

        // Chuyá»ƒn Ä‘á»•i sang DTO pháº£n há»“i
        return new TransactionResponse(
                savedTransaction.getTransactionId(),
                savedTransaction.getAmount(),
                savedTransaction.getPayerName(),
                savedTransaction.getPaymentDescription(),
                savedTransaction.getCategory(),
                savedTransaction.getTransactionDate(),
                savedTransaction.isTransactionType());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public boolean deleteTransaction(UUID id, String username) {
        // TÃ¬m tÃ i khoáº£n dá»±a trÃªn username
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        // Kiá»ƒm tra giao dá»‹ch cÃ³ thuá»™c vá» tÃ i khoáº£n khÃ´ng
        Transaction transaction =
                transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getAccount().equals(account)) {
            transactionRepository.deleteById(id);
            return true;
        }
        return false; // Giao dá»‹ch khÃ´ng thuá»™c vá» tÃ i khoáº£n
    }

    public BigDecimal getTotalIncome(String username) {
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> incomes = transactionRepository.findByTransactionTypeAndAccount(true, account);
        return incomes.stream().map(Transaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalExpense(String username) {
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> expenses = transactionRepository.findByTransactionTypeAndAccount(false, account);
        return expenses.stream().map(Transaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getProfit(String username) {
        return getTotalIncome(username).subtract(getTotalExpense(username));
    }

    private void updateInvoiceStatus(UUID invoiceId) {
        Invoice invoice =
                invoiceRepository.findById(invoiceId).orElseThrow(() -> new RuntimeException("Invoice not found"));

        // TÃ­nh tá»•ng tiá»n cáº§n thanh toÃ¡n cá»§a hÃ³a Ä‘Æ¡n
        double totalServiceAmount = invoice.getDetailInvoices().stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();

        double totalAddition = invoice.getAdditionItems() != null
                ? invoice.getAdditionItems().stream()
                        .mapToDouble(charge -> charge.getIsAddition() ? charge.getAmount() : -charge.getAmount())
                        .sum()
                : 0;

        double totalInvoiceAmount = invoice.getContract().getPrice() + totalServiceAmount + totalAddition;

        // TÃ­nh tá»•ng tiá»n Ä‘Ã£ thanh toÃ¡n (tá»•ng transactions loáº¡i thu vÃ o)
        BigDecimal totalPaid = transactionRepository.findByInvoice(invoice).stream()
                .filter(Transaction::isTransactionType)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Cáº­p nháº­t tráº¡ng thÃ¡i
        if (totalPaid.compareTo(BigDecimal.valueOf(totalInvoiceAmount)) >= 0) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            invoice.setPaymentStatus(PaymentStatus.UNPAID);
        }

        invoiceRepository.save(invoice);
    }
}
