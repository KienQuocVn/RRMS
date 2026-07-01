package com.rrms.rrms.database;

import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.database.seed.AccountSeeder;
import com.rrms.rrms.database.seed.CatalogSeeder;
import com.rrms.rrms.database.seed.ContractSeeder;
import com.rrms.rrms.database.seed.MarketplaceSeeder;
import com.rrms.rrms.database.seed.OperationSeeder;
import com.rrms.rrms.database.seed.PropertySeeder;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.Device;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelDevice;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Service;
import com.rrms.rrms.models.Tenant;
import com.rrms.rrms.models.TypeRoom;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.InvoiceRepository;
import com.rrms.rrms.repositories.MotelDeviceRepository;
import com.rrms.rrms.repositories.MotelServiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * DB - Orchestrator khởi tạo dữ liệu mẫu (seed) cho môi trường dev.
 *
 * <p>File này chỉ chứa logic điều phối (thứ tự gọi các seeder).
 * Mỗi nhóm dữ liệu được quản lý bởi một Seeder riêng trong package
 * {@code com.rrms.rrms.database.seed}:
 *
 * <ul>
 *   <li>{@link AccountSeeder}    – Roles, Permissions, Accounts</li>
 *   <li>{@link CatalogSeeder}    – TypeRoom, NameMotelService, Service, Device, Payment</li>
 *   <li>{@link PropertySeeder}   – Motel, Room, MotelService, MotelDevice</li>
 *   <li>{@link ContractSeeder}   – Tenant, ContractTemplate, Broker, Contract, ContractDetail</li>
 *   <li>{@link OperationSeeder}  – MeterReading, Invoice, Transaction, Reservation, Car, Support</li>
 *   <li>{@link MarketplaceSeeder}– BulletinBoard, ViolationReport, Favorites</li>
 * </ul>
 */
@Configuration
@Slf4j
@Transactional
@Profile("dev")
@RequiredArgsConstructor
public class DB {

    private final AccountRepository accountRepository;
    private final MotelServiceRepository motelServiceRepository;
    private final MotelDeviceRepository motelDeviceRepository;
    private final InvoiceRepository invoiceRepository;

    private final AccountSeeder accountSeeder;
    private final CatalogSeeder catalogSeeder;
    private final PropertySeeder propertySeeder;
    private final ContractSeeder contractSeeder;
    private final OperationSeeder operationSeeder;
    private final MarketplaceSeeder marketplaceSeeder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (accountRepository.count() > 0) {
                log.info("Database already seeded. Skipping...");
                return;
            }

            log.info("========== Starting comprehensive data seeding ==========");

            // ── 1. Roles & Permissions ─────────────────────────────────────────
            accountSeeder.seedRolesAndPermissions();

            // ── 2. Accounts ────────────────────────────────────────────────────
            Account admin = accountSeeder.seedAdmin();
            Account host = accountSeeder.seedHost();
            Account employee = accountSeeder.seedEmployee();
            Account customer = accountSeeder.seedCustomer();

            // ── 3. Danh mục tĩnh ──────────────────────────────────────────────
            Map<String, TypeRoom> typeRooms = catalogSeeder.seedTypeRooms();
            catalogSeeder.seedNameMotelServices();
            Map<String, Service> coreServices = catalogSeeder.seedCoreServices();
            List<Device> deviceCatalog = catalogSeeder.seedDeviceCatalog();
            catalogSeeder.seedPaymentMethods();

            // ── 4. Nhà trọ & Phòng ────────────────────────────────────────────
            List<Motel> motels = propertySeeder.seedMotels(host, typeRooms.get("Trọ"));
            propertySeeder.seedMotelExtras(motels);

            // imageIndex được chia sẻ giữa PropertySeeder và MarketplaceSeeder
            int[] imageIndexRef = {0};
            List<MotelService> allMotelServices = motelServiceRepository.findAll();
            List<MotelDevice> allMotelDevices = motelDeviceRepository.findAll();
            List<Room> rooms = propertySeeder.seedRooms(motels, allMotelServices, allMotelDevices, imageIndexRef);

            // ── 5. Hợp đồng & Khách thuê ──────────────────────────────────────
            List<Tenant> tenants = contractSeeder.seedTenants(10);
            contractSeeder.seedContractTemplates(motels);
            contractSeeder.seedBrokers(motels);
            List<Contract> contracts = contractSeeder.seedContracts(rooms, tenants, host);
            contractSeeder.seedContractDetails(contracts, tenants, deviceCatalog);

            // ── 6. Vận hành ───────────────────────────────────────────────────
            operationSeeder.seedMeterReadings(contracts, coreServices);
            operationSeeder.seedInvoices(contracts);
            operationSeeder.seedTransactions(invoiceRepository.findAll(), host);
            operationSeeder.seedReservations(rooms);
            operationSeeder.seedCars(contracts);
            operationSeeder.seedSupports(customer, employee);

            // ── 7. Thị trường bài đăng ────────────────────────────────────────
            List<BulletinBoard> bulletinBoards = marketplaceSeeder.seedBulletinBoards(
                    rooms, host, customer, PropertySeeder.MOTEL_SEED_SPECS, imageIndexRef);
            marketplaceSeeder.seedViolationReports(bulletinBoards, host, customer, employee);
            marketplaceSeeder.seedFavorites("customer", 3);

            log.info("========== Comprehensive seeding completed successfully ==========");
        };
    }
}
