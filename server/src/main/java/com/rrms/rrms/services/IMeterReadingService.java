package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.models.MeterReading;

public interface IMeterReadingService {
    List<MeterReading> getAllByMotel(UUID motelId);

    List<MeterReading> getAllByRoom(UUID roomId);

    MeterReading save(MeterReading meterReading);

    void delete(UUID meterReadingId);

    MeterReading findById(UUID id);
}
