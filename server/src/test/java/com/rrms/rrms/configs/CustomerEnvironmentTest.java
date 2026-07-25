package com.rrms.rrms.configs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Properties;

import org.junit.jupiter.api.Test;

public class CustomerEnvironmentTest {

    @Test
    void testSelectEnvDev() {
        assertThrows(IllegalStateException.class, () -> {
            CustomerEnvironment.selectEnv(CustomerEnvironment.EnvTarget.DEV);
        });
    }

    @Test
    void testSelectEnvStringDev() {
        assertThrows(IllegalStateException.class, () -> {
            CustomerEnvironment.selectEnv("dev");
        });
    }

    @Test
    void testSelectEnvInvalid() {
        assertThrows(IllegalArgumentException.class, () -> {
            CustomerEnvironment.selectEnv(CustomerEnvironment.EnvTarget.PROD);
        });
    }

    @Test
    void testEnvTargetString() {
        assertEquals("development", CustomerEnvironment.EnvTarget.DEV.string());
        assertEquals("production", CustomerEnvironment.EnvTarget.PROD.string());
    }

    @Test
    void testConstructorWithEnvTarget() {
        MoMoEndpoint endpoint = new MoMoEndpoint("endpoint", "uri");
        PartnerInfo info = new PartnerInfo("partnerCode", "accessKey", "secretKey");
        CustomerEnvironment env = new CustomerEnvironment(endpoint, info, CustomerEnvironment.EnvTarget.DEV);

        assertEquals("partnerCode", env.getPartnerInfo().getPartnerCode());
        assertEquals("accessKey", env.getPartnerInfo().getAccessKey());
        assertEquals("secretKey", env.getPartnerInfo().getSecretKey());
        assertEquals("development", env.getTarget());
    }

    @Test
    void testConstructorWithStringTarget() {
        MoMoEndpoint endpoint = new MoMoEndpoint("endpoint", "uri");
        PartnerInfo info = new PartnerInfo("partnerCode", "accessKey", "secretKey");
        CustomerEnvironment env = new CustomerEnvironment(endpoint, info, "test");

        assertEquals("partnerCode", env.getPartnerInfo().getPartnerCode());
        assertEquals("accessKey", env.getPartnerInfo().getAccessKey());
        assertEquals("secretKey", env.getPartnerInfo().getSecretKey());
        assertEquals("test", env.getTarget());
    }

    private Properties createMockProperties() {
        Properties properties = new Properties();
        properties.setProperty(CustomerEnvironment.ProcessType.PAY_GATE.toString(), "pay_gate_value");
        properties.setProperty(CustomerEnvironment.ProcessType.APP_IN_APP.toString(), "app_in_app_value");
        return properties;
    }

    @Test
    void testProcessTypeGetSubDir() {
        Properties mockProperties = createMockProperties();
        assertEquals("pay_gate_value", CustomerEnvironment.ProcessType.PAY_GATE.getSubDir(mockProperties));
        assertEquals("app_in_app_value", CustomerEnvironment.ProcessType.APP_IN_APP.getSubDir(mockProperties));
    }
}
