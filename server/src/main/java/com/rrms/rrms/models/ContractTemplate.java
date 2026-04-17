package com.rrms.rrms.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contracttemplates")
public class ContractTemplate extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID contracttemplateId;

    @ManyToOne
    @JoinColumn(name = "motel_id")
    @JsonBackReference(value = "motel-ContractTemplate") // Đặt tên cho tham chiếu ngược
    private Motel motel;

    @Column(columnDefinition = "TEXT")
    private String namecontract;

    @Column(columnDefinition = "TEXT")
    private String templatename;

    @Column(columnDefinition = "INT")
    private int sortorder;

    @Column(columnDefinition = "TEXT") // Để lưu nội dung lớn
    private String content;

    @OneToMany(mappedBy = "contractTemplate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "ContractTemplate-Contract") // Đặt tên cho tham chiếu quản lý
    private List<Contract> contracts;
}
