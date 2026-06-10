package com.rrms.rrms.enums;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    INVALID_ENUM_VALUE(1002, "Invalid enum value", HttpStatus.BAD_REQUEST),
    ENTITY_NOT_FOUND(1003, "Entity not found", HttpStatus.NOT_FOUND),
    PAYMENT_EXCEPTION(1004, "Payment error", HttpStatus.BAD_REQUEST),
    PARSE_EXCEPTION(1005, "Parse error", HttpStatus.BAD_REQUEST),
    INVALID_INPUT(1006, "Invalid input", HttpStatus.BAD_REQUEST),

    MOTEL_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Motel not found", HttpStatus.NOT_FOUND),
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Account not found", HttpStatus.NOT_FOUND),
    CONTRACT_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Contract not found", HttpStatus.NOT_FOUND),
    ROOM_DETAIL_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Room detail not found", HttpStatus.NOT_FOUND),
    SEARCH_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Search not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Room not found", HttpStatus.NOT_FOUND),
    SERVICE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Service not found", HttpStatus.NOT_FOUND),
    ROOM_SERVICE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Room service not found", HttpStatus.NOT_FOUND),
    ROOM_DEVICE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Room device not found", HttpStatus.NOT_FOUND),
    TYPE_ROOM_EXIST(HttpStatus.BAD_REQUEST.value(), "Type room exists", HttpStatus.BAD_REQUEST),
    TYPE_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Type room not found", HttpStatus.NOT_FOUND),
    SERVICE_ID_REQUIRED(HttpStatus.BAD_REQUEST.value(), "Service id required", HttpStatus.BAD_REQUEST),
    INVALID_SEARCH_PARAMETER(HttpStatus.BAD_REQUEST.value(), "Invalid search parameter", HttpStatus.BAD_REQUEST),
    BULLETIN_BOARD_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Bulletin board not found", HttpStatus.NOT_FOUND),
    BULLETIN_BOARD_REVIEW_NOT_FOUND(
            HttpStatus.NOT_FOUND.value(), "Bulletin board review not found", HttpStatus.NOT_FOUND),
    BULLETIN_BOARD_IMAGE_NOT_FOUND(
            HttpStatus.NOT_FOUND.value(), "Bulletin board image not found", HttpStatus.NOT_FOUND),

    PHONE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Phone not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(HttpStatus.UNAUTHORIZED.value(), "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(HttpStatus.FORBIDDEN.value(), "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST.value(), "Invalid password", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(HttpStatus.BAD_REQUEST.value(), "Phone number already exists", HttpStatus.BAD_REQUEST),
    INVALID_PHONE2(HttpStatus.BAD_REQUEST.value(), "Phone number must contain 10 digits", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(HttpStatus.BAD_REQUEST.value(), "Username already exists", HttpStatus.BAD_REQUEST),
    ACCOUNT_ALREADY_EXISTS(HttpStatus.BAD_REQUEST.value(), "Account already exists", HttpStatus.BAD_REQUEST),
    TOKEN_GENERATION_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Could not generate authentication token",
            HttpStatus.INTERNAL_SERVER_ERROR),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Role not found", HttpStatus.NOT_FOUND),
    ROLE_NOT_PROVIDED(HttpStatus.BAD_REQUEST.value(), "Role not provided", HttpStatus.BAD_REQUEST),
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST.value(), "Invalid refresh token", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(HttpStatus.BAD_REQUEST.value(), "Old password is not correct", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_MUST_BE_DIFFERENT(
            HttpStatus.BAD_REQUEST.value(),
            "New password cannot be the same as the old password",
            HttpStatus.BAD_REQUEST),
    OTP_INVALID_OR_EXPIRED(HttpStatus.BAD_REQUEST.value(), "OTP is invalid or expired", HttpStatus.BAD_REQUEST),

    INVOICE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Invoice not found", HttpStatus.NOT_FOUND),
    INVOICE_ALREADY_CANCELED(HttpStatus.CONFLICT.value(), "Invoice was already canceled", HttpStatus.CONFLICT),
    INVOICE_ALREADY_PAID(HttpStatus.CONFLICT.value(), "Invoice was already paid", HttpStatus.CONFLICT),
    INVOICE_CANNOT_BE_DELETED(HttpStatus.CONFLICT.value(), "Paid invoices cannot be deleted", HttpStatus.CONFLICT),
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Transaction not found", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Permission not found", HttpStatus.NOT_FOUND),
    QRCODE_GENERATION_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Could not generate invoice QR code",
            HttpStatus.INTERNAL_SERVER_ERROR),
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Resource not found", HttpStatus.NOT_FOUND),
    LOGIN_HISTORY_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "Login history not found", HttpStatus.NOT_FOUND);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
