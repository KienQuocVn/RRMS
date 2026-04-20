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
import com.rrms.rrms.dto.response.MotelResponse;
import com.rrms.rrms.dto.response.MotelRoomCountResponse;
import com.rrms.rrms.enums.ContractStatus;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.mapper.MotelMapper;
import com.rrms.rrms.models.*;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.IMotelService;

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

    private final ReserveAPlaceRepository reserveAPlaceRepository;

    @Override
    public Optional<Integer> getTotalRooms(UUID motelId, String username) {
        Optional<Motel> motel = motelRepository.findByMotelNameAndUsername(motelId, username);
        return motel.map(m -> m.getRooms().size()); // Tráº£ vá» sá»‘ lÆ°á»£ng phÃ²ng
    }

    @Override
    public MotelResponse insert(MotelRequest motel) {
        // LÆ°u motel vÃ  láº¥y entity Ä‘Ã£ lÆ°u cÃ¹ng vá»›i ID Ä‘Æ°á»£c táº¡o
        Motel savedMotel = motelRepository.save(motelMapper.motelRequestToMotel(motel));

        // Táº¡o ContractTemplateRequest vá»›i ID cá»§a Motel vá»«a lÆ°u
        ContractTemplate contractTemplate = new ContractTemplate();
        contractTemplate.setMotel(savedMotel); // Sá»­ dá»¥ng ID tá»« entity Ä‘Ã£ lÆ°u
        contractTemplate.setTemplatename("Máº«u máº·c Ä‘á»‹nh");
        contractTemplate.setNamecontract("Máº«u máº·c Ä‘á»‹nh");
        contractTemplate.setSortorder(1);
        contractTemplate.setContent("Máº«u máº·c Ä‘á»‹nh");

        // LÆ°u contract template
        contractTemplateRepository.save(contractTemplate);

        // Tráº£ vá» response
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
                .orElseThrow(() -> new IllegalArgumentException("Motel not found"));
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
        Optional<Motel> motelfind = motelRepository.findById(id);
        if (motelfind.isPresent()) {
            motelfind.get().setMotelName(motel.getMotelName());
            motelfind.get().setArea(motel.getArea());
            motelfind.get().setAveragePrice(motel.getAveragePrice());
            motelfind.get().setAddress(motel.getAddress());
            motelfind.get().setMethodofcreation(motel.getMethodofcreation());
            motelfind.get().setMaxperson(motel.getMaxperson());
            motelfind.get().setInvoicedate(motel.getInvoicedate());
            motelfind.get().setPaymentdeadline(motel.getPaymentdeadline());
            motelfind.get().setAccount(accountMapper.toAccount(motel.getAccount()));
            motelfind.get().setTypeRoom(motel.getTypeRoom());
            return motelMapper.motelToMotelResponse(motelRepository.save(motelfind.get()));
        }
        return null;
    }

    @Override
    public void delete(UUID id) {
        Optional<Motel> motelfind = motelRepository.findById(id);
        if (motelfind.isPresent()) {
            motelRepository.deleteById(id);
        }
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
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.IATExpire)
                    .size();
            int stakeCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.Stake)
                    .size();
            int reportEndCount = contractRepository
                    .findContractsByMotelIdAndStatus(motel.getMotelId(), ContractStatus.ReportEnd)
                    .size();

            // Äáº¿m sá»‘ phÃ²ng khÃ´ng cÃ³ há»£p Ä‘á»“ng vÃ  sá»‘ phÃ²ng Ä‘Ã£ Ä‘áº·t cá»c
            List<Room> rooms = roomRepository.findByMotelMotelId(motel.getMotelId());
            int noContractCount = 0;
            int reservedCount = 0; // Biáº¿n Ä‘á»ƒ Ä‘áº¿m sá»‘ phÃ²ng Ä‘Ã£ Ä‘áº·t cá»c

            for (Room room : rooms) {
                boolean hasContract = contractRepository
                                .findContractsByRoomId(room.getRoomId())
                                .size()
                        > 0;
                if (!hasContract) {
                    noContractCount++;
                }
                // Kiá»ƒm tra phÃ²ng cÃ³ Ä‘áº·t cá»c
                List<Reserve_a_place> reserves = reserveAPlaceRepository.findByRoom_RoomId(room.getRoomId());
                reservedCount += reserves.size(); // Tá»•ng sá»‘ phÃ²ng Ä‘Ã£ Ä‘áº·t cá»c
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
                    reservedCount // ThÃªm sá»‘ phÃ²ng Ä‘Ã£ Ä‘áº·t cá»c
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
        return reserveAPlaceRepository.findTotalReserveDepositByMotelId(motelId);
    }

    @Override
    public BigDecimal getTotalPaidInvoices(UUID motelId) {
        List<Object[]> results = motelRepository.getTotalPaidInvoicesByMotelId(motelId);

        if (!results.isEmpty() && results.get(0)[2] != null) {
            Object value = results.get(0)[2]; // Cá»™t "Total_Paid_Amount" trong stored procedure

            // Kiá»ƒm tra kiá»ƒu dá»¯ liá»‡u tráº£ vá»
            if (value instanceof BigDecimal) {
                return (BigDecimal) value; // Náº¿u lÃ  BigDecimal, tráº£ vá» trá»±c tiáº¿p
            }
            if (value instanceof String) {
                try {
                    return new BigDecimal((String) value); // Chuyá»ƒn Ä‘á»•i tá»« String
                } catch (NumberFormatException e) {
                    throw new IllegalStateException("GiÃ¡ trá»‹ tráº£ vá» khÃ´ng há»£p lá»‡: " + value, e);
                }
            }
            if (value instanceof Number) {
                return BigDecimal.valueOf(
                        ((Number) value).doubleValue()); // Chuyá»ƒn Ä‘á»•i tá»« cÃ¡c kiá»ƒu sá»‘ khÃ¡c
            }
        }
        return BigDecimal.ZERO; // Tráº£ vá» 0 náº¿u khÃ´ng cÃ³ káº¿t quáº£
    }

    @Override
    public BigDecimal getTotalPaidRoomPrice(UUID motelId) {
        List<Object[]> results = motelRepository.getTotalPaidRoomPriceByMotelId(motelId);
        if (!results.isEmpty() && results.get(0)[1] != null) {
            Object value = results.get(0)[1];

            // Xá»­ lÃ½ káº¿t quáº£ tráº£ vá»
            if (value instanceof String) {
                try {
                    return new BigDecimal((String) value); // Chuyá»ƒn tá»« String sang BigDecimal
                } catch (NumberFormatException e) {
                    return BigDecimal.ZERO; // Tráº£ vá» 0 náº¿u khÃ´ng chuyá»ƒn Ä‘Æ°á»£c
                }
            }
            if (value instanceof BigDecimal) {
                return (BigDecimal) value; // Náº¿u lÃ  BigDecimal, tráº£ vá» trá»±c tiáº¿p
            }
        }
        return BigDecimal.ZERO; // Tráº£ vá» 0 náº¿u khÃ´ng cÃ³ káº¿t quáº£
    }
}
