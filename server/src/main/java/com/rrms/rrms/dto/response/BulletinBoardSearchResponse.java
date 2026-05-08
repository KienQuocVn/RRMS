package com.rrms.rrms.dto.response;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

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
@Document(indexName = "bulletin-boards")
public class BulletinBoardSearchResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    UUID bulletinBoardId;

    AccountResponse account;
    String title;
    String description;
    BigDecimal rentPrice;
    BigDecimal promotionalRentalPrice;
    Integer area;
    BigDecimal electricityPrice;
    BigDecimal waterPrice;
    LocalDate moveInDate;
    String address;
    Boolean isActive;
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
