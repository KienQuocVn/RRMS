package com.rrms.rrms.services;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import com.rrms.rrms.dto.response.AccountResponse;

/**
 * Service interface for system-wide Statistics.
 * Provides aggregate counts and trends for admin dashboards.
 */
public interface IStatisticsService {
    Long getTotalAccounts();

    Long getTotalTenants();

    Long getTotalHostAccounts();

    Long getTotalMotels();

    Map<DayOfWeek, Long> getAccountsCreatedLastWeek();

    Map<Integer, Long> getAccountsCreatedThisYear();

    Map<Integer, Long> getAccountsCreatedLastYear();

    Map<Integer, Long> getTotalMotelsByMonth();

    List<AccountResponse> getRecentHosts();
}
