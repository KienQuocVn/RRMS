package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.ServiceRequest;
import com.rrms.rrms.dto.response.ServiceResponse;

public interface IService {

    ServiceResponse createService(ServiceRequest serviceRequest);

    List<ServiceResponse> getAllServices();

    ServiceResponse getServiceById(UUID serviceId);

    ServiceResponse updateService(UUID serviceId, ServiceRequest serviceRequest);

    void deleteService(UUID serviceId);
}
