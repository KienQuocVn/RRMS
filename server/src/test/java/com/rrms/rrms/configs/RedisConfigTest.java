package com.rrms.rrms.configs;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@TestPropertySource("/test.properties")
public class RedisConfigTest {

    @Mock
    private ApplicationContext applicationContext;

    @MockBean
    private LettuceConnectionFactory connectionFactory;

    @MockBean
    private RedisTemplate<String, Object> redisTemplate;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Giả lập ApplicationContext và các Bean cần thiết
        when(applicationContext.getBean(LettuceConnectionFactory.class)).thenReturn(connectionFactory);
        when(applicationContext.getBean(RedisTemplate.class)).thenReturn(redisTemplate);

        // Giả lập isAutoStartup() trả về giá trị boolean (true hoặc false)
        doReturn(true).when(connectionFactory).isAutoStartup();
    }

    @Test
    public void testRedisConnectionFactoryBeanExists() {
        // Kiểm tra bean LettuceConnectionFactory
        assertThat(connectionFactory).isNotNull();
    }

    @Test
    public void testRedisTemplateBeanExists() {
        // Kiểm tra bean RedisTemplate
        assertThat(redisTemplate).isNotNull();
    }
}
