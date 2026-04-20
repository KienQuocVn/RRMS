package com.rrms.rrms.controllers;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.zxing.WriterException;
import com.rrms.rrms.dto.request.CollectPaymentRequest;
import com.rrms.rrms.dto.request.InvoiceRequest;
import com.rrms.rrms.dto.request.UpdateInvoiceRequest;
import com.rrms.rrms.dto.response.InvoiceResponse;
import com.rrms.rrms.dto.response.QRCodeResponse;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.services.IInvoices;
import com.rrms.rrms.services.servicesImp.QRCodeService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Invoice Controller", description = "Controller for Invoice")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/invoices")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class InvoiceController {
    private final IInvoices invoices;

    private final QRCodeService qrCodeService;

    @PostMapping("/create")
    public ResponseEntity<InvoiceResponse> createInvoice(@RequestBody InvoiceRequest request) {
        InvoiceResponse response = invoices.createInvoice(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{invoiceId}/cancel")
    public ResponseEntity<String> cancelInvoice(@PathVariable UUID invoiceId) {
        invoices.cancelInvoice(invoiceId);
        return ResponseEntity.ok("HÃ³a Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c há»§y thÃ nh cÃ´ng");
    }

    @DeleteMapping("/delete/{invoiceId}")
    public ResponseEntity<?> deleteInvoice(@PathVariable("invoiceId") UUID invoiceId) {
        invoices.deleteInvoice(invoiceId);
        return ResponseEntity.ok("XÃ³a hÃ³a Ä‘Æ¡n thÃ nh cÃ´ng.");
    }

    @PutMapping("/update/{invoiceId}")
    public ResponseEntity<InvoiceResponse> updateInvoice(
            @PathVariable UUID invoiceId, @RequestBody UpdateInvoiceRequest request) {
        InvoiceResponse response = invoices.updateInvoice(invoiceId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/motel/{motelId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByMotelId(@PathVariable UUID motelId) {
        List<InvoiceResponse> responses = invoices.getInvoicesByMotelId(motelId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{invoiceId}/collect-payment")
    public ResponseEntity<InvoiceResponse> collectPayment(
            @PathVariable UUID invoiceId, @RequestBody CollectPaymentRequest request) {
        invoices.collectPayment(invoiceId, request);

        Invoice invoice = invoices.findInvoiceById(invoiceId);
        InvoiceResponse response = invoices.mapToResponse(invoice);

        return ResponseEntity.ok(response);
    }

    // Endpoint má»›i Ä‘á»ƒ táº¡o mÃ£ QR
    @GetMapping("/{invoiceId}/generate-qr")
    public ResponseEntity<QRCodeResponse> generateQrCode(@PathVariable UUID invoiceId) {
        try {
            Invoice invoice = invoices.findInvoiceById(invoiceId);

            double totalAmount = calculateTotalAmount(invoice); // TÃ­nh tá»•ng tiá»n
            String bankAccount = "0919925302"; // Sá»‘ tÃ i khoáº£n ngÃ¢n hÃ ng
            String bankName = "MB Bank"; // TÃªn ngÃ¢n hÃ ng
            String description = "Thanh toÃ¡n hÃ³a Ä‘Æ¡n: " + invoiceId.toString();

            // Táº¡o ná»™i dung QR
            String qrContent =
                    String.format("STK:%s\nNH:%s\nSoTien:%.2f\nND:%s", bankAccount, bankName, totalAmount, description);

            // Táº¡o mÃ£ QR
            String qrCodeImage = qrCodeService.generateQRCodeImage(qrContent, 200, 200);

            QRCodeResponse response = new QRCodeResponse(qrCodeImage, qrContent);
            return ResponseEntity.ok(response);
        } catch (RuntimeException | WriterException | IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    private double calculateTotalAmount(Invoice invoice) {
        double totalServiceAmount = invoice.getDetailInvoices().stream()
                .filter(detail -> detail.getRoomService() != null)
                .mapToDouble(
                        detail -> detail.getRoomService().getService().getPrice() * detail.getRoomServiceQuantity())
                .sum();

        double totalAddition = invoice.getAdditionItems() != null
                ? invoice.getAdditionItems().stream()
                        .mapToDouble(charge -> charge.getIsAddition() ? charge.getAmount() : -charge.getAmount())
                        .sum()
                : 0;

        return invoice.getContract().getPrice() + totalServiceAmount + totalAddition;
    }
}
