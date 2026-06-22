CREATE TEMPORARY TABLE duplicate_room_services AS
SELECT duplicate.room_service_id AS duplicate_id,
       keepers.keep_id AS keep_id
FROM room_services duplicate
JOIN (
    SELECT room_id, service_id, MIN(room_service_id) AS keep_id
    FROM room_services
    GROUP BY room_id, service_id
    HAVING COUNT(*) > 1
) keepers
  ON duplicate.room_id = keepers.room_id
 AND duplicate.service_id = keepers.service_id
WHERE duplicate.room_service_id <> keepers.keep_id;

UPDATE detail_invoices detail
JOIN duplicate_room_services duplicate
  ON detail.room_service_id = duplicate.duplicate_id
SET detail.room_service_id = duplicate.keep_id;

DELETE room_service
FROM room_services room_service
JOIN duplicate_room_services duplicate
  ON room_service.room_service_id = duplicate.duplicate_id;

DROP TEMPORARY TABLE duplicate_room_services;

DELIMITER //

CREATE PROCEDURE add_unique_room_services_if_missing()
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = 'room_services'
          AND index_name = 'uq_room_services_room_service'
    ) THEN
        ALTER TABLE room_services
            ADD CONSTRAINT uq_room_services_room_service UNIQUE (room_id, service_id);
    END IF;
END//

DELIMITER ;

CALL add_unique_room_services_if_missing();
DROP PROCEDURE add_unique_room_services_if_missing;
