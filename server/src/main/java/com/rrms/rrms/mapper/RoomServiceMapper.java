package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.RoomServiceRequest;
import com.rrms.rrms.dto.response.RoomServiceResponse;
import com.rrms.rrms.models.RoomService;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoomServiceMapper {
    RoomService toRoomService(RoomServiceRequest roomServiceRequest);

    RoomServiceResponse toRoomServiceResponse(RoomService roomService);
}
