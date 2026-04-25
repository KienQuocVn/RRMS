package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.MeterReadingRequest;
import com.rrms.rrms.dto.response.MeterReadingResponse;

/**
 * Service interface for MeterReading operations.
 * Tracks utility meter readings (electricity, water) per room.
 */
public interface IMeterReadingService {
    List<MeterReadingResponse> getAllByMotel(UUID motelId);

    List<MeterReadingResponse> getAllByRoom(UUID roomId);

    MeterReadingResponse save(MeterReadingRequest request);

    void delete(UUID meterReadingId);

    MeterReadingResponse findById(UUID id);
}
