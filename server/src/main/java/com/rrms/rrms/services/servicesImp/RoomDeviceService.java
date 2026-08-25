package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.RoomDeviceRequest;
import com.rrms.rrms.dto.response.RoomDeviceResponse;
import com.rrms.rrms.mapper.RoomDeviceMapper;
import com.rrms.rrms.models.InvoiceDetail;
import com.rrms.rrms.models.MotelDevice;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.RoomDevice;
import com.rrms.rrms.repositories.InvoiceDetailRepository;
import com.rrms.rrms.repositories.MotelDeviceRepository;
import com.rrms.rrms.repositories.RoomDeviceRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.services.IRoomDeviceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomDeviceService implements IRoomDeviceService {
    private final RoomDeviceRepository roomDeviceRepository;

    private final RoomRepository roomRepository;

    private final MotelDeviceRepository motelDeviceRepository;

    private final InvoiceDetailRepository invoiceDetailRepository;

    private final RoomDeviceMapper mapper;

    @Override
    @Transactional
    public RoomDeviceResponse insertRoomDevice(RoomDeviceRequest roomDeviceRequest) {
        Room room =
                roomRepository.findById(roomDeviceRequest.getRoom().getRoomId()).orElse(null);
        MotelDevice motelDevice = motelDeviceRepository
                .findById(roomDeviceRequest.getMotelDevice().getMotel_device_id())
                .orElse(null);

        if (room == null || motelDevice == null) {
            return null;
        }

        int quantity = roomDeviceRequest.getQuantity() > 0 ? roomDeviceRequest.getQuantity() : 1;

        return roomDeviceRepository
                .findFirstByRoomAndMotelDevice(room, motelDevice)
                .map(mapper::roomDeviceToRoomDeviceResponse)
                .orElseGet(() -> {
                    if (motelDevice.getTotalNull() <= 0) {
                        return null;
                    }

                    RoomDevice roomDevice = new RoomDevice();
                    roomDevice.setRoom(room);
                    roomDevice.setMotelDevice(motelDevice);
                    roomDevice.setQuantity(quantity);
                    RoomDevice savedRoomDevice = roomDeviceRepository.save(roomDevice);

                    motelDevice.setTotalUsing(motelDevice.getTotalUsing() + 1);
                    motelDevice.setTotalNull(motelDevice.getTotalNull() - 1);
                    motelDeviceRepository.save(motelDevice);

                    return mapper.roomDeviceToRoomDeviceResponse(savedRoomDevice);
                });
    }

    @Override
    @Transactional
    public Boolean deleteByRoomAndAndMotelDevice(UUID roomId, UUID motelDeviceId) {
        Room findRoom = roomRepository.findById(roomId).orElse(null);
        MotelDevice findMotelDevice =
                motelDeviceRepository.findById(motelDeviceId).orElse(null);
        if (findRoom == null || findMotelDevice == null) {
            return false;
        }

        List<RoomDevice> roomDevices = roomDeviceRepository.findAllByRoomAndMotelDevice(findRoom, findMotelDevice);
        if (roomDevices.isEmpty()) {
            return false;
        }

        for (RoomDevice roomDevice : roomDevices) {
            List<InvoiceDetail> invoiceDetails =
                    invoiceDetailRepository.findByRoomDeviceRoomDeviceId(roomDevice.getRoomDeviceId());
            for (InvoiceDetail detail : invoiceDetails) {
                detail.setRoomDevice(null);
                invoiceDetailRepository.save(detail);
            }
            roomDeviceRepository.delete(roomDevice);
        }

        findMotelDevice.setTotalNull(findMotelDevice.getTotalNull() + 1);
        findMotelDevice.setTotalUsing(Math.max(0, findMotelDevice.getTotalUsing() - 1));
        motelDeviceRepository.save(findMotelDevice);
        return true;
    }

    @Override
    public List<RoomDeviceResponse> getAllDeviceByRoomId(UUID roomId) {
        Room findRoom = roomRepository.findById(roomId).orElse(null);
        if (findRoom != null) {
            return roomDeviceRepository.getAllByRoom(findRoom).stream()
                    .map(mapper::roomDeviceToRoomDeviceResponse)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Override
    @Transactional
    public Boolean updateQuantity(UUID roomId, UUID motelDeviceId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            return false;
        }

        Room findRoom = roomRepository.findById(roomId).orElse(null);
        MotelDevice findMotelDevice =
                motelDeviceRepository.findById(motelDeviceId).orElse(null);
        if (findRoom == null || findMotelDevice == null) {
            return false;
        }

        return roomDeviceRepository
                .findFirstByRoomAndMotelDevice(findRoom, findMotelDevice)
                .map(roomDevice -> {
                    roomDevice.setQuantity(quantity);
                    roomDeviceRepository.save(roomDevice);
                    return true;
                })
                .orElse(false);
    }
}
