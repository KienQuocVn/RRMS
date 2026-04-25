package com.rrms.rrms.dto.request;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.rrms.rrms.enums.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountRequest implements Serializable {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    String username;

    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    String password;

    @NotBlank(message = "Họ tên không được để trống")
    String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 11, message = "Số điện thoại phải từ 10 đến 11 số")
    String phone;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email;

    LocalDate birthday;
    Gender gender;
    String cccd;
    String avatar;
    List<String> role;
    List<String> permissions;
}
