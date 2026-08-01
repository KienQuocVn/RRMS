package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Table(name = "residence_templates")
public class ResidenceTemplate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID residenceTemplateId;

    @ManyToOne
    @JoinColumn(name = "motel_id")
    @JsonBackReference(value = "motel-ResidenceTemplate")
    private Motel motel;

    @Column(columnDefinition = "TEXT")
    private String templatename;

    @Column(columnDefinition = "INT")
    private int sortorder;

    @Column(columnDefinition = "TEXT")
    private String content;
}
