package com.rrms.rrms.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.BulletinBoardReviewsRequest;
import com.rrms.rrms.dto.response.BulletinBoardReviewsResponse;
import com.rrms.rrms.dto.response.RatingHistoryResponse;
import com.rrms.rrms.models.BulletinBoardImage;
import com.rrms.rrms.models.BulletinBoardReviews;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BulletinBoardReviewMapper {

    BulletinBoardReviewsResponse toBulletinBoardReviewsResponse(BulletinBoardReviews review);

    BulletinBoardReviews toBulletinBoardReviews(BulletinBoardReviewsRequest review);

    @Mapping(target = "bulletinBoardImages", source = "bulletinBoard.bulletinBoardImages")
    @Mapping(target = "bulletinBoard.account", ignore = true)
    @Mapping(target = "bulletinBoard.bulletinBoardImages", ignore = true)
    @Mapping(target = "bulletinBoard.bulletinBoardRentalAmenities", ignore = true)
    @Mapping(target = "bulletinBoard.bulletinBoardReviews", ignore = true)
    @Mapping(target = "bulletinBoard.bulletinBoardRules", ignore = true)
    RatingHistoryResponse toRatingHistoryResponse(BulletinBoardReviews review);

    default List<BulletinBoardImage> mapSetToList(Set<BulletinBoardImage> set) {
        if (set == null) {
            return null;
        }
        return new ArrayList<>(set);
    }
}
