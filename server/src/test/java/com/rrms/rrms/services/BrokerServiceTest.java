package com.rrms.rrms.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.BrokerMapper;
import com.rrms.rrms.models.Broker;
import com.rrms.rrms.repositories.BrokerRepository;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.services.servicesImp.BrokerService;

@ExtendWith(MockitoExtension.class)
public class BrokerServiceTest {

    @Mock
    private BrokerMapper brokerMapper;

    @Mock
    private BrokerRepository brokerRepository;

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private BrokerService brokerService;

    @Test
    void testCreateBroker() {
        BrokerCreateRequest brokerRequest = new BrokerCreateRequest();
        Broker broker = new Broker();
        BrokerResponse brokerResponse = new BrokerResponse();

        when(brokerMapper.toBroker(brokerRequest)).thenReturn(broker);
        when(brokerRepository.save(broker)).thenReturn(broker);
        when(brokerMapper.toBrokerResponse(broker)).thenReturn(brokerResponse);

        BrokerResponse result = brokerService.createBroker(brokerRequest);

        assertNotNull(result);
        verify(brokerRepository, times(1)).save(broker);
        verify(brokerMapper, times(1)).toBrokerResponse(broker);
    }

    @Test
    void testGetAllBroker() {
        UUID motelId = UUID.randomUUID();
        Broker broker1 = new Broker();
        Broker broker2 = new Broker();
        List<Broker> brokers = Arrays.asList(broker1, broker2);
        BrokerResponse brokerResponse1 = new BrokerResponse();
        BrokerResponse brokerResponse2 = new BrokerResponse();

        when(brokerRepository.findByMotelId(motelId)).thenReturn(brokers);
        when(brokerMapper.toBrokerResponse(broker1)).thenReturn(brokerResponse1);
        when(brokerMapper.toBrokerResponse(broker2)).thenReturn(brokerResponse2);

        List<BrokerResponse> result = brokerService.getAllBroker(motelId);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(brokerRepository, times(1)).findByMotelId(motelId);
        verify(brokerMapper, times(2)).toBrokerResponse(any(Broker.class));
    }

    @Test
    void testGetAllBrokerEmptyList() {
        UUID motelId = UUID.randomUUID();

        when(brokerRepository.findByMotelId(motelId)).thenReturn(Collections.emptyList());

        List<BrokerResponse> result = brokerService.getAllBroker(motelId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(brokerRepository, times(1)).findByMotelId(motelId);
    }

    @Test
    void testCreateBrokerThrowsException() {
        BrokerCreateRequest brokerRequest = new BrokerCreateRequest();

        when(brokerMapper.toBroker(brokerRequest)).thenReturn(new Broker());
        when(brokerRepository.save(any(Broker.class))).thenThrow(new RuntimeException("Database Error"));

        assertThrows(RuntimeException.class, () -> brokerService.createBroker(brokerRequest));
    }

    @Test
    void testUpdateBroker() {
        UUID brokerId = UUID.randomUUID();
        UUID motelId = UUID.randomUUID();
        BrokerCreateRequest brokerRequest = BrokerCreateRequest.builder()
                .motelId(motelId)
                .name("Broker updated")
                .phone("0909000001")
                .source("Website")
                .commissionRate(15)
                .build();
        Broker broker = new Broker();
        BrokerResponse brokerResponse = new BrokerResponse();

        when(brokerRepository.findById(brokerId)).thenReturn(Optional.of(broker));
        when(brokerRepository.save(broker)).thenReturn(broker);
        when(brokerMapper.toBrokerResponse(broker)).thenReturn(brokerResponse);

        BrokerResponse result = brokerService.updateBroker(brokerId, brokerRequest);

        assertNotNull(result);
        assertEquals("Broker updated", broker.getName());
        assertEquals("0909000001", broker.getPhone());
        assertEquals("Website", broker.getSource());
        assertEquals(15, broker.getCommissionRate());
        assertEquals(motelId, broker.getMotelId());
        verify(brokerRepository, times(1)).save(broker);
    }

    @Test
    void testDeleteBroker() {
        UUID brokerId = UUID.randomUUID();

        when(brokerRepository.existsById(brokerId)).thenReturn(true);
        when(contractRepository.existsByBroker_BrokerId(brokerId)).thenReturn(false);

        brokerService.deleteBroker(brokerId);

        verify(brokerRepository, times(1)).deleteById(brokerId);
    }

    @Test
    void testDeleteBrokerUsedInContractThrowsException() {
        UUID brokerId = UUID.randomUUID();

        when(brokerRepository.existsById(brokerId)).thenReturn(true);
        when(contractRepository.existsByBroker_BrokerId(brokerId)).thenReturn(true);

        assertThrows(AppException.class, () -> brokerService.deleteBroker(brokerId));
        verify(brokerRepository, never()).deleteById(brokerId);
    }
}
