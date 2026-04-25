package com.rrms.rrms.dto.request;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemporaryContractRequest {
    String householdHead;
    String representativeName;
    String phone;
    LocalDate birth;
    String permanentAddress;
    String job;
    String identifier;
    String placeOfIssue;
    LocalDate dateOfIssue;
    String motelId; // ID của Motel
    String tenantUsername; // Tên người dùng của Tenant (Account)
}
