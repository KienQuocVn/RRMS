-- V1__baseline.sql: Full schema baseline synchronized with Java Entities

-- 1. Master Tables
CREATE TABLE IF NOT EXISTS roles (
    role_id BINARY(16) NOT NULL,
    role_name VARCHAR(255) NULL,
    `description` TEXT NULL,
    PRIMARY KEY (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS hearts (
    heart_id BINARY(16) NOT NULL,
    username VARCHAR(255) NULL,
    PRIMARY KEY (heart_id),
    UNIQUE KEY uc_hearts_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS accounts (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    fullname VARCHAR(255) NULL,
    phone VARCHAR(200) NULL,
    email VARCHAR(255) NULL,
    avatar VARCHAR(255) NULL,
    birthday DATE NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    cccd VARCHAR(15) NULL,
    commission_rate INT NULL,
    heart_id BINARY(16) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (username),
    UNIQUE KEY uc_accounts_phone (phone),
    UNIQUE KEY uc_accounts_email (email),
    KEY idx_account_cccd (cccd),
    CONSTRAINT fk_accounts_heart FOREIGN KEY (heart_id) REFERENCES hearts (heart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auths (
    auth_id BINARY(16) NOT NULL,
    username VARCHAR(255) NULL,
    role_id BINARY(16) NULL,
    PRIMARY KEY (auth_id),
    CONSTRAINT fk_auths_username FOREIGN KEY (username) REFERENCES accounts (username),
    CONSTRAINT fk_auths_role FOREIGN KEY (role_id) REFERENCES roles (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS type_rooms (
    type_room_id BINARY(16) NOT NULL,
    name VARCHAR(50) NULL,
    PRIMARY KEY (type_room_id),
    UNIQUE KEY uc_type_rooms_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS motels (
    motel_id BINARY(16) NOT NULL,
    motel_name VARCHAR(255) NULL,
    area DOUBLE NULL,
    average_price DECIMAL(10, 2) NULL,
    address NVARCHAR(255) NULL,
    methodofcreation NVARCHAR(255) NULL,
    maxperson INT NULL,
    invoicedate INT NULL,
    paymentdeadline INT NULL,
    username VARCHAR(255) NULL,
    type_room_id BINARY(16) NOT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (motel_id),
    KEY idx_motel_username (username),
    CONSTRAINT fk_motels_username FOREIGN KEY (username) REFERENCES accounts (username),
    CONSTRAINT fk_motels_typeroom FOREIGN KEY (type_room_id) REFERENCES type_rooms (type_room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rooms (
    room_id BINARY(16) NOT NULL,
    motel_id BINARY(16) NOT NULL,
    room_group NVARCHAR(255) NULL,
    name_room NVARCHAR(255) NULL,
    price DECIMAL(10, 2) NULL,
    deposit DECIMAL(10, 2) NULL,
    prioritize TEXT NULL,
    area INT NULL,
    status BOOLEAN NULL,
    finance TEXT NULL,
    `description` TEXT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (room_id),
    KEY idx_room_motel_id (motel_id),
    KEY idx_room_status (status),
    CONSTRAINT fk_rooms_motel FOREIGN KEY (motel_id) REFERENCES motels (motel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tenant (
    tenant_id BINARY(16) NOT NULL,
    avata VARCHAR(255) NULL,
    fullname VARCHAR(255) NOT NULL,
    phone VARCHAR(12) NULL,
    CCCD VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    birthday DATE NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    address VARCHAR(255) NULL,
    job VARCHAR(255) NULL,
    license_date DATE NULL,
    place_of_license VARCHAR(255) NULL,
    front_photo VARCHAR(255) NULL,
    back_photo VARCHAR(255) NULL,
    role BOOLEAN NULL,
    relationship VARCHAR(255) NULL,
    type_of_tenant BOOLEAN NULL,
    temporary_residence BOOLEAN NULL,
    information_verify BOOLEAN NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (tenant_id),
    UNIQUE KEY idx_tenant_cccd (CCCD)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contracts (
    contract_id BINARY(16) NOT NULL,
    room_id BINARY(16) NULL,
    tenant_id BINARY(16) NULL,
    username VARCHAR(255) NULL,
    contracttemplate_id BINARY(16) NULL,
    broker_id BINARY(16) NULL,
    movein_date DATE NULL,
    lease_term TEXT NULL,
    close_contract DATE NULL,
    `description` TEXT NULL,
    debt DECIMAL(10, 2) NULL,
    price DECIMAL(10, 2) DEFAULT 0.0,
    actual_price DECIMAL(10, 2) NULL,
    deposit DECIMAL(10, 2) NULL,
    collectioncycle TEXT NULL,
    createdate DATE NULL,
    signcontract TEXT NULL,
    `language` TEXT NULL,
    count_tenant INT NULL,
    status ENUM('ACTIVE', 'ENDED', 'IATExpire', 'ReportEnd') NULL,
    reportclose_contract DATE NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (contract_id),
    KEY idx_contract_room_id (room_id),
    KEY idx_contract_username (username),
    KEY idx_contract_status (status),
    CONSTRAINT fk_contracts_room FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    CONSTRAINT fk_contracts_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT fk_contracts_account FOREIGN KEY (username) REFERENCES accounts (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
    service_id BINARY(16) NOT NULL,
    type_service VARCHAR(255) NULL,
    name_service VARCHAR(255) NULL,
    price DECIMAL(10, 2) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS room_services (
    room_service_id BINARY(16) NOT NULL,
    room_id BINARY(16) NOT NULL,
    service_id BINARY(16) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (room_service_id),
    CONSTRAINT fk_room_services_room FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    CONSTRAINT fk_room_services_service FOREIGN KEY (service_id) REFERENCES services (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
    payment_id BINARY(16) NOT NULL,
    payment_name VARCHAR(255) NULL,
    `description` TEXT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id BINARY(16) NOT NULL,
    username VARCHAR(255) NULL,
    room_id BINARY(16) NULL,
    payment_id BINARY(16) NULL,
    status VARCHAR(50) NULL,
    create_date DATE NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_invoices_account FOREIGN KEY (username) REFERENCES accounts (username),
    CONSTRAINT fk_invoices_room FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    CONSTRAINT fk_invoices_payment FOREIGN KEY (payment_id) REFERENCES payments (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Transaction` (
    transaction_id BINARY(16) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    invoice_id BINARY(16) NULL,
    payer_name VARCHAR(100) NOT NULL,
    payment_description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type BOOLEAN NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (transaction_id),
    CONSTRAINT fk_transaction_invoice FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id),
    CONSTRAINT fk_transaction_account FOREIGN KEY (username) REFERENCES accounts (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS heart_room (
    heart_id BINARY(16) NOT NULL,
    room_id BINARY(16) NOT NULL,
    CONSTRAINT fk_heart_room_heart FOREIGN KEY (heart_id) REFERENCES hearts (heart_id),
    CONSTRAINT fk_heart_room_room FOREIGN KEY (room_id) REFERENCES rooms (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Devices and others
CREATE TABLE IF NOT EXISTS devices (
    device_id BINARY(16) NOT NULL,
    device_name VARCHAR(255) NULL,
    available BIT(1) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS room_devices (
    room_device_id BINARY(16) NOT NULL,
    room_id BINARY(16) NULL,
    device_id BINARY(16) NULL,
    quantity INT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (room_device_id),
    CONSTRAINT fk_room_devices_room FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    CONSTRAINT fk_room_devices_device FOREIGN KEY (device_id) REFERENCES devices (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
