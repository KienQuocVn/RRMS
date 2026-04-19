# Kế Hoạch Tái Cấu Trúc Database & Nghiệp Vụ - RRMS (Senior Level)

Dựa trên việc rà soát kỹ source code back-end (các entity trong package `models`) và sơ đồ hệ thống, đây là bài phân tích và đề xuất cải thiện cấu trúc Database để dự án RRMS đảm bảo tính **Scale, maintainability (bảo trì)** và **tính đúng đắn của nghiệp vụ quản lý nhà trọ/chung cư**.

## 1. Vấn Đề Hiện Tại & Phân Tích Lỗ Hổng (Tiến độ: Đã giải quyết ở tầng DB Data Model)

### 1.1. Model `Room` (Phòng) Đã Được Dọn Dẹp
> [!NOTE]
> Trước đây thực thể `Room` lưu trữ các trường động (dynamic states) như: `debt` (nợ), `countTenant` (số người thuê), thiết kế này đã được loại bỏ để tập trung vào bản chất tĩnh.
* Hiện tại `Room` đã giữ vai trò đúng là một thực thể vật lý: Không còn lưu nợ, ngày chuyển vào hay chu kỳ. Các yếu tố này đã được đẩy sang `Contract`.

### 1.2. Mối quan hệ giữa Người Thuê (`Tenant`) và Phòng (`Room`) - Đã Tối Ưu
* Ràng buộc cứng giữa `Tenant` và `Room` đã được tháo gỡ. `Tenant` giờ đây linh hoạt liên kết thông qua `Contract` và bảng phụ `ContractOccupant`, giúp một người thuê dễ dàng đổi phòng trong cùng trọ hoặc trở thành người đại diện hợp đồng (không bị mất lịch sử tracking).

### 1.3. Luồng Thanh Toán & Hóa Đơn (`Invoice` & `Transaction`) - Đã chuẩn bị nền tảng
* `Invoice` đã có liên kết 1-Nhiều với `Transaction`, dọn đường để chạy auto process: Mỗi thông tin chuyển khoản (transaction) sẽ cộng dồn số liệu để tự động đổi trạng thái của Hóa Đơn (ví dụ: trả góp/trả chậm vẫn truy vết được).

### 1.4. Quản lý Chỉ số Điện, Nước (Utilities) - Đã rạch ròi
* Bảng `MeterReading` đã được sinh ra để chuyên lưu số điện/nước hàng tháng cùng link hình ảnh (proof) phòng ngừa tranh chấp nội bộ.

### 1.5. Thiết kế Quản lý Tài Sản/Nội Thất - Nghiệp vụ chuẩn
* Thực thể `ContractDeviceHandover` đã được tạo để quy trách nhiệm khi khách hàng nhận/trả phòng (lưu `condition_on_move_in`, `condition_on_move_out` và `damage_fee`).

---

## 2. Giải Pháp Tái Cấu Trúc Đã Triển Khai Vào Model

### 2.1. Cấu trúc lại Thực thể tĩnh (Static) & Thực thể động (Dynamic)
* **`Room`**: Đã xóa các trường tracking trạng thái động, chỉ giữ `area`, `price`, `deposit`, `status`.
* **`Contract` (Hợp Đồng)**: Đã trở thành trung tâm điều hướng nghiệp vụ với đầy đủ yếu tố: `debt`, `deposit`, `price`, `moveinDate`, `collectioncycle`.

### 2.2. Xử lý "Tenant - Room - Contract"
* Cấu trúc `Contract` -> Liên kết đa dạng 1 `Room` và 1 `Tenant` (đại diện hợp đồng) đã hoàn thiện đúng chuẩn.
* Mapping One-To-Many ra `ContractOccupant` để quản lý người ở ghép chuyên nghiệp.

### 2.3. Quy trình tính toán Hóa đơn & Công Nợ
* **`MeterReading`** quản lý chốt điện nước được link ngược về phòng (`Room`) định kì.

---

## 3. Các Bước Thực Hiện Chỉnh Sửa Mã Nguồn (Danh Sách Task DB Models)

> [!TIP]
> Các Model Entity Backend Java đã được thiết kế lại thành công. Bước tiếp theo là cập nhật các DTO, Mapper, Service, Controller để thích ứng với Database Schema mới này, tránh bị vỡ logic ở Layer bên trên.

- [x] **Phase 1: Tách State ra khỏi Room** -> Đã làm sạch `Room.java`. 
- [x] **Phase 2: Chuẩn hóa lại Contract - Tenant** -> Đã tạo xong bảng mapping `ContractOccupant`, cắt quan hệ cứng `Tenant->Room` và chuẩn hóa flow `Contract->Room/Tenant`.
- [x] **Phase 3: Cải tổ cụm Billing (Invoice, Transaction, Meter Reading)** -> Đã tạo model `MeterReading` lưu chỉ số và link cấu trúc `Transaction` - `Invoice`.
- [x] **Phase 4: Bổ sung logic Bàn giao Nội thất** -> Đã hoàn thiện model `ContractDeviceHandover`.

---

## 4. Kế Hoạch Tiếp Theo Dành Cho DTO & Service Layer (Roadmap Mới)

> [!WARNING]
> Database Model cấu trúc tốt chỉ là bước 1. Hiện tại toàn bộ Service Layer của RRMS đang trỏ và gọi tới các biến/Model cũ nên việc compile và runtime sẽ gặp lỗi liên hoàn, cần refactor các class thuộc Repositories, DTO, Mappers và Controllers.

Sau khi đã tích tick [x] hoàn tất Database Plan. Các bước nên làm cho Phase Refactor tiếp:

1. [x] **Dọn dẹp & Tái Cấu Trúc DTOs:** Đã hoàn tất cập nhật các Request/Response DTO cho Room, Contract, Tenant. Đã bổ sung trường `actualPrice` và `reportcloseContract` cho hợp đồng.
2. [x] **Cập nhật MapStruct / Mapper:** Đã refactor toàn bộ Mapper (`RoomMapper`, `TenantMapper`, `AccountMapper`, `ContractMapper`) để xử lý các quan hệ mới.
3. [x] **Refactor Service & Repositories:** 
   - Đã tạo repo mới cho: `ContractOccupant`, `MeterReading`, `ContractDeviceHandover`.
   - Đã refactor `RoomService`, `TenantService` (hoàn thiện flow `ContractOccupant`) và `InvoiceService` (chuyển sang kiến trúc giao dịch đa điểm).
4. [x] **Xây dựng Logic Hóa Đơn Tự Động:** Đã triển khai logic tại `TransactionService`: Tự động tính tổng các giao dịch thành công để cập nhật trạng thái `PAID`, `PARTIAL` hoặc `UNPAID` cho Hóa đơn tương ứng.
5. [x] **Khởi tạo Code cho Entity Mới**: Đã hoàn thiện toàn bộ tầng Service, Interface và Controller phục vụ CRUD cho `ContractOccupant`, `MeterReading`, `ContractDeviceHandover`.
6. [ ] **Final Verify & Final Compile**: Chạy `mvn clean compile` lần cuối để đảm bảo toàn bộ hệ thống đã khớp nối hoàn hảo.
