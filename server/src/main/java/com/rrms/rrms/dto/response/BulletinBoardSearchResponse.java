package com.rrms.rrms.dto.response;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.BulletinBoardImage;
import com.rrms.rrms.models.BulletinBoardRentalAmenity;
import com.rrms.rrms.models.BulletinBoardRule;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BulletinBoardSearchResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    UUID bulletinBoardId;

    AccountResponse account;
    String title;
    String rentalCategory;
    String description;
    BigDecimal rentPrice;
    BigDecimal promotionalRentalPrice;
    BigDecimal deposit;
    Integer area;
    BigDecimal electricityPrice;
    BigDecimal waterPrice;
    String maxPerson;
    LocalDate moveInDate;
    String openingHours;
    String closeHours;
    String address;
    Double longitude;
    Double latitude;
    Boolean status;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    MotelResponse motel;
    RoomResponse room;
    List<BulletinBoardImage> bulletinBoardImages;
    List<BulletinBoardReviewsResponse> bulletinBoardReviews;
    List<BulletinBoardRule> bulletinBoardRules;
    List<BulletinBoardRentalAmenity> bulletinBoardRentalAmenities;

    public BulletinBoardSearchResponse(BulletinBoard bulletinBoard) {
        this.bulletinBoardId = bulletinBoard.getBulletinBoardId();
        this.isActive = bulletinBoard.getIsActive();
    }
}
