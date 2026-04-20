package com.rrms.rrms.services.servicesImp;

import java.util.*;
import java.util.stream.Collectors;

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
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.RoleRepository;
import com.rrms.rrms.services.IAccountService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AccountService implements IAccountService {

    final AccountRepository accountRepository;

    final AuthRepository authRepository;

    final RoleRepository roleRepository;

    final AccountMapper accountMapper;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<AccountResponse> findAll() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map(accountMapper::toAccountResponse).collect(Collectors.toList());
    }

    @Override
    public List<AccountResponse> getAccountsByRole(Roles role) {
        List<Account> accounts = accountRepository.findAllByAuthorities_Role_RoleName(role);
        return accounts.stream().map(accountMapper::toAccountResponse).collect(Collectors.toList());
    }

    public List<AccountResponse> searchAccounts(String search) {
        List<Account> searchResults = accountRepository.searchAccounts(search);
        return searchResults.stream().map(accountMapper::toAccountResponse).collect(Collectors.toList());
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
        // Kiá»ƒm tra xem username hoáº·c phone Ä‘Ã£ tá»“n táº¡i chÆ°a
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.INVALID_USERNAME);
        }

        if (accountRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_PHONE);
        }

        //        if (accountRepository.existsAccountByEmail(request.getEmail())) {
        //            throw new AppException(ErrorCode.INVALID_EMAIL);
        //        }

        // Kiá»ƒm tra Ä‘á»™ dÃ i máº­t kháº©u (Ã­t nháº¥t 8 kÃ½ tá»±)
        if (request.getPassword().length() < 8) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        // Kiá»ƒm tra sá»‘ Ä‘iá»‡n thoáº¡i (Ä‘á»§ 10 sá»‘)
        // if (!request.getPhone().matches("\\d{10}")) {
        //     throw new AppException(ErrorCode.INVALID_PHONE2);
        // }

        // MÃ£ hÃ³a máº­t kháº©u trÆ°á»›c khi lÆ°u vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Táº¡o Ä‘á»‘i tÆ°á»£ng Account má»›i
        Account account = new Account();
        Heart heart = new Heart();
        account.setUsername(request.getUsername());
        account.setPhone(request.getPhone());
        account.setEmail(request.getEmail());
        account.setPassword(encodedPassword);
        account.setEmail(request.getEmail());
        account.setHeart(heart);
        heart.setAccount(account);
        // LÆ°u tÃ i khoáº£n vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
        Account savedAccount = accountRepository.save(account);

        // Láº¥y role CUSTOMER tá»« cÆ¡ sá»Ÿ dá»¯ liá»‡u
        Role customerRole;
        if ("CUSTOMER".equals(request.getUserType())) {
            customerRole = roleRepository
                    .findByRoleName(Roles.CUSTOMER)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        } else {
            customerRole = roleRepository
                    .findByRoleName(Roles.HOST)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        }

        // Táº¡o Ä‘á»‘i tÆ°á»£ng Auth vÃ  gÃ¡n role CUSTOMER cho tÃ i khoáº£n
        Auth auth = new Auth();
        auth.setAccount(savedAccount);
        auth.setRole(customerRole);
        authRepository.save(auth);

        return savedAccount;
    }

    @Override
    public Account registergg(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_EXISTS);
        }

        // MÃ£ hÃ³a máº­t kháº©u
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Táº¡o tÃ i khoáº£n
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setEmail(request.getEmail());
        account.setPassword(encodedPassword);
        account.setPhone(request.getPhone());
        accountRepository.save(account);

        // GÃ¡n role
        Role role = roleRepository
                .findByRoleName(request.getUserType().equals("CUSTOMER") ? Roles.CUSTOMER : Roles.HOST)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Auth auth = new Auth();
        auth.setAccount(account);
        auth.setRole(role);
        authRepository.save(auth);

        return account;
    }

    @Override
    public Optional<Account> login(String phone, String password) {
        Optional<Account> accountOptional = accountRepository.findByPhone(phone);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            if (passwordEncoder.matches(password, account.getPassword())) {
                return Optional.of(account);
            } else {
                throw new AppException(ErrorCode.INVALID_PASSWORD);
            }
        }
        return Optional.empty();
    }

    @Override
    public AccountResponse createAccount(AccountRequest accountRequest) {
        // Kiá»ƒm tra xem tÃªn Ä‘Äƒng nháº­p hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ tá»“n táº¡i hay chÆ°a
        if (accountRepository.existsByUsername(accountRequest.getUsername())
                || accountRepository.existsByPhone(accountRequest.getPhone())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_EXISTS);
        }

        // Táº¡o Ä‘á»‘i tÆ°á»£ng Account má»›i
        Account account = new Account();
        account.setUsername(accountRequest.getUsername());
        account.setFullname(accountRequest.getFullname());
        account.setPhone(accountRequest.getPhone());
        account.setEmail(accountRequest.getEmail());
        account.setBirthday(accountRequest.getBirthday());
        account.setGender(accountRequest.getGender());
        account.setCccd(accountRequest.getCccd());
        account.setAvatar(accountRequest.getAvatar());

        // MÃ£ hÃ³a máº­t kháº©u
        String encodedPassword = passwordEncoder.encode(accountRequest.getPassword());
        account.setPassword(encodedPassword);

        // Khá»Ÿi táº¡o danh sÃ¡ch authorities Ä‘á»ƒ trÃ¡nh NullPointerException
        account.setAuthorities(new ArrayList<>());

        // LÆ°u tÃ i khoáº£n trÆ°á»›c
        Account savedAccount = accountRepository.save(account);

        // Xá»­ lÃ½ danh sÃ¡ch vai trÃ²
        if (accountRequest.getRole() != null && !accountRequest.getRole().isEmpty()) {
            for (String roleName : accountRequest.getRole()) {
                // Chuyá»ƒn Ä‘á»•i roleName thÃ nh Roles enum
                Roles roleEnum;
                try {
                    roleEnum = Roles.valueOf(roleName.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new AppException(ErrorCode.ROLE_NOT_FOUND);
                }

                Optional<Role> roleOptional = roleRepository.findByRoleName(roleEnum);
                if (roleOptional.isPresent()) {
                    Role role = roleOptional.get();

                    // Táº¡o Ä‘á»‘i tÆ°á»£ng Auth má»›i cho má»—i vai trÃ² vÃ  liÃªn káº¿t tÃ i khoáº£n vá»›i vai trÃ²
                    Auth auth = new Auth();
                    auth.setAccount(savedAccount);
                    auth.setRole(role);

                    // ThÃªm quyá»n vÃ o danh sÃ¡ch authorities cá»§a tÃ i khoáº£n
                    savedAccount.getAuthorities().add(auth);

                    // LÆ°u dá»¯ liá»‡u quyá»n vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
                    authRepository.save(auth);
                } else {
                    throw new AppException(ErrorCode.ROLE_NOT_FOUND);
                }
            }
        } else {
            throw new AppException(ErrorCode.ROLE_NOT_PROVIDED);
        }

        return convertToAccountResponse(savedAccount);
    }

    private AccountResponse convertToAccountResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setUsername(account.getUsername());
        response.setFullname(account.getFullname());
        response.setPhone(account.getPhone());
        response.setEmail(account.getEmail());
        response.setBirthday(java.sql.Date.valueOf(account.getBirthday()));
        response.setGender(account.getGender());
        response.setCccd(account.getCccd());
        response.setAvatar(account.getAvatar());

        // Láº¥y danh sÃ¡ch cÃ¡c vai trÃ² tá»« account vÃ  chuyá»ƒn thÃ nh List<String>
        List<String> roles = account.getAuthorities().stream()
                .map(auth -> auth.getRole().getRoleName().name())
                .distinct() // Äáº£m báº£o khÃ´ng cÃ³ trÃ¹ng láº·p
                .collect(Collectors.toList());
        response.setRole(roles);

        // Láº¥y quyá»n tá»« danh sÃ¡ch authorities vÃ  chuyá»ƒn Ä‘á»•i thÃ nh List<String>
        List<String> permissions = account.getAuthorities().stream()
                .flatMap(auth ->
                        auth.getRole().getPermissions().stream().map(Permission::getName)) // Chá»‰ láº¥y tÃªn quyá»n
                .distinct() // Äá»ƒ loáº¡i bá» trÃ¹ng láº·p náº¿u cáº§n
                .collect(Collectors.toList());
        response.setPermissions(permissions);

        return response;
    }

    @Override
    public AccountResponse updateAccount(String username, AccountRequest accountRequest) {
        // Kiá»ƒm tra xem tÃ i khoáº£n cÃ³ tá»“n táº¡i hay khÃ´ng
        Optional<Account> accountOptional = accountRepository.findById(username);
        if (!accountOptional.isPresent()) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        // Láº¥y tÃ i khoáº£n Ä‘Ã£ tá»“n táº¡i
        Account account = accountOptional.get();

        // Cáº­p nháº­t thÃ´ng tin
        account.setFullname(accountRequest.getFullname());
        account.setPhone(accountRequest.getPhone());
        account.setEmail(accountRequest.getEmail());
        account.setBirthday(accountRequest.getBirthday());
        account.setGender(accountRequest.getGender());
        account.setCccd(accountRequest.getCccd());
        account.setAvatar(accountRequest.getAvatar());

        // Náº¿u máº­t kháº©u má»›i Ä‘Æ°á»£c cung cáº¥p, mÃ£ hÃ³a vÃ  cáº­p nháº­t
        if (accountRequest.getPassword() != null
                && !accountRequest.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(accountRequest.getPassword());
            account.setPassword(encodedPassword);
        }

        // LÆ°u tÃ i khoáº£n vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
        Account updatedAccount = accountRepository.save(account);

        return convertToAccountResponse(
                updatedAccount); // Tráº£ vá» AccountResponse cho tÃ i khoáº£n Ä‘Ã£ cáº­p nháº­t
    }

    @Override
    @Transactional
    public void deleteAccount(String username) {
        // Kiá»ƒm tra xem tÃ i khoáº£n cÃ³ tá»“n táº¡i hay khÃ´ng
        if (!accountRepository.existsById(username)) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }

        // XÃ³a cÃ¡c báº£n ghi liÃªn quan trong báº£ng auths
        authRepository.deleteByAccount_Username(username);

        // XÃ³a tÃ i khoáº£n tá»« cÆ¡ sá»Ÿ dá»¯ liá»‡u
        accountRepository.deleteById(username);
    }

    @Override
    public Account updateAcc(String username, Account account) {
        return accountRepository.save(account);
    }

    // @Cacheable(value = "account", key = "#username")
    @Override
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

        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();

        // Náº¿u password cÅ© khÃ´ng khá»›p vá»›i password trong database
        if (!pe.matches(changePasswordRequest.getOldPassword(), account.getPassword())) {
            return "Old password is not correct";
        }

        // Náº¿u password má»›i trÃ¹ng vá»›i password cÅ©
        if (pe.matches(changePasswordRequest.getNewPassword(), account.getPassword())) {
            return "New password cannot be the same as the old password";
        }

        String hashedNewPassword = pe.encode(changePasswordRequest.getNewPassword());

        account.setPassword(hashedNewPassword);
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
            BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
            String hashedNewPassword = pe.encode(changePasswordByEmail.getNewPassword());
            account.setPassword(hashedNewPassword);
            accountRepository.save(account);
            return true;
        } catch (Exception e) {
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
}
