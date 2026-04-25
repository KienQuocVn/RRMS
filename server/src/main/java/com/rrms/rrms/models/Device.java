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
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID deviceId;

    @Column(columnDefinition = "VARCHAR(255)")
    private String deviceName;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean available;
}
