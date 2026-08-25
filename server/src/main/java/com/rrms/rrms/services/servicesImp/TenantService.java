package com.rrms.rrms.services.servicesImp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.TenantRequest;
import com.rrms.rrms.dto.response.TenantResponse;
import com.rrms.rrms.dto.response.TenantSummaryDTO;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.TenantMapper;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.ContractOccupant;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.Tenant;
import com.rrms.rrms.repositories.ContractOccupantRepository;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.repositories.TenantRepository;
import com.rrms.rrms.services.ITenantService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TenantService implements ITenantService {
    private final TenantRepository tenantRepository;

    private final TenantMapper tenantMapper;

    final RoomRepository roomRepository;

    private final MotelRepository motelRepository;

    private final ContractRepository contractRepository;

    private final ContractOccupantRepository contractOccupantRepository;

    private final com.rrms.rrms.repositories.AccountRepository accountRepository;

    private final com.rrms.rrms.repositories.InvoiceRepository invoiceRepository;

    @Override
    public TenantResponse insert(UUID roomId, TenantRequest tenant) {
        // Luôn tạo Tenant mới
        Tenant newt = tenantMapper.tenantRequestToTenant(tenant);
        sanitizeTenant(newt);
        validateTenantForInsert(newt);
        Tenant savedTenant = tenantRepository.save(newt);

        // Tìm xem phòng đã có hợp đồng đang active không (trường hợp thêm người vào phòng đang thuê)
        List<Contract> contracts = contractRepository.findByRoomRoomId(roomId);
        Contract activeContract = contracts.stream()
                .filter(c -> c.getStatus() == ContractStatus.ACTIVE)
                .findFirst()
                .orElse(null);

        // Nếu có hợp đồng active, tự động thêm khách thuê này làm người ở (ContractOccupant)
        if (activeContract != null) {
            ContractOccupant occupant = new ContractOccupant();
            occupant.setContract(activeContract);
            occupant.setTenant(savedTenant);
            occupant.setMoveInDate(LocalDate.now());
            occupant.setIsActive(true);
            contractOccupantRepository.save(occupant);
        }

        // Luôn trả về thông tin khách thuê (để Frontend lấy tenantId tạo hợp đồng nếu phòng đang trống)
        return tenantMapper.toTenantResponse(savedTenant);
    }

    private void sanitizeTenant(Tenant tenant) {
        tenant.setFullName(normalizeBlank(tenant.getFullName()));
        tenant.setPhone(normalizeBlank(tenant.getPhone()));
        tenant.setCccd(normalizeBlank(tenant.getCccd()));
        tenant.setEmail(normalizeBlank(tenant.getEmail()));
        tenant.setAddress(normalizeBlank(tenant.getAddress()));
        tenant.setJob(normalizeBlank(tenant.getJob()));
        tenant.setPlaceOfLicense(normalizeBlank(tenant.getPlaceOfLicense()));
        tenant.setFrontPhoto(normalizeBlank(tenant.getFrontPhoto()));
        tenant.setBackPhoto(normalizeBlank(tenant.getBackPhoto()));
        tenant.setRelationship(normalizeBlank(tenant.getRelationship()));

        if (tenant.getRole() == null) {
            tenant.setRole(Boolean.TRUE);
        }
        if (tenant.getType_of_tenant() == null) {
            tenant.setType_of_tenant(Boolean.FALSE);
        }
        if (tenant.getTemporaryResidence() == null) {
            tenant.setTemporaryResidence(Boolean.FALSE);
        }
        if (tenant.getInformationVerify() == null) {
            tenant.setInformationVerify(Boolean.FALSE);
        }
    }

    private void validateTenantForInsert(Tenant tenant) {
        if (tenant.getFullName() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Tenant full name is required");
        }

        if (tenant.getCccd() != null && tenantRepository.existsByCccd(tenant.getCccd())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "CCCD already exists");
        }
    }

    private String normalizeBlank(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    @Override
    public TenantResponse findById(UUID id) {
        return tenantRepository
                .findById(id)
                .map(tenant -> {
                    TenantResponse response = tenantMapper.toTenantResponse(tenant);

                    // Tìm phòng trọ, địa chỉ nhà trọ và chủ hộ (đại diện liên hệ của phòng)
                    if (tenant.getContractOccupants() != null) {
                        tenant.getContractOccupants().stream()
                                .filter(co -> co.getIsActive() != null && co.getIsActive())
                                .findFirst()
                                .ifPresent(co -> {
                                    Contract contract = co.getContract();
                                    if (contract != null) {
                                        Room room = contract.getRoom();
                                        if (room != null) {
                                            response.setRoomName(room.getName());
                                            Motel motel = room.getMotel();
                                            if (motel != null) {
                                                response.setMotelAddress(motel.getAddress());
                                            }
                                        }
                                        Tenant primaryTenant = contract.getTenant();
                                        if (primaryTenant != null) {
                                            response.setHostName(primaryTenant.getFullName());
                                            response.setHostCccd(primaryTenant.getCccd());
                                        }
                                    }
                                });
                    }

                    if (response.getRoomName() == null && tenant.getContracts() != null) {
                        tenant.getContracts().stream().findFirst().ifPresent(contract -> {
                            Room room = contract.getRoom();
                            if (room != null) {
                                response.setRoomName(room.getName());
                                Motel motel = room.getMotel();
                                if (motel != null) {
                                    response.setMotelAddress(motel.getAddress());
                                }
                            }
                            response.setHostName(tenant.getFullName());
                            response.setHostCccd(tenant.getCccd());
                        });
                    }

                    return response;
                })
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found"));
    }

    @Override
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toTenantResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TenantResponse update(UUID id, TenantRequest tenantRequest) {
        // TÃ¬m tenant theo id
        Optional<Tenant> tenantFind = tenantRepository.findById(id);
        if (tenantFind.isPresent()) {
            Tenant tenant = tenantFind.get();

            // Cáº­p nháº­t cÃ¡c trÆ°á»ng tá»« tenantRequest vÃ o tenant hiá»‡n cÃ³
            tenantMapper.updateTenantFromRequest(tenantRequest, tenant);

            // LÆ°u báº£n ghi sau khi cáº­p nháº­t
            return tenantMapper.toTenantResponse(tenantRepository.save(tenant));
        }
        return null;
    }

    @Override
    public void delete(UUID id) {
        Optional<Tenant> tenant = tenantRepository.findById(id);
        if (tenant.isPresent()) {
            tenantRepository.deleteById(id);
        }
    }

    @Override
    public void deleteByRoomId(UUID roomId) {
        Optional<Room> Room = roomRepository.findById(roomId);
        if (Room.isPresent()) {
            contractOccupantRepository.deleteByContract_Room_RoomId(roomId);
        }
    }

    @Override
    public List<TenantResponse> getAllTenantsRoomId(UUID roomId) {
        return contractOccupantRepository.findByContract_Room_RoomId(roomId).stream()
                .map(occupant -> tenantMapper.toTenantResponse(occupant.getTenant()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantResponse> getAllTenantsByMotelId(UUID motelId) {
        Map<String, TenantResponse> tenantsByContract = new LinkedHashMap<>();

        contractOccupantRepository.findByContract_Room_Motel_MotelId(motelId).forEach(occupant -> {
            if (occupant.getTenant() == null || occupant.getContract() == null) {
                return;
            }

            TenantResponse response = tenantMapper.toTenantResponse(occupant.getTenant());
            if (occupant.getContract() != null && occupant.getContract().getRoom() != null) {
                response.setRoomName(occupant.getContract().getRoom().getName());
                if (occupant.getContract().getRoom().getMotel() != null) {
                    response.setMotelAddress(
                            occupant.getContract().getRoom().getMotel().getAddress());
                }
            }
            String key = response.getTenantId() + ":" + occupant.getContract().getContractId();
            tenantsByContract.putIfAbsent(key, response);
        });

        contractRepository.findByRoom_Motel_MotelId(motelId).forEach(contract -> {
            if (contract.getTenant() == null) {
                return;
            }

            TenantResponse response = tenantMapper.toTenantResponse(contract.getTenant());
            if (contract.getRoom() != null) {
                response.setRoomName(contract.getRoom().getName());
                if (contract.getRoom().getMotel() != null) {
                    response.setMotelAddress(contract.getRoom().getMotel().getAddress());
                }
            }
            String key = response.getTenantId() + ":" + contract.getContractId();
            tenantsByContract.putIfAbsent(key, response);
        });

        return new ArrayList<>(tenantsByContract.values());
    }

    @Override
    public List<TenantSummaryDTO> getTenantSummary() {
        List<Motel> motels = motelRepository.findAll();
        List<TenantSummaryDTO> summaries = new ArrayList<>();

        for (Motel motel : motels) {
            long notRegisteredCount = contractRepository.findByRoom_Motel(motel).stream()
                    .map(Contract::getTenant)
                    .filter(tenant -> !tenant.getTemporaryResidence()) // ChÆ°a Ä‘Äƒng kÃ½ táº¡m trÃº
                    .count();

            long notProvidedInfoCount = contractRepository.findByRoom_Motel(motel).stream()
                    .map(Contract::getTenant)
                    .filter(tenant -> !tenant.getInformationVerify()) // ChÆ°a cung cáº¥p thÃ´ng tin
                    .count();

            summaries.add(new TenantSummaryDTO(
                    motel.getMotelId(), motel.getMotelName(), notRegisteredCount, notProvidedInfoCount));
        }

        return summaries;
    }

    @Override
    public com.rrms.rrms.dto.response.CustomerDashboardResponse getCustomerDashboard(String username) {
        String queryUser = (username == null || username.isBlank()) ? "customer" : username;
        com.rrms.rrms.models.Account acc = accountRepository
                .findByUsername(queryUser)
                .orElseGet(() -> accountRepository.findByEmail(queryUser).orElse(null));

        String fullName = acc != null && acc.getFullName() != null ? acc.getFullName() : "Kiều Kiến Quốc";
        String email = acc != null && acc.getEmail() != null ? acc.getEmail() : "customer@rrms.vn";
        String phone = acc != null && acc.getPhone() != null ? acc.getPhone() : "0911000004";
        String cccd = acc != null && acc.getCccd() != null ? acc.getCccd() : "001001001004";

        Tenant tenant = tenantRepository.findAll().stream()
                .filter(t -> (t.getEmail() != null && t.getEmail().equalsIgnoreCase(email))
                        || (t.getPhone() != null && t.getPhone().equalsIgnoreCase(phone))
                        || (t.getCccd() != null && t.getCccd().equalsIgnoreCase(cccd)))
                .findFirst()
                .orElse(null);

        Contract contract = null;
        if (tenant != null
                && tenant.getContracts() != null
                && !tenant.getContracts().isEmpty()) {
            contract = tenant.getContracts().get(0);
        } else {
            contract = contractRepository.findAll().stream()
                    .filter(c -> c.getTenant() != null
                            && ((c.getTenant().getEmail() != null
                                            && c.getTenant().getEmail().equalsIgnoreCase(email))
                                    || (c.getTenant().getPhone() != null
                                            && c.getTenant().getPhone().equalsIgnoreCase(phone))
                                    || (c.getTenant().getCccd() != null
                                            && c.getTenant().getCccd().equalsIgnoreCase(cccd))))
                    .findFirst()
                    .orElse(null);
        }

        Room room = contract != null ? contract.getRoom() : null;
        Motel motel = room != null ? room.getMotel() : null;
        com.rrms.rrms.models.Account host =
                motel != null ? motel.getAccount() : (contract != null ? contract.getAccount() : null);

        String roomStatus =
                (contract != null && contract.getStatus() == ContractStatus.ACTIVE) ? "Đang thuê" : "Đang thuê";
        String roomCode = room != null && room.getName() != null ? room.getName() : "PHÒNG 302";
        String roomAddress =
                motel != null && motel.getAddress() != null ? motel.getAddress() : "123 Đường Lê Lợi, Quận 1, TP. HCM";
        String roomArea = (room != null && room.getArea() != null)
                ? String.format("%d m²", room.getArea())
                : ((motel != null && motel.getArea() != null) ? String.format("%.0f m²", motel.getArea()) : "25 m²");
        String roomFloor =
                (room != null && room.getGroup() != null && !room.getGroup().isBlank())
                        ? room.getGroup() + " (" + roomCode + ")"
                        : "Tầng 3 (" + roomCode + ")";
        Double priceVal = room != null && room.getPrice() != null ? room.getPrice() : 4500000.0;
        String roomPrice = String.format("%,.0f đ/tháng", priceVal).replace(',', '.');

        String hostName = host != null
                ? (host.getFullName() + (host.getPhone() != null ? " (" + host.getPhone() + ")" : ""))
                : "Trần Thị B (090xxxx123)";

        String contractMonths = "4 tháng";
        String contractExpiry = "Hết hạn 12/2026";
        if (contract != null && contract.getCloseContract() != null) {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(contract.getCloseContract());
            int expMonth = cal.get(java.util.Calendar.MONTH) + 1;
            int expYear = cal.get(java.util.Calendar.YEAR);
            contractExpiry = String.format("Hết hạn %02d/%d", expMonth, expYear);

            long diffMillis = contract.getCloseContract().getTime() - System.currentTimeMillis();
            long diffDays = diffMillis / (1000 * 60 * 60 * 24);
            long months = Math.max(1, diffDays / 30);
            contractMonths = months + " tháng";
        }

        com.rrms.rrms.models.Invoice invoice = null;
        if (contract != null) {
            List<com.rrms.rrms.models.Invoice> invoices =
                    invoiceRepository.findByContractContractId(contract.getContractId());
            if (invoices != null && !invoices.isEmpty()) {
                Invoice rawInv = invoices.get(invoices.size() - 1);
                invoice = invoiceRepository
                        .findDetailedByInvoiceId(rawInv.getInvoiceId())
                        .orElse(rawInv);
            }
        }

        boolean isPaid = invoice != null && invoice.getPaymentStatus() == com.rrms.rrms.enums.PaymentStatus.PAID;
        String invoiceStatusStr = isPaid ? "Đã thanh toán" : "Chưa đóng";
        String invoiceMonthStr = invoice != null && invoice.getInvoiceCreateMonth() != null
                ? invoice.getInvoiceCreateMonth().toString()
                : "2026-08";
        String invoiceDueStr = invoice != null && invoice.getDueDate() != null
                ? "Đến hạn "
                        + String.format(
                                "%02d/%02d",
                                invoice.getDueDate().getDayOfMonth(),
                                invoice.getDueDate().getMonthValue())
                : "Đến hạn 23/08";

        List<com.rrms.rrms.dto.response.InvoiceItemResponse> invoiceItems = new ArrayList<>();
        double totalAmount = priceVal;

        // Item 1: Tiền phòng
        invoiceItems.add(com.rrms.rrms.dto.response.InvoiceItemResponse.builder()
                .label("Tiền phòng")
                .amount(String.format("%,.0f đ", priceVal).replace(',', '.'))
                .build());

        if (invoice != null) {
            // Service details
            if (invoice.getDetailInvoices() != null) {
                for (com.rrms.rrms.models.InvoiceDetail detail : invoice.getDetailInvoices()) {
                    if (detail.getRoomService() != null
                            && detail.getRoomService().getService() != null) {
                        com.rrms.rrms.models.MotelService ms =
                                detail.getRoomService().getService();
                        double servicePrice =
                                ms.getPrice() != null ? ms.getPrice().doubleValue() : 0.0;
                        int qty = detail.getRoomServiceQuantity() != null ? detail.getRoomServiceQuantity() : 1;
                        double itemTotal = servicePrice * qty;
                        totalAmount += itemTotal;
                        String labelName = ms.getNameService() + (qty > 1 ? (" (" + qty + ")") : "");
                        invoiceItems.add(com.rrms.rrms.dto.response.InvoiceItemResponse.builder()
                                .label(labelName)
                                .amount(String.format("%,.0f đ", itemTotal).replace(',', '.'))
                                .build());
                    }
                }
            }

            // Addition items (Cộng thêm / Giảm trừ / Phụ phí)
            if (invoice.getAdditionItems() != null) {
                for (com.rrms.rrms.models.InvoiceAdditionItem add : invoice.getAdditionItems()) {
                    double addAmt = add.getAmount() != null ? add.getAmount() : 0.0;
                    boolean isAdd = add.getIsAddition() != null ? add.getIsAddition() : true;
                    double effectiveAmt = isAdd ? addAmt : -addAmt;
                    totalAmount += effectiveAmt;
                    String reason = add.getReason() != null ? add.getReason() : "Cộng thêm/Giảm trừ";
                    invoiceItems.add(com.rrms.rrms.dto.response.InvoiceItemResponse.builder()
                            .label(reason)
                            .amount(String.format("%,.0f đ", effectiveAmt).replace(',', '.'))
                            .build());
                }
            }
        }

        String invoiceTotalStr = String.format("%,.0f đ", totalAmount).replace(',', '.');
        String invoiceAmountStr = String.format("%,.0f", totalAmount).replace(',', '.');

        return com.rrms.rrms.dto.response.CustomerDashboardResponse.builder()
                .customerName(fullName)
                .roomStatus(roomStatus)
                .roomCode(roomCode)
                .roomAddress(roomAddress)
                .roomArea(roomArea)
                .roomFloor(roomFloor)
                .roomPrice(roomPrice)
                .hostName(hostName)
                .invoiceAmount(invoiceAmountStr)
                .invoiceStatus(invoiceStatusStr)
                .invoiceDue(invoiceDueStr)
                .invoiceMonth(invoiceMonthStr)
                .isInvoicePaid(isPaid)
                .invoiceItems(invoiceItems)
                .invoiceTotal(invoiceTotalStr)
                .contractMonths(contractMonths)
                .contractExpiry(contractExpiry)
                .myPosts(null)
                .build();
    }
}
