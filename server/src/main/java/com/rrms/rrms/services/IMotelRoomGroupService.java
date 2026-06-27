package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.dto.request.MotelRoomGroupRequest;
import com.rrms.rrms.dto.response.MotelRoomGroupResponse;

public interface IMotelRoomGroupService {

    List<MotelRoomGroupResponse> getByMotelId(UUID motelId);

    MotelRoomGroupResponse create(MotelRoomGroupRequest request);

    void delete(UUID roomGroupId);

    void ensureGroupExists(UUID motelId, String groupName);
}
