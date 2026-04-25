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
import com.rrms.rrms.services.IInvoiceService;
import com.rrms.rrms.services.servicesImp.QRCodeService;
import com.rrms.rrms.utils.PageableUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Invoice Controller", description = "CRUD operations for invoices and payment collection")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping({"/invoices", "/api/v1/invoices"})
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HOST')")
public class InvoiceController {
    IInvoiceService invoiceService;
    QRCodeService qrCodeService;

    @Operation(summary = "Create a new invoice")
    @PostMapping({"", "/create"})
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody InvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<InvoiceResponse>builder()
                        .message("Hóa đơn đã được tạo thành công")
                        .result(invoiceService.createInvoice(request))
                        .build());
    }

    @Operation(summary = "Cancel an invoice by ID")
    @PutMapping("/{invoiceId}/cancel")
    public ApiResponse<Void> cancelInvoice(@PathVariable UUID invoiceId) {
        invoiceService.cancelInvoice(invoiceId);
        return ApiResponse.<Void>builder()
                .message("Hóa đơn đã được hủy thành công")
                .build();
    }

    @Operation(summary = "Delete an invoice by ID")
    @DeleteMapping({"/{invoiceId}", "/delete/{invoiceId}"})
    public ApiResponse<Void> deleteInvoice(@PathVariable("invoiceId") UUID invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ApiResponse.<Void>builder()
                .message("Hóa đơn đã được xóa thành công")
                .build();
    }

    @Operation(summary = "Update an existing invoice")
    @PutMapping({"/{invoiceId}", "/update/{invoiceId}"})
    public ApiResponse<InvoiceResponse> updateInvoice(
            @PathVariable UUID invoiceId, @RequestBody UpdateInvoiceRequest request) {
        return ApiResponse.<InvoiceResponse>builder()
                .message("Hóa đơn đã được cập nhật thành công.")
                .result(invoiceService.updateInvoice(invoiceId, request))
                .build();
    }

    @Operation(summary = "Get invoices by motel ID with pagination")
    @GetMapping("/motel/{motelId}")
    public ApiResponse<PageResponse<InvoiceResponse>> getInvoicesByMotelId(
            @PathVariable UUID motelId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        PageResponse<InvoiceResponse> result = PageResponse.from(invoiceService.getInvoicesByMotelId(
                motelId, PageableUtils.of(page, size, sortBy == null ? "invoiceCreateDate" : sortBy, sortDirection)));

        return ApiResponse.<PageResponse<InvoiceResponse>>builder()
                .message("Hóa đơn đã được truy xuất thành công")
                .result(result)
                .build();
    }

    @Operation(summary = "Collect payment for an invoice")
    @PatchMapping("/{invoiceId}/collect-payment")
    public ApiResponse<InvoiceResponse> collectPayment(
            @PathVariable UUID invoiceId, @RequestBody CollectPaymentRequest request) {
        invoiceService.collectPayment(invoiceId, request);
        Invoice invoice = invoiceService.findInvoiceById(invoiceId);
        return ApiResponse.<InvoiceResponse>builder()
                .message("Thanh toán đã được thu thành công")
                .result(invoiceService.mapToResponse(invoice))
                .build();
    }

    @Operation(summary = "Generate QR code for invoice payment")
    @GetMapping("/{invoiceId}/generate-qr")
    public ApiResponse<QRCodeResponse> generateQrCode(@PathVariable UUID invoiceId) {
        try {
            Invoice invoice = invoiceService.findInvoiceById(invoiceId);
            double totalAmount = invoiceService.mapToResponse(invoice).getTotalAmount();
            String bankAccount = "0919925302";
            String bankName = "MB Bank";
            String description = "Thanh toan hoa don: " + invoiceId;
            String qrContent =
                    String.format("STK:%s\nNH:%s\nSoTien:%.2f\nND:%s", bankAccount, bankName, totalAmount, description);
            String qrCodeImage = qrCodeService.generateQRCodeImage(qrContent, 200, 200);

            return ApiResponse.<QRCodeResponse>builder()
                    .message("Mã QR đã được tạo thành công")
                    .result(new QRCodeResponse(qrCodeImage, qrContent))
                    .build();
        } catch (WriterException | IOException exception) {
            throw new AppException(ErrorCode.QRCODE_GENERATION_FAILED);
        }
    }
}
