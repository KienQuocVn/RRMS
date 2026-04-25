package com.rrms.rrms.dto.request;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for creating a new invoice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceRequest {
    private UUID contractId;
    private String invoiceReason;
    private YearMonth invoiceCreateMonth;
    private LocalDate invoiceCreateDate;
    private List<InvoiceDetailServiceRequest> serviceDetails;
    private List<InvoiceDetailDeviceRequest> deviceDetails;
    private List<InvoiceAdditionItemRequest> additionItems;
}
