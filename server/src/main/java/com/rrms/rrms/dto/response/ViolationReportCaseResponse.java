package com.rrms.rrms.dto.response;

import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationReportCaseResponse {
    String caseKey;
    String subjectType;
    String subjectTitle;
    String subjectAddress;
    String subjectPrice;
    String subjectImage;
    UUID bulletinBoardId;
    String reportedUsername;
    UUID reviewId;
    String reason;
    String reasonGroup;
    Integer reportCount;
    ViolationReporterResponse lastReporter;
    String timeAgo;
    String createdAtLabel;
    String status;
    String severity;
    String latestContent;
    List<ViolationHistoryItemResponse> reportHistory;
    ViolationCaseStatsResponse stats;
    List<ViolationReporterResponse> reporters;
}
