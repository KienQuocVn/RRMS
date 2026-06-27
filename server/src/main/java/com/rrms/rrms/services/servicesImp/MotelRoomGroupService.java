package com.rrms.rrms.services.servicesImp;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.MotelRoomGroupRequest;
import com.rrms.rrms.dto.response.MotelRoomGroupResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelRoomGroup;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.MotelRoomGroupRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.services.IMotelRoomGroupService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MotelRoomGroupService implements IMotelRoomGroupService {

    private static final Map<String, String> LEGACY_GROUP_LABELS = Map.of("a", "Tầng trệt", "b", "Lầu 1");

    private final MotelRoomGroupRepository motelRoomGroupRepository;
    private final MotelRepository motelRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MotelRoomGroupResponse> getByMotelId(UUID motelId) {
        Motel motel = getMotelOrThrow(motelId);
        List<MotelRoomGroup> groups = motelRoomGroupRepository.findByMotelMotelIdOrderBySortOrderAscNameAsc(motelId);

        if (groups.isEmpty()) {
            syncFromRooms(motel);
            groups = motelRoomGroupRepository.findByMotelMotelIdOrderBySortOrderAscNameAsc(motelId);
        }

        List<Room> rooms = roomRepository.findByMotelMotelId(motelId);
        List<MotelRoomGroupResponse> responses = new ArrayList<>();
        for (MotelRoomGroup group : groups) {
            responses.add(mapToResponse(group, countRoomsForGroup(rooms, group.getName())));
        }

        responses.sort(
                Comparator.comparingInt((MotelRoomGroupResponse response) -> getFloorSortOrder(response.getName()))
                        .thenComparing(MotelRoomGroupResponse::getName, String.CASE_INSENSITIVE_ORDER));

        return responses;
    }

    @Override
    @Transactional
    public MotelRoomGroupResponse create(MotelRoomGroupRequest request) {
        if (request.getMotelId() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Motel ID không hợp lệ");
        }

        String name = normalizeGroupName(request.getName());
        if (name.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Tên tầng không được để trống");
        }

        Motel motel = getMotelOrThrow(request.getMotelId());
        if (motelRoomGroupRepository.existsByMotelMotelIdAndNameIgnoreCase(motel.getMotelId(), name)) {
            throw new AppException(ErrorCode.ROOM_GROUP_ALREADY_EXISTS, "Tầng đã tồn tại");
        }

        int nextSortOrder =
                motelRoomGroupRepository.findByMotelMotelIdOrderBySortOrderAscNameAsc(motel.getMotelId()).stream()
                                .mapToInt(MotelRoomGroup::getSortOrder)
                                .max()
                                .orElse(-1)
                        + 1;

        MotelRoomGroup saved = motelRoomGroupRepository.save(MotelRoomGroup.builder()
                .motel(motel)
                .name(name)
                .sortOrder(nextSortOrder)
                .build());

        return mapToResponse(saved, 0);
    }

    @Override
    @Transactional
    public void delete(UUID roomGroupId) {
        MotelRoomGroup group = motelRoomGroupRepository
                .findById(roomGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_GROUP_NOT_FOUND));

        List<Room> rooms = roomRepository.findByMotelMotelId(group.getMotel().getMotelId());
        long roomCount = countRoomsForGroup(rooms, group.getName());

        if (roomCount > 0) {
            throw new AppException(
                    ErrorCode.ROOM_GROUP_HAS_ROOMS,
                    "Không thể xóa tầng \"" + group.getName() + "\" vì đang có " + roomCount + " phòng");
        }

        motelRoomGroupRepository.delete(group);
    }

    @Override
    @Transactional
    public void ensureGroupExists(UUID motelId, String groupName) {
        String name = normalizeGroupName(groupName);
        if (name.isBlank()) {
            return;
        }

        if (!motelRoomGroupRepository.existsByMotelMotelIdAndNameIgnoreCase(motelId, name)) {
            create(MotelRoomGroupRequest.builder().motelId(motelId).name(name).build());
        }
    }

    private void syncFromRooms(Motel motel) {
        List<Room> rooms = roomRepository.findByMotelMotelId(motel.getMotelId());
        Set<String> seen = new LinkedHashSet<>();
        int order = 0;

        for (Room room : rooms) {
            String normalized = normalizeGroupName(room.getGroup());
            if (!normalized.isBlank() && seen.add(normalized.toLowerCase(Locale.ROOT))) {
                motelRoomGroupRepository.save(MotelRoomGroup.builder()
                        .motel(motel)
                        .name(normalized)
                        .sortOrder(order++)
                        .build());
            }
        }
    }

    private long countRoomsForGroup(List<Room> rooms, String groupName) {
        String normalizedTarget = normalizeGroupName(groupName).toLowerCase(Locale.ROOT);
        return rooms.stream()
                .filter(room -> normalizeGroupName(room.getGroup())
                        .toLowerCase(Locale.ROOT)
                        .equals(normalizedTarget))
                .count();
    }

    private int getFloorSortOrder(String groupName) {
        String normalized = normalizeGroupName(groupName).toLowerCase(Locale.ROOT);
        if (normalized.contains("trệt")) {
            return 0;
        }

        java.util.regex.Matcher matcher =
                java.util.regex.Pattern.compile("(?:tầng|lầu)\\s*(\\d+)").matcher(normalized);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }

        return 1000;
    }

    private Motel getMotelOrThrow(UUID motelId) {
        return motelRepository.findById(motelId).orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
    }

    private String normalizeGroupName(String group) {
        if (group == null) {
            return "";
        }
        String trimmed = group.trim();
        return LEGACY_GROUP_LABELS.getOrDefault(trimmed, trimmed);
    }

    private MotelRoomGroupResponse mapToResponse(MotelRoomGroup group, long roomCount) {
        return MotelRoomGroupResponse.builder()
                .roomGroupId(group.getRoomGroupId())
                .motelId(group.getMotel().getMotelId())
                .name(group.getName())
                .sortOrder(group.getSortOrder())
                .roomCount(Math.toIntExact(roomCount))
                .build();
    }
}
