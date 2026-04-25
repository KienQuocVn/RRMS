package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.TemporaryContractRequest;
import com.rrms.rrms.dto.response.TemporaryContractResponse;

public interface ITemporaryContractService {

    TemporaryContractResponse insert(TemporaryContractRequest temporaryContractRequest);

    List<TemporaryContractResponse> findById(UUID id);

    List<TemporaryContractResponse> findTRCByAccount_Username(String username);

    List<TemporaryContractResponse> findAll();

    TemporaryContractResponse update(UUID id, TemporaryContractRequest temporaryContractRequest);

    void delete(UUID id);
}
