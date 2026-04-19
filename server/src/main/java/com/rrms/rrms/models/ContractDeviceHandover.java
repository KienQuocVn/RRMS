package com.rrms.rrms.models;

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
        name = "contract_device_handovers",
        indexes = {
            @Index(name = "idx_handover_contract_id", columnList = "contract_id"),
            @Index(name = "idx_handover_device_id", columnList = "device_id")
        })
public class ContractDeviceHandover extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID handoverId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    @JsonBackReference(value = "Contract-Handover")
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(columnDefinition = "INT")
    private Integer quantity;

    @Column(name = "condition_on_move_in", columnDefinition = "NVARCHAR(255)")
    private String conditionOnMoveIn; // e.g., 'Tốt', 'Mới 100%'

    @Column(name = "condition_on_move_out", columnDefinition = "NVARCHAR(255)")
    private String conditionOnMoveOut; // e.g., 'Hư hỏng nhẹ'

    @Column(name = "damage_fee", columnDefinition = "DECIMAL(10, 2)")
    private Double damageFee; // Used if broken
}
