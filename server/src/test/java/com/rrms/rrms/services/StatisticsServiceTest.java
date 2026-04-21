// package com.rrms.rrms.services;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// import java.time.*;
// import java.util.*;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.rrms.rrms.models.Account;
// import com.rrms.rrms.models.Motel;
// import com.rrms.rrms.repositories.AccountRepository;
// import com.rrms.rrms.repositories.AuthRepository;
// import com.rrms.rrms.repositories.MotelRepository;
// import com.rrms.rrms.repositories.TenantRepository;
// import com.rrms.rrms.services.servicesImp.StatisticsService;

// @ExtendWith(MockitoExtension.class)
// public class StatisticsServiceTest {

//     @InjectMocks
//     private StatisticsService statisticsService; // Lá»›p dá»‹ch vá»¥ cáº§n kiá»ƒm tra

//     @Mock
//     private AccountRepository accountRepository;

//     @Mock
//     private AuthRepository authRepository;

//     @Mock
//     private TenantRepository tenantRepository;

//     @Mock
//     private MotelRepository motelRepository;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testGetTotalAccounts() {
//         long expectedCount = 100L;
//         when(accountRepository.countNonAdminAccounts()).thenReturn(expectedCount);

//         Long actualCount = statisticsService.getTotalAccounts();

//         assertEquals(
//                 expectedCount, actualCount, "Tá»•ng sá»‘ tÃ i khoáº£n khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//     }

//     @Test
//     public void testGetTotalTenants() {
//         long expectedCount = 50L;
//         when(tenantRepository.count()).thenReturn(expectedCount);

//         Long actualCount = statisticsService.getTotalTenants();

//         assertEquals(
//                 expectedCount, actualCount, "Tá»•ng sá»‘ ngÆ°á»i thuÃª khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong
// Ä‘á»£i.");
//     }

//     @Test
//     public void testGetTotalHostAccounts() {
//         long expectedCount = 20L;
//         when(authRepository.countHostAccounts()).thenReturn(expectedCount);

//         Long actualCount = statisticsService.getTotalHostAccounts();

//         assertEquals(
//                 expectedCount,
//                 actualCount,
//                 "Tá»•ng sá»‘ tÃ i khoáº£n chá»§ nhÃ  khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//     }

//     @Test
//     public void testGetTotalMotels() {
//         long expectedCount = 30L;
//         when(motelRepository.count()).thenReturn(expectedCount);

//         Long actualCount = statisticsService.getTotalMotels();

//         assertEquals(expectedCount, actualCount, "Tá»•ng sá»‘ nhÃ  trá» khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong
// Ä‘á»£i.");
//     }

//     @Test
//     public void testGetAccountsCreatedLastWeek() {
//         // Giáº£ láº­p tÃ i khoáº£n Ä‘Æ°á»£c táº¡o vÃ o cÃ¡c ngÃ y khÃ¡c nhau
//         when(accountRepository.findAccountsCreatedBetween(any(), any()))
//                 .thenReturn(Collections.nCopies(2, new Account()));

//         Map<DayOfWeek, Long> result = statisticsService.getAccountsCreatedLastWeek();

//         for (DayOfWeek day : DayOfWeek.values()) {
//             assertEquals(
//                     2L,
//                     result.get(day),
//                     "Sá»‘ tÃ i khoáº£n Ä‘Æ°á»£c táº¡o khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i cho " + day);
//         }
//     }

//     @Test
//     public void testGetAccountsCreatedThisYear() {
//         Map<Integer, Long> expectedCounts = new HashMap<>();
//         for (int month = 1; month <= 12; month++) {
//             expectedCounts.put(month, 5L); // Giáº£ láº­p 5 tÃ i khoáº£n cho má»—i thÃ¡ng
//             when(accountRepository.countAccountsCreatedByMonth(anyInt(), anyInt()))
//                     .thenReturn(5L);
//         }

//         Map<Integer, Long> actualCounts = statisticsService.getAccountsCreatedThisYear();

//         assertEquals(
//                 expectedCounts,
//                 actualCounts,
//                 "Sá»‘ tÃ i khoáº£n Ä‘Æ°á»£c táº¡o trong nÄƒm khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//     }

//     @Test
//     public void testGetAccountsCreatedLastYear() {
//         Map<Integer, Long> expectedCounts = new HashMap<>();
//         for (int month = 1; month <= 12; month++) {
//             expectedCounts.put(month, 3L); // Giáº£ láº­p 3 tÃ i khoáº£n cho má»—i thÃ¡ng
//             when(accountRepository.countAccountsCreatedByMonth(anyInt(), anyInt()))
//                     .thenReturn(3L);
//         }

//         Map<Integer, Long> actualCounts = statisticsService.getAccountsCreatedLastYear();

//         assertEquals(
//                 expectedCounts,
//                 actualCounts,
//                 "Sá»‘ tÃ i khoáº£n Ä‘Æ°á»£c táº¡o nÄƒm trÆ°á»›c khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//     }

//     @Test
//     public void testGetTotalMotelsByMonth() {
//         List<Motel> motels = new ArrayList<>();

//         for (int i = 1; i <= 12; i++) {
//             Motel motel = mock(Motel.class);
//             // Giáº£ láº­p phÆ°Æ¡ng thá»©c getCreatedDate Ä‘á»ƒ tráº£ vá» LocalDateTime
//             LocalDateTime createdDate = LocalDateTime.of(2023, i, 1, 0, 0);
//             when(motel.getCreatedAt()).thenReturn(createdDate);
//             motels.add(motel);
//         }

//         when(motelRepository.findAll()).thenReturn(motels);

//         Map<Integer, Long> result = statisticsService.getTotalMotelsByMonth();

//         for (int month = 1; month <= 12; month++) {
//             assertEquals(
//                     1L,
//                     result.get(month),
//                     "Tá»•ng sá»‘ nhÃ  trá» cho thÃ¡ng " + month + " khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//         }
//     }

//     @Test
//     public void testGetRecentHosts() {
//         List<Account> recentHosts = Arrays.asList(new Account(), new Account());
//         // Sá»­ dá»¥ng any() Ä‘á»ƒ cho phÃ©p báº¥t ká»³ LocalDateTime nÃ o
//         when(accountRepository.findRecentHosts(any(LocalDateTime.class))).thenReturn(recentHosts);

//         List<Account> result = statisticsService.getRecentHosts();

//         assertEquals(
//                 recentHosts.size(),
//                 result.size(),
//                 "Sá»‘ tÃ i khoáº£n gáº§n Ä‘Ã¢y khÃ´ng khá»›p vá»›i giÃ¡ trá»‹ mong Ä‘á»£i.");
//     }
// }
