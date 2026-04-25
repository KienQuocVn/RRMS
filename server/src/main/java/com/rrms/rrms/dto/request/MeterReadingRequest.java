package com.rrms.rrms.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for creating/updating meter readings.
 * Replaces raw MeterReading entity in controller layer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MeterReadingRequest {
    private UUID roomId;
    private UUID serviceId;
    private Double oldIndex;
    private Double newIndex;
    private LocalDate readingDate;
    private String imageUrl;
}
