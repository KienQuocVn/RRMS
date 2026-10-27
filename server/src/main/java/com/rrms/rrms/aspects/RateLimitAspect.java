package com.rrms.rrms.aspects;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import jakarta.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.rrms.rrms.annotations.RateLimited;
import com.rrms.rrms.configs.RedisRateLimiter;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;

import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private final RedisRateLimiter rateLimiter;

    @Around("@annotation(com.rrms.rrms.annotations.RateLimited)")
    public Object rateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimited rateLimited = method.getAnnotation(RateLimited.class);

        HttpServletRequest request =
                ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isBlank()) {
            ipAddress = request.getRemoteAddr();
        } else {
            ipAddress = ipAddress.split(",")[0].trim();
        }

        String key = rateLimited.key() + ":" + ipAddress;
        // Login limits must be per account as well as per IP. A shared NAT IP
        // should not let one user's attempts lock out every other user.
        if ("login".equals(rateLimited.key()) && joinPoint.getArgs().length > 0) {
            Object body = joinPoint.getArgs()[0];
            try {
                Method phoneGetter = body.getClass().getMethod("getPhone");
                Object phone = phoneGetter.invoke(body);
                if (phone != null && !phone.toString().isBlank()) {
                    key += ":" + sha256(phone.toString().trim().toLowerCase());
                }
            } catch (ReflectiveOperationException ignored) {
                // Keep the IP-only protection if the request has no phone field.
            }
        }
        int maxAttempts = rateLimited.maxAttempts();
        int windowSeconds = rateLimited.windowSeconds();

        if (!rateLimiter.isAllowed(key, maxAttempts, windowSeconds)) {
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }

        return joinPoint.proceed();
    }

    private String sha256(String value) {
        try {
            return HexFormat.of()
                    .formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
