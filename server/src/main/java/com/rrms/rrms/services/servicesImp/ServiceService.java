package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.ServiceRequest;
import com.rrms.rrms.dto.response.ServiceResponse;
import com.rrms.rrms.mapper.ServiceMapper;
import com.rrms.rrms.repositories.ServiceRepository;
import com.rrms.rrms.services.IService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ServiceService implements IService {

    /** Tập hợp đơn vị tính hợp lệ cho dịch vụ nhà trọ. */
    static final Set<String> VALID_UNITS = Set.of("kWh", "Khối", "mét khối", "Người", "Tháng", "Lần", "Cái", "Chiếc");

    ServiceRepository serviceRepository;
    ServiceMapper serviceMapper;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    public ServiceResponse createService(ServiceRequest serviceRequest) {
        validateUnit(serviceRequest.getUnit());
        com.rrms.rrms.models.Service service = serviceRepository.save(serviceMapper.toService(serviceRequest));
        return serviceMapper.toServiceResponse(service);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(serviceMapper::toServiceResponse)
                .toList();
    }

    @Override
    public ServiceResponse getServiceById(UUID serviceId) {
        com.rrms.rrms.models.Service service = serviceRepository
                .findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId));
        return serviceMapper.toServiceResponse(service);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Override
    public ServiceResponse updateService(UUID serviceId, ServiceRequest serviceRequest) {
        validateUnit(serviceRequest.getUnit());
        com.rrms.rrms.models.Service service = serviceRepository
                .findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId));
        service.setTypeService(serviceRequest.getTypeService());
        service.setNameService(serviceRequest.getNameService());
        service.setUnit(serviceRequest.getUnit());
        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    public void deleteService(UUID serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId);
        }
        serviceRepository.deleteById(serviceId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void validateUnit(String unit) {
        if (unit == null || !VALID_UNITS.contains(unit)) {
            throw new IllegalArgumentException("Đơn vị không hợp lệ: '" + unit + "'. Chỉ chấp nhận: " + VALID_UNITS);
        }
    }
}
