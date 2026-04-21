package com.rrms.rrms.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.nimbusds.jwt.SignedJWT;
import com.rrms.rrms.dto.request.RefreshRequest;
import com.rrms.rrms.dto.response.LoginResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.Gender;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Auth;
import com.rrms.rrms.models.InvalidatedToken;
import com.rrms.rrms.models.Permission;
import com.rrms.rrms.models.Role;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.InvalidatedTokenRepository;
import com.rrms.rrms.services.servicesImp.AccountService;
import com.rrms.rrms.services.servicesImp.AuthorityService;

@ExtendWith(MockitoExtension.class)
class AuthorityServiceTest {

    private static final String SIGNER_KEY = "1234567890123456789012345678901234567890123456789012345678901234";

    @Mock
    InvalidatedTokenRepository invalidatedTokenRepository;

    @Mock
    AccountRepository accountRepository;

    @Mock
    AccountService accountService;

    @Mock
    AuthRepository authRepository;

    @InjectMocks
    AuthorityService authorityService;

    private Account account;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authorityService, "signerKey", SIGNER_KEY);
        ReflectionTestUtils.setField(authorityService, "VALID_DURATION", 3600L);
        ReflectionTestUtils.setField(authorityService, "REFRESHABLE_DURATION", 7200L);

        Permission permission = Permission.builder().name("invoice:read").build();
        Role role = Role.builder()
                .roleName(Roles.HOST)
                .permissions(Set.of(permission))
                .build();
        Auth auth = new Auth();
        auth.setRole(role);

        account = Account.builder()
                .username("host001")
                .phone("0901234567")
                .fullname("Host User")
                .email("host@example.com")
                .avatar("avatar.png")
                .birthday(LocalDate.of(1995, 5, 1))
                .gender(Gender.MALE)
                .cccd("012345678901")
                .authorities(Collections.singletonList(auth))
                .build();
    }

    @Test
    void generateToken_usesUsernameAsSubject() throws ParseException {
        String token = authorityService.generateToken(account);

        SignedJWT signedJWT = SignedJWT.parse(token);

        assertEquals(account.getUsername(), signedJWT.getJWTClaimsSet().getSubject());
        assertEquals(account.getUsername(), signedJWT.getJWTClaimsSet().getIssuer());
        assertEquals(
                Collections.singletonList("HOST"), signedJWT.getJWTClaimsSet().getStringListClaim("roles"));
        assertEquals(
                Collections.singletonList("invoice:read"),
                signedJWT.getJWTClaimsSet().getStringListClaim("permissions"));
    }

    @Test
    void refreshToken_looksUpAccountByUsernameFromTokenSubject() throws Exception {
        String token = authorityService.generateToken(account);
        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        when(accountRepository.findByUsername(account.getUsername())).thenReturn(Optional.of(account));
        when(invalidatedTokenRepository.save(any(InvalidatedToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoginResponse response = authorityService.refreshToken(
                RefreshRequest.builder().token(token).build());

        assertNotNull(response.getToken());
        assertEquals(account.getUsername(), response.getUsername());
        assertEquals(account.getPhone(), response.getPhone());
        verify(accountRepository).findByUsername(account.getUsername());
        verify(accountRepository, never()).findByUsername(account.getPhone());
    }

    @Test
    void refreshToken_whenSubjectDoesNotMapToAccount_throwsUnauthenticated() throws Exception {
        String token = authorityService.generateToken(account);
        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        when(accountRepository.findByUsername(account.getUsername())).thenReturn(Optional.empty());
        when(invalidatedTokenRepository.save(any(InvalidatedToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppException exception = assertThrows(
                AppException.class,
                () -> authorityService.refreshToken(
                        RefreshRequest.builder().token(token).build()));

        assertEquals(ErrorCode.UNAUTHENTICATED, exception.getErrorCode());
    }
}
