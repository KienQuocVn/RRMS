package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.ContractOccupant;

public interface ContractOccupantRepository extends JpaRepository<ContractOccupant, UUID> {
    List<ContractOccupant> findByContract(Contract contract);

    List<ContractOccupant> findByContractContractId(UUID contractId);

    List<ContractOccupant> findByContract_Room_RoomId(UUID roomId);

    List<ContractOccupant> findByContract_Room_Motel_MotelId(UUID motelId);

    void deleteByContract_Room_RoomId(UUID roomId);
}
