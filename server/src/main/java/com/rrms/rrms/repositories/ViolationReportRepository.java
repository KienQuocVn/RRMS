package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rrms.rrms.models.ViolationReport;

public interface ViolationReportRepository extends JpaRepository<ViolationReport, UUID> {

    @EntityGraph(
            attributePaths = {
                "reporter",
                "bulletinBoard",
                "bulletinBoard.account",
                "bulletinBoard.bulletinBoardImages",
                "reportedAccount",
                "review",
                "review.bulletinBoard",
                "review.account"
            })
    @Query("SELECT v FROM ViolationReport v WHERE v.isDeleted = false ORDER BY v.createdAt DESC")
    List<ViolationReport> findAllActiveOrderByCreatedAtDesc();

    @EntityGraph(
            attributePaths = {
                "reporter",
                "bulletinBoard",
                "bulletinBoard.account",
                "bulletinBoard.bulletinBoardImages",
                "reportedAccount",
                "review",
                "review.bulletinBoard",
                "review.account"
            })
    List<ViolationReport> findByBulletinBoard_BulletinBoardId(UUID bulletinBoardId);

    @EntityGraph(attributePaths = {"reporter", "bulletinBoard", "reportedAccount", "review"})
    List<ViolationReport> findByReportedAccount_Username(String username);

    @EntityGraph(attributePaths = {"reporter", "bulletinBoard", "reportedAccount", "review"})
    List<ViolationReport> findByReview_BulletinBoardReviewsId(UUID reviewId);
}
