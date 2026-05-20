package com.rrms.rrms.services.servicesImp;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.rrms.rrms.dto.request.IntrospecTokenRequest;
import com.rrms.rrms.dto.request.LoginRequest;
import com.rrms.rrms.dto.request.LogoutRequest;
import com.rrms.rrms.dto.request.RefreshRequest;
import com.rrms.rrms.dto.response.IntrospecTokenResponse;
import com.rrms.rrms.dto.response.LoginResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Auth;
import com.rrms.rrms.models.InvalidatedToken;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.InvalidatedTokenRepository;
import com.rrms.rrms.services.IAuthorityService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthorityService implements IAuthorityService {

    final InvalidatedTokenRepository invalidatedTokenRepository;
    final AccountRepository accountRepository;
    final AccountService accountService;
    final AuthRepository authRepository;

    @NonFinal
    @Value("${jwt.signer-key}")
    String signerKey;

    @NonFinal
    @Value("${jwt.valid-duration}")
    long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    long REFRESHABLE_DURATION;

    @Override
    public IntrospecTokenResponse introspect(IntrospecTokenRequest request) throws ParseException, JOSEException {
        try {
            String token = request.getToken();

            if (StringUtils.isEmpty(token)) {
                return IntrospecTokenResponse.builder()
                        .valid(false)
                        .message("Token is empty")
                        .build();
            }

            SignedJWT signedJWT = verifyToken(token, false);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            List<String> roles = claimsSet.getStringListClaim("roles");
            List<String> permissions = claimsSet.getStringListClaim("permissions");
            Date expirationTime = claimsSet.getExpirationTime();

            if (expirationTime == null || expirationTime.before(new Date())) {
                return IntrospecTokenResponse.builder()
                        .valid(false)
                        .message("Token has expired")
                        .build();
            }

            return IntrospecTokenResponse.builder()
                    .valid(true)
                    .message("Token is valid")
                    .subject(claimsSet.getSubject())
                    .expirationTime(expirationTime)
                    .issuer(claimsSet.getIssuer())
                    .issuedAt(claimsSet.getIssueTime())
                    .roles(roles)
                    .permissions(permissions)
                    .build();
        } catch (Exception exception) {
            log.error("Error introspecting token", exception);
            return IntrospecTokenResponse.builder()
                    .valid(false)
                    .message("Error processing token: " + exception.getMessage())
                    .build();
        }
    }

    @Override
    public LoginResponse loginResponse(LoginRequest request) {
        Account account = accountService
                .login(request.getPhone(), request.getPassword())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        return buildLoginResponse(account);
    }

    @Override
    public LoginResponse buildLoginResponse(Account account) {
        String token = generateToken(account);
        List<String> roles = account.getRoles();

        return LoginResponse.builder()
                .token(token)
                .authenticated(true)
                .username(account.getUsername())
                .fullName(account.getFullName())
                .phone(account.getPhone())
                .email(account.getEmail())
                .avatar(account.getAvatar())
                .birthday(account.getBirthday())
                .gender(account.getGender())
                .cccd(account.getCccd())
                .roles(roles)
                .build();
    }

    @Override
    public String generateToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        List<String> roles = account.getAuthorities().stream()
                .map(auth -> auth.getRole().getRoleName().name())
                .collect(Collectors.toList());

        List<String> permissions = account.getAuthorities().stream()
                .flatMap(auth -> auth.getRole().getPermissions().stream())
                .map(permission -> permission.getName())
                .distinct()
                .collect(Collectors.toList());

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer(account.getUsername())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .claim("roles", roles)
                .jwtID(UUID.randomUUID().toString())
                .claim("permissions", permissions)
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException exception) {
            log.error("Cannot generate token", exception);
            throw new AppException(ErrorCode.TOKEN_GENERATION_FAILED);
        }
    }

    @Override
    public LoginResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken(), true);
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        String username = signedJWT.getJWTClaimsSet().getSubject();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
        invalidatedTokenRepository.save(invalidatedToken);

        Account user = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        return buildLoginResponse(user);
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            SignedJWT signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }

    @Override
    public Auth save(Auth auth) {
        return authRepository.save(auth);
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = isRefresh
                ? new Date(signedJWT
                        .getJWTClaimsSet()
                        .getIssueTime()
                        .toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }
}
