package com.rrms.rrms.database.seed;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.rrms.rrms.models.Device;
import com.rrms.rrms.models.NameMotelService;
import com.rrms.rrms.models.Payment;
import com.rrms.rrms.models.TypeRoom;
import com.rrms.rrms.repositories.DeviceRepository;
import com.rrms.rrms.repositories.NameMotelServiceRepository;
import com.rrms.rrms.repositories.PaymentRepository;
import com.rrms.rrms.repositories.ServiceRepository;
import com.rrms.rrms.repositories.TypeRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * CatalogSeeder - Seed dữ liệu danh mục tĩnh:
 * TypeRoom, NameMotelService, Service, Device, Payment.
 * Thứ tự chạy: 2 (sau AccountSeeder)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CatalogSeeder {

    private final TypeRoomRepository typeRoomRepository;
    private final NameMotelServiceRepository nameMotelServiceRepository;
    private final ServiceRepository serviceRepository;
    private final DeviceRepository deviceRepository;
    private final PaymentRepository paymentRepository;

    // ── TypeRoom ──────────────────────────────────────────────────────────────

    public Map<String, TypeRoom> seedTypeRooms() {
        log.info("[CatalogSeeder] Seeding TypeRooms...");
        Map<String, TypeRoom> map = new HashMap<>();
        // 4 loại nhà theo frontend: PROPERTY_TYPE_OPTIONS
        String[] types = {
            "Phòng trọ, nhà trọ", // phong-tro-nha-tro
            "Chung cư", // chung-cu
            "Căn hộ dịch vụ", // can-ho-chung-cu
            "Ký túc xá" // ky-tuc-xa
        };
        for (String t : types) {
            map.put(t, typeRoomRepository.save(TypeRoom.builder().name(t).build()));
        }
        // Alias "Trọ" trỏ vào "Phòng trọ, nhà trọ" để tương thích DB.java
        map.put("Trọ", map.get("Phòng trọ, nhà trọ"));
        return map;
    }

    // ── NameMotelService ──────────────────────────────────────────────────────

    public void seedNameMotelServices() {
        log.info("[CatalogSeeder] Seeding NameMotelServices...");
        String[][] data = {
            {"Điện", "Tiền điện"},
            {"Nước", "Tiền nước"},
            {"Rác", "Tiền rác"},
            {"Internet", "Tiền wifi"}
        };
        for (String[] d : data) {
            nameMotelServiceRepository.save(NameMotelService.builder()
                    .typeService(d[0])
                    .nameService(d[1])
                    .build());
        }
    }

    // ── Core Services ─────────────────────────────────────────────────────────

    /**
     * Seed danh mục dịch vụ phổ biến cho thuê nhà trọ.
     * typeService: "Meter" (chỉ số công tơ), "Fixed" (cố định theo tháng/người), "Usage" (tính theo lần/cái dùng).
     * unit: chỉ chấp nhận kWh | Khối | mét khối | Người | Tháng | Lần | Cái | Chiếc
     */
    public Map<String, com.rrms.rrms.models.Service> seedCoreServices() {
        log.info("[CatalogSeeder] Seeding CoreServices...");
        Map<String, com.rrms.rrms.models.Service> map = new HashMap<>();

        // ── Dịch vụ đo chỉ số (Meter) ──────────────────────────────────────
        map.put(
                "Electric",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Điện")
                        .typeService("Meter")
                        .unit("kWh")
                        .build()));

        map.put(
                "Water",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Nước")
                        .typeService("Meter")
                        .unit("Khối")
                        .build()));

        // ── Dịch vụ cố định theo tháng (Fixed – Tháng) ─────────────────────
        map.put(
                "Wifi",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Wifi / Internet")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        map.put(
                "Security",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí bảo vệ / An ninh")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        map.put(
                "Elevator",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí thang máy")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        map.put(
                "Management",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí quản lý")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        map.put(
                "Parking_Motorbike",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Giữ xe máy")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        map.put(
                "Parking_Car",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Giữ xe ô tô")
                        .typeService("Fixed")
                        .unit("Tháng")
                        .build()));

        // ── Dịch vụ cố định theo người (Fixed – Người) ─────────────────────
        map.put(
                "Trash",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí vệ sinh / Rác")
                        .typeService("Fixed")
                        .unit("Người")
                        .build()));

        map.put(
                "ExtraPerson",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí người thêm")
                        .typeService("Fixed")
                        .unit("Người")
                        .build()));

        // ── Dịch vụ tính theo lần sử dụng (Usage – Lần) ───────────────────
        map.put(
                "Cleaning",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Dọn vệ sinh phòng")
                        .typeService("Usage")
                        .unit("Lần")
                        .build()));

        // ── Dịch vụ tính theo cái / chiếc (Usage – Cái/Chiếc) ─────────────
        map.put(
                "KeyCard",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Thẻ từ / Chìa khóa")
                        .typeService("Usage")
                        .unit("Chiếc")
                        .build()));

        map.put(
                "TransferFee",
                serviceRepository.save(com.rrms.rrms.models.Service.builder()
                        .nameService("Phí chuyển đồ / Vận chuyển")
                        .typeService("Usage")
                        .unit("Lần")
                        .build()));

        return map;
    }

    // ── Device Catalog ────────────────────────────────────────────────────────

    public List<Device> seedDeviceCatalog() {
        log.info("[CatalogSeeder] Seeding DeviceCatalog...");
        return deviceRepository.saveAll(List.of(
                Device.builder().deviceName("Điều hòa").available(true).build(),
                Device.builder().deviceName("Tủ lạnh").available(true).build(),
                Device.builder().deviceName("Giường").available(true).build()));
    }

    // ── Payment Methods ───────────────────────────────────────────────────────

    public void seedPaymentMethods() {
        log.info("[CatalogSeeder] Seeding PaymentMethods...");
        paymentRepository.save(Payment.builder()
                .paymentName("Tiền mặt")
                .description("Thanh toán trực tiếp")
                .paymentDate(LocalDate.now())
                .build());
        paymentRepository.save(Payment.builder()
                .paymentName("Chuyển khoản")
                .description("Thanh toán qua ngân hàng")
                .paymentDate(LocalDate.now())
                .build());
    }
}
