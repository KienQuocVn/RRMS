package com.rrms.rrms.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Response DTO for meter reading data.
 * Replaces raw MeterReading entity in controller responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MeterReadingResponse {
    private UUID meterReadingId;
    private UUID roomId;
    private String roomName;
    private UUID serviceId;
    private String serviceName;
    private Double oldIndex;
    private Double newIndex;
    private Double usageAmount;
    private LocalDate readingDate;
    private String imageUrl;
}
