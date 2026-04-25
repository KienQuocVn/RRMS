package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.SupportRequest;
import com.rrms.rrms.dto.response.SupportResponse;

/**
 * Service interface for Support ticket operations.
 * Handles tenant housing support requests.
 */
public interface ISupportService {
    SupportResponse createSupport(SupportRequest supportRequest);

    List<SupportResponse> getAllSupports();

    SupportResponse getSupportById(UUID supportId);

    void deleteSupport(UUID supportId);
}
