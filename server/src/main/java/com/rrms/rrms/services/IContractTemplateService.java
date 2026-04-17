package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.ContractTemplateRequest;
import com.rrms.rrms.dto.response.ContractTemplateResponse;

public interface IContractTemplateService {
    ContractTemplateResponse createContractTemplate(ContractTemplateRequest request);

    ContractTemplateResponse getContractTemplateById(UUID contractTemplateId);

    List<ContractTemplateResponse> getAllContractTemplates();

    List<ContractTemplateResponse> getContractTemplatesByMotelId(UUID motelid);

    ContractTemplateResponse updateContractTemplate(UUID contractTemplateId, ContractTemplateRequest request);

    void deleteContractTemplate(UUID contractTemplateId);
}
