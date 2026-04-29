package com.rrms.rrms.configs;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.servers.Server;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = OpenAPIConfig.class)
class OpenAPIConfigTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void testPublicApiBeanExists() {
        GroupedOpenApi publicApi = applicationContext.getBean(GroupedOpenApi.class);
        assertThat(publicApi).isNotNull();
        assertThat(publicApi.getGroup()).isEqualTo("rrms");
    }

    @Test
    void testOpenAPIBeanExists() {
        OpenAPI openAPI = applicationContext.getBean(OpenAPI.class);
        assertThat(openAPI).isNotNull();

        Info info = openAPI.getInfo();
        assertThat(info).isNotNull();
        assertThat(info.getTitle()).isEqualTo("RRMS API");
        assertThat(info.getVersion()).isEqualTo("1.3");
        assertThat(info.getLicense().getName()).isEqualTo("Room Rental Management System - RRMS");
        assertThat(info.getLicense().getUrl()).isEqualTo("https://github.com/chauminhtrung/RRMS");

        List<Server> servers = openAPI.getServers();
        assertThat(servers.get(0).getUrl()).isEqualTo("http://localhost:7000");
    }

    @Test
    void testOperationCustomizerBeanExists() {
        OperationCustomizer customizer = applicationContext.getBean(OperationCustomizer.class);
        assertThat(customizer).isNotNull();

        Operation operation = new Operation();
        customizer.customize(operation, null);

        List<Parameter> parameters = operation.getParameters();
        assertThat(parameters.get(0).getName()).isEqualTo("Cache-Control");
        assertThat(parameters.get(0).getExample()).isEqualTo("no-cache, no-store, max-age=0, must-revalidate");
        assertThat(parameters.get(1).getName()).isEqualTo("Pragma");
        assertThat(parameters.get(1).getExample()).isEqualTo("no-cache");
        assertThat(parameters.get(2).getName()).isEqualTo("Expires");
        assertThat(parameters.get(2).getExample()).isEqualTo("0");
    }
}
