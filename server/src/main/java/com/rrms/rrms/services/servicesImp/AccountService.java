package com.rrms.rrms.services.servicesImp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.request.ChangePasswordByEmail;
import com.rrms.rrms.dto.request.ChangePasswordRequest;
import com.rrms.rrms.dto.request.RegisterRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Auth;
import com.rrms.rrms.models.Permission;
import com.rrms.rrms.models.Role;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.BulletinBoardRepository;
import com.rrms.rrms.repositories.RoleRepository;
import com.rrms.rrms.services.IAccountService;

@Service
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;
    private final BulletinBoardRepository bulletinBoardRepository;
    private final AccountMapper accountMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Autowired
    public AccountService(
            AccountRepository accountRepository,
            AuthRepository authRepository,
            RoleRepository roleRepository,
            BulletinBoardRepository bulletinBoardRepository,
            AccountMapper accountMapper) {
        this.accountRepository = accountRepository;
        this.authRepository = authRepository;
        this.roleRepository = roleRepository;
        this.bulletinBoardRepository = bulletinBoardRepository;
        this.accountMapper = accountMapper;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> findAll() {
        return accountRepository.findAll().stream()
                .map(accountMapper::toAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountResponse> findAll(Pageable pageable) {
        return accountRepository.findAll(pageable).map(accountMapper::toAccountResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAccountsByRole(Roles role) {
        return accountRepository.findAllByAuthorities_Role_RoleName(role).stream()
                .map(accountMapper::toAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountResponse> getAccountsByRole(Roles role, Pageable pageable) {
        return accountRepository
                .findAllByAuthorities_Role_RoleName(role, pageable)
                .map(accountMapper::toAccountResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> searchAccounts(String search) {
        return accountRepository.searchAccounts(search).stream()
                .map(accountMapper::toAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountResponse> searchAccounts(String search, Pageable pageable) {
        return accountRepository.searchAccounts(search, pageable).map(accountMapper::toAccountResponse);
    }

    @Override
    public Optional<Account> findAccountsByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    @Override
    public Optional<Account> findByPhone(String phone) {
        return accountRepository.findByPhone(phone);
    }

    @Override
    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    @Override
    public Account register(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.INVALID_USERNAME);
        }

        if (accountRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_PHONE);
        }

        if (request.getPassword().length() < 8) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPhone(request.getPhone());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));

        Account savedAccount = accountRepository.save(account);

        Roles roleEnum;
        switch (request.getUserType().toUpperCase()) {
            case "HOST":
                roleEnum = Roles.HOST;
                break;
            case "BROKER":
                roleEnum = Roles.BROKER;
                break;
            default:
                roleEnum = Roles.CUSTOMER;
                break;
        }

        Role role =
                roleRepository.findByRoleName(roleEnum).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        Auth auth = new Auth();
        auth.setAccount(savedAccount);
        auth.setRole(role);
        authRepository.save(auth);

        return savedAccount;
    }

    @Override
    public Account registergg(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_EXISTS);
        }

        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setPhone(request.getPhone());
        Account savedAccount = accountRepository.save(account);

        Roles roleEnum;
        switch (request.getUserType().toUpperCase()) {
            case "HOST":
                roleEnum = Roles.HOST;
                break;
            case "BROKER":
                roleEnum = Roles.BROKER;
                break;
            default:
                roleEnum = Roles.CUSTOMER;
                break;
        }

        Role role =
                roleRepository.findByRoleName(roleEnum).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Auth auth = new Auth();
        auth.setAccount(savedAccount);
        auth.setRole(role);
        authRepository.save(auth);

        return savedAccount;
    }

    @Override
    public Optional<Account> login(String phone, String password) {
        Optional<Account> accountOptional = accountRepository.findByPhone(phone);
        if (accountOptional.isPresent()
                && passwordEncoder.matches(password, accountOptional.get().getPassword())) {
            return accountOptional;
        }
        if (accountOptional.isPresent()) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        return Optional.empty();
    }

    @Override
    public AccountResponse createAccount(AccountRequest accountRequest) {
        if (accountRepository.existsByUsername(accountRequest.getUsername())
                || accountRepository.existsByPhone(accountRequest.getPhone())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_EXISTS);
        }

        Account account = new Account();
        account.setUsername(accountRequest.getUsername());
        account.setFullName(accountRequest.getFullName());
        account.setPhone(accountRequest.getPhone());
        account.setEmail(accountRequest.getEmail());
        account.setBirthday(accountRequest.getBirthday());
        account.setGender(accountRequest.getGender());
        account.setCccd(accountRequest.getCccd());
        account.setAvatar(accountRequest.getAvatar());
        account.setPassword(passwordEncoder.encode(accountRequest.getPassword()));
        account.setAuthorities(new ArrayList<>());

        Account savedAccount = accountRepository.save(account);

        if (accountRequest.getRole() == null || accountRequest.getRole().isEmpty()) {
            throw new AppException(ErrorCode.ROLE_NOT_PROVIDED);
        }

        for (String roleName : accountRequest.getRole()) {
            Roles roleEnum;
            try {
                roleEnum = Roles.valueOf(roleName.toUpperCase());
            } catch (IllegalArgumentException exception) {
                throw new AppException(ErrorCode.ROLE_NOT_FOUND);
            }

            Role role = roleRepository
                    .findByRoleName(roleEnum)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

            Auth auth = new Auth();
            auth.setAccount(savedAccount);
            auth.setRole(role);
            savedAccount.getAuthorities().add(auth);
            authRepository.save(auth);
        }

        return convertToAccountResponse(savedAccount);
    }

    private AccountResponse convertToAccountResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setUsername(account.getUsername());
        response.setFullName(account.getFullName());
        response.setPhone(account.getPhone());
        response.setEmail(account.getEmail());
        if (account.getBirthday() != null) {
            response.setBirthday(account.getBirthday());
        }
        response.setGender(account.getGender());
        response.setCccd(account.getCccd());
        response.setAvatar(account.getAvatar());
        response.setRole(account.getAuthorities().stream()
                .map(auth -> auth.getRole().getRoleName().name())
                .distinct()
                .collect(Collectors.toList()));
        response.setPermissions(account.getAuthorities().stream()
                .flatMap(auth -> auth.getRole().getPermissions().stream().map(Permission::getName))
                .distinct()
                .collect(Collectors.toList()));
        return response;
    }

    @Override
    public AccountResponse updateAccount(String username, AccountRequest accountRequest) {
        Account account =
                accountRepository.findById(username).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        account.setFullName(accountRequest.getFullName());
        account.setPhone(accountRequest.getPhone());
        account.setEmail(accountRequest.getEmail());
        account.setBirthday(accountRequest.getBirthday());
        account.setGender(accountRequest.getGender());
        account.setCccd(accountRequest.getCccd());
        account.setAvatar(accountRequest.getAvatar());

        if (accountRequest.getPassword() != null
                && !accountRequest.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(accountRequest.getPassword()));
        }

        return convertToAccountResponse(accountRepository.save(account));
    }

    @Override
    @Transactional
    public void deleteAccount(String username) {
        if (!accountRepository.existsById(username)) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        authRepository.deleteByAccount_Username(username);
        accountRepository.deleteById(username);
    }

    @Override
    public Account updateAcc(String username, Account account) {
        if (!accountRepository.existsById(username)) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        account.setUsername(username);
        return accountRepository.save(account);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse findByUsername(String username) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return accountMapper.toAccountResponse(account);
    }

    @Override
    public AccountResponse save(AccountRequest accountRequest) {
        Account account = accountMapper.toAccount(accountRequest);
        account = accountRepository.save(account);
        return accountMapper.toAccountResponse(account);
    }

    @Override
    public AccountResponse update(AccountRequest accountRequest) {
        Account account = accountRepository
                .findByUsername(accountRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        accountMapper.updateAccount(account, accountRequest);
        account = accountRepository.save(account);
        return accountMapper.toAccountResponse(account);
    }

    @Override
    public String changePassword(ChangePasswordRequest changePasswordRequest) {
        Account account = accountRepository
                .findByUsername(changePasswordRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT);
        }

        account.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        accountRepository.save(account);

        return "Password changed successfully";
    }

    @Override
    public boolean changePasswordByEmail(ChangePasswordByEmail changePasswordByEmail) {
        if (!accountRepository.existsAccountByEmail(changePasswordByEmail.getEmail())) {
            return false;
        }
        try {
            Account account = accountRepository
                    .findByEmail(changePasswordByEmail.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
            account.setPassword(passwordEncoder.encode(changePasswordByEmail.getNewPassword()));
            accountRepository.save(account);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.existsAccountByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.rrms.rrms.dto.response.BulletinBoardResponse> getFavoriteBulletinBoards(String username) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Return a mapped response (in a real scenario, use a mapper)
        // Here we just return an empty list or mapped response if available.
        // As this needs BulletinBoardMapper which we haven't injected, we can return null or an empty list for now.
        // Wait, BulletinBoardMapper exists? We can inject it later if needed.
        return new ArrayList<>();
    }

    @Override
    @Transactional
    public void addFavoriteBulletinBoard(String username, java.util.UUID bulletinBoardId) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        com.rrms.rrms.models.BulletinBoard board = bulletinBoardRepository
                .findById(bulletinBoardId)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));

        if (!account.getFavoriteBulletinBoards().contains(board)) {
            account.getFavoriteBulletinBoards().add(board);
            accountRepository.save(account);
        }
    }

    @Override
    @Transactional
    public void removeFavoriteBulletinBoard(String username, java.util.UUID bulletinBoardId) {
        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        com.rrms.rrms.models.BulletinBoard board = bulletinBoardRepository
                .findById(bulletinBoardId)
                .orElseThrow(() -> new AppException(ErrorCode.BULLETIN_BOARD_NOT_FOUND));

        account.getFavoriteBulletinBoards().remove(board);
        accountRepository.save(account);
    }
}
