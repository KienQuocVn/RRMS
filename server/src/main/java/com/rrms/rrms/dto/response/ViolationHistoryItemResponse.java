package com.rrms.rrms.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationHistoryItemResponse {
    String label;
    String time;
    String color;
}
