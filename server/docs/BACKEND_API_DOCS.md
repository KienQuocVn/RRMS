# 📖 RRMS BACKEND API DOCUMENTATION

Tài liệu này cung cấp danh sách chi tiết các API của hệ thống RRMS (Rental Room Management System), bao gồm cách thức gọi (URL, Method), dữ liệu yêu cầu (Request Body/Params), và phản hồi mong đợi (Expected Response).

---

## 🔐 1. NHÓM XÁC THỰC & TỪ XA (AUTHENTICATION)
**Base Path**: `/authen`

### 1.1 Đăng nhập (Login)
- **URL**: `/authen/login`
- **Method**: `POST`
- **Description**: Xác thực người dùng bằng số điện thoại và mật khẩu.
- **Request Body**:
```json
{
  "phone": "0123456789",
  "password": "yourpassword"
}
```
- **Expected Response**: `ApiResponse<LoginResponse>` (Chứa token và thông tin người dùng).

### 1.2 Đăng ký (Register)
- **URL**: `/authen/register`
- **Method**: `POST`
- **Description**: Đăng ký tài khoản mới.
- **Request Body**:
```json
{
  "username": "trung123",
  "phone": "0123456789",
  "email": "user@example.com",
  "password": "yourpassword",
  "userType": "CUSTOMER"
}
```
- **Expected Response**: `ApiResponse<RegisterResponse>`

### 1.3 Đăng xuất (Logout)
- **URL**: `/authen/logout`
- **Method**: `POST`
- **Description**: Hủy hiệu lực của token.
- **Request Body**:
```json
{
  "token": "string"
}
```
- **Expected Response**: `ApiResponse<Void>`

### 1.4 Kiểm tra Token (Introspect)
- **URL**: `/authen/introspect`
- **Method**: `POST`
- **Description**: Kiểm tra token có hợp lệ hay không.
- **Request Body**:
```json
{
  "token": "string"
}
```
- **Expected Response**: `ApiResponse<IntrospecTokenResponse>`

### 1.5 Làm mới Token (Refresh Token)
- **URL**: `/authen/refreshToken`
- **Method**: `POST`
- **Description**: Lấy token mới từ token hiện tại.
- **Request Body**:
```json
{
  "token": "string"
}
```
- **Expected Response**: `ApiResponse<LoginResponse>`

### 1.6 Quên mật khẩu (Send OTP)
- **URL**: `/authen/forgetpassword`
- **Method**: `POST`
- **Description**: Gửi mã OTP về email để khôi phục mật khẩu.
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Expected Response**: `ApiResponse<Boolean>`

### 1.7 Xác nhận thay đổi mật khẩu (Accept Change Password)
- **URL**: `/authen/acceptChangePassword`
- **Method**: `POST`
- **Description**: Đổi mật khẩu mới bằng mã OTP đã nhận qua email.
- **Request Body**:
```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123",
  "code": "12345"
}
```
- **Expected Response**: `ApiResponse<Boolean>`

---

## 👤 2. QUẢN LÝ TÀI KHOẢN (ACCOUNT MANAGEMENT)
**Base Path**: `/api-accounts`

### 2.1 Lấy toàn bộ tài khoản (Admin only)
- **URL**: `/api-accounts/get-all-account`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `ApiResponse<List<AccountResponse>>`

### 2.2 Lấy thông tin tài khoản theo username
- **URL**: `/api-accounts/{username}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `ApiResponse<AccountResponse>`

### 2.3 Tạo tài khoản mới (Admin only)
- **URL**: `/api-accounts/createAccount`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `AccountRequest`
- **Expected Response**: `ApiResponse<AccountResponse>`

### 2.4 Cập nhật tài khoản
- **URL**: `/api-accounts/updateAccount/{username}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `AccountRequest`
- **Expected Response**: `ApiResponse<AccountResponse>`

---

## 🛡️ 3. QUYỀN & VAI TRÒ (ROLES & PERMISSIONS)
**Base Path**: `/roles` & `/permissions`

### 3.1 Lấy danh sách Vai trò (Admin only)
- **URL**: `/roles/getAllRole`
- **Method**: `GET`
- **Expected Response**: `ApiResponse<List<RoleResponse>>`

### 3.2 Lấy danh sách Quyền (Admin only)
- **URL**: `/permissions/getAllPermission`
- **Method**: `GET`
- **Expected Response**: `ResponseEntity (Map<String, Object>)` (Lưu ý: Controller này trả về Map thay vì ApiResponse)

---

## 🏠 4. QUẢN LÝ NHÀ TRỌ (MOTEL MANAGEMENT)
**Base Path**: `/motels`

### 4.1 Lấy danh sách nhà trọ
- **URL**: `/motels`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `ApiResponse<List<MotelResponse>>`

### 4.2 Lấy nhà trọ theo ID
- **URL**: `/motels/get-motel-id?id={uuid}`
- **Method**: `GET`
- **Params**: `id` (UUID)
- **Expected Response**: `ApiResponse<MotelResponse>`

### 4.3 Tạo nhà trọ mới
- **URL**: `/motels/create`
- **Method**: `POST`
- **Request Body**: `MotelRequest`
- **Expected Response**: `ApiResponse<MotelResponse>`

---

## 🛏️ 5. QUẢN LÝ PHÒNG (ROOM MANAGEMENT)
**Base Path**: `/room`

### 5.1 Tạo phòng mới
- **URL**: `/room`
- **Method**: `POST`
- **Request Body**:
```json
{
  "motelId": "uuid",
  "name": "Phòng 101",
  "group": "Tầng 1",
  "price": 3500000.0,
  "area": 25,
  "description": "Phòng đẹp, thoáng mát"
}
```
- **Expected Response**: `RoomResponse2`

### 5.2 Lấy danh sách phòng theo Nhà trọ
- **URL**: `/room/motel/{motelId}`
- **Method**: `GET`
- **Expected Response**: `List<RoomResponse2>`

---

## 🛠️ 6. DỊCH VỤ & THIẾT BỊ (SERVICES & DEVICES)

### 6.1 Lấy dịch vụ theo phòng
- **URL**: `/room-service/room/{roomId}`
- **Method**: `GET`
- **Expected Response**: `List<RoomServiceDetailResponse>`

### 6.2 Lấy thiết bị theo phòng
- **URL**: `/roomdevices/{roomId}`
- **Method**: `GET`
- **Expected Response**: `ApiResponse<List<RoomDeviceResponse>>`

---

## 📜 7. QUẢN LÝ HỢP ĐỒNG (CONTRACT MANAGEMENT)
**Base Path**: `/contracts`

### 7.1 Tạo hợp đồng mới
- **URL**: `/contracts`
- **Method**: `POST`
- **Request Body**: `ContractRequest` (Chứa thông tin ngày vào, tiền cọc, giá thuê, ID phòng, ID khách thuê, v.v.)
- **Expected Response**: `ContractResponse`

### 7.2 Lấy danh sách hợp đồng theo Nhà trọ
- **URL**: `/contracts/motel/{motelId}`
- **Method**: `GET`
- **Expected Response**: `List<ContractResponse>`

### 7.3 Cập nhật trạng thái hợp đồng (Thanh lý/Kích hoạt)
- **URL**: `/contracts/update-status`
- **Method**: `PUT`
- **Params**: `roomId`, `newStatus` (Enum), `reportCloseDate` (dd-MM-yyyy)
- **Expected Response**: `String (Message)`

---

## 👥 8. QUẢN LÝ KHÁCH THUÊ (TENANT MANAGEMENT)
**Base Path**: `/tenant`

### 8.1 Thêm khách thuê vào phòng
- **URL**: `/tenant/insert/{roomId}`
- **Method**: `POST`
- **Request Body**: `TenantRequest` (Họ tên, SĐT, CCCD, Email, v.v.)
- **Expected Response**: `ApiResponse<TenantResponse>`

### 8.2 Lấy danh sách khách thuê theo phòng
- **URL**: `/tenant/roomId/{roomId}`
- **Method**: `GET`
- **Expected Response**: `ApiResponse<List<TenantResponse>>`

---

## 📋 9. MẪU HỢP ĐỒNG (CONTRACT TEMPLATES)
**Base Path**: `/contract-templates`

### 9.1 Lấy toàn bộ mẫu hợp đồng
- **URL**: `/contract-templates`
- **Method**: `GET`
- **Expected Response**: `List<ContractTemplateResponse>`

### 9.2 Tạo mẫu hợp đồng mới
- **URL**: `/contract-templates`
- **Method**: `POST`
- **Request Body**: `ContractTemplateRequest`
- **Expected Response**: `ContractTemplateResponse`

---

## 💰 10. QUẢN LÝ HÓA ĐƠN & THANH TOÁN (INVOICES & PAYMENTS)

### 10.1 Tạo hóa đơn (Invoice)
- **URL**: `/invoices/create`
- **Method**: `POST`
- **Request Body**: `InvoiceRequest` (ID hợp đồng, tháng, năm, chi tiết dịch vụ/thiết bị)
- **Expected Response**: `InvoiceResponse`

### 10.2 Thu tiền hóa đơn (Collect Payment)
- **URL**: `/invoices/{invoiceId}/collect-payment`
- **Method**: `PATCH`
- **Request Body**: `CollectPaymentRequest` (Số tiền, tên người thanh toán, ngày thanh toán)
- **Expected Response**: `InvoiceResponse`

### 10.3 Cổng thanh toán VNPay
- **URL**: `/payment/create_payment`
- **Method**: `POST`
- **Request Body**:
```json
{
  "totalPrice": 5000000,
  "userName": "landlord_user",
  "bankCode": "NCB"
}
```
- **Expected Response**: `PaymentRestDTO` (Chứa URL chuyển hướng đến VNPay)

### 10.4 Cổng thanh toán PayPal
- **URL**: `/payment/payment-paypal`
- **Method**: `POST`
- **Params**: `totalPrice`, `userName`
- **Expected Response**: `Map<String, String>` (redirectUrl)

### 10.5 Thu chi (Transactions)
- **URL**: `/transactions/receipts?username={landlord}` (Phiếu thu)
- **URL**: `/transactions/expenses?username={landlord}` (Phiếu chi)
- **Method**: `POST`
- **Request Body**: `TransactionRequest`
- **Expected Response**: `TransactionResponse`

---

## 📢 11. BẢN TIN & TÌM KIẾM (BULLETIN BOARD & SEARCH)
**Base Path**: `/bulletin-board` & `/searchs`

### 11.1 Đăng tin cho thuê (Bulletin Board)
- **URL**: `/bulletin-board`
- **Method**: `POST`
- **Request Body**: `BulletinBoardRequest` (Tiêu đề, mô tả, giá thuê, địa chỉ, hình ảnh, v.v.)
- **Expected Response**: `ApiResponse<BulletinBoardResponse>`

### 11.2 Tìm kiếm phòng (Search)
- **URL**: `/searchs/addressBullet?address={string}`
- **Method**: `GET`
- **Params**: `address` (Địa chỉ cần tìm)
- **Expected Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

---

## 📊 12. BÁO CÁO & THỐNG KÊ (REPORTS & STATISTICS)
**Base Path**: `/report` & `/statistics`

### 12.1 Thống kê tổng số tài khoản/người thuê/nhà trọ
- **URL**: `/statistics/total-accounts`
- **URL**: `/statistics/total-tenants`
- **URL**: `/statistics/total-motels`
- **Method**: `GET`
- **Expected Response**: `Long` (Số lượng)

### 12.2 Báo cáo tổng quan theo Nhà trọ
- **URL**: `/report/total-rooms?motelId={uuid}&username={string}`
- **Method**: `GET`
- **Expected Response**: `Integer` (Tổng số phòng)

---

## 📅 13. CÁC TÍNH NĂNG KHÁC (MISCELLANEOUS)

### 13.1 Ghi chỉ số điện nước (Meter Reading)
- **URL**: `/api/meter-readings`
- **Method**: `POST`
- **Request Body**: `MeterReading` (Chỉ số cũ, chỉ số mới, loại chỉ số, ngày ghi)
- **Expected Response**: `MeterReading`

### 13.2 Giữ chỗ (Room Reservation)
- **URL**: `/room-reservations`
- **Method**: `POST`
- **Request Body**: `RoomReservationRequest`
- **Expected Response**: `RoomReservationResponse`

### 13.3 Hỗ trợ & Phản hồi (Support)
- **URL**: `/support/create`
- **Method**: `POST`
- **Request Body**: `SupportRequest` (Tiêu đề, nội dung phản hồi)
- **Expected Response**: `ApiResponse<Boolean>`

### 13.4 Đăng ký tạm trú (Temporary Contract)
- **URL**: `/temporary-contracts`
- **Method**: `POST`
- **Request Body**: `TemporaryContractRequest`
- **Expected Response**: `TemporaryContractResponse`

---

**GHI CHÚ CHUNG**:
- Hầu hết các API yêu cầu xác thực qua Header: `Authorization: Bearer <JWT_TOKEN>`.
- Các API trả về `ApiResponse<T>` sẽ có cấu trúc: `{ "code": 200, "message": "...", "result": { ... } }`.
- Sử dụng **Swagger UI** tại `http://localhost:8080/swagger-ui.html` (nếu app đang chạy) để xem chi tiết nhất các Model DTO.
