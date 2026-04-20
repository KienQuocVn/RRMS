package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.ContractRequest;
import com.rrms.rrms.dto.response.ContractResponse;
import com.rrms.rrms.models.Contract;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {RoomMapper.class, TenantMapper.class, AccountMapper.class, ContractTemplateMapper.class})
public interface ContractMapper {

    Contract toEntity(ContractRequest request);

    @Mapping(source = "room", target = "room") // Ãnh xáº¡ Room Ä‘á»‘i tÆ°á»£ng Ä‘áº§y Ä‘á»§
    @Mapping(source = "tenant", target = "tenant") // Ãnh xáº¡ Tenant Ä‘á»‘i tÆ°á»£ng Ä‘áº§y Ä‘á»§
    @Mapping(source = "account", target = "username") // Ãnh xáº¡ Account Ä‘á»‘i tÆ°á»£ng Ä‘áº§y Ä‘á»§
    @Mapping(
            source = "contractTemplate",
            target = "contracttemplate") // Ãnh xáº¡ ContractTemplate Ä‘á»‘i tÆ°á»£ng Ä‘áº§y Ä‘á»§
    @Mapping(source = "broker.brokerId", target = "brokerId")
    ContractResponse toResponse(Contract contract);
}
