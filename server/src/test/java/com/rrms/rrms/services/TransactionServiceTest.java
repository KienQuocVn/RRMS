// package com.rrms.rrms.services;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.mockito.Mockito.when;

// import java.math.BigDecimal;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.rrms.rrms.dto.response.TransactionSummaryResponse;
// import com.rrms.rrms.enums.ErrorCode;
// import com.rrms.rrms.exceptions.AppException;
// import com.rrms.rrms.models.Account;
// import com.rrms.rrms.models.Transaction;
// import com.rrms.rrms.repositories.AccountRepository;
// import com.rrms.rrms.repositories.InvoiceRepository;
// import com.rrms.rrms.repositories.TransactionRepository;
// import com.rrms.rrms.services.servicesImp.TransactionService;

// @ExtendWith(MockitoExtension.class)
// class TransactionServiceTest {

//     @Mock
//     private TransactionRepository transactionRepository;

//     @Mock
//     private InvoiceRepository invoiceRepository;

//     @Mock
//     private AccountRepository accountRepository;

//     @InjectMocks
//     private TransactionService transactionService;

//     @Test
//     void getSummary_usesAggregateQueries() {
//         Account account = new Account();
//         account.setUsername("host-a");

//         when(accountRepository.findById("host-a")).thenReturn(Optional.of(account));
//         when(transactionRepository.sumAmountByTransactionTypeAndAccount(true, account))
//                 .thenReturn(new BigDecimal("1500"));
//         when(transactionRepository.sumAmountByTransactionTypeAndAccount(false, account))
//                 .thenReturn(new BigDecimal("500"));

//         TransactionSummaryResponse summary = transactionService.getSummary("host-a");

//         assertEquals(new BigDecimal("1500"), summary.getTotalIncome());
//         assertEquals(new BigDecimal("500"), summary.getTotalExpense());
//         assertEquals(new BigDecimal("1000"), summary.getProfit());
//     }

//     @Test
//     void deleteTransaction_throwsWhenOwnedByAnotherAccount() {
//         Account owner = new Account();
//         owner.setUsername("owner");
//         Account anotherUser = new Account();
//         anotherUser.setUsername("another");

//         Transaction transaction = new Transaction();
//         transaction.setTransactionId(UUID.randomUUID());
//         transaction.setAccount(owner);

//         when(accountRepository.findById("another")).thenReturn(Optional.of(anotherUser));
//         when(transactionRepository.findById(transaction.getTransactionId())).thenReturn(Optional.of(transaction));

//         AppException exception = assertThrows(
//                 AppException.class,
//                 () -> transactionService.deleteTransaction(transaction.getTransactionId(), "another"));

//         assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());
//     }
// }
