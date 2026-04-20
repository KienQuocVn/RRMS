package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.models.ContractOccupant;
import com.rrms.rrms.repositories.ContractOccupantRepository;
import com.rrms.rrms.services.IContractOccupantService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractOccupantService implements IContractOccupantService {

    private final ContractOccupantRepository contractOccupantRepository;

    @Override
    public List<ContractOccupant> getOccupantsByContract(UUID contractId) {
        return contractOccupantRepository.findByContractContractId(contractId);
    }

    @Override
    public ContractOccupant save(ContractOccupant occupant) {
        return contractOccupantRepository.save(occupant);
    }

    @Override
    public void delete(UUID occupantId) {
        contractOccupantRepository.deleteById(occupantId);
    }
}
