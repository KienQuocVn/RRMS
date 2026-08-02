package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.RoomStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.BulletinBoardMapper;
import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.BulletinBoardRepository;
import com.rrms.rrms.services.ISearchService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService implements ISearchService {
    BulletinBoardMapper bulletinBoardMapper;
    BulletinBoardRepository bulletinBoardRepository;

    private boolean shouldLoadBulletinBoard(BulletinBoard b) {
        Room r = b.getRoom();
        if (r == null) {
            return true;
        }
        if (r.getStatus() == RoomStatus.AVAILABLE) {
            return true;
        }
        if (r.getStatus() == RoomStatus.OCCUPIED) {
            String category = b.getRentalCategory();
            if (category == null) {
                return false;
            }
            String lowerCategory = category.trim().toLowerCase();
            return lowerCategory.contains("ở ghép")
                    || lowerCategory.contains("pass phòng")
                    || lowerCategory.contains("o-ghep-pass-phong");
        }
        return false;
    }

    @Override
    public List<BulletinBoardSearchResponse> listRoomByAddress(String address) {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findByAddress(address);

        if (bulletinBoards.isEmpty()) {
            throw new AppException(ErrorCode.SEARCH_NOT_FOUND);
        }
        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BulletinBoardSearchResponse> getRooms() {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findAllByIsActive(true);
        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> searchRooms(
            String query,
            String district,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minArea,
            Integer maxArea,
            String rentalCategory) {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.searchActiveBulletinBoards(
                normalizeKeyword(query), normalizeKeyword(district), minPrice, maxPrice, minArea, maxArea);

        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .filter(bulletinBoard -> matchesRentalCategory(bulletinBoard, rentalCategory))
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> getRoomsSortedByPriceASC() {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findAllActiveOrderByPriceAsc();
        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> getRoomsSortedByPriceDESC() {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findAllActiveOrderByPriceDesc();
        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> findAllByDatenew() {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findAllByDatenew(true);
        return bulletinBoards.stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> findAllByIsActive() {
        return bulletinBoardRepository.findAllByIsActiveAsc(true).stream()
                .filter(this::shouldLoadBulletinBoard)
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .collect(Collectors.toList());
    }

    private String normalizeKeyword(String value) {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();
        return trimmedValue.isEmpty() ? null : trimmedValue;
    }

    private boolean matchesRentalCategory(BulletinBoard bulletinBoard, String rentalCategory) {
        String normalizedCategory = normalizeKeyword(rentalCategory);

        if (normalizedCategory == null) {
            return true;
        }

        String sourceCategory = bulletinBoard.getRentalCategory() == null
                ? ""
                : bulletinBoard.getRentalCategory().trim().toLowerCase();

        return switch (normalizedCategory) {
            case "phong-tro-nha-tro" -> sourceCategory.contains("trọ");
            case "ky-tuc-xa-sleepbox" -> sourceCategory.contains("ký túc") || sourceCategory.contains("sleepbox");
            case "nha-cho-thue" -> sourceCategory.contains("nhà nguyên căn");
            case "can-ho-chung-cu" -> sourceCategory.contains("chung cư")
                    || sourceCategory.contains("căn hộ")
                    || sourceCategory.contains("studio");
            case "van-phong" -> sourceCategory.contains("officetel") || sourceCategory.contains("văn phòng");
            case "kho-nha-xuong" -> sourceCategory.contains("kho") || sourceCategory.contains("xưởng");
            case "o-ghep-pass-phong" -> sourceCategory.contains("ở ghép") || sourceCategory.contains("pass phòng");
            default -> sourceCategory.contains(normalizedCategory.toLowerCase());
        };
    }
}
