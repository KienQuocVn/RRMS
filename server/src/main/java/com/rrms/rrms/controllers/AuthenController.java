package com.rrms.rrms.controllers;

import java.io.IOException;
import java.text.ParseException;
import java.util.UUID;

import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;
import com.rrms.rrms.annotations.RateLimited;
import com.rrms.rrms.dto.request.*;
import com.rrms.rrms.dto.response.*;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.services.IAccountService;
import com.rrms.rrms.services.IAuthorityService;
import com.rrms.rrms.services.IMailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/authen")
@Slf4j
public class AuthenController {
    private final IAccountService accountService;

    private final IAuthorityService authorityService;

    private final IMailService mailService;

    private final AccountRepository accountRepository;

    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    @GetMapping("/error")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ÄÄƒng nháº­p tháº¥t báº¡i!");
    }

    @GetMapping("/success")
    public void loginSuccess(
            HttpServletRequest request, HttpServletResponse response, @AuthenticationPrincipal OAuth2User oauthUser)
            throws IOException, ParseException {

        if (oauthUser == null) {
            log.error("OAuth2 User is null");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "KhÃ´ng xÃ¡c thá»±c Ä‘Æ°á»£c tÃ i khoáº£n Google");
            return;
        }

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        if (email == null || name == null) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST, "KhÃ´ng láº¥y Ä‘Æ°á»£c thÃ´ng tin email hoáº·c tÃªn");
            return;
        }

        Account account = accountService.findByEmail(email).orElseGet(() -> {
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .username(name)
                    .email(email)
                    .password(UUID.randomUUID().toString())
                    .userType("CUSTOMER")
                    .build();
            return accountService.registergg(registerRequest);
        });

        String token = authorityService.generateToken(account);

        response.setContentType("application/json");
        response.getWriter().write("{\"token\":\"" + token + "\"}");
    }

    @PostMapping("/login")
    @RateLimited(key = "login", maxAttempts = 5, windowSeconds = 300)
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        accountService
                .findByPhone(loginRequest.getPhone())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        LoginResponse loginResponse = authorityService.loginResponse(loginRequest);

        return ApiResponse.<LoginResponse>builder()
                .message("ÄÄƒng nháº­p thÃ nh cÃ´ng.")
                .result(loginResponse)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospecTokenResponse> introspect(@RequestBody IntrospecTokenRequest request)
            throws ParseException, JOSEException {
        var result = authorityService.introspect(request);
        return ApiResponse.<IntrospecTokenResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authorityService.logout(request);
        return ApiResponse.<Void>builder().message("Đăng xuất thành công").build();
    }

    @PostMapping("/register")
    @RateLimited(key = "register", maxAttempts = 5, windowSeconds = 300)
    public ApiResponse<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        Account account = accountService.register(registerRequest);

        RegisterResponse response = new RegisterResponse();
        response.setStatus(true);
        response.setMessage("ÄÄƒng kÃ½ thÃ nh cÃ´ng");
        response.setUsername(account.getUsername());

        return ApiResponse.<RegisterResponse>builder().result(response).build();
    }

    @PostMapping("/refreshToken")
    public ApiResponse<LoginResponse> refresh(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        LoginResponse loginResponse = authorityService.refreshToken(request);
        return ApiResponse.<LoginResponse>builder()
                .message("LÃ m má»›i token thÃ nh cÃ´ng.")
                .result(loginResponse)
                .build();
    }

    @GetMapping("/checkMail")
    public ApiResponse<Boolean> forget(@RequestParam("email") String email) {
        boolean result = accountService.existsByEmail(email);
        if (result) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(true)
                    .build();
        } else {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }

    @PostMapping("/forgetpassword")
    @RateLimited(key = "forgot_password", maxAttempts = 3, windowSeconds = 300)
    public ApiResponse<Boolean> forget(@RequestBody ChangePasswordByEmail changePasswordByEmail) {
        if (changePasswordByEmail == null) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
        int randomOtp = (int) (Math.random() * 90000) + 10000;
        try {
            boolean result = mailService.Send_ForgetPassword(
                    changePasswordByEmail.getEmail(), "YÃªu cáº§u thay Ä‘á»•i máº­t kháº©u", String.valueOf(randomOtp));
            if (result) {
                redisTemplate
                        .opsForValue()
                        .set(
                                "otp:forgot:" + changePasswordByEmail.getEmail(),
                                String.valueOf(randomOtp),
                                5,
                                java.util.concurrent.TimeUnit.MINUTES);
            }
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }

    @PostMapping("/authenticationRegister")
    @RateLimited(key = "auth_register", maxAttempts = 3, windowSeconds = 300)
    public ApiResponse<Boolean> authenticationRegister(@RequestBody AuthenticationRegister authenticationRegister) {
        // Avoid logging full request (may include PII); log only stable identifier.
        if (authenticationRegister != null) {
            log.debug("Authentication register OTP requested for gmail={}", authenticationRegister.getGmail());
        }
        if (authenticationRegister == null) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
        int randomOtp = (int) (Math.random() * 90000) + 10000;
        try {
            boolean result = mailService.Send_ForgetPassword(
                    authenticationRegister.getGmail(), "XÃ¡c thá»±c tÃ i khoáº£n", String.valueOf(randomOtp));
            if (result) {
                redisTemplate
                        .opsForValue()
                        .set(
                                "otp:register:" + authenticationRegister.getGmail(),
                                String.valueOf(randomOtp),
                                5,
                                java.util.concurrent.TimeUnit.MINUTES);
            }
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }

    @PostMapping("/acceptChangePassword")
    public ApiResponse<Boolean> acceptChangePassword(@RequestBody ChangePasswordByEmail changePasswordByEmail) {
        String storedOtp = redisTemplate.opsForValue().get("otp:forgot:" + changePasswordByEmail.getEmail());
        if (storedOtp == null || !changePasswordByEmail.getCode().equals(storedOtp)) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("MÃ£ OTP khÃ´ng Ä‘Ãºng hoáº·c Ä‘Ã£ háº¿t háº¡n")
                    .result(false)
                    .build();
        }
        if (!accountService.existsByEmail(changePasswordByEmail.getEmail())) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
        boolean result = accountService.changePasswordByEmail(changePasswordByEmail);
        redisTemplate.delete("otp:forgot:" + changePasswordByEmail.getEmail());
        if (result) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(true)
                    .build();
        } else {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }

    @PostMapping("/acceptAuthenticationRegister")
    public ApiResponse<Boolean> acceptAuthenticationRegister(
            @RequestBody AuthenticationRegister authenticationRegister) {
        String storedOtp = redisTemplate.opsForValue().get("otp:register:" + authenticationRegister.getGmail());
        if (storedOtp == null || !authenticationRegister.getCode().equals(storedOtp)) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("MÃ£ OTP khÃ´ng Ä‘Ãºng hoáº·c Ä‘Ã£ háº¿t háº¡n")
                    .result(false)
                    .build();
        } else {
            redisTemplate.delete("otp:register:" + authenticationRegister.getGmail());
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(true)
                    .build();
        }
    }

    @PostMapping("/checkregister")
    @PermitAll
    public ApiResponse<Boolean> checkRegister(@RequestBody @Valid RegisterRequest request) {
        // Kiá»ƒm tra tÃªn Ä‘Äƒng nháº­p Ä‘Ã£ tá»“n táº¡i chÆ°a
        if (accountRepository.existsByUsername(request.getUsername())) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("TÃªn Ä‘Äƒng nháº­p Ä‘Ã£ tá»“n táº¡i!")
                    .result(false)
                    .build();
        }

        //        // Kiá»ƒm tra sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ tá»“n táº¡i chÆ°a
        //        if (accountRepository.existsByPhone(request.getPhone())) {
        //            return ApiResponse.<Boolean>builder()
        //                    .code(HttpStatus.BAD_REQUEST.value())
        //                    .message("Sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ tá»“n táº¡i!")
        //                    .result(false)
        //                    .build();
        //        }

        // Kiá»ƒm tra email Ä‘Ã£ tá»“n táº¡i chÆ°a
        // if (accountRepository.existsAccountByEmail(request.getEmail())) {
        //     return ApiResponse.<Boolean>builder()
        //             .code(HttpStatus.BAD_REQUEST.value())
        //             .message("Email Ä‘Ã£ tá»“n táº¡i!")
        //             .result(false)
        //             .build();
        // }

        return ApiResponse.<Boolean>builder()
                .code(HttpStatus.OK.value())
                .message("ThÃ´ng tin há»£p lá»‡")
                .result(true)
                .build();
    }

    @PostMapping("/checkregister/{username}")
    public ApiResponse<Boolean> checkRegister(@PathVariable("username") String username) {
        boolean result = accountService.existsByUsername(username);
        if (result) {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.OK.value())
                    .message("success")
                    .result(true)
                    .build();
        } else {
            return ApiResponse.<Boolean>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("error")
                    .result(false)
                    .build();
        }
    }
}
