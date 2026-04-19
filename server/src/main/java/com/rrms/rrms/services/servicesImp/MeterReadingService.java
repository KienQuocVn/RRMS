package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rrms.rrms.models.MeterReading;
import com.rrms.rrms.repositories.MeterReadingRepository;
import com.rrms.rrms.services.IMeterReadingService;

@Service
public class MeterReadingService implements IMeterReadingService {

    @Autowired
    private MeterReadingRepository meterReadingRepository;

    @Override
    public List<MeterReading> getAllByMotel(UUID motelId) {
        return meterReadingRepository.findByRoom_Motel_MotelId(motelId);
    }

    @Override
    public List<MeterReading> getAllByRoom(UUID roomId) {
        return meterReadingRepository.findByRoom_RoomId(roomId);
    }

    @Override
    public MeterReading save(MeterReading meterReading) {
        return meterReadingRepository.save(meterReading);
    }

    @Override
    public void delete(UUID meterReadingId) {
        meterReadingRepository.deleteById(meterReadingId);
    }

    @Override
    public MeterReading findById(UUID id) {
        return meterReadingRepository.findById(id).orElse(null);
    }
}
