package com.rrms.rrms.services.servicesImp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrms.rrms.dto.request.CollectPaymentRequest;
import com.rrms.rrms.dto.request.InvoiceAdditionItemRequest;
import com.rrms.rrms.dto.request.InvoiceDetailDeviceRequest;
import com.rrms.rrms.dto.request.InvoiceDetailServiceRequest;
import com.rrms.rrms.dto.request.InvoiceRequest;
import com.rrms.rrms.dto.request.UpdateInvoiceAdditionItemRequest;
import com.rrms.rrms.dto.request.UpdateInvoiceRequest;
import com.rrms.rrms.dto.response.InvoiceAdditionItemResponse;
import com.rrms.rrms.dto.response.InvoiceDeviceDetailResponse;
import com.rrms.rrms.dto.response.InvoiceResponse;
import com.rrms.rrms.dto.response.InvoiceServiceDetailResponse;
import com.rrms.rrms.dto.response.TransactionResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.enums.PaymentStatus;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Contract;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.models.InvoiceAdditionItem;
import com.rrms.rrms.models.InvoiceDetail;
import com.rrms.rrms.models.MotelService;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.models.RoomDevice;
import com.rrms.rrms.models.RoomService;
import com.rrms.rrms.models.Transaction;
import com.rrms.rrms.repositories.ContractRepository;
import com.rrms.rrms.repositories.InvoiceAdditionItemRepository;
import com.rrms.rrms.repositories.InvoiceDetailRepository;
import com.rrms.rrms.repositories.InvoiceRepository;
import com.rrms.rrms.repositories.RoomDeviceRepository;
import com.rrms.rrms.repositories.RoomServiceRepository;
import com.rrms.rrms.repositories.TransactionRepository;
import com.rrms.rrms.services.IInvoiceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService implements IInvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ContractRepository contractRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final RoomDeviceRepository roomDeviceRepository;
    private final RoomServiceRepository roomServiceRepository;
    private final TransactionRepository transactionRepository;
    private final InvoiceAdditionItemRepository additionItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByMotelId(UUID motelId) {
        return getInvoicesByMotelId(motelId, Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByMotelId(UUID motelId, Pageable pageable) {
        Page<UUID> invoiceIds = invoiceRepository.findInvoiceIdsByMotelId(motelId, pageable);
        if (invoiceIds.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, invoiceIds.getTotalElements());
        }

        Map<UUID, Invoice> invoicesById = invoiceRepository.findDetailedByInvoiceIdIn(invoiceIds.getContent()).stream()
                .collect(Collectors.toMap(
                        Invoice::getInvoiceId, invoice -> invoice, (left, right) -> left, LinkedHashMap::new));

        List<InvoiceResponse> responses = invoiceIds.getContent().stream()
                .map(invoicesById::get)
                .filter(invoice -> invoice != null)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, invoiceIds.getTotalElements());
    }

    @Override
    public void cancelInvoice(UUID invoiceId) {
        Invoice invoice = getDetailedInvoice(invoiceId);

        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_PAID);
        }

        if (invoice.getPaymentStatus() == PaymentStatus.CANCELED) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_CANCELED);
        }

        invoice.setPaymentStatus(PaymentStatus.CANCELED);
        invoiceRepository.save(invoice);
    }

    @Override
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Contract contract = contractRepository
                .findById(request.getContractId())
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        LocalDate moveInDate = toLocalDate(contract.getMoveinDate());
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
        invoice.setDueDateofmoveinDate(dueDateOfMoveInDate);
        invoice.setPaymentStatus(PaymentStatus.UNPAID);

        invoice.setAdditionItems(buildAdditionItems(invoice, request.getAdditionItems()));
        invoice.setDetailInvoices(
                buildInvoiceDetails(invoice, request.getServiceDetails(), request.getDeviceDetails()));

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(savedInvoice);
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
        response.setMoveInDueDate(dueDateOfMoveInDate);
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

        double totalAddition = invoice.getAdditionItems() == null
                ? 0
                : invoice.getAdditionItems().stream()
                        .mapToDouble(charge -> charge.getIsAddition() ? charge.getAmount() : -charge.getAmount())
                        .sum();

        double basePrice = invoice.getContract().getActualPrice() != null
                ? invoice.getContract().getActualPrice()
                : invoice.getContract().getPrice();
        response.setTotalAmount(basePrice + totalServiceAmount + totalAddition);

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

        List<InvoiceAdditionItemResponse> additionItemResponses = invoice.getAdditionItems() == null
                ? Collections.emptyList()
                : invoice.getAdditionItems().stream()
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

        if (invoice.getTransactions() != null) {
            response.setTransactions(invoice.getTransactions().stream()
                    .map(this::mapTransactionResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    @Override
    public void deleteInvoice(UUID invoiceId) {
        Invoice invoice = getDetailedInvoice(invoiceId);

        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVOICE_CANNOT_BE_DELETED);
        }

        if (invoice.getDetailInvoices() != null) {
            invoiceDetailRepository.deleteAll(invoice.getDetailInvoices());
        }

        if (invoice.getAdditionItems() != null) {
            additionItemRepository.deleteAll(invoice.getAdditionItems());
        }

        invoiceRepository.delete(invoice);
    }

    @Override
    public InvoiceResponse updateInvoice(UUID invoiceId, UpdateInvoiceRequest request) {
        Invoice invoice = getDetailedInvoice(invoiceId);

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

        if (request.getServiceDetails() != null || request.getDeviceDetails() != null) {
            List<InvoiceDetail> updatedDetails =
                    buildInvoiceDetails(invoice, request.getServiceDetails(), request.getDeviceDetails());
            List<InvoiceDetail> currentDetails =
                    invoice.getDetailInvoices() == null ? new ArrayList<>() : invoice.getDetailInvoices();
            currentDetails.clear();
            currentDetails.addAll(updatedDetails);
            invoice.setDetailInvoices(currentDetails);
        }

        if (request.getAdditionItems() != null) {
            List<InvoiceAdditionItem> updatedAdditionItems =
                    buildUpdatedAdditionItems(invoice, request.getAdditionItems());
            List<InvoiceAdditionItem> currentAdditionItems =
                    invoice.getAdditionItems() == null ? new ArrayList<>() : invoice.getAdditionItems();
            currentAdditionItems.clear();
            currentAdditionItems.addAll(updatedAdditionItems);
            invoice.setAdditionItems(currentAdditionItems);
        }

        return mapToResponse(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public Invoice findInvoiceById(UUID invoiceId) {
        return getDetailedInvoice(invoiceId);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse mapToResponse(Invoice invoice) {
        List<InvoiceDetail> details =
                invoice.getDetailInvoices() == null ? Collections.emptyList() : invoice.getDetailInvoices();
        LocalDate moveInDate = toLocalDate(invoice.getContract().getMoveinDate());
        LocalDate dueDateOfMoveInDate = moveInDate.plusDays(30);
        double totalServiceAmount = calculateTotalServiceAmount(details);
        return mapToResponse(invoice, details, moveInDate, dueDateOfMoveInDate, totalServiceAmount);
    }

    @Override
    public void collectPayment(UUID invoiceId, CollectPaymentRequest request) {
        Invoice invoice = getDetailedInvoice(invoiceId);

        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_PAID);
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(BigDecimal.valueOf(request.getTotalAmount()));
        transaction.setPayerName(request.getPaymentName() == null ? "Invoice payer" : request.getPaymentName());
        transaction.setPaymentDescription(
                request.getDescription() == null ? "Invoice payment" : request.getDescription());
        transaction.setCategory("INVOICE");
        transaction.setTransactionDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        transaction.setTransactionType(true);
        transaction.setInvoice(invoice);
        transaction.setAccount(invoice.getContract().getAccount());

        transactionRepository.save(transaction);
        invoice.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoice);
    }

    private Invoice getDetailedInvoice(UUID invoiceId) {
        return invoiceRepository
                .findDetailedByInvoiceId(invoiceId)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
    }

    private LocalDate toLocalDate(java.util.Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private List<InvoiceAdditionItem> buildAdditionItems(Invoice invoice, List<InvoiceAdditionItemRequest> requests) {
        if (requests == null) {
            return new ArrayList<>();
        }

        List<InvoiceAdditionItem> additionItems = new ArrayList<>();
        for (InvoiceAdditionItemRequest request : requests) {
            InvoiceAdditionItem charge = new InvoiceAdditionItem();
            charge.setInvoice(invoice);
            charge.setReason(request.getReason());
            charge.setAmount(request.getAmount());
            charge.setIsAddition(request.getIsAddition());
            additionItems.add(charge);
        }
        return additionItems;
    }

    private List<InvoiceAdditionItem> buildUpdatedAdditionItems(
            Invoice invoice, List<UpdateInvoiceAdditionItemRequest> requests) {
        List<InvoiceAdditionItem> currentItems =
                invoice.getAdditionItems() == null ? new ArrayList<>() : invoice.getAdditionItems();
        List<InvoiceAdditionItem> updatedItems = new ArrayList<>();

        for (UpdateInvoiceAdditionItemRequest request : requests) {
            InvoiceAdditionItem additionItem = currentItems.stream()
                    .filter(item -> item.getAdditionalChargeId() != null
                            && item.getAdditionalChargeId().equals(request.getAdditionalChargeId()))
                    .findFirst()
                    .orElse(new InvoiceAdditionItem());

            additionItem.setInvoice(invoice);
            additionItem.setReason(request.getReason());
            additionItem.setAmount(request.getAmount());
            additionItem.setIsAddition(request.getIsAddition());
            updatedItems.add(additionItem);
        }

        return updatedItems;
    }

    private List<InvoiceDetail> buildInvoiceDetails(
            Invoice invoice,
            List<InvoiceDetailServiceRequest> serviceDetails,
            List<InvoiceDetailDeviceRequest> deviceDetails) {
        List<InvoiceDetail> details = new ArrayList<>();

        if (serviceDetails != null) {
            for (InvoiceDetailServiceRequest serviceDetailRequest : serviceDetails) {
                RoomService roomService = roomServiceRepository
                        .findById(serviceDetailRequest.getRoomServiceId())
                        .orElseThrow(() -> new AppException(ErrorCode.ROOM_SERVICE_NOT_FOUND));
                MotelService service = roomService.getService();
                if (service == null) {
                    throw new AppException(ErrorCode.SERVICE_NOT_FOUND);
                }

                InvoiceDetail detail = new InvoiceDetail();
                detail.setInvoice(invoice);
                detail.setRoomService(roomService);
                detail.setRoomServiceQuantity(
                        serviceDetailRequest.getQuantity() != null ? serviceDetailRequest.getQuantity() : 1);
                details.add(detail);
            }
        }

        if (deviceDetails != null) {
            for (InvoiceDetailDeviceRequest deviceDetailRequest : deviceDetails) {
                RoomDevice roomDevice = roomDeviceRepository
                        .findById(deviceDetailRequest.getRoomDeviceId())
                        .orElseThrow(() -> new AppException(ErrorCode.ROOM_DEVICE_NOT_FOUND));

                InvoiceDetail detail = new InvoiceDetail();
                detail.setInvoice(invoice);
                detail.setRoomDevice(roomDevice);
                details.add(detail);
            }
        }

        return details;
    }

    private double calculateTotalServiceAmount(List<InvoiceDetail> details) {
        return details.stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();
    }

    private TransactionResponse mapTransactionResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getTransactionId(),
                transaction.getAmount(),
                transaction.getPayerName(),
                transaction.getPaymentDescription(),
                transaction.getCategory(),
                transaction.getTransactionDate(),
                transaction.isTransactionType());
    }
}
