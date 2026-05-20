package com.rrms.rrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "Username must not be blank")
    @Size(min = 3, message = "Username must have at least 3 characters")
    String username;

    @NotBlank(message = "Phone number must not be blank")
    @Size(min = 10, max = 11, message = "Phone number must be 10 or 11 digits")
    String phone;

    String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, message = "Password must have at least 8 characters")
    String password;

    @NotBlank(message = "User type must not be blank")
    String userType;
}
