package com.rrms.rrms.services;

import java.util.List;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.rrms.rrms.dto.response.PaymentMethodResponse;

/**
 * Service interface for Payment Gateway operations.
 * Supports PayPal, VNPay, MoMo, and Stripe integrations.
 */
public interface IPaymentService {
    Payment createPayment(
            Double total,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl)
            throws PayPalRESTException;

    Payment executePayment(String paymentId, String payerId) throws PayPalRESTException;

    List<PaymentMethodResponse> getAllPayments();
}
