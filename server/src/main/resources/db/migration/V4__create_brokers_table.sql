-- Entity: com.rrms.rrms.models.Broker @Table(name = "brokers")
-- Referenced by: Contract.broker (@JoinColumn broker_id)

CREATE TABLE IF NOT EXISTS brokers (
    broker_id BINARY(16) NOT NULL,
    name VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    motel_id BINARY(16) NULL,
    commission_rate INT NOT NULL DEFAULT 0,
    PRIMARY KEY (broker_id),
    KEY idx_brokers_motel_id (motel_id),
    CONSTRAINT fk_brokers_motel FOREIGN KEY (motel_id) REFERENCES motels (motel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
