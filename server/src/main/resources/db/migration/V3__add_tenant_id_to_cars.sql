ALTER TABLE cars
ADD COLUMN tenant_id binary(16) DEFAULT NULL,
ADD CONSTRAINT fk_car_tenant
FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id);
