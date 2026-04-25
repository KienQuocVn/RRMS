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
@Table(name = "bulletin_board_rental_amenities")
@JsonIgnoreProperties({"bulletinBoard"})
@Builder
public class BulletinBoardRentalAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bulletInRentalAId;

    @ManyToOne
    @JoinColumn(name = "rental_amenities_id")
    private RentalAmenities rentalAmenities;

    @ManyToOne
    @JoinColumn(name = "bulletin_boards_id")
    private BulletinBoard bulletinBoard;
}
