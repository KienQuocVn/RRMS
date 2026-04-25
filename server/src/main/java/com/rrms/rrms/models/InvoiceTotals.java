package com.rrms.rrms.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceTotals {
    private String username;
    private Double totalRoomPrice;
    private Double totalServicePrice;
    private Double totalInvoice;
}
