package com.rrms.rrms.dto.response;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoomServiceDetailResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private UUID roomServiceId;
    private Room room; // Thay vi doi tuong Room, chi tra ve ID
    private MotelService service; // Thay vi doi tuong Service, chi tra ve ID
    private Integer quantity;
}
