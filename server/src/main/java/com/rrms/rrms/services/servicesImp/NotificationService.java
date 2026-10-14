package com.rrms.rrms.services.servicesImp;

import java.text.NumberFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.response.NotificationResponse;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.INotificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class NotificationService implements INotificationService {

    NotificationRepository notificationRepository;
    MotelRepository motelRepository;
    RoomRepository roomRepository;
    RoomReservationRepository roomReservationRepository;
    ContractRepository contractRepository;
    InvoiceRepository invoiceRepository;
    AccountRepository accountRepository;

    private static final NumberFormat CURRENCY_FORMAT = NumberFormat.getInstance(new Locale("vi", "VN"));

    @Override
    public List<NotificationResponse> getNotifications(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<NotificationResponse> notifications = new ArrayList<>();
        Account account = accountRepository.findByUsername(username).orElse(null);
        String landlordName = account != null && account.getFullName() != null ? account.getFullName() : username;

        // 1. Thông báo từ bảng notifications (nếu có)
        try {
            List<Notification> dbNotifications = notificationRepository.findAllByLandlordUsername(username);
            for (Notification n : dbNotifications) {
                LocalDateTime time = n.getCreatedAt() != null ? n.getCreatedAt() : LocalDateTime.now();
                notifications.add(NotificationResponse.builder()
                        .notificationId(
                                n.getNotificationId() != null
                                        ? n.getNotificationId().toString()
                                        : UUID.randomUUID().toString())
                        .title("📢 " + (n.getTitle() != null ? n.getTitle() : "Thông báo hệ thống"))
                        .subtitle(n.getContent() != null ? n.getContent() : "")
                        .content(n.getContent())
                        .type("GENERAL")
                        .createdAt(time)
                        .timeAgo(formatTimeAgo(time))
                        .isRead(false)
                        .build());
            }
        } catch (Exception e) {
            log.warn("Lỗi khi lấy dữ liệu bảng notifications: {}", e.getMessage());
        }

        // 2. Lấy danh sách Motel của chủ trọ
        List<Motel> motels = Collections.emptyList();
        try {
            motels = motelRepository.findMotelByAccount_Username(username);
        } catch (Exception e) {
            log.warn("Lỗi khi lấy motels: {}", e.getMessage());
        }

        Set<UUID> motelIds = new HashSet<>();
        for (Motel motel : motels) {
            if (motel.getMotelId() != null) {
                motelIds.add(motel.getMotelId());
            }

            // Thông báo: Tạo nhà trọ
            LocalDateTime motelTime = motel.getCreatedAt() != null
                    ? motel.getCreatedAt()
                    : LocalDateTime.now().minusDays(1);
            String address = motel.getAddress() != null ? motel.getAddress() : "";
            notifications.add(NotificationResponse.builder()
                    .notificationId("motel-" + motel.getMotelId())
                    .title("🏠 " + motel.getMotelName() + " đã được tạo")
                    .subtitle(landlordName + ": đã tạo nhà trọ mới tại " + address)
                    .content("Nhà trọ: " + motel.getMotelName() + ", Địa chỉ: " + address)
                    .type("MOTEL")
                    .createdAt(motelTime)
                    .timeAgo(formatTimeAgo(motelTime))
                    .isRead(true)
                    .build());

            // Thông báo: Dịch vụ của nhà trọ
            if (motel.getMotelServices() != null) {
                for (com.rrms.rrms.models.MotelService service : motel.getMotelServices()) {
                    LocalDateTime sTime = motelTime.plusMinutes(5);
                    String priceStr =
                            service.getPrice() != null ? CURRENCY_FORMAT.format(service.getPrice()) + "đ" : "0đ";
                    notifications.add(NotificationResponse.builder()
                            .notificationId("service-" + service.getMotelServiceId())
                            .title("⚡ " + motel.getMotelName() + " thêm dịch vụ " + service.getNameService())
                            .subtitle(
                                    landlordName + ": thêm dịch vụ " + service.getNameService() + " (" + priceStr + ")")
                            .content("Dịch vụ: " + service.getNameService() + ", Đơn giá: " + priceStr)
                            .type("SERVICE")
                            .createdAt(sTime)
                            .timeAgo(formatTimeAgo(sTime))
                            .isRead(true)
                            .build());
                }
            }
        }

        // 3. Thông báo: Tạo phòng
        for (Motel motel : motels) {
            try {
                List<Room> rooms = roomRepository.findByMotel(motel);
                for (Room room : rooms) {
                    LocalDateTime roomTime = room.getCreatedAt() != null ? room.getCreatedAt() : motel.getCreatedAt();
                    if (roomTime == null) roomTime = LocalDateTime.now().minusDays(1);
                    String priceStr = room.getPrice() != null ? CURRENCY_FORMAT.format(room.getPrice()) + "đ" : "0đ";

                    notifications.add(NotificationResponse.builder()
                            .notificationId("room-" + room.getRoomId())
                            .title("🚪 " + room.getName() + ", " + motel.getMotelName() + " đã được tạo")
                            .subtitle(landlordName + ": thêm phòng mới với giá thuê " + priceStr)
                            .content("Phòng: " + room.getName() + ", Giá: " + priceStr)
                            .type("ROOM")
                            .createdAt(roomTime)
                            .timeAgo(formatTimeAgo(roomTime))
                            .isRead(true)
                            .build());

                    // Cọc giữ chỗ (Reserve_a_place)
                    try {
                        List<Reserve_a_place> reservations =
                                roomReservationRepository.findByRoom_RoomId(room.getRoomId());
                        if (reservations != null) {
                            for (Reserve_a_place res : reservations) {
                                LocalDateTime resTime = res.getCreatedAt() != null
                                        ? res.getCreatedAt()
                                        : (res.getCreatedate() != null
                                                ? res.getCreatedate()
                                                        .toInstant()
                                                        .atZone(ZoneId.systemDefault())
                                                        .toLocalDateTime()
                                                : LocalDateTime.now());
                                String depositStr = res.getDeposit() != null
                                        ? CURRENCY_FORMAT.format(res.getDeposit()) + "đ"
                                        : "0đ";
                                String tenantName = res.getNametenant() != null ? res.getNametenant() : "Khách thuê";

                                notifications.add(NotificationResponse.builder()
                                        .notificationId("reserve-" + res.getReserveaplaceId())
                                        .title("📌 " + room.getName() + ", " + motel.getMotelName() + " cọc giữ chỗ")
                                        .subtitle(landlordName + ": " + tenantName + " cọc giữ chỗ với số tiền "
                                                + depositStr)
                                        .content("Cọc giữ chỗ cho " + room.getName() + ", số tiền: " + depositStr)
                                        .type("DEPOSIT")
                                        .createdAt(resTime)
                                        .timeAgo(formatTimeAgo(resTime))
                                        .isRead(false)
                                        .build());
                            }
                        }
                    } catch (Exception ignored) {
                    }

                    // Hợp đồng (Contract)
                    try {
                        List<Contract> contracts = contractRepository.findByRoomRoomId(room.getRoomId());
                        if (contracts != null) {
                            for (Contract c : contracts) {
                                LocalDateTime cTime = c.getCreatedAt() != null ? c.getCreatedAt() : LocalDateTime.now();
                                String tenantName =
                                        c.getTenant() != null && c.getTenant().getFullName() != null
                                                ? c.getTenant().getFullName()
                                                : "Khách mới";

                                notifications.add(NotificationResponse.builder()
                                        .notificationId("contract-" + c.getContractId())
                                        .title("🎉 " + room.getName() + ", " + motel.getMotelName() + " lập hợp đồng")
                                        .subtitle(landlordName + ": ghi nhận " + tenantName + " vào thuê")
                                        .content("Hợp đồng thuê phòng " + room.getName())
                                        .type("CONTRACT")
                                        .createdAt(cTime)
                                        .timeAgo(formatTimeAgo(cTime))
                                        .isRead(false)
                                        .build());

                                // Hóa đơn (Invoice)
                                try {
                                    List<Invoice> invoices =
                                            invoiceRepository.findByContractContractId(c.getContractId());
                                    if (invoices != null) {
                                        for (Invoice inv : invoices) {
                                            LocalDateTime invTime = inv.getCreatedAt() != null
                                                    ? inv.getCreatedAt()
                                                    : LocalDateTime.now();
                                            String monthStr = inv.getInvoiceCreateMonth() != null
                                                    ? inv.getInvoiceCreateMonth()
                                                            .toString()
                                                    : "";

                                            notifications.add(NotificationResponse.builder()
                                                    .notificationId("invoice-" + inv.getInvoiceId())
                                                    .title("💰 " + room.getName() + ", " + motel.getMotelName()
                                                            + " lập hóa đơn"
                                                            + (monthStr.isEmpty() ? "" : " T." + monthStr))
                                                    .subtitle(landlordName + ": lập hóa đơn"
                                                            + (inv.getInvoiceReason() != null
                                                                    ? " - " + inv.getInvoiceReason()
                                                                    : ""))
                                                    .content("Lập hóa đơn cho phòng " + room.getName())
                                                    .type("INVOICE")
                                                    .createdAt(invTime)
                                                    .timeAgo(formatTimeAgo(invTime))
                                                    .isRead(false)
                                                    .build());

                                            // Nếu đã thanh toán
                                            if (inv.getPaymentStatus() != null
                                                    && inv.getPaymentStatus()
                                                            .name()
                                                            .equalsIgnoreCase("PAID")) {
                                                LocalDateTime payTime = inv.getUpdatedAt() != null
                                                        ? inv.getUpdatedAt()
                                                        : invTime.plusHours(1);
                                                notifications.add(NotificationResponse.builder()
                                                        .notificationId("payment-" + inv.getInvoiceId())
                                                        .title("💵 " + room.getName() + ", " + motel.getMotelName()
                                                                + " thanh toán xong hóa đơn")
                                                        .subtitle(landlordName + ": thanh toán xong hóa đơn"
                                                                + (monthStr.isEmpty() ? "" : " T." + monthStr))
                                                        .content("Hóa đơn đã được thanh toán thành công")
                                                        .type("PAYMENT")
                                                        .createdAt(payTime)
                                                        .timeAgo(formatTimeAgo(payTime))
                                                        .isRead(false)
                                                        .build());
                                            }
                                        }
                                    }
                                } catch (Exception ignored) {
                                }
                            }
                        }
                    } catch (Exception ignored) {
                    }
                }
            } catch (Exception e) {
                log.warn("Lỗi khi duyệt rooms của motel {}: {}", motel.getMotelId(), e.getMessage());
            }
        }

        // Sắp xếp giảm dần theo thời gian tạo mới nhất
        notifications.sort((a, b) -> {
            if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        // Cập nhật lại timeAgo chính xác sau khi sort
        for (NotificationResponse res : notifications) {
            res.setTimeAgo(formatTimeAgo(res.getCreatedAt()));
        }

        return notifications;
    }

    @Override
    public long getUnreadCount(String username) {
        List<NotificationResponse> all = getNotifications(username);
        return all.stream().filter(n -> Boolean.FALSE.equals(n.getIsRead())).count();
    }

    @Override
    public void markAsRead(String notificationId, String username) {
        log.info("Mark as read notification {} for user {}", notificationId, username);
    }

    private String formatTimeAgo(LocalDateTime dt) {
        if (dt == null) return "Vừa xong";
        Duration duration = Duration.between(dt, LocalDateTime.now());
        long seconds = duration.getSeconds();

        if (seconds < 60) return "Vừa xong";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + " phút trước";
        long hours = minutes / 60;
        if (hours < 24) return hours + " giờ trước";
        long days = hours / 24;
        if (days < 7) return days + " ngày trước";
        long weeks = days / 7;
        if (weeks < 4) return weeks + " tuần trước";
        return dt.getDayOfMonth() + "/" + dt.getMonthValue() + "/" + dt.getYear();
    }
}
