package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.models.Broker;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BrokerMapper {

    BrokerResponse toBrokerResponse(Broker broker);

    Broker toBroker(BrokerCreateRequest brokerCreateRequest);
}
