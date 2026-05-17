package com.rrms.rrms.models;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.rrms.rrms.enums.Gender;

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
        name = "accounts",
        indexes = {
            @Index(name = "idx_account_email", columnList = "email", unique = true),
            @Index(name = "idx_account_phone", columnList = "phone", unique = true),
            @Index(name = "idx_account_cccd", columnList = "cccd")
        })
public class Account extends BaseEntity {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "bulletin_board_id"))
    @Builder.Default
    private List<BulletinBoard> favoriteBulletinBoards = new java.util.ArrayList<>();

    @Id
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String username;

    @Column(columnDefinition = "VARCHAR(255)")
    private String password;

    @Column(name = "fullname", columnDefinition = "VARCHAR(255)")
    private String fullName;

    @Column(columnDefinition = "VARCHAR(200)", unique = true)
    private String phone;

    @Column(columnDefinition = "VARCHAR(255)", unique = true) // unique = true để trường này là duy nhất
    private String email;

    @Column(columnDefinition = "VARCHAR(255)")
    private String avatar;

    @Column(columnDefinition = "DATE")
    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('MALE', 'FEMALE','OTHER')")
    private Gender gender;

    @Column(columnDefinition = "VARCHAR(15)")
    private String cccd;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "VARCHAR(255)")
    private String job;

    @Column(name = "place_of_issue", columnDefinition = "VARCHAR(255)")
    private String placeOfIssue;

    @Column(name = "date_of_issue", columnDefinition = "DATE")
    private LocalDate dateOfIssue;

    @Column(columnDefinition = "INT")
    private Integer commissionRate;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonManagedReference(value = "Auth-Acc") // Đặt tên cho tham chiếu quản lý
    List<Auth> authorities;

    public List<String> getRoles() {
        return authorities.stream()
                .map(auth -> auth.getRole().getRoleName().name())
                .collect(Collectors.toList());
    }

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "Account-Contract") // Đặt tên cho tham chiếu quản lý
    private List<Contract> contracts;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "account-motel") // Đặt tên cho tham chiếu quản lý
    private List<Motel> motels;
}
