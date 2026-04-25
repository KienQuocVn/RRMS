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

import com.nimbusds.jose.*;
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
    private String signerKey;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public IntrospecTokenResponse introspect(IntrospecTokenRequest request) throws ParseException, JOSEException {
        try {
            // Láº¥y token tá»« request
            String token = request.getToken();

            // Kiá»ƒm tra token cÃ³ rá»—ng hay khÃ´ng
            if (StringUtils.isEmpty(token)) {
                return IntrospecTokenResponse.builder()
                        .valid(false)
                        .message("Token is empty")
                        .build();
            }

            // Gá»i hÃ m verifyToken Ä‘á»ƒ xÃ¡c thá»±c token
            SignedJWT signedJWT = verifyToken(token, false);

            // Parse chuá»—i JWT thÃ nh Ä‘á»‘i tÆ°á»£ng SignedJWT Ä‘á»ƒ cÃ³ thá»ƒ xá»­ lÃ½
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            List<String> roles = claimsSet.getStringListClaim("roles");
            List<String> permissions = claimsSet.getStringListClaim("permissions");
            Date expirationTime = claimsSet.getExpirationTime();

            // Kiá»ƒm tra token Ä‘Ã£ háº¿t háº¡n chÆ°a
            if (expirationTime == null || expirationTime.before(new Date())) {
                return IntrospecTokenResponse.builder()
                        .valid(false)
                        .message("Token has expired")
                        .build();
            }

            // Náº¿u token há»£p lá»‡ (chá»¯ kÃ½ Ä‘Ãºng vÃ  chÆ°a háº¿t háº¡n)
            return IntrospecTokenResponse.builder()
                    .valid(true) // Token há»£p lá»‡
                    .message("Token is valid") // Message thÃ´ng bÃ¡o
                    .subject(claimsSet.getSubject()) // Subject cá»§a token (thÆ°á»ng lÃ  username/phone)
                    .expirationTime(expirationTime) // Thá»i gian háº¿t háº¡n
                    .issuer(claimsSet.getIssuer()) // Issuer (ngÆ°á»i phÃ¡t hÃ nh token)
                    .issuedAt(claimsSet.getIssueTime()) // Thá»i gian phÃ¡t hÃ nh token
                    .roles(roles) // ThÃªm roles vÃ o response
                    .permissions(permissions) // ThÃªm permissions vÃ o response
                    .build();

        } catch (Exception e) {
            // Log láº¡i lá»—i náº¿u cÃ³ exception xáº£y ra trong quÃ¡ trÃ¬nh xá»­ lÃ½ token
            log.error("Error introspecting token", e);

            // Tráº£ vá» response vá»›i thÃ´ng bÃ¡o lá»—i cá»¥ thá»ƒ
            return IntrospecTokenResponse.builder()
                    .valid(false)
                    .message("Error processing token: " + e.getMessage())
                    .build();
        }
    }

    public LoginResponse loginResponse(LoginRequest request) {
        // Láº¥y tÃ i khoáº£n tá»« AccountService dá»±a trÃªn sá»‘ Ä‘iá»‡n thoáº¡i vÃ  máº­t kháº©u
        // Náº¿u khÃ´ng tÃ¬m tháº¥y hoáº·c máº­t kháº©u sai, nÃ©m ngoáº¡i lá»‡ AUTHENTICATED
        Account account = accountService
                .login(request.getPhone(), request.getPassword())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        // Táº¡o token JWT cho tÃ i khoáº£n sau khi Ä‘Äƒng nháº­p thÃ nh cÃ´ng
        var token = generateToken(account);

        // Láº¥y danh sÃ¡ch vai trÃ² cá»§a tÃ i khoáº£n
        List<String> roles = account.getRoles();

        // XÃ¢y dá»±ng Ä‘á»‘i tÆ°á»£ng LoginResponse vá»›i cÃ¡c thÃ´ng tin cáº§n thiáº¿t
        return LoginResponse.builder()
                .token(token) // Token JWT
                .authenticated(true) // Tráº¡ng thÃ¡i xÃ¡c thá»±c thÃ nh cÃ´ng
                .username(account.getUsername()) // TÃªn ngÆ°á» i dÃ¹ng
                .fullName(account.getFullName()) // Há»  vÃ  tÃªn Ä‘áº§y Ä‘á»§
                .phone(account.getPhone())
                .email(account.getEmail()) // Ä á»‹a chá»‰ email
                .avatar(account.getAvatar()) // áº¢nh Ä‘áº¡i diá»‡n (avatar)
                .birthday(account.getBirthday()) // NgÃ y sinh cá»§a ngÆ°á» i dÃ¹ng
                .gender(account.getGender()) // Giá»›i tÃ­nh
                .cccd(account.getCccd()) // CCCD (Chá»©ng minh nhÃ¢n dÃ¢n)
                .roles(roles)
                .build(); // HoÃ n thÃ nh viá»‡c xÃ¢y dá»±ng LoginResponse
    }

    public String generateToken(Account account) {
        // Táº¡o tiÃªu Ä‘á» cho JWT sá»­ dá»¥ng thuáº­t toÃ¡n kÃ½ HS512
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Láº¥y danh sÃ¡ch role vÃ  permission tá»« tÃ i khoáº£n
        List<String> roles = account.getAuthorities().stream()
                .map(auth -> auth.getRole().getRoleName().name()) // Láº¥y tÃªn cá»§a cÃ¡c role
                .collect(Collectors.toList());

        List<String> permissions = account.getAuthorities().stream()
                .flatMap(auth -> auth.getRole().getPermissions().stream()) // Láº¥y cÃ¡c permissions tá»« role
                .map(permission -> permission.getName()) // Láº¥y tÃªn cá»§a cÃ¡c permission
                .distinct() // Loáº¡i bá» trÃ¹ng láº·p náº¿u cÃ³
                .collect(Collectors.toList());

        // XÃ¢y dá»±ng JWT vá»›i cÃ¡c thÃ´ng tin cáº§n thiáº¿t
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername()) // Subject of the JWT must align with refresh token lookup
                .issuer(account.getUsername()) // NgÆ°á»i phÃ¡t hÃ nh (issuer)
                .issueTime(new Date()) // Thá»i gian phÃ¡t hÃ nh JWT
                .expirationTime(new Date(Instant.now()
                        .plus(VALID_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())) // Thá»i gian háº¿t háº¡n cá»§a JWT
                .claim("roles", roles) // ThÃªm danh sÃ¡ch roles vÃ o claim
                .jwtID(UUID.randomUUID().toString())
                .claim("permissions", permissions) // ThÃªm danh sÃ¡ch permissions vÃ o claim
                .build(); // HoÃ n thÃ nh viá»‡c xÃ¢y dá»±ng claims

        // Chuyá»ƒn claims thÃ nh payload cho JWT
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        // Táº¡o Ä‘á»‘i tÆ°á»£ng JWSObject chá»©a header vÃ  payload
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            // KÃ½ JWT báº±ng khÃ³a bÃ­ máº­t
            jwsObject.sign(new MACSigner(signerKey.getBytes()));

            // Tráº£ vá» JWT Ä‘Ã£ Ä‘Æ°á»£c kÃ½ (token) dÆ°á»›i dáº¡ng chuá»—i
            return jwsObject.serialize();
        } catch (JOSEException e) {
            // Log lá»—i náº¿u khÃ´ng thá»ƒ táº¡o token JWT vÃ  nÃ©m ra ngoáº¡i lá»‡
            log.error("Cannot generate token", e);
            throw new AppException(ErrorCode.TOKEN_GENERATION_FAILED);
        }
    }

    public LoginResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var username = signedJWT.getJWTClaimsSet().getSubject();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
        invalidatedTokenRepository.save(invalidatedToken);

        var user = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .authenticated(true)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .cccd(user.getCccd())
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

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

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                        .getJWTClaimsSet()
                        .getIssueTime()
                        .toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
}
