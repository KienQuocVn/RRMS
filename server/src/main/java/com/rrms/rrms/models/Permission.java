package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
@Table(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID permissionId;

    @Column(columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
