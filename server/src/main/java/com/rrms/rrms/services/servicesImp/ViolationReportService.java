package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.ResolveViolationReportRequest;
import com.rrms.rrms.dto.response.*;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.ViolationReportStatus;
import com.rrms.rrms.enums.ViolationResolutionAction;
import com.rrms.rrms.enums.ViolationSubjectType;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.ViolationReportRepository;
import com.rrms.rrms.services.IBulletinBoard;
import com.rrms.rrms.services.IViolationReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ViolationReportService implements IViolationReportService {

    private static final DateTimeFormatter DATE_TIME_LABEL = DateTimeFormatter.ofPattern("dd/MM/yyyy 'lúc' HH:mm");
    private static final DateTimeFormatter DATE_LABEL = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ViolationReportRepository violationReportRepository;
    private final IBulletinBoard bulletinBoardService;

    @Override
    @Transactional(readOnly = true)
    public List<ViolationReportCaseResponse> getAggregatedCases() {
        List<ViolationReport> reports = violationReportRepository.findAllActiveOrderByCreatedAtDesc();
        Map<String, List<ViolationReport>> grouped = reports.stream()
                .collect(Collectors.groupingBy(this::buildCaseKey, LinkedHashMap::new, Collectors.toList()));

        return grouped.values().stream().map(this::toCaseResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ViolationReportStatsResponse getStats() {
        List<ViolationReportCaseResponse> cases = getAggregatedCases();
        LocalDate today = LocalDate.now();

        return ViolationReportStatsResponse.builder()
                .pending((int) cases.stream()
                        .filter(c -> "Chờ xử lý".equals(c.getStatus()))
                        .count())
                .reviewing((int) cases.stream()
                        .filter(c -> "Đang xem xét".equals(c.getStatus()))
                        .count())
                .resolvedToday((int) cases.stream()
                        .filter(c -> "Đã xử lý".equals(c.getStatus()))
                        .filter(c -> c.getCreatedAtLabel() != null
                                && c.getCreatedAtLabel().startsWith(formatDate(today)))
                        .count())
                .monthTotal((int) cases.stream()
                        .filter(c -> {
                            LocalDateTime createdAt = parseCreatedAtLabel(c.getCreatedAtLabel());
                            return createdAt != null && createdAt.getMonth() == today.getMonth();
                        })
                        .count())
                .build();
    }

    @Override
    public ViolationReportCaseResponse resolveCase(String caseKey, ResolveViolationReportRequest request) {
        if (request == null || request.getAction() == null || caseKey == null || caseKey.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        List<ViolationReport> reports = violationReportRepository.findAllActiveOrderByCreatedAtDesc().stream()
                .filter(report -> caseKey.equals(buildCaseKey(report)))
                .toList();

        if (reports.isEmpty()) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }

        ViolationReportStatus newStatus = request.getAction() == ViolationResolutionAction.IGNORE
                ? ViolationReportStatus.IGNORED
                : ViolationReportStatus.RESOLVED;

        LocalDateTime now = LocalDateTime.now();
        for (ViolationReport report : reports) {
            report.setStatus(newStatus);
            report.setResolutionAction(request.getAction());
            report.setAdminNote(request.getAdminNote());
            report.setResolvedAt(now);
            violationReportRepository.save(report);
        }

        applyResolutionAction(reports.get(0), request);
        return toCaseResponse(reports);
    }

    private void applyResolutionAction(ViolationReport sample, ResolveViolationReportRequest request) {
        switch (request.getAction()) {
            case HIDE -> {
                if (sample.getBulletinBoard() != null) {
                    bulletinBoardService.hideBulletinBoard(
                            sample.getBulletinBoard().getBulletinBoardId());
                }
            }
            case DELETE -> {
                if (sample.getBulletinBoard() != null) {
                    bulletinBoardService.deleteBulletinBoard(
                            sample.getBulletinBoard().getBulletinBoardId());
                }
            }
            case WARN, LOCK, IGNORE -> {
                // Notification/lock flows can be integrated later.
            }
            default -> {}
        }
    }

    private ViolationReportCaseResponse toCaseResponse(List<ViolationReport> reports) {
        reports = reports.stream()
                .sorted(Comparator.comparing(
                        ViolationReport::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        ViolationReport latest = reports.get(0);
        ViolationReport earliest = reports.stream()
                .min(Comparator.comparing(
                        ViolationReport::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(latest);

        int reportCount = reports.size();
        Set<String> uniqueReporterKeys = reports.stream()
                .map(report -> report.getReporter() != null
                        ? report.getReporter().getUsername()
                        : report.getViolationReportId().toString())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<ViolationReporterResponse> reporters =
                reports.stream().map(this::toReporterResponse).toList();

        String status = mapStatusLabel(resolveCaseStatus(reports));
        String reason = latest.getReason();
        LocalDateTime createdAt = earliest.getCreatedAt() != null ? earliest.getCreatedAt() : LocalDateTime.now();

        return ViolationReportCaseResponse.builder()
                .caseKey(buildCaseKey(latest))
                .subjectType(mapSubjectTypeLabel(latest.getSubjectType()))
                .subjectTitle(resolveSubjectTitle(latest))
                .subjectAddress(resolveSubjectAddress(latest))
                .subjectPrice(resolveSubjectPrice(latest))
                .subjectImage(resolveSubjectImage(latest))
                .bulletinBoardId(
                        latest.getBulletinBoard() != null
                                ? latest.getBulletinBoard().getBulletinBoardId()
                                : null)
                .reportedUsername(
                        latest.getReportedAccount() != null
                                ? latest.getReportedAccount().getUsername()
                                : null)
                .reviewId(latest.getReview() != null ? latest.getReview().getBulletinBoardReviewsId() : null)
                .reason(reason)
                .reasonGroup(mapReasonGroup(reason))
                .reportCount(reportCount)
                .lastReporter(reporters.isEmpty() ? null : reporters.get(0))
                .timeAgo(formatTimeAgo(latest.getCreatedAt()))
                .createdAtLabel(formatDateTimeLabel(createdAt))
                .status(status)
                .severity(mapSeverity(reportCount))
                .latestContent(latest.getContent())
                .reportHistory(buildHistory(reports, status))
                .stats(ViolationCaseStatsResponse.builder()
                        .uniqueReporters(uniqueReporterKeys.size())
                        .firstReportedAt(formatDateLabel(earliest.getCreatedAt()))
                        .build())
                .reporters(reporters)
                .build();
    }

    private ViolationReportStatus resolveCaseStatus(List<ViolationReport> reports) {
        boolean hasPending = reports.stream().anyMatch(r -> r.getStatus() == ViolationReportStatus.PENDING);
        if (hasPending) {
            return ViolationReportStatus.PENDING;
        }
        boolean hasReviewing = reports.stream().anyMatch(r -> r.getStatus() == ViolationReportStatus.REVIEWING);
        if (hasReviewing) {
            return ViolationReportStatus.REVIEWING;
        }
        boolean hasResolved = reports.stream().anyMatch(r -> r.getStatus() == ViolationReportStatus.RESOLVED);
        if (hasResolved) {
            return ViolationReportStatus.RESOLVED;
        }
        return ViolationReportStatus.IGNORED;
    }

    private List<ViolationHistoryItemResponse> buildHistory(List<ViolationReport> reports, String statusLabel) {
        ViolationReport earliest = reports.stream()
                .min(Comparator.comparing(
                        ViolationReport::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(reports.get(0));

        List<ViolationHistoryItemResponse> history = new ArrayList<>();
        history.add(ViolationHistoryItemResponse.builder()
                .label("Báo cáo được tạo")
                .time(formatDateTimeLabel(earliest.getCreatedAt()))
                .color("#20a9e7")
                .build());

        reports.stream()
                .filter(report -> report.getStatus() == ViolationReportStatus.REVIEWING)
                .findFirst()
                .ifPresent(report -> history.add(ViolationHistoryItemResponse.builder()
                        .label("Admin đang xem xét")
                        .time(formatDateTimeLabel(
                                report.getUpdatedAt() != null ? report.getUpdatedAt() : report.getCreatedAt()))
                        .color("#BA7517")
                        .build()));

        reports.stream()
                .filter(report -> report.getResolvedAt() != null)
                .max(Comparator.comparing(ViolationReport::getResolvedAt))
                .ifPresent(report -> history.add(ViolationHistoryItemResponse.builder()
                        .label(mapResolutionLabel(report.getResolutionAction(), statusLabel))
                        .time(formatDateTimeLabel(report.getResolvedAt()))
                        .color(report.getStatus() == ViolationReportStatus.IGNORED ? "#5F5E5A" : "#27500A")
                        .build()));

        return history;
    }

    private String buildCaseKey(ViolationReport report) {
        return switch (report.getSubjectType()) {
            case POST -> "POST:"
                    + (report.getBulletinBoard() != null
                            ? report.getBulletinBoard().getBulletinBoardId()
                            : report.getViolationReportId());
            case USER -> "USER:"
                    + (report.getReportedAccount() != null
                            ? report.getReportedAccount().getUsername()
                            : report.getViolationReportId());
            case COMMENT -> "COMMENT:"
                    + (report.getReview() != null
                            ? report.getReview().getBulletinBoardReviewsId()
                            : report.getViolationReportId());
        };
    }

    private ViolationReporterResponse toReporterResponse(ViolationReport report) {
        Account reporter = report.getReporter();
        String name = reporter != null
                ? Optional.ofNullable(reporter.getFullName())
                        .filter(s -> !s.isBlank())
                        .orElse(reporter.getUsername())
                : "Người báo cáo";

        return ViolationReporterResponse.builder()
                .id(report.getViolationReportId().toString())
                .name(name)
                .initials(getInitials(name))
                .reason(report.getReason())
                .timeAgo(formatTimeAgo(report.getCreatedAt()))
                .avatar(reporter != null ? reporter.getAvatar() : null)
                .build();
    }

    private String resolveSubjectTitle(ViolationReport report) {
        return switch (report.getSubjectType()) {
            case POST -> report.getBulletinBoard() != null
                    ? Optional.ofNullable(report.getBulletinBoard().getTitle()).orElse("Bài đăng không có tiêu đề")
                    : "Bài đăng không xác định";
            case USER -> report.getReportedAccount() != null
                    ? report.getReportedAccount().getUsername()
                    : "Người dùng không xác định";
            case COMMENT -> {
                BulletinBoardReviews review = report.getReview();
                if (review != null && review.getBulletinBoard() != null) {
                    yield "Bình luận trong bài \"" + review.getBulletinBoard().getTitle() + "\"";
                }
                yield "Bình luận công khai";
            }
        };
    }

    private String resolveSubjectAddress(ViolationReport report) {
        return switch (report.getSubjectType()) {
            case POST -> report.getBulletinBoard() != null
                    ? Optional.ofNullable(report.getBulletinBoard().getAddress())
                            .orElse("Chưa cập nhật địa chỉ")
                    : "Chưa cập nhật địa chỉ";
            case USER -> report.getReportedAccount() != null
                    ? "Tài khoản "
                            + Optional.ofNullable(report.getReportedAccount().getPhone())
                                    .orElse("chưa xác minh")
                    : "Tài khoản người dùng";
            case COMMENT -> "Bình luận công khai";
        };
    }

    private String resolveSubjectPrice(ViolationReport report) {
        if (report.getSubjectType() != ViolationSubjectType.POST || report.getBulletinBoard() == null) {
            return report.getSubjectType() == ViolationSubjectType.USER ? "Tài khoản xác minh" : "Cần rà soát";
        }

        BulletinBoard board = report.getBulletinBoard();
        BigDecimal price =
                board.getPromotionalRentalPrice() != null ? board.getPromotionalRentalPrice() : board.getRentPrice();
        if (price == null) {
            return "Chưa cập nhật giá";
        }
        return String.format(Locale.forLanguageTag("vi-VN"), "%,.0fđ/tháng", price);
    }

    private String resolveSubjectImage(ViolationReport report) {
        if (report.getSubjectType() != ViolationSubjectType.POST || report.getBulletinBoard() == null) {
            return "";
        }

        return report.getBulletinBoard().getBulletinBoardImages().stream()
                .map(BulletinBoardImage::getImageLink)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("");
    }

    private String mapSubjectTypeLabel(ViolationSubjectType type) {
        return switch (type) {
            case POST -> "Bài đăng";
            case USER -> "Người dùng";
            case COMMENT -> "Bình luận";
        };
    }

    private String mapStatusLabel(ViolationReportStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xử lý";
            case REVIEWING -> "Đang xem xét";
            case RESOLVED -> "Đã xử lý";
            case IGNORED -> "Đã bỏ qua";
        };
    }

    private String mapSeverity(int count) {
        if (count > 10) return "Nghiêm trọng";
        if (count >= 6) return "Cao";
        if (count >= 3) return "Trung bình";
        return "Thấp";
    }

    private String mapReasonGroup(String reason) {
        if (reason == null) return "Khác";
        if (reason.contains("Thông tin") || reason.contains("Giá")) return "Thông tin sai";
        if (reason.contains("Hình ảnh")) return "Hình ảnh";
        if (reason.contains("Spam") || reason.contains("phản cảm")) return "Spam";
        return reason;
    }

    private String mapResolutionLabel(ViolationResolutionAction action, String statusLabel) {
        if ("Đã bỏ qua".equals(statusLabel)) {
            return "Báo cáo bị bỏ qua";
        }
        if (action == null) {
            return "Đã xử lý báo cáo";
        }
        return switch (action) {
            case HIDE -> "Đã ẩn nội dung";
            case DELETE -> "Đã xóa nội dung";
            case WARN -> "Đã cảnh cáo người dùng";
            case LOCK -> "Đã khóa tài khoản";
            case IGNORE -> "Báo cáo bị bỏ qua";
        };
    }

    private String getInitials(String name) {
        String[] words = name.trim().split("\\s+");
        if (words.length == 0) return "VR";
        return Arrays.stream(words)
                .filter(word -> !word.isBlank())
                .map(word -> word.substring(0, 1))
                .reduce((a, b) -> a + b)
                .orElse("VR")
                .toUpperCase(Locale.ROOT);
    }

    private String formatTimeAgo(LocalDateTime value) {
        if (value == null) return "Vừa xong";
        long hours = ChronoUnit.HOURS.between(value, LocalDateTime.now());
        if (hours < 1) return "Vừa xong";
        if (hours < 24) return hours + " giờ trước";
        long days = ChronoUnit.DAYS.between(value.toLocalDate(), LocalDate.now());
        if (days <= 1) return "1 ngày trước";
        return days + " ngày trước";
    }

    private String formatDateTimeLabel(LocalDateTime value) {
        if (value == null) return "";
        return value.format(DATE_TIME_LABEL);
    }

    private String formatDateLabel(LocalDateTime value) {
        if (value == null) return "";
        return value.format(DATE_LABEL);
    }

    private String formatDate(LocalDate value) {
        return value.format(DATE_LABEL);
    }

    private LocalDateTime parseCreatedAtLabel(String label) {
        if (label == null || !label.contains(" lúc ")) return null;
        try {
            return LocalDateTime.parse(label, DATE_TIME_LABEL);
        } catch (Exception ex) {
            return null;
        }
    }
}
