package com.rrms.rrms.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.ContractRequest;
import com.rrms.rrms.dto.response.ContractResponse;
import com.rrms.rrms.models.Contract;

@Mapper(
        componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {RoomMapper.class, TenantMapper.class, AccountMapper.class, ContractTemplateMapper.class})
public interface ContractMapper {

    @Mapping(source = "moveInDate", target = "moveinDate")
    @Mapping(source = "collectionCycle", target = "collectioncycle")
    @Mapping(source = "createDate", target = "createdate")
    @Mapping(source = "signContract", target = "signcontract")
    @Mapping(source = "reportCloseContract", target = "reportcloseContract")
    Contract toEntity(ContractRequest request);

    @Mapping(source = "room", target = "room")
    @Mapping(source = "tenant", target = "tenant")
    @Mapping(source = "account", target = "username")
    @Mapping(source = "contractTemplate", target = "contractTemplate")
    @Mapping(source = "broker.brokerId", target = "brokerId")
    @Mapping(source = "moveinDate", target = "moveInDate")
    @Mapping(source = "collectioncycle", target = "collectionCycle")
    @Mapping(source = "createdate", target = "createDate")
    @Mapping(source = "signcontract", target = "signContract")
    @Mapping(source = "reportcloseContract", target = "reportCloseContract")
    ContractResponse toResponse(Contract contract);
}
