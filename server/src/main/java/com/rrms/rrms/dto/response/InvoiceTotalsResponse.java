package com.rrms.rrms.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Response DTO for invoice totals summary.
 * Moved from models package — this is a DTO, not a JPA entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceTotalsResponse {
    private String username;
    private Double totalRoomPrice;
    private Double totalServicePrice;
    private Double totalInvoice;
}
