package com.rrms.rrms.database;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.enums.*;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.*;

import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;

@Configuration
@Slf4j
@Transactional
@Profile("dev")
public class DB {
    private static final String DEFAULT_PASSWORD = "123456789";
    private static final Random SEEDED_RANDOM = new Random(20260508L);
    private static final List<MotelSeedSpec> MOTEL_SEED_SPECS = List.of(
            new MotelSeedSpec(
                    "Nhà nghỉ Sài Gòn Central",
                    "12 Tô Hiến Thành, Quận 10, Hồ Chí Minh",
                    210.0,
                    3200000L,
                    4,
                    "Tự động",
                    "Không gian sạch sẽ, hợp người đi làm và sinh viên cần di chuyển nhanh trong trung tâm."),
            new MotelSeedSpec(
                    "Nhà nghỉ Thành Thái Garden",
                    "88 Thành Thái, Quận 10, Hồ Chí Minh",
                    198.0,
                    3400000L,
                    4,
                    "Thủ công",
                    "Khu vực sầm uất, thuận tiện tới trường học, bệnh viện và các tuyến xe buýt lớn."),
            new MotelSeedSpec(
                    "Nhà nghỉ Bình Thạnh Riverside",
                    "25 Nguyễn Gia Trí, Bình Thạnh, Hồ Chí Minh",
                    186.0,
                    3600000L,
                    4,
                    "Tự động",
                    "Phù hợp người đi làm gần Điện Biên Phủ, Landmark 81 và tuyến metro tương lai."),
            new MotelSeedSpec(
                    "Nhà nghỉ Cầu Giấy Hub",
                    "45 Trần Thái Tông, Cầu Giấy, Hà Nội",
                    204.0,
                    3300000L,
                    4,
                    "Thủ công",
                    "Thuận tiện đi làm khu Duy Tân, Keangnam và các trường đại học phía Tây Hà Nội."),
            new MotelSeedSpec(
                    "Nhà nghỉ Hà Đông Comfort",
                    "102 Quang Trung, Hà Đông, Hà Nội",
                    194.0,
                    2950000L,
                    4,
                    "Tự động",
                    "Phòng yên tĩnh, gần tàu điện Cát Linh - Hà Đông và các khu đô thị mới."),
            new MotelSeedSpec(
                    "Nhà nghỉ Ninh Kiều View",
                    "17 Mậu Thân, Ninh Kiều, Cần Thơ",
                    182.0,
                    2800000L,
                    4,
                    "Thủ công",
                    "Dễ dàng di chuyển tới bến Ninh Kiều, chợ đêm và các trường đại học trung tâm."),
            new MotelSeedSpec(
                    "Nhà nghỉ Thuận An Smart Stay",
                    "66 Nguyễn Văn Tiết, Thuận An, Bình Dương",
                    188.0,
                    2700000L,
                    4,
                    "Tự động",
                    "Phù hợp công nhân và chuyên gia cần ở gần VSIP, Aeon Mall và quốc lộ 13."),
            new MotelSeedSpec(
                    "Nhà nghỉ Dĩ An Transit",
                    "9 ĐT743A, Dĩ An, Bình Dương",
                    176.0,
                    2650000L,
                    4,
                    "Thủ công",
                    "Kết nối nhanh tới khu công nghiệp Sóng Thần, Đại học Quốc gia và bến xe miền Đông mới."),
            new MotelSeedSpec(
                    "Nhà nghỉ Hải Châu Breeze",
                    "21 Hoàng Diệu, Hải Châu, Đà Nẵng",
                    192.0,
                    3100000L,
                    4,
                    "Tự động",
                    "Không gian sáng, gần trung tâm hành chính, sông Hàn và cầu Rồng."),
            new MotelSeedSpec(
                    "Nhà nghỉ Biển Xanh",
                    "5 Trần Phú, Nha Trang",
                    208.0,
                    3900000L,
                    4,
                    "Tự động",
                    "Phù hợp người thích ở gần biển, khu du lịch và trung tâm thành phố Nha Trang."));
    private int imageIndex = 0;

    private record MotelSeedSpec(
            String motelName,
            String address,
            Double area,
            Long averagePrice,
            int maxPerson,
            String methodOfCreation,
            String description) {}

    @Bean
    CommandLineRunner initDatabase(
            AccountRepository accountRepository,
            AuthRepository authRepository,
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            TypeRoomRepository typeRoomRepository,
            MotelRepository motelRepository,
            RoomRepository roomRepository,
            RoomImageRepository roomImageRepository,
            NameMotelServiceRepository nameMotelServiceRepository,
            ServiceRepository serviceRepository,
            MotelServiceRepository motelServiceRepository,
            RoomServiceRepository roomServiceRepository,
            DeviceRepository deviceRepository,
            MotelDeviceRepository motelDeviceRepository,
            RoomDeviceRepository roomDeviceRepository,
            ContractTemplateRepository contractTemplateRepository,
            TenantRepository tenantRepository,
            ContractRepository contractRepository,
            ContractOccupantRepository contractOccupantRepository,
            ContractServiceRepository contractServiceRepository,
            ContractDeviceRepository contractDeviceRepository,
            ContractDeviceHandoverRepository contractDeviceHandoverRepository,
            BrokerRepository brokerRepository,
            PaymentRepository paymentRepository,
            InvoiceRepository invoiceRepository,
            InvoiceDetailRepository detailInvoiceRepository,
            InvoiceAdditionItemRepository invoiceAdditionItemRepository,
            TransactionRepository transactionRepository,
            MeterReadingRepository meterReadingRepository,
            RoomReservationRepository roomReservationRepository,
            SupportRepository supportRepository,
            BulletinBoardRepository bulletinBoardRepository,
            BulletinBoardImageRepository bulletinBoardImageRepository,
            BulletinBoardReviewsRepository bulletinBoardReviewsRepository,
            RuleRepository ruleRepository,
            BulletinBoardRuleRepository bulletinBoardRuleRepository,
            RentalAmenitiesRepository rentalAmenitiesRepository,
            BulletinBoardRentalAmenityRepository bulletinBoardRentalAmenityRepository,
            CarRepository carRepository) {
        return args -> {
            if (accountRepository.count() > 0) {
                log.info("Database already seeded. Skipping...");
                return;
            }

            Faker faker = new Faker(new Locale("vi"));
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            log.info("Starting comprehensive data seeding...");

            // 1. Roles & Permissions
            ensureRolesAndPermissions(roleRepository, permissionRepository);

            // 2. Accounts & Auths
            Account admin = createAccount(
                    accountRepository,
                    authRepository,
                    roleRepository,
                    passwordEncoder,
                    "admin",
                    "Kiều Kiến Quốc Admin",
                    "kieukienquocvn@gmail.com",
                    "0919925302",
                    "001001001001",
                    Gender.MALE);
            Account host = createAccount(
                    accountRepository,
                    authRepository,
                    roleRepository,
                    passwordEncoder,
                    "host",
                    "Kiều Kiến Quốc",
                    "host@rrms.vn",
                    "0911000002",
                    "001001001002",
                    Gender.FEMALE);
            Account employee = createAccount(
                    accountRepository,
                    authRepository,
                    roleRepository,
                    passwordEncoder,
                    "employee",
                    "Kiều Kiến Quốc",
                    "employee@rrms.vn",
                    "0911000003",
                    "001001001003",
                    Gender.MALE);
            Account customer = createAccount(
                    accountRepository,
                    authRepository,
                    roleRepository,
                    passwordEncoder,
                    "customer",
                    "Kiều Kiến Quốc",
                    "customer@rrms.vn",
                    "0911000004",
                    "001001001004",
                    Gender.FEMALE);

            // 3. Metadata Tables
            Map<String, TypeRoom> typeRooms = seedTypeRooms(typeRoomRepository);
            seedNameMotelServices(nameMotelServiceRepository);
            Map<String, Service> coreServices = seedCoreServices(serviceRepository);
            List<Device> deviceCatalog = seedDeviceCatalog(deviceRepository);
            seedPaymentMethods(paymentRepository);

            // 4. Motels & Rooms
            List<Motel> motels = seedMotels(motelRepository, host, typeRooms.get("Trọ"));
            seedMotelExtras(motelServiceRepository, motelDeviceRepository, motels);

            List<Room> rooms = seedRooms(
                    roomRepository,
                    roomImageRepository,
                    roomServiceRepository,
                    roomDeviceRepository,
                    motels,
                    motelServiceRepository.findAll(),
                    motelDeviceRepository.findAll());

            // 5. Contracts & Tenants
            List<Tenant> tenants = seedTenants(tenantRepository, 10);
            seedContractTemplates(contractTemplateRepository, motels);
            seedBrokers(brokerRepository, motels);

            List<Contract> contracts = seedContracts(
                    contractRepository,
                    rooms,
                    tenants,
                    host,
                    contractTemplateRepository.findAll(),
                    brokerRepository.findAll());

            // 6. Contract Details
            seedContractDetails(
                    contractOccupantRepository,
                    contractServiceRepository,
                    contractDeviceRepository,
                    contractDeviceHandoverRepository,
                    contracts,
                    tenants,
                    deviceCatalog);

            // 7. Operations (Invoices, MeterReadings, etc)
            seedMeterReadings(meterReadingRepository, contracts, coreServices);
            seedInvoices(invoiceRepository, detailInvoiceRepository, invoiceAdditionItemRepository, contracts);
            seedTransactions(transactionRepository, invoiceRepository.findAll(), host);
            seedReservations(roomReservationRepository, rooms);
            seedCars(carRepository, contracts);
            seedSupports(supportRepository, customer, employee);

            // 8. Marketplace (Bulletin Boards)
            seedBulletinBoards(
                    faker,
                    bulletinBoardRepository,
                    bulletinBoardImageRepository,
                    bulletinBoardReviewsRepository,
                    ruleRepository,
                    bulletinBoardRuleRepository,
                    rentalAmenitiesRepository,
                    bulletinBoardRentalAmenityRepository,
                    rooms,
                    host,
                    customer);

            // 9. Favorites (ManyToMany)
            seedFavorites(accountRepository, bulletinBoardRepository, "customer", 3);

            log.info("Comprehensive seeding completed successfully.");
        };
    }

    private void ensureRolesAndPermissions(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        Map<String, Permission> pMap = new HashMap<>();
        String[] perms = {
            "CREATE_HOST",
            "UPDATE_HOST",
            "DELETE_HOST",
            "APPROVE_POST",
            "CREATE_MOTEL",
            "CREATE_ROOM",
            "CREATE_CONTRACT",
            "VIEW_REPORT"
        };
        for (String p : perms) {
            pMap.put(
                    p,
                    permissionRepository.save(Permission.builder()
                            .name(p)
                            .description("Permission for " + p)
                            .build()));
        }

        roleRepository.save(Role.builder()
                .roleName(Roles.ADMIN)
                .description("Full access")
                .permissions(new HashSet<>(pMap.values()))
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.HOST)
                .description("Landlord access")
                .permissions(Set.of(pMap.get("CREATE_MOTEL"), pMap.get("CREATE_ROOM"), pMap.get("CREATE_CONTRACT")))
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.CUSTOMER)
                .description("Tenant access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.EMPLOYEE)
                .description("Staff access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.BROKER)
                .description("Broker access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.GUEST)
                .description("Guest access")
                .permissions(new HashSet<>())
                .build());
    }

    private Account createAccount(
            AccountRepository repo,
            AuthRepository authRepo,
            RoleRepository roleRepo,
            BCryptPasswordEncoder pe,
            String user,
            String name,
            String email,
            String phone,
            String cccd,
            Gender gender) {
        Account acc = Account.builder()
                .username(user)
                .password(pe.encode(DEFAULT_PASSWORD))
                .fullName(name)
                .email(email)
                .phone(phone)
                .cccd(cccd)
                .gender(gender)
                .birthday(LocalDate.of(1995, 1, 1))
                .avatar("https://picsum.photos/seed/" + user + "/200/200")
                .build();
        acc = repo.save(acc);

        Roles rName =
                switch (user) {
                    case "admin" -> Roles.ADMIN;
                    case "host" -> Roles.HOST;
                    case "employee" -> Roles.EMPLOYEE;
                    case "broker" -> Roles.BROKER;
                    default -> Roles.CUSTOMER;
                };

        Auth auth = new Auth();
        auth.setAccount(acc);
        auth.setRole(roleRepo.findByRoleName(rName).orElseThrow());
        authRepo.save(auth);
        return acc;
    }

    private Map<String, TypeRoom> seedTypeRooms(TypeRoomRepository repo) {
        Map<String, TypeRoom> map = new HashMap<>();
        String[] types = {"Trọ", "Chung cư mini", "Ký túc xá", "Căn hộ dịch vụ"};
        for (String t : types) {
            map.put(t, repo.save(TypeRoom.builder().name(t).build()));
        }
        return map;
    }

    private void seedNameMotelServices(NameMotelServiceRepository repo) {
        String[][] data = {
            {"Điện", "Tiền điện"},
            {"Nước", "Tiền nước"},
            {"Rác", "Tiền rác"},
            {"Internet", "Tiền wifi"}
        };
        for (String[] d : data) {
            repo.save(NameMotelService.builder()
                    .typeService(d[0])
                    .nameService(d[1])
                    .build());
        }
    }

    private Map<String, Service> seedCoreServices(ServiceRepository repo) {
        Map<String, Service> map = new HashMap<>();
        map.put(
                "Electric",
                repo.save(Service.builder()
                        .nameService("Điện")
                        .typeService("Meter")
                        .build()));
        map.put(
                "Water",
                repo.save(Service.builder()
                        .nameService("Nước")
                        .typeService("Meter")
                        .build()));
        map.put(
                "Trash",
                repo.save(Service.builder()
                        .nameService("Rác")
                        .typeService("Fixed")
                        .build()));
        map.put(
                "Wifi",
                repo.save(Service.builder()
                        .nameService("Wifi")
                        .typeService("Fixed")
                        .build()));
        return map;
    }

    private List<Device> seedDeviceCatalog(DeviceRepository repo) {
        return repo.saveAll(List.of(
                Device.builder().deviceName("Điều hòa").available(true).build(),
                Device.builder().deviceName("Tủ lạnh").available(true).build(),
                Device.builder().deviceName("Giường").available(true).build()));
    }

    private void seedPaymentMethods(PaymentRepository repo) {
        repo.save(Payment.builder()
                .paymentName("Tiền mặt")
                .description("Thanh toán trực tiếp")
                .paymentDate(LocalDate.now())
                .build());
        repo.save(Payment.builder()
                .paymentName("Chuyển khoản")
                .description("Thanh toán qua ngân hàng")
                .paymentDate(LocalDate.now())
                .build());
    }

    private List<Motel> seedMotels(MotelRepository repo, Account host, TypeRoom tr) {
        List<Motel> motels = new ArrayList<>();
        for (MotelSeedSpec spec : MOTEL_SEED_SPECS) {
            motels.add(repo.save(Motel.builder()
                    .account(host)
                    .motelName(spec.motelName())
                    .address(spec.address())
                    .area(spec.area())
                    .averagePrice(spec.averagePrice())
                    .maxperson(spec.maxPerson())
                    .invoicedate(5)
                    .paymentdeadline(10)
                    .methodofcreation(spec.methodOfCreation())
                    .typeRoom(tr)
                    .build()));
        }
        return motels;
    }

    private void seedMotelExtras(MotelServiceRepository msRepo, MotelDeviceRepository mdRepo, List<Motel> motels) {
        for (Motel m : motels) {
            msRepo.save(MotelService.builder()
                    .motel(m)
                    .nameService("Điện")
                    .price(3500L)
                    .chargetype("METER")
                    .build());
            msRepo.save(MotelService.builder()
                    .motel(m)
                    .nameService("Nước")
                    .price(15000L)
                    .chargetype("METER")
                    .build());
            msRepo.save(MotelService.builder()
                    .motel(m)
                    .nameService("Wifi")
                    .price(100000L)
                    .chargetype("FIXED")
                    .build());

            mdRepo.save(MotelDevice.builder()
                    .motel(m)
                    .deviceName("Điều hòa")
                    .totalQuantity(5)
                    .totalUsing(2)
                    .totalNull(3)
                    .unit(Unit.CAI)
                    .build());
        }
    }

    private List<Room> seedRooms(
            RoomRepository rRepo,
            RoomImageRepository riRepo,
            RoomServiceRepository rsRepo,
            RoomDeviceRepository rdRepo,
            List<Motel> motels,
            List<MotelService> mServices,
            List<MotelDevice> mDevices) {
        List<Room> rooms = new ArrayList<>();
        for (Motel m : motels) {
            for (int i = 1; i <= 5; i++) {
                double basePrice = m.getAveragePrice() + ((i - 3) * 180000L);
                int area = 18 + (i * 3) + SEEDED_RANDOM.nextInt(4);
                Room r = rRepo.save(Room.builder()
                        .motel(m)
                        .name(String.format("Phòng %s-%02d", m.getMotelName().replace("Nhà nghỉ ", ""), i))
                        .price(basePrice)
                        .deposit(basePrice)
                        .area(area)
                        .group("Tầng " + (i <= 2 ? 1 : i <= 4 ? 2 : 3))
                        .status(i % 5 == 0 ? RoomStatus.RESERVED : RoomStatus.AVAILABLE)
                        .prioritize(i % 2 == 0 ? "Ban công" : "Cửa sổ lớn")
                        .finance("Thanh toán đầu tháng")
                        .description("Phòng riêng đầy đủ tiện nghi, sạch sẽ và đã được kiểm tra trước khi đăng.")
                        .build());
                rooms.add(r);

                for (int j = 0; j < 2; j++) {
                    riRepo.save(new RoomImage(
                            UUID.randomUUID(), r, "https://picsum.photos/400/300?random=" + (++imageIndex)));
                }

                mServices.stream()
                        .filter(ms -> ms.getMotel().getMotelId().equals(m.getMotelId()))
                        .forEach(ms -> {
                            rsRepo.save(RoomService.builder()
                                    .room(r)
                                    .service(ms)
                                    .quantity(1)
                                    .build());
                        });

                mDevices.stream()
                        .filter(md -> md.getMotel().getMotelId().equals(m.getMotelId()))
                        .forEach(md -> {
                            rdRepo.save(RoomDevice.builder()
                                    .room(r)
                                    .motelDevice(md)
                                    .quantity(1)
                                    .build());
                        });
            }
        }
        return rooms;
    }

    private List<Tenant> seedTenants(TenantRepository repo, int count) {
        Faker f = new Faker(new Locale("vi"));
        List<Tenant> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(repo.save(Tenant.builder()
                    .fullName(f.name().fullName())
                    .phone("09" + f.number().digits(8))
                    .cccd("001" + f.number().digits(9))
                    .email(f.internet().emailAddress())
                    .birthday(LocalDate.of(2000, 1, 1))
                    .gender(i % 2 == 0 ? Gender.MALE : Gender.FEMALE)
                    .address("TP. Hồ Chí Minh")
                    .job("Sinh viên")
                    .licenseDate(LocalDate.now())
                    .placeOfLicense("Công an TP.HCM")
                    .frontPhoto("front.jpg")
                    .backPhoto("back.jpg")
                    .role(true)
                    .relationship("Chủ")
                    .type_of_tenant(true)
                    .temporaryResidence(true)
                    .informationVerify(true)
                    .build()));
        }
        return list;
    }

    private void seedContractTemplates(ContractTemplateRepository repo, List<Motel> motels) {
        for (Motel m : motels) {
            repo.save(ContractTemplate.builder()
                    .motel(m)
                    .templatename("Mẫu hợp đồng " + m.getMotelName())
                    .namecontract("Hợp đồng thuê phòng")
                    .sortorder(1)
                    .content("Nội dung hợp đồng mẫu...")
                    .build());
        }
    }

    private void seedBrokers(BrokerRepository repo, List<Motel> motels) {
        for (int i = 0; i < motels.size(); i++) {
            repo.save(Broker.builder()
                    .name("Môi giới " + i)
                    .phone("098800011" + i)
                    .motelId(motels.get(i).getMotelId())
                    .commissionRate(10)
                    .build());
        }
    }

    private List<Contract> seedContracts(
            ContractRepository repo,
            List<Room> rooms,
            List<Tenant> tenants,
            Account host,
            List<ContractTemplate> templates,
            List<Broker> brokers) {
        List<Contract> contracts = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Room r = rooms.get(i);
            Tenant t = tenants.get(i);
            Contract c = repo.save(Contract.builder()
                    .room(r)
                    .tenant(t)
                    .account(host)
                    .contractTemplate(templates.get(0))
                    .broker(brokers.isEmpty() ? null : brokers.get(0))
                    .price(r.getPrice())
                    .actualPrice(r.getPrice())
                    .deposit(r.getDeposit())
                    .moveinDate(java.sql.Date.valueOf(LocalDate.now()))
                    .closeContract(java.sql.Date.valueOf(LocalDate.now().plusYears(1)))
                    .leaseTerm("12 tháng")
                    .collectioncycle("Hàng tháng")
                    .status(ContractStatus.ACTIVE)
                    .createdate(LocalDate.now())
                    .signcontract("da_ky")
                    .language("VN")
                    .countTenant(1)
                    .build());
            contracts.add(c);
            r.setStatus(RoomStatus.OCCUPIED);
        }
        return contracts;
    }

    private void seedContractDetails(
            ContractOccupantRepository coRepo,
            ContractServiceRepository csRepo,
            ContractDeviceRepository cdRepo,
            ContractDeviceHandoverRepository chRepo,
            List<Contract> contracts,
            List<Tenant> tenants,
            List<Device> devices) {
        for (Contract c : contracts) {
            coRepo.save(ContractOccupant.builder()
                    .contract(c)
                    .tenant(c.getTenant())
                    .moveInDate(LocalDate.now())
                    .isActive(true)
                    .build());
            coRepo.save(ContractOccupant.builder()
                    .contract(c)
                    .tenant(tenants.get(8))
                    .moveInDate(LocalDate.now())
                    .isActive(true)
                    .build());

            devices.forEach(d -> {
                chRepo.save(ContractDeviceHandover.builder()
                        .contract(c)
                        .device(d)
                        .quantity(1)
                        .conditionOnMoveIn("Mới")
                        .damageFee(0.0)
                        .build());
            });
        }
    }

    private void seedMeterReadings(
            MeterReadingRepository repo, List<Contract> contracts, Map<String, Service> services) {
        for (Contract c : contracts) {
            repo.save(MeterReading.builder()
                    .room(c.getRoom())
                    .service(services.get("Electric"))
                    .oldIndex(100.0)
                    .newIndex(150.0)
                    .usageAmount(50.0)
                    .readingDate(LocalDate.now())
                    .build());
            repo.save(MeterReading.builder()
                    .room(c.getRoom())
                    .service(services.get("Water"))
                    .oldIndex(10.0)
                    .newIndex(15.0)
                    .usageAmount(5.0)
                    .readingDate(LocalDate.now())
                    .build());
        }
    }

    private void seedInvoices(
            InvoiceRepository iRepo,
            InvoiceDetailRepository diRepo,
            InvoiceAdditionItemRepository iaRepo,
            List<Contract> contracts) {
        for (Contract c : contracts) {
            Invoice inv = iRepo.save(Invoice.builder()
                    .contract(c)
                    .tenant(c.getTenant())
                    .invoiceReason("Tiền phòng tháng " + LocalDate.now().getMonthValue())
                    .invoiceCreateMonth(YearMonth.now())
                    .invoiceCreateDate(LocalDate.now())
                    .dueDate(LocalDate.now().plusDays(5))
                    .paymentStatus(PaymentStatus.UNPAID)
                    .build());

            iaRepo.save(InvoiceAdditionItem.builder()
                    .invoice(inv)
                    .reason("Phụ phí vệ sinh")
                    .amount(50000.0)
                    .isAddition(true)
                    .build());
        }
    }

    private void seedTransactions(TransactionRepository repo, List<Invoice> invoices, Account host) {
        for (Invoice inv : invoices) {
            repo.save(Transaction.builder()
                    .account(host)
                    .invoice(inv)
                    .transactionDate(LocalDate.now())
                    .transactionType(true)
                    .amount(new BigDecimal("3050000"))
                    .payerName(inv.getTenant().getFullName())
                    .paymentDescription("Thanh toán tiền phòng")
                    .category("THU")
                    .build());
        }
    }

    private void seedReservations(RoomReservationRepository repo, List<Room> rooms) {
        repo.save(Reserve_a_place.builder()
                .room(rooms.get(10))
                .nametenant("Khách Đặt Cọc")
                .phonetenant("0977111222")
                .deposit(1000000.0)
                .status(ContractStatus.DEPOSITED)
                .createdate(java.sql.Date.valueOf(LocalDate.now()))
                .moveinDate(java.sql.Date.valueOf(LocalDate.now().plusDays(7)))
                .build());
    }

    private void seedCars(CarRepository repo, List<Contract> contracts) {
        repo.save(Car.builder()
                .room(contracts.get(0).getRoom())
                .name("Honda Vision")
                .number("59-X1 123.45")
                .image("car.jpg")
                .build());
    }

    private void seedSupports(SupportRepository repo, Account customer, Account employee) {
        Support s1 = new Support();
        s1.setAccount(customer);
        s1.setNameContact(customer.getFullName());
        s1.setPhoneContact(customer.getPhone());
        s1.setCreateDate(LocalDateTime.now());
        s1.setPriceFirst(2000000L);
        s1.setPriceEnd(4000000L);
        s1.setDateOfStay(java.sql.Date.valueOf(LocalDate.now()));
        repo.save(s1);
    }

    private void seedBulletinBoards(
            Faker f,
            BulletinBoardRepository bbRepo,
            BulletinBoardImageRepository bbiRepo,
            BulletinBoardReviewsRepository bbrRepo,
            RuleRepository ruleRepo,
            BulletinBoardRuleRepository bbrlRepo,
            RentalAmenitiesRepository raRepo,
            BulletinBoardRentalAmenityRepository bbraRepo,
            List<Room> rooms,
            Account host,
            Account customer) {
        List<String> defaultAmenities =
                List.of("Wifi tốc độ cao", "Máy lạnh", "Giữ xe", "Máy giặt", "Giờ giấc linh hoạt");
        List<String> defaultRules = List.of(
                "Không làm ồn sau 22h",
                "Giữ gìn vệ sinh khu sinh hoạt chung",
                "Không nuôi thú cưng kích thước lớn",
                "Thông báo trước khi chuyển phòng");

        for (int i = 0; i < rooms.size(); i++) {
            Room room = rooms.get(i);
            Motel motel = room.getMotel();
            MotelSeedSpec seedSpec = MOTEL_SEED_SPECS.stream()
                    .filter(spec -> spec.motelName().equals(motel.getMotelName()))
                    .findFirst()
                    .orElse(null);
            BigDecimal rentPrice = BigDecimal.valueOf(room.getPrice());
            BigDecimal promotionalPrice =
                    i % 3 == 0 ? null : rentPrice.subtract(BigDecimal.valueOf(150000L + (i % 3) * 50000L));

            BulletinBoard bb = BulletinBoard.builder()
                    .account(host)
                    .motel(motel)
                    .room(room)
                    .title(room.getName() + " - " + motel.getMotelName())
                    .rentalCategory("Nhà nghỉ")
                    .description(buildBulletinBoardDescription(seedSpec, room))
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
            bb.setStatus(true);
            bb.setIsActive(true);
            bb = bbRepo.save(bb);

            for (int image = 0; image < 3; image++) {
                bbiRepo.save(new BulletinBoardImage(
                        UUID.randomUUID(), bb, "https://picsum.photos/800/600?random=" + (++imageIndex)));
            }

            for (String ruleName : defaultRules.subList(0, 2 + (i % 2))) {
                Rule r = ruleRepo.save(
                        Rule.builder().ruleName(ruleName).price(0L).build());
                bbrlRepo.save(
                        BulletinBoardRule.builder().bulletinBoard(bb).rule(r).build());
            }

            for (String amenityName : defaultAmenities.subList(0, 3 + (i % 2))) {
                RentalAmenities ra = raRepo.save(
                        RentalAmenities.builder().name(amenityName + " " + i).build());
                bbraRepo.save(new BulletinBoardRentalAmenity(UUID.randomUUID(), ra, bb));
            }

            int reviewCount = 1 + (i % 3);
            for (int reviewIndex = 0; reviewIndex < reviewCount; reviewIndex++) {
                bbrRepo.save(BulletinBoardReviews.builder()
                        .account(customer)
                        .bulletinBoard(bb)
                        .rating(4 + (reviewIndex % 2))
                        .content(buildReviewComment(f, motel, reviewIndex))
                        .build());
            }
        }
    }

    private String buildBulletinBoardDescription(MotelSeedSpec seedSpec, Room room) {
        String baseDescription = seedSpec != null
                ? seedSpec.description()
                : "Tin đăng đã được kiểm tra thông tin cơ bản trước khi hiển thị.";

        return baseDescription + " " + room.getName() + " có " + room.getArea() + "m2, mức giá "
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

    private void seedFavorites(AccountRepository aRepo, BulletinBoardRepository bRepo, String user, int count) {
        Account acc = aRepo.findByUsername(user).orElse(null);
        if (acc == null) return;

        List<BulletinBoard> boards = bRepo.findAll().stream().limit(count).toList();
        acc.setFavoriteBulletinBoards(new ArrayList<>(boards));
        aRepo.save(acc);
    }
}
