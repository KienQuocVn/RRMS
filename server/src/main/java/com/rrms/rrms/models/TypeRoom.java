package com.rrms.rrms.models;

import java.util.UUID;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "type_rooms")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TypeRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID typeRoomId;

    @Column(columnDefinition = "VARCHAR(50)", unique = true)
    private String name;
}
