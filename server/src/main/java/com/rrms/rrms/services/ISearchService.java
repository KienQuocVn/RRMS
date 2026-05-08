package com.rrms.rrms.services;

import java.math.BigDecimal;
import java.util.List;

import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;

public interface ISearchService {

    List<BulletinBoardSearchResponse> listRoomByAddress(String address);
    //        List<RoomDetailResponse> listRoomPrice(Double startPrice, Double endPrice);

    List<BulletinBoardSearchResponse> getRooms();

    List<BulletinBoardSearchResponse> searchRooms(
            String query,
            String district,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minArea,
            Integer maxArea,
            String rentalCategory);

    List<BulletinBoardSearchResponse> getRoomsSortedByPriceASC();

    List<BulletinBoardSearchResponse> getRoomsSortedByPriceDESC();
    //    List<RoomSearchResponse> findByAddressNoElastic(String keyword);
    //
    //    List<RoomSearchResponse> findByAddress(String keyword);
    //
    //    List<RoomSearchResponse> findByAddressFuzzy(String keyword);

    //    List<BulletinBoardSearchResponse> findByMoveInDateLessThanEqual(Date moveInDate);

    List<BulletinBoardSearchResponse> findAllByDatenew();

    List<BulletinBoardSearchResponse> findAllByIsActive();
}
