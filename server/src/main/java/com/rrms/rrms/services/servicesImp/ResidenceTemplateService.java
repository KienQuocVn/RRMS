package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.ResidenceTemplateRequest;
import com.rrms.rrms.dto.response.ResidenceTemplateResponse;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.ResidenceTemplate;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.ResidenceTemplateRepository;
import com.rrms.rrms.services.IResidenceTemplateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResidenceTemplateService implements IResidenceTemplateService {

    private final ResidenceTemplateRepository residenceTemplateRepository;

    private final MotelRepository motelRepository;

    @Override
    public ResidenceTemplateResponse createResidenceTemplate(ResidenceTemplateRequest request) {
        Motel motel = motelRepository.findById(request.getMotelId()).orElse(null);

        ResidenceTemplate template = new ResidenceTemplate();
        template.setMotel(motel);
        template.setTemplatename(request.getTemplatename());
        template.setSortorder(request.getSortOrder());
        template.setContent(request.getContent());

        template = residenceTemplateRepository.save(template);
        return toResponse(template);
    }

    @Override
    public ResidenceTemplateResponse getResidenceTemplateById(UUID residenceTemplateId) {
        ResidenceTemplate template =
                residenceTemplateRepository.findById(residenceTemplateId).orElse(null);
        return template != null ? toResponse(template) : null;
    }

    @Override
    public List<ResidenceTemplateResponse> getAllResidenceTemplates() {
        return residenceTemplateRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResidenceTemplateResponse> getResidenceTemplatesByMotelId(UUID motelId) {
        return residenceTemplateRepository.findResidenceTemplateByMotel_MotelId(motelId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ResidenceTemplateResponse updateResidenceTemplate(
            UUID residenceTemplateId, ResidenceTemplateRequest request) {
        ResidenceTemplate template =
                residenceTemplateRepository.findById(residenceTemplateId).orElse(null);
        if (template == null) {
            return null;
        }

        Motel motel = motelRepository.findById(request.getMotelId()).orElse(null);
        template.setMotel(motel);
        template.setTemplatename(request.getTemplatename());
        template.setSortorder(request.getSortOrder());
        template.setContent(request.getContent());

        template = residenceTemplateRepository.save(template);
        return toResponse(template);
    }

    @Override
    public void deleteResidenceTemplate(UUID residenceTemplateId) {
        residenceTemplateRepository.deleteById(residenceTemplateId);
    }

    private ResidenceTemplateResponse toResponse(ResidenceTemplate template) {
        ResidenceTemplateResponse response = new ResidenceTemplateResponse();
        response.setResidenceTemplateId(template.getResidenceTemplateId());
        response.setMotelId(template.getMotel() != null ? template.getMotel().getMotelId() : null);
        response.setTemplatename(template.getTemplatename());
        response.setSortOrder(template.getSortorder());
        response.setContent(template.getContent());
        return response;
    }
}
