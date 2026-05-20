package com.rrms.rrms.dto.request;

import jakarta.validation.constraints.NotBlank;

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
public class SocialLoginRequest {
    @NotBlank(message = "Social provider must not be blank")
    String provider;

    @NotBlank(message = "Social provider id must not be blank")
    String providerId;

    String email;

    String name;

    String avatar;
}
