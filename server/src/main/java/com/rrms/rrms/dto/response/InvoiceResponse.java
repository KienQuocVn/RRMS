package com.rrms.rrms.dto.response;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.rrms.rrms.enums.PaymentStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Response DTO for invoice data with calculated totals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceResponse {
    private UUID invoiceId;
    private String invoiceReason;
    private UUID roomId;
    private String roomName;
    private Double roomPrice;
    private YearMonth invoiceCreateMonth;
    private LocalDate invoiceCreateDate;
    private LocalDate dueDate;
    private LocalDate moveinDate;
    private LocalDate moveInDueDate;
    private Double deposit;
    private List<InvoiceServiceDetailResponse> serviceDetails;
    private List<InvoiceDeviceDetailResponse> deviceDetails;
    private List<InvoiceAdditionItemResponse> additionItems;
    private Double totalAmount;
    private PaymentStatus paymentStatus;
    private List<TransactionResponse> transactions = new ArrayList<>();
}
