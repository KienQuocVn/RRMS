package com.rrms.rrms.services.servicesImp;

import org.springframework.stereotype.Service;

import com.rrms.rrms.repositories.InvoiceRepository;
import com.rrms.rrms.services.IInvoiceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceService implements IInvoiceService {
    final InvoiceRepository invoiceRepository;
}
