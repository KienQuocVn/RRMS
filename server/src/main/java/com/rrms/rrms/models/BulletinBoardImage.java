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
@Table(name = "bulletin_board_images")
@JsonIgnoreProperties({"bulletinBoard", "hibernateLazyInitializer", "handler"})
@Builder
public class BulletinBoardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bulletinBoardImageId;

    @ManyToOne
    @JoinColumn(name = "bulletin_board_id")
    private BulletinBoard bulletinBoard;

    @Column(columnDefinition = "LONGTEXT")
    private String imageLink;
}
