package com.rrms.rrms.database.seed;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.Gender;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Broker;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.ContractDevice;
import com.rrms.rrms.models.ContractDeviceHandover;
import com.rrms.rrms.models.ContractOccupant;
import com.rrms.rrms.models.ContractService;
import com.rrms.rrms.models.ContractTemplate;
import com.rrms.rrms.models.Device;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelDevice;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Tenant;
import com.rrms.rrms.repositories.BrokerRepository;
import com.rrms.rrms.repositories.ContractDeviceHandoverRepository;
import com.rrms.rrms.repositories.ContractDeviceRepository;
import com.rrms.rrms.repositories.ContractOccupantRepository;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.repositories.ContractServiceRepository;
import com.rrms.rrms.repositories.ContractTemplateRepository;
import com.rrms.rrms.repositories.MotelDeviceRepository;
import com.rrms.rrms.repositories.MotelServiceRepository;
import com.rrms.rrms.repositories.TenantRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;

/**
 * ContractSeeder - Seed dữ liệu Tenant, ContractTemplate, Broker, Contract và chi tiết hợp đồng.
 * Thứ tự chạy: 4 (sau PropertySeeder)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ContractSeeder {

    private final TenantRepository tenantRepository;
    private final ContractTemplateRepository contractTemplateRepository;
    private final BrokerRepository brokerRepository;
    private final ContractRepository contractRepository;
    private final ContractOccupantRepository contractOccupantRepository;
    private final ContractServiceRepository contractServiceRepository;
    private final ContractDeviceRepository contractDeviceRepository;
    private final ContractDeviceHandoverRepository contractDeviceHandoverRepository;
    private final MotelServiceRepository motelServiceRepository;
    private final MotelDeviceRepository motelDeviceRepository;

    // ── Tenants ───────────────────────────────────────────────────────────────

    public List<Tenant> seedTenants(int count) {
        log.info("[ContractSeeder] Seeding {} Tenants...", count);
        Faker f = new Faker(new Locale("vi"));
        List<Tenant> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(tenantRepository.save(Tenant.builder()
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

    // ── Contract Templates ────────────────────────────────────────────────────

    public void seedContractTemplates(List<Motel> motels) {
        log.info("[ContractSeeder] Seeding ContractTemplates...");
        for (Motel m : motels) {
            contractTemplateRepository.save(ContractTemplate.builder()
                    .motel(m)
                    .templatename("Mẫu hợp đồng " + m.getMotelName())
                    .namecontract("Hợp đồng thuê phòng")
                    .sortorder(1)
                    .content("Nội dung hợp đồng mẫu...")
                    .build());
        }
    }

    // ── Brokers ───────────────────────────────────────────────────────────────

    public void seedBrokers(List<Motel> motels) {
        log.info("[ContractSeeder] Seeding Brokers...");
        for (int i = 0; i < motels.size(); i++) {
            brokerRepository.save(Broker.builder()
                    .name("Môi giới " + i)
                    .phone("098800011" + i)
                    .motelId(motels.get(i).getMotelId())
                    .commissionRate(10)
                    .build());
        }
    }

    // ── Contracts ─────────────────────────────────────────────────────────────

    /**
     * Seed 10 hợp đồng, mỗi motel lấy phòng đầu tiên (index = i * 5).
     */
    public List<Contract> seedContracts(List<Room> rooms, List<Tenant> tenants, Account host) {
        log.info("[ContractSeeder] Seeding Contracts...");
        List<ContractTemplate> templates = contractTemplateRepository.findAll();
        List<Broker> brokers = brokerRepository.findAll();
        List<Contract> contracts = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            Room r = rooms.get(i * 5); // Phòng đầu tiên của motel thứ i
            Tenant t = tenants.get(i);
            Contract c = contractRepository.save(Contract.builder()
                    .room(r)
                    .tenant(t)
                    .account(host)
                    .contractTemplate(templates.get(i % templates.size()))
                    .broker(brokers.isEmpty() ? null : brokers.get(i % brokers.size()))
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
            r.setStatus(com.rrms.rrms.enums.RoomStatus.OCCUPIED);
        }
        return contracts;
    }

    // ── Contract Details ──────────────────────────────────────────────────────

    /**
     * Seed ContractOccupant, ContractService, ContractDevice, ContractDeviceHandover.
     */
    public void seedContractDetails(List<Contract> contracts, List<Tenant> tenants, List<Device> devices) {
        log.info("[ContractSeeder] Seeding ContractDetails...");
        List<MotelService> allMotelServices = motelServiceRepository.findAll();
        List<MotelDevice> allMotelDevices = motelDeviceRepository.findAll();

        for (Contract c : contracts) {
            // Occupants
            contractOccupantRepository.save(ContractOccupant.builder()
                    .contract(c)
                    .tenant(c.getTenant())
                    .moveInDate(LocalDate.now())
                    .isActive(true)
                    .build());
            contractOccupantRepository.save(ContractOccupant.builder()
                    .contract(c)
                    .tenant(tenants.get(8))
                    .moveInDate(LocalDate.now())
                    .isActive(true)
                    .build());

            // Device handovers
            devices.forEach(d -> contractDeviceHandoverRepository.save(ContractDeviceHandover.builder()
                    .contract(c)
                    .device(d)
                    .quantity(1)
                    .conditionOnMoveIn("Mới")
                    .damageFee(0.0)
                    .build()));

            // Services
            allMotelServices.stream()
                    .filter(ms -> ms.getMotel()
                            .getMotelId()
                            .equals(c.getRoom().getMotel().getMotelId()))
                    .forEach(ms -> contractServiceRepository.save(
                            ContractService.builder().contract(c).service(ms).build()));

            // Devices
            allMotelDevices.stream()
                    .filter(md -> md.getMotel()
                            .getMotelId()
                            .equals(c.getRoom().getMotel().getMotelId()))
                    .forEach(md -> contractDeviceRepository.save(ContractDevice.builder()
                            .contract(c)
                            .motelDevice(md)
                            .quantity(1)
                            .build()));
        }
    }
}
