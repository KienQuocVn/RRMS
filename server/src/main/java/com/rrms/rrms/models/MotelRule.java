package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;

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
@Table(name = "motel_rules")
public class MotelRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID motelRuleId;

    @ManyToOne
    @JoinColumn(name = "motel_id")
    private Motel motel;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;
}
