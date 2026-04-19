package com.rrms.rrms.models;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Table(
        name = "contract_occupants",
        indexes = {
            @Index(name = "idx_occupant_contract_id", columnList = "contract_id"),
            @Index(name = "idx_occupant_tenant_id", columnList = "tenant_id")
        })
public class ContractOccupant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID contractOccupantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    @JsonBackReference(value = "Contract-Occupants")
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonBackReference(value = "Tenant-Occupants")
    private Tenant tenant;

    @Column(columnDefinition = "DATE")
    private LocalDate moveInDate;

    @Column(columnDefinition = "DATE")
    private LocalDate moveOutDate;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean isActive;
}
