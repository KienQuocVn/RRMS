package com.rrms.rrms.models;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "payments")
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID paymentId;

    @Column(columnDefinition = "VARCHAR(255)")
    private String paymentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;
}
