-- Lưu ảnh base64 (data URL) cho tin đăng; VARCHAR(255) không đủ cho nội dung ảnh nén.
ALTER TABLE bulletin_board_images
    MODIFY COLUMN image_link LONGTEXT;
