# RRMS — Database Design Standard v2.1
## Room Rental Management System
### Senior Engineer Review | April 2026

---

## 0. Tổng Quan Schema Hiện Tại

**Tổng số entity:** 50 Java classes | **Flyway migrations:** V1–V5 | **Database:** MySQL + InnoDB

### 0.1 Điểm Mạnh
- UUID `binary(16)` làm PK cho entities chính
- `created_at` / `updated_at` qua `BaseEntity` trên hầu hết bảng business
- FK constraints đầy đủ, Flyway quản lý migration
- ENUM cho gender, status; Index trên FK columns
- Phân tách domain tốt: brokers, tenants, contract_occupants, meter_readings

### 0.2 Vấn Đề Nghiêm Trọng

| # | Vấn đề | Bảng ảnh hưởng | Mức độ |
|---|--------|---------------|--------|
| 1 | Thiếu soft delete (`is_deleted`) trên hầu hết bảng | accounts, rooms, contracts, invoices... | 🔴 CRITICAL |
| 2 | `DOUBLE` cho tiền tệ thay vì `DECIMAL(15,2)` | bulletin_boards, **motels.area** | 🔴 CRITICAL |
| 3 | Thiếu CHECK constraints | rooms, invoices, contracts, meter_readings | 🟠 HIGH |
| 4 | ENUM values không rõ nghĩa (`IATExpire`, `Stake`, `ReportEnd`) | contracts, reserveaplace | 🟠 HIGH |
| 5 | Thiếu `audit_logs` table | Toàn hệ thống | 🟠 HIGH |
| 6 | `contract_services.room_id` thực chất là `contract_id` — **BUG** | contract_services | 🔴 CRITICAL |
| 7 | 12+ bảng/entity thiếu trong tài liệu v2.0 | Car, Notification, Support, RoomReview... | 🟠 HIGH |
| 8 | `Room.price`/`deposit` dùng Java `Double` dù SQL DECIMAL | rooms | 🟡 MEDIUM |
| 9 | Circular FK: `accounts ↔ hearts` | accounts, hearts | 🟡 MEDIUM |
| 11 | API Discovery/Search chưa chuẩn hóa | search, bulletin-board | 🟢 FIXED |
| 12 | Runtime error: UnknownPathException createdDate | bulletin_boards | 🟢 FIXED |

---

## 1. Naming Conventions

### 1.1 Tên Bảng — snake_case, số nhiều

| Hiện tại | Đề xuất | Lý do |
|----------|---------|-------|
| `accounts` | ✅ Giữ nguyên | Đúng |
| `tenant` | ❌ → `tenants` | Phải số nhiều |
| `ReserveAPlace` | ❌ → `room_reservations` | Không rõ nghĩa, sai convention |
| `temporaryrcontracts` | ❌ → `temporary_contracts` | Typo + thiếu underscore |
| `searchs` | ❌ → `search_histories` | Sai ngữ pháp |
| `motel_device` | ❌ → `motel_devices` | Phải số nhiều |
| `contracttemplates` | ❌ → `contract_templates` | Thiếu underscore |
| `Transaction` | ❌ → `transactions` | PascalCase sai convention |
| `invalidatedToken` | ❌ → `invalidated_tokens` | camelCase sai convention |
| `invoiceAdditionalCharge` | ❌ → `invoice_additional_charges` | camelCase sai |
| `invoiceServiceDetail` | ❌ → `invoice_service_details` | camelCase sai |
| `bulletinBoards_rentalAms` | ✅ → `bulletin_board_rental_amenities` | Đã chuẩn hóa class & table |
| `heart_bulletinBoard` | ✅ → `user_favorites` | Đã refactor sang AccountService |
| `Permissions` | ❌ → `permissions` | PascalCase sai |

### 1.2 Tên Cột Convention

| Loại cột | Convention | Ví dụ đúng | Ví dụ sai (trong code) |
|----------|-----------|------------|----------------------|
| Primary Key | `id` (không prefix) | `id` UUID | `bulletin_board_id` ⚠ |
| Foreign Key | `{table_singular}_id` | `motel_id`, `room_id` | `room_id` cho contract ❌ |
| Boolean | `is_` hoặc `has_` | `is_active`, `is_deleted` | `status tinyint(1)` ⚠ |
| Timestamp | `_at` suffix | `created_at`, `deleted_at` | `createdate` ❌ |
| Tiền tệ | DECIMAL tên rõ nghĩa | `price`, `deposit_amount` | `deposit DOUBLE` ❌ |

### 1.3 Index & Constraint Naming

```sql
-- Index: idx_{table}_{column}
-- Unique: uq_{table}_{column}
-- FK:     fk_{table}_{ref_table}
-- Check:  chk_{table}_{column}
```

---

## 2. Primary Key Strategy

| Loại bảng | PK hiện tại | Khuyến nghị |
|-----------|------------|-------------|
| Business entities | UUID `binary(16)` ✅ | Giữ nguyên |
| High-volume logs (audit, notifications) | UUID ⚠ | → `BIGINT AUTO_INCREMENT` |
| Bảng nối M:N (roles_permissions) | Composite PK ✅ | Đúng |

> ⚠ Cần xem xét UUID v7 (time-ordered) để giảm index fragmentation.

---

## 3. Mandatory Columns — Soft Delete

**THIẾU NGHIÊM TRỌNG** trên hầu hết bảng business:

| Cột | Kiểu | Default | Hiện trạng |
|-----|------|---------|------------|
| `created_at` | `DATETIME(6)` | `CURRENT_TIMESTAMP` | ✅ Có (qua BaseEntity) |
| `updated_at` | `DATETIME(6)` | `ON UPDATE NOW()` | ✅ Có (qua BaseEntity) |
| `is_deleted` | `BOOLEAN` | `FALSE` | ❌ THIẾU |
| `deleted_at` | `DATETIME` | `NULL` | ❌ THIẾU |

**Bảng cần thêm soft delete:** accounts, rooms, contracts, invoices, tenants, motels, brokers, payments, transactions.

---

## 4. Data Types

### 4.1 Lỗi DOUBLE cho tiền tệ

| Bảng | Cột | Hiện tại (SAI) | Đúng chuẩn |
|------|-----|---------------|------------|
| `bulletin_boards` | `rentPrice, deposit, electricityPrice, waterPrice, promotionalRentalPrice` | `DOUBLE` ❌ | `DECIMAL(15,2)` |
| `motels` | `area` | `DOUBLE` ❌ | `DECIMAL(8,2)` |
| `meter_readings` | `oldIndex, newIndex, usageAmount` | `DOUBLE` ❌ | `DECIMAL(10,3)` |

### 4.2 Java Type Mismatch

| Entity | Field | Java Type (SAI) | Đúng |
|--------|-------|----------------|------|
| `Room` | `price, deposit` | `Double` | `BigDecimal` |
| `Contract` | `price, deposit, debt, actualPrice` | `Double` | `BigDecimal` |
| `Invoice` | `deposit` | `Double` | `BigDecimal` |
| `BulletinBoard` | tất cả price fields | `Double` | `BigDecimal` |
| `MeterReading` | `oldIndex, newIndex, usageAmount` | `Double` | `BigDecimal` |
| `MotelService` | `price` | `Long` ⚠ | `BigDecimal` |
| `Rule` | `price` | `long` ⚠ | `BigDecimal` |
| `Support` | `priceFirst, priceEnd` | `long` ⚠ | `BigDecimal` |

---

## 5. Danh Sách Đầy Đủ Entities (50 classes)

### 5.1 Authentication & Authorization (6 bảng)

| Bảng | Table Name | PK | Extends BaseEntity | Trạng thái |
|------|-----------|----|--------------------|-----------|
| Account | `accounts` | `username` VARCHAR | ✅ | 🟡 Cần sửa: bỏ circular FK `heart_id` |
| Auth | `auths` | UUID | ❌ | 🟡 Thiếu ON DELETE CASCADE |
| Role | `roles` | UUID | ❌ | ✅ OK |
| Permission | `Permissions` ❌ | UUID | ❌ | 🟡 Tên bảng PascalCase |
| InvalidatedToken | `invalidatedToken` ❌ | VARCHAR(255) | ❌ | 🟡 Tên bảng camelCase |
| Heart | `hearts` | UUID | ❌ | ✅ Đã refactor → `user_favorites` (ManyToMany) |

### 5.2 Motel & Room (10 bảng)

| Bảng | Table Name | PK | BaseEntity | Trạng thái |
|------|-----------|----|-----------|----|
| Motel | `motels` | UUID | ✅ | 🟡 `area` dùng DOUBLE |
| Room | `rooms` | UUID | ✅ | 🟡 `status` dùng Boolean thay ENUM |
| RoomImage | `room_images` | UUID | ❌ | ✅ OK |
| RoomDevice | `room_devices` | UUID | ❌ | ✅ OK |
| RoomService | `room_services` | UUID | ❌ | ✅ OK |
| RoomReview | `room_reviews` | UUID | ❌ | ✅ OK (**THIẾU trong v2.0**) |
| MotelDevice | `motel_device` ❌ | UUID | ❌ | 🟡 Tên số ít |
| MotelService | `motel_services` | UUID | ❌ | 🟡 `price` dùng Long |
| MotelRule | `motel_rules` | UUID | ❌ | ✅ OK |
| TypeRoom | `type_rooms` | UUID | ❌ | ✅ OK |

### 5.3 Contract & Tenant (9 bảng)

| Bảng | Table Name | PK | BaseEntity | Trạng thái |
|------|-----------|----|-----------|----|
| Contract | `contracts` | UUID | ✅ | 🔴 ENUM `IATExpire`/`ReportEnd` |
| ContractTemplate | `contracttemplates` ❌ | UUID | ✅ | 🟡 Tên thiếu underscore |
| ContractOccupant | `contract_occupants` | UUID | ✅ | ✅ OK |
| ContractDevice | `contract_devices` | UUID | ❌ | ✅ OK |
| ContractDeviceHandover | `contract_device_handovers` | UUID | ✅ | ✅ OK |
| ContractService | `contract_services` | UUID | ❌ | 🔴 BUG: `room_id` → `contract_id` |
| Tenant | `tenant` ❌ | UUID | ✅ | 🟡 Số ít, `type_of_tenant` Boolean |
| TemporaryR_contract | `temporaryrcontracts` ❌ | UUID | ✅ | 🟡 Tên sai convention |
| Reserve_a_place | `ReserveAPlace` ❌ | UUID | ✅ | 🟡 ENUM `Stake`/`IATExpire` |

### 5.4 Invoice, Payment & Transaction (6 bảng)

| Bảng | Table Name | PK | BaseEntity | Trạng thái |
|------|-----------|----|-----------|----|
| Invoice | `invoices` | UUID | ✅ | 🟡 `deposit` dùng Double |
| InvoiceDetail | `detail_invoices` | UUID | ❌ | ⚠ Trùng với InvoiceServiceDetail? |
| InvoiceServiceDetail | `invoiceServiceDetail` ❌ | UUID | ❌ | 🟡 Tên camelCase |
| InvoiceAdditionItem | `invoiceAdditionalCharge` ❌ | UUID | ❌ | 🟡 Tên camelCase |
| Payment | `payments` | UUID | ✅ | ✅ OK |
| Transaction | `Transaction` ❌ | UUID | ✅ | 🟡 Tên PascalCase |

### 5.5 Bulletin Board & Marketing (5 bảng)

| Bảng | Table Name | PK | BaseEntity | Trạng thái |
|------|-----------|----|-----------|----|
| BulletinBoard | `bulletin_boards` | UUID | ✅ | ✅ Đã chuẩn hóa `BigDecimal`, `LocalDate`, kế thừa `BaseEntity` (createdAt) |
| BulletinBoardImage | `bulletin_board_images` | UUID | ❌ | ✅ OK |
| BulletinBoardReviews | `bulletin_board_reviews` | UUID | ❌ | 🟡 Thiếu CHECK rating |
| BulletinBoardRule | `bulletin_board_rules` | UUID | ❌ | ✅ OK |
| BulletinBoardRentalAmenity | `bulletin_board_rental_amenities` | UUID | ❌ | ✅ Đã chuẩn hóa tên class |

### 5.6 Lookup & Utility (5 bảng)

| Bảng | Table Name | PK | Trạng thái |
|------|-----------|----|----|
| RentalAmenities | `rental_amenities` | UUID | ✅ OK |
| Rule | `rules` | UUID | 🟡 `price` dùng `long` |
| Device | `devices` | UUID | ✅ OK |
| Service | `services` | UUID | ✅ OK |
| NameMotelService | `name_motel_services` | UUID | ✅ OK |

### 5.7 Misc (5 bảng — **TẤT CẢ THIẾU trong v2.0**)

| Bảng | Table Name | PK | BaseEntity | Trạng thái |
|------|-----------|----|-----------|----|
| Car | `cars` | UUID | ❌ | 🟡 Thiếu timestamp |
| Notification | `notifications` | UUID | ✅ | ✅ OK |
| NotificationRoom | `notification_rooms` | UUID | ❌ | ✅ OK |
| Search | `searchs` ❌ | UUID | ❌ | 🟡 Tên sai ngữ pháp |
| Support | `supports` | UUID | ✅ | 🟡 `priceFirst/priceEnd` dùng `long` |

---

## 6. Relationships — Mối Quan Hệ Đầy Đủ

### 6.1 Sơ đồ quan hệ chính

| Bảng cha | Quan hệ | Bảng con | ON DELETE |
|----------|---------|----------|----------|
| accounts | 1:N | motels | RESTRICT |
| accounts | 1:N | contracts | CASCADE (orphanRemoval) |
| accounts | 1:N | auths | — (thiếu CASCADE) |
| accounts | 1:1 | hearts | CASCADE |
| accounts | 1:N | bulletin_boards | — |
| accounts | 1:N | transactions | — |
| accounts | 1:N | supports | — |
| accounts | 1:N | notifications | — |
| accounts | 1:N | searchs | — |
| motels | 1:N | rooms | CASCADE (orphanRemoval) |
| motels | 1:N | motel_services | CASCADE (orphanRemoval) |
| motels | 1:N | contract_templates | CASCADE (orphanRemoval) |
| motels | 1:N | temporary_contracts | — |
| motels | 1:N | motel_rules | — |
| rooms | 1:N | contracts | CASCADE (orphanRemoval) |
| rooms | 1:N | reserve_a_place | CASCADE (orphanRemoval) |
| rooms | 1:N | meter_readings | CASCADE (orphanRemoval) |
| rooms | 1:N | room_images | — |
| rooms | 1:N | room_services | — |
| rooms | 1:N | room_devices | — |
| rooms | 1:N | cars | — |
| rooms | 1:N | room_reviews | — |
| rooms | 1:N | notification_rooms | — |
| contracts | 1:N | contract_occupants | CASCADE |
| contracts | 1:N | contract_device_handovers | CASCADE |
| contracts | 1:N | contract_devices | — |
| contracts | 1:N | contract_services | — |
| contracts | 1:N | invoices | — |
| invoices | 1:N | transactions | CASCADE |
| invoices | 1:N | detail_invoices | CASCADE |
| invoices | 1:N | invoice_additional_charges | CASCADE |
| invoices | 1:N | invoice_service_details | — |
| tenant | 1:N | contracts | CASCADE (orphanRemoval) |
| tenant | 1:N | contract_occupants | CASCADE (orphanRemoval) |
| tenant | 1:N | invoices | — |
| bulletin_boards | 1:N | bulletin_board_images | MERGE |
| bulletin_boards | 1:N | bulletin_board_reviews | MERGE |
| bulletin_boards | 1:N | bulletin_board_rules | MERGE |
| bulletin_boards | 1:N | bulletin_board_rental_amenities | MERGE |
| accounts | M:N | bulletin_boards (via `user_favorites`) | CASCADE |
| roles | M:N | permissions (via roles_permissions) | — |
| notifications | 1:N | notification_rooms | — |

### 6.2 BUG: contract_services.room_id

```java
// ContractService.java — BUG
@JoinColumn(name = "room_id", nullable = false)  // ← Tên cột SAI
private Contract contract;  // ← Thực chất là contract, không phải room
```

V5 migration đã xử lý ở SQL level nhưng **Java entity vẫn sai tên `room_id`**.

### 6.3 Circular FK: accounts ↔ hearts

```
accounts.heart_id → hearts.heart_id (FK)
hearts.account ← accounts (mappedBy)
```

**Fix:** Bỏ `accounts.heart_id`, truy vấn ngược qua WHERE.

---

## 7. Index Strategy

### 7.1 Index hiện có (từ JPA @Index)

| Entity | Index Name | Columns |
|--------|-----------|---------|
| Account | `idx_account_email` | email (UNIQUE) |
| Account | `idx_account_phone` | phone (UNIQUE) |
| Account | `idx_account_cccd` | cccd |
| Room | `idx_room_motel_id` | motel_id |
| Room | `idx_room_status` | status |
| Contract | `idx_contract_room_id` | room_id |
| Contract | `idx_contract_username` | username |
| Contract | `idx_contract_status` | status |
| Invoice | `idx_invoice_contract_id` | contract_id |
| Invoice | `idx_invoice_payment_status` | paymentStatus |
| Motel | `idx_motel_username` | username |
| BulletinBoard | `idx_bb_username` | username |
| BulletinBoard | `idx_bb_status` | status |
| MeterReading | `idx_meter_room_id` | room_id |
| MeterReading | `idx_meter_service_id` | service_id |
| ContractOccupant | `idx_occupant_contract_id` | contract_id |
| ContractOccupant | `idx_occupant_tenant_id` | tenant_id |
| ContractDeviceHandover | `idx_handover_contract_id` | contract_id |
| ContractDeviceHandover | `idx_handover_device_id` | device_id |
| Tenant | `idx_tenant_cccd` | CCCD (UNIQUE) |

### 7.2 Index CẦN THÊM

```sql
-- Full-text search
ALTER TABLE bulletin_boards ADD FULLTEXT INDEX ft_bb_search(title, description, address);

-- Thống kê tài chính
CREATE INDEX idx_invoices_status_date ON invoices(paymentStatus, invoice_create_date);
CREATE INDEX idx_tx_username_date ON Transaction(username, transaction_date);

-- Tìm kiếm người thuê
CREATE INDEX idx_tenant_phone ON tenant(phone);

-- Hợp đồng
CREATE INDEX idx_contract_movein ON contracts(movein_date, status);

-- Token cleanup
CREATE INDEX idx_invalid_token_expiry ON invalidatedToken(expiry_time);
```

---

## 8. Security & Audit

### 8.1 Thiếu audit_logs — CRITICAL

Cần tạo bảng `audit_logs` với `BIGINT AUTO_INCREMENT` PK.

### 8.2 Dữ liệu nhạy cảm

| Cột | Bảng | Yêu cầu |
|-----|------|---------|
| cccd | accounts, tenant | AES-256 encrypt |
| phone | accounts, tenant, brokers | Mask khi log |
| password | accounts | bcrypt (đã OK) |
| front_photo, back_photo | tenant | Pre-signed URL |

---

## 9. Constraints Thiếu

```sql
ALTER TABLE rooms ADD CONSTRAINT chk_rooms_price CHECK (price >= 0);
ALTER TABLE rooms ADD CONSTRAINT chk_rooms_area CHECK (area > 0);
ALTER TABLE contracts ADD CONSTRAINT chk_contract_price CHECK (price >= 0);
ALTER TABLE meter_readings ADD CONSTRAINT chk_meter_order CHECK (new_index >= old_index);
ALTER TABLE bulletin_board_reviews ADD CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5);
```

---

## 10. ENUM Values Cần Chuẩn Hóa

| Enum | Hiện tại | Đề xuất |
|------|---------|---------|
| ContractStatus | `ACTIVE, ENDED, IATExpire, Stake, ReportEnd` | `ACTIVE, ENDED, EXPIRING, DEPOSITED, TERMINATED` |
| rooms.status | `Boolean` | → ENUM `AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED` |

---

## 11. Migration Plan

| File | Nội dung | Ưu tiên |
|------|---------|---------|
| V6__soft_delete.sql | Thêm `is_deleted`, `deleted_at` | 🔴 NGAY |
| V7__fix_money_types.sql | DOUBLE → DECIMAL; Java Double → BigDecimal | 🔴 NGAY |
| V8__add_indexes.sql | Full-text, composite indexes | 🟠 Sprint 2 |
| V9__check_constraints.sql | CHECK constraints | 🟠 Sprint 2 |
| V10__create_audit_logs.sql | Bảng audit_logs | 🟠 Sprint 2 |
| V11__fix_enum_values.sql | Chuẩn hóa ENUM | 🟡 Sprint 3 |
| V12__rename_tables.sql | tenant→tenants, motel_device→motel_devices... | 🟡 Sprint 3 |
| V13__refactor_hearts.sql | Gộp hearts → user_favorites | 🟡 Sprint 3 |

---

## 12. Điểm Đánh Giá

| Tiêu chí | Điểm tối đa | Hiện tại | Nhận xét |
|----------|------------|---------|---------|
| Naming Conventions | 10 | 5 | 14+ bảng sai convention |
| Primary Key Strategy | 10 | 8 | UUID đúng |
| Soft Delete | 10 | 3 | Thiếu trên hầu hết bảng |
| Data Types | 10 | 4 | DOUBLE cho tiền, Java Double cho BigDecimal |
| Normalization | 10 | 7 | address cần chuẩn hóa |
| FK & Relationships | 10 | 6 | Bug contract_services, circular hearts |
| Index Strategy | 10 | 7 | Có index cơ bản, thiếu full-text |
| Security & Audit | 10 | 2 | Không audit_logs |
| Constraints | 10 | 3 | Không CHECK |
| Migration | 10 | 7 | Flyway OK nhưng cần thêm nhiều |
| **TỔNG** | **100** | **52/100** | Cần cải thiện đáng kể |

---

*RRMS Database Design Standard v2.1 | Updated April 2026*
