package com.rrms.rrms.database.seed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.rrms.rrms.enums.ViolationReportStatus;
import com.rrms.rrms.enums.ViolationResolutionAction;
import com.rrms.rrms.enums.ViolationSubjectType;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.BulletinBoardImage;
import com.rrms.rrms.models.BulletinBoardRentalAmenity;
import com.rrms.rrms.models.BulletinBoardReviews;
import com.rrms.rrms.models.BulletinBoardRule;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.RentalAmenities;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Rule;
import com.rrms.rrms.models.ViolationReport;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.BulletinBoardImageRepository;
import com.rrms.rrms.repositories.BulletinBoardRentalAmenityRepository;
import com.rrms.rrms.repositories.BulletinBoardRepository;
import com.rrms.rrms.repositories.BulletinBoardReviewsRepository;
import com.rrms.rrms.repositories.BulletinBoardRuleRepository;
import com.rrms.rrms.repositories.RentalAmenitiesRepository;
import com.rrms.rrms.repositories.RuleRepository;
import com.rrms.rrms.repositories.ViolationReportRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;

/**
 * MarketplaceSeeder - Seed dữ liệu thị trường bài đăng:
 * BulletinBoard, BulletinBoardImage, Rule, RentalAmenities, BulletinBoardReviews,
 * ViolationReport và Favorites.
 * Thứ tự chạy: 6 (sau OperationSeeder)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MarketplaceSeeder {

    private final BulletinBoardRepository bulletinBoardRepository;
    private final BulletinBoardImageRepository bulletinBoardImageRepository;
    private final BulletinBoardReviewsRepository bulletinBoardReviewsRepository;
    private final RuleRepository ruleRepository;
    private final BulletinBoardRuleRepository bulletinBoardRuleRepository;
    private final RentalAmenitiesRepository rentalAmenitiesRepository;
    private final BulletinBoardRentalAmenityRepository bulletinBoardRentalAmenityRepository;
    private final ViolationReportRepository violationReportRepository;
    private final AccountRepository accountRepository;

    // ── Bulletin Boards ───────────────────────────────────────────────────────

    public List<BulletinBoard> seedBulletinBoards(
            List<Room> rooms,
            Account host,
            Account customer,
            List<PropertySeeder.MotelSeedSpec> motelSeedSpecs,
            int[] imageIndexRef) {
        log.info("[MarketplaceSeeder] Seeding BulletinBoards...");
        Faker f = new Faker(new Locale("vi"));
        List<String> defaultAmenities =
                List.of("Wifi tốc độ cao", "Máy lạnh", "Giữ xe", "Máy giặt", "Giờ giấc linh hoạt");
        List<String> defaultRules = List.of(
                "Không làm ồn sau 22h",
                "Giữ gìn vệ sinh khu sinh hoạt chung",
                "Không nuôi thú cưng kích thước lớn",
                "Thông báo trước khi chuyển phòng");
        List<BulletinBoard> seededBoards = new ArrayList<>();

        for (int i = 0; i < rooms.size(); i++) {
            Room room = rooms.get(i);
            Motel motel = room.getMotel();
            PropertySeeder.MotelSeedSpec seedSpec = motelSeedSpecs.stream()
                    .filter(spec -> spec.motelName().equals(motel.getMotelName()))
                    .findFirst()
                    .orElse(null);

            BigDecimal rentPrice = BigDecimal.valueOf(room.getPrice());
            BigDecimal promotionalPrice =
                    i % 3 == 0 ? null : rentPrice.subtract(BigDecimal.valueOf(150000L + (i % 3) * 50000L));

            String rentalCategory;
            String roomName = room.getName();
            int roomNum = 7;
            try {
                roomNum = Integer.parseInt(roomName.substring(roomName.length() - 2));
            } catch (Exception e) {
                // fallback
            }

            if (roomNum == 1) {
                // Room 1 (Đang ở) -> Test chuyên mục Ở ghép / Pass phòng
                if (i % 2 == 0) {
                    rentalCategory = "Ở ghép";
                } else {
                    rentalCategory = "Pass phòng";
                }
            } else {
                // Các phòng còn lại 2, 3, 4, 5, 6, 7 (báo kết thúc, sắp hết hạn, quá hạn, cọc, nợ, trống) -> Gán loại
                // nhà bình thường
                rentalCategory = switch (i % 4) {
                    case 0 -> "Phòng trọ, nhà trọ";
                    case 1 -> "Chung cư";
                    case 2 -> "Căn hộ dịch vụ";
                    default -> "Ký túc xá";};
            }

            BulletinBoard bb = BulletinBoard.builder()
                    .account(host)
                    .motel(motel)
                    .room(room)
                    .title(room.getName() + " - " + motel.getMotelName())
                    .rentalCategory(rentalCategory)
                    .description(buildDescription(seedSpec, room))
                    .address(motel.getAddress())
                    .build();
            bb.setRentPrice(rentPrice);
            bb.setPromotionalRentalPrice(promotionalPrice);
            bb.setDeposit(BigDecimal.valueOf(room.getDeposit()));
            bb.setArea(room.getArea());
            bb.setElectricityPrice(BigDecimal.valueOf(3500 + (i % 3) * 200L));
            bb.setWaterPrice(BigDecimal.valueOf(16000 + (i % 4) * 1000L));
            bb.setMaxPerson(String.valueOf(Math.max(2, motel.getMaxperson() - (i % 2))));
            bb.setMoveInDate(LocalDate.now().plusDays(i % 4));
            bb.setOpeningHours("05:30");
            bb.setCloseHours("23:30");
            bb.setLongitude(motel.getLongitude());
            bb.setLatitude(motel.getLatitude());
            applyBoardState(bb, i);
            bb = bulletinBoardRepository.save(bb);
            seededBoards.add(bb);

            // Images
            for (int img = 0; img < 3; img++) {
                bulletinBoardImageRepository.save(new BulletinBoardImage(
                        UUID.randomUUID(), bb, "https://picsum.photos/800/600?random=" + (++imageIndexRef[0])));
            }

            // Rules
            for (String ruleName : defaultRules.subList(0, 2 + (i % 2))) {
                Rule r = ruleRepository.save(
                        Rule.builder().ruleName(ruleName).price(0L).build());
                bulletinBoardRuleRepository.save(
                        BulletinBoardRule.builder().bulletinBoard(bb).rule(r).build());
            }

            // Amenities
            for (String amenityName : defaultAmenities.subList(0, 3 + (i % 2))) {
                RentalAmenities ra = rentalAmenitiesRepository.save(
                        RentalAmenities.builder().name(amenityName + " " + i).build());
                bulletinBoardRentalAmenityRepository.save(new BulletinBoardRentalAmenity(UUID.randomUUID(), ra, bb));
            }

            // Reviews
            int reviewCount = 1 + (i % 3);
            for (int rv = 0; rv < reviewCount; rv++) {
                bulletinBoardReviewsRepository.save(BulletinBoardReviews.builder()
                        .account(customer)
                        .bulletinBoard(bb)
                        .rating(4 + (rv % 2))
                        .content(buildReviewComment(f, motel, rv))
                        .build());
            }
        }
        return seededBoards;
    }

    // ── Violation Reports ─────────────────────────────────────────────────────

    public void seedViolationReports(
            List<BulletinBoard> bulletinBoards, Account host, Account customer, Account employee) {
        log.info("[MarketplaceSeeder] Seeding ViolationReports...");
        if (bulletinBoards.isEmpty()) return;

        List<BulletinBoardReviews> reviews = bulletinBoardReviewsRepository.findAll();
        BulletinBoard pendingBoard = bulletinBoards.stream()
                .filter(b -> Boolean.FALSE.equals(b.getIsActive()))
                .findFirst()
                .orElse(bulletinBoards.get(0));
        BulletinBoard rejectedBoard = bulletinBoards.stream()
                .filter(b -> b.getRejectionReason() != null)
                .findFirst()
                .orElse(bulletinBoards.get(1));
        BulletinBoard hiddenBoard = bulletinBoards.stream()
                .filter(b -> Boolean.TRUE.equals(b.getIsHidden()))
                .findFirst()
                .orElse(bulletinBoards.get(2));
        BulletinBoard approvedBoard = bulletinBoards.stream()
                .filter(b -> Boolean.TRUE.equals(b.getIsActive()) && !Boolean.TRUE.equals(b.getIsHidden()))
                .findFirst()
                .orElse(bulletinBoards.get(3));
        BulletinBoardReviews commentReview = reviews.isEmpty() ? null : reviews.get(0);

        List<ViolationReportSeedSpec> specs = new ArrayList<>(List.of(
                new ViolationReportSeedSpec(
                        customer,
                        ViolationSubjectType.POST,
                        pendingBoard,
                        null,
                        null,
                        "Lừa đảo",
                        "Bài đăng yêu cầu chuyển cọc trước nhưng không cung cấp giấy tờ xác minh.",
                        ViolationReportStatus.PENDING,
                        2),
                new ViolationReportSeedSpec(
                        employee,
                        ViolationSubjectType.POST,
                        pendingBoard,
                        null,
                        null,
                        "Thông tin sai lệch",
                        "Giá trong bài thấp hơn nhiều so với giá báo khi gọi điện.",
                        ViolationReportStatus.PENDING,
                        5),
                new ViolationReportSeedSpec(
                        customer,
                        ViolationSubjectType.POST,
                        pendingBoard,
                        null,
                        null,
                        "Spam",
                        "Người đăng liên tục thay đổi nội dung trao đổi sau khi liên hệ.",
                        ViolationReportStatus.REVIEWING,
                        8),
                new ViolationReportSeedSpec(
                        employee,
                        ViolationSubjectType.POST,
                        rejectedBoard,
                        null,
                        null,
                        "Hình ảnh không phù hợp",
                        "Hình ảnh trong bài là ảnh từ nguồn khác, không đúng với phòng thực tế.",
                        ViolationReportStatus.RESOLVED,
                        12),
                new ViolationReportSeedSpec(
                        customer,
                        ViolationSubjectType.POST,
                        rejectedBoard,
                        null,
                        null,
                        "Lừa đảo",
                        "Yêu cầu thanh toán phí giữ chỗ trước khi cho xem phòng.",
                        ViolationReportStatus.RESOLVED,
                        15),
                new ViolationReportSeedSpec(
                        employee,
                        ViolationSubjectType.USER,
                        null,
                        host,
                        null,
                        "Thông tin sai lệch",
                        "Người dùng thường xuyên thay đổi diện tích phòng giữa bài đăng và lúc tư vấn.",
                        ViolationReportStatus.REVIEWING,
                        4),
                new ViolationReportSeedSpec(
                        customer,
                        ViolationSubjectType.USER,
                        null,
                        host,
                        null,
                        "Spam",
                        "Đăng bài trùng lặp nhiều lần trong thời gian ngắn để đẩy tin.",
                        ViolationReportStatus.RESOLVED,
                        20),
                new ViolationReportSeedSpec(
                        employee,
                        ViolationSubjectType.POST,
                        hiddenBoard,
                        null,
                        null,
                        "Giá không hợp lý",
                        "Giá niêm yết không khớp với giá thực tế khi đến xem phòng.",
                        ViolationReportStatus.IGNORED,
                        7),
                new ViolationReportSeedSpec(
                        customer,
                        ViolationSubjectType.POST,
                        approvedBoard,
                        null,
                        null,
                        "Lừa đảo",
                        "Người đăng yêu cầu thanh toán phí giữ chỗ trước khi cho xem phòng và không có địa chỉ rõ ràng.",
                        ViolationReportStatus.PENDING,
                        1),
                new ViolationReportSeedSpec(
                        employee,
                        ViolationSubjectType.POST,
                        approvedBoard,
                        null,
                        null,
                        "Lừa đảo",
                        "Sau khi chuyển cọc thì người đăng không phản hồi.",
                        ViolationReportStatus.PENDING,
                        3)));

        if (commentReview != null) {
            specs.add(new ViolationReportSeedSpec(
                    customer,
                    ViolationSubjectType.COMMENT,
                    null,
                    null,
                    commentReview,
                    "Nội dung phản cảm",
                    "Bình luận sử dụng ngôn từ xúc phạm và gây khó chịu cho người xem.",
                    ViolationReportStatus.PENDING,
                    6));
            specs.add(new ViolationReportSeedSpec(
                    employee,
                    ViolationSubjectType.COMMENT,
                    null,
                    null,
                    commentReview,
                    "Spam",
                    "Bình luận chèn link ngoài và số điện thoại không liên quan.",
                    ViolationReportStatus.REVIEWING,
                    10));
        }

        for (ViolationReportSeedSpec spec : specs) {
            ViolationReport report = ViolationReport.builder()
                    .reporter(spec.reporter())
                    .subjectType(spec.subjectType())
                    .bulletinBoard(spec.bulletinBoard())
                    .reportedAccount(spec.reportedAccount())
                    .review(spec.review())
                    .reason(spec.reason())
                    .content(spec.content())
                    .status(spec.status())
                    .build();
            if (spec.status() == ViolationReportStatus.RESOLVED) {
                report.setResolutionAction(ViolationResolutionAction.WARN);
                report.setResolvedAt(LocalDateTime.now().minusDays(1));
            } else if (spec.status() == ViolationReportStatus.IGNORED) {
                report.setResolutionAction(ViolationResolutionAction.IGNORE);
                report.setResolvedAt(LocalDateTime.now().minusDays(2));
            }
            report.setCreatedAt(LocalDateTime.now().minusDays(spec.daysAgo()));
            report.setUpdatedAt(report.getCreatedAt());
            report = violationReportRepository.save(report);
            // Ghi lại createdAt vì Hibernate/Auditing có thể override
            report.setCreatedAt(LocalDateTime.now().minusDays(spec.daysAgo()));
            report.setUpdatedAt(report.getCreatedAt());
            violationReportRepository.save(report);
        }
    }

    // ── Favorites ─────────────────────────────────────────────────────────────

    public void seedFavorites(String username, int count) {
        log.info("[MarketplaceSeeder] Seeding Favorites for '{}'...", username);
        Account acc = accountRepository.findByUsername(username).orElse(null);
        if (acc == null) return;
        List<BulletinBoard> boards =
                bulletinBoardRepository.findAll().stream().limit(count).toList();
        acc.setFavoriteBulletinBoards(new ArrayList<>(boards));
        accountRepository.save(acc);
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Áp dụng trạng thái bài đăng theo chu kỳ 20:
     * 0-10 → active+approved, 11-13 → pending, 14-16 → rejected, 17-19 → hidden
     */
    private void applyBoardState(BulletinBoard bb, int index) {
        int bucket = index % 20;
        if (bucket < 11) {
            bb.setIsActive(true);
            bb.setStatus(true);
            bb.setIsHidden(false);
            bb.setRejectionReason(null);
            return;
        }
        if (bucket < 14) {
            bb.setIsActive(false);
            bb.setStatus(true);
            bb.setIsHidden(false);
            bb.setRejectionReason(null);
            return;
        }
        if (bucket < 17) {
            bb.setIsActive(false);
            bb.setStatus(false);
            bb.setIsHidden(false);
            bb.setRejectionReason("Thông tin không chính xác: giá và diện tích không khớp với thực tế khi liên hệ.");
            return;
        }
        bb.setIsActive(true);
        bb.setStatus(false);
        bb.setIsHidden(true);
        bb.setRejectionReason(null);
    }

    private String buildDescription(PropertySeeder.MotelSeedSpec seedSpec, Room room) {
        String base = seedSpec != null
                ? seedSpec.description()
                : "Tin đăng đã được kiểm tra thông tin cơ bản trước khi hiển thị.";
        return base + " " + room.getName() + " có " + room.getArea() + "m2, mức giá "
                + String.format(Locale.US, "%,.0f", room.getPrice()) + " VND/tháng.";
    }

    private String buildReviewComment(Faker faker, Motel motel, int reviewIndex) {
        List<String> comments = List.of(
                "Phòng đúng mô tả, chủ hỗ trợ nhanh và khu vực đi lại thuận tiện.",
                "Giá hợp lý so với vị trí, nhà vệ sinh sạch và ảnh thực tế sát với tin đăng.",
                "Ở gần chỗ học và chỗ làm nên tiết kiệm thời gian di chuyển mỗi ngày.");
        return comments.get((reviewIndex + motel.getMotelName().length()) % comments.size()) + " "
                + faker.lorem().sentence(6);
    }

    // ── Spec record ───────────────────────────────────────────────────────────

    private record ViolationReportSeedSpec(
            Account reporter,
            ViolationSubjectType subjectType,
            BulletinBoard bulletinBoard,
            Account reportedAccount,
            BulletinBoardReviews review,
            String reason,
            String content,
            ViolationReportStatus status,
            int daysAgo) {}
}
