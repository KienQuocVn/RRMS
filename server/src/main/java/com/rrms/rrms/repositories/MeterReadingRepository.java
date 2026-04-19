package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.MeterReading;

public interface MeterReadingRepository extends JpaRepository<MeterReading, UUID> {
    List<MeterReading> findByRoom_RoomId(UUID roomId);

    List<MeterReading> findByRoom_Motel_MotelId(UUID motelId);
}
