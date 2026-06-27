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
@Table(
        name = "motel_room_groups",
        indexes = {@Index(name = "idx_motel_room_group_motel_id", columnList = "motel_id")})
public class MotelRoomGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roomGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motel_id", nullable = false)
    @JsonBackReference(value = "motel-room-group")
    private Motel motel;

    @Column(name = "name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "sort_order", columnDefinition = "INT")
    private int sortOrder;
}
