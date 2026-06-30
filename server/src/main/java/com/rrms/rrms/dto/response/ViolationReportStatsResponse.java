package com.rrms.rrms.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationReportStatsResponse {
    Integer pending;
    Integer reviewing;
    Integer resolvedToday;
    Integer monthTotal;
}
