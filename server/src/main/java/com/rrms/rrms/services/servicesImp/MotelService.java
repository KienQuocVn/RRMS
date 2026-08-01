package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.MotelRequest;
import com.rrms.rrms.dto.response.MotelAreaSummaryResponse;
import com.rrms.rrms.dto.response.MotelResponse;
import com.rrms.rrms.dto.response.MotelRoomCountResponse;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.mapper.MotelMapper;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.IMotelService;
import com.rrms.rrms.services.support.MotelAreaValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MotelService implements IMotelService {
    private final MotelRepository motelRepository;

    private final MotelMapper motelMapper;

    private final AccountMapper accountMapper;

    private final ContractTemplateRepository contractTemplateRepository;

    private final ContractRepository contractRepository;

    private final RoomRepository roomRepository;

    private final MotelAreaValidator motelAreaValidator;

    private final RoomReservationRepository roomReservationRepository;

    private final ResidenceTemplateRepository residenceTemplateRepository;

    @Override
    public Optional<Integer> getTotalRooms(UUID motelId, String username) {
        Optional<Motel> motel = motelRepository.findByMotelNameAndUsername(motelId, username);
        return motel.map(m -> m.getRooms().size()); // Trả về số lượng phòng
    }

    @Override
    public MotelResponse insert(MotelRequest motel) {
        motelAreaValidator.validateMotelTotalArea(motel.getArea());
        // Lưu motel và lấy entity đã lưu cùng với ID được tạo
        Motel savedMotel = motelRepository.save(motelMapper.motelRequestToMotel(motel));

        // Tạo ContractTemplate mặc định với ID của Motel vừa lưu
        ContractTemplate contractTemplate = new ContractTemplate();
        contractTemplate.setMotel(savedMotel); // Sử dụng ID từ entity đã lưu
        contractTemplate.setTemplatename("Mẫu hợp đồng " + savedMotel.getMotelName());
        contractTemplate.setNamecontract("HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ");
        contractTemplate.setSortorder(1);
        contractTemplate.setContent(com.rrms.rrms.constants.TemplateConstants.DEFAULT_CONTRACT_CONTENT);

        // Lưu contract template
        contractTemplateRepository.save(contractTemplate);

        // Tạo ResidenceTemplate mặc định cho tờ khai tạm trú
        ResidenceTemplate residenceTemplate = new ResidenceTemplate();
        residenceTemplate.setMotel(savedMotel);
        residenceTemplate.setTemplatename("Mẫu CT01 – Tờ khai thay đổi thông tin cư trú");
        residenceTemplate.setSortorder(1);
        residenceTemplate.setContent(com.rrms.rrms.constants.TemplateConstants.DEFAULT_RESIDENCE_CONTENT);

        // Lưu residence template
        residenceTemplateRepository.save(residenceTemplate);

        // Trả về response
        return motelMapper.motelToMotelResponse(savedMotel);
    }

    @Transactional
    @Override
    public MotelResponse findById(UUID id) {
        return motelRepository
                .findById(id)
                .map(motel -> {
                    MotelResponse response = motelMapper.motelToMotelResponse(motel);
                    return response;
                })
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
    }

    @Override
    public List<MotelResponse> findAllByMotelName(String motelName) {
        return motelRepository.findAllByMotelName(motelName).stream()
                .map(motelMapper::motelToMotelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MotelResponse> findMotelByAccount_Username(String username) {
        return motelRepository.findMotelByAccount_Username(username).stream()
                .map(motelMapper::motelToMotelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MotelResponse> findAll() {
        return motelRepository.findAll().stream()
                .map(motelMapper::motelToMotelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MotelResponse update(UUID id, MotelRequest motel) {
        Motel existingMotel =
                motelRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        motelAreaValidator.validateMotelUpdateArea(id, motel.getArea());
        existingMotel.setMotelName(motel.getMotelName());
        existingMotel.setArea(motel.getArea());
        existingMotel.setAveragePrice(motel.getAveragePrice());
        existingMotel.setAddress(motel.getAddress());
        existingMotel.setLatitude(motel.getLatitude());
        existingMotel.setLongitude(motel.getLongitude());
        existingMotel.setMethodofcreation(motel.getMethodofcreation());
        existingMotel.setMaxperson(motel.getMaxperson());
        existingMotel.setInvoicedate(motel.getInvoicedate());
        existingMotel.setPaymentdeadline(motel.getPaymentdeadline());
        existingMotel.setAccount(accountMapper.toAccount(motel.getAccount()));
        existingMotel.setTypeRoom(motel.getTypeRoom());
        return motelMapper.motelToMotelResponse(motelRepository.save(existingMotel));
    }

    @Override
    public void delete(UUID id) {
        motelRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        motelRepository.deleteById(id);
    }

    @Override
    public List<MotelRoomCountResponse> getRoomCountsByContractStatus() {
        List<Motel> motels = motelRepository.findAll();
        List<MotelRoomCountResponse> responseList = new ArrayList<>();

        for (Motel motel : motels) {
            int activeCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.ACTIVE)
                    .size();
            int endedCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.ENDED)
                    .size();
            int iatExpireCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.EXPIRING)
                    .size();
            int stakeCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.DEPOSITED)
                    .size();
            int reportEndCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.TERMINATED)
                    .size();

            // Đếm số phòng không có hợp đồng và số phòng đã đặt cọc
            List<Room> rooms = roomRepository.findByMotelMotelId(motel.getMotelId());
            int noContractCount = 0;
            int reservedCount = 0; // Biến để đếm số phòng đã đặt cọc

            for (Room room : rooms) {
                boolean hasContract = contractRepository
                                .findContractsByRoomId(room.getRoomId())
                                .size()
                        > 0;
                if (!hasContract) {
                    noContractCount++;
                }
                // Kiểm tra phòng có đặt cọc
                List<Reserve_a_place> reserves = roomReservationRepository.findByRoom_RoomId(room.getRoomId());
                reservedCount += reserves.size(); // Tổng số phòng đã đặt cọc
            }

            MotelRoomCountResponse response = new MotelRoomCountResponse(
                    motel.getMotelId(),
                    motel.getMotelName(),
                    activeCount,
                    endedCount,
                    iatExpireCount,
                    stakeCount,
                    reportEndCount,
                    noContractCount,
                    reservedCount // Thêm số phòng đã đặt cọc
                    );

            responseList.add(response);
        }

        return responseList;
    }

    @Override
    public Double calculateTotalDeposit(UUID motelId) {
        return contractRepository.findTotalDepositByMotelId(motelId);
    }

    @Override
    public Double calculateTotalReserveDeposit(UUID motelId) {
        return roomReservationRepository.findTotalReserveDepositByMotelId(motelId);
    }

    @Override
    public BigDecimal getTotalPaidInvoices(UUID motelId) {
        List<Object[]> results = motelRepository.getTotalPaidInvoicesByMotelId(motelId);

        if (!results.isEmpty() && results.get(0)[2] != null) {
            Object value = results.get(0)[2]; // Cột "Total_Paid_Amount" trong stored procedure

            // Kiểm tra kiểu dữ liệu trả về
            if (value instanceof BigDecimal) {
                return (BigDecimal) value; // Nếu là BigDecimal, trả về trực tiếp
            }
            if (value instanceof String) {
                try {
                    return new BigDecimal((String) value); // Chuyển đổi từ String
                } catch (NumberFormatException e) {
                    throw new IllegalStateException("Giá trị trả về không hợp lệ: " + value, e);
                }
            }
            if (value instanceof Number) {
                return BigDecimal.valueOf(((Number) value).doubleValue()); // Chuyển đổi từ các kiểu số khác
            }
        }
        return BigDecimal.ZERO; // Trả về 0 nếu không có kết quả
    }

    @Override
    public BigDecimal getTotalPaidRoomPrice(UUID motelId) {
        List<Object[]> results = motelRepository.getTotalPaidRoomPriceByMotelId(motelId);
        if (!results.isEmpty() && results.get(0)[1] != null) {
            Object value = results.get(0)[1];

            // Xử lý kết quả trả về
            if (value instanceof String) {
                try {
                    return new BigDecimal((String) value); // Chuyển từ String sang BigDecimal
                } catch (NumberFormatException e) {
                    return BigDecimal.ZERO; // Trả về 0 nếu không chuyển được
                }
            }
            if (value instanceof BigDecimal) {
                return (BigDecimal) value; // Nếu là BigDecimal, trả về trực tiếp
            }
        }
        return BigDecimal.ZERO; // Trả về 0 nếu không có kết quả
    }

    @Override
    public MotelAreaSummaryResponse getAreaSummary(UUID motelId) {
        Motel motel = motelRepository.findById(motelId).orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        return motelAreaValidator.buildSummary(motel);
    }
}
