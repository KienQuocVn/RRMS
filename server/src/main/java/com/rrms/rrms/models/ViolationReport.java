package com.rrms.rrms.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import com.rrms.rrms.enums.ViolationReportStatus;
import com.rrms.rrms.enums.ViolationResolutionAction;
import com.rrms.rrms.enums.ViolationSubjectType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "violation_reports")
public class ViolationReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "violation_report_id", columnDefinition = "binary(16)", nullable = false, updatable = false)
    private UUID violationReportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_username", nullable = false)
    private Account reporter;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false, columnDefinition = "VARCHAR(50)")
    private ViolationSubjectType subjectType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulletin_board_id")
    private BulletinBoard bulletinBoard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_username")
    private Account reportedAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private BulletinBoardReviews review;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Builder.Default
    private ViolationReportStatus status = ViolationReportStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution_action", columnDefinition = "VARCHAR(50)")
    private ViolationResolutionAction resolutionAction;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "resolved_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime resolvedAt;
}
