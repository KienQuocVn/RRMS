package com.rrms.rrms.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.rrms.rrms.configs.CustomerEnvironment;
import com.rrms.rrms.configs.MoMoEndpoint;
import com.rrms.rrms.configs.PartnerInfo;
import com.rrms.rrms.configs.VNPayConfig;
import com.rrms.rrms.dto.request.StripeRequest;
import com.rrms.rrms.dto.response.PaymentResponse;
import com.rrms.rrms.dto.response.StripeResponse;
import com.rrms.rrms.dto.response.VnPayRedirectResponse;
import com.rrms.rrms.enums.RequestType;
import com.rrms.rrms.services.IPaymentService;
import com.rrms.rrms.services.servicesImp.CreateOrderMoMo;
import com.rrms.rrms.utils.LogUtils;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Payment Controller", description = "Payment gateway integrations: PayPal, VNPay, MoMo, Stripe")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Value("${stripe.api.publicKey}")
    String publicKey;

    @Value("${vnpay.api.secretKey}")
    String secretKey;

    @Value("${momo.partnerCode}")
    String momoPartnerCode;

    @Value("${momo.accessKey}")
    String momoAccessKey;

    @Value("${momo.secretKey}")
    String momoSecretKey;

    @Value("${momo.endpoint}")
    String momoEndpoint;

    @Value("${momo.notifyUrl}")
    String momoNotifyUrl;

    @Value("${momo.returnUrl}")
    String momoReturnUrl;

    @Value("${paypal.successUrl}")
    String paypalSuccessUrl;

    @Value("${paypal.cancelUrl}")
    String paypalCancelUrl;

    final IPaymentService paymentService;
    final VNPayConfig vnpayConfig;

    @Operation(summary = "Create PayPal payment")
    @PostMapping({"/payment-paypal", "/paypal/create"})
    public Map<String, String> payment(
            @RequestParam("totalPrice") double totalPrice, @RequestParam("userName") String userName) {
        Map<String, String> response = new HashMap<>();
        try {
            Payment payment = paymentService.createPayment(
                    totalPrice, "USD", "PAYPAL", "sale", userName + " Thanh toán", paypalCancelUrl, paypalSuccessUrl);
            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    response.put("redirectUrl", links.getHref());
                    return response;
                }
            }
        } catch (PayPalRESTException e) {
            throw new RuntimeException(e);
        }
        response.put("redirectUrl", "payment/paypal/error");
        return response;
    }

    @GetMapping("/paypal/cancel")
    @ResponseBody
    public String cancel() {
        return "cancel";
    }

    @GetMapping("/paypal/error")
    @ResponseBody
    @PermitAll
    public String error() {
        return "error";
    }

    @GetMapping("/paypal/success")
    @ResponseBody
    @PermitAll
    public String success() {
        return "success";
    }

    @Operation(summary = "Create VNPay payment")
    @PostMapping({"/create_payment", "/vnpay/create"})
    @PermitAll
    public ResponseEntity<?> getPay(@RequestBody Map<String, Object> requestData, HttpServletRequest request)
            throws UnsupportedEncodingException {
        HttpSession session = request.getSession();
        String username = (String) requestData.get("userName");
        session.setAttribute("userName", username);

        String vnp_Version = vnpayConfig.getVnp_Version();
        String vnp_Command = vnpayConfig.getVnp_Command();
        String orderType = "other";
        double totalPrice = Double.valueOf(requestData.get("totalPrice").toString());
        int amount = (int) (totalPrice * 100);
        String bankCode = (String) requestData.get("bankCode");
        if (bankCode == null) bankCode = "NCB";

        String vnp_TxnRef = VNPayConfig.getRandomNumber(6);
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);

        String vnp_TmnCode = vnpayConfig.getVnp_TmnCode();
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getVnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName)
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        String paymentUrl = vnpayConfig.getVnp_PayUrl() + "?" + queryUrl;

        VnPayRedirectResponse vnPayRedirectResponse =
                VnPayRedirectResponse.builder().paymentUrl(paymentUrl).build();
        return ResponseEntity.status(HttpStatus.OK).body(vnPayRedirectResponse);
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<Void> paymentCallback(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        boolean isValidSignature = vnpayConfig.verifySignature(fields, vnp_SecureHash);

        if (!isValidSignature) {
            log.error("VNPay payment verification failed: Invalid Signature");
            return ResponseEntity.status(302)
                    .header("Location", "/payment/paymentFailed?error=invalid_signature")
                    .build();
        }

        String status = request.getParameter("vnp_ResponseCode");
        if ("00".equals(status)) {
            return ResponseEntity.status(302)
                    .header("Location", "/payment/paymentSuccess")
                    .build();
        } else {
            return ResponseEntity.status(302)
                    .header("Location", "/payment/paymentFailed")
                    .build();
        }
    }

    @RequestMapping("/paymentSuccess")
    @PermitAll
    public String paymentSuccess() {
        return "paymentVNPaySuccess";
    }

    @GetMapping("/paymentFailed")
    @PermitAll
    public String paymentFailed() {
        return "paymentVNPayFailed";
    }

    @Operation(summary = "Create MoMo payment")
    @PostMapping({"/payMoMo", "/momo/create"})
    public PaymentResponse paymentMoMo(@RequestBody Map<String, Object> requestData, HttpServletRequest request)
            throws Exception {
        HttpSession session = request.getSession();
        String username = (String) requestData.get("username");
        session.setAttribute("username", username);
        LogUtils.init();
        String requestId = String.valueOf(System.currentTimeMillis());
        String orderId = VNPayConfig.getRandomNumber(6);
        double totalPrice = Double.valueOf(requestData.get("totalPrice").toString());
        long amount = (long) (totalPrice * 100);
        String orderInfo = "Pay With MoMo";
        String returnUrl = momoReturnUrl;
        String notifyURL = momoNotifyUrl;

        MoMoEndpoint momoEndpointConfig = new MoMoEndpoint(momoEndpoint, "/create");
        PartnerInfo momoPartnerInfo = new PartnerInfo(momoPartnerCode, momoAccessKey, momoSecretKey);
        CustomerEnvironment environment =
                new CustomerEnvironment(momoEndpointConfig, momoPartnerInfo, CustomerEnvironment.EnvTarget.DEV);
        PaymentResponse captureWalletMoMoResponse = CreateOrderMoMo.process(
                environment,
                orderId,
                requestId,
                Long.toString(amount / 100),
                orderInfo,
                returnUrl,
                notifyURL,
                "",
                RequestType.PAY_WITH_ATM,
                Boolean.TRUE);
        return captureWalletMoMoResponse;
    }

    @RequestMapping("/paymentMoMoSuccess")
    @PermitAll
    public String paymentMoMoSuccess() {
        return "paymentMomoSuccess";
    }

    @Operation(summary = "Create Stripe payment intent")
    @PermitAll
    @PostMapping({"/payment-stripe", "/stripe/create"})
    @ResponseBody
    public ResponseEntity<StripeResponse> createPaymentIntent(@RequestBody @Valid StripeRequest request)
            throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount() * 100L)
                .putMetadata("productName", request.getProductName())
                .setCurrency("usd")
                .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        StripeResponse responseDto = new StripeResponse(intent.getId(), intent.getClientSecret());
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "Get all payment records")
    @GetMapping({"/list_payment", "/list"})
    public ResponseEntity<List<com.rrms.rrms.models.Payment>> getAllPayments() {
        List<com.rrms.rrms.models.Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}
