package com.rrms.rrms.services.servicesImp;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.BulletinBoardRequest;
import com.rrms.rrms.dto.response.BulletinBoardResponse;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.dto.response.BulletinBoardTableResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.RoomStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.BulletinBoardMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.BulletinBoardImage;
import com.rrms.rrms.models.BulletinBoardRentalAmenity;
import com.rrms.rrms.models.BulletinBoardRule;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.RentalAmenities;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Rule;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.BulletinBoardImageRepository;
import com.rrms.rrms.repositories.BulletinBoardRentalAmenityRepository;
import com.rrms.rrms.repositories.BulletinBoardRepository;
import com.rrms.rrms.repositories.BulletinBoardRuleRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.RentalAmenitiesRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RuleRepository;
import com.rrms.rrms.services.IBulletinBoard;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED)
@Slf4j
public class BulletinBoardService implements IBulletinBoard {

    BulletinBoardRepository bulletinBoardRepository;
    BulletinBoardImageRepository bulletinBoardImageRepository;
    BulletinBoardRuleRepository bulletinBoardRuleRepository;
    BulletinBoardRentalAmenityRepository bulletinBoardRentalAmenityRepository;
    RentalAmenitiesRepository rentalAmenitiesRepository;
    RuleRepository ruleRepository;
    AccountRepository accountRepository;
    MotelRepository motelRepository;
    RoomRepository roomRepository;
    BulletinBoardMapper bulletinBoardMapper;

    @Override
    public List<BulletinBoardResponse> getAllBulletinBoards() {
        return bulletinBoardRepository.findAllWithDetails().stream()
                .map(bulletinBoardMapper::toBulletinBoardResponse)
                .toList();
    }

    @Override
    public BulletinBoardResponse getBulletinBoardById(UUID id) {
        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(id));
    }

    @Override
    public BulletinBoardResponse createBulletinBoard(BulletinBoardRequest bulletinBoardRequest) {
        Account account = accountRepository
                .findByUsername(bulletinBoardRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        BulletinBoard bulletinBoard = bulletinBoardMapper.toBulletinBoard(bulletinBoardRequest);
        bulletinBoard.setAccount(account);
        applyApprovalStateOnCreate(bulletinBoard);
        applyRoomAndMotelReferences(bulletinBoard, bulletinBoardRequest);
        bulletinBoard = bulletinBoardRepository.save(bulletinBoard);

        saveImages(bulletinBoard, bulletinBoardRequest.getBulletinBoardImages());
        saveRules(bulletinBoard, bulletinBoardRequest.getBulletinBoardRules());
        saveRentalAmenities(bulletinBoard, bulletinBoardRequest.getBulletinBoardRentalAmenities());

        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(bulletinBoard.getBulletinBoardId()));
    }

    @Override
    public BulletinBoardResponse updateBulletinBoard(UUID bulletinBoardId, BulletinBoardRequest bulletinBoardRequest) {
        BulletinBoard bulletinBoard = bulletinBoardRepository
                .findById(bulletinBoardId)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));
        log.debug("Updating bulletin board id: {}", bulletinBoard.getBulletinBoardId());

        bulletinBoardMapper.updateBulletinBoardFromRequest(bulletinBoardRequest, bulletinBoard);
        applyApprovalStateOnUpdate(bulletinBoard);
        applyRoomAndMotelReferences(bulletinBoard, bulletinBoardRequest);
        bulletinBoardRepository.save(bulletinBoard);

        if (bulletinBoardRequest.getBulletinBoardImages() != null) {
            bulletinBoardImageRepository.deleteAllByBulletinBoard(bulletinBoard);
            saveImages(bulletinBoard, bulletinBoardRequest.getBulletinBoardImages());
        }

        if (bulletinBoardRequest.getBulletinBoardRules() != null) {
            bulletinBoardRuleRepository.deleteAllByBulletinBoard(bulletinBoard);
            saveRules(bulletinBoard, bulletinBoardRequest.getBulletinBoardRules());
        }

        if (bulletinBoardRequest.getBulletinBoardRentalAmenities() != null) {
            bulletinBoardRentalAmenityRepository.deleteAllByBulletinBoard(bulletinBoard);
            saveRentalAmenities(bulletinBoard, bulletinBoardRequest.getBulletinBoardRentalAmenities());
        }

        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(bulletinBoardId));
    }

    @Override
    public List<BulletinBoardTableResponse> getBulletinBoardTable(String username) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findByAccount(account);
        return bulletinBoards.stream()
                .map(bulletinBoardMapper::toBulletinBoardTableResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardResponse> getBulletinBoard() {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findAllByIsActive(false);
        return bulletinBoards.stream()
                .map(bulletinBoardMapper::toBulletinBoardResponse)
                .toList();
    }

    @Override
    public List<BulletinBoardSearchResponse> searchBulletinBoards(String address) {
        List<BulletinBoard> bulletinBoards = bulletinBoardRepository.findByAddress(address);
        return bulletinBoards.stream()
                .map(bulletinBoardMapper::toBulletinBoardSearchResponse)
                .toList();
    }

    @Override
    public BulletinBoardResponse approveBulletinBoard(UUID id) {
        BulletinBoard bulletinBoard = bulletinBoardRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));

        if (Boolean.TRUE.equals(bulletinBoard.getIsActive())) {
            throw new AppException(ErrorCode.BULLETIN_BOARD_ALREADY_APPROVED);
        }

        bulletinBoard.setIsActive(true);
        bulletinBoard.setRejectionReason(null);
        bulletinBoard.setIsHidden(false);
        bulletinBoardRepository.save(bulletinBoard);
        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(id));
    }

    @Override
    public BulletinBoardResponse rejectBulletinBoard(UUID id, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        BulletinBoard bulletinBoard = bulletinBoardRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));

        bulletinBoard.setIsActive(false);
        bulletinBoard.setStatus(false);
        bulletinBoard.setRejectionReason(reason.trim());
        bulletinBoardRepository.save(bulletinBoard);
        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(id));
    }

    @Override
    public BulletinBoardResponse hideBulletinBoard(UUID id) {
        BulletinBoard bulletinBoard = bulletinBoardRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));

        if (Boolean.TRUE.equals(bulletinBoard.getIsHidden())) {
            throw new AppException(ErrorCode.BULLETIN_BOARD_ALREADY_HIDDEN);
        }

        bulletinBoard.setIsHidden(true);
        bulletinBoard.setStatus(false);
        bulletinBoardRepository.save(bulletinBoard);
        return bulletinBoardMapper.toBulletinBoardResponse(reloadBulletinBoard(id));
    }

    public void deleteBulletinBoard(UUID id) {
        bulletinBoardRepository.deleteById(id);
    }

    @Override
    public BulletinBoardSearchResponse findByBulletinBoardId(UUID id) {
        return bulletinBoardMapper.toBulletinBoardSearchResponse(bulletinBoardRepository.findByBulletinBoardId(id));
    }

    private void saveImages(BulletinBoard bulletinBoard, List<BulletinBoardImage> images) {
        for (BulletinBoardImage image : safeList(images)) {
            if (image == null || image.getImageLink() == null) {
                continue;
            }

            BulletinBoardImage bulletinBoardImage = new BulletinBoardImage();
            bulletinBoardImage.setBulletinBoard(bulletinBoard);
            bulletinBoardImage.setImageLink(image.getImageLink());
            bulletinBoardImageRepository.save(bulletinBoardImage);
        }
    }

    private void saveRules(BulletinBoard bulletinBoard, List<BulletinBoardRule> bulletinBoardRules) {
        for (BulletinBoardRule bulletinRule : safeList(bulletinBoardRules)) {
            if (bulletinRule == null) {
                continue;
            }

            Rule rule = bulletinRule.getRule();
            if (rule != null) {
                rule = ruleRepository.save(rule);
            } else {
                rule = ruleRepository.save(new Rule());
            }

            BulletinBoardRule bulletinBoardRule = new BulletinBoardRule();
            bulletinBoardRule.setBulletinBoard(bulletinBoard);
            bulletinBoardRule.setRule(rule);
            bulletinBoardRuleRepository.save(bulletinBoardRule);
        }
    }

    private void saveRentalAmenities(
            BulletinBoard bulletinBoard, List<BulletinBoardRentalAmenity> bulletinBoardRentalAmenities) {
        for (BulletinBoardRentalAmenity rentalAmenity : safeList(bulletinBoardRentalAmenities)) {
            if (rentalAmenity == null
                    || rentalAmenity.getRentalAmenities() == null
                    || rentalAmenity.getRentalAmenities().getName() == null) {
                continue;
            }

            Optional<RentalAmenities> rentalAmenitiesOptional = rentalAmenitiesRepository.findByName(
                    rentalAmenity.getRentalAmenities().getName());

            RentalAmenities rentalAmenities;
            if (rentalAmenitiesOptional.isPresent()) {
                rentalAmenities = rentalAmenitiesOptional.get();
            } else {
                rentalAmenities = new RentalAmenities();
                rentalAmenities.setName(rentalAmenity.getRentalAmenities().getName());
                rentalAmenities = rentalAmenitiesRepository.save(rentalAmenities);
            }

            BulletinBoardRentalAmenity bulletinBoardRentalAmenity = new BulletinBoardRentalAmenity();
            bulletinBoardRentalAmenity.setBulletinBoard(bulletinBoard);
            bulletinBoardRentalAmenity.setRentalAmenities(rentalAmenities);
            bulletinBoardRentalAmenityRepository.save(bulletinBoardRentalAmenity);
        }
    }

    private void applyApprovalStateOnCreate(BulletinBoard bulletinBoard) {
        if (isCurrentUserAdmin()) {
            if (bulletinBoard.getIsActive() == null) {
                bulletinBoard.setIsActive(true);
            }
            return;
        }

        bulletinBoard.setIsActive(false);
    }

    private void applyApprovalStateOnUpdate(BulletinBoard bulletinBoard) {
        if (isCurrentUserAdmin()) {
            return;
        }

        bulletinBoard.setIsActive(false);
    }

    private boolean isCurrentUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    private BulletinBoard reloadBulletinBoard(UUID bulletinBoardId) {
        return bulletinBoardRepository
                .findById(bulletinBoardId)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));
    }

    private void applyRoomAndMotelReferences(BulletinBoard bulletinBoard, BulletinBoardRequest bulletinBoardRequest) {
        Room room = null;
        if (bulletinBoardRequest.getRoomId() != null) {
            room = roomRepository
                    .findById(bulletinBoardRequest.getRoomId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        }

        Motel motel = null;
        if (bulletinBoardRequest.getMotelId() != null) {
            motel = motelRepository
                    .findById(bulletinBoardRequest.getMotelId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        }

        if (room != null) {
            validateRoomAvailableForPosting(room);
            Motel roomMotel = room.getMotel();
            if (motel != null && roomMotel != null && !roomMotel.getMotelId().equals(motel.getMotelId())) {
                throw new IllegalArgumentException("Room does not belong to the provided motel");
            }
            motel = roomMotel;
        }

        if (motel == null) {
            motel = inferMotelFromBulletinBoard(bulletinBoard);
        }

        if (room == null && motel != null) {
            room = inferRoomFromBulletinBoard(bulletinBoard, motel);
        }

        bulletinBoard.setRoom(room);
        bulletinBoard.setMotel(motel);
    }

    private Motel inferMotelFromBulletinBoard(BulletinBoard bulletinBoard) {
        if (bulletinBoard.getAccount() == null
                || bulletinBoard.getAccount().getUsername() == null
                || bulletinBoard.getAddress() == null
                || bulletinBoard.getAddress().isBlank()) {
            return null;
        }

        return motelRepository
                .findMotelByAccount_Username(bulletinBoard.getAccount().getUsername())
                .stream()
                .filter(motel -> motel.getAddress() != null)
                .filter(motel -> matchesAddress(motel.getAddress(), bulletinBoard.getAddress()))
                .findFirst()
                .orElse(null);
    }

    private Room inferRoomFromBulletinBoard(BulletinBoard bulletinBoard, Motel motel) {
        List<Room> candidateRooms = roomRepository.findByMotel(motel).stream()
                .filter(room -> room.getPrice() != null && bulletinBoard.getRentPrice() != null)
                .filter(room -> Objects.equals(room.getArea(), bulletinBoard.getArea()))
                .filter(room ->
                        Math.abs(room.getPrice() - bulletinBoard.getRentPrice().doubleValue()) < 1.0)
                .toList();

        if (candidateRooms.size() == 1) {
            return candidateRooms.get(0);
        }

        return null;
    }

    private void validateRoomAvailableForPosting(Room room) {
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new AppException(ErrorCode.ROOM_NOT_AVAILABLE);
        }
    }

    private boolean matchesAddress(String left, String right) {
        String normalizedLeft = left.trim().toLowerCase();
        String normalizedRight = right.trim().toLowerCase();
        return normalizedLeft.equals(normalizedRight)
                || normalizedLeft.contains(normalizedRight)
                || normalizedRight.contains(normalizedLeft);
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? Collections.emptyList() : values;
    }
}
