-- V1__baseline.sql: Consolidated Schema Baseline (Sprints 1, 2, 3)

create table accounts (birthday DATE, commission_rate INT, is_deleted BOOLEAN DEFAULT FALSE not null, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), avatar VARCHAR(255), cccd VARCHAR(15), email VARCHAR(255), fullname VARCHAR(255), password VARCHAR(255), phone VARCHAR(200), username VARCHAR(255) not null, gender ENUM('MALE', 'FEMALE','OTHER'), primary key (username)) engine=InnoDB;
create table auths (auth_id binary(16) not null, role_id binary(16), username VARCHAR(255), primary key (auth_id)) engine=InnoDB;
create table brokers (commission_rate integer not null, broker_id binary(16) not null, motel_id binary(16), name varchar(255), phone varchar(255), primary key (broker_id)) engine=InnoDB;
create table bulletin_board_images (bulletin_board_id binary(16), bulletin_board_image_id binary(16) not null, image_link VARCHAR(255), primary key (bulletin_board_image_id)) engine=InnoDB;
create table bulletin_board_rental_amenities (bullet_in_rentalaid binary(16) not null, bulletin_boards_id binary(16), rental_amenities_id binary(16), primary key (bullet_in_rentalaid)) engine=InnoDB;
create table bulletin_board_reviews (rating Integer, bulletin_board_id binary(16), bulletin_board_reviews_id binary(16) not null, account_id VARCHAR(255), content TEXT, primary key (bulletin_board_reviews_id)) engine=InnoDB;
create table bulletin_board_rules (bulletin_board_id binary(16), bulletin_board_rule_id binary(16) not null, rule_rule_id binary(16), primary key (bulletin_board_rule_id)) engine=InnoDB;
create table bulletin_boards (area INT, deposit DECIMAL(15, 2), electricity_price DECIMAL(15, 2), is_active BOOLEAN, is_deleted BOOLEAN DEFAULT FALSE not null, latitude DOUBLE, longitude DOUBLE, promotional_rental_price DECIMAL(15, 2), rent_price DECIMAL(15, 2), status BOOLEAN, water_price DECIMAL(15, 2), created_at datetime(6), created_date Date, deleted_at datetime(6), move_in_date Date, updated_at datetime(6), bulletin_board_id binary(16) not null, address TEXT, close_hours VARCHAR(255), description TEXT, max_person VARCHAR(255), opening_hours VARCHAR(255), rental_category VARCHAR(255), title VARCHAR(255), username VARCHAR(255), primary key (bulletin_board_id)) engine=InnoDB;
create table cars (car_id binary(16) not null, room_id binary(16), image TEXT, name TEXT, number TEXT, primary key (car_id)) engine=InnoDB;
create table contract_device_handovers (damage_fee DECIMAL(10, 2), is_deleted BOOLEAN DEFAULT FALSE not null, quantity INT, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), contract_id binary(16) not null, device_id binary(16) not null, handover_id binary(16) not null, condition_on_move_in NVARCHAR(255), condition_on_move_out NVARCHAR(255), primary key (handover_id)) engine=InnoDB;
create table contract_devices (quantity INT, contract_device_id binary(16) not null, contract_id binary(16), motel_device_id binary(16), primary key (contract_device_id)) engine=InnoDB;
create table contract_occupants (is_active BOOLEAN, is_deleted BOOLEAN DEFAULT FALSE not null, move_in_date DATE, move_out_date DATE, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), contract_id binary(16) not null, contract_occupant_id binary(16) not null, tenant_id binary(16) not null, primary key (contract_occupant_id)) engine=InnoDB;
create table contract_services (contract_service_id binary(16) not null, room_id binary(16) not null, service_id binary(16) not null, primary key (contract_service_id)) engine=InnoDB;
create table contract_templates (is_deleted BOOLEAN DEFAULT FALSE not null, sortorder INT, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), contracttemplate_id binary(16) not null, motel_id binary(16), content TEXT, namecontract TEXT, templatename TEXT, primary key (contracttemplate_id)) engine=InnoDB;
create table contracts (actual_price DECIMAL(10, 2), count_tenant INT, createdate DATE, debt DECIMAL(10, 2), deposit DECIMAL(10, 2), is_deleted BOOLEAN DEFAULT FALSE not null, price DECIMAL(10, 2), close_contract DATE, created_at datetime(6), deleted_at datetime(6), movein_date DATE, reportclose_contract DATE, updated_at datetime(6), broker_id binary(16), contract_id binary(16) not null, contracttemplate_id binary(16), room_id binary(16), tenant_id binary(16), collectioncycle TEXT, description TEXT, language TEXT, lease_term TEXT, signcontract TEXT, username VARCHAR(255), status ENUM('ACTIVE', 'ENDED','EXPIRING','TERMINATED'), primary key (contract_id)) engine=InnoDB;
create table detail_invoices (room_service_quantity INT, detail_invoice_id binary(16) not null, invoice_id binary(16), room_device_id binary(16), room_service_id binary(16), primary key (detail_invoice_id)) engine=InnoDB;
create table devices (available BOOLEAN, device_id binary(16) not null, device_name VARCHAR(255), primary key (device_id)) engine=InnoDB;
create table invalidated_tokens (expiry_time datetime(6), id VARCHAR(255) not null, primary key (id)) engine=InnoDB;
create table invoice_additional_charges (amount DECIMAL(10, 2), is_addition bit, additional_charge_id binary(16) not null, invoice_id binary(16), reason VARCHAR(255), primary key (additional_charge_id)) engine=InnoDB;
create table invoice_service_details (consumption DECIMAL(10, 2), service_price DECIMAL(10, 2), detail_id binary(16) not null, invoice_id binary(16) not null, service_name VARCHAR(50), primary key (detail_id)) engine=InnoDB;
create table invoices (deposit DECIMAL(10, 2), due_date DATE, due_dateofmovein_date DATE, invoice_create_date DATE, is_deleted BOOLEAN DEFAULT FALSE not null, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), contract_id binary(16), invoice_id binary(16) not null, tenant_id binary(16), invoice_create_month VARCHAR(7), invoice_reason VARCHAR(100), payment_status VARCHAR(10) not null, primary key (invoice_id)) engine=InnoDB;
create table meter_readings (is_deleted BOOLEAN DEFAULT FALSE not null, new_index DECIMAL(10, 3), old_index DECIMAL(10, 3), reading_date DATE, usage_amount DECIMAL(10, 3), created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), meter_reading_id binary(16) not null, room_id binary(16) not null, service_id binary(16) not null, image_url VARCHAR(255), primary key (meter_reading_id)) engine=InnoDB;
create table motel_devices (total_null integer not null, total_quantity integer not null, total_using integer not null, `value` float(53), value_input float(53), motel_device_id binary(16) not null, motel_id binary(16), device_name VARCHAR(255), icon varchar(255), supplier varchar(255), unit enum ('BO','CAI','CAP','CHIEC'), primary key (motel_device_id)) engine=InnoDB;
create table motel_rules (motel_id binary(16), motel_rule_id binary(16) not null, rule_id binary(16), primary key (motel_rule_id)) engine=InnoDB;
create table motel_services (price DECIMAL(10, 2), motel_id binary(16), motel_service_id binary(16) not null, chargetype VARCHAR(255), name_service NVARCHAR(255), primary key (motel_service_id)) engine=InnoDB;
create table motels (area DECIMAL(8, 2), invoicedate INT, is_deleted BOOLEAN DEFAULT FALSE not null, maxperson INT, paymentdeadline INT, average_price DECIMAL(10, 2), created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), motel_id binary(16) not null, type_room_id binary(16) not null, address NVARCHAR(255), methodofcreation NVARCHAR(255), motel_name VARCHAR(255), username VARCHAR(255), primary key (motel_id)) engine=InnoDB;
create table name_motel_services (name_motel_services_id binary(16) not null, name_service NVARCHAR(255), type_service NVARCHAR(255), primary key (name_motel_services_id)) engine=InnoDB;
create table notification_rooms (notification_id binary(16), notification_room_id binary(16) not null, room_id binary(16), primary key (notification_room_id)) engine=InnoDB;
create table notifications (is_deleted BOOLEAN DEFAULT FALSE not null, number_of_recipients INT, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), notification_id binary(16) not null, content TEXT, title VARCHAR(255), username_landlord VARCHAR(255), primary key (notification_id)) engine=InnoDB;
create table payments (is_deleted BOOLEAN DEFAULT FALSE not null, payment_date date not null, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), payment_id binary(16) not null, description TEXT, payment_name VARCHAR(255), primary key (payment_id)) engine=InnoDB;
create table permissions (permission_id binary(16) not null, description TEXT, name VARCHAR(255), primary key (permission_id)) engine=InnoDB;
create table rental_amenities (rental_amenities_id binary(16) not null, name VARCHAR(255), primary key (rental_amenities_id)) engine=InnoDB;
create table roles (role_id binary(16) not null, description TEXT, role_name enum ('ADMIN','BROKER','CUSTOMER','EMPLOYEE','GUEST','HOST'), primary key (role_id)) engine=InnoDB;
create table roles_permissions (permissions_permission_id binary(16) not null, role_role_id binary(16) not null, primary key (permissions_permission_id, role_role_id)) engine=InnoDB;
create table room_devices (quantity INT, motel_device_id binary(16), room_device_id binary(16) not null, room_id binary(16), primary key (room_device_id)) engine=InnoDB;
create table room_images (room_id binary(16), room_image_id binary(16) not null, image VARCHAR(255), primary key (room_image_id)) engine=InnoDB;
create table room_reservations (deposit DECIMAL(10, 2), is_deleted BOOLEAN DEFAULT FALSE not null, created_at datetime(6), createdate DATE, deleted_at datetime(6), movein_date DATE, updated_at datetime(6), reserveaplace_id binary(16) not null, room_id binary(16), nametenant TEXT, note TEXT, phonetenant TEXT, status ENUM('ACTIVE', 'ENDED','EXPIRING','DEPOSITED'), primary key (reserveaplace_id)) engine=InnoDB;
create table room_reviews (rating INT, room_id binary(16), room_review_id binary(16) not null, comment TEXT, username VARCHAR(255), primary key (room_review_id)) engine=InnoDB;
create table room_services (quantity INT, room_id binary(16) not null, room_service_id binary(16) not null, service_id binary(16) not null, primary key (room_service_id)) engine=InnoDB;
create table rooms (area INT, deposit DECIMAL(10, 2), is_deleted BOOLEAN DEFAULT FALSE not null, price DECIMAL(10, 2), created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), motel_id binary(16) not null, room_id binary(16) not null, description TEXT, finance TEXT, name_room NVARCHAR(255), prioritize TEXT, room_group NVARCHAR(255), status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'), primary key (room_id)) engine=InnoDB;
create table rules (price DECIMAL(10, 2), rule_id binary(16) not null, rule_name NVARCHAR(255), primary key (rule_id)) engine=InnoDB;
create table search_histories (search_id binary(16) not null, content TEXT, username VARCHAR(255), primary key (search_id)) engine=InnoDB;
create table services (service_id binary(16) not null, name_service VARCHAR(255), type_service VARCHAR(255), primary key (service_id)) engine=InnoDB;
create table supports (date_of_stay DATE, is_deleted BOOLEAN DEFAULT FALSE not null, create_date TIMESTAMP not null, created_at datetime(6), deleted_at datetime(6), price_end DECIMAL(10, 2), price_first DECIMAL(10, 2), updated_at datetime(6), support_id binary(16) not null, name_contact varchar(255), phone_contact varchar(255), username VARCHAR(255), primary key (support_id)) engine=InnoDB;
create table temporary_contracts (birth DATE, dateofissue DATE, is_deleted BOOLEAN DEFAULT FALSE not null, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), motel_id binary(16), temporaryrcontract_id binary(16) not null, householdhead TEXT, identifier TEXT, job TEXT, permanentaddress TEXT, phone TEXT, placeofissue TEXT, representativename TEXT, username_tenant VARCHAR(255), primary key (temporaryrcontract_id)) engine=InnoDB;
create table tenants (birthday DATE, information_verify BOOLEAN, is_deleted BOOLEAN DEFAULT FALSE not null, license_date DATE, role BOOLEAN, temporary_residence BOOLEAN, type_of_tenant BOOLEAN, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), tenant_id binary(16) not null, address VARCHAR(255), avata VARCHAR(255), back_photo VARCHAR(255), cccd VARCHAR(20), email VARCHAR(255), front_photo VARCHAR(255), fullname VARCHAR(255) not null, job VARCHAR(255), phone VARCHAR(12), place_of_license VARCHAR(255), relationship VARCHAR(255), gender ENUM('MALE', 'FEMALE','OTHER'), primary key (tenant_id)) engine=InnoDB;
create table transactions (amount DECIMAL(10, 2) not null, is_deleted BOOLEAN DEFAULT FALSE not null, transaction_date DATE not null, transaction_type bit not null, created_at datetime(6), deleted_at datetime(6), updated_at datetime(6), invoice_id binary(16), transaction_id binary(16) not null, category varchar(100) not null, payer_name varchar(100) not null, payment_description varchar(255) not null, username VARCHAR(255) not null, primary key (transaction_id)) engine=InnoDB;
create table type_rooms (type_room_id binary(16) not null, name VARCHAR(50), primary key (type_room_id)) engine=InnoDB;
create table user_favorites (bulletin_board_id binary(16) not null, username VARCHAR(255) not null) engine=InnoDB;
create index idx_account_cccd on accounts (cccd);
alter table accounts add constraint idx_account_email unique (email);
alter table accounts add constraint idx_account_phone unique (phone);
create index idx_bb_username on bulletin_boards (username);
create index idx_bb_status on bulletin_boards (status);
create index idx_handover_contract_id on contract_device_handovers (contract_id);
create index idx_handover_device_id on contract_device_handovers (device_id);
create index idx_occupant_contract_id on contract_occupants (contract_id);
create index idx_occupant_tenant_id on contract_occupants (tenant_id);
create index idx_contract_room_id on contracts (room_id);
create index idx_contract_username on contracts (username);
create index idx_contract_status on contracts (status);
create index idx_invoice_contract_id on invoices (contract_id);
create index idx_invoice_payment_status on invoices (payment_status);
create index idx_meter_room_id on meter_readings (room_id);
create index idx_meter_service_id on meter_readings (service_id);
create index idx_motel_username on motels (username);
alter table rental_amenities add constraint UK6qmj85khil5ytarbp03pqalqp unique (name);
create index idx_room_motel_id on rooms (motel_id);
create index idx_room_status on rooms (status);
alter table tenants add constraint idx_tenant_cccd unique (cccd);
alter table type_rooms add constraint UKsgu3f4ax8nhctuesjqjylk2ff unique (name);
alter table auths add constraint FKrq7whn78m85fwb3390d3cjprl foreign key (username) references accounts (username);
alter table auths add constraint FKshg2p9n7oe0xfq14ra08dijsd foreign key (role_id) references roles (role_id);
alter table bulletin_board_images add constraint FKbmflpc91kxy299naf33g7racv foreign key (bulletin_board_id) references bulletin_boards (bulletin_board_id);
alter table bulletin_board_rental_amenities add constraint FK1ov0tp3ycw1pnhqrbpho98yxp foreign key (bulletin_boards_id) references bulletin_boards (bulletin_board_id);
alter table bulletin_board_rental_amenities add constraint FKt0dm3ityhgl6lmt71rcqwil66 foreign key (rental_amenities_id) references rental_amenities (rental_amenities_id);
alter table bulletin_board_reviews add constraint FKdoxecc0hn7md0w0f890r83ptl foreign key (account_id) references accounts (username);
alter table bulletin_board_reviews add constraint FK2afhvyty4s3a8ei0sdmxtm1te foreign key (bulletin_board_id) references bulletin_boards (bulletin_board_id);
alter table bulletin_board_rules add constraint FKesigi3b9cpv1c7up0ut1hg33s foreign key (bulletin_board_id) references bulletin_boards (bulletin_board_id);
alter table bulletin_board_rules add constraint FKk1mib5g3aic61cdp8iks6tk9i foreign key (rule_rule_id) references rules (rule_id);
alter table bulletin_boards add constraint FKc9144y6khwd2y31n9gr01u32e foreign key (username) references accounts (username);
alter table cars add constraint FKi28u9y6jexeeic50k8qdp8wpt foreign key (room_id) references rooms (room_id);
alter table contract_device_handovers add constraint FKcll2k92ludayswls8f3iagcpa foreign key (contract_id) references contracts (contract_id);
alter table contract_device_handovers add constraint FKn0nqv579yhcstltrarkvdjldw foreign key (device_id) references devices (device_id);
alter table contract_devices add constraint FK20bsb0ql1io7u0m7aadaqix81 foreign key (contract_id) references contracts (contract_id);
alter table contract_devices add constraint FKnag2ca1iyov8u1ohgejt78gv5 foreign key (motel_device_id) references motel_devices (motel_device_id);
alter table contract_occupants add constraint FK1edwx321scgnjqxxc0eur1pam foreign key (contract_id) references contracts (contract_id);
alter table contract_occupants add constraint FKsorbksc3h0sj0v85kkr2uadh foreign key (tenant_id) references tenants (tenant_id);
alter table contract_services add constraint FK1lppqb6737js56majpj085y11 foreign key (room_id) references contracts (contract_id);
alter table contract_services add constraint FK2n7l5rk6x5tug7fvg90pqb847 foreign key (service_id) references motel_services (motel_service_id);
alter table contract_templates add constraint FKhrbefugdupo2rc3bbnloaa4xg foreign key (motel_id) references motels (motel_id);
alter table contracts add constraint FKjy2o1wpv5eyqlwqm05ieg8d3k foreign key (username) references accounts (username);
alter table contracts add constraint FK8acmc3sdj9134apfxlt03pguk foreign key (broker_id) references brokers (broker_id);
alter table contracts add constraint FKop5juihkduwrop9irkxxo5ohc foreign key (contracttemplate_id) references contract_templates (contracttemplate_id);
alter table contracts add constraint FKju1b0xobla9t8oexrb8lpi8jq foreign key (room_id) references rooms (room_id);
alter table contracts add constraint FK22otid04gea49e48vupxbk3xd foreign key (tenant_id) references tenants (tenant_id);
alter table detail_invoices add constraint FKcd2bjll0plq5xb1iike4654id foreign key (invoice_id) references invoices (invoice_id);
alter table detail_invoices add constraint FKdlvph32m0xh87lw28mqlqhhal foreign key (room_device_id) references room_devices (room_device_id);
alter table detail_invoices add constraint FK1c1695nrh6yl7xyd11js1ntht foreign key (room_service_id) references room_services (room_service_id);
alter table invoice_additional_charges add constraint FKkd0d7souhfb1sdg2glnlbtmps foreign key (invoice_id) references invoices (invoice_id);
alter table invoice_service_details add constraint FKevbo0u5kw03lwk43bb5hub6wv foreign key (invoice_id) references invoices (invoice_id);
alter table invoices add constraint FKeads7q9fktwtsgdwmp1x16eqc foreign key (contract_id) references contracts (contract_id);
alter table invoices add constraint FKtrimee4bla21jcxujjcljd3r0 foreign key (tenant_id) references tenants (tenant_id);
alter table meter_readings add constraint FKfcfh4ant2u95m90uf1ok8mb6m foreign key (room_id) references rooms (room_id);
alter table meter_readings add constraint FKrisw6sqexat4e1hw8wootm65u foreign key (service_id) references services (service_id);
alter table motel_devices add constraint FK1bnf05a2vcu0kf92na34aawjt foreign key (motel_id) references motels (motel_id);
alter table motel_rules add constraint FKgp0h7klcnjta4rkktppntdiq0 foreign key (motel_id) references motels (motel_id);
alter table motel_rules add constraint FKltj56oltjp8fu7wkiyy58cu1m foreign key (rule_id) references rules (rule_id);
alter table motel_services add constraint FK7921b2tx6twbl6mv0u8vka2hf foreign key (motel_id) references motels (motel_id);
alter table motels add constraint FKg27w1ubbgrvekrgmcanujyy9p foreign key (username) references accounts (username);
alter table motels add constraint FKnre10cll3ltmvswrrjxjf6w4o foreign key (type_room_id) references type_rooms (type_room_id);
alter table notification_rooms add constraint FKs2ejw3a91x8dnssgi97wj91fd foreign key (notification_id) references notifications (notification_id);
alter table notification_rooms add constraint FKr9lessmea5d5ofstlg67wm7ec foreign key (room_id) references rooms (room_id);
alter table notifications add constraint FKhgkdohl6eaxcirpxd44vu6o0l foreign key (username_landlord) references accounts (username);
alter table roles_permissions add constraint FK8we4k8cug76ncr226t5o7m8ym foreign key (permissions_permission_id) references permissions (permission_id);
alter table roles_permissions add constraint FK2j8f8moaaw9ifn75eny12jcqf foreign key (role_role_id) references roles (role_id);
alter table room_devices add constraint FK641qushivo7dfdss66e550l2r foreign key (motel_device_id) references motel_devices (motel_device_id);
alter table room_devices add constraint FKd2dq1mio2ofjw363vh891uyvl foreign key (room_id) references rooms (room_id);
alter table room_images add constraint FKtky1jnwoh1hv50m263p2vlt0y foreign key (room_id) references rooms (room_id);
alter table room_reservations add constraint FKf520kpinewy2hpxke3uh7qmvd foreign key (room_id) references rooms (room_id);
alter table room_reviews add constraint FKl4rrl82el7kn5bonj9nh71m8f foreign key (username) references accounts (username);
alter table room_reviews add constraint FK7tds162jf8kaa8tfubna8f43e foreign key (room_id) references rooms (room_id);
alter table room_services add constraint FKewq1euu8r5i0c2f1ejfout7ty foreign key (room_id) references rooms (room_id);
alter table room_services add constraint FKnatr747drfd55wcufr6bmdg4d foreign key (service_id) references motel_services (motel_service_id);
alter table rooms add constraint FKrt8cc3dmw63le2uj38xbulsai foreign key (motel_id) references motels (motel_id);
alter table search_histories add constraint FK4grnn86t4o84m85d5xkhsa0sj foreign key (username) references accounts (username);
alter table supports add constraint FKomqwe6va6vcl3qd3pf4an6tk foreign key (username) references accounts (username);
alter table temporary_contracts add constraint FKr4kyo4xtcngmlblunuhrq9tdw foreign key (motel_id) references motels (motel_id);
alter table temporary_contracts add constraint FKqf3ggsif38e34lr2g9iheijry foreign key (username_tenant) references accounts (username);
alter table transactions add constraint FK4vs9bjcda4p0l5i96fshdsa68 foreign key (username) references accounts (username);
alter table transactions add constraint FKm5goxujeqrwf774cgr0r04553 foreign key (invoice_id) references invoices (invoice_id);
alter table user_favorites add constraint FK73sdw6rrhvdh3v53yisy8a1ye foreign key (bulletin_board_id) references bulletin_boards (bulletin_board_id);
alter table user_favorites add constraint FKssiy8rhc5d7lsre4joa31ay6e foreign key (username) references accounts (username);


-- Manual Additions (Audit, Fulltext, Constraints)

CREATE TABLE IF NOT EXISTS audit_logs (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    table_name   VARCHAR(100) NOT NULL,
    record_id    VARCHAR(36)  NOT NULL,
    action       ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    old_values   JSON         NULL,
    new_values   JSON         NULL,
    actor_id     VARCHAR(255) NULL,
    actor_role   VARCHAR(50)  NULL,
    ip_address   VARCHAR(45)  NULL,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_audit_table_record (table_name, record_id),
    INDEX idx_audit_actor (actor_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE bulletin_boards ADD FULLTEXT INDEX ft_bb_search(title, description, address);

ALTER TABLE rooms
    ADD CONSTRAINT chk_rooms_price CHECK (price >= 0),
    ADD CONSTRAINT chk_rooms_area CHECK (area > 0),
    ADD CONSTRAINT chk_rooms_deposit CHECK (deposit >= 0);

ALTER TABLE contracts
    ADD CONSTRAINT chk_contract_price CHECK (price >= 0),
    ADD CONSTRAINT chk_contract_deposit CHECK (deposit >= 0);

ALTER TABLE meter_readings
    ADD CONSTRAINT chk_meter_new_index CHECK (new_index >= 0),
    ADD CONSTRAINT chk_meter_usage CHECK (usage_amount >= 0);

ALTER TABLE bulletin_board_reviews
    ADD CONSTRAINT chk_bb_rating CHECK (rating BETWEEN 1 AND 5);
