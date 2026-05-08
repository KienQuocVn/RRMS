package com.rrms.rrms.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;

@WebMvcTest(CaptchaController.class)
@TestPropertySource("/test.properties")
public class CaptchaControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private CaptchaController captchaController;

    @Value("${cloud-flare.captcha.secret}")
    private String secretKey;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(captchaController).build();
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testVerifyCaptcha_Success() throws Exception {
        // Mock the response from RestTemplate
        Map<String, Object> mockResponse = Collections.singletonMap("success", true);
        when(restTemplate.exchange(
                        any(String.class),
                        eq(HttpMethod.POST),
                        any(HttpEntity.class),
                        any(ParameterizedTypeReference.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        // Mock the request body
        String requestBody = "{\"token\": \"dummy-token\"}";

        // Perform the POST request
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/verify-captcha")
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        // You can also assert specific details about the response
        String content = result.getResponse().getContentAsString();
        System.out.println("Response: " + content);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testVerifyCaptcha_SuccessOnVersionedRoute() throws Exception {
        Map<String, Object> mockResponse = Collections.singletonMap("success", true);
        when(restTemplate.exchange(
                        any(String.class),
                        eq(HttpMethod.POST),
                        any(HttpEntity.class),
                        any(ParameterizedTypeReference.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/verify-captcha")
                        .contentType("application/json")
                        .content("{\"token\": \"dummy-token\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testVerifyCaptcha_Failure() throws Exception {
        // Mock the response from RestTemplate for failure case
        Map<String, Object> mockResponse = Collections.singletonMap("success", false);
        when(restTemplate.exchange(
                        any(String.class),
                        eq(HttpMethod.POST),
                        any(HttpEntity.class),
                        any(ParameterizedTypeReference.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        // Mock the request body
        String requestBody = "{\"token\": \"dummy-token\"}";

        // Perform the POST request
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/verify-captcha")
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andReturn();

        // You can also assert specific details about the response
        String content = result.getResponse().getContentAsString();
        System.out.println("Response: " + content);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testVerifyCaptcha_InternalServerError() throws Exception {
        // Mock the RestTemplate to throw an exception (simulating an internal server
        // error)
        when(restTemplate.exchange(
                        any(String.class),
                        eq(HttpMethod.POST),
                        any(HttpEntity.class),
                        any(ParameterizedTypeReference.class)))
                .thenThrow(new RuntimeException("Internal Server Error"));

        // Mock the request body
        String requestBody = "{\"token\": \"dummy-token\"}";

        // Perform the POST request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/verify-captcha")
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Captcha verification failed"));
    }

    @Test
    public void testVerifyCaptcha_MissingToken() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/verify-captcha")
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Captcha token is required"));
    }
}
