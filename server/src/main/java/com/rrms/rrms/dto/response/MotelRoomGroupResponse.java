package com.rrms.rrms.dto.response;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MotelRoomGroupResponse {
    UUID roomGroupId;
    UUID motelId;
    String name;
    int sortOrder;
    int roomCount;
}
