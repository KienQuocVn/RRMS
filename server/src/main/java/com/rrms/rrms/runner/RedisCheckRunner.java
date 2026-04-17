package com.rrms.rrms.runner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisCheckRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RedisCheckRunner.class);

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    public void run(String... args) {
        try {
            String ping = redisTemplate.getConnectionFactory().getConnection().ping();
            log.info("Redis ping response: {}", ping);
        } catch (Exception ex) {
            log.warn("Redis is not available on startup: {}", ex.getMessage());
        }
    }
}
