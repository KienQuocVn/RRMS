package com.rrms.rrms.dto.request;

import java.util.UUID;

import com.rrms.rrms.enums.ViolationSubjectType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateViolationReportRequest {
    /** Username của người báo cáo (lấy từ JWT trên server, field này optional) */
    String reporterUsername;

    ViolationSubjectType subjectType;

    /** ID bài đăng (khi subjectType = POST) */
    UUID bulletinBoardId;

    /** Username bị báo cáo (khi subjectType = USER) */
    String reportedUsername;

    /** ID bình luận (khi subjectType = COMMENT) */
    UUID reviewId;

    /** Lý do ngắn gọn, ví dụ: "Lừa đảo", "Thông tin sai", ... */
    String reason;

    /** Mô tả chi tiết từ người báo cáo */
    String content;
}
