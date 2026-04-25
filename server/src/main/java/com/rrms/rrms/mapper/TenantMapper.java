package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.TenantRequest;
import com.rrms.rrms.dto.response.TenantResponse;
import com.rrms.rrms.models.Tenant;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TenantMapper {
    @Mapping(source = "type_of_tenant", target = "typeOfTenant")
    TenantResponse toTenantResponse(Tenant tenant);

    @Mapping(source = "avatar", target = "avata")
    @Mapping(source = "typeOfTenant", target = "type_of_tenant")
    Tenant tenantRequestToTenant(TenantRequest tenantRequest);

    @Mapping(source = "avatar", target = "avata")
    @Mapping(source = "typeOfTenant", target = "type_of_tenant")
    void updateTenantFromRequest(TenantRequest tenantRequest, @MappingTarget Tenant tenant);
}
