package com.rrms.rrms.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.BulletinBoardRequest;
import com.rrms.rrms.dto.response.BulletinBoardResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.dto.response.BulletinBoardTableResponse;
import com.rrms.rrms.models.BulletinBoard;

@Mapper(
        componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {MotelMapper.class, RoomMapper.class})
public interface BulletinBoardMapper {

    BulletinBoardResponse toBulletinBoardResponse(BulletinBoard bulletinBoard);

    @Mapping(target = "bulletinBoardId", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "bulletinBoardImages", ignore = true)
    @Mapping(target = "bulletinBoardReviews", ignore = true)
    @Mapping(target = "bulletinBoardRules", ignore = true)
    @Mapping(target = "bulletinBoardRentalAmenities", ignore = true)
    @Mapping(target = "motel", ignore = true)
    @Mapping(target = "room", ignore = true)
    BulletinBoard toBulletinBoard(BulletinBoardRequest bulletinBoardRequest);

    @Mapping(source = "room.status", target = "roomStatus")
    BulletinBoardTableResponse toBulletinBoardTableResponse(BulletinBoard bulletinBoard);

    BulletinBoardSearchResponse toBulletinBoardSearchResponse(BulletinBoard bulletinBoard);

    @Mapping(target = "bulletinBoardId", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "bulletinBoardImages", ignore = true)
    @Mapping(target = "bulletinBoardReviews", ignore = true)
    @Mapping(target = "bulletinBoardRules", ignore = true)
    @Mapping(target = "bulletinBoardRentalAmenities", ignore = true)
    @Mapping(target = "motel", ignore = true)
    @Mapping(target = "room", ignore = true)
    void updateBulletinBoardFromRequest(
            BulletinBoardRequest bulletinBoardRequest, @MappingTarget BulletinBoard bulletinBoard);
}
