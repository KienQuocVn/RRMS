package com.rrms.rrms.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.models.Account;

public interface AccountRepository extends JpaRepository<Account, String> {
    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    Optional<Account> findByUsername(String username);

    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    @Query("SELECT a FROM Account a JOIN a.authorities auth WHERE auth.role.roleName = :roleName")
    List<Account> findAllByAuthorities_Role_RoleName(@Param("roleName") Roles roleName);

    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    @Query("SELECT a FROM Account a JOIN a.authorities auth WHERE auth.role.roleName = :roleName")
    Page<Account> findAllByAuthorities_Role_RoleName(@Param("roleName") Roles roleName, Pageable pageable);

    Optional<Account> findByPhone(String phone);

    Optional<Account> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);

    boolean existsAccountByEmail(String email);

    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    @Query("SELECT a FROM Account a WHERE "
            + "(LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.fullname) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.cccd) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Account> searchAccounts(@Param("search") String search);

    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    @Query("SELECT a FROM Account a WHERE "
            + "(LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.fullname) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR "
            + "LOWER(a.cccd) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Account> searchAccounts(@Param("search") String search, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    List<Account> findAll();

    @Override
    @EntityGraph(attributePaths = {"authorities", "authorities.role", "authorities.role.permissions"})
    Page<Account> findAll(Pageable pageable);

    @Query(
            value = "SELECT COUNT(*) FROM Accounts a LEFT JOIN Auths au ON a.username = au.username "
                    + "WHERE au.role_id IS NULL OR au.role_id != (SELECT role_id FROM Roles WHERE role_name = 'admin')",
            nativeQuery = true)
    Long countNonAdminAccounts();

    @Query("SELECT a FROM Account a WHERE a.createdAt >= :startDate AND a.createdAt < :endDate")
    List<Account> findAccountsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(a) FROM Account a WHERE YEAR(a.createdAt) = ?1 AND MONTH(a.createdAt) = ?2")
    long countAccountsCreatedByMonth(int year, int month);

    @Query(
            "SELECT a FROM Account a JOIN a.authorities auth WHERE auth.role.roleName = 'HOST' AND a.createdAt >= :startDate")
    List<Account> findRecentHosts(@Param("startDate") LocalDateTime startDate);
}
