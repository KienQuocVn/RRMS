# CHƯƠNG III: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG (SYSTEM ANALYSIS AND DESIGN)

---

## 3.1. PHÂN TÍCH YÊU CẦU HỆ THỐNG (SYSTEM REQUIREMENTS ANALYSIS)

### 3.1.1. Xác định các tác nhân hệ thống (Actors)

Hệ thống RRMS phục vụ bốn nhóm tác nhân chính với các vai trò, quyền hạn và luồng tương tác hoàn toàn khác biệt nhau:

| STT | Tác nhân | Mã vai trò | Mô tả nghiệp vụ |
|:---:|:---|:---:|:---|
| 1 | **Quản trị viên hệ thống** (Admin) | `ROLE_ADMIN` | Quản lý toàn bộ hệ thống: tài khoản người dùng, phân quyền, kiểm duyệt nội dung bài đăng và đánh giá, theo dõi thống kê tổng quan toàn nền tảng |
| 2 | **Chủ nhà trọ** (Host/Landlord) | `ROLE_HOST` | Quản lý khu trọ và phòng trọ, lập hợp đồng điện tử, chốt chỉ số điện nước, xuất hóa đơn định kỳ, xem báo cáo doanh thu tài chính |
| 3 | **Khách thuê trọ** (Tenant/Customer) | `ROLE_CUSTOMER` | Tìm kiếm phòng trọ, đặt cọc giữ chỗ, ký hợp đồng trực tuyến, thanh toán hóa đơn qua cổng thanh toán điện tử, gửi phản ánh sự cố |
| 4 | **Người môi giới** (Broker) | `ROLE_BROKER` | Ký gửi phòng trọ từ chủ trọ, đăng tin tuyển khách thuê, theo dõi trạng thái phòng trống, nhận hoa hồng khi môi giới thành công |

> **Ghi chú:** Cấu trúc phân quyền được triển khai thực tế trong bảng `roles` (enum: `ADMIN`, `BROKER`, `CUSTOMER`, `EMPLOYEE`, `GUEST`, `HOST`) và bảng liên kết `auths` trong schema cơ sở dữ liệu RRMS. Annotation `@PreAuthorize` trên từng Controller thực thi phân quyền tại tầng API.

---

### 3.1.2. Danh sách yêu cầu chức năng (Functional Requirements)

Dựa trên phân tích toàn bộ 39 REST API Controllers của backend Spring Boot và các trang giao diện React Web Frontend, hệ thống RRMS cần đáp ứng các nhóm chức năng sau:

#### Nhóm chức năng dành cho Quản trị viên (Admin)

| Mã | Tên chức năng | API Endpoint | Mức độ ưu tiên |
|:---|:---|:---|:---:|
| A-801 | Xem bảng điều khiển quản trị tổng quan (Dashboard) | `GET /statistics/*`, `GET /report/*` | Cao |
| A-802 | Quản lý bài đăng tin phòng trọ | `GET/PUT /bulletin-boards` | Cao |
| A-803 | Quản lý tài khoản người dùng và phân quyền | `GET/POST/PUT/DELETE /api/v1/accounts` | Cao |
| A-804 | Quản lý hợp đồng và hóa đơn toàn hệ thống | `GET /contracts`, `GET /invoices` | Trung bình |
| R-703 | Kiểm duyệt đánh giá và bình luận bài đăng | `GET/PUT /bulletin-board-reviews` | Cao |

#### Nhóm chức năng dành cho Chủ trọ (Host)

| Mã | Tên chức năng | API Endpoint | Mức độ ưu tiên |
|:---|:---|:---|:---:|
| H-501 | Quản lý khu trọ (CRUD Motel) | `GET/POST/PUT/DELETE /api/v1/motels` | Cao |
| H-502 | Quản lý phòng trọ (CRUD Room) | `GET/POST/PUT/DELETE /api/v1/rooms` | Cao |
| H-503 | Quản lý thiết bị khu trọ | `GET/POST/PUT/DELETE /api/v1/motel-devices` | Trung bình |
| H-504 | Quản lý dịch vụ tiện ích phòng trọ | `GET/POST/PUT /api/v1/motel-services` | Cao |
| H-505 | Lập và quản lý hợp đồng điện tử | `POST/PUT/DELETE /contracts` | Cao |
| H-506 | Chốt chỉ số điện nước (Meter Reading) | `POST/PUT /meter-readings` | Cao |
| H-507 | Tạo và xuất hóa đơn dịch vụ hàng tháng | `POST /invoices/create`, `GET /invoices/{id}/generate-qr` | Cao |
| H-508 | Xem báo cáo tài chính khu trọ | `GET /report/{motelId}/total-paid-invoices` | Cao |
| H-509 | Quản lý đặt cọc giữ chỗ phòng | `GET/POST/PUT /room-reservations` | Trung bình |
| H-510 | Quản lý mẫu hợp đồng | `GET/POST/PUT /contract-templates` | Thấp |

#### Nhóm chức năng dành cho Khách thuê (Tenant/Customer)

| Mã | Tên chức năng | API Endpoint | Mức độ ưu tiên |
|:---|:---|:---|:---:|
| T-601 | Tìm kiếm phòng trọ đa bộ lọc | `GET /api/v1/search?query=&district=&minPrice=&maxPrice=` | Cao |
| T-602 | Xem chi tiết bài đăng tin phòng trọ | `GET /bulletin-boards/{id}` | Cao |
| T-603 | Đặt cọc giữ chỗ phòng trọ | `POST /room-reservations` | Cao |
| T-604 | Ký hợp đồng thuê nhà trực tuyến | `PUT /contracts/{contractId}` | Cao |
| T-605 | Xem và thanh toán hóa đơn | `GET /invoices`, `POST /payment/*` | Cao |
| T-606 | Thanh toán qua Stripe | `POST /payment/stripe/create` | Cao |
| T-607 | Thanh toán qua VNPay | `POST /payment/vnpay/create` | Cao |
| T-608 | Thanh toán qua MoMo | `POST /payment/momo/create` | Cao |
| T-609 | Thanh toán qua PayPal | `POST /payment/paypal/create` | Trung bình |
| T-610 | Đánh giá bài đăng tin phòng trọ | `POST /bulletin-board-reviews` | Trung bình |
| T-611 | Gửi yêu cầu hỗ trợ kỹ thuật | `POST /support` | Thấp |

---

### 3.1.3. Yêu cầu phi chức năng (Non-Functional Requirements)

| Mã | Loại | Nội dung yêu cầu | Giải pháp kỹ thuật áp dụng |
|:---|:---|:---|:---|
| NF-01 | **Hiệu năng** | Thời gian phản hồi tìm kiếm phòng trọ ≤ 200ms với ≥ 100,000 bản ghi | Elasticsearch Inverted Index, Redis Cache |
| NF-02 | **Bảo mật** | Xác thực và phân quyền theo chuẩn OAuth2 + JWT | Spring Security Filter Chain, JWT HS256 |
| NF-03 | **Bảo mật tài chính** | Chống giả mạo webhook thanh toán từ bên thứ ba | HMAC-SHA256/SHA512 Signature Verification |
| NF-04 | **Khả dụng** | Hệ thống hoạt động 24/7 (Uptime ≥ 99.5%) | Docker Compose, Health Check endpoints |
| NF-05 | **Mở rộng** | Hỗ trợ thêm cổng thanh toán mới không ảnh hưởng core | Kiến trúc phân lớp (Layered Architecture) |
| NF-06 | **Đa nền tảng** | Web + Mobile chạy từ cùng một backend API | RESTful API chuẩn hóa, CORS configuration |
| NF-07 | **Toàn vẹn dữ liệu** | Đảm bảo ACID cho các giao dịch tài chính | `@Transactional` (Hibernate), MySQL InnoDB |
| NF-08 | **Kiểm toán** | Ghi nhận toàn bộ hành động thay đổi dữ liệu quan trọng | `audit_logs` table + Spring AOP Aspects |

---

## 3.2. ĐẶC TẢ CHI TIẾT CÁC CHỨC NĂNG CỐT LÕI (SOFTWARE REQUIREMENTS SPECIFICATION)

Các bảng đặc tả dưới đây được ánh xạ chính xác từ mô hình E-commerce mẫu của trường sang nghiệp vụ quản lý nhà trọ RRMS, dựa trực tiếp trên cấu trúc cơ sở dữ liệu `V1__baseline.sql` và mã nguồn 39 REST Controller hiện tại của dự án.

---

### 3.2.1. Function R-703 — Kiểm duyệt đánh giá và bình luận bài đăng tin phòng trọ

| Thuộc tính | Nội dung |
|:---|:---|
| **Mã Function** | **R-703** |
| **Vai trò thực thi** | Admin (`ROLE_ADMIN`) |
| **Mô tả** | Cho phép Admin kiểm duyệt, phê duyệt, chỉnh sửa hoặc từ chối các đánh giá (`bulletin_board_reviews`) và bình luận của khách thuê trọ đối với các bài đăng tin phòng trọ (`bulletin_boards`) trước khi nội dung đó được hiển thị công khai trên Mobile App. |
| **Điều kiện tiên quyết** | (1) Admin đã đăng nhập thành công và JWT token có `role = ROLE_ADMIN`.<br>(2) Tồn tại ít nhất một bản ghi trong bảng `bulletin_board_reviews` chưa được xử lý. |
| **Điều kiện hậu** | Bản ghi trong bảng `bulletin_board_reviews` được cập nhật trường `status` tương ứng. Hành động kiểm duyệt được ghi nhận trong `audit_logs` thông qua cơ chế AOP (`aspects/` trong Spring Boot). |

**Luồng xử lý chính (Main Flow):**

| Bước | Tác nhân | Hành động | Tầng kỹ thuật liên quan |
|:---:|:---:|:---|:---|
| 1 | Admin | Đăng nhập vào hệ thống Web Admin, truy cập phân hệ "Kiểm duyệt đánh giá" | Frontend: `pages/admin/AdminManageBoard.jsx` |
| 2 | Hệ thống | Gọi API `GET /bulletin-board-reviews?username={admin}` lấy danh sách đánh giá đang chờ kiểm duyệt từ bảng `bulletin_board_reviews` | Controller: `BulletinBoardReviewsController.java` |
| 3 | Admin | Xem chi tiết từng bản ghi đánh giá: nội dung (`content`), số sao (`rating` từ 1-5), tên người đánh giá (`account_id`), bài đăng bị đánh giá (`bulletin_board_id`) | Service: `IBulletinBoardReviews` |
| 4a | Admin | **Phê duyệt**: Click "Phê duyệt" → Hệ thống cập nhật đánh giá thành trạng thái `APPROVED`, hiển thị công khai trên Mobile | `bulletinBoardReviewsService.createOrUpdateBulletinBoardReviews(request)` |
| 4b | Admin | **Từ chối**: Click "Từ chối" → Nhập lý do từ chối → Hệ thống cập nhật trạng thái `REJECTED`, ẩn khỏi giao diện công khai | `DELETE /bulletin-board-reviews/{id}` |
| 4c | Admin | **Chỉnh sửa & Phê duyệt**: Sửa nội dung không phù hợp trong ô văn bản → Click "Lưu và Phê duyệt" → Hệ thống cập nhật `content` mới và set `APPROVED` | `POST /bulletin-board-reviews` (createOrUpdate) |
| 5 | Hệ thống | Ghi nhận lịch sử kiểm duyệt vào bảng `audit_logs` thông qua Spring AOP Aspect: `table_name='bulletin_board_reviews'`, `action='UPDATE'`, `actor_id={admin_username}`, `new_values={JSON}` | `aspects/` + `audit_logs` table |
| 6 | Hệ thống | Hiển thị thông báo Toast xác nhận hành động thành công trên giao diện Web Admin | React: MUI `<Snackbar>` component |

**Luồng thay thế (Alternate Flow):**
- **AF-1**: Không có đánh giá nào chờ kiểm duyệt → Hệ thống hiển thị màn hình rỗng với thông báo "Không có đánh giá nào cần kiểm duyệt".
- **AF-2**: Admin thực hiện thao tác từ chối mà không nhập lý do → Frontend validation bắt buộc điền lý do trước khi cho phép submit.

**Cấu trúc bảng dữ liệu liên quan:**
```sql
-- Bảng lưu đánh giá bài đăng tin phòng trọ
bulletin_board_reviews (
    bulletin_board_reviews_id  BINARY(16) PK,
    rating                     INTEGER CHECK (rating BETWEEN 1 AND 5),
    content                    TEXT,
    bulletin_board_id          BINARY(16) FK → bulletin_boards,
    account_id                 VARCHAR(255) FK → accounts(username)
)

-- Bảng kiểm toán hành động hệ thống
audit_logs (
    id           BIGINT AUTO_INCREMENT PK,
    table_name   VARCHAR(100),
    record_id    VARCHAR(36),
    action       ENUM('INSERT','UPDATE','DELETE'),
    old_values   JSON,
    new_values   JSON,
    actor_id     VARCHAR(255),
    actor_role   VARCHAR(50),
    ip_address   VARCHAR(45),
    created_at   DATETIME(6)
)
```

---

### 3.2.2. Function A-801 — Xem bảng điều khiển quản trị tổng quan (Admin & Host Dashboard)

| Thuộc tính | Nội dung |
|:---|:---|
| **Mã Function** | **A-801** |
| **Vai trò thực thi** | Admin (`ROLE_ADMIN`) / Host (`ROLE_HOST`) |
| **Mô tả** | Hiển thị trang tổng quan phân tích số liệu vận hành hệ thống. Đối với Admin: thống kê toàn nền tảng (tổng tài khoản, tổng khu trọ, biểu đồ tăng trưởng). Đối với Host: báo cáo tài chính và trạng thái lấp đầy phòng trọ thuộc khu trọ cá nhân. |
| **Điều kiện tiên quyết** | Người dùng đã xác thực thành công. JWT token hợp lệ với `role` là `ROLE_ADMIN` hoặc `ROLE_HOST`. |
| **Điều kiện hậu** | Không thay đổi dữ liệu (Read-Only). Dữ liệu thống kê được cached trong Redis để tăng tốc phản hồi (TTL = 5 phút). |

**Luồng xử lý chính (Main Flow):**

| Bước | Tác nhân | Hành động | API Endpoint thực tế |
|:---:|:---:|:---|:---|
| 1 | User | Đăng nhập thành công, hệ thống decode JWT xác định vai trò | `POST /api/v1/auth/login` → Trả về `access_token` + `refresh_token` |
| 2 | Hệ thống | Dựa vào `role` trong JWT, điều hướng đến Dashboard tương ứng | Frontend Router: `src/App.jsx` → `pages/admin/` |
| 3 | Hệ thống | Gọi song song (Promise.all) nhiều API thống kê để render Dashboard | Xem chi tiết bên dưới |

**Các API thống kê Dashboard dành cho Admin:**

| Chỉ số | API Endpoint | Bảng nguồn | Mô tả |
|:---|:---|:---|:---|
| Tổng số tài khoản | `GET /statistics/total-accounts` | `accounts` | `COUNT(*)` toàn bộ accounts |
| Tổng số chủ trọ | `GET /statistics/total-host-accounts` | `accounts` + `auths` + `roles` | Tài khoản có `role_name = HOST` |
| Tổng số khách thuê | `GET /statistics/total-tenants` | `tenants` | `COUNT(*)` bảng tenants |
| Tổng số khu trọ | `GET /statistics/total-motels` | `motels` | `COUNT(*)` khu trọ chưa xóa |
| Tăng trưởng tài khoản 7 ngày | `GET /statistics/total-account-last-week` | `accounts` | Nhóm theo `DayOfWeek` |
| Tăng trưởng tài khoản theo tháng | `GET /statistics/accounts-total-this-year` | `accounts` | Nhóm theo tháng trong năm |
| Khu trọ tạo mới theo tháng | `GET /statistics/total-motel-by-month` | `motels` | Nhóm theo `created_at` |
| Chủ trọ đăng ký gần đây | `GET /statistics/account-recent-hosts` | `accounts` + `auths` | Top 10 chủ trọ mới nhất |

**Các API thống kê Dashboard dành cho Host:**

| Chỉ số | API Endpoint | Bảng nguồn | Mô tả |
|:---|:---|:---|:---|
| Tổng số phòng khu trọ | `GET /report/total-rooms?motelId={id}` | `rooms` | Đếm phòng theo `motel_id` |
| Số phòng theo trạng thái hợp đồng | `GET /report/room-counts` | `rooms` + `contracts` | Nhóm theo `contract.status` |
| Tổng tiền đặt cọc | `GET /report/{motelId}/deposits` | `contracts` | `SUM(deposit)` các HĐ ACTIVE |
| Tổng tiền giữ chỗ | `GET /report/{motelId}/reserve-deposits` | `room_reservations` | `SUM(deposit)` |
| Tổng hóa đơn đã thu | `GET /report/{motelId}/total-paid-invoices` | `invoices` | `SUM(amount)` where `payment_status='PAID'` |
| Tổng tiền phòng đã thu | `GET /report/{motelId}/total-paid-room-price` | `invoices` + `contracts` | Tính tổng doanh thu phòng |
| Tổng số khách đang thuê | `GET /report/{motelId}/tenants/count` | `contract_occupants` | COUNT khách trong HĐ ACTIVE |

| Bước | Mô tả tiếp theo |
|:---:|:---|
| 4 | Frontend React nhận dữ liệu JSON, sử dụng `@mui/x-charts` vẽ **Line Chart** biểu diễn xu hướng tăng trưởng tài khoản/doanh thu theo tháng; **Pie Chart** biểu diễn cơ cấu trạng thái phòng trọ (Trống / Đang thuê / Bảo trì / Giữ chỗ). |
| 5 | Hiển thị bảng "Chủ trọ đăng ký gần đây" với thông tin avatar, tên, ngày đăng ký (dành cho Admin). |
| 6 | Hiển thị các nút truy cập nhanh (Quick Shortcuts): "Tạo hóa đơn", "Duyệt yêu cầu sửa chữa", "Xem báo cáo tháng này". |

---

### 3.2.3. Function A-802 — Quản lý khu trọ và phòng trọ (Motel & Room Management)

| Thuộc tính | Nội dung |
|:---|:---|
| **Mã Function** | **A-802** |
| **Vai trò thực thi** | Host (`ROLE_HOST`) |
| **Mô tả** | Cho phép chủ nhà trọ quản lý toàn bộ danh mục tài sản cho thuê: tạo mới khu trọ và phòng trọ, cấu hình bảng giá dịch vụ (điện, nước, internet, rác), thiết lập danh sách thiết bị bàn giao, upload hình ảnh thực tế và vô hiệu hóa/xóa phòng trọ (Soft Delete). |
| **Điều kiện tiên quyết** | (1) Host đã xác thực thành công với `ROLE_HOST`.<br>(2) Đối với thao tác xóa phòng: phòng không nằm trong hợp đồng nào có `status = 'ACTIVE'`. |
| **Điều kiện hậu** | Bản ghi được lưu/cập nhật trong các bảng: `motels`, `rooms`, `motel_services`, `motel_devices`, `room_images`. Dữ liệu được đồng bộ lên Elasticsearch Index (`bulletin_boards` index) cho mục đích tìm kiếm. |

**Luồng xử lý chính (Main Flow):**

**A. Tạo khu trọ mới (Create Motel):**

| Bước | Hành động | API / Bảng DB |
|:---:|:---|:---|
| 1 | Host truy cập "Quản lý khu trọ" → Click "Thêm khu trọ mới" | Frontend: `pages/admin/ManagerHome/ModalCreateMotel.jsx` |
| 2 | Nhập thông tin bắt buộc: Tên khu trọ (`motel_name`), địa chỉ (`address`), loại phòng (`type_room_id`), ngày xuất hóa đơn (`invoicedate`), hạn thanh toán (`paymentdeadline`) | Validation: `@Valid` annotation |
| 3 | Chọn quy tắc nội quy áp dụng cho khu trọ từ bảng `rules` | `POST /motel-rules` |
| 4 | Thêm danh sách dịch vụ tiện ích: tên dịch vụ, đơn giá, phương thức tính tiền (`chargetype`) | `POST /api/v1/motel-services` → bảng `motel_services` |
| 5 | Thêm danh sách thiết bị kiểm kê: tên thiết bị, đơn vị tính (`unit`: BO/CAI/CAP/CHIEC), nhà cung cấp | `POST /api/v1/motel-devices` → bảng `motel_devices` |
| 6 | Click "Tạo khu trọ" → Backend lưu bản ghi vào bảng `motels` | `POST /api/v1/motels` → `MotelController.createMotel()` |

**B. Tạo phòng trọ (Create Room):**

| Bước | Hành động | API / Bảng DB |
|:---:|:---|:---|
| 1 | Chọn khu trọ, click "Thêm phòng mới" | Frontend: `MotelSettings/` |
| 2 | Nhập thông tin phòng: tên phòng (`name_room`), nhóm phòng (`room_group`), diện tích (`area`), giá thuê (`price`), tiền đặt cọc (`deposit`), mô tả (`description`) | - |
| 3 | Chọn trạng thái phòng ban đầu: `AVAILABLE` / `MAINTENANCE` | `rooms.status` = ENUM |
| 4 | Chọn các dịch vụ áp dụng cho phòng từ danh mục dịch vụ của khu trọ | `POST /api/v1/room-services` → bảng `room_services` |
| 5 | Phân bổ thiết bị cho phòng (số lượng từng thiết bị bàn giao) | `POST /api/v1/room-devices` → bảng `room_devices` |
| 6 | Upload hình ảnh thực tế của phòng | `POST /api/v1/room-images` → bảng `room_images` |
| 7 | Submit → Backend tạo bản ghi phòng mới | `POST /api/v1/rooms` → `RoomController.createRoom()` |

**C. Chỉnh sửa thông tin phòng (Update Room):**
- Chọn phòng cần cập nhật → Sửa các thông số (giá cả, mô tả, thiết bị) → `PUT /api/v1/rooms/{roomId}` → Cập nhật `rooms`, `room_services`, `room_devices`.

**D. Vô hiệu hóa/Xóa phòng (Soft Delete):**
- Hệ thống kiểm tra ràng buộc: `SELECT COUNT(*) FROM contracts WHERE room_id = ? AND status = 'ACTIVE'`.
- Nếu có hợp đồng active: Trả về lỗi 400 "Phòng đang có khách thuê, không thể xóa".
- Nếu hợp lệ: `DELETE /api/v1/rooms/{roomId}` → `roomService.deleteRoomStandard(roomId)` thực hiện Soft Delete (`is_deleted = true`).

**Cấu trúc bảng dữ liệu liên quan:**
```sql
motels (
    motel_id        BINARY(16) PK,
    motel_name      VARCHAR(255),
    address         NVARCHAR(255),
    invoicedate     INT,           -- Ngày chốt hóa đơn hàng tháng
    paymentdeadline INT,           -- Số ngày hạn thanh toán
    type_room_id    BINARY(16) FK → type_rooms,
    username        VARCHAR(255) FK → accounts,
    average_price   DECIMAL(10,2),
    is_deleted      BOOLEAN DEFAULT FALSE
)

rooms (
    room_id     BINARY(16) PK,
    motel_id    BINARY(16) FK → motels,
    name_room   NVARCHAR(255),
    room_group  NVARCHAR(255),
    area        INT,
    price       DECIMAL(10,2) CHECK (price >= 0),
    deposit     DECIMAL(10,2) CHECK (deposit >= 0),
    status      ENUM('AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'),
    is_deleted  BOOLEAN DEFAULT FALSE
)

motel_services (
    motel_service_id  BINARY(16) PK,
    motel_id          BINARY(16) FK → motels,
    name_service      NVARCHAR(255),
    price             DECIMAL(10,2),
    chargetype        VARCHAR(255)  -- Tính theo người/phòng/chỉ số
)
```

---

### 3.2.4. Function A-803 — Quản lý tài khoản người dùng và phân quyền

| Thuộc tính | Nội dung |
|:---|:---|
| **Mã Function** | **A-803** |
| **Vai trò thực thi** | Admin (`ROLE_ADMIN`) |
| **Mô tả** | Cho phép Admin quản trị toàn bộ tài khoản người dùng trên hệ thống: xem danh sách phân trang, tạo tài khoản nội bộ, tìm kiếm, thay đổi vai trò (Role), kích hoạt/vô hiệu hóa tài khoản và xem lịch sử hoạt động qua audit logs. |
| **Điều kiện tiên quyết** | (1) Admin đã xác thực với `ROLE_ADMIN`.<br>(2) Đối với thao tác khóa tài khoản: không được phép tự khóa chính tài khoản Admin đang đăng nhập. |
| **Điều kiện hậu** | Bản ghi trong bảng `accounts` và bảng liên kết `auths` được cập nhật theo hành động. Nếu khóa tài khoản, toàn bộ JWT token đang hoạt động của tài khoản đó được thu hồi thông qua bảng `invalidated_tokens`. |

**Luồng xử lý chính (Main Flow):**

**A. Xem danh sách tài khoản (Paginated List):**

| Bước | Hành động | API |
|:---:|:---|:---|
| 1 | Admin truy cập "Quản lý tài khoản người dùng" | Frontend: `pages/admin/AdminManage/` |
| 2 | Hệ thống gọi API phân trang lấy danh sách tài khoản | `GET /api/v1/accounts?page=0&size=20&sortBy=created_at&sortDirection=DESC` |
| 3 | Lọc theo vai trò cụ thể (chỉ xem Host) | `GET /api/v1/accounts/by-host-role?page=0&size=20` |
| 4 | Tìm kiếm theo tên/email/số điện thoại | `GET /api/v1/accounts/search?search={keyword}&page=0&size=20` |

**B. Tạo tài khoản nội bộ mới:**

| Bước | Hành động | Chi tiết kỹ thuật |
|:---:|:---|:---|
| 1 | Click "Thêm người dùng" | Mở form dialog |
| 2 | Nhập: `username` (số điện thoại), `password`, `fullname`, `email`, `phone`, `gender` | Bean Validation: `@Valid AccountRequest` |
| 3 | Chọn vai trò cho tài khoản (`ADMIN`/`HOST`/`CUSTOMER`/`BROKER`) | Enum `Roles` trong Spring |
| 4 | Submit → Backend mã hóa `password` bằng BCrypt | `POST /api/v1/accounts` → `accountService.createAccount(request)` |
| 5 | Hệ thống tạo bản ghi trong `accounts` và liên kết vai trò trong `auths` | Lưu vào DB + log vào `audit_logs` |

**C. Phân quyền và thay đổi vai trò:**
- Chọn tài khoản → Thay đổi vai trò → `PUT /api/v1/accounts/{username}` → `accountService.updateAccount(username, request)` → Cập nhật bảng `auths` (xóa role cũ, thêm role mới).

**D. Khóa/Mở khóa tài khoản:**
- Chọn tài khoản đích → `PUT /api/v1/accounts/{username}` với `is_deleted = true` → Thu hồi token: lưu `token_id` vào bảng `invalidated_tokens` với `expiry_time = now()`. Filter của Spring Security sẽ từ chối toàn bộ request có token này.

**E. Xem thông tin chi tiết:**
- `GET /api/v1/accounts/{username}` → `accountService.findByUsername(username)`.

**Cấu trúc bảng dữ liệu liên quan:**
```sql
accounts (
    username        VARCHAR(255) PK,    -- Số điện thoại
    fullname        VARCHAR(255),
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(200) UNIQUE,
    password        VARCHAR(255),       -- BCrypt hash
    avatar          VARCHAR(255),
    cccd            VARCHAR(15),
    gender          ENUM('MALE','FEMALE','OTHER'),
    birthday        DATE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      DATETIME(6)
)

auths (
    auth_id   BINARY(16) PK,
    username  VARCHAR(255) FK → accounts,
    role_id   BINARY(16) FK → roles
)

roles (
    role_id    BINARY(16) PK,
    role_name  ENUM('ADMIN','BROKER','CUSTOMER','EMPLOYEE','GUEST','HOST'),
    description TEXT
)

invalidated_tokens (
    id          VARCHAR(255) PK,  -- JWT ID (jti claim)
    expiry_time DATETIME(6)
)
```

---

### 3.2.5. Function A-804 — Quản lý hợp đồng và hóa đơn dịch vụ (Contract & Invoice Management)

| Thuộc tính | Nội dung |
|:---|:---|
| **Mã Function** | **A-804** |
| **Vai trò thực thi** | Host (`ROLE_HOST`) — Quản lý HĐ của khu trọ cá nhân / Admin (`ROLE_ADMIN`) — Xem toàn bộ |
| **Mô tả** | Quản lý toàn bộ vòng đời thuê phòng: lập hợp đồng điện tử có OCR trích xuất thông tin CCCD, theo dõi trạng thái hợp đồng (ACTIVE/EXPIRING/ENDED/TERMINATED), chốt chỉ số điện nước hàng tháng, tạo hóa đơn PDF kèm QR code thanh toán, xử lý thanh toán qua 4 cổng tích hợp và đối soát tự động. |
| **Điều kiện tiên quyết** | (1) Người dùng đã xác thực với `ROLE_HOST` hoặc `ROLE_ADMIN`.<br>(2) Hợp đồng/hóa đơn tồn tại trong CSDL.<br>(3) Thanh toán: hóa đơn phải có `payment_status = 'UNPAID'`. |
| **Điều kiện hậu** | Trạng thái hợp đồng/hóa đơn được cập nhật trong DB. Lịch sử giao dịch được ghi nhận trong bảng `transactions`. Thông báo email tự động gửi đến khách thuê qua `IMailService`. |

**Luồng xử lý chính (Main Flow):**

**A. Tạo hợp đồng điện tử (Create Contract):**

| Bước | Hành động | Chi tiết kỹ thuật |
|:---:|:---|:---|
| 1 | Host chọn phòng trống → click "Tạo hợp đồng" | Frontend: `ManagerHome/DetailRoom/` |
| 2 | Chụp ảnh CCCD của khách thuê → Module AI OCR trích xuất thông tin tự động điền vào form | Tích hợp AI: `pages/AI/` trong Web Frontend |
| 3 | Nhập thông tin hợp đồng: ngày vào ở (`movein_date`), thời hạn thuê (`lease_term`), giá thuê (`price`), tiền đặt cọc (`deposit`), mô tả nội quy | `ContractRequest` DTO validation |
| 4 | Thêm danh sách thành viên cùng ở (nhiều người) | Bảng `contract_occupants`: `tenant_id` FK → `tenants` |
| 5 | Chọn mẫu hợp đồng (`contract_templates`) và ký số | Bảng `contract_templates` |
| 6 | Submit → Tạo hợp đồng với `status = 'ACTIVE'` | `POST /contracts` → `contractService.createContract(request)` |
| 7 | Hệ thống tự động đổi `rooms.status = 'OCCUPIED'` | Trigger trong Service layer |
| 8 | Gửi email thông báo đến khách thuê | `IMailService.sendMail()` |

**B. Cập nhật trạng thái hợp đồng (Update Contract Status):**

```
ACTIVE → EXPIRING (khi còn ≤ 30 ngày đến ngày kết thúc, Scheduled Job tự động)
ACTIVE → ENDED   (khi đến ngày kết thúc hợp đồng)
ACTIVE → TERMINATED (Host chấm dứt hợp đồng sớm)
```

- API: `PUT /contracts/update-status?roomId={id}&newStatus={status}&reportCloseDate={date}`
- Scheduled Job: `contractService.updateContractsBasedOnDaysDifference(newStatus, thresholdDays)`

**C. Chốt chỉ số điện nước (Meter Reading):**

| Bước | Hành động | Bảng DB |
|:---:|:---|:---|
| 1 | Host vào phần "Chốt số điện nước" → chọn tháng chốt | Frontend: `MotelSettings/` |
| 2 | Nhập chỉ số mới cho từng phòng (`new_index`) | - |
| 3 | Hệ thống tính `usage_amount = new_index - old_index` | `MeterReadingController` |
| 4 | Lưu bản ghi chỉ số vào DB | `POST /meter-readings` → bảng `meter_readings` |

**D. Tạo và gửi hóa đơn (Create Invoice):**

| Bước | Hành động | Chi tiết kỹ thuật |
|:---:|:---|:---|
| 1 | Host click "Tạo hóa đơn tháng" | - |
| 2 | Hệ thống tổng hợp: tiền phòng + tiền điện (`usage × electricity_price`) + tiền nước (`usage × water_price`) + dịch vụ khác | `invoiceService.createInvoice(request)` |
| 3 | Lưu hóa đơn vào `invoices` (`payment_status = 'UNPAID'`), chi tiết vào `invoice_service_details` | `POST /invoices/create` |
| 4 | Tạo mã QR thanh toán nhanh | `GET /invoices/{id}/generate-qr` → `QRCodeService.generateQRCodeImage()` |
| 5 | Gửi email kèm PDF hóa đơn và QR code cho khách thuê | `IMailService` |

**E. Thu tiền và Đối soát (Payment Collection):**

| Phương thức | Quy trình |
|:---|:---|
| **Thu tiền trực tiếp** | `PATCH /invoices/{invoiceId}/collect-payment` → `invoiceService.collectPayment(invoiceId, request)` → `payment_status = 'PAID'` |
| **Stripe** | `POST /payment/stripe/create` → Tạo `PaymentIntent` → Client dùng Stripe Elements → Webhook callback |
| **VNPay** | `POST /payment/vnpay/create` → Tạo URL ký SHA512 → Redirect → `GET /payment/vnpay-callback` xác thực chữ ký |
| **MoMo** | `POST /payment/momo/create` → Tạo `payUrl` HMAC-SHA256 → Redirect → IPN callback |
| **PayPal** | `POST /payment/paypal/create` → Tạo `Payment` → approval_url redirect → Execute |

**Cấu trúc bảng dữ liệu liên quan:**
```sql
contracts (
    contract_id       BINARY(16) PK,
    room_id           BINARY(16) FK → rooms,
    tenant_id         BINARY(16) FK → tenants,
    broker_id         BINARY(16) FK → brokers (nullable),
    contracttemplate_id BINARY(16) FK → contract_templates,
    movein_date       DATE,
    close_contract    DATE,
    lease_term        TEXT,
    price             DECIMAL(10,2) CHECK (price >= 0),
    deposit           DECIMAL(10,2) CHECK (deposit >= 0),
    debt              DECIMAL(10,2),
    status            ENUM('ACTIVE','ENDED','EXPIRING','TERMINATED'),
    username          VARCHAR(255) FK → accounts
)

invoices (
    invoice_id           BINARY(16) PK,
    contract_id          BINARY(16) FK → contracts,
    tenant_id            BINARY(16) FK → tenants,
    invoice_create_date  DATE,
    invoice_create_month VARCHAR(7),   -- Format: YYYY-MM
    due_date             DATE,
    payment_status       VARCHAR(10),  -- UNPAID / PAID / CANCELLED
    invoice_reason       VARCHAR(100),
    deposit              DECIMAL(10,2),
    is_deleted           BOOLEAN DEFAULT FALSE
)

invoice_service_details (
    detail_id       BINARY(16) PK,
    invoice_id      BINARY(16) FK → invoices,
    service_name    VARCHAR(50),
    consumption     DECIMAL(10,2),
    service_price   DECIMAL(10,2)
)

meter_readings (
    meter_reading_id  BINARY(16) PK,
    room_id           BINARY(16) FK → rooms,
    service_id        BINARY(16) FK → services,
    old_index         DECIMAL(10,3),
    new_index         DECIMAL(10,3) CHECK (new_index >= 0),
    usage_amount      DECIMAL(10,3) CHECK (usage_amount >= 0),
    reading_date      DATE,
    image_url         VARCHAR(255)
)

transactions (
    transaction_id       BINARY(16) PK,
    invoice_id           BINARY(16) FK → invoices,
    username             VARCHAR(255) FK → accounts,
    amount               DECIMAL(10,2),
    transaction_date     DATE,
    transaction_type     BIT,    -- 1=Thu / 0=Chi
    category             VARCHAR(100),
    payer_name           VARCHAR(100),
    payment_description  VARCHAR(255)
)
```

---

## 3.3. SƠ ĐỒ CA SỬ DỤNG TỔNG QUAN (USE CASE DIAGRAM)

Sơ đồ ca sử dụng dưới đây mô tả mối quan hệ giữa 4 tác nhân chính và các phân hệ chức năng trong hệ thống RRMS, được trình bày theo chuẩn UML 2.5:

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                     HỆ THỐNG RRMS - RENTAL ROOM MANAGEMENT                      ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────┐     ║
║  │                     PHÂN HỆ XÁC THỰC (AUTH)                            │     ║
║  │   UC-01: Đăng ký tài khoản         UC-02: Đăng nhập (Phone/Password)   │     ║
║  │   UC-03: Đăng nhập Google OAuth2   UC-04: Đặt lại mật khẩu (OTP)       │     ║
║  └─────────────────────────────────────────────────────────────────────────┘     ║
║                                                                                  ║
║  ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   ║
║  │  PHÂN HỆ ADMIN       │    │  PHÂN HỆ HOST         │    │ PHÂN HỆ TENANT   │  ║
║  │                      │    │                       │    │                  │   ║
║  │ UC-11: Dashboard     │    │ UC-21: Quản lý Motel  │    │ UC-31: Tìm phòng │  ║
║  │ UC-12: Quản lý TK    │    │ UC-22: Quản lý Room   │    │ UC-32: Đặt cọc   │  ║
║  │ UC-13: Kiểm duyệt    │    │ UC-23: Quản lý HĐ     │    │ UC-33: Ký HĐ     │  ║
║  │         Review       │    │ UC-24: Chốt điện nước │    │ UC-34: Thanh toán│  ║
║  │ UC-14: Duyệt tin     │    │ UC-25: Tạo hóa đơn    │    │ UC-35: Đánh giá  │  ║
║  │         đăng         │    │ UC-26: Xem báo cáo    │    │ UC-36: Hỗ trợ    │  ║
║  │ UC-15: Thống kê      │    │ UC-27: Quản lý đặt cọc│    │                  │   ║
║  │         hệ thống     │    │ UC-28: Quản lý thiết bị│   │                  │   ║
║  └──────────────────────┘    └──────────────────────┘    └──────────────────┘   ║
║                                                                                  ║
║  ┌─────────────────────────┐                                                     ║
║  │   PHÂN HỆ BROKER        │                                                     ║
║  │ UC-41: Ký gửi phòng     │                                                     ║
║  │ UC-42: Tìm khách thuê   │                                                     ║
║  └─────────────────────────┘                                                     ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  [Admin] ──► UC-11, UC-12, UC-13, UC-14, UC-15, UC-01, UC-02
  [Host]  ──► UC-21, UC-22, UC-23, UC-24, UC-25, UC-26, UC-27, UC-28, UC-01, UC-02
  [Tenant]──► UC-31, UC-32, UC-33, UC-34, UC-35, UC-36, UC-01, UC-02, UC-03
  [Broker]──► UC-41, UC-42, UC-31, UC-01, UC-02

  <<include>> UC-23 (Quản lý HĐ) ──include──► UC-24 (Chốt điện nước)
  <<include>> UC-25 (Tạo hóa đơn) ──include──► UC-34 (Thanh toán)
  <<extend>>  UC-13 (Kiểm duyệt) ──extend──► UC-14 (Duyệt tin đăng)
```

---

## 3.4. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE DESIGN)

### 3.4.1. Mô hình quan hệ thực thể (Entity Relationship Diagram — ERD)

Hệ thống RRMS sử dụng **MySQL 8.x** với cơ chế lưu trữ **InnoDB** để đảm bảo hỗ trợ giao dịch ACID và khóa ngoại tham chiếu. Toàn bộ schema được quản lý phiên bản bởi **Flyway Migration** (`V1__baseline.sql`, `V2__add_account_representative_fields.sql`, `V3__add_tenant_id_to_cars.sql`).

Cơ sở dữ liệu gồm **50+ bảng** được nhóm thành 7 nhóm chức năng:

#### Nhóm 1: Quản lý Tài khoản & Phân quyền

```
accounts ──1:N──► auths ──N:1──► roles ──N:M──► permissions
     │                                         (qua roles_permissions)
     │
     └──N:M──► bulletin_boards (user_favorites)
     └──1:N──► search_histories
     └──1:N──► motels (username FK)
     └──1:N──► contracts (username FK)
```

#### Nhóm 2: Quản lý Tài sản (Motel & Room)

```
type_rooms ──1:N──► motels ──1:N──► rooms ──1:N──► room_images
                      │               │              ──1:N──► room_services
                      │               │              ──1:N──► room_devices
                      │               │              ──1:N──► room_reviews
                      │               │              ──1:N──► room_reservations
                      ├──1:N──► motel_services       ──1:N──► cars
                      ├──1:N──► motel_devices
                      └──1:N──► contract_templates
```

#### Nhóm 3: Quản lý Hợp đồng (Contract)

```
contracts ──N:1──► rooms
          ──N:1──► tenants
          ──N:1──► brokers
          ──N:1──► contract_templates
          ──1:N──► contract_occupants ──N:1──► tenants
          ──1:N──► contract_devices   ──N:1──► motel_devices
          ──1:N──► contract_device_handovers
          ──1:N──► contract_services  ──N:1──► motel_services
          ──1:N──► invoices
```

#### Nhóm 4: Quản lý Hóa đơn & Thanh toán (Invoice & Payment)

```
invoices ──N:1──► contracts
         ──N:1──► tenants
         ──1:N──► detail_invoices ──N:1──► room_services / room_devices
         ──1:N──► invoice_service_details
         ──1:N──► invoice_additional_charges
         ──1:N──► transactions

payments ──(standalone, ghi nhận lịch sử thanh toán)
```

#### Nhóm 5: Quản lý Bài đăng & Đánh giá (Bulletin Board)

```
bulletin_boards ──N:1──► accounts (username)
                ──1:N──► bulletin_board_images
                ──1:N──► bulletin_board_reviews ──N:1──► accounts
                ──1:N──► bulletin_board_rules   ──N:1──► rules
                ──1:N──► bulletin_board_rental_amenities ──N:1──► rental_amenities
```

#### Nhóm 6: Đo đạc & Dịch vụ (Meter & Service)

```
meter_readings ──N:1──► rooms
               ──N:1──► services

motel_services ──N:1──► motels
               ──N:1──► name_motel_services (danh mục tên dịch vụ chuẩn)
```

#### Nhóm 7: Hỗ trợ & Thông báo (Support & Notification)

```
notifications ──N:1──► accounts (username_landlord)
              ──1:N──► notification_rooms ──N:1──► rooms

supports ──N:1──► accounts

temporary_contracts ──N:1──► motels
                    ──N:1──► accounts (username_tenant)
```

---

### 3.4.2. Thiết kế chi tiết các bảng quan trọng

#### Bảng `accounts` — Tài khoản người dùng

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|:---|:---|:---|:---|
| `username` | VARCHAR(255) | PK | Số điện thoại, dùng làm username đăng nhập |
| `fullname` | VARCHAR(255) | - | Họ và tên đầy đủ |
| `email` | VARCHAR(255) | UNIQUE | Email người dùng |
| `phone` | VARCHAR(200) | UNIQUE | Số điện thoại liên hệ |
| `password` | VARCHAR(255) | - | Mật khẩu được mã hóa BCrypt |
| `avatar` | VARCHAR(255) | - | URL ảnh đại diện |
| `cccd` | VARCHAR(15) | INDEX | Căn cước công dân |
| `gender` | ENUM | - | MALE / FEMALE / OTHER |
| `birthday` | DATE | - | Ngày sinh |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |
| `created_at` | DATETIME(6) | - | Thời gian tạo (kế thừa từ `BaseEntity`) |

**Chỉ mục:** `idx_account_cccd` (INDEX), `idx_account_email` (UNIQUE), `idx_account_phone` (UNIQUE)

#### Bảng `contracts` — Hợp đồng thuê phòng

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|:---|:---|:---|:---|
| `contract_id` | BINARY(16) | PK | UUID hợp đồng |
| `room_id` | BINARY(16) | FK → rooms | Phòng được thuê |
| `tenant_id` | BINARY(16) | FK → tenants | Khách thuê chính |
| `broker_id` | BINARY(16) | FK → brokers (nullable) | Môi giới (nếu có) |
| `contracttemplate_id` | BINARY(16) | FK → contract_templates | Mẫu hợp đồng |
| `movein_date` | DATE | - | Ngày vào ở |
| `close_contract` | DATE | - | Ngày kết thúc hợp đồng |
| `lease_term` | TEXT | - | Thời hạn thuê (mô tả văn bản) |
| `price` | DECIMAL(10,2) | CHECK(≥0) | Giá thuê phòng hàng tháng |
| `deposit` | DECIMAL(10,2) | CHECK(≥0) | Tiền đặt cọc |
| `debt` | DECIMAL(10,2) | - | Công nợ còn lại |
| `actual_price` | DECIMAL(10,2) | - | Giá thực tế (sau khuyến mãi) |
| `status` | ENUM | - | ACTIVE / ENDED / EXPIRING / TERMINATED |
| `username` | VARCHAR(255) | FK → accounts | Tài khoản chủ trọ tạo HĐ |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |

**Chỉ mục:** `idx_contract_room_id`, `idx_contract_username`, `idx_contract_status`

#### Bảng `invoices` — Hóa đơn dịch vụ hàng tháng

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|:---|:---|:---|:---|
| `invoice_id` | BINARY(16) | PK | UUID hóa đơn |
| `contract_id` | BINARY(16) | FK → contracts | Hợp đồng phát sinh hóa đơn |
| `tenant_id` | BINARY(16) | FK → tenants | Khách thuê nhận hóa đơn |
| `invoice_create_date` | DATE | - | Ngày tạo hóa đơn |
| `invoice_create_month` | VARCHAR(7) | - | Tháng hóa đơn (format: YYYY-MM) |
| `due_date` | DATE | - | Hạn thanh toán |
| `payment_status` | VARCHAR(10) | NOT NULL | UNPAID / PAID / CANCELLED |
| `deposit` | DECIMAL(10,2) | - | Tiền đặt cọc (nếu là hóa đơn đặt cọc) |
| `invoice_reason` | VARCHAR(100) | - | Lý do xuất hóa đơn |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |

**Chỉ mục:** `idx_invoice_contract_id`, `idx_invoice_payment_status`

---

## 3.5. THIẾT KẾ GIAO DIỆN API (REST API DESIGN)

### 3.5.1. Quy ước thiết kế API

Toàn bộ API backend tuân thủ chuẩn **RESTful API** với các quy ước:
- **Base URL**: `/api/v1/` (các endpoint mới) hoặc trực tiếp `/` (endpoint cũ)
- **Định dạng dữ liệu**: `application/json` (UTF-8)
- **Xác thực**: `Authorization: Bearer <JWT_Access_Token>` trong HTTP Header
- **Phân trang**: Query params `?page=0&size=20&sortBy=created_at&sortDirection=DESC`
- **Cấu trúc phản hồi chuẩn** (`ApiResponse<T>`):
```json
{
    "code": 200,
    "message": "Mô tả kết quả thao tác",
    "result": { /* Payload dữ liệu */ }
}
```

### 3.5.2. Bảng tổng hợp các REST API chính

| STT | Method | Endpoint | Phân quyền | Mô tả chức năng |
|:---:|:---:|:---|:---:|:---|
| 1 | POST | `/api/v1/auth/login` | Public | Đăng nhập, nhận JWT |
| 2 | POST | `/api/v1/auth/register` | Public | Đăng ký tài khoản mới |
| 3 | POST | `/api/v1/auth/refresh` | Public | Làm mới Access Token |
| 4 | POST | `/api/v1/auth/logout` | Authenticated | Đăng xuất, vô hiệu hóa token |
| 5 | GET | `/api/v1/accounts` | ADMIN | Danh sách tài khoản (phân trang) |
| 6 | POST | `/api/v1/accounts` | ADMIN | Tạo tài khoản nội bộ |
| 7 | PUT | `/api/v1/accounts/{username}` | ADMIN | Cập nhật tài khoản |
| 8 | DELETE | `/api/v1/accounts/{username}` | ADMIN | Xóa tài khoản (Soft Delete) |
| 9 | GET | `/api/v1/motels` | HOST | Danh sách khu trọ của Host |
| 10 | POST | `/api/v1/motels` | HOST | Tạo khu trọ mới |
| 11 | PUT | `/api/v1/motels/{motelId}` | HOST | Cập nhật thông tin khu trọ |
| 12 | DELETE | `/api/v1/motels/{motelId}` | HOST | Xóa khu trọ |
| 13 | GET | `/api/v1/rooms/motel/{motelId}` | HOST | Danh sách phòng theo khu trọ |
| 14 | POST | `/api/v1/rooms` | HOST | Tạo phòng trọ mới |
| 15 | PUT | `/api/v1/rooms/{roomId}` | HOST | Cập nhật thông tin phòng |
| 16 | DELETE | `/api/v1/rooms/{roomId}` | HOST | Xóa phòng (Soft Delete) |
| 17 | GET | `/contracts/motel/{motelId}` | ADMIN,HOST | Danh sách HĐ theo khu trọ |
| 18 | POST | `/contracts` | ADMIN,HOST | Tạo hợp đồng điện tử mới |
| 19 | PUT | `/contracts/update-status` | ADMIN,HOST | Cập nhật trạng thái HĐ |
| 20 | GET | `/invoices/motel/{motelId}` | ADMIN,HOST | Danh sách hóa đơn phân trang |
| 21 | POST | `/invoices/create` | ADMIN,HOST | Tạo hóa đơn tháng mới |
| 22 | PATCH | `/invoices/{id}/collect-payment` | ADMIN,HOST | Thu tiền trực tiếp |
| 23 | GET | `/invoices/{id}/generate-qr` | ADMIN,HOST | Tạo QR code thanh toán |
| 24 | POST | `/payment/vnpay/create` | Authenticated | Khởi tạo thanh toán VNPay |
| 25 | GET | `/payment/vnpay-callback` | Public | Callback xác thực VNPay |
| 26 | POST | `/payment/momo/create` | Authenticated | Khởi tạo thanh toán MoMo |
| 27 | POST | `/payment/stripe/create` | Authenticated | Tạo Stripe PaymentIntent |
| 28 | POST | `/payment/paypal/create` | Authenticated | Khởi tạo thanh toán PayPal |
| 29 | GET | `/api/v1/search` | Public | Tìm kiếm phòng trọ đa bộ lọc |
| 30 | GET | `/api/v1/search/latest` | Public | Tin đăng phòng trọ mới nhất |
| 31 | POST | `/bulletin-board-reviews` | CUSTOMER | Đăng đánh giá bài đăng |
| 32 | GET | `/bulletin-board-reviews` | CUSTOMER | Xem đánh giá theo bài đăng |
| 33 | DELETE | `/bulletin-board-reviews/{id}` | ADMIN | Xóa đánh giá vi phạm |
| 34 | POST | `/meter-readings` | HOST | Chốt chỉ số điện nước |
| 35 | GET | `/statistics/total-accounts` | ADMIN | Tổng số tài khoản hệ thống |
| 36 | GET | `/statistics/total-motels` | ADMIN | Tổng số khu trọ toàn hệ thống |
| 37 | GET | `/report/{motelId}/total-paid-invoices` | HOST | Tổng doanh thu đã thu |
| 38 | POST | `/room-reservations` | HOST | Tạo đơn đặt cọc giữ chỗ |
| 39 | POST | `/temporary-contracts` | HOST | Lập tờ khai lưu trú tạm thời |

---

## 3.6. THIẾT KẾ KIẾN TRÚC PHẦN MỀM (SOFTWARE ARCHITECTURE DESIGN)

### 3.6.1. Kiến trúc tổng thể hệ thống

Hệ thống RRMS được xây dựng theo mô hình kiến trúc **Client-Server phân tầng (N-Tier Layered Architecture)** với sự kết hợp của ba nền tảng client độc lập:

```
┌─────────────────────────────────────────────────────────────────┐
│                   TẦNG CLIENT (CLIENT TIER)                      │
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Web Admin App   │    │   Mobile App     │                   │
│  │  React JS + Vite │    │ React Native     │                   │
│  │  Material UI     │    │ Expo SDK 54      │                   │
│  │  Redux/Context   │    │ Zustand + Router │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
└───────────│──────────────────────│────────────────────────────┘
            │    HTTPS / REST API   │
            ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              TẦNG ỨNG DỤNG (APPLICATION TIER)                    │
│                                                                  │
│   Spring Security Filter Chain  ◄── JWT Verification           │
│         │                                                        │
│   ┌─────▼──────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│   │ Controller │  │  Service  │  │Repository │  │  Mapper  │  │
│   │  (@REST)   │→ │ (@Service)│→ │  (JPA)    │  │(MapStruct)│ │
│   └────────────┘  └───────────┘  └─────┬─────┘  └──────────┘  │
│                                         │                        │
│   ┌─────────────────────────────────────▼──────────────────┐    │
│   │              Spring AOP / Aspect                        │    │
│   │   (Audit Log, Exception Handling, Performance Monitor) │    │
│   └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 TẦNG DỮ LIỆU (DATA TIER)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  MySQL 8.x   │  │  Redis       │  │   Elasticsearch      │  │
│  │  (Primary DB)│  │  (Cache/OTP) │  │   (Search Index)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   Docker Compose: MySQL + Redis + Elasticsearch + Logstash│   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6.2. Cấu trúc mã nguồn Backend (Spring Boot)

```
server/src/main/java/com/rrms/rrms/
│
├── controllers/          # 39 REST Controllers — Tầng Presentation
│   ├── AccountController.java          (CRUD tài khoản Admin)
│   ├── AuthenController.java           (Đăng ký/Login/OAuth2/Refresh)
│   ├── BulletinBoardReviewsController  (CRUD đánh giá bài đăng)
│   ├── ContractController.java         (Quản lý hợp đồng HĐ)
│   ├── InvoiceController.java          (CRUD hóa đơn, QR code)
│   ├── MotelController.java            (CRUD khu trọ)
│   ├── RoomController.java             (CRUD phòng trọ)
│   ├── PaymentController.java          (PayPal, VNPay, MoMo, Stripe)
│   ├── SearchController.java           (Tìm kiếm đa bộ lọc ES)
│   ├── StatisticsController.java       (Dashboard Admin)
│   ├── ReportController.java           (Báo cáo tài chính Host)
│   └── MeterReadingController.java     (Chốt chỉ số điện nước)
│
├── services/             # Interface + Implementation — Tầng Business Logic
│   ├── IAccountService.java / servicesImp/AccountService.java
│   ├── IContractService.java / servicesImp/ContractService.java
│   ├── IInvoiceService.java / servicesImp/InvoiceService.java
│   ├── ISearchService.java / servicesImp/SearchService.java
│   ├── IPaymentService.java / servicesImp/PaymentService.java
│   ├── IStatisticsService.java / servicesImp/StatisticsService.java
│   └── servicesImp/QRCodeService.java  (Tạo mã QR thanh toán)
│
├── repositories/         # Spring Data JPA Repositories — Tầng Data Access
│
├── models/               # 48 JPA Entity Classes
│   ├── Account.java, Contract.java, Invoice.java
│   ├── Motel.java, Room.java, Tenant.java
│   ├── BulletinBoard.java, BulletinBoardReviews.java
│   ├── Transaction.java, MeterReading.java
│   └── BaseEntity.java   (created_at, updated_at, deleted_at AuditFields)
│
├── dto/                  # Data Transfer Objects
│   ├── request/          # Input DTOs (AccountRequest, ContractRequest...)
│   └── response/         # Output DTOs (AccountResponse, InvoiceResponse...)
│
├── mapper/               # MapStruct Mappers (Entity ↔ DTO tại compile-time)
├── configs/              # Spring Security, Redis, Elasticsearch, Swagger
├── aspects/              # Spring AOP: Audit Logging, Exception Handling
├── enums/                # ContractStatus, Roles, RoomStatus...
├── exceptions/           # AppException, GlobalExceptionHandler
└── utils/                # PageableUtils, LogUtils, VNPayConfig...
```

### 3.6.3. Cấu trúc mã nguồn Web Frontend (React + Vite)

```
client/src/
│
├── pages/
│   ├── admin/
│   │   ├── AdminManageBoard.jsx         (Bảng Dashboard Admin)
│   │   ├── ManagerHome/
│   │   │   ├── MotelDashboard/          (Dashboard khu trọ)
│   │   │   ├── DetailRoom/              (Chi tiết phòng + HĐ)
│   │   │   ├── ReserveAPlace/           (Quản lý đặt cọc)
│   │   │   └── ModalCreateMotel.jsx     (Form tạo khu trọ mới)
│   │   ├── ManagerBulletinBoards/       (Quản lý bài đăng tin)
│   │   ├── ManagerOverallReport/        (Báo cáo tổng quan)
│   │   └── MotelSettings/              (Cấu hình thiết bị, dịch vụ)
│   ├── auth/                            (Đăng nhập, Đăng ký, OAuth2)
│   ├── search/                          (Tìm kiếm phòng trọ)
│   ├── roomDetail/                      (Chi tiết bài đăng phòng trọ)
│   └── AI/                             (Tích hợp OCR, Face Match)
│
├── apis/                                (Axios API call functions)
├── contexts/                            (React Context: Auth, Language)
├── hooks/                               (Custom React Hooks)
├── i18n/                                (Đa ngôn ngữ với react-i18next)
├── layouts/                             (Layout components)
└── components/                          (Shared UI Components)
```

### 3.6.4. Cấu trúc mã nguồn Mobile App (React Native + Expo Router)

```
mobile/
│
├── app/                                 (Expo Router file-based routing)
│   ├── (auth)/                          (Màn hình đăng nhập/đăng ký)
│   ├── (tabs)/
│   │   ├── (home)/                      (Màn hình chính, danh sách phòng)
│   │   ├── rooms/                       (Danh sách phòng theo bộ lọc)
│   │   ├── inbox.tsx                    (Hộp thư thông báo)
│   │   ├── tasks.tsx                    (Quản lý task/yêu cầu)
│   │   ├── find-tenants.tsx             (Tìm kiếm khách thuê)
│   │   └── more.tsx                     (Cài đặt thêm)
│   ├── (home-page)/                     (Landing page)
│   ├── (mail-box-page)/                 (Inbox chi tiết)
│   └── (more-page)/                     (Trang cài đặt mở rộng)
│
├── components/                          (UI Components dùng chung)
├── services/
│   ├── api/                             (Axios service calls)
│   └── storage/                         (AsyncStorage: JWT token)
├── hooks/                               (Custom hooks)
├── constants/                           (Colors, Config)
└── types/                               (TypeScript type definitions)
```

---

## 3.7. THIẾT KẾ LUỒNG XỬ LÝ NGHIỆP VỤ (SEQUENCE DIAGRAMS)

### 3.7.1. Luồng Đăng nhập và Xác thực JWT

```
Mobile/Web App         Backend API          Redis Cache          MySQL DB
     │                     │                    │                    │
     │ POST /auth/login     │                    │                    │
     │ {phone, password}    │                    │                    │
     ├────────────────────► │                    │                    │
     │                      │ findByUsername()   │                    │
     │                      ├────────────────────────────────────────►│
     │                      │ ◄────────────────────────────────────── │
     │                      │                    │                    │
     │                      │ BCrypt.verify()    │                    │
     │                      │ (compare hash)     │                    │
     │                      │                    │                    │
     │                      │ generateJWT(Access │                    │
     │                      │ Token 15min +      │                    │
     │                      │ RefreshToken 7day) │                    │
     │                      │                    │                    │
     │  {access_token,      │                    │                    │
     │   refresh_token}     │                    │                    │
     │ ◄────────────────────│                    │                    │
     │                      │                    │                    │
     │ → Lưu RefreshToken   │                    │                    │
     │   vào AsyncStorage/  │                    │                    │
     │   localStorage       │                    │                    │
     │                      │                    │                    │
     │ GET /api/v1/rooms     │                    │                    │
     │ Header: Bearer Token │                    │                    │
     ├────────────────────► │                    │                    │
     │                      │ JwtFilter.verify() │                    │
     │                      │ Decode Header+Payload                  │
     │                      │ Recompute Signature│                    │
     │                      │ Check expiry       │                    │
     │                      │ Check invalidated_tokens               │
     │                      ├────────────────────────────────────────►│
     │                      │ ◄────────────────────────────────────── │
     │                      │ (Token valid)      │                    │
     │                      │                    │                    │
     │  HTTP 200 + Data      │                    │                    │
     │ ◄────────────────────│                    │                    │
```

### 3.7.2. Luồng Thanh toán Hóa đơn qua VNPay

```
Mobile App            RRMS Backend         VNPay Gateway       Ngân hàng
     │                    │                     │                   │
     │ POST /payment/      │                     │                   │
     │ vnpay/create        │                     │                   │
     │ {amount, invoiceId} │                     │                   │
     ├───────────────────► │                     │                   │
     │                     │ Tạo vnp_Params      │                   │
     │                     │ Sắp xếp alphabetical│                   │
     │                     │ HMAC-SHA512(params, │                   │
     │                     │ vnp_HashSecret)     │                   │
     │                     │ = vnp_SecureHash    │                   │
     │                     │                     │                   │
     │  {paymentUrl}       │                     │                   │
     │ ◄───────────────────│                     │                   │
     │                     │                     │                   │
     │ Redirect user đến   │                     │                   │
     │ paymentUrl VNPay    │                     │                   │
     ├──────────────────────────────────────────►│                   │
     │                     │                     │ Hiển thị QR/ATM   │
     │                     │                     │ Người dùng xác nhận│
     │                     │                     ├──────────────────►│
     │                     │                     │ ◄─────────────────│
     │                     │ GET /payment/       │                   │
     │                     │ vnpay-callback      │                   │
     │                     │ ◄───────────────────│                   │
     │                     │                     │                   │
     │                     │ verifySignature()   │                   │
     │                     │ vnp_ResponseCode    │                   │
     │                     │ == "00" (SUCCESS)   │                   │
     │                     │                     │                   │
     │                     │ invoiceService      │                   │
     │                     │ .collectPayment()   │                   │
     │                     │ invoice.status="PAID"                   │
     │                     │ Create transaction  │                   │
     │                     │ record              │                   │
     │                     │                     │                   │
     │ Redirect về         │                     │                   │
     │ /payment/           │                     │                   │
     │ paymentSuccess      │                     │                   │
     │ ◄───────────────────│                     │                   │
```

### 3.7.3. Luồng Tạo Hợp đồng với OCR CCCD

```
Host (Web)              RRMS Backend         AI OCR Service       MySQL DB
     │                      │                     │                   │
     │ Upload ảnh CCCD       │                     │                   │
     ├─────────────────────► │                     │                   │
     │                       │ POST OCR request    │                   │
     │                       ├────────────────────►│                   │
     │                       │ Extract: fullname,  │                   │
     │                       │ cccd, birthday,     │                   │
     │                       │ address, gender     │                   │
     │                       │ ◄────────────────── │                   │
     │                       │                     │                   │
     │  {extracted data}     │                     │                   │
     │ ◄─────────────────────│                     │                   │
     │                       │                     │                   │
     │ Điền thông tin HĐ     │                     │                   │
     │ + Thông tin OCR       │                     │                   │
     │ POST /contracts       │                     │                   │
     ├─────────────────────► │                     │                   │
     │                       │ contractService     │                   │
     │                       │ .createContract()   │                   │
     │                       │                     │   INSERT contracts│
     │                       ├────────────────────────────────────────►│
     │                       │                     │   UPDATE rooms    │
     │                       │                     │   status=OCCUPIED │
     │                       ├────────────────────────────────────────►│
     │                       │                     │   INSERT          │
     │                       │                     │   contract_occupants
     │                       ├────────────────────────────────────────►│
     │                       │ ◄───────────────────────────────────────│
     │                       │                     │                   │
     │                       │ IMailService        │                   │
     │                       │ .sendContractEmail()│                   │
     │                       │                     │                   │
     │  {contractResponse}   │                     │                   │
     │ ◄─────────────────────│                     │                   │
```

---

## 3.8. TỔNG HỢP VÀ KẾT LUẬN CHƯƠNG III

Chương III đã trình bày đầy đủ và chi tiết toàn bộ kết quả phân tích và thiết kế hệ thống RRMS theo các nội dung cốt lõi:

**1. Phân tích yêu cầu hệ thống:**
- Xác định 4 tác nhân chính với cơ chế phân quyền RBAC được thực thi qua Spring Security `@PreAuthorize`.
- Liệt kê đầy đủ 30+ yêu cầu chức năng phân theo nhóm tác nhân và 8 yêu cầu phi chức năng quan trọng với giải pháp kỹ thuật tương ứng.

**2. Đặc tả chi tiết 5 chức năng cốt lõi (R-703, A-801, A-802, A-803, A-804):**
- Mỗi chức năng được đặc tả theo chuẩn SRS với đầy đủ: vai trò, điều kiện tiên quyết, điều kiện hậu, luồng xử lý chính chi tiết từng bước, luồng thay thế và cấu trúc bảng cơ sở dữ liệu thực tế từ `V1__baseline.sql`.

**3. Thiết kế cơ sở dữ liệu:**
- Mô hình ERD phân 7 nhóm quan hệ với 50+ bảng MySQL được tổ chức logic.
- Thiết kế chi tiết 3 bảng trung tâm quan trọng nhất: `accounts`, `contracts`, `invoices`.

**4. Thiết kế kiến trúc phần mềm:**
- Kiến trúc N-Tier phân tầng rõ ràng: Client (Web + Mobile) → API Gateway (Spring Security) → Controller → Service → Repository → Data Store (MySQL + Redis + Elasticsearch).
- Cấu trúc mã nguồn thực tế của cả 3 phần dự án: Backend (39 Controllers, 48 Models, 38 Services), Web Frontend (React + Vite + MUI), Mobile App (React Native + Expo Router).

**5. Thiết kế luồng xử lý nghiệp vụ:**
- 3 Sequence Diagram mô tả các luồng nghiệp vụ phức tạp nhất: Xác thực JWT, Thanh toán VNPay (với HMAC-SHA512 signature verification) và Tạo hợp đồng với OCR CCCD.

Toàn bộ thiết kế trong chương này cung cấp nền tảng kỹ thuật vững chắc để hiện thực hóa mã nguồn chi tiết được trình bày ở **Chương IV: Triển khai và Hiện thực hóa Hệ thống**.
