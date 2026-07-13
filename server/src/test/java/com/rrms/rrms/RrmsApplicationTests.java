package com.rrms.rrms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchClientAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(locations = "classpath:test.properties")
@SpringBootTest(
        exclude = {
            ElasticsearchClientAutoConfiguration.class,
            ElasticsearchRepositoriesAutoConfiguration.class,
            ElasticsearchDataAutoConfiguration.class
        })
class RrmsApplicationTests {
    @Test
    void contextLoads() {}
}
