package com.rrms.rrms.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.services.ISearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Search Controller")
@RestController
@Slf4j
@RequestMapping("/api/v1/search")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class SearchController {

    ISearchService searchService;

    @Operation(summary = "Get all rooms sorted by price")
    @GetMapping("/sort")
    public ApiResponse<List<BulletinBoardSearchResponse>> getRoomsSortedByPrice(
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        log.info("Sorting bulletin boards by price: {}", sortOrder);
        List<BulletinBoardSearchResponse> rooms;
        if ("ASC".equalsIgnoreCase(sortOrder)) {
            rooms = searchService.getRoomsSortedByPriceASC();
        } else if ("DESC".equalsIgnoreCase(sortOrder)) {
            rooms = searchService.getRoomsSortedByPriceDESC();
        } else {
            return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Invalid sortOrder. Valid values are 'ASC' or 'DESC'.")
                    .build();
        }
        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search successful")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Get all active rooms")
    @GetMapping("")
    public ApiResponse<List<BulletinBoardSearchResponse>> getRooms(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minArea,
            @RequestParam(required = false) Integer maxArea,
            @RequestParam(required = false) String rentalCategory) {
        boolean hasAdvancedFilter = query != null
                || district != null
                || minPrice != null
                || maxPrice != null
                || minArea != null
                || maxArea != null
                || rentalCategory != null;

        log.info(
                "Getting bulletin boards with filters - query: {}, district: {}, minPrice: {}, maxPrice: {}, minArea: {}, maxArea: {}, rentalCategory: {}",
                query,
                district,
                minPrice,
                maxPrice,
                minArea,
                maxArea,
                rentalCategory);

        List<BulletinBoardSearchResponse> rooms = hasAdvancedFilter
                ? searchService.searchRooms(query, district, minPrice, maxPrice, minArea, maxArea, rentalCategory)
                : searchService.getRooms();

        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search successful")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Get latest bulletin boards (Newest)")
    @GetMapping("/latest")
    public ApiResponse<List<BulletinBoardSearchResponse>> getLatestRooms() {
        log.info("Getting latest bulletin boards");
        List<BulletinBoardSearchResponse> rooms = searchService.findAllByDatenew();
        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search successful")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Get oldest bulletin boards")
    @GetMapping("/oldest")
    public ApiResponse<List<BulletinBoardSearchResponse>> getOldestRooms() {
        log.info("Getting oldest bulletin boards");
        List<BulletinBoardSearchResponse> rooms = searchService.findAllByIsActive();
        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search successful")
                .result(rooms)
                .build();
    }

    @Operation(summary = "Search room by address (MySQL LIKE)")
    @GetMapping("/by-address")
    public ApiResponse<List<BulletinBoardSearchResponse>> searchByAddress(@RequestParam("address") String address) {
        log.info("Searching bulletin boards by address (MySQL): {}", address);
        List<BulletinBoardSearchResponse> rooms = searchService.listRoomByAddress(address);
        return ApiResponse.<List<BulletinBoardSearchResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Search successful, found: " + rooms.size())
                .result(rooms)
                .build();
    }
}
