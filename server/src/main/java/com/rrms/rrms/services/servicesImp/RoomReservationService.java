package com.rrms.rrms.services.servicesImp;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.RoomReservationRequest;
import com.rrms.rrms.dto.response.RoomReservationResponse;
import com.rrms.rrms.dto.response.RoomResponse;
import com.rrms.rrms.models.Reserve_a_place;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RoomReservationRepository;
import com.rrms.rrms.services.IRoomReservationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class RoomReservationService implements IRoomReservationService {

    RoomReservationRepository roomReservationRepository;
    RoomRepository roomRepository;

    @Override
    public RoomReservationResponse createRoomReservation(RoomReservationRequest request) {
        Room room =
                roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));

        Reserve_a_place reserveAPlace = Reserve_a_place.builder()
                .createdate(request.getCreateDate())
                .moveinDate(request.getMoveInDate())
                .nametenant(request.getNameTenant())
                .phonetenant(request.getPhoneTenant())
                .deposit(request.getDeposit())
                .note(request.getNote())
                .status(request.getStatus())
                .room(room)
                .build();

        Reserve_a_place savedReserveAPlace = roomReservationRepository.save(reserveAPlace);
        return mapToResponse(savedReserveAPlace);
    }

    @Override
    public RoomReservationResponse getRoomReservationById(UUID id) {
        Reserve_a_place reserveAPlace = roomReservationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("RoomReservation not found"));
        return mapToResponse(reserveAPlace);
    }

    @Override
    public List<RoomReservationResponse> getAllRoomReservations() {
        return roomReservationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomReservationResponse updateRoomReservation(UUID id, RoomReservationRequest request) {
        Reserve_a_place reserveAPlace = roomReservationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("RoomReservation not found"));

        Room room =
                roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));

        reserveAPlace.setCreatedate(request.getCreateDate());
        reserveAPlace.setMoveinDate(request.getMoveInDate());
        reserveAPlace.setNametenant(request.getNameTenant());
        reserveAPlace.setPhonetenant(request.getPhoneTenant());
        reserveAPlace.setDeposit(request.getDeposit());
        reserveAPlace.setNote(request.getNote());
        reserveAPlace.setRoom(room);

        Reserve_a_place updatedReserveAPlace = roomReservationRepository.save(reserveAPlace);
        return mapToResponse(updatedReserveAPlace);
    }

    @Override
    public void deleteRoomReservation(UUID id) {
        String hexId = Hex.encodeHexString(toBytes(id));
        if (!roomReservationRepository.existsById(id)) {
            throw new RuntimeException("RoomReservation not found");
        }
        roomReservationRepository.deleteByIdInHex(hexId);
    }

    private byte[] toBytes(UUID uuid) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[16]);
        buffer.putLong(uuid.getMostSignificantBits());
        buffer.putLong(uuid.getLeastSignificantBits());
        return buffer.array();
    }

    @Override
    public List<RoomReservationResponse> getRoomReservationsByRoomId(UUID roomId) {
        List<Reserve_a_place> reserveAPlaces = roomReservationRepository.findByRoom_RoomId(roomId);
        return reserveAPlaces.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private RoomReservationResponse mapToResponse(Reserve_a_place reserveAPlace) {
        RoomResponse roomResponse = RoomResponse.builder()
                .roomId(reserveAPlace.getRoom().getRoomId())
                .name(reserveAPlace.getRoom().getName())
                .price(reserveAPlace.getRoom().getPrice())
                .build();
        return RoomReservationResponse.builder()
                .roomReservationId(reserveAPlace.getReserveaplaceId())
                .createDate(reserveAPlace.getCreatedate())
                .moveInDate(reserveAPlace.getMoveinDate())
                .nameTenant(reserveAPlace.getNametenant())
                .phoneTenant(reserveAPlace.getPhonetenant())
                .deposit(reserveAPlace.getDeposit())
                .note(reserveAPlace.getNote())
                .status(reserveAPlace.getStatus())
                .room(roomResponse)
                .build();
    }
}
