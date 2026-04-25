package com.rrms.rrms.models;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "invalidated_tokens")
public class InvalidatedToken {
    @Id
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String id;

    private Date expiryTime;
}
