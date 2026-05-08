package com.rrms.rrms.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.BulletinBoard;

public interface BulletinBoardRepository extends JpaRepository<BulletinBoard, UUID> {
    List<BulletinBoard> findByAccount(Account account);

    @Query(
            """
			SELECT r
			FROM BulletinBoard r
			JOIN r.account m
			WHERE lower(r.address) like lower(concat('%', :address, '%'))
			OR lower(r.title) like lower(concat('%', :address, '%'))
			OR lower(r.description) like lower(concat('%', :address, '%'))
			""")
    List<BulletinBoard> findByAddress(String address);

    //    List<BulletinBoard> findAllByIsActive(Boolean isActive);

    BulletinBoard findByBulletinBoardId(UUID id);

    @Query("SELECT r FROM BulletinBoard r WHERE r.isActive = :isActive")
    List<BulletinBoard> findAllByIsActive(@Param("isActive") Boolean isActive);

    @Query("SELECT b FROM BulletinBoard b WHERE b.isActive = true ORDER BY b.rentPrice ASC")
    List<BulletinBoard> findAllActiveOrderByPriceAsc();

    @Query("SELECT b FROM BulletinBoard b WHERE b.isActive = true ORDER BY b.rentPrice DESC")
    List<BulletinBoard> findAllActiveOrderByPriceDesc();

    @Query(
            """
			SELECT b
			FROM BulletinBoard b
			WHERE b.isActive = true
			AND (
				:query IS NULL
				OR lower(b.address) LIKE lower(concat('%', :query, '%'))
				OR lower(b.title) LIKE lower(concat('%', :query, '%'))
				OR lower(b.description) LIKE lower(concat('%', :query, '%'))
			)
			AND (
				:district IS NULL
				OR lower(b.address) LIKE lower(concat('%', :district, '%'))
			)
			AND (:minPrice IS NULL OR b.rentPrice >= :minPrice)
			AND (:maxPrice IS NULL OR b.rentPrice <= :maxPrice)
			AND (:minArea IS NULL OR b.area >= :minArea)
			AND (:maxArea IS NULL OR b.area <= :maxArea)
			ORDER BY b.createdAt DESC
			""")
    List<BulletinBoard> searchActiveBulletinBoards(
            @Param("query") String query,
            @Param("district") String district,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minArea") Integer minArea,
            @Param("maxArea") Integer maxArea);
}
