package com.rrms.rrms.services.servicesImp;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.MotelServiceRequest;
import com.rrms.rrms.dto.request.MotelServiceUpdateRequest;
import com.rrms.rrms.dto.response.MotelServiceResponse;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.MotelServiceRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RoomServiceRepository;
import com.rrms.rrms.services.IMotelServiceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MotelServiceService implements IMotelServiceService {

    private final MotelServiceRepository motelServiceRepository;

    private final MotelRepository motelRepository;

    private final RoomRepository roomRepository;

    private final RoomServiceRepository roomServiceRepository;

    @Override
    public MotelServiceResponse createMotelService(MotelServiceRequest request) {
        Motel motel = motelRepository
                .findById(request.getMotelId())
                .orElseThrow(() -> new IllegalArgumentException("Motel not found"));

        MotelService motelService = new MotelService();
        motelService.setMotel(motel);
        motelService.setNameService(request.getNameService());
        motelService.setPrice(request.getPrice());
        motelService.setChargetype(request.getChargetype());
        MotelService savedMotelService = motelServiceRepository.save(motelService);

        List<UUID> selectedRooms = request.getSelectedRooms();
        if (selectedRooms != null && !selectedRooms.isEmpty()) {
            for (UUID roomId : selectedRooms) {
                Room room = roomRepository
                        .findById(roomId)
                        .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + roomId));

                com.rrms.rrms.models.RoomService roomService = new com.rrms.rrms.models.RoomService();
                roomService.setRoom(room);
                roomService.setService(savedMotelService);
                roomService.setQuantity(1);

                roomServiceRepository.save(roomService);
            }
        }

        return mapToResponse(savedMotelService);
    }

    @Override
    public MotelServiceResponse updateMotelService(UUID id, MotelServiceUpdateRequest request) {
        // TÃ¬m dá»‹ch vá»¥ theo ID
        MotelService motelService = motelServiceRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MotelService not found"));

        // Cáº­p nháº­t cÃ¡c thuá»™c tÃ­nh cá»§a dá»‹ch vá»¥
        motelService.setNameService(request.getNameService());
        motelService.setPrice(request.getPrice());
        motelService.setChargetype(request.getChargetype());

        // LÆ°u cáº­p nháº­t dá»‹ch vá»¥
        MotelService updatedMotelService = motelServiceRepository.save(motelService);

        // Láº¥y danh sÃ¡ch cÃ¡c phÃ²ng Ä‘Ã£ chá»n tá»« request
        List<UUID> selectedRooms = request.getSelectedRooms();

        // Láº¥y táº¥t cáº£ cÃ¡c dá»‹ch vá»¥ phÃ²ng hiá»‡n táº¡i cho dá»‹ch vá»¥ nÃ y
        List<com.rrms.rrms.models.RoomService> currentRoomServices = roomServiceRepository.findByService(motelService);

        // Táº¡o danh sÃ¡ch cÃ¡c phÃ²ng ID Ä‘Ã£ cÃ³ dá»‹ch vá»¥
        Set<UUID> currentRoomIds = currentRoomServices.stream()
                .map(roomService -> roomService.getRoom().getRoomId())
                .collect(Collectors.toSet());

        // Lá»c ra cÃ¡c phÃ²ng má»›i Ä‘á»ƒ thÃªm vÃ  cÃ¡c phÃ²ng khÃ´ng cÃ²n trong selectedRooms Ä‘á»ƒ xÃ³a
        Set<UUID> newRoomIds = new HashSet<>(selectedRooms);
        newRoomIds.removeAll(currentRoomIds); // Chá»‰ giá»¯ cÃ¡c phÃ²ng má»›i cáº§n thÃªm

        Set<UUID> removedRoomIds = new HashSet<>(currentRoomIds);
        removedRoomIds.removeAll(selectedRooms); // Chá»‰ giá»¯ cÃ¡c phÃ²ng cáº§n xÃ³a

        // ThÃªm dá»‹ch vá»¥ cho cÃ¡c phÃ²ng má»›i
        for (UUID roomId : newRoomIds) {
            Room room = roomRepository
                    .findById(roomId)
                    .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + roomId));

            com.rrms.rrms.models.RoomService roomService = new com.rrms.rrms.models.RoomService();
            roomService.setRoom(room);
            roomService.setService(updatedMotelService);
            roomService.setQuantity(1);

            roomServiceRepository.save(roomService);
        }

        // XÃ³a dá»‹ch vá»¥ khá»i cÃ¡c phÃ²ng khÃ´ng cÃ²n trong danh sÃ¡ch selectedRooms
        for (UUID roomId : removedRoomIds) {
            com.rrms.rrms.models.RoomService roomServiceToDelete = currentRoomServices.stream()
                    .filter(rs -> rs.getRoom().getRoomId().equals(roomId))
                    .findFirst()
                    .orElse(null);

            if (roomServiceToDelete != null) {
                roomServiceRepository.delete(roomServiceToDelete);
            }
        }

        return mapToResponse(updatedMotelService);
    }

    @Override
    public void deleteMotelService(UUID id) {
        if (!motelServiceRepository.existsById(id)) {
            throw new IllegalArgumentException("MotelService not found");
        }
        // Báº¡n cÃ³ thá»ƒ cáº§n cáº­p nháº­t danh sÃ¡ch dá»‹ch vá»¥ cá»§a motel
        Optional<MotelService> motelServiceOpt = motelServiceRepository.findById(id);
        motelServiceOpt.ifPresent(motelService -> {
            Motel motel = motelService.getMotel(); // tÃ¹y thuá»™c vÃ o cÃ¡ch báº¡n cÃ³ má»‘i quan há»‡
            if (motel != null) {
                motel.getMotelServices().remove(motelService); // XoÃ¡ dá»‹ch vá»¥ khá»i danh sÃ¡ch cá»§a motel
                motelRepository.save(motel); // LÆ°u láº¡i motel sau khi Ä‘Ã£ cáº­p nháº­t
            }
        });

        motelServiceRepository.deleteById(id);
    }

    @Override
    public MotelServiceResponse getMotelServiceById(UUID id) {
        MotelService motelService = motelServiceRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MotelService not found"));
        return mapToResponse(motelService);
    }

    @Override
    public List<MotelServiceResponse> getAllMotelServices() {
        return motelServiceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MotelServiceResponse updateMotelServiceById(UUID motelId, MotelServiceUpdateRequest request) {
        // TÃ¬m báº£n ghi MotelService Ä‘áº§u tiÃªn theo motelId
        MotelService motelService = motelServiceRepository
                .findFirstByMotel_MotelId(motelId)
                .orElseThrow(() -> new IllegalArgumentException("MotelService not found for given motelId"));

        // Cáº­p nháº­t cÃ¡c thuá»™c tÃ­nh
        motelService.setNameService(request.getNameService());
        motelService.setPrice(request.getPrice());
        motelService.setChargetype(request.getChargetype());

        // LÆ°u vÃ  tráº£ vá» response
        MotelService updatedService = motelServiceRepository.save(motelService);
        return mapToResponse(updatedService);
    }

    // Mapping method to convert MotelService entity to MotelServiceResponse DTO
    private MotelServiceResponse mapToResponse(MotelService motelService) {
        return new MotelServiceResponse(
                motelService.getMotelServiceId(),
                motelService.getMotel().getMotelId(),
                motelService.getNameService(),
                motelService.getPrice(),
                motelService.getChargetype());
    }
}
