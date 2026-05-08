package com.rrms.rrms.configs;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.util.AntPathMatcher;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    private static final String[] CAPTCHA_PUBLIC_ENDPOINTS = {
        "/api/verify-captcha",
        "/api/verify-captcha/**",
        "/api/v1/verify-captcha",
        "/api/v1/verify-captcha/**",
        "/api/v1/api/verify-captcha",
        "/api/v1/api/verify-captcha/**"
    };

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private static final String[] PUBLIC_ENDPOINTS = {
        "/oauth2/authorization/google",
        "/oauth2/callback/google/**",
        "/favicon.ico",
        "/",
        "/authen/login",
        "/authen/error",
        "/authen/success",
        "/authen/**",
        "/api/v1/authen/**",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/searchs/**",
        "/search/**",
        "/api/v1/search/**",
        "/detail/**",
        "/bulletin-board/*",
        "/motels/get-motel-id",
        "/payment/vnpay/**",
        "/payment/momo/**",
        "/payment/paypal/**",
        "/payment/vnpay-callback/**",
        "/payment/paymentSuccess/**",
        "/payment/paymentFailed/**",
        "/api/verify-captcha",
        "/api/verify-captcha/**",
        "/api/v1/verify-captcha",
        "/api/v1/verify-captcha/**",
        "/api/v1/api/verify-captcha",
        "/api/v1/api/verify-captcha/**",
        "/support/**",
        "/supports/**",
        "/api/v1/supports/**"
    };

    @Value("${jwt.signer-key}")
    private String signerKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationEntryPoint authenticationEntryPoint)
            throws Exception {
        http.cors(withDefaults());

        http.authorizeHttpRequests(request -> request.requestMatchers(PUBLIC_ENDPOINTS)
                .permitAll()
                .anyRequest()
                .authenticated());

        // Cấu hình OAuth2 Login
        http.oauth2Login(oauth2 -> oauth2.loginPage("/authen/login")
                .successHandler((request, response, authentication) -> {
                    response.sendRedirect("/authen/success");
                })
                .failureHandler((request, response, exception) -> {
                    response.sendRedirect("/authen/error");
                }));

        http.oauth2ResourceServer(oauth2 -> oauth2.bearerTokenResolver(publicAwareBearerTokenResolver())
                .jwt(jwtConfigurer ->
                        jwtConfigurer.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter())));

        http.exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint));

        http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers(PUBLIC_ENDPOINTS));
        return http.build();
    }

    @Bean
    public BearerTokenResolver publicAwareBearerTokenResolver() {
        DefaultBearerTokenResolver delegate = new DefaultBearerTokenResolver();
        return request -> isCaptchaPublicEndpoint(request.getServletPath()) ? null : delegate.resolve(request);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // Đặt tiền tố ROLE_ cho các vai trò
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // Xác định trường chứa vai trò trong JWT

        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

        return authenticationConverter;
    }

    @Bean
    public JwtAuthenticationEntryPoint authenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HmacSHA512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    private boolean isCaptchaPublicEndpoint(String servletPath) {
        if (servletPath == null || servletPath.isBlank()) {
            return false;
        }

        return Arrays.stream(CAPTCHA_PUBLIC_ENDPOINTS).anyMatch(pattern -> PATH_MATCHER.match(pattern, servletPath));
    }
}
