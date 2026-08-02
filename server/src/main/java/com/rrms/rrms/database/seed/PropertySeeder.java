package com.rrms.rrms.database.seed;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.rrms.rrms.enums.RoomStatus;
import com.rrms.rrms.enums.Unit;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelDevice;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.RoomDevice;
import com.rrms.rrms.models.RoomImage;
import com.rrms.rrms.models.RoomService;
import com.rrms.rrms.models.TypeRoom;
import com.rrms.rrms.repositories.MotelDeviceRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.MotelServiceRepository;
import com.rrms.rrms.repositories.RoomDeviceRepository;
import com.rrms.rrms.repositories.RoomImageRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.RoomServiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PropertySeeder - Seed dữ liệu Motel và Room.
 * Thứ tự chạy: 3 (sau CatalogSeeder)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PropertySeeder {

    private static final Random SEEDED_RANDOM = new Random(20260508L);

    private final MotelRepository motelRepository;
    private final MotelServiceRepository motelServiceRepository;
    private final MotelDeviceRepository motelDeviceRepository;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    private final RoomServiceRepository roomServiceRepository;
    private final RoomDeviceRepository roomDeviceRepository;

    // ── Motel Seed Specs ──────────────────────────────────────────────────────

    public record MotelSeedSpec(
            String motelName,
            String address,
            Double latitude,
            Double longitude,
            Double area,
            Long averagePrice,
            int maxPerson,
            String methodOfCreation,
            String description) {}

    public static final List<MotelSeedSpec> MOTEL_SEED_SPECS = List.of(
            new MotelSeedSpec(
                    "Nhà trọ Sài Gòn Central",
                    "12 Tô Hiến Thành, 27283, 79",
                    10.772198,
                    106.665802,
                    210.0,
                    3200000L,
                    4,
                    "Tự động",
                    "Không gian sạch sẽ, hợp người đi làm và sinh viên cần di chuyển nhanh trong trung tâm."),
            new MotelSeedSpec(
                    "Chung cư Thành Thái Garden",
                    "88 Thành Thái, 27283, 79",
                    10.773772,
                    106.667839,
                    198.0,
                    3400000L,
                    4,
                    "Thủ công",
                    "Khu vực sầm uất, thuận tiện tới trường học, bệnh viện và các tuyến xe buýt lớn."),
            new MotelSeedSpec(
                    "Căn hộ dịch vụ Bình Thạnh Riverside",
                    "25 Nguyễn Gia Trí, 26965, 79",
                    10.801157,
                    106.714318,
                    186.0,
                    3600000L,
                    4,
                    "Tự động",
                    "Phù hợp người đi làm gần Điện Biên Phủ, Landmark 81 và tuyến metro tương lai."),
            new MotelSeedSpec(
                    "Ký túc xá Cầu Giấy Hub",
                    "45 Trần Thái Tông, 00160, 01",
                    21.033326,
                    105.789662,
                    204.0,
                    3300000L,
                    4,
                    "Thủ công",
                    "Thuận tiện đi làm khu Duy Tân, Keangnam và các trường đại học phía Tây Hà Nội."),
            new MotelSeedSpec(
                    "Nhà trọ Hà Đông Comfort",
                    "102 Quang Trung, 00658, 01",
                    20.969674,
                    105.775654,
                    194.0,
                    2950000L,
                    4,
                    "Tự động",
                    "Phòng yên tĩnh, gần tàu điện Cát Linh - Hà Đông và các khu đô thị mới."),
            new MotelSeedSpec(
                    "Chung cư Ninh Kiều View",
                    "17 Mậu Thân, 31117, 92",
                    10.035065,
                    105.779875,
                    182.0,
                    2800000L,
                    4,
                    "Thủ công",
                    "Dễ dàng di chuyển tới bến Ninh Kiều, chợ đêm và các trường đại học trung tâm."),
            new MotelSeedSpec(
                    "Căn hộ dịch vụ Thuận An Smart Stay",
                    "66 Nguyễn Văn Tiết, 25747, 74",
                    10.933801,
                    106.711574,
                    188.0,
                    2700000L,
                    4,
                    "Tự động",
                    "Phù hợp công nhân và chuyên gia cần ở gần VSIP, Aeon Mall và quốc lộ 13."),
            new MotelSeedSpec(
                    "Ký túc xá Dĩ An Transit",
                    "9 ĐT743A, 25762, 74",
                    10.906626,
                    106.769986,
                    176.0,
                    2650000L,
                    4,
                    "Thủ công",
                    "Kết nối nhanh tới khu công nghiệp Sóng Thần, Đại học Quốc gia và bến xe miền Đông mới."),
            new MotelSeedSpec(
                    "Nhà trọ Hải Châu Breeze",
                    "21 Hoàng Diệu, 20194, 48",
                    16.061511,
                    108.220770,
                    192.0,
                    3100000L,
                    4,
                    "Tự động",
                    "Không gian sáng, gần trung tâm hành chính, sông Hàn và cầu Rồng."),
            new MotelSeedSpec(
                    "Chung cư Biển Xanh",
                    "5 Trần Phú, 22363, 56",
                    12.247668,
                    109.194928,
                    208.0,
                    3900000L,
                    4,
                    "Tự động",
                    "Phù hợp người thích ở gần biển, khu du lịch và trung tâm thành phố Nha Trang."));

    // ── Motels ────────────────────────────────────────────────────────────────

    public List<Motel> seedMotels(Account host, java.util.Map<String, TypeRoom> typeRooms) {
        log.info("[PropertySeeder] Seeding Motels with multiple TypeRooms...");
        List<Motel> motels = new ArrayList<>();
        String[] typeKeys = {"Phòng trọ, nhà trọ", "Chung cư", "Căn hộ dịch vụ", "Ký túc xá"};
        int index = 0;
        for (MotelSeedSpec spec : MOTEL_SEED_SPECS) {
            String typeKey = typeKeys[index % typeKeys.length];
            TypeRoom typeRoom = typeRooms.get(typeKey);
            index++;
            motels.add(motelRepository.save(Motel.builder()
                    .account(host)
                    .motelName(spec.motelName())
                    .address(spec.address())
                    .latitude(spec.latitude())
                    .longitude(spec.longitude())
                    .area(spec.area())
                    .averagePrice(spec.averagePrice())
                    .maxperson(spec.maxPerson())
                    .invoicedate(5)
                    .paymentdeadline(10)
                    .methodofcreation(spec.methodOfCreation())
                    .typeRoom(typeRoom)
                    .build()));
        }
        return motels;
    }

    // ── Motel Services & Devices ──────────────────────────────────────────────

    public void seedMotelExtras(List<Motel> motels) {
        log.info("[PropertySeeder] Seeding MotelExtras (services & devices)...");
        for (Motel m : motels) {
            motelServiceRepository.save(MotelService.builder()
                    .motel(m)
                    .nameService("Điện")
                    .price(3500L)
                    .chargetype("METER")
                    .build());
            motelServiceRepository.save(MotelService.builder()
                    .motel(m)
                    .nameService("Nước")
                    .price(15000L)
                    .chargetype("METER")
                    .build());
            motelServiceRepository.save(MotelService.builder()
                    .motel(m)
                    .nameService("Wifi")
                    .price(100000L)
                    .chargetype("FIXED")
                    .build());

            motelDeviceRepository.save(MotelDevice.builder()
                    .motel(m)
                    .deviceName("Điều hòa")
                    .totalQuantity(5)
                    .totalUsing(2)
                    .totalNull(3)
                    .unit(Unit.CAI)
                    .build());
        }
    }

    // ── Rooms ─────────────────────────────────────────────────────────────────

    /**
     * Trạng thái phòng theo index % 7:
     * 0 → AVAILABLE (Đang trống)
     * 1 → OCCUPIED  (Đang ở - ACTIVE)
     * 2 → OCCUPIED  (Đang báo KT - ReportEnd)
     * 3 → OCCUPIED  (Sắp hết hạn - IATExpire)
     * 4 → OCCUPIED  (Quá hạn hợp đồng - EXPIRING/ENDED)
     * 5 → RESERVED  (Đang cọc giữ chỗ)
     * 6 → OCCUPIED  (Đang nợ tiền - ACTIVE + debt)
     */
    public List<Room> seedRooms(
            List<Motel> motels, List<MotelService> mServices, List<MotelDevice> mDevices, int[] imageIndexRef) {
        log.info("[PropertySeeder] Seeding Rooms...");
        List<Room> rooms = new ArrayList<>();
        String[] prioritizes = {"Ban công", "Cửa sổ lớn", "Hướng Đông", "Hướng Tây", "View đẹp", "Góc", "Cuối dãy"};
        for (Motel m : motels) {
            for (int i = 1; i <= 7; i++) {
                double basePrice = m.getAveragePrice() + ((i - 4) * 180000L);
                int area = 18 + (i * 3) + SEEDED_RANDOM.nextInt(4);
                // i%7==0 → AVAILABLE, i%7==5 → RESERVED, còn lại → OCCUPIED
                RoomStatus status =
                        switch (i % 7) {
                            case 1, 2, 3, 4, 6 -> RoomStatus.OCCUPIED;
                            case 5 -> RoomStatus.RESERVED;
                            default -> RoomStatus.AVAILABLE;
                        };
                Room r = roomRepository.save(Room.builder()
                        .motel(m)
                        .name(String.format("Phòng %s-%02d", m.getMotelName().replace("Nhà trọ ", ""), i))
                        .price(basePrice)
                        .deposit(basePrice)
                        .area(area)
                        .group("Tầng " + (i <= 2 ? 1 : i <= 4 ? 2 : i <= 6 ? 3 : 4))
                        .status(status)
                        .prioritize(prioritizes[i - 1])
                        .finance("Thanh toán đầu tháng")
                        .description("Phòng riêng đầy đủ tiện nghi, sạch sẽ và đã được kiểm tra trước khi đăng.")
                        .build());
                rooms.add(r);

                for (int j = 0; j < 2; j++) {
                    roomImageRepository.save(new RoomImage(
                            UUID.randomUUID(), r, "https://picsum.photos/400/300?random=" + (++imageIndexRef[0])));
                }

                mServices.stream()
                        .filter(ms -> ms.getMotel().getMotelId().equals(m.getMotelId()))
                        .forEach(ms -> roomServiceRepository.save(RoomService.builder()
                                .room(r)
                                .service(ms)
                                .quantity(1)
                                .build()));

                mDevices.stream()
                        .filter(md -> md.getMotel().getMotelId().equals(m.getMotelId()))
                        .forEach(md -> roomDeviceRepository.save(RoomDevice.builder()
                                .room(r)
                                .motelDevice(md)
                                .quantity(1)
                                .build()));
            }
        }
        return rooms;
    }
}
