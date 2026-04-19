package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rrms.rrms.dto.request.ContractRequest;
import com.rrms.rrms.dto.response.ContractResponse;
import com.rrms.rrms.models.Contract;

@Mapper(
        componentModel = "spring",
        uses = {RoomMapper.class, TenantMapper.class, AccountMapper.class, ContractTemplateMapper.class})
public interface ContractMapper {

    Contract toEntity(ContractRequest request);

    @Mapping(source = "room", target = "room") // Ánh xạ Room đối tượng đầy đủ
    @Mapping(source = "tenant", target = "tenant") // Ánh xạ Tenant đối tượng đầy đủ
    @Mapping(source = "account", target = "username") // Ánh xạ Account đối tượng đầy đủ
    @Mapping(source = "contractTemplate", target = "contracttemplate") // Ánh xạ ContractTemplate đối tượng đầy đủ
    @Mapping(source = "broker.brokerId", target = "brokerId")
    ContractResponse toResponse(Contract contract);
}
