package com.rrms.rrms.dto.response;

import java.util.Date;
import java.util.UUID;

import com.rrms.rrms.enums.ContractStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomReservationResponse {
    UUID roomReservationId;
    Date createDate;
    Date moveInDate;
    String nameTenant;
    String phoneTenant;
    Double deposit;
    String note;
    ContractStatus status; // Status of the contract (ACTIVE, ENDED, etc.)
    RoomResponse2 room; // Trả về đối tượng Room
}
