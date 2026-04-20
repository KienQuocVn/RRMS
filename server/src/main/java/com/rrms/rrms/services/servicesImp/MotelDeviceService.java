package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.MotelDeviceRequest;
import com.rrms.rrms.dto.response.MotelDeviceResponse;
import com.rrms.rrms.enums.Unit;
import com.rrms.rrms.mapper.MotelDeviceMapper;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelDevice;
import com.rrms.rrms.models.RoomDevice;
import com.rrms.rrms.repositories.MotelDeviceRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.RoomDeviceRepository;
import com.rrms.rrms.services.IMotelDeviceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MotelDeviceService implements IMotelDeviceService {
    private final MotelDeviceRepository motelDeviceRepository;

    private final MotelDeviceMapper mapper;

    final MotelRepository motelRepository;

    final RoomDeviceRepository roomDeviceRepository;

    @Override
    public List<MotelDeviceResponse> getAllMotelDevicesByMotel(UUID motelId) {
        Motel find = motelRepository.findById(motelId).orElse(null);
        return motelDeviceRepository.findAllByMotel(find).stream()
                .map(mapper::motelDeviceToMotelDeviceResponse)
                .toList();
    }

    @Override
    public MotelDeviceResponse insertMotelDevice(MotelDeviceRequest motelDeviceRequest) {
        Motel find = motelRepository
                .findById(motelDeviceRequest.getMotel().getMotelId())
                .orElse(null);
        if (find != null) {
            log.debug("Insert motel device for motelId={}", find.getMotelId());

            MotelDevice motelDevice = new MotelDevice();
            motelDevice.setMotel(find);
            motelDevice.setDeviceName(motelDeviceRequest.getDeviceName());
            motelDevice.setIcon(motelDeviceRequest.getIcon());
            motelDevice.setValue(motelDeviceRequest.getValue());
            motelDevice.setValueInput(motelDeviceRequest.getValueInput());
            motelDevice.setTotalQuantity(motelDeviceRequest.getTotalQuantity());
            motelDevice.setTotalUsing(motelDeviceRequest.getTotalUsing());
            motelDevice.setTotalNull(motelDeviceRequest.getTotalQuantity());
            motelDevice.setSupplier(motelDeviceRequest.getSupplier());

            log.debug(
                    "Motel device payload deviceName={}, value={}, unit={}",
                    motelDeviceRequest.getDeviceName(),
                    motelDeviceRequest.getValue(),
                    motelDeviceRequest.getUnit());

            switch (motelDeviceRequest.getUnit()) {
                case "cai" -> {
                    motelDevice.setUnit(Unit.CAI);
                }
                case "chiec" -> {
                    motelDevice.setUnit(Unit.CHIEC);
                }
                case "bo" -> {
                    motelDevice.setUnit(Unit.BO);
                }
                case "cap" -> {
                    motelDevice.setUnit(Unit.CAP);
                }
                default -> {
                    motelDevice.setUnit(Unit.CAI);
                }
            }

            MotelDevice savedMotelDevice = motelDeviceRepository.save(motelDevice);
            log.info(
                    "Inserted motel device motelDeviceId={}, deviceName={}",
                    savedMotelDevice.getMotel_device_id(),
                    savedMotelDevice.getDeviceName());

            return mapper.motelDeviceToMotelDeviceResponse(savedMotelDevice);
        }
        return null;
    }

    @Override
    public boolean deleteMotelDevice(UUID motelDeviceId) {
        Optional<MotelDevice> motelDevice = motelDeviceRepository.findById(motelDeviceId);

        if (motelDevice.isEmpty()) {
            return false;
        }
        RoomDevice exists = roomDeviceRepository.findByMotelDevice(motelDevice.get());
        if (exists != null) {
            return false;
        }
        motelDeviceRepository.delete(motelDevice.get());
        return true;
    }
}
