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

        return BrokerResponse.builder()
                .brokerId(broker.getBrokerId())
                .motelId(broker.getMotelId())
                .name(broker.getName())
                .phone(broker.getPhone())
                .source(broker.getSource())
                .commissionRate(broker.getCommissionRate())
                .build();
    }

    @Override
    public Broker toBroker(BrokerCreateRequest brokerCreateRequest) {
        if (brokerCreateRequest == null) {
            return null;
        }

        return Broker.builder()
                .name(brokerCreateRequest.getName())
                .phone(brokerCreateRequest.getPhone())
                .source(brokerCreateRequest.getSource())
                .motelId(brokerCreateRequest.getMotelId())
                .commissionRate(brokerCreateRequest.getCommissionRate())
                .build();
    }
}
