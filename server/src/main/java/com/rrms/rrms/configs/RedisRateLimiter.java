package com.rrms.rrms.configs;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RedisRateLimiter {
    @Autowired
    private StringRedisTemplate redisTemplate;

    public boolean isAllowed(String key, int maxAttempts, int windowSeconds) {
        String redisKey = "rate:limit:" + key;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);
        log.debug("RateLimit key: {}, current count: {}", redisKey, currentCount);
        if (currentCount != null && currentCount == 1) {
            // set timeout
            redisTemplate.expire(redisKey, Duration.ofSeconds(windowSeconds));
        }
        return currentCount != null && currentCount <= maxAttempts;
    }
}
