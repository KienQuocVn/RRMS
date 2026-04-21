package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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

@Service
@RequiredArgsConstructor
public class SupportService implements ISupportService {
    private final SupportRepository supportRepository;

    private final AccountRepository accountRepository;

    private final AccountMapper accountMapper;

    Support toSupport(SupportRequest request) {
        Account account = accountRepository
                .findByUsername(request.getAccount().getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Support support = new Support();
        support.setAccount(account);
        support.setNameContact(request.getNameContact());
        support.setPhoneContact(request.getPhoneContact());
        support.setDateOfStay(request.getDateOfStay());
        support.setPriceFirst(request.getPriceFirst());
        support.setPriceEnd(request.getPriceEnd());
        return support;
    }

    SupportResponse toSupportResponse(Support support) {
        SupportResponse response = new SupportResponse();
        response.setSupportId(support.getSupportId());
        response.setAccount(accountMapper.toAccountResponse(support.getAccount()));
        response.setNameContact(support.getNameContact());
        response.setPhoneContact(support.getPhoneContact());
        response.setDateOfStay(support.getDateOfStay());
        response.setPriceFirst(support.getPriceFirst());
        response.setPriceEnd(support.getPriceEnd());
        return response;
    }

    @Override
    public boolean insert(SupportRequest supportRequest) {
        Support support = toSupport(supportRequest);
        Support status = supportRepository.save(support);
        return status != null;
    }

    @Override
    public List<SupportResponse> listSupport() {
        List<Support> supports = supportRepository.findAllByOrderByCreateDateDesc();
        return supports.stream().map(this::toSupportResponse).collect(Collectors.toList());
    }
}
