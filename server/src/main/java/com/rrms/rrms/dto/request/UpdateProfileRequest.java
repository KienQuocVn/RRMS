package com.rrms.rrms.dto.request;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.rrms.rrms.enums.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * UpdateProfileRequest - DTO dành riêng cho endpoint cập nhật profile.
 * Khác AccountRequest ở chỗ password là optional (không bắt buộc khi chỉ đổi thông tin cá nhân).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateProfileRequest implements Serializable {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    String username;

    @NotBlank(message = "Họ tên không được để trống")
    String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 11, message = "Số điện thoại phải từ 10 đến 11 số")
    String phone;

    @Email(message = "Email không hợp lệ")
    String email;

    LocalDate birthday;
    Gender gender;
    String cccd;
    String address;
    String job;
    String placeOfIssue;
    LocalDate dateOfIssue;
    String avatar;
}
