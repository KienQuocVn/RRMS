package com.rrms.rrms.services.servicesImp;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.BulletinBoardRoomRequest;
import com.rrms.rrms.dto.request.RoomRequest;
import com.rrms.rrms.dto.response.*;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.RoomMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.Reserve_a_place;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RoomServiceRepository;
import com.rrms.rrms.services.IRoomService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoomService implements IRoomService {
    RoomRepository roomRepository;
    MotelRepository motelRepository;
    AccountRepository accountRepository;
    RoomServiceRepository roomServiceRepository;
    RoomMapper roomMapper;

    @Override
    public RoomDetailResponse getRoomById(UUID id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_DETAIL_NOT_FOUND));
        return roomMapper.toRoomDetailResponse(room);
    }

    @Override
    public RoomDetailResponse createRoom(BulletinBoardRoomRequest roomRequest) {
        return null;
    }

    @Override
    public List<PostRoomTableResponse> getPostRoomTable(String username) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        return roomRepository.findAllByMotel_Account(account).stream()
                .map(roomMapper::toPostRoomTableResponse)
                .toList();
    }

    @Override
    public String deleteRoom(UUID id) {
        String result;
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            result = "Delete room successful at roomI: " + id;
        } else {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }

        return result;
    }

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest) {
        Motel motel = motelRepository
                .findById(roomRequest.getMotelId())
                .orElseThrow(() -> new IllegalArgumentException("Motel not found"));
        Room room = convertToEntity(roomRequest);
        room.setMotel(motel);
        Room savedRoom = roomRepository.save(room);
        return convertToResponse(savedRoom);
    }

    @Override
    public RoomResponse getRoomByIdStandard(UUID roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        return convertToResponse(room);
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public RoomResponse updateRoom(UUID roomId, RoomRequest roomRequest) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));

        updateEntityFromRequest(room, roomRequest);

        if (roomRequest.getMotelId() != null) {
            Motel motel = motelRepository
                    .findById(roomRequest.getMotelId())
                    .orElseThrow(() -> new IllegalArgumentException("Motel not found"));
            room.setMotel(motel);
        }

        Room updatedRoom = roomRepository.save(room);
        return convertToResponse(updatedRoom);
    }

    @Override
    public void deleteRoomStandard(UUID roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Room not found");
        }
        roomRepository.deleteById(roomId);
    }

    @Override
    public List<RoomResponse> getRoomsByMotelId(UUID motelId) {
        Motel motel =
                motelRepository.findById(motelId).orElseThrow(() -> new IllegalArgumentException("Motel not found"));
        List<Room> rooms = roomRepository.findByMotel(motel);
        return rooms.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByMotelIdNullContract(UUID motelId) {
        Motel motel =
                motelRepository.findById(motelId).orElseThrow(() -> new IllegalArgumentException("Motel not found"));
        List<Room> rooms = roomRepository.findRoomsWithoutContractsByMotel(motel);
        return rooms.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByMotelIdContract(UUID motelId) {
        motelRepository.findById(motelId).orElseThrow(() -> new IllegalArgumentException("Motel not found"));
        List<Room> rooms = roomRepository.findRoomsWithContractsByMotelId(motelId);
        return rooms.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private RoomResponse convertToResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setRoomId(room.getRoomId());
        response.setMotelId(room.getMotel().getMotelId());
        response.setName(room.getName());
        response.setGroup(room.getGroup());
        response.setPrioritize(room.getPrioritize());
        response.setArea(room.getArea());
        response.setPrice(room.getPrice());
        response.setDeposit(room.getDeposit());
        response.setStatus(room.getStatus());
        response.setFinance(room.getFinance());
        response.setDescription(room.getDescription());

        List<com.rrms.rrms.models.RoomService> roomServices = roomServiceRepository.findByRoom(room);

        List<RoomServiceResponse> serviceResponses = roomServices.stream()
                .map(service -> new RoomServiceResponse(
                        service.getRoomServiceId(),
                        service.getRoom().getRoomId(),
                        service.getService().getServiceId(),
                        service.getQuantity()))
                .collect(Collectors.toList());

        response.setServices(serviceResponses);

        ContractResponse latestContract = Optional.ofNullable(room.getContracts()).orElse(List.of()).stream()
                .filter(contract -> contract.getStatus() == ContractStatus.ACTIVE
                        || contract.getStatus() == ContractStatus.EXPIRING
                        || contract.getStatus() == ContractStatus.TERMINATED)
                .map(contract -> ContractResponse.builder()
                        .contractId(contract.getContractId())
                        .moveInDate(contract.getMoveinDate())
                        .leaseTerm(contract.getLeaseTerm())
                        .closeContract(contract.getCloseContract())
                        .description(contract.getDescription())
                        .debt(contract.getDebt())
                        .price(contract.getPrice())
                        .deposit(contract.getDeposit())
                        .collectionCycle(contract.getCollectioncycle())
                        .createDate(contract.getCreatedate())
                        .signContract(contract.getSigncontract())
                        .language(contract.getLanguage())
                        .countTenant(contract.getCountTenant())
                        .status(contract.getStatus())
                        .build())
                .max(Comparator.comparing(
                        ContractResponse::getCreateDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);

        response.setLatestContract(latestContract);

        if (room.getReserveAPlaces() != null && !room.getReserveAPlaces().isEmpty()) {
            RoomReservationResponse roomReservationResponse =
                    convertToRoomReservationResponse(room.getReserveAPlaces().get(0));
            response.setRoomReservation(roomReservationResponse);
        }

        return response;
    }

    private Room convertToEntity(RoomRequest roomRequest) {
        Room room = new Room();
        room.setName(roomRequest.getName());
        room.setGroup(roomRequest.getGroup());
        room.setPrice(roomRequest.getPrice());
        room.setPrioritize(roomRequest.getPrioritize());
        room.setArea(roomRequest.getArea());
        room.setDeposit(roomRequest.getDeposit());
        room.setStatus(roomRequest.getStatus());
        room.setFinance(roomRequest.getFinance());
        room.setDescription(roomRequest.getDescription());
        return room;
    }

    private void updateEntityFromRequest(Room room, RoomRequest roomRequest) {
        if (roomRequest.getName() != null) room.setName(roomRequest.getName());
        if (roomRequest.getGroup() != null) room.setGroup(roomRequest.getGroup());
        if (roomRequest.getPrice() != null) room.setPrice(roomRequest.getPrice());
        if (roomRequest.getPrioritize() != null) room.setPrioritize(roomRequest.getPrioritize());
        if (roomRequest.getArea() != null) room.setArea(roomRequest.getArea());
        if (roomRequest.getDeposit() != null) room.setDeposit(roomRequest.getDeposit());
        if (roomRequest.getStatus() != null) room.setStatus(roomRequest.getStatus());
        if (roomRequest.getFinance() != null) room.setFinance(roomRequest.getFinance());
        if (roomRequest.getDescription() != null) room.setDescription(roomRequest.getDescription());
    }

    private RoomReservationResponse convertToRoomReservationResponse(Reserve_a_place reserveAPlace) {
        if (reserveAPlace == null) {
            return null;
        }
        return RoomReservationResponse.builder()
                .roomReservationId(reserveAPlace.getReserveaplaceId())
                .createDate(reserveAPlace.getCreatedate())
                .moveInDate(reserveAPlace.getMoveinDate())
                .nameTenant(reserveAPlace.getNametenant())
                .phoneTenant(reserveAPlace.getPhonetenant())
                .deposit(reserveAPlace.getDeposit())
                .note(reserveAPlace.getNote())
                .status(reserveAPlace.getStatus())
                .build();
    }
}
