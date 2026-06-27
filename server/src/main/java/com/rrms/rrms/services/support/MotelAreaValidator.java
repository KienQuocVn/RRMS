package com.rrms.rrms.services.support;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.rrms.rrms.dto.response.MotelAreaSummaryResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.repositories.RoomRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MotelAreaValidator {

    private final RoomRepository roomRepository;

    public void validateMotelTotalArea(Double area) {
        if (area == null || area <= 0) {
            throw new AppException(
                    ErrorCode.MOTEL_AREA_REQUIRED, "Vui lòng nhập tổng diện tích nhà trọ (theo sổ đỏ) lớn hơn 0 m²");
        }
    }

    public void validateMotelUpdateArea(UUID motelId, Double newArea) {
        validateMotelTotalArea(newArea);
        double usedArea = getUsedArea(motelId);
        if (newArea < usedArea) {
            throw new AppException(
                    ErrorCode.MOTEL_AREA_LESS_THAN_USED_ROOMS,
                    String.format(
                            "Tổng diện tích nhà trọ (%s m²) không được nhỏ hơn tổng diện tích các phòng (%s m²)",
                            formatArea(newArea), formatArea(usedArea)));
        }
    }

    public void validateRoomArea(Motel motel, Integer roomArea, UUID excludeRoomId) {
        if (roomArea == null || roomArea <= 0) {
            throw new AppException(ErrorCode.ROOM_AREA_REQUIRED, "Vui lòng nhập diện tích phòng lớn hơn 0 m²");
        }

        if (motel.getArea() == null || motel.getArea() <= 0) {
            throw new AppException(
                    ErrorCode.MOTEL_AREA_REQUIRED,
                    "Nhà trọ chưa có tổng diện tích. Vui lòng cập nhật diện tích căn nhà (theo sổ đỏ) trước khi thêm phòng");
        }

        double usedArea = excludeRoomId == null
                ? getUsedArea(motel.getMotelId())
                : getUsedAreaExcludingRoom(motel.getMotelId(), excludeRoomId);
        double newTotal = usedArea + roomArea;

        if (newTotal > motel.getArea()) {
            double remaining = motel.getArea() - usedArea;
            throw new AppException(
                    ErrorCode.ROOM_AREA_EXCEEDS_MOTEL,
                    String.format(
                            "Diện tích phòng vượt quá giới hạn. Tổng diện tích nhà: %s m², đã dùng: %s m², còn lại: %s m²",
                            formatArea(motel.getArea()), formatArea(usedArea), formatArea(Math.max(0, remaining))));
        }
    }

    public MotelAreaSummaryResponse buildSummary(Motel motel) {
        double usedArea = getUsedArea(motel.getMotelId());
        Double totalArea = motel.getArea();
        Double remainingArea = totalArea != null && totalArea > 0 ? totalArea - usedArea : null;

        return MotelAreaSummaryResponse.builder()
                .motelId(motel.getMotelId())
                .totalArea(totalArea)
                .usedArea(usedArea)
                .remainingArea(remainingArea)
                .roomCount((int) roomRepository.countByMotelMotelId(motel.getMotelId()))
                .roomsWithAreaCount(roomRepository.countRoomsWithAreaByMotelId(motel.getMotelId()))
                .build();
    }

    public double getUsedArea(UUID motelId) {
        Long sum = roomRepository.sumAreaByMotelId(motelId);
        return sum != null ? sum.doubleValue() : 0D;
    }

    private double getUsedAreaExcludingRoom(UUID motelId, UUID excludeRoomId) {
        Long sum = roomRepository.sumAreaByMotelIdExcludingRoom(motelId, excludeRoomId);
        return sum != null ? sum.doubleValue() : 0D;
    }

    private String formatArea(double value) {
        if (value == Math.rint(value)) {
            return String.valueOf((long) value);
        }
        return String.valueOf(value);
    }
}
