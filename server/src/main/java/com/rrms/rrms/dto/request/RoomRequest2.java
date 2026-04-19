package com.rrms.rrms.dto.request;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest2 {
    private UUID motelId;
    private String name;
    private String group;
    private Double price;
    private String prioritize;
    private Integer area;
    private Double deposit;
    private Boolean status;
    private String finance;
    private String description;
}
