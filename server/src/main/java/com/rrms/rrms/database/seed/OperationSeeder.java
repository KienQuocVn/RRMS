package com.rrms.rrms.database.seed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.PaymentStatus;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Car;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.models.InvoiceAdditionItem;
import com.rrms.rrms.models.MeterReading;
import com.rrms.rrms.models.Reserve_a_place;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Service;
import com.rrms.rrms.models.Support;
import com.rrms.rrms.models.Transaction;
import com.rrms.rrms.repositories.CarRepository;
import com.rrms.rrms.repositories.InvoiceAdditionItemRepository;
import com.rrms.rrms.repositories.InvoiceDetailRepository;
import com.rrms.rrms.repositories.InvoiceRepository;
import com.rrms.rrms.repositories.MeterReadingRepository;
import com.rrms.rrms.repositories.RoomReservationRepository;
import com.rrms.rrms.repositories.SupportRepository;
import com.rrms.rrms.repositories.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * OperationSeeder - Seed dữ liệu vận hành:
 * MeterReading, Invoice, Transaction, Reservation, Car, Support.
 * Thứ tự chạy: 5 (sau ContractSeeder)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OperationSeeder {

    private final MeterReadingRepository meterReadingRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceAdditionItemRepository invoiceAdditionItemRepository;
    private final TransactionRepository transactionRepository;
    private final RoomReservationRepository roomReservationRepository;
    private final CarRepository carRepository;
    private final SupportRepository supportRepository;

    // ── Meter Readings ────────────────────────────────────────────────────────

    public void seedMeterReadings(List<Contract> contracts, Map<String, Service> services) {
        log.info("[OperationSeeder] Seeding MeterReadings...");
        for (Contract c : contracts) {
            meterReadingRepository.save(MeterReading.builder()
                    .room(c.getRoom())
                    .service(services.get("Electric"))
                    .oldIndex(100.0)
                    .newIndex(150.0)
                    .usageAmount(50.0)
                    .readingDate(LocalDate.now())
                    .build());
            meterReadingRepository.save(MeterReading.builder()
                    .room(c.getRoom())
                    .service(services.get("Water"))
                    .oldIndex(10.0)
                    .newIndex(15.0)
                    .usageAmount(5.0)
                    .readingDate(LocalDate.now())
                    .build());
        }
    }

    // ── Invoices ──────────────────────────────────────────────────────────────

    public void seedInvoices(List<Contract> contracts) {
        log.info("[OperationSeeder] Seeding Invoices...");
        for (Contract c : contracts) {
            Invoice inv = invoiceRepository.save(Invoice.builder()
                    .contract(c)
                    .tenant(c.getTenant())
                    .invoiceReason("Tiền phòng tháng " + LocalDate.now().getMonthValue())
                    .invoiceCreateMonth(YearMonth.now())
                    .invoiceCreateDate(LocalDate.now())
                    .dueDate(LocalDate.now().plusDays(5))
                    .paymentStatus(PaymentStatus.UNPAID)
                    .build());

            invoiceAdditionItemRepository.save(InvoiceAdditionItem.builder()
                    .invoice(inv)
                    .reason("Phụ phí vệ sinh")
                    .amount(50000.0)
                    .isAddition(true)
                    .build());
        }
    }

    // ── Transactions ──────────────────────────────────────────────────────────

    public void seedTransactions(List<Invoice> invoices, Account host) {
        log.info("[OperationSeeder] Seeding Transactions...");
        for (Invoice inv : invoices) {
            transactionRepository.save(Transaction.builder()
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

    // ── Reservations ──────────────────────────────────────────────────────────

    public void seedReservations(List<Room> rooms) {
        log.info("[OperationSeeder] Seeding Reservations...");
        roomReservationRepository.save(Reserve_a_place.builder()
                .room(rooms.get(10))
                .nametenant("Khách Đặt Cọc")
                .phonetenant("0977111222")
                .deposit(1000000.0)
                .status(ContractStatus.DEPOSITED)
                .createdate(java.sql.Date.valueOf(LocalDate.now()))
                .moveinDate(java.sql.Date.valueOf(LocalDate.now().plusDays(7)))
                .build());
    }

    // ── Cars ──────────────────────────────────────────────────────────────────

    public void seedCars(List<Contract> contracts) {
        log.info("[OperationSeeder] Seeding Cars...");
        carRepository.save(Car.builder()
                .room(contracts.get(0).getRoom())
                .name("Honda Vision")
                .number("59-X1 123.45")
                .image("car.jpg")
                .build());
    }

    // ── Supports ──────────────────────────────────────────────────────────────

    /**
     * Spec nội bộ cho support seed.
     */
    private record SupportSeedSpec(
            Account account, String nameContact, String phoneContact, int daysAgo, long priceFirst, long priceEnd) {}

    public void seedSupports(Account customer, Account employee) {
        log.info("[OperationSeeder] Seeding Supports...");
        List<SupportSeedSpec> specs = List.of(
                new SupportSeedSpec(customer, customer.getFullName(), customer.getPhone(), 0, 2000000L, 4000000L),
                new SupportSeedSpec(employee, "Nguyen Thanh Ha", "0901000101", 1, 2800000L, 5200000L),
                new SupportSeedSpec(customer, "Tran Minh Duc", "0901000102", 2, 3200000L, 6500000L),
                new SupportSeedSpec(employee, "Pham Hoai Linh", "0901000103", 3, 1800000L, 3500000L),
                new SupportSeedSpec(customer, "Le Gia Bao", "0901000104", 5, 2500000L, 4500000L),
                new SupportSeedSpec(employee, "Vo Khanh Vy", "0901000105", 8, 4000000L, 7500000L),
                new SupportSeedSpec(customer, "Dang Quoc Anh", "0901000106", 12, 2200000L, 3900000L),
                new SupportSeedSpec(employee, "Bui Ngoc Diep", "0901000107", 18, 3000000L, 6000000L),
                new SupportSeedSpec(customer, "Hoang Thao Chi", "0901000108", 24, 3500000L, 7000000L),
                new SupportSeedSpec(employee, "Mai Phuc Nguyen", "0901000109", 31, 2600000L, 4800000L));

        for (SupportSeedSpec spec : specs) {
            Support support = new Support();
            support.setAccount(spec.account());
            support.setNameContact(spec.nameContact());
            support.setPhoneContact(spec.phoneContact());
            support.setCreateDate(LocalDateTime.now().minusDays(spec.daysAgo()));
            support.setPriceFirst(spec.priceFirst());
            support.setPriceEnd(spec.priceEnd());
            support.setDateOfStay(java.sql.Date.valueOf(LocalDate.now().plusDays(Math.max(1, 7 - spec.daysAgo()))));
            supportRepository.save(support);
        }
    }
}
