package com.rrms.rrms.aspects;

import java.lang.reflect.Method;

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
        int maxAttempts = rateLimited.maxAttempts();
        int windowSeconds = rateLimited.windowSeconds();

        if (!rateLimiter.isAllowed(key, maxAttempts, windowSeconds)) {
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }

        return joinPoint.proceed();
    }
}
