package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.BulletinBoardRequest;
import com.rrms.rrms.dto.response.BulletinBoardResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.dto.response.BulletinBoardTableResponse;
import com.rrms.rrms.models.BulletinBoard;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BulletinBoardMapper {

    BulletinBoardResponse toBulletinBoardResponse(BulletinBoard bulletinBoard);

    BulletinBoard toBulletinBoard(BulletinBoardRequest bulletinBoardRequest);

    BulletinBoardTableResponse toBulletinBoardTableResponse(BulletinBoard bulletinBoard);

    BulletinBoardSearchResponse toBulletinBoardSearchResponse(BulletinBoard bulletinBoard);

    @Mapping(target = "bulletinBoardId", ignore = true) // KhÃ´ng ghi Ä‘Ã¨ ID
    @Mapping(target = "account", ignore = true)
    // KhÃ´ng ghi Ä‘Ã¨ tÃ i khoáº£n
    void updateBulletinBoardFromRequest(
            BulletinBoardRequest bulletinBoardRequest, @MappingTarget BulletinBoard bulletinBoard);
}
