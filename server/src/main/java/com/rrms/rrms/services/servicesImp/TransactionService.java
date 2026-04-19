package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Transaction> getTransactionsByUsername(String username) {
        Account account = accountRepository.findById(username).orElse(null);
        if (account != null) {
            return transactionRepository.findByAccount(account);
        }
        return List.of(); // Trả về danh sách rỗng nếu không tìm thấy tài khoản
    }

    public TransactionResponse createTransaction(TransactionRequest transactionDTO, String username) {
        // Tạo đối tượng Transaction từ TransactionRequest
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setPayerName(transactionDTO.getPayerName());
        transaction.setPaymentDescription(transactionDTO.getPaymentDescription());
        transaction.setCategory(transactionDTO.getCategory());
        transaction.setTransactionDate(transactionDTO.getTransactionDate());
        transaction.setTransactionType(transactionDTO.isTransactionType());

        // Lấy Invoice từ invoiceId (nếu request có truyền)
        if (transactionDTO.getInvoiceId() != null) {
            Invoice invoice = invoiceRepository
                    .findById(transactionDTO.getInvoiceId())
                    .orElseThrow(() -> new RuntimeException("Invoice not found"));
            transaction.setInvoice(invoice);
        }

        // Tìm tài khoản dựa trên username
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        // Liên kết giao dịch với tài khoản
        transaction.setAccount(account);

        // Lưu giao dịch vào cơ sở dữ liệu
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Tự động kiểm tra và cập nhật trạng thái hóa đơn
        if (transaction.getInvoice() != null) {
            updateInvoiceStatus(transaction.getInvoice().getInvoiceId());
        }

        // Chuyển đổi sang DTO phản hồi
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
        // Tìm tài khoản dựa trên username
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new RuntimeException("Account not found"));

        // Kiểm tra giao dịch có thuộc về tài khoản không
        Transaction transaction =
                transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getAccount().equals(account)) {
            transactionRepository.deleteById(id);
            return true;
        }
        return false; // Giao dịch không thuộc về tài khoản
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

        // Tính tổng tiền cần thanh toán của hóa đơn
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

        // Tính tổng tiền đã thanh toán (tổng transactions loại thu vào)
        BigDecimal totalPaid = transactionRepository.findByInvoice(invoice).stream()
                .filter(Transaction::isTransactionType)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Cập nhật trạng thái
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
