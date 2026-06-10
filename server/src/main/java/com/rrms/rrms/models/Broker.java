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
@Table(name = "brokers")
public class Broker {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID brokerId;

    private String name;
    private String phone;
    private String source;
    private UUID motelId;
    private int commissionRate;
}
