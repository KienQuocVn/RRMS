package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.MotelDeviceRequest;
import com.rrms.rrms.dto.response.MotelDeviceResponse;
import com.rrms.rrms.models.MotelDevice;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MotelDeviceMapper {
    MotelDevice motelDeviceRequestToMotelDevice(MotelDeviceRequest motelDeviceRequest);

    MotelDeviceResponse motelDeviceToMotelDeviceResponse(MotelDevice motelDevice);
}
