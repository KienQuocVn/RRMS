package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "rules")
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "rule_id")
    private UUID ruleId;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String ruleName;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private long price;
}
