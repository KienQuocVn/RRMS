package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rrms.rrms.dto.response.PaymentMethodResponse;
import com.rrms.rrms.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @Query(
            """
			select new com.rrms.rrms.dto.response.PaymentMethodResponse(
				p.paymentId,
				p.paymentName,
				p.description,
				p.paymentDate
			)
			from Payment p
			where p.isDeleted = false
			order by p.paymentName asc
			""")
    List<PaymentMethodResponse> findAllPaymentMethods();
}
