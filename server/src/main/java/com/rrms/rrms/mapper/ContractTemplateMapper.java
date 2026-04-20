package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.response.ContractTemplateResponse;
import com.rrms.rrms.models.ContractTemplate;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContractTemplateMapper {

    @Mapping(source = "contracttemplateId", target = "contractTemplateId")
    @Mapping(source = "motel.motelId", target = "motelId")
    @Mapping(source = "sortorder", target = "sortOrder")
    ContractTemplateResponse toResponse(ContractTemplate contractTemplate);
}
