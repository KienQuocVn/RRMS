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
        name = "meter_readings",
        indexes = {
            @Index(name = "idx_meter_room_id", columnList = "room_id"),
            @Index(name = "idx_meter_service_id", columnList = "service_id")
        })
public class MeterReading extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID meterReadingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonBackReference(value = "Room-MeterReading")
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    @JsonBackReference(value = "Service-MeterReading")
    private Service service;

    @Column(name = "old_index", columnDefinition = "DECIMAL(10, 3)")
    private Double oldIndex;

    @Column(name = "new_index", columnDefinition = "DECIMAL(10, 3)")
    private Double newIndex;

    @Column(name = "usage_amount", columnDefinition = "DECIMAL(10, 3)")
    private Double usageAmount;

    @Column(name = "reading_date", columnDefinition = "DATE")
    private LocalDate readingDate;

    @Column(name = "image_url", columnDefinition = "VARCHAR(255)")
    private String imageUrl; // Proof of reading
}
