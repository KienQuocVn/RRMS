package com.rrms.rrms.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.request.ChangePasswordByEmail;
import com.rrms.rrms.dto.request.ChangePasswordRequest;
import com.rrms.rrms.dto.request.RegisterRequest;
import com.rrms.rrms.dto.request.SocialLoginRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.models.Account;

public interface IAccountService {
    List<AccountResponse> findAll();

    Page<AccountResponse> findAll(Pageable pageable);

    List<AccountResponse> getAccountsByRole(Roles role);

    Page<AccountResponse> getAccountsByRole(Roles role, Pageable pageable);

    List<AccountResponse> searchAccounts(String search);

    Page<AccountResponse> searchAccounts(String search, Pageable pageable);

    Optional<Account> findAccountsByUsername(String username);

    Optional<Account> findByPhone(String phone);

    Optional<Account> findByEmail(String email);

    Account register(RegisterRequest request);

    Account registergg(RegisterRequest request);

    Account findOrCreateSocialAccount(SocialLoginRequest request);

    Optional<Account> login(String phone, String password);

    AccountResponse createAccount(AccountRequest accountRequest);

    AccountResponse updateAccount(String username, AccountRequest accountRequest);

    void deleteAccount(String username);

    Account updateAcc(String username, Account account);

    AccountResponse findByUsername(String username);

    AccountResponse save(AccountRequest accountRequest);

    AccountResponse update(AccountRequest accountRequest);

    String changePassword(ChangePasswordRequest changePasswordRequest);

    boolean changePasswordByEmail(ChangePasswordByEmail changePasswordByEmail);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<com.rrms.rrms.dto.response.BulletinBoardResponse> getFavoriteBulletinBoards(String username);

    void addFavoriteBulletinBoard(String username, java.util.UUID bulletinBoardId);

    void removeFavoriteBulletinBoard(String username, java.util.UUID bulletinBoardId);
}
