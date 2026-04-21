package com.rrms.rrms.controllers;

import java.io.IOException;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.google.zxing.WriterException;
import com.rrms.rrms.dto.request.CollectPaymentRequest;
import com.rrms.rrms.dto.request.InvoiceRequest;
import com.rrms.rrms.dto.request.UpdateInvoiceRequest;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.dto.response.InvoiceResponse;
import com.rrms.rrms.dto.response.PageResponse;
import com.rrms.rrms.dto.response.QRCodeResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.models.Invoice;
import com.rrms.rrms.services.IInvoices;
import com.rrms.rrms.services.servicesImp.QRCodeService;
import com.rrms.rrms.utils.PageableUtils;

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
@RequestMapping({"/invoices", "/api/v1/invoices"})
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class InvoiceController {
    IInvoices invoices;
    QRCodeService qrCodeService;

    @PostMapping({"", "/create"})
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody InvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<InvoiceResponse>builder()
                        .message("Invoice created successfully")
                        .result(invoices.createInvoice(request))
                        .build());
    }

    @PutMapping("/{invoiceId}/cancel")
    public ApiResponse<Void> cancelInvoice(@PathVariable UUID invoiceId) {
        invoices.cancelInvoice(invoiceId);
        return ApiResponse.<Void>builder()
                .message("Invoice canceled successfully")
                .build();
    }

    @DeleteMapping({"/{invoiceId}", "/delete/{invoiceId}"})
    public ApiResponse<Void> deleteInvoice(@PathVariable("invoiceId") UUID invoiceId) {
        invoices.deleteInvoice(invoiceId);
        return ApiResponse.<Void>builder()
                .message("Invoice deleted successfully")
                .build();
    }

    @PutMapping({"/{invoiceId}", "/update/{invoiceId}"})
    public ApiResponse<InvoiceResponse> updateInvoice(
            @PathVariable UUID invoiceId, @RequestBody UpdateInvoiceRequest request) {
        return ApiResponse.<InvoiceResponse>builder()
                .message("Invoice updated successfully")
                .result(invoices.updateInvoice(invoiceId, request))
                .build();
    }

    @GetMapping("/motel/{motelId}")
    public ApiResponse<PageResponse<InvoiceResponse>> getInvoicesByMotelId(
            @PathVariable UUID motelId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        PageResponse<InvoiceResponse> result = PageResponse.from(invoices.getInvoicesByMotelId(
                motelId, PageableUtils.of(page, size, sortBy == null ? "invoiceCreateDate" : sortBy, sortDirection)));

        return ApiResponse.<PageResponse<InvoiceResponse>>builder()
                .message("Invoices retrieved successfully")
                .result(result)
                .build();
    }

    @PatchMapping("/{invoiceId}/collect-payment")
    public ApiResponse<InvoiceResponse> collectPayment(
            @PathVariable UUID invoiceId, @RequestBody CollectPaymentRequest request) {
        invoices.collectPayment(invoiceId, request);
        Invoice invoice = invoices.findInvoiceById(invoiceId);
        return ApiResponse.<InvoiceResponse>builder()
                .message("Payment collected successfully")
                .result(invoices.mapToResponse(invoice))
                .build();
    }

    @GetMapping("/{invoiceId}/generate-qr")
    public ApiResponse<QRCodeResponse> generateQrCode(@PathVariable UUID invoiceId) {
        try {
            Invoice invoice = invoices.findInvoiceById(invoiceId);
            double totalAmount = invoices.mapToResponse(invoice).getTotalAmount();
            String bankAccount = "0919925302";
            String bankName = "MB Bank";
            String description = "Thanh toan hoa don: " + invoiceId;
            String qrContent =
                    String.format("STK:%s\nNH:%s\nSoTien:%.2f\nND:%s", bankAccount, bankName, totalAmount, description);
            String qrCodeImage = qrCodeService.generateQRCodeImage(qrContent, 200, 200);

            return ApiResponse.<QRCodeResponse>builder()
                    .message("QR code generated successfully")
                    .result(new QRCodeResponse(qrCodeImage, qrContent))
                    .build();
        } catch (WriterException | IOException exception) {
            log.error("Could not generate QR code for invoice {}", invoiceId, exception);
            throw new AppException(ErrorCode.QRCODE_GENERATION_FAILED);
        }
    }
}
