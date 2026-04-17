package com.rrms.rrms.aspects;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.rrms.rrms.annotations.RateLimited;
import com.rrms.rrms.configs.RedisRateLimiter;

@Aspect
@Component
public class RateLimitAspect {

    @Autowired
    private RedisRateLimiter rateLimiter;

    @Around("@annotation(com.rrms.rrms.annotations.RateLimited)")
    public Object rateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimited rateLimited = method.getAnnotation(RateLimited.class);

        HttpServletRequest request =
                ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ipAddress = request.getRemoteAddr();

        String key = rateLimited.key() + ":" + ipAddress;
        int maxAttempts = rateLimited.maxAttempts();
        int windowSeconds = rateLimited.windowSeconds();

        if (!rateLimiter.isAllowed(key, maxAttempts, windowSeconds)) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", "Too many requests. Please try again later.");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        return joinPoint.proceed();
    }
}
