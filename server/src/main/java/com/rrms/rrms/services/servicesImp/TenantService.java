package com.rrms.rrms.services.servicesImp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

@Service
public class TenantService implements ITenantService {
    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantMapper tenantMapper;

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    private MotelRepository motelRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractOccupantRepository contractOccupantRepository;

    @Override
    public TenantResponse insert(UUID roomId, TenantRequest tenant) {
        List<Contract> contracts = contractRepository.findByRoomRoomId(roomId);
        Contract activeContract = contracts.stream()
                .filter(c -> c.getStatus() == ContractStatus.ACTIVE)
                .findFirst()
                .orElse(null);

        if (activeContract != null) {
            Tenant newt = tenantMapper.tenantRequestToTenant(tenant);
            Tenant savedTenant = tenantRepository.save(newt);

            ContractOccupant occupant = new ContractOccupant();
            occupant.setContract(activeContract);
            occupant.setTenant(savedTenant);
            occupant.setMoveInDate(LocalDate.now());
            occupant.setIsActive(true);
            contractOccupantRepository.save(occupant);

            return tenantMapper.toTenantResponse(savedTenant);
        }
        return null;
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
        // Tìm tenant theo id
        Optional<Tenant> tenantFind = tenantRepository.findById(id);
        if (tenantFind.isPresent()) {
            Tenant tenant = tenantFind.get();

            // Cập nhật các trường từ tenantRequest vào tenant hiện có
            tenantMapper.updateTenantFromRequest(tenantRequest, tenant);

            // Lưu bản ghi sau khi cập nhật
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
                    .filter(tenant -> !tenant.getTemporaryResidence()) // Chưa đăng ký tạm trú
                    .count();

            long notProvidedInfoCount = contractRepository.findByRoom_Motel(motel).stream()
                    .map(Contract::getTenant)
                    .filter(tenant -> !tenant.getInformationVerify()) // Chưa cung cấp thông tin
                    .count();

            summaries.add(new TenantSummaryDTO(
                    motel.getMotelId(), motel.getMotelName(), notRegisteredCount, notProvidedInfoCount));
        }

        return summaries;
    }
}
