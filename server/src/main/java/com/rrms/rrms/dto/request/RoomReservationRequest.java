package com.rrms.rrms.dto.request;

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
public class RoomReservationRequest {
    Date createDate;
    Date moveInDate;
    String nameTenant;
    String phoneTenant;
    Double deposit;
    String note;
    ContractStatus status; // Status of the contract (ACTIVE, ENDED, etc.)
    UUID roomId; // Liên kết tới Room
}
