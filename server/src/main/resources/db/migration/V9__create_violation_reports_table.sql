CREATE TABLE violation_reports (
    violation_report_id binary(16) NOT NULL,
    reporter_username VARCHAR(255) NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    bulletin_board_id binary(16) NULL,
    reported_username VARCHAR(255) NULL,
    review_id binary(16) NULL,
    reason VARCHAR(255) NOT NULL,
    content TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    resolution_action VARCHAR(50) NULL,
    admin_note TEXT NULL,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (violation_report_id),
    CONSTRAINT fk_vr_reporter FOREIGN KEY (reporter_username) REFERENCES accounts (username),
    CONSTRAINT fk_vr_bulletin_board FOREIGN KEY (bulletin_board_id) REFERENCES bulletin_boards (bulletin_board_id),
    CONSTRAINT fk_vr_reported_account FOREIGN KEY (reported_username) REFERENCES accounts (username),
    CONSTRAINT fk_vr_review FOREIGN KEY (review_id) REFERENCES bulletin_board_reviews (bulletin_board_reviews_id)
) engine=InnoDB;

CREATE INDEX idx_vr_status ON violation_reports (status);
CREATE INDEX idx_vr_subject_type ON violation_reports (subject_type);
CREATE INDEX idx_vr_bulletin_board ON violation_reports (bulletin_board_id);
CREATE INDEX idx_vr_reported_username ON violation_reports (reported_username);
CREATE INDEX idx_vr_review ON violation_reports (review_id);
