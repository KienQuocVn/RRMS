package com.rrms.rrms.services.servicesImp;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.RoomServiceRequest;
import com.rrms.rrms.dto.response.RoomServiceDetailResponse;
import com.rrms.rrms.dto.response.RoomServiceResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.RoomServiceMapper;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.RoomService;
import com.rrms.rrms.repositories.MotelServiceRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RoomServiceRepository;
import com.rrms.rrms.services.IRoomServiceService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class RoomServiceService implements IRoomServiceService {

    RoomServiceRepository roomServiceRepository;
    RoomRepository roomRepository;
    MotelServiceRepository serviceRepository;
    RoomServiceMapper roomServiceMapper;

    private RoomService saveOrUpdateRoomService(Room room, MotelService service, Integer quantity) {
        RoomService roomService = roomServiceRepository
                .findFirstByRoom_RoomIdAndService_MotelServiceId(room.getRoomId(), service.getMotelServiceId())
                .orElseGet(
                        () -> RoomService.builder().room(room).service(service).build());

        roomService.setQuantity(quantity);
        return roomServiceRepository.save(roomService);
    }

    @Override
    public RoomServiceResponse createRoomService(RoomServiceRequest roomServiceRequest) {
        Room room = roomRepository
                .findById(roomServiceRequest.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_DETAIL_NOT_FOUND));

        MotelService Motelservice = serviceRepository
                .findById(roomServiceRequest.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

        RoomService roomService = saveOrUpdateRoomService(room, Motelservice, roomServiceRequest.getQuantity());

        return roomServiceMapper.toRoomServiceResponse(roomService);
    }

    @Override
    public RoomServiceResponse updateRoomService(UUID roomServiceId, RoomServiceRequest request) {
        RoomService roomService = roomServiceRepository
                .findById(roomServiceId)
                .orElseThrow(() -> new RuntimeException("RoomService not found"));

        Room room = roomRepository
                .findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_DETAIL_NOT_FOUND));
        com.rrms.rrms.models.MotelService service = serviceRepository
                .findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

        roomService.setRoom(room);
        roomService.setService(service);
        roomService.setQuantity(request.getQuantity());

        roomService = roomServiceRepository.save(roomService);
        return toRoomServiceResponse(roomService);
    }

    @Override
    public RoomServiceResponse getRoomServiceById(UUID roomServiceId) {
        RoomService roomService = roomServiceRepository
                .findById(roomServiceId)
                .orElseThrow(() -> new RuntimeException("RoomService not found"));

        return toRoomServiceResponse(roomService);
    }

    @Override
    public void deleteRoomService(UUID roomServiceId) {
        if (!roomServiceRepository.existsById(roomServiceId)) {
            throw new RuntimeException("RoomService not found");
        }
        roomServiceRepository.deleteById(roomServiceId);
    }

    @Override
    public RoomServiceResponse createRoomService2(RoomServiceRequest roomServiceRequest) {
        Room room = roomRepository
                .findById(roomServiceRequest.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_DETAIL_NOT_FOUND));

        MotelService service = serviceRepository
                .findById(roomServiceRequest.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        log.debug(
                "Create room service detail - roomId: {}, serviceId: {}",
                room.getRoomId(),
                service.getMotelServiceId());
        RoomService roomService = saveOrUpdateRoomService(room, service, roomServiceRequest.getQuantity());

        return toRoomServiceResponse(roomService);
    }

    @Override
    public List<RoomServiceResponse> findAll() {
        return roomServiceRepository.findAll().stream()
                .map(this::toRoomServiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomServiceDetailResponse> findByRoomId(UUID roomId) {
        Map<UUID, RoomService> uniqueServices = new LinkedHashMap<>();
        for (RoomService roomService : roomServiceRepository.findByRoom_RoomId(roomId)) {
            UUID serviceId =
                    roomService.getService() != null ? roomService.getService().getMotelServiceId() : null;
            if (serviceId != null) {
                uniqueServices.putIfAbsent(serviceId, roomService);
            }
        }

        return uniqueServices.values().stream()
                .map(this::toRoomServiceResponse2)
                .collect(Collectors.toList());
    }

    public RoomServiceResponse toRoomServiceResponse(RoomService roomService) {
        return RoomServiceResponse.builder()
                .roomServiceId(roomService.getRoomServiceId())
                .roomId(
                        roomService.getRoom() != null
                                ? roomService.getRoom().getRoomId()
                                : null) // Kiểm tra nếu room không null
                .serviceId(
                        roomService.getService() != null
                                ? roomService.getService().getMotelServiceId()
                                : null) // Kiểm tra nếu service không null
                .quantity(roomService.getQuantity())
                .build();
    }

    public RoomServiceDetailResponse toRoomServiceResponse2(RoomService roomService) {
        return RoomServiceDetailResponse.builder()
                .roomServiceId(roomService.getRoomServiceId())
                .room(roomService.getRoom()) // Kiểm tra nếu room không null
                .service(roomService.getService()) // Kiểm tra nếu service không null
                .quantity(roomService.getQuantity())
                .build();
    }
}
