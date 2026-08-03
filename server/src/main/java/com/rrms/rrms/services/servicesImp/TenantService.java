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
}
