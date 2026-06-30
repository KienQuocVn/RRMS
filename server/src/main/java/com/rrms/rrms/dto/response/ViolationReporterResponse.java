package com.rrms.rrms.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationReporterResponse {
    String id;
    String name;
    String initials;
    String reason;
    String timeAgo;
    String avatar;
}
