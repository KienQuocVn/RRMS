package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.TemporaryContractRequest;
import com.rrms.rrms.dto.response.TemporaryContractResponse;
import com.rrms.rrms.mapper.TemporaryContractMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.TemporaryR_contract;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.repositories.TemporaryR_contractRepository;
import com.rrms.rrms.services.ITemporaryContractService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TemporaryContractService implements ITemporaryContractService {

    private final TemporaryR_contractRepository temporaryR_contractRepository;
    private final MotelRepository motelRepository;
    private final AccountRepository accountRepository;
    private final TemporaryContractMapper temporaryContractMapper;

    @Override
    public TemporaryContractResponse insert(TemporaryContractRequest request) {
        TemporaryR_contract contract = new TemporaryR_contract();

        contract.setHouseholdhead(request.getHouseholdHead());
        contract.setRepresentativename(request.getRepresentativeName());
        contract.setPhone(request.getPhone());
        contract.setBirth(request.getBirth());
        contract.setPermanentaddress(request.getPermanentAddress());
        contract.setJob(request.getJob());
        contract.setIdentifier(request.getIdentifier());
        contract.setPlaceofissue(request.getPlaceOfIssue());
        contract.setDateofissue(request.getDateOfIssue());

        Motel motel = motelRepository
                .findById(UUID.fromString(request.getMotelId()))
                .orElseThrow(() -> new RuntimeException("Motel not found"));
        contract.setMotel(motel);

        Account tenant = accountRepository
                .findByUsername(request.getTenantUsername())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        contract.setTenant(tenant);

        temporaryR_contractRepository.save(contract);
        return new TemporaryContractResponse(contract);
    }

    @Override
    public List<TemporaryContractResponse> findById(UUID id) {
        return temporaryR_contractRepository.findById(id).stream()
                .map(TemporaryContractResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<TemporaryContractResponse> findTRCByAccount_Username(String username) {
        return temporaryR_contractRepository.findByTenant_Username(username).stream()
                .map(TemporaryContractResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public TemporaryContractResponse findByMotelId(UUID motelId) {
        return temporaryR_contractRepository
                .findFirstByMotel_MotelId(motelId)
                .map(TemporaryContractResponse::new)
                .orElse(null);
    }

    @Override
    public List<TemporaryContractResponse> findAll() {
        List<TemporaryR_contract> contracts = temporaryR_contractRepository.findAll();
        return contracts.stream().map(TemporaryContractResponse::new).collect(Collectors.toList());
    }

    @Override
    public TemporaryContractResponse update(UUID id, TemporaryContractRequest request) {
        Optional<TemporaryR_contract> contractFind = temporaryR_contractRepository.findById(id);
        if (contractFind.isPresent()) {
            TemporaryR_contract contract = contractFind.get();
            contract.setHouseholdhead(request.getHouseholdHead());
            contract.setRepresentativename(request.getRepresentativeName());
            contract.setPhone(request.getPhone());
            contract.setBirth(request.getBirth());
            contract.setPermanentaddress(request.getPermanentAddress());
            contract.setJob(request.getJob());
            contract.setIdentifier(request.getIdentifier());
            contract.setPlaceofissue(request.getPlaceOfIssue());
            contract.setDateofissue(request.getDateOfIssue());
            return new TemporaryContractResponse(temporaryR_contractRepository.save(contract));
        }
        return null;
    }

    @Override
    public void delete(UUID id) {
        Optional<TemporaryR_contract> contractFind = temporaryR_contractRepository.findById(id);
        if (contractFind.isPresent()) {
            temporaryR_contractRepository.deleteById(id);
        }
    }
}
