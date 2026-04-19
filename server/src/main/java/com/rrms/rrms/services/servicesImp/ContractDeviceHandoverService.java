package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rrms.rrms.models.ContractDeviceHandover;
import com.rrms.rrms.repositories.ContractDeviceHandoverRepository;
import com.rrms.rrms.services.IContractDeviceHandoverService;

@Service
public class ContractDeviceHandoverService implements IContractDeviceHandoverService {

    @Autowired
    private ContractDeviceHandoverRepository contractDeviceHandoverRepository;

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
