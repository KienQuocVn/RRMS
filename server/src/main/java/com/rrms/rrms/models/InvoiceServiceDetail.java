package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "invoice_service_details")
public class InvoiceServiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID detailId;

    @Column(columnDefinition = "VARCHAR(50)")
    private String serviceName;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private Double servicePrice;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private Double consumption;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
}
