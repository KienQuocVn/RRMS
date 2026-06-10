package com.rrms.rrms.dto.response;

import java.io.Serializable;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrokerResponse implements Serializable {
    UUID brokerId;
    UUID motelId;
    String name;
    String phone;
    String source;
    String status;
    int commissionRate;
}
