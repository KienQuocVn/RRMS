ALTER TABLE bulletin_boards
    ADD COLUMN rejection_reason TEXT NULL,
    ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;
