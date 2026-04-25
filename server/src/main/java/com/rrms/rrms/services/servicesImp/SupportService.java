package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.SupportRequest;
import com.rrms.rrms.dto.response.SupportResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Support;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.SupportRepository;
import com.rrms.rrms.services.ISupportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportService implements ISupportService {
    private final SupportRepository supportRepository;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    @Transactional
    public SupportResponse createSupport(SupportRequest request) {
        Account account = accountRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        Support support = Support.builder()
                .account(account)
                .nameContact(request.getContactName())
                .phoneContact(request.getContactPhone())
                .dateOfStay(request.getDateOfStay())
                .priceFirst(request.getPriceFirst())
                .priceEnd(request.getPriceEnd())
                .build();

        Support saved = supportRepository.save(support);
        log.info("Support ticket created: {}", saved.getSupportId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportResponse> getAllSupports() {
        return supportRepository.findAllByOrderByCreateDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupportResponse getSupportById(UUID supportId) {
        Support support =
                supportRepository.findById(supportId).orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        return mapToResponse(support);
    }

    @Override
    @Transactional
    public void deleteSupport(UUID supportId) {
        if (!supportRepository.existsById(supportId)) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }
        supportRepository.deleteById(supportId);
        log.info("Support ticket deleted: {}", supportId);
    }

    private SupportResponse mapToResponse(Support support) {
        return SupportResponse.builder()
                .supportId(support.getSupportId())
                .account(accountMapper.toAccountResponse(support.getAccount()))
                .contactName(support.getNameContact())
                .contactPhone(support.getPhoneContact())
                .dateOfStay(support.getDateOfStay())
                .createdAt(support.getCreateDate())
                .priceFirst(support.getPriceFirst())
                .priceEnd(support.getPriceEnd())
                .build();
    }
}
