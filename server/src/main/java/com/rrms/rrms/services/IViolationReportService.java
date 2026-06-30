package com.rrms.rrms.services;

import java.util.List;

import com.rrms.rrms.dto.request.ResolveViolationReportRequest;
import com.rrms.rrms.dto.response.ViolationReportCaseResponse;
import com.rrms.rrms.dto.response.ViolationReportStatsResponse;

public interface IViolationReportService {
    List<ViolationReportCaseResponse> getAggregatedCases();

    ViolationReportStatsResponse getStats();

    ViolationReportCaseResponse resolveCase(String caseKey, ResolveViolationReportRequest request);
}
