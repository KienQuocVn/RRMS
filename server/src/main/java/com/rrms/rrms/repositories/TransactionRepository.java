package com.rrms.rrms.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByTransactionType(boolean transactionType);

    List<Transaction> findByAccount(Account account);

    Page<Transaction> findByAccount(Account account, Pageable pageable);

    List<Transaction> findByTransactionTypeAndAccount(boolean transactionType, Account account);

    @Query(
            "SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.transactionType = :transactionType AND t.account = :account")
    BigDecimal sumAmountByTransactionTypeAndAccount(
            @Param("transactionType") boolean transactionType, @Param("account") Account account);

    List<Transaction> findByInvoice(Invoice invoice);
}
