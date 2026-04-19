ALTER TABLE contracts
    ADD COLUMN actual_price DECIMAL(10, 2) NULL AFTER price;

CREATE TABLE IF NOT EXISTS contract_occupants (
    contract_occupant_id BINARY(16) NOT NULL,
    contract_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    move_in_date DATE NULL,
    move_out_date DATE NULL,
    is_active BOOLEAN NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (contract_occupant_id),
    KEY idx_occupant_contract_id (contract_id),
    KEY idx_occupant_tenant_id (tenant_id),
    CONSTRAINT fk_contract_occupants_contract
        FOREIGN KEY (contract_id) REFERENCES contracts (contract_id),
    CONSTRAINT fk_contract_occupants_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS contract_device_handovers (
    handover_id BINARY(16) NOT NULL,
    contract_id BINARY(16) NOT NULL,
    device_id BINARY(16) NOT NULL,
    quantity INT NULL,
    condition_on_move_in VARCHAR(255) NULL,
    condition_on_move_out VARCHAR(255) NULL,
    damage_fee DECIMAL(10, 2) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (handover_id),
    KEY idx_handover_contract_id (contract_id),
    KEY idx_handover_device_id (device_id),
    CONSTRAINT fk_contract_device_handovers_contract
        FOREIGN KEY (contract_id) REFERENCES contracts (contract_id),
    CONSTRAINT fk_contract_device_handovers_device
        FOREIGN KEY (device_id) REFERENCES devices (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS meter_readings (
    meter_reading_id BINARY(16) NOT NULL,
    room_id BINARY(16) NOT NULL,
    service_id BINARY(16) NOT NULL,
    old_index DOUBLE NULL,
    new_index DOUBLE NULL,
    usage_amount DOUBLE NULL,
    reading_date DATE NULL,
    image_url VARCHAR(255) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (meter_reading_id),
    KEY idx_meter_room_id (room_id),
    KEY idx_meter_service_id (service_id),
    CONSTRAINT fk_meter_readings_room
        FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    CONSTRAINT fk_meter_readings_service
        FOREIGN KEY (service_id) REFERENCES services (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
