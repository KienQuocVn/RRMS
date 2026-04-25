// package com.rrms.rrms.services;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.when;

// import java.time.LocalDate;
// import java.util.Date;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.data.domain.PageRequest;

// import com.rrms.rrms.dto.request.InvoiceRequest;
// import com.rrms.rrms.dto.response.InvoiceResponse;
// import com.rrms.rrms.enums.ErrorCode;
// import com.rrms.rrms.enums.PaymentStatus;
// import com.rrms.rrms.exceptions.AppException;
// import com.rrms.rrms.models.Contract;
// import com.rrms.rrms.models.Invoice;
// import com.rrms.rrms.models.Room;
// import com.rrms.rrms.repositories.ContractRepository;
// import com.rrms.rrms.repositories.DetailInvoiceRepository;
// import com.rrms.rrms.repositories.InvoiceAdditionItemRepository;
// import com.rrms.rrms.repositories.InvoiceRepository;
// import com.rrms.rrms.repositories.RoomDeviceRepository;
// import com.rrms.rrms.repositories.RoomServiceRepository;
// import com.rrms.rrms.repositories.TransactionRepository;
// import com.rrms.rrms.services.servicesImp.InvoiceService;

// @ExtendWith(MockitoExtension.class)
// class InvoiceServiceTest {

//     @Mock
//     private InvoiceRepository invoiceRepository;

//     @Mock
//     private ContractRepository contractRepository;

//     @Mock
//     private DetailInvoiceRepository detailInvoiceRepository;

//     @Mock
//     private RoomDeviceRepository roomDeviceRepository;

//     @Mock
//     private RoomServiceRepository roomServiceRepository;

//     @Mock
//     private TransactionRepository transactionRepository;

//     @Mock
//     private InvoiceAdditionItemRepository invoiceAdditionItemRepository;

//     @InjectMocks
//     private InvoiceService invoiceService;

//     @Test
//     void getInvoicesByMotelId_preservesPagedOrdering() {
//         UUID motelId = UUID.randomUUID();
//         UUID firstInvoiceId = UUID.randomUUID();
//         UUID secondInvoiceId = UUID.randomUUID();
//         PageRequest pageable = PageRequest.of(0, 2);

//         when(invoiceRepository.findInvoiceIdsByMotelId(motelId, pageable))
//                 .thenReturn(new PageImpl<>(List.of(secondInvoiceId, firstInvoiceId), pageable, 2));

//         Invoice firstInvoice = buildInvoice(firstInvoiceId, "Room A");
//         Invoice secondInvoice = buildInvoice(secondInvoiceId, "Room B");

//         when(invoiceRepository.findDetailedByInvoiceIdIn(List.of(secondInvoiceId, firstInvoiceId)))
//                 .thenReturn(List.of(firstInvoice, secondInvoice));

//         Page<InvoiceResponse> result = invoiceService.getInvoicesByMotelId(motelId, pageable);

//         assertEquals(2, result.getTotalElements());
//         assertEquals(secondInvoiceId, result.getContent().get(0).getInvoiceId());
//         assertEquals(firstInvoiceId, result.getContent().get(1).getInvoiceId());
//     }

//     @Test
//     void createInvoice_throwsWhenContractMissing() {
//         InvoiceRequest request = new InvoiceRequest();
//         request.setContractId(UUID.randomUUID());

//         when(contractRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

//         AppException exception = assertThrows(AppException.class, () -> invoiceService.createInvoice(request));

//         assertEquals(ErrorCode.CONTRACT_NOT_FOUND, exception.getErrorCode());
//     }

//     @Test
//     void cancelInvoice_throwsWhenAlreadyPaid() {
//         UUID invoiceId = UUID.randomUUID();
//         Invoice invoice = buildInvoice(invoiceId, "Room A");
//         invoice.setPaymentStatus(PaymentStatus.PAID);

//         when(invoiceRepository.findDetailedByInvoiceId(invoiceId)).thenReturn(Optional.of(invoice));

//         AppException exception = assertThrows(AppException.class, () -> invoiceService.cancelInvoice(invoiceId));

//         assertEquals(ErrorCode.INVOICE_ALREADY_PAID, exception.getErrorCode());
//     }

//     private Invoice buildInvoice(UUID invoiceId, String roomName) {
//         Room room = new Room();
//         room.setRoomId(UUID.randomUUID());
//         room.setName(roomName);
//         room.setPrice(2000.0);

//         Contract contract = new Contract();
//         contract.setContractId(UUID.randomUUID());
//         contract.setRoom(room);
//         contract.setPrice(2500.0);
//         contract.setMoveinDate(Date.from(LocalDate.of(2026, 1, 1)
//                 .atStartOfDay(java.time.ZoneId.systemDefault())
//                 .toInstant()));

//         Invoice invoice = new Invoice();
//         invoice.setInvoiceId(invoiceId);
//         invoice.setContract(contract);
//         invoice.setPaymentStatus(PaymentStatus.UNPAID);
//         invoice.setInvoiceCreateDate(LocalDate.of(2026, 4, 1));
//         invoice.setDueDate(LocalDate.of(2026, 4, 8));
//         invoice.setDetailInvoices(List.of());
//         invoice.setAdditionItems(List.of());
//         invoice.setTransactions(List.of());
//         return invoice;
//     }
// }
