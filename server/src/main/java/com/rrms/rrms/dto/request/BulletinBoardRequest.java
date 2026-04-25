package com.rrms.rrms.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
public class BulletinBoardRequest {

    String username;
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
    List<BulletinBoardImage> bulletinBoardImages;
    List<BulletinBoardRule> bulletinBoardRules;
    List<BulletinBoardRentalAmenity> bulletinBoardRentalAmenities;
}
