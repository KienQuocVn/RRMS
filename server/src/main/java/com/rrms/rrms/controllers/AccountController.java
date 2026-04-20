package com.rrms.rrms.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.request.ChangePasswordRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.services.IAccountService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Account Controller", description = "Controller for Account")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api-accounts")
public class AccountController {
    IAccountService accountService;

    @Operation(summary = "Get all account")
    @GetMapping("/get-all-account")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getAllAccount() {
        var authen = SecurityContextHolder.getContext().getAuthentication();

        log.info("Get all account {}", authen.getName());
        authen.getAuthorities()
                .forEach(grantedAuthority -> log.info("GrantedAuthority: {}", grantedAuthority.getAuthority()));
        log.info("In method get Admin");

        return ApiResponse.<List<AccountResponse>>builder()
                .message("Call api success")
                .result(accountService.findAll())
                .build();
    }

    @GetMapping("/by-host-role")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getAccountsByHostRole() {
        List<AccountResponse> accountResponses = accountService.getAccountsByRole(Roles.HOST);
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Call api success")
                .result(accountResponses)
                .build();
    }

    @Operation(summary = "Get account by username")
    @GetMapping("/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> getAccountByUsername(@PathVariable String username) {
        AccountResponse account = accountService.findByUsername(username);
        return ApiResponse.<AccountResponse>builder()
                .message("Call API success")
                .result(account)
                .build();
    }

    @PostMapping("/createAccount")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> createAccount(@RequestBody AccountRequest accountRequest) {
        AccountResponse accountResponse = accountService.createAccount(accountRequest);
        return ApiResponse.<AccountResponse>builder()
                .message("Account created successfully")
                .result(accountResponse)
                .build();
    }

    @Operation(summary = "Update an existing host account")
    @PutMapping("/updateAccount/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> updateAccount(
            @PathVariable String username, @RequestBody AccountRequest accountRequest) {
        AccountResponse accountResponse = accountService.updateAccount(username, accountRequest);
        return ApiResponse.<AccountResponse>builder()
                .message("Account updated successfully")
                .result(accountResponse)
                .build();
    }

    @Operation(summary = "Delete an existing account")
    @DeleteMapping("/deleteAccount/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<Void> deleteAccount(@PathVariable String username) {
        accountService.deleteAccount(username);
        return ApiResponse.<Void>builder()
                .message("Account deleted successfully")
                .build();
    }

    @Operation(summary = "Update account by username")
    @PutMapping("/update-acc")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<Account> updateAccount(@RequestParam("username") String username, @RequestBody Account account) {
        Account updateAcc = accountService.updateAcc(username, account);
        return ApiResponse.<Account>builder()
                .message("Update product successful")
                .result(updateAcc)
                .build();
    }

    @Operation(summary = "Get profile by username")
    @GetMapping("/profile")
    public ApiResponse<AccountResponse> getProfile(@RequestParam("username") String username) {
        AccountResponse accountResponse = accountService.findByUsername(username);
        log.info("Get profile successfully");
        return ApiResponse.<AccountResponse>builder()
                .message("Get profile successfully")
                .result(accountResponse)
                .build();
    }

    @Operation(summary = "Update profile by username")
    @PutMapping("/profile")
    public ApiResponse<AccountResponse> updateProfile(@RequestBody AccountRequest accountRequest) {
        AccountResponse accountResponse = accountService.update(accountRequest);
        log.info("Update profile successfully");
        return ApiResponse.<AccountResponse>builder()
                .message("Update profile successfully")
                .result(accountResponse)
                .build();
    }

    @Operation(summary = "Change password by username")
    @PutMapping("/profile/change-password")
    public ApiResponse<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        String changePassword = accountService.changePassword(changePasswordRequest);
        log.info("Change password successfully");
        return ApiResponse.<String>builder()
                .message("Change password successfully")
                .result(changePassword)
                .build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<List<AccountResponse>> searchAccounts(@RequestParam(required = false) String search) {
        List<AccountResponse> accounts;
        if (search == null || search.trim().isEmpty()) {
            accounts = accountService.findAll();
        } else {
            accounts = accountService.searchAccounts(search.toLowerCase());
        }

        return ApiResponse.<List<AccountResponse>>builder()
                .message("Search results found")
                .result(accounts)
                .build();
    }
}
