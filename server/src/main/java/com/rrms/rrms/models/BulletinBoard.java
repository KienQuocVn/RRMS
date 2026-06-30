package com.rrms.rrms.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
        name = "bulletin_boards",
        indexes = {
            @Index(name = "idx_bb_username", columnList = "username"),
            @Index(name = "idx_bb_status", columnList = "status")
        })
@Builder
public class BulletinBoard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bulletinBoardId;

    @ManyToOne
    @JoinColumn(name = "username")
    private Account account;

    @Column(columnDefinition = "VARCHAR(255)")
    private String title;

    @Column(columnDefinition = "VARCHAR(255)")
    private String rentalCategory;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "DECIMAL(15, 2)")
    private BigDecimal rentPrice;

    @Column(columnDefinition = "DECIMAL(15, 2)")
    private BigDecimal promotionalRentalPrice;

    @Column(columnDefinition = "DECIMAL(15, 2)")
    private BigDecimal deposit;

    @Column(columnDefinition = "INT")
    private Integer area;

    @Column(columnDefinition = "DECIMAL(15, 2)")
    private BigDecimal electricityPrice;

    @Column(columnDefinition = "DECIMAL(15, 2)")
    private BigDecimal waterPrice;

    @Column(columnDefinition = "VARCHAR(255)")
    private String maxPerson;

    @Column(name = "move_in_date", columnDefinition = "DATE")
    private LocalDate moveInDate;

    @Column(columnDefinition = "VARCHAR(255)")
    private String openingHours;

    @Column(columnDefinition = "VARCHAR(255)")
    private String closeHours;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "DOUBLE")
    private Double longitude;

    @Column(columnDefinition = "DOUBLE")
    private Double latitude;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean status;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean isActive;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "is_hidden", columnDefinition = "BOOLEAN")
    private Boolean isHidden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motel_id", columnDefinition = "binary(16)")
    private Motel motel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", columnDefinition = "binary(16)")
    private Room room;

    @OneToMany(mappedBy = "bulletinBoard", cascade = CascadeType.MERGE, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<BulletinBoardImage> bulletinBoardImages = new LinkedHashSet<>();

    @OneToMany(mappedBy = "bulletinBoard", cascade = CascadeType.MERGE, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<BulletinBoardReviews> bulletinBoardReviews = new LinkedHashSet<>();

    @OneToMany(mappedBy = "bulletinBoard", cascade = CascadeType.MERGE, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<BulletinBoardRule> bulletinBoardRules = new LinkedHashSet<>();

    @OneToMany(mappedBy = "bulletinBoard", cascade = CascadeType.MERGE, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<BulletinBoardRentalAmenity> bulletinBoardRentalAmenities = new LinkedHashSet<>();
}
