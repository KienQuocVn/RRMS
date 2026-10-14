package com.rrms.rrms.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.rrms.rrms.dto.request.BulletinBoardRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.BulletinBoardResponse;
import com.rrms.rrms.dto.response.BulletinBoardReviewsResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.dto.response.BulletinBoardTableResponse;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.BulletinBoardImage;
import com.rrms.rrms.models.BulletinBoardRentalAmenity;
import com.rrms.rrms.models.BulletinBoardReviews;
import com.rrms.rrms.models.BulletinBoardRule;

/**
 * Fallback implementation for BulletinBoardMapper.
 * Được dùng khi MapStruct chưa kịp tạo implementation hoặc thiếu bean MapStruct.
 */
@Component
@ConditionalOnMissingBean(name = "bulletinBoardMapperImpl")
public class BulletinBoardMapperFallback implements BulletinBoardMapper {

    private final MotelMapper motelMapper;
    private final RoomMapper roomMapper;

    public BulletinBoardMapperFallback(@Lazy MotelMapper motelMapper, @Lazy RoomMapper roomMapper) {
        this.motelMapper = motelMapper;
        this.roomMapper = roomMapper;
    }

    @Override
    public BulletinBoardResponse toBulletinBoardResponse(BulletinBoard bulletinBoard) {
        if (bulletinBoard == null) {
            return null;
        }

        BulletinBoardResponse.BulletinBoardResponseBuilder builder = BulletinBoardResponse.builder();
        builder.bulletinBoardId(bulletinBoard.getBulletinBoardId());
        builder.account(accountToAccountResponse(bulletinBoard.getAccount()));
        builder.title(bulletinBoard.getTitle());
        builder.rentalCategory(bulletinBoard.getRentalCategory());
        builder.description(bulletinBoard.getDescription());
        builder.rentPrice(bulletinBoard.getRentPrice());
        builder.promotionalRentalPrice(bulletinBoard.getPromotionalRentalPrice());
        builder.deposit(bulletinBoard.getDeposit());
        builder.area(bulletinBoard.getArea());
        builder.electricityPrice(bulletinBoard.getElectricityPrice());
        builder.waterPrice(bulletinBoard.getWaterPrice());
        builder.maxPerson(bulletinBoard.getMaxPerson());
        builder.moveInDate(bulletinBoard.getMoveInDate());
        builder.openingHours(bulletinBoard.getOpeningHours());
        builder.closeHours(bulletinBoard.getCloseHours());
        builder.address(bulletinBoard.getAddress());
        builder.longitude(bulletinBoard.getLongitude());
        builder.latitude(bulletinBoard.getLatitude());
        builder.status(bulletinBoard.getStatus());
        builder.isActive(bulletinBoard.getIsActive());
        builder.rejectionReason(bulletinBoard.getRejectionReason());
        builder.isHidden(bulletinBoard.getIsHidden());
        builder.createdAt(bulletinBoard.getCreatedAt());
        builder.updatedAt(bulletinBoard.getUpdatedAt());

        if (motelMapper != null && bulletinBoard.getMotel() != null) {
            builder.motel(motelMapper.motelToMotelResponse(bulletinBoard.getMotel()));
        }
        if (roomMapper != null && bulletinBoard.getRoom() != null) {
            builder.room(roomMapper.toRoomResponse(bulletinBoard.getRoom()));
        }

        Set<BulletinBoardImage> images = bulletinBoard.getBulletinBoardImages();
        if (images != null) {
            builder.bulletinBoardImages(new ArrayList<>(images));
        }

        Set<BulletinBoardReviews> reviews = bulletinBoard.getBulletinBoardReviews();
        if (reviews != null) {
            builder.bulletinBoardReviews(mapReviews(reviews));
        }

        Set<BulletinBoardRule> rules = bulletinBoard.getBulletinBoardRules();
        if (rules != null) {
            builder.bulletinBoardRules(new ArrayList<>(rules));
        }

        Set<BulletinBoardRentalAmenity> amenities = bulletinBoard.getBulletinBoardRentalAmenities();
        if (amenities != null) {
            builder.bulletinBoardRentalAmenities(new ArrayList<>(amenities));
        }

        return builder.build();
    }

    @Override
    public BulletinBoard toBulletinBoard(BulletinBoardRequest request) {
        if (request == null) {
            return null;
        }

        return BulletinBoard.builder()
                .title(request.getTitle())
                .rentalCategory(request.getRentalCategory())
                .description(request.getDescription())
                .rentPrice(request.getRentPrice())
                .promotionalRentalPrice(request.getPromotionalRentalPrice())
                .deposit(request.getDeposit())
                .area(request.getArea())
                .electricityPrice(request.getElectricityPrice())
                .waterPrice(request.getWaterPrice())
                .maxPerson(request.getMaxPerson())
                .moveInDate(request.getMoveInDate())
                .openingHours(request.getOpeningHours())
                .closeHours(request.getCloseHours())
                .address(request.getAddress())
                .longitude(request.getLongitude())
                .latitude(request.getLatitude())
                .status(request.getStatus())
                .isActive(request.getIsActive())
                .build();
    }

    @Override
    public BulletinBoardTableResponse toBulletinBoardTableResponse(BulletinBoard bulletinBoard) {
        if (bulletinBoard == null) {
            return null;
        }

        BulletinBoardTableResponse.BulletinBoardTableResponseBuilder builder = BulletinBoardTableResponse.builder();

        if (bulletinBoard.getRoom() != null && bulletinBoard.getRoom().getStatus() != null) {
            builder.roomStatus(bulletinBoard.getRoom().getStatus().name());
        }

        builder.bulletinBoardId(bulletinBoard.getBulletinBoardId());
        builder.title(bulletinBoard.getTitle());
        builder.rentalCategory(bulletinBoard.getRentalCategory());
        builder.address(bulletinBoard.getAddress());
        builder.rentPrice(bulletinBoard.getRentPrice());
        builder.area(bulletinBoard.getArea());
        builder.status(bulletinBoard.getStatus());
        builder.isActive(bulletinBoard.getIsActive());
        builder.rejectionReason(bulletinBoard.getRejectionReason());
        builder.isHidden(bulletinBoard.getIsHidden());

        return builder.build();
    }

    @Override
    public BulletinBoardSearchResponse toBulletinBoardSearchResponse(BulletinBoard bulletinBoard) {
        if (bulletinBoard == null) {
            return null;
        }

        BulletinBoardSearchResponse.BulletinBoardSearchResponseBuilder builder = BulletinBoardSearchResponse.builder();

        builder.bulletinBoardId(bulletinBoard.getBulletinBoardId());
        builder.account(accountToAccountResponse(bulletinBoard.getAccount()));
        builder.title(bulletinBoard.getTitle());
        builder.rentalCategory(bulletinBoard.getRentalCategory());
        builder.description(bulletinBoard.getDescription());
        builder.rentPrice(bulletinBoard.getRentPrice());
        builder.promotionalRentalPrice(bulletinBoard.getPromotionalRentalPrice());
        builder.deposit(bulletinBoard.getDeposit());
        builder.area(bulletinBoard.getArea());
        builder.electricityPrice(bulletinBoard.getElectricityPrice());
        builder.waterPrice(bulletinBoard.getWaterPrice());
        builder.maxPerson(bulletinBoard.getMaxPerson());
        builder.moveInDate(bulletinBoard.getMoveInDate());
        builder.openingHours(bulletinBoard.getOpeningHours());
        builder.closeHours(bulletinBoard.getCloseHours());
        builder.address(bulletinBoard.getAddress());
        builder.longitude(bulletinBoard.getLongitude());
        builder.latitude(bulletinBoard.getLatitude());
        builder.status(bulletinBoard.getStatus());
        builder.isActive(bulletinBoard.getIsActive());
        builder.createdAt(bulletinBoard.getCreatedAt());
        builder.updatedAt(bulletinBoard.getUpdatedAt());

        if (motelMapper != null && bulletinBoard.getMotel() != null) {
            builder.motel(motelMapper.motelToMotelResponse(bulletinBoard.getMotel()));
        }
        if (roomMapper != null && bulletinBoard.getRoom() != null) {
            builder.room(roomMapper.toRoomResponse(bulletinBoard.getRoom()));
        }

        Set<BulletinBoardImage> images = bulletinBoard.getBulletinBoardImages();
        if (images != null) {
            builder.bulletinBoardImages(new ArrayList<>(images));
        }

        Set<BulletinBoardReviews> reviews = bulletinBoard.getBulletinBoardReviews();
        if (reviews != null) {
            builder.bulletinBoardReviews(mapReviews(reviews));
        }

        Set<BulletinBoardRule> rules = bulletinBoard.getBulletinBoardRules();
        if (rules != null) {
            builder.bulletinBoardRules(new ArrayList<>(rules));
        }

        Set<BulletinBoardRentalAmenity> amenities = bulletinBoard.getBulletinBoardRentalAmenities();
        if (amenities != null) {
            builder.bulletinBoardRentalAmenities(new ArrayList<>(amenities));
        }

        return builder.build();
    }

    @Override
    public void updateBulletinBoardFromRequest(BulletinBoardRequest request, BulletinBoard bulletinBoard) {
        if (request == null || bulletinBoard == null) {
            return;
        }

        bulletinBoard.setTitle(request.getTitle());
        bulletinBoard.setRentalCategory(request.getRentalCategory());
        bulletinBoard.setDescription(request.getDescription());
        bulletinBoard.setRentPrice(request.getRentPrice());
        bulletinBoard.setPromotionalRentalPrice(request.getPromotionalRentalPrice());
        bulletinBoard.setDeposit(request.getDeposit());
        bulletinBoard.setArea(request.getArea());
        bulletinBoard.setElectricityPrice(request.getElectricityPrice());
        bulletinBoard.setWaterPrice(request.getWaterPrice());
        bulletinBoard.setMaxPerson(request.getMaxPerson());
        bulletinBoard.setMoveInDate(request.getMoveInDate());
        bulletinBoard.openingHours(request.getOpeningHours());
        bulletinBoard.closeHours(request.getCloseHours());
        bulletinBoard.setAddress(request.getAddress());
        bulletinBoard.setLongitude(request.getLongitude());
        bulletinBoard.setLatitude(request.getLatitude());
        bulletinBoard.setStatus(request.getStatus());
    }

    private AccountResponse accountToAccountResponse(Account account) {
        if (account == null) {
            return null;
        }
        return AccountResponse.builder()
                .username(account.getUsername())
                .fullName(account.getFullName())
                .phone(account.getPhone())
                .email(account.getEmail())
                .avatar(account.getAvatar())
                .build();
    }

    private List<BulletinBoardReviewsResponse> mapReviews(Set<BulletinBoardReviews> reviews) {
        List<BulletinBoardReviewsResponse> list = new ArrayList<>();
        for (BulletinBoardReviews review : reviews) {
            list.add(BulletinBoardReviewsResponse.builder()
                    .bulletinBoardReviewsId(review.getBulletinBoardReviewsId())
                    .rating(review.getRating())
                    .comment(review.getComment())
                    .createdAt(review.getCreatedAt())
                    .build());
        }
        return list;
    }
}
