package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.ContractRequest;
import com.rrms.rrms.dto.response.ContractResponse;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.RoomStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.ContractMapper;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.IContractService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContractService implements IContractService {

    private final EntityManager entityManager;

    private final ContractRepository contractRepository;

    private final RoomRepository roomRepository;

    private final TenantRepository tenantRepository;

    private final AccountRepository accountRepository;

    private final ContractTemplateRepository contractTemplateRepository;

    private final ContractOccupantRepository contractOccupantRepository;

    private final BrokerRepository brokerRepository;

    private final ContractMapper contractMapper;

    private final RoomServiceRepository roomServiceRepository;

    private final RoomDeviceRepository roomDeviceRepository;

    private final MotelDeviceRepository motelDeviceRepository;

    private final CarRepository carRepository;

    private final RoomReservationRepository roomReservationRepository;

    @Override
    public Integer getTotalActiveContractsByLandlord(Account usernameLandlord) {
        return contractRepository.countActiveContractsByLandlord(usernameLandlord);
    }

    @Override
    public BigDecimal getTotalActiveContractsDepositByLandlord(Account usernameLandlord) {
        return contractRepository.sumActiveContractDepositsByLandlord(usernameLandlord);
    }

    public int getTotalExpiredContracts(String username) {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GetTotalExpiredContracts");
        query.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
        query.setParameter(1, username);
        return (int) query.getSingleResult();
    }

    public int getTotalExpiringContracts(String username) {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GetTotalExpiringContractsProcedure");
        query.registerStoredProcedureParameter(1, String.class, jakarta.persistence.ParameterMode.IN);
        query.setParameter(1, username);
        return (int) query.getSingleResult();
    }

    @Override
    public ContractResponse createContract(ContractRequest request) {
        log.debug(
                "Create contract payload - username: {}, roomId: {}, tenantId: {}, contractTemplateId: {}",
                request.getUsername(),
                request.getRoomId(),
                request.getTenantId(),
                request.getContractTemplateId());
        validateCreateContractRequest(request);
        // Fetch related entities from the database using UUIDs
        Account username = accountRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        Room room = roomRepository
                .findById(request.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found"));

        Tenant tenant = tenantRepository
                .findById(request.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found"));

        ContractTemplate contractTemplate = contractTemplateRepository
                .findById(request.getContractTemplateId())
                .orElseThrow(() -> new EntityNotFoundException("ContractTemplate not found"));

        Broker broker = null;
        if (request.getBrokerId() != null) {
            broker = brokerRepository
                    .findById(request.getBrokerId())
                    .orElseThrow(() -> new EntityNotFoundException("Broker not found"));
        }

        // Create Contract entity from the request and set related entities
        Contract contract = contractMapper.toEntity(request);
        applyContractDefaults(contract);
        contract.setAccount(username); // Set the fetched account entity
        contract.setRoom(room); // Set the fetched Room entity
        contract.setTenant(tenant); // Set the fetched Tenant entity
        contract.setContractTemplate(contractTemplate); // Set the fetched ContractTemplate entity
        contract.setBroker(broker);

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        // Save the contract
        contract = contractRepository.save(contract);

        // Đăng ký người thuê chính vào danh sách người ở của phòng
        ContractOccupant occupant = new ContractOccupant();
        occupant.setContract(contract);
        occupant.setTenant(tenant);
        occupant.setMoveInDate(new java.sql.Date(contract.getMoveinDate().getTime()).toLocalDate());
        occupant.setIsActive(true);
        contractOccupantRepository.save(occupant);

        // Return the response after saving the contract
        return contractMapper.toResponse(contract);
    }

    private void validateCreateContractRequest(ContractRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Contract payload is required");
        }
        if (isBlank(request.getUsername())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Username is required");
        }
        if (request.getRoomId() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Room id is required");
        }
        if (request.getTenantId() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Tenant id is required");
        }
        if (request.getContractTemplateId() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Contract template id is required");
        }
        if (request.getMoveInDate() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Move-in date is required");
        }
    }

    private void applyContractDefaults(Contract contract) {
        if (contract.getMoveinDate() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Move-in date is required");
        }
        if (contract.getCreatedate() == null) {
            contract.setCreatedate(LocalDate.now());
        }
        if (isBlank(contract.getSigncontract())) {
            contract.setSigncontract("Khach chua ky");
        }
        if (isBlank(contract.getLanguage())) {
            contract.setLanguage("Tieng Viet");
        }
        if (isBlank(contract.getCollectioncycle())) {
            contract.setCollectioncycle("1");
        }
        if (contract.getCountTenant() == null || contract.getCountTenant() <= 0) {
            contract.setCountTenant(1);
        }
        if (contract.getDebt() == null) {
            contract.setDebt(0.0);
        }
        if (contract.getStatus() == null) {
            contract.setStatus(ContractStatus.ACTIVE);
        }
        if (contract.getActualPrice() == null && contract.getPrice() != null) {
            contract.setActualPrice(contract.getPrice());
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    @Override
    public ContractResponse getContractById(UUID contractId) {
        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("Contract not found with id " + contractId));
        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse updateContract(UUID contractId, ContractRequest request) {
        Contract existingContract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("Contract not found with id " + contractId));

        // Cáº­p nháº­t cÃ¡c trÆ°á» ng cá»§a há»£p Ä‘á»“ng dá»±a trÃªn request
        Contract updatedContract = contractMapper.toEntity(request);
        updatedContract.setContractId(existingContract.getContractId());

        updatedContract = contractRepository.save(updatedContract);
        return contractMapper.toResponse(updatedContract);
    }

    @Override
    public void deleteContract(UUID contractId) {
        if (!contractRepository.existsById(contractId)) {
            throw new EntityNotFoundException("Contract not found with id " + contractId);
        }
        contractRepository.deleteById(contractId);
    }

    @Override
    public void deleteContractByRoomId(UUID RoomId) {
        endContractByRoomId(RoomId, new Date());
    }

    @Override
    @Transactional
    public void endContractByRoomId(UUID roomId, Date endDate) {
        Room room = roomRepository
                .findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id " + roomId));

        Contract contract = contractRepository.findEndableContractsByRoomId(roomId).stream()
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Active contract not found with room id " + roomId));

        Date normalizedEndDate = endDate != null ? endDate : new Date();
        contract.setStatus(ContractStatus.ENDED);
        contract.setCloseContract(normalizedEndDate);
        contract.setReportcloseContract(normalizedEndDate);
        contractRepository.save(contract);

        contractOccupantRepository.findByContract_Room_RoomId(roomId).forEach(occupant -> {
            occupant.setIsActive(false);
            if (occupant.getMoveOutDate() == null) {
                occupant.setMoveOutDate(new java.sql.Date(normalizedEndDate.getTime()).toLocalDate());
            }
            contractOccupantRepository.save(occupant);
        });

        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);
    }

    @Override
    public List<ContractResponse> getAllContractsByMotelId(UUID motelId) {
        List<Contract> contracts = contractRepository.findByRoom_Motel_MotelId(motelId);

        return contracts.stream()
                .map(contract -> {
                    return contractMapper.toResponse(contract);
                })
                .toList();
    }

    @Override
    public void updateContractsBasedOnDaysDifference(ContractStatus newStatus, int thresholdDays) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, thresholdDays);
        Date thresholdDate = cal.getTime();

        contractRepository.updateStatusForContractsBasedOnDaysDifference(newStatus, thresholdDate);
    }

    @Override
    public void updateContractsBasedOnDaysDifference2(ContractStatus newStatus, int thresholdDays) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, thresholdDays);
        Date thresholdDate = cal.getTime();

        contractRepository.updateStatusForContractsBasedOnDaysDifference2(newStatus, thresholdDate);
    }

    @Override
    public void updateCloseContract(UUID contractId, Date newCloseContract) {
        int rowsUpdated = contractRepository.updateCloseContractByContractId(newCloseContract, contractId);
        if (rowsUpdated == 0) {
            throw new RuntimeException("KhÃ´ng tÃ¬m tháº¥y há»£p Ä‘á»“ng vá»›i contractId: " + contractId);
        }
    }

    @Override
    public Integer getTotalTenantsByMotelId(UUID motelId) {
        return contractRepository.countTenantsByMotelId(motelId);
    }

    @Override
    public int updateContractStatus(UUID roomId, ContractStatus newStatus, Date reportCloseDate) {
        log.debug(
                "Update contract status by room - roomId: {}, newStatus: {}, reportCloseDate: {}",
                roomId,
                newStatus,
                reportCloseDate);
        return contractRepository.updateContractStatusByRoomId(roomId, newStatus, reportCloseDate);
    }

    @Override
    @Transactional
    public void updateContractDetailsByContractId(
            UUID contractId, UUID roomId, Double deposit, Double price, Double debt) {
        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("Contract not found"));

        Room oldRoom = contract.getRoom();
        if (oldRoom == null) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND, "Không tìm thấy phòng nguồn của hợp đồng");
        }

        if (oldRoom.getRoomId().equals(roomId)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Không thể chuyển sang cùng một phòng");
        }

        Room newRoom = roomRepository.findById(roomId).orElseThrow(() -> new EntityNotFoundException("Room not found"));

        validateTargetRoomForTransfer(newRoom);

        transferRoomServices(oldRoom, newRoom);
        transferRoomDevices(oldRoom, newRoom);
        transferCars(oldRoom, newRoom);

        contract.setRoom(newRoom);
        if (deposit != null) {
            contract.setDeposit(deposit);
        }
        if (price != null) {
            contract.setPrice(price);
        }
        if (debt != null) {
            contract.setDebt(debt);
        }
        contractRepository.save(contract);

        oldRoom.setStatus(RoomStatus.AVAILABLE);
        newRoom.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(oldRoom);
        roomRepository.save(newRoom);
    }

    private void validateTargetRoomForTransfer(Room newRoom) {
        boolean hasActiveContract = contractRepository.findActiveContractsByRoomId(newRoom.getRoomId()).stream()
                .anyMatch(contract -> contract.getStatus() == ContractStatus.ACTIVE
                        || contract.getStatus() == ContractStatus.EXPIRING
                        || contract.getStatus() == ContractStatus.DEPOSITED);

        if (hasActiveContract) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Phòng đích đang có hợp đồng hoạt động");
        }

        if (!roomReservationRepository.findByRoom_RoomId(newRoom.getRoomId()).isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Phòng đích đang được cọc giữ chỗ");
        }
    }

    private void transferRoomServices(Room oldRoom, Room newRoom) {
        List<com.rrms.rrms.models.RoomService> targetServices = roomServiceRepository.findByRoom(newRoom);
        if (!targetServices.isEmpty()) {
            roomServiceRepository.deleteAll(targetServices);
        }

        List<com.rrms.rrms.models.RoomService> sourceServices = roomServiceRepository.findByRoom(oldRoom);
        for (com.rrms.rrms.models.RoomService roomService : sourceServices) {
            roomService.setRoom(newRoom);
            roomServiceRepository.save(roomService);
        }
    }

    private void transferRoomDevices(Room oldRoom, Room newRoom) {
        List<RoomDevice> targetDevices = roomDeviceRepository.getAllByRoom(newRoom);
        for (RoomDevice roomDevice : targetDevices) {
            releaseMotelDeviceUsage(roomDevice.getMotelDevice());
            roomDeviceRepository.delete(roomDevice);
        }

        List<RoomDevice> sourceDevices = roomDeviceRepository.getAllByRoom(oldRoom);
        for (RoomDevice roomDevice : sourceDevices) {
            roomDevice.setRoom(newRoom);
            roomDeviceRepository.save(roomDevice);
        }
    }

    private void releaseMotelDeviceUsage(MotelDevice motelDevice) {
        if (motelDevice == null) {
            return;
        }
        motelDevice.setTotalUsing(Math.max(0, motelDevice.getTotalUsing() - 1));
        motelDevice.setTotalNull(motelDevice.getTotalNull() + 1);
        motelDeviceRepository.save(motelDevice);
    }

    private void transferCars(Room oldRoom, Room newRoom) {
        List<Car> cars = carRepository.findByRoom_RoomId(oldRoom.getRoomId());
        for (Car car : cars) {
            car.setRoom(newRoom);
            carRepository.save(car);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getAllContractsByRoomId(UUID roomId) {
        // Ưu tiên lấy hợp đồng đang hoạt động (ACTIVE/EXPIRING/DEPOSITED) mới nhất
        List<Contract> activeContracts = contractRepository.findActiveContractsByRoomId(roomId);
        if (!activeContracts.isEmpty()) {
            return contractMapper.toResponse(activeContracts.get(0));
        }
        // Nếu không có hợp đồng đang hoạt động, lấy hợp đồng bất kỳ (mới nhất)
        throw new EntityNotFoundException("Không tìm thấy hợp đồng cho phòng với id: " + roomId);
    }
}
