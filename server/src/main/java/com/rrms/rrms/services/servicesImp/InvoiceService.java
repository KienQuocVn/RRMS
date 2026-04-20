package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.*;
import com.rrms.rrms.dto.response.*;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.PaymentStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.*;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.RoomService;
import com.rrms.rrms.repositories.*;
import com.rrms.rrms.services.IInvoices;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService implements IInvoices {

    private final InvoiceRepository invoiceRepository;

    private final ContractRepository contractRepository;

    private final DetailInvoiceRepository detailInvoiceRepository;

    private final RoomDeviceRepository roomDeviceRepository;

    private final RoomServiceRepository roomServiceRepository;

    private final RoomRepository roomRepository;

    private final TransactionRepository transactionRepository;

    private final InvoiceAdditionItemRepository additionItemRepository;

    @Override
    public List<InvoiceResponse> getInvoicesByMotelId(UUID motelId) {
        List<Room> rooms = roomRepository.findByMotelMotelId(motelId);

        List<Contract> contracts = rooms.stream()
                .flatMap(room -> contractRepository.findByRoomRoomId(room.getRoomId()).stream())
                .collect(Collectors.toList());

        List<Invoice> invoices = contracts.stream()
                .flatMap(contract -> invoiceRepository.findByContractContractId(contract.getContractId()).stream())
                .collect(Collectors.toList());

        return invoices.stream()
                .map(invoice -> {
                    List<InvoiceDetail> details =
                            detailInvoiceRepository.findByInvoiceInvoiceId(invoice.getInvoiceId());

                    LocalDate moveInDate = invoice.getContract()
                            .getMoveinDate()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    LocalDate dueDateOfMoveInDate = moveInDate.plusDays(30);

                    double totalServiceAmount = 0;
                    if (details != null) {
                        for (InvoiceDetail detail : details) {
                            if (detail.getRoomService() != null) {
                                MotelService service = detail.getRoomService().getService();
                                int quantity = detail.getRoomServiceQuantity();
                                totalServiceAmount += service.getPrice() * quantity;
                            }
                        }
                    }

                    return mapToResponse(invoice, details, moveInDate, dueDateOfMoveInDate, totalServiceAmount);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void cancelInvoice(UUID invoiceId) {
        // TÃ¬m hÃ³a Ä‘Æ¡n theo ID
        Invoice invoice =
                invoiceRepository.findById(invoiceId).orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        // Kiá»ƒm tra tráº¡ng thÃ¡i hÃ³a Ä‘Æ¡n
        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_CANCELED);
        }

        if (invoice.getPaymentStatus() == PaymentStatus.CANCELED) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_PAID);
        }

        // Cáº­p nháº­t tráº¡ng thÃ¡i hÃ³a Ä‘Æ¡n
        invoice.setPaymentStatus(PaymentStatus.CANCELED);

        // LÆ°u hÃ³a Ä‘Æ¡n vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u
        invoiceRepository.save(invoice);
    }

    @Override
    public InvoiceResponse createInvoice(InvoiceRequest request) {

        double totalServiceAmount = 0;
        Contract contract = contractRepository
                .findById(request.getContractId())
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        LocalDate moveInDate = contract.getMoveinDate()
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        LocalDate dueDateOfMoveInDate = moveInDate.plusDays(30);

        Invoice invoice = new Invoice();
        invoice.setInvoiceReason(request.getInvoiceReason());
        invoice.setInvoiceCreateMonth(
                request.getInvoiceCreateMonth() != null ? request.getInvoiceCreateMonth() : YearMonth.now());
        invoice.setInvoiceCreateDate(
                request.getInvoiceCreateDate() != null ? request.getInvoiceCreateDate() : LocalDate.now());
        invoice.setDueDate(invoice.getInvoiceCreateDate().plusDays(7));
        invoice.setDeposit(contract.getDeposit());
        invoice.setContract(contract);
        invoice.setPaymentStatus(PaymentStatus.UNPAID);

        List<InvoiceDetail> details = new ArrayList<>();

        if (request.getAdditionItems() != null) {
            List<InvoiceAdditionItem> additionalCharges = new ArrayList<>();
            for (InvoiceAdditionItemRequest addRequest : request.getAdditionItems()) {
                InvoiceAdditionItem charge = new InvoiceAdditionItem();
                charge.setInvoice(invoice); // GÃ¡n invoice
                charge.setReason(addRequest.getReason());
                charge.setAmount(addRequest.getAmount());
                charge.setIsAddition(addRequest.getIsAddition());
                additionalCharges.add(charge);
            }
            invoice.setAdditionItems(additionalCharges);
        }

        if (request.getServiceDetails() != null) {
            for (InvoiceDetailServiceRequest serviceDetailRequest : request.getServiceDetails()) {
                InvoiceDetail detail = new InvoiceDetail();
                RoomService roomService = roomServiceRepository
                        .findById(serviceDetailRequest.getRoomServiceId())
                        .orElseThrow(() -> new RuntimeException("RoomService khÃ´ng tá»“n táº¡i"));

                MotelService service = roomService.getService();
                if (service == null) {
                    throw new RuntimeException("MotelService khÃ´ng tá»“n táº¡i");
                }

                int quantity = serviceDetailRequest.getQuantity() != null ? serviceDetailRequest.getQuantity() : 1;
                double totalPrice = service.getPrice() * quantity;

                detail.setInvoice(invoice);
                detail.setRoomService(roomService);
                detail.setRoomServiceQuantity(quantity);
                details.add(detail);
                totalServiceAmount += totalPrice;
            }
        }

        if (request.getDeviceDetails() != null) {
            for (InvoiceDetailDeviceRequest deviceDetailRequest : request.getDeviceDetails()) {
                InvoiceDetail detail = new InvoiceDetail();
                RoomDevice roomDevice = roomDeviceRepository
                        .findById(deviceDetailRequest.getRoomDeviceId())
                        .orElseThrow(() -> new RuntimeException("RoomDevice khÃ´ng tá»“n táº¡i"));

                detail.setInvoice(invoice);
                detail.setRoomDevice(roomDevice);
                details.add(detail);
            }
        }

        invoice.setDetailInvoices(details);
        invoiceRepository.save(invoice);

        return mapToResponse(invoice, details, moveInDate, dueDateOfMoveInDate, totalServiceAmount);
    }

    public InvoiceResponse mapToResponse(
            Invoice invoice,
            List<InvoiceDetail> details,
            LocalDate moveInDate,
            LocalDate dueDateOfMoveInDate,
            double totalServiceAmount) {
        InvoiceResponse response = new InvoiceResponse();
        response.setInvoiceId(invoice.getInvoiceId());
        response.setInvoiceReason(invoice.getInvoiceReason());
        response.setInvoiceCreateMonth(invoice.getInvoiceCreateMonth());
        response.setInvoiceCreateDate(invoice.getInvoiceCreateDate());
        response.setDueDate(invoice.getDueDate());
        response.setDeposit(invoice.getDeposit());
        response.setMoveinDate(moveInDate);
        response.setDueDateofmoveinDate(dueDateOfMoveInDate);
        response.setPaymentStatus(invoice.getPaymentStatus());
        Room room = invoice.getContract().getRoom();
        if (room != null) {
            response.setRoomId(room.getRoomId());
            response.setRoomName(room.getName());
            response.setRoomPrice(
                    invoice.getContract().getActualPrice() != null
                            ? invoice.getContract().getActualPrice()
                            : room.getPrice());
        }

        double totalAddition = invoice.getAdditionItems() != null
                ? invoice.getAdditionItems().stream()
                        .mapToDouble(charge -> charge.getIsAddition() ? charge.getAmount() : -charge.getAmount())
                        .sum()
                : 0;

        double basePrice = invoice.getContract().getActualPrice() != null
                ? invoice.getContract().getActualPrice()
                : invoice.getContract().getPrice();
        double totalInvoice = basePrice + totalServiceAmount + totalAddition;

        response.setTotalAmount(totalInvoice);

        List<InvoiceServiceDetailResponse> serviceDetailResponses = details.stream()
                .filter(detail -> detail.getRoomService() != null)
                .map(detail -> {
                    InvoiceServiceDetailResponse serviceResponse = new InvoiceServiceDetailResponse();
                    RoomService roomService = detail.getRoomService();
                    MotelService service = roomService.getService();

                    serviceResponse.setRoomServiceId(roomService.getRoomServiceId());
                    serviceResponse.setServiceName(service.getNameService());
                    serviceResponse.setServicePrice(service.getPrice());
                    serviceResponse.setQuantity(detail.getRoomServiceQuantity());
                    serviceResponse.setChargetype(service.getChargetype());
                    serviceResponse.setTotalPrice(service.getPrice() * detail.getRoomServiceQuantity());

                    return serviceResponse;
                })
                .collect(Collectors.toList());
        response.setServiceDetails(serviceDetailResponses);

        List<InvoiceDeviceDetailResponse> deviceDetailResponses = details.stream()
                .filter(detail -> detail.getRoomDevice() != null)
                .map(detail -> {
                    InvoiceDeviceDetailResponse deviceResponse = new InvoiceDeviceDetailResponse();

                    deviceResponse.setRoomDeviceId(detail.getRoomDevice().getRoomDeviceId());
                    deviceResponse.setDeviceName(
                            detail.getRoomDevice().getMotelDevice().getDeviceName());
                    deviceResponse.setDevicePrice(
                            detail.getRoomDevice().getMotelDevice().getValue());
                    deviceResponse.setQuantity(
                            Double.valueOf(detail.getRoomDevice().getQuantity()));
                    deviceResponse.setTotalPrice(deviceResponse.getDevicePrice() * deviceResponse.getQuantity());
                    return deviceResponse;
                })
                .collect(Collectors.toList());
        response.setDeviceDetails(deviceDetailResponses);

        List<InvoiceAdditionItemResponse> additionItemResponses = invoice.getAdditionItems().stream()
                .map(charge -> {
                    InvoiceAdditionItemResponse additionResponse = new InvoiceAdditionItemResponse();
                    additionResponse.setAdditionalChargeId(charge.getAdditionalChargeId());
                    additionResponse.setReason(charge.getReason());
                    additionResponse.setAmount(charge.getAmount());
                    additionResponse.setAddition(charge.getIsAddition());
                    return additionResponse;
                })
                .collect(Collectors.toList());
        response.setAdditionItems(additionItemResponses);

        // Thiáº¿t láº­p danh sÃ¡ch giao dá»‹ch
        if (invoice.getTransactions() != null) {
            response.setTransactions(invoice.getTransactions().stream()
                    .map(t -> new TransactionResponse(
                            t.getTransactionId(),
                            t.getAmount(),
                            t.getPayerName(),
                            t.getPaymentDescription(),
                            t.getCategory(),
                            t.getTransactionDate(),
                            t.isTransactionType()))
                    .collect(Collectors.toList()));
        }

        return response;
    }

    @Override
    public void deleteInvoice(UUID invoiceId) {
        // 1. TÃ¬m kiáº¿m hÃ³a Ä‘Æ¡n theo ID
        Invoice invoice =
                invoiceRepository.findById(invoiceId).orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        // 2. Kiá»ƒm tra tráº¡ng thÃ¡i thanh toÃ¡n
        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVOICE_CANNOT_BE_DELETED);
        }

        // XÃ³a InvoiceDetail
        if (invoice.getDetailInvoices() != null) {
            detailInvoiceRepository.deleteAll(invoice.getDetailInvoices());
        }

        // XÃ³a InvoiceAdditionItem
        if (invoice.getAdditionItems() != null) {
            additionItemRepository.deleteAll(invoice.getAdditionItems());
        }

        invoiceRepository.delete(invoice);
    }

    @Override
    public InvoiceResponse updateInvoice(UUID invoiceId, UpdateInvoiceRequest request) {
        Invoice invoice = invoiceRepository
                .findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("HÃ³a Ä‘Æ¡n khÃ´ng tá»“n táº¡i"));

        if (request.getInvoiceReason() != null) {
            invoice.setInvoiceReason(request.getInvoiceReason());
        }
        if (request.getInvoiceCreateMonth() != null) {
            invoice.setInvoiceCreateMonth(request.getInvoiceCreateMonth());
        }
        if (request.getInvoiceCreateDate() != null) {
            invoice.setInvoiceCreateDate(request.getInvoiceCreateDate());
            invoice.setDueDate(request.getInvoiceCreateDate().plusDays(7));
        }
        if (request.getDueDate() != null) {
            invoice.setDueDate(request.getDueDate());
        }

        LocalDate moveInDate = invoice.getContract()
                .getMoveinDate()
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        List<InvoiceDetail> updatedDetails = new ArrayList<>();

        if (request.getServiceDetails() != null) {
            for (InvoiceDetailServiceRequest serviceRequest : request.getServiceDetails()) {
                InvoiceDetail detail = new InvoiceDetail();

                RoomService roomService = roomServiceRepository
                        .findById(serviceRequest.getRoomServiceId())
                        .orElseThrow(() -> new RuntimeException("RoomService khÃ´ng tá»“n táº¡i"));

                MotelService service = roomService.getService();
                if (service == null) {
                    throw new RuntimeException("MotelService khÃ´ng tá»“n táº¡i");
                }

                int quantity = serviceRequest.getQuantity() != null ? serviceRequest.getQuantity() : 1;
                detail.setInvoice(invoice);
                detail.setRoomService(roomService);
                detail.setRoomServiceQuantity(quantity);

                updatedDetails.add(detail);
            }
        }

        if (request.getDeviceDetails() != null) {
            for (InvoiceDetailDeviceRequest deviceRequest : request.getDeviceDetails()) {
                InvoiceDetail detail = invoice.getDetailInvoices().stream()
                        .filter(d -> d.getRoomDevice() != null
                                && d.getRoomDevice().getRoomDeviceId().equals(deviceRequest.getRoomDeviceId()))
                        .findFirst()
                        .orElse(new InvoiceDetail());

                RoomDevice roomDevice = roomDeviceRepository
                        .findById(deviceRequest.getRoomDeviceId())
                        .orElseThrow(() -> new RuntimeException("RoomDevice khÃ´ng tá»“n táº¡i"));

                detail.setInvoice(invoice);
                detail.setRoomDevice(roomDevice);

                updatedDetails.add(detail);
            }
        }

        invoice.getDetailInvoices().clear();
        invoice.getDetailInvoices().addAll(updatedDetails);

        List<InvoiceAdditionItem> updatedAdditionItems = new ArrayList<>();
        if (request.getAdditionItems() != null) {
            for (UpdateInvoiceAdditionItemRequest additionRequest : request.getAdditionItems()) {

                InvoiceAdditionItem additionItem = invoice.getAdditionItems().stream()
                        .filter(a -> a.getAdditionalChargeId().equals(additionRequest.getAdditionalChargeId()))
                        .findFirst()
                        .orElse(new InvoiceAdditionItem());

                additionItem.setInvoice(invoice);
                additionItem.setReason(additionRequest.getReason());
                additionItem.setAmount(additionRequest.getAmount());
                additionItem.setIsAddition(additionRequest.getIsAddition());

                updatedAdditionItems.add(additionItem);
            }
        }

        invoice.getAdditionItems().clear();
        invoice.getAdditionItems().addAll(updatedAdditionItems);

        invoiceRepository.save(invoice);

        return mapToResponse(
                invoice,
                invoice.getDetailInvoices(),
                moveInDate,
                invoice.getDueDateofmoveinDate(),
                calculateTotalServiceAmount(invoice.getDetailInvoices()));
    }

    private double calculateTotalServiceAmount(List<InvoiceDetail> details) {
        return details.stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();
    }

    @Override
    public Invoice findInvoiceById(UUID invoiceId) {
        return invoiceRepository
                .findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice khÃ´ng tá»“n táº¡i"));
    }

    @Override
    public InvoiceResponse mapToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        List<InvoiceDetail> details = invoice.getDetailInvoices();
        LocalDate moveInDate = invoice.getContract()
                .getMoveinDate()
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        LocalDate dueDateOfMoveInDate = moveInDate.plusDays(30);
        double totalServiceAmount = details.stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();
        return mapToResponse(invoice, details, moveInDate, dueDateOfMoveInDate, totalServiceAmount);
    }

    @Override
    public void collectPayment(UUID invoiceId, CollectPaymentRequest request) {
        // TÃ¬m hÃ³a Ä‘Æ¡n
        Invoice invoice = invoiceRepository
                .findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice khÃ´ng tá»“n táº¡i"));

        // Kiá»ƒm tra tráº¡ng thÃ¡i thanh toÃ¡n
        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("HÃ³a Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c thanh toÃ¡n trÆ°á»›c Ä‘Ã³.");
        }

        // Táº¡o Ä‘á»‘i tÆ°á»£ng Transaction thay vÃ¬ Payment
        Transaction transaction = new Transaction();
        transaction.setAmount(BigDecimal.valueOf(request.getTotalAmount()));
        transaction.setPayerName(request.getPaymentName());
        transaction.setPaymentDescription(request.getDescription());
        transaction.setTransactionDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        transaction.setTransactionType(true); // Thu vÃ o
        transaction.setInvoice(invoice);

        transactionRepository.save(transaction);

        // Cáº­p nháº­t tráº¡ng thÃ¡i hÃ³a Ä‘Æ¡n (Logic sáº½ Ä‘Æ°á»£c cáº£i thiá»‡n sau á»Ÿ TransactionService)
        // Hiá»‡n táº¡i táº¡m thá»i marked lÃ  PAID náº¿u collect qua API nÃ y
        invoice.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoice);
    }
}
