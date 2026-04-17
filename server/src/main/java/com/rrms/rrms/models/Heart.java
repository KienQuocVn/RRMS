package com.rrms.rrms.models;

import java.util.ArrayList;
import java.util.List;
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
@Table(name = "hearts")
public class Heart {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID heartId;

    @OneToOne
    @JoinColumn(name = "username")
    private Account account;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "heart_bulletinBoard",
            joinColumns = @JoinColumn(name = "heart_id"),
            inverseJoinColumns = @JoinColumn(name = "bulletinBoard_id"))
    @Builder.Default
    private List<BulletinBoard> bulletinBoards = new ArrayList<>();
}
