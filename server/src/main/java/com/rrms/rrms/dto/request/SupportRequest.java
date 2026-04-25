package com.rrms.rrms.dto.request;

import java.sql.Date;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for creating a support ticket.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SupportRequest {
    private String username;
    private String contactName;
    private String contactPhone;
    private Date dateOfStay;
    private long priceFirst;
    private long priceEnd;
}
