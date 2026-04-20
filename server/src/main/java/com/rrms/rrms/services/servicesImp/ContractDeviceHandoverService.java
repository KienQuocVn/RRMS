package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.models.ContractDeviceHandover;
import com.rrms.rrms.repositories.ContractDeviceHandoverRepository;
import com.rrms.rrms.services.IContractDeviceHandoverService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractDeviceHandoverService implements IContractDeviceHandoverService {

    private final ContractDeviceHandoverRepository contractDeviceHandoverRepository;

    @Override
    public List<ContractDeviceHandover> getHandoversByContract(UUID contractId) {
        return contractDeviceHandoverRepository.findByContractContractId(contractId);
    }

    @Override
    public ContractDeviceHandover save(ContractDeviceHandover handover) {
        return contractDeviceHandoverRepository.save(handover);
    }

    @Override
    public void delete(UUID handoverId) {
        contractDeviceHandoverRepository.deleteById(handoverId);
    }
}
