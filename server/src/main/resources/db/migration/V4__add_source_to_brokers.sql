DELIMITER //

CREATE PROCEDURE add_source_to_brokers_if_missing()
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'brokers'
          AND column_name = 'source'
    ) THEN
        ALTER TABLE brokers ADD COLUMN source VARCHAR(255);
    END IF;
END//

DELIMITER ;

CALL add_source_to_brokers_if_missing();
DROP PROCEDURE add_source_to_brokers_if_missing;
