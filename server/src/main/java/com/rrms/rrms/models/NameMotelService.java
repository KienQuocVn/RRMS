package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;

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
@Table(name = "name_motel_services")
public class NameMotelService {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "name_motel_services_id")
    private UUID nameMotelServicesId;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String typeService;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String nameService;
}
