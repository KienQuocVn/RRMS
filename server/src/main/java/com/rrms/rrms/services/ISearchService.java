package com.rrms.rrms.services;

import java.math.BigDecimal;
import java.util.List;

import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;

public interface ISearchService {

    List<BulletinBoardSearchResponse> listRoomByAddress(String address);

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

    List<BulletinBoardSearchResponse> findAllByDatenew();

    List<BulletinBoardSearchResponse> findAllByIsActive();
}
