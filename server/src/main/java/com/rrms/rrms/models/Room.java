package com.rrms.rrms.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(
        name = "rooms",
        indexes = {
            @Index(name = "idx_room_motel_id", columnList = "motel_id"),
            @Index(name = "idx_room_status", columnList = "status")
        })
@Builder
public class Room extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roomId;

    @ManyToOne
    @JoinColumn(name = "motel_id", nullable = false)
    @JsonBackReference(value = "motel-Room") // Đặt tên cho tham chiếu ngược
    private Motel motel;

    @Column(name = "room_group", columnDefinition = "NVARCHAR(255)")
    private String group;

    @Column(name = "name_room", columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private Double price;

    @Column(columnDefinition = "DECIMAL(10, 2)")
    private Double deposit;

    @Column(name = "prioritize", columnDefinition = "TEXT")
    private String prioritize;

    @Column(name = "area", columnDefinition = "INT")
    private Integer area;

    @Column(name = "status", columnDefinition = "BOOLEAN")
    private Boolean status;

    @Column(name = "finance", columnDefinition = "TEXT")
    private String finance;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "Room-Contract") // Đặt tên cho tham chiếu quản lý
    private List<Contract> contracts;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "Room-ReserveAPlace") // Đặt tên cho tham chiếu quản lý
    private List<Reserve_a_place> reserveAPlaces;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "Room-MeterReading")
    private List<MeterReading> meterReadings;
}
