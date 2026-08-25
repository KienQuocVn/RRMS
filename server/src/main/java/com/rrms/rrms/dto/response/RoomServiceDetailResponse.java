package com.rrms.rrms.dto.response;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

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
    private UUID roomId;
    private UUID motelServiceId;
    private String serviceName;
    private Double price;
    private String unit;
    private Integer quantity;
}
