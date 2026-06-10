package com.rrms.rrms.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Permission;

@Component
@ConditionalOnMissingBean(AccountMapper.class)
public class AccountMapperFallback implements AccountMapper {

    @Override
    public Account toAccount(AccountRequest request) {
        if (request == null) {
            return null;
        }

        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(request.getPassword());
        account.setFullName(request.getFullName());
        account.setPhone(request.getPhone());
        account.setEmail(request.getEmail());
        account.setBirthday(request.getBirthday());
        account.setGender(request.getGender());
        account.setCccd(request.getCccd());
        account.setAddress(request.getAddress());
        account.setJob(request.getJob());
        account.setPlaceOfIssue(request.getPlaceOfIssue());
        account.setDateOfIssue(request.getDateOfIssue());
        account.setAvatar(request.getAvatar());
        return account;
    }

    @Override
    public AccountResponse toAccountResponse(Account account) {
        if (account == null) {
            return null;
        }

        AccountResponse response = new AccountResponse();
        response.setUsername(account.getUsername());
        response.setPassword(account.getPassword());
        response.setFullName(account.getFullName());
        response.setPhone(account.getPhone());
        response.setEmail(account.getEmail());
        response.setBirthday(account.getBirthday());
        response.setGender(account.getGender());
        response.setCccd(account.getCccd());
        response.setAddress(account.getAddress());
        response.setJob(account.getJob());
        response.setPlaceOfIssue(account.getPlaceOfIssue());
        response.setDateOfIssue(account.getDateOfIssue());
        response.setAvatar(account.getAvatar());
        response.setCreatedAt(account.getCreatedAt());
        response.setRole(mapRole(account));
        response.setPermissions(mapAccountPermissions(account));
        return response;
    }

    @Override
    public void updateAccount(Account user, AccountRequest request) {
        if (user == null || request == null) {
            return;
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setBirthday(request.getBirthday());
        user.setGender(request.getGender());
        user.setCccd(request.getCccd());
        user.setAddress(request.getAddress());
        user.setJob(request.getJob());
        user.setPlaceOfIssue(request.getPlaceOfIssue());
        user.setDateOfIssue(request.getDateOfIssue());
        user.setAvatar(request.getAvatar());
    }

    @Override
    public BrokerResponse toBrokerResponse(Account account) {
        if (account == null) {
            return null;
        }

        BrokerResponse response = new BrokerResponse();
        response.setName(account.getFullName());
        response.setPhone(account.getPhone());
        response.setCommissionRate(account.getCommissionRate() == null ? 0 : account.getCommissionRate());
        return response;
    }

    private List<String> mapAccountPermissions(Account account) {
        if (account.getAuthorities() == null || account.getAuthorities().isEmpty()) {
            return new ArrayList<>();
        }

        return account.getAuthorities().stream()
                .flatMap(auth -> auth.getRole().getPermissions().stream())
                .map(Permission::getName)
                .distinct()
                .collect(Collectors.toList());
    }
}
