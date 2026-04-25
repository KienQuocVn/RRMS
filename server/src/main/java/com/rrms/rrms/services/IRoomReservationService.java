package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.RoomReservationRequest;
import com.rrms.rrms.dto.response.RoomReservationResponse;

public interface IRoomReservationService {
    RoomReservationResponse createRoomReservation(RoomReservationRequest request);

    RoomReservationResponse getRoomReservationById(UUID id);

    List<RoomReservationResponse> getAllRoomReservations();

    RoomReservationResponse updateRoomReservation(UUID id, RoomReservationRequest request);

    void deleteRoomReservation(UUID id);

    List<RoomReservationResponse> getRoomReservationsByRoomId(UUID roomId);
}
