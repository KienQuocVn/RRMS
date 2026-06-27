package com.rrms.rrms.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.MotelRoomGroup;

public interface MotelRoomGroupRepository extends JpaRepository<MotelRoomGroup, UUID> {

    List<MotelRoomGroup> findByMotelMotelIdOrderBySortOrderAscNameAsc(UUID motelId);

    boolean existsByMotelMotelIdAndNameIgnoreCase(UUID motelId, String name);

    Optional<MotelRoomGroup> findByRoomGroupIdAndMotelMotelId(UUID roomGroupId, UUID motelId);
}
