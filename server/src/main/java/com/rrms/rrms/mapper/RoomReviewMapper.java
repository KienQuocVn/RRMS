package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.response.RoomReviewResponse;
import com.rrms.rrms.models.RoomReview;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoomReviewMapper {
    RoomReviewResponse toRoomReviewResponse(RoomReview roomReview);
}
