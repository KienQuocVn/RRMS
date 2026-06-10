package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.BrokerMapper;
import com.rrms.rrms.models.Broker;
import com.rrms.rrms.repositories.BrokerRepository;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.services.IBroker;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BrokerService implements IBroker {

    BrokerMapper brokerMapper;

    BrokerRepository brokerRepository;

    ContractRepository contractRepository;

    @Override
    public BrokerResponse createBroker(BrokerCreateRequest brokerRequest) {
        return brokerMapper.toBrokerResponse(brokerRepository.save(brokerMapper.toBroker(brokerRequest)));
    }

    @Override
    public List<BrokerResponse> getAllBroker(UUID motelId) {
        return brokerRepository.findByMotelId(motelId).stream()
                .map(brokerMapper::toBrokerResponse)
                .toList();
    }

    @Override
    public BrokerResponse updateBroker(UUID brokerId, BrokerCreateRequest brokerRequest) {
        Broker broker =
                brokerRepository.findById(brokerId).orElseThrow(() -> new EntityNotFoundException("Broker not found"));

        broker.setName(brokerRequest.getName());
        broker.setPhone(brokerRequest.getPhone());
        broker.setSource(brokerRequest.getSource());
        broker.setCommissionRate(brokerRequest.getCommissionRate());
        if (brokerRequest.getMotelId() != null) {
            broker.setMotelId(brokerRequest.getMotelId());
        }

        return brokerMapper.toBrokerResponse(brokerRepository.save(broker));
    }

    @Override
    public void deleteBroker(UUID brokerId) {
        if (!brokerRepository.existsById(brokerId)) {
            throw new EntityNotFoundException("Broker not found");
        }

        if (contractRepository.existsByBroker_BrokerId(brokerId)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Không thể xóa môi giới đã được dùng trong hợp đồng");
        }

        brokerRepository.deleteById(brokerId);
    }
}
