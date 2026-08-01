package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.ResidenceTemplateRequest;
import com.rrms.rrms.dto.response.ResidenceTemplateResponse;

public interface IResidenceTemplateService {

    ResidenceTemplateResponse createResidenceTemplate(ResidenceTemplateRequest request);

    ResidenceTemplateResponse getResidenceTemplateById(UUID residenceTemplateId);

    List<ResidenceTemplateResponse> getAllResidenceTemplates();

    List<ResidenceTemplateResponse> getResidenceTemplatesByMotelId(UUID motelId);

    ResidenceTemplateResponse updateResidenceTemplate(UUID residenceTemplateId, ResidenceTemplateRequest request);

    void deleteResidenceTemplate(UUID residenceTemplateId);
}
