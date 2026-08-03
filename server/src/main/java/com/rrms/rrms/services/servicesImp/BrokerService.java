package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.BrokerCreateRequest;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.BrokerMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Auth;
import com.rrms.rrms.models.Broker;
import com.rrms.rrms.models.Role;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.BrokerRepository;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.repositories.RoleRepository;
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

    AccountRepository accountRepository;

    AuthRepository authRepository;

    RoleRepository roleRepository;

    PasswordEncoder passwordEncoder;

    @Override
    public BrokerResponse createBroker(BrokerCreateRequest brokerRequest) {
        Broker broker = brokerRepository.save(brokerMapper.toBroker(brokerRequest));
        if (brokerRequest.isCreateAccount()) {
            createBrokerAccountIfNeeded(brokerRequest);
        }
        return brokerMapper.toBrokerResponse(broker);
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

    private void createBrokerAccountIfNeeded(BrokerCreateRequest brokerRequest) {
        String phone =
                brokerRequest.getPhone() == null ? "" : brokerRequest.getPhone().trim();
        if (phone.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Số điện thoại là bắt buộc khi tạo tài khoản môi giới");
        }

        if (accountRepository.existsByUsername(phone) || accountRepository.existsByPhone(phone)) {
            throw new AppException(
                    ErrorCode.ACCOUNT_ALREADY_EXISTS, "Tài khoản môi giới với số điện thoại này đã tồn tại");
        }

        Account account = Account.builder()
                .username(phone)
                .password(passwordEncoder.encode(phone))
                .fullName(brokerRequest.getName())
                .phone(phone)
                .commissionRate(brokerRequest.getCommissionRate())
                .build();
        Account savedAccount = accountRepository.save(account);

        Role brokerRole = roleRepository
                .findByRoleName(Roles.BROKER)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND, "Không tìm thấy vai trò môi giới"));
        authRepository.save(
                Auth.builder().account(savedAccount).role(brokerRole).build());
    }
}
