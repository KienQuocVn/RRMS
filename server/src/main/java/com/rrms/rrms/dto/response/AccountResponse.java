package com.rrms.rrms.dto.response;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.rrms.rrms.enums.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse implements Serializable {
    String username;
    String password;
    String fullName;
    String phone;
    String email;
    LocalDate birthday;
    Gender gender;
    String cccd;
    String address;
    String job;
    String placeOfIssue;
    LocalDate dateOfIssue;
    String avatar;
    List<String> role;
    List<String> permissions;
    /** Ngày tạo tài khoản - kế thừa từ BaseEntity */
    LocalDateTime createdAt;
}
