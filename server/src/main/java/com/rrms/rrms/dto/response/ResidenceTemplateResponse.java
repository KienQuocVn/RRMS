package com.rrms.rrms.dto.response;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidenceTemplateResponse {
    private UUID residenceTemplateId;
    private UUID motelId;
    private String templatename;
    private int sortOrder;
    private String content;
}
