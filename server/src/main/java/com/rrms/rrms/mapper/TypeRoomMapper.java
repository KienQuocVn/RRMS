package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.TypeRoomRequest;
import com.rrms.rrms.dto.response.TypeRoomResponse;
import com.rrms.rrms.models.TypeRoom;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TypeRoomMapper {
    TypeRoom toTypeRoom(TypeRoomRequest typeRoomRequest);

    TypeRoomRequest toTypeRoomRequest(TypeRoom typeRoom);

    TypeRoomResponse toTypeRoomResponse(TypeRoom typeRoom);
}
