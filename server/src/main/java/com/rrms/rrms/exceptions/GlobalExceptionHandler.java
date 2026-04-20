package com.rrms.rrms.exceptions;

import java.text.ParseException;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.nimbusds.jose.JOSEException;
import com.rrms.rrms.dto.response.ApiResponse;
import com.rrms.rrms.enums.ErrorCode;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<Void>> handlingRuntimeException(RuntimeException exception) {
        log.error("Exception: ", exception);
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode())
                .body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handlingAccessDeniedException(AccessDeniedException e) {
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(ErrorCode.UNAUTHORIZED.getCode())
                .message(ErrorCode.UNAUTHORIZED.getMessage())
                .build();

        return ResponseEntity.status(ErrorCode.UNAUTHORIZED.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid ErrorCode key: {}", enumKey);
        }

        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = ParseException.class)
    ResponseEntity<ApiResponse<Void>> handlingParseException(ParseException exception) {
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(ErrorCode.PARSE_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.PARSE_EXCEPTION.getMessage());

        return ResponseEntity.status(ErrorCode.PARSE_EXCEPTION.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = JOSEException.class)
    ResponseEntity<ApiResponse<Void>> handlingJOSEException(JOSEException exception) {
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage("Error processing token: " + exception.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    ResponseEntity<ApiResponse<Void>> handlingEntityNotFound(EntityNotFoundException exception) {
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(ErrorCode.ENTITY_NOT_FOUND.getCode());
        apiResponse.setMessage(exception.getMessage());

        return ResponseEntity.status(ErrorCode.ENTITY_NOT_FOUND.getStatusCode()).body(apiResponse);
    }
}
