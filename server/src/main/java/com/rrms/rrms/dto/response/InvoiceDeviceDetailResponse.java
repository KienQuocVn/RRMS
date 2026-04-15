package com.rrms.rrms.dto.response;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDeviceDetailResponse {
    private UUID roomDeviceId;
    private String deviceName;
    private Double devicePrice;
    private Double quantity;
    private Double totalPrice;
}
