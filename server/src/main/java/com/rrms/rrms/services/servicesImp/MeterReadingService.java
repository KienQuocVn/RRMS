package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.MeterReadingRequest;
import com.rrms.rrms.dto.response.MeterReadingResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.MeterReading;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.MeterReadingRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.ServiceRepository;
import com.rrms.rrms.services.IMeterReadingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeterReadingService implements IMeterReadingService {

    private final MeterReadingRepository meterReadingRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MeterReadingResponse> getAllByMotel(UUID motelId) {
        return meterReadingRepository.findByRoom_Motel_MotelId(motelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeterReadingResponse> getAllByRoom(UUID roomId) {
        return meterReadingRepository.findByRoom_RoomId(roomId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MeterReadingResponse save(MeterReadingRequest request) {
        Room room = roomRepository
                .findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        com.rrms.rrms.models.Service service = serviceRepository
                .findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

        MeterReading meterReading = MeterReading.builder()
                .room(room)
                .service(service)
                .oldIndex(request.getOldIndex())
                .newIndex(request.getNewIndex())
                .usageAmount(
                        request.getNewIndex() != null && request.getOldIndex() != null
                                ? request.getNewIndex() - request.getOldIndex()
                                : null)
                .readingDate(request.getReadingDate())
                .imageUrl(request.getImageUrl())
                .build();

        MeterReading saved = meterReadingRepository.save(meterReading);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID meterReadingId) {
        meterReadingRepository.deleteById(meterReadingId);
    }

    @Override
    @Transactional(readOnly = true)
    public MeterReadingResponse findById(UUID id) {
        MeterReading meterReading = meterReadingRepository.findById(id).orElse(null);
        return meterReading != null ? mapToResponse(meterReading) : null;
    }

    private MeterReadingResponse mapToResponse(MeterReading meterReading) {
        return MeterReadingResponse.builder()
                .meterReadingId(meterReading.getMeterReadingId())
                .roomId(meterReading.getRoom().getRoomId())
                .roomName(meterReading.getRoom().getName())
                .serviceId(meterReading.getService().getServiceId())
                .serviceName(meterReading.getService().getNameService())
                .oldIndex(meterReading.getOldIndex())
                .newIndex(meterReading.getNewIndex())
                .usageAmount(meterReading.getUsageAmount())
                .readingDate(meterReading.getReadingDate())
                .imageUrl(meterReading.getImageUrl())
                .build();
    }
}
