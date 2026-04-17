package com.rrms.rrms.models;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "temporaryrcontracts")
public class TemporaryR_contract extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID temporaryrcontractId;

    @ManyToOne
    @JoinColumn(name = "motel_id")
    private Motel motel;

    // chu nha
    @ManyToOne
    @JoinColumn(name = "username_tenant")
    private Account tenant;

    @Column(columnDefinition = "TEXT")
    private String householdhead;

    @Column(columnDefinition = "TEXT")
    private String representativename;

    @Column(columnDefinition = "TEXT")
    private String phone;

    @Column(columnDefinition = "DATE")
    private LocalDate birth;

    @Column(columnDefinition = "TEXT")
    private String permanentaddress;

    @Column(columnDefinition = "TEXT")
    private String job;

    @Column(columnDefinition = "TEXT")
    private String identifier;

    @Column(columnDefinition = "TEXT")
    private String placeofissue;

    @Column(columnDefinition = "DATE")
    private LocalDate dateofissue;
}
