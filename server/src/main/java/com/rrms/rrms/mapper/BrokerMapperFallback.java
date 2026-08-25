package com.rrms.rrms.mapper;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.models.Broker;

/**
 * Fallback implementation for BrokerMapper.
 * Được dùng khi MapStruct không thể tạo implementation tự động.
 */
@Component
@ConditionalOnMissingBean(name = "brokerMapperImpl")
public class BrokerMapperFallback implements BrokerMapper {

    @Override
    public BrokerResponse toBrokerResponse(Broker broker) {
        if (broker == null) {
            return null;
        }

        BrokerResponse response = new BrokerResponse();
        response.setBrokerId(broker.getBrokerId());
        response.setName(broker.getName());
        response.setPhone(broker.getPhone());
        response.setSource(broker.getSource());
        response.setCommissionRate(broker.getCommissionRate());
        response.setMotelId(broker.getMotelId());
        return response;
    }

    @Override
    public Broker toBroker(BrokerCreateRequest brokerCreateRequest) {
        if (brokerCreateRequest == null) {
            return null;
        }

        Broker broker = new Broker();
        broker.setName(brokerCreateRequest.getName());
        broker.setPhone(brokerCreateRequest.getPhone());
        broker.setSource(brokerCreateRequest.getSource());
        broker.setCommissionRate(brokerCreateRequest.getCommissionRate());
        broker.setMotelId(brokerCreateRequest.getMotelId());
        return broker;
    }
}
