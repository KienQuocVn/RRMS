package com.rrms.rrms.dto.request;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

import com.rrms.rrms.enums.ContractStatus;

import lombok.Data;

@Data
public class ContractRequest {

    private UUID roomId; // ID of the room
    private UUID tenantId; // ID of the tenant
    private String username; // Landlord's username
    private UUID contractTemplateId; // ID of the contract template
    private UUID brokerId; // Optional broker ID
    private Date moveInDate; // Move-in date
    private String leaseTerm; // Lease term (in months or years)
    private Date closeContract; // Contract end date
    private String description; // Description of the contract
    private Double debt; // Debt amount
    private Double price; // Price of the contract
    private Double actualPrice; // Actual negotiated price
    private Double deposit; // Deposit amount
    private String collectionCycle; // Collection cycle (e.g., monthly, quarterly)
    private LocalDate createDate; // Contract creation date
    private String signContract; // Sign contract status
    private String language; // Language of the contract
    private Integer countTenant; // Number of tenants
    private ContractStatus status;
    private Date reportCloseContract; // New field from model
}
