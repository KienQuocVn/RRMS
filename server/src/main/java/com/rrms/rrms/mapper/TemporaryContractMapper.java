package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.response.TemporaryContractResponse;
import com.rrms.rrms.models.TemporaryR_contract;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TemporaryContractMapper {

    TemporaryContractResponse toTemporaryContractResponse(TemporaryR_contract temporaryRContract);
}
