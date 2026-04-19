package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import com.rrms.rrms.models.ContractDeviceHandover;

public interface IContractDeviceHandoverService {
    List<ContractDeviceHandover> getHandoversByContract(UUID contractId);

    ContractDeviceHandover save(ContractDeviceHandover handover);

    void delete(UUID handoverId);
}
