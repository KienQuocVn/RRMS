ALTER TABLE bulletin_boards ADD COLUMN motel_id binary(16) NULL;
ALTER TABLE bulletin_boards ADD COLUMN room_id binary(16) NULL;

ALTER TABLE bulletin_boards ADD CONSTRAINT fk_bb_motel FOREIGN KEY (motel_id) REFERENCES motels (motel_id);
ALTER TABLE bulletin_boards ADD CONSTRAINT fk_bb_room FOREIGN KEY (room_id) REFERENCES rooms (room_id);
