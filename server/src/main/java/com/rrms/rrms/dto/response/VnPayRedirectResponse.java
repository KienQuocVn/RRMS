package com.rrms.rrms.dto.response;

import java.io.Serializable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Response DTO for VNPay payment redirect URL.
 * Renamed from PaymentRestDTO for clarity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayRedirectResponse implements Serializable {
    private String status;
    private String message;
    private String paymentUrl;
}
