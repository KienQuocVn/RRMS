package com.rrms.rrms.dto.response;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.enums.RoomStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    private UUID roomId;
    private UUID motelId;
    private String name;
    private String group;
    private Double price;
    private String prioritize;
    private Integer area;
    private Double deposit;
    private RoomStatus status;
    private String finance;
    private String description;
    private List<RoomServiceResponse> services;
    private ContractResponse latestContract; // Hợp đồng mới nhất
    private RoomReservationResponse roomReservation;
}
