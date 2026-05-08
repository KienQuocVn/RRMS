package com.rrms.rrms.controllers;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.request.ChangePasswordRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.PageResponse;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.services.IAccountService;
import com.rrms.rrms.utils.PageableUtils;

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
@RequestMapping({"/api-accounts", "/api/v1/accounts", "/api/v1/api-accounts"})
public class AccountController {
    IAccountService accountService;

    @Operation(summary = "Get all accounts")
    @GetMapping({"", "/get-all-account"})
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<PageResponse<AccountResponse>> getAllAccounts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        Pageable pageable = PageableUtils.of(page, size, sortBy, sortDirection);
        PageResponse<AccountResponse> result = PageResponse.from(accountService.findAll(pageable));

        return ApiResponse.<PageResponse<AccountResponse>>builder()
                .message("Tài khoản đã được khôi phục thành công")
                .result(result)
                .build();
    }

    @GetMapping({"/by-host-role", "/roles/host"})
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<PageResponse<AccountResponse>> getAccountsByHostRole(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        Pageable pageable = PageableUtils.of(page, size, sortBy, sortDirection);
        PageResponse<AccountResponse> result =
                PageResponse.from(accountService.getAccountsByRole(Roles.HOST, pageable));

        return ApiResponse.<PageResponse<AccountResponse>>builder()
                .message("Đã truy xuất thành công tài khoản máy chủ")
                .result(result)
                .build();
    }

    @Operation(summary = "Get account by username")
    @GetMapping("/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> getAccountByUsername(@PathVariable String username) {
        return ApiResponse.<AccountResponse>builder()
                .message("Tài khoản đã được khôi phục thành công")
                .result(accountService.findByUsername(username))
                .build();
    }

    @PostMapping({"", "/createAccount"})
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @RequestBody @Valid AccountRequest accountRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AccountResponse>builder()
                        .message("Tài khoản đã được tạo thành công")
                        .result(accountService.createAccount(accountRequest))
                        .build());
    }

    @Operation(summary = "Update an existing account")
    @PutMapping({"/{username}", "/updateAccount/{username}"})
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> updateAccount(
            @PathVariable String username, @RequestBody @Valid AccountRequest accountRequest) {
        return ApiResponse.<AccountResponse>builder()
                .message("Tài khoản đã được cập nhật thành công.")
                .result(accountService.updateAccount(username, accountRequest))
                .build();
    }

    @Operation(summary = "Delete an existing account")
    @DeleteMapping({"/{username}", "/deleteAccount/{username}"})
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<Void> deleteAccount(@PathVariable String username) {
        accountService.deleteAccount(username);
        return ApiResponse.<Void>builder()
                .message("Tài khoản đã bị xóa thành công")
                .build();
    }

    @Operation(summary = "Update account by username")
    @PutMapping("/update-acc")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ApiResponse<Account> updateAccount(@RequestParam("username") String username, @RequestBody Account account) {
        return ApiResponse.<Account>builder()
                .message("Tài khoản đã được cập nhật thành công.")
                .result(accountService.updateAcc(username, account))
                .build();
    }

    @Operation(summary = "Get profile by username")
    @GetMapping("/profile")
    public ApiResponse<AccountResponse> getProfile(@RequestParam("username") String username) {
        return ApiResponse.<AccountResponse>builder()
                .message("Đăng nhập thành công")
                .result(accountService.findByUsername(username))
                .build();
    }

    @Operation(summary = "Update profile by username")
    @PutMapping("/profile")
    public ApiResponse<AccountResponse> updateProfile(@RequestBody @Valid AccountRequest accountRequest) {
        return ApiResponse.<AccountResponse>builder()
                .message("Cập nhật hồ sơ thành công")
                .result(accountService.update(accountRequest))
                .build();
    }

    @Operation(summary = "Change password by username")
    @PutMapping("/profile/change-password")
    public ApiResponse<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return ApiResponse.<String>builder()
                .message("Đổi mật khẩu thành công")
                .result(accountService.changePassword(changePasswordRequest))
                .build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
    public ApiResponse<PageResponse<AccountResponse>> searchAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        Pageable pageable = PageableUtils.of(page, size, sortBy, sortDirection);
        PageResponse<AccountResponse> result = search == null || search.trim().isEmpty()
                ? PageResponse.from(accountService.findAll(pageable))
                : PageResponse.from(accountService.searchAccounts(search.trim(), pageable));

        return ApiResponse.<PageResponse<AccountResponse>>builder()
                .message("Tài khoản đã được truy xuất thành công")
                .result(result)
                .build();
    }

    @Operation(summary = "Get user favorites")
    @GetMapping("/me/favorites")
    public ApiResponse<java.util.List<com.rrms.rrms.dto.response.BulletinBoardResponse>> getFavorites() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return ApiResponse.<java.util.List<com.rrms.rrms.dto.response.BulletinBoardResponse>>builder()
                .message("Danh sách yêu thích đã được truy xuất thành công")
                .result(accountService.getFavoriteBulletinBoards(authentication.getName()))
                .build();
    }

    @Operation(summary = "Add to favorites")
    @PostMapping("/me/favorites/{bulletinBoardId}")
    public ApiResponse<Void> addFavorite(@PathVariable java.util.UUID bulletinBoardId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        accountService.addFavoriteBulletinBoard(authentication.getName(), bulletinBoardId);
        return ApiResponse.<Void>builder()
                .message("Đã thêm vào danh sách yêu thích thành công")
                .build();
    }

    @Operation(summary = "Remove from favorites")
    @DeleteMapping("/me/favorites/{bulletinBoardId}")
    public ApiResponse<Void> removeFavorite(@PathVariable java.util.UUID bulletinBoardId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        accountService.removeFavoriteBulletinBoard(authentication.getName(), bulletinBoardId);
        return ApiResponse.<Void>builder()
                .message("Đã xóa khỏi danh sách yêu thích thành công")
                .build();
    }
}
