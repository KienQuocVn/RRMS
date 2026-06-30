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
@Table(name = "rental_amenities")
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RentalAmenities {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID RentalAmenitiesId;

    @Column(columnDefinition = "VARCHAR(255)", unique = true)
    private String name;
}
