package com.rrms.rrms.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import com.rrms.rrms.models.TemporaryR_contract;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemporaryContractResponse {
    UUID temporaryContractId;
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

    // Constructor để ánh xạ dữ liệu từ TemporaryR_contract
    public TemporaryContractResponse(TemporaryR_contract contract) {
        this.temporaryContractId = contract.getTemporaryrcontractId();
        this.householdHead = contract.getHouseholdhead();
        this.representativeName = contract.getRepresentativename();
        this.phone = contract.getPhone();
        this.birth = contract.getBirth();
        this.permanentAddress = contract.getPermanentaddress();
        this.job = contract.getJob();
        this.identifier = contract.getIdentifier();
        this.placeOfIssue = contract.getPlaceofissue();
        this.dateOfIssue = contract.getDateofissue();
        this.motelId =
                contract.getMotel() != null ? contract.getMotel().getMotelId().toString() : null;
        this.tenantUsername =
                contract.getTenant() != null ? contract.getTenant().getUsername() : null;
    }
}
