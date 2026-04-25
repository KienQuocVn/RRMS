package com.rrms.rrms.dto.response;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Response DTO for support ticket data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportResponse {
    private UUID supportId;
    private AccountResponse account;
    private String contactName;
    private String contactPhone;
    private Date dateOfStay;
    private LocalDateTime createdAt;
    private long priceFirst;
    private long priceEnd;
}
