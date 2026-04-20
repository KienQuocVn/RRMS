package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.ServiceRequest;
import com.rrms.rrms.dto.response.ServiceResponse;
import com.rrms.rrms.models.Service;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceMapper {
    Service toService(ServiceRequest serviceRequest);

    ServiceResponse toServiceResponse(Service service);
}
