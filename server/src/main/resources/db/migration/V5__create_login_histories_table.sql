-- V5__create_login_histories_table.sql
-- Bảng lưu lịch sử đăng nhập thiết bị của người dùng

CREATE TABLE IF NOT EXISTS login_histories (
    id            BINARY(16)   NOT NULL,
    username      VARCHAR(255) NOT NULL,
    ip_address    VARCHAR(45)  NULL COMMENT 'IP địa chỉ đăng nhập (IPv4/IPv6)',
    user_agent    TEXT         NULL COMMENT 'User-Agent header đầy đủ',
    device_type   VARCHAR(20)  NULL COMMENT 'WEB | MOBILE | TABLET',
    device_name   VARCHAR(255) NULL COMMENT 'Tên thiết bị thân thiện (Chrome on Windows 10)',
    os_name       VARCHAR(100) NULL COMMENT 'Hệ điều hành',
    os_version    VARCHAR(50)  NULL COMMENT 'Phiên bản hệ điều hành',
    browser_name  VARCHAR(100) NULL COMMENT 'Trình duyệt hoặc app',
    browser_version VARCHAR(50) NULL COMMENT 'Phiên bản trình duyệt',
    login_at      DATETIME(6)  NOT NULL COMMENT 'Thời điểm đăng nhập',
    status        VARCHAR(20)  NULL DEFAULT 'SUCCESS' COMMENT 'SUCCESS | FAILED',

    PRIMARY KEY (id),
    INDEX idx_login_history_username (username),
    INDEX idx_login_history_login_at (login_at),
    CONSTRAINT fk_login_history_account
        FOREIGN KEY (username) REFERENCES accounts (username)
        ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Lịch sử đăng nhập thiết bị';
