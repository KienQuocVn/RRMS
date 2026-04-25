package com.rrms.rrms.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.BulletinBoard;
import com.rrms.rrms.models.BulletinBoardRentalAmenity;

public interface BulletinBoardRentalAmenityRepository extends JpaRepository<BulletinBoardRentalAmenity, UUID> {
    void deleteAllByBulletinBoard(BulletinBoard bulletinBoard);
}
