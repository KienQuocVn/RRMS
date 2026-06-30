package com.rrms.rrms.dto.request;

import com.rrms.rrms.enums.ViolationResolutionAction;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResolveViolationReportRequest {
    String caseKey;
    ViolationResolutionAction action;
    String adminNote;
    String notificationMessage;
    Boolean markSimilarResolved;
    Integer lockDays;
}
