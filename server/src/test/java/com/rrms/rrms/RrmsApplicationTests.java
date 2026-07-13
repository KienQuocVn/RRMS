package com.rrms.rrms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

import com.rrms.rrms.repositories.BulletinBoardElasticsearchRepository;

@TestPropertySource(locations = "classpath:test.properties")
@SpringBootTest
class RrmsApplicationTests {

    @MockBean
    BulletinBoardElasticsearchRepository bulletinBoardElasticsearchRepository;

    @Test
    void contextLoads() {}
}
