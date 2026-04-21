package com.rrms.rrms.exceptions;

import java.text.ParseException;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.nimbusds.jose.JOSEException;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.enums.ErrorCode;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        String message =
                exception.getMessage() == null || exception.getMessage().isBlank()
                        ? errorCode.getMessage()
                        : exception.getMessage();
        return buildResponse(errorCode, message);
    }

    @ExceptionHandler({
        IllegalArgumentException.class,
        MethodArgumentTypeMismatchException.class,
        MissingServletRequestParameterException.class,
        HttpMessageNotReadableException.class
    })
    ResponseEntity<ApiResponse<Void>> handlingBadRequest(Exception exception) {
        log.warn("Invalid request", exception);
        String message =
                exception.getMessage() == null || exception.getMessage().isBlank()
                        ? ErrorCode.INVALID_INPUT.getMessage()
                        : exception.getMessage();
        return buildResponse(ErrorCode.INVALID_INPUT, message);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        return buildResponse(ErrorCode.UNAUTHORIZED, ErrorCode.UNAUTHORIZED.getMessage());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handlingValidation(MethodArgumentNotValidException exception) {
        String message = exception.getFieldError() != null
                ? exception.getFieldError().getDefaultMessage()
                : ErrorCode.INVALID_INPUT.getMessage();

        ErrorCode errorCode = ErrorCode.INVALID_INPUT;
        try {
            errorCode = ErrorCode.valueOf(message);
            message = errorCode.getMessage();
        } catch (IllegalArgumentException ignored) {
            // Keep the original validation message when it does not match an ErrorCode enum key.
        }

        return buildResponse(errorCode, message);
    }

    @ExceptionHandler(value = ParseException.class)
    ResponseEntity<ApiResponse<Void>> handlingParseException(ParseException exception) {
        return buildResponse(ErrorCode.PARSE_EXCEPTION, ErrorCode.PARSE_EXCEPTION.getMessage());
    }

    @ExceptionHandler(value = JOSEException.class)
    ResponseEntity<ApiResponse<Void>> handlingJoseException(JOSEException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                        .message("Error processing token: " + exception.getMessage())
                        .build());
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    ResponseEntity<ApiResponse<Void>> handlingEntityNotFound(EntityNotFoundException exception) {
        return buildResponse(ErrorCode.ENTITY_NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<Void>> handlingException(Exception exception) {
        log.error("Unhandled exception", exception);
        return buildResponse(ErrorCode.UNCATEGORIZED_EXCEPTION, ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
    }

    private ResponseEntity<ApiResponse<Void>> buildResponse(ErrorCode errorCode, String message) {
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(errorCode.getCode())
                        .message(message)
                        .build());
    }
}
