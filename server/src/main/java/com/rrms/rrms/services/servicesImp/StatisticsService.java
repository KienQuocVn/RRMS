package com.rrms.rrms.services.servicesImp;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.TenantRepository;
import com.rrms.rrms.services.IStatistics;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService implements IStatistics {
    private final AccountRepository accountRepository;
    private final AuthRepository authRepository;
    private final TenantRepository tenantRepository;
    private final MotelRepository motelRepository;
    private final AccountMapper accountMapper;

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
            counts.put(day, (long) accountRepository
                    .findAccountsCreatedBetween(startDateTime, endDateTime)
                    .size());
        }

        return counts;
    }

    @Override
    public Map<Integer, Long> getAccountsCreatedThisYear() {
        return getAccountsCreatedByMonth(Year.now().getValue());
    }

    @Override
    public Map<Integer, Long> getAccountsCreatedLastYear() {
        return getAccountsCreatedByMonth(Year.now().getValue() - 1);
    }

    private Map<Integer, Long> getAccountsCreatedByMonth(int year) {
        Map<Integer, Long> monthlyCounts = new HashMap<>();

        for (int month = 1; month <= 12; month++) {
            monthlyCounts.put(month, accountRepository.countAccountsCreatedByMonth(year, month));
        }

        return monthlyCounts;
    }

    @Override
    public Map<Integer, Long> getTotalMotelsByMonth() {
        List<Motel> motels = motelRepository.findAll();
        Map<Integer, Long> totalsByMonth = new HashMap<>();

        for (int i = 1; i <= 12; i++) {
            totalsByMonth.put(i, 0L);
        }

        for (Motel motel : motels) {
            int month = motel.getCreatedAt().getMonthValue();
            totalsByMonth.put(month, totalsByMonth.get(month) + 1);
        }

        return totalsByMonth;
    }

    @Override
    public List<AccountResponse> getRecentHosts() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return accountRepository.findRecentHosts(sevenDaysAgo).stream()
                .map(accountMapper::toAccountResponse)
                .toList();
    }
}
