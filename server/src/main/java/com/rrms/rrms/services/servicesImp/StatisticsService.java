package com.rrms.rrms.services.servicesImp;

import java.time.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.IStatistics;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService implements IStatistics {
    private final AccountRepository accountRepository;

    private final AuthRepository authRepository;

    private final TenantRepository tenantRepository;

    private final MotelRepository motelRepository;

    @Override
    public Long getTotalAccounts() {
        return accountRepository.countNonAdminAccounts();
    }

    @Override
    public Long getTotalTenants() {
        return tenantRepository.count();
    }

    @Override
    public Long getTotalHostAccounts() {
        return authRepository.countHostAccounts();
    }

    @Override
    public Long getTotalMotels() {
        return motelRepository.count();
    }

    @Override
    public Map<DayOfWeek, Long> getAccountsCreatedLastWeek() {
        Map<DayOfWeek, Long> counts = new HashMap<>();
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusWeeks(1).with(DayOfWeek.MONDAY);
        for (DayOfWeek day : DayOfWeek.values()) {
            LocalDate startDate = startOfWeek.with(day);
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = startDateTime.plusDays(1);
            List<Account> accounts = accountRepository.findAccountsCreatedBetween(startDateTime, endDateTime);
            counts.put(day, (long) accounts.size());
        }

        return counts;
    }

    @Override
    public Map<Integer, Long> getAccountsCreatedThisYear() {
        int currentYear = Year.now().getValue();
        return getAccountsCreatedByMonth(currentYear);
    }

    @Override
    public Map<Integer, Long> getAccountsCreatedLastYear() {
        int lastYear = Year.now().getValue() - 1;
        return getAccountsCreatedByMonth(lastYear);
    }

    private Map<Integer, Long> getAccountsCreatedByMonth(int year) {
        Map<Integer, Long> monthlyCounts = new HashMap<>();

        for (int month = 1; month <= 12; month++) {
            long count = accountRepository.countAccountsCreatedByMonth(year, month);
            monthlyCounts.put(month, count);
        }

        return monthlyCounts;
    }

    @Override
    public Map<Integer, Long> getTotalMotelsByMonth() {
        List<Motel> motels = motelRepository.findAll();

        // Khá»Ÿi táº¡o Map Ä‘á»ƒ chá»©a tá»•ng sá»‘ nhÃ  trá» cho tá»«ng thÃ¡ng
        Map<Integer, Long> totalsByMonth = new HashMap<>();

        // Äáº·t giÃ¡ trá»‹ máº·c Ä‘á»‹nh cho tá»«ng thÃ¡ng lÃ  0
        for (int i = 1; i <= 12; i++) {
            totalsByMonth.put(i, 0L);
        }

        // TÃ­nh tá»•ng sá»‘ nhÃ  trá» cho tá»«ng thÃ¡ng
        for (Motel motel : motels) {
            int month = motel.getCreatedAt().getMonthValue();
            totalsByMonth.put(month, totalsByMonth.get(month) + 1);
        }

        return totalsByMonth;
    }

    @Override
    public List<Account> getRecentHosts() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return accountRepository.findRecentHosts(sevenDaysAgo);
    }
}
