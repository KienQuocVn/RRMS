ALTER TABLE transaction
    ADD COLUMN invoice_id BINARY(16) NULL AFTER payment_id;

ALTER TABLE transaction
    ADD KEY idx_transaction_invoice_id (invoice_id);

ALTER TABLE transaction
    ADD CONSTRAINT fk_transaction_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id);
