package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.BulletinBoardRoomRequest;
import com.rrms.rrms.dto.request.RoomRequest;
import com.rrms.rrms.dto.response.PostRoomTableResponse;
import com.rrms.rrms.dto.response.RoomDetailResponse;
import com.rrms.rrms.dto.response.RoomResponse;

public interface IRoomService {

    // Legacy (BulletinBoard)
    RoomDetailResponse getRoomById(UUID id);

    RoomDetailResponse createRoom(BulletinBoardRoomRequest roomRequest);

    List<PostRoomTableResponse> getPostRoomTable(String username);

    String deleteRoom(UUID id);

    // Standard REST APIs
    RoomResponse createRoom(RoomRequest roomRequest);

    RoomResponse getRoomByIdStandard(UUID roomId);

    List<RoomResponse> getAllRooms();

    RoomResponse updateRoom(UUID roomId, RoomRequest roomRequest);

    void deleteRoomStandard(UUID roomId);

    List<RoomResponse> getRoomsByMotelId(UUID motelId);

    List<RoomResponse> getRoomsByMotelIdNullContract(UUID motelId);

    List<RoomResponse> getRoomsByMotelIdContract(UUID motelId);
}
