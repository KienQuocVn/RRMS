package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.ContractDeviceHandover;

public interface ContractDeviceHandoverRepository extends JpaRepository<ContractDeviceHandover, UUID> {
    List<ContractDeviceHandover> findByContractContractId(UUID contractId);
}
