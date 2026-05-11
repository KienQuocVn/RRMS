package com.rrms.rrms.services.servicesImp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.TenantRequest;
import com.rrms.rrms.dto.response.TenantResponse;
import com.rrms.rrms.dto.response.TenantSummaryDTO;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.mapper.TenantMapper;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.ContractOccupant;
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

    @Override
    public TenantResponse insert(UUID roomId, TenantRequest tenant) {
        // Luôn tạo Tenant mới
        Tenant newt = tenantMapper.tenantRequestToTenant(tenant);
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

    @Override
    public TenantResponse findById(UUID id) {
        return tenantRepository
                .findById(id)
                .map(tenant -> {
                    TenantResponse response = tenantMapper.toTenantResponse(tenant);
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
}
