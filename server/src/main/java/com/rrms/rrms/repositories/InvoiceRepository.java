package com.rrms.rrms.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rrms.rrms.models.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByContractContractId(UUID contractId);

    @Query(
            value = "SELECT i.invoiceId FROM Invoice i "
                    + "JOIN i.contract c "
                    + "JOIN c.room r "
                    + "JOIN r.motel m "
                    + "WHERE m.motelId = :motelId",
            countQuery = "SELECT COUNT(i) FROM Invoice i "
                    + "JOIN i.contract c "
                    + "JOIN c.room r "
                    + "JOIN r.motel m "
                    + "WHERE m.motelId = :motelId")
    Page<UUID> findInvoiceIdsByMotelId(@Param("motelId") UUID motelId, Pageable pageable);

    @EntityGraph(
            attributePaths = {
                "contract",
                "contract.room",
                "detailInvoices",
                "detailInvoices.roomService",
                "detailInvoices.roomService.service",
                "detailInvoices.roomDevice",
                "detailInvoices.roomDevice.motelDevice",
                "additionItems",
                "transactions"
            })
    @Query("SELECT DISTINCT i FROM Invoice i WHERE i.invoiceId IN :invoiceIds")
    List<Invoice> findDetailedByInvoiceIdIn(@Param("invoiceIds") Collection<UUID> invoiceIds);

    @EntityGraph(
            attributePaths = {
                "contract",
                "contract.room",
                "detailInvoices",
                "detailInvoices.roomService",
                "detailInvoices.roomService.service",
                "detailInvoices.roomDevice",
                "detailInvoices.roomDevice.motelDevice",
                "additionItems",
                "transactions"
            })
    @Query("SELECT i FROM Invoice i WHERE i.invoiceId = :invoiceId")
    Optional<Invoice> findDetailedByInvoiceId(@Param("invoiceId") UUID invoiceId);
}
