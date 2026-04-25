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
@Table(name = "search_histories")
public class Search {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID searchId;

    @ManyToOne
    @JoinColumn(name = "username")
    private Account account;

    @Column(columnDefinition = "TEXT")
    private String content;
}
