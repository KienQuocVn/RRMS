package com.rrms.rrms.database.seed;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.rrms.rrms.models.Device;
import com.rrms.rrms.models.NameMotelService;
import com.rrms.rrms.models.Payment;
import com.rrms.rrms.models.Service;
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

    public Map<String, Service> seedCoreServices() {
        log.info("[CatalogSeeder] Seeding CoreServices...");
        Map<String, Service> map = new HashMap<>();
        map.put(
                "Electric",
                serviceRepository.save(Service.builder()
                        .nameService("Điện")
                        .typeService("Meter")
                        .build()));
        map.put(
                "Water",
                serviceRepository.save(Service.builder()
                        .nameService("Nước")
                        .typeService("Meter")
                        .build()));
        map.put(
                "Trash",
                serviceRepository.save(Service.builder()
                        .nameService("Rác")
                        .typeService("Fixed")
                        .build()));
        map.put(
                "Wifi",
                serviceRepository.save(Service.builder()
                        .nameService("Wifi")
                        .typeService("Fixed")
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
