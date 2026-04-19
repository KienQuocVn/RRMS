package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.models.ContractOccupant;

public interface IContractOccupantService {
    List<ContractOccupant> getOccupantsByContract(UUID contractId);

    ContractOccupant save(ContractOccupant occupant);

    void delete(UUID occupantId);
}
