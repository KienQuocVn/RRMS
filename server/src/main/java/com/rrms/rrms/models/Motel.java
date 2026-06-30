package com.rrms.rrms.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "motels",
        indexes = {@Index(name = "idx_motel_username", columnList = "username")})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Motel extends BaseEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    private UUID motelId;

    @Column(columnDefinition = "VARCHAR(255)")
    private String motelName;

    @Column(columnDefinition = "DECIMAL(8, 2)")
    private Double area;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private Long averagePrice;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(columnDefinition = "DECIMAL(10, 7)")
    private Double latitude;

    @Column(columnDefinition = "DECIMAL(10, 7)")
    private Double longitude;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String methodofcreation;

    @Column(columnDefinition = "INT")
    private int maxperson;

    @Column(columnDefinition = "INT")
    private int invoicedate;

    @Column(columnDefinition = "INT")
    private int paymentdeadline;

    @ManyToOne
    @JoinColumn(name = "username")
    @JsonBackReference(value = "account-motel") // Đặt tên cho tham chiếu ngược
    private Account account;

    @ManyToOne
    @JoinColumn(name = "type_room_id", nullable = false)
    private TypeRoom typeRoom;

    // de xoa motell xoa luon dich vu
    @OneToMany(mappedBy = "motel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "motel-service") // Đặt tên cho tham chiếu quản lý
    private List<MotelService> motelServices;

    @OneToMany(mappedBy = "motel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "motel-Room") // Đặt tên cho tham chiếu quản lý
    private List<Room> rooms;

    @OneToMany(mappedBy = "motel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "motel-ContractTemplate") // Đặt tên cho tham chiếu quản lý
    private List<ContractTemplate> contractTemplates;

    public Motel(UUID motelId, String motelName, String motelAddress) {}
}
