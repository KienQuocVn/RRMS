package com.rrms.rrms.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardResponse {
    private String customerName;

    // Room Info
    private String roomStatus;
    private String roomCode;
    private String roomAddress;
    private String roomArea;
    private String roomFloor;
    private String roomPrice;
    private String hostName;

    // Invoice Info
    private String invoiceAmount;
    private String invoiceStatus;
    private String invoiceDue;
    private String invoiceMonth;
    private Boolean isInvoicePaid;
    private List<InvoiceItemResponse> invoiceItems;
    private String invoiceTotal;

    // Contract Info
    private String contractMonths;
    private String contractExpiry;

    // Posts Info (set undefined / null for future implementation)
    private Object myPosts;
}
