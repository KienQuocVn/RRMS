# RRMS Backend - Hướng dẫn Chạy & Phát triển

Tài liệu này hướng dẫn cách thiết lập và chạy Backend của dự án RRMS (Room Rental Management System).

## 📋 Yêu cầu hệ thống
- Java 17
- Maven 3.x
- MySQL 8.x
- Redis (Cần thiết cho OTP và Rate Limiting)

## 🚀 Hướng dẫn thiết lập nhanh

### 1. Cấu hình biến môi trường
Mọi thông tin nhạy cảm đã được đưa ra ngoài file môi trường.
- Copy file `.env.example` thành `.env`:
  ```bash
  cp .env.example .env
  ```
- Cập nhật các giá trị trong file `.env` (Password database, các API Keys của MoMo, PayPal, Stripe, v.v.).

### 2. Chạy ứng dụng và Khởi tạo dữ liệu mẫu
Ứng dụng sử dụng **Spring Profiles**. Việc khởi tạo dữ liệu mẫu (`DB.java`) chỉ được kích hoạt trong profile `dev`.

#### Cách 1: Thiết lập trong file .env (Khuyên dùng)
Thêm dòng sau vào file `.env` của bạn:
```properties
SPRING_PROFILES_ACTIVE=dev
```
Sau đó chỉ cần chạy lệnh bình thường:
```bash
.\mvnw.cmd -Dmaven.test.skip=true spring-boot:run
```
*(Lệnh này sẽ khởi chạy ứng dụng trực tiếp và bỏ qua việc chạy các bài test, giúp bạn vào app nhanh hơn)*

#### Cách 2: Chạy lệnh build (Nếu muốn tạo file .jar)
Nếu bạn muốn build dự án mà không bị lỗi do các bài test cũ, hãy dùng:
```bash
.\mvnw.cmd clean install -DskipTests
```
---

#### Cách 2: Truyền tham số trực tiếp qua lệnh Maven
Sử dụng flag `-Dspring-boot.run.profiles` (Dành cho Maven Spring Boot plugin):
```bash
.\mvnw.cmd -Dmaven.test.skip=true spring-boot:run -Dspring-boot.run.profiles=dev
```

**Tài khoản mẫu được tạo tự động:**
| Username | Password | Role |
|----------|----------|------|
| admin    | 123      | ADMIN|
| host     | 123      | HOST |
| employee | 123      | CUSTOMER (Employee-logic)|
| customer | 123      | CUSTOMER|

### 3. Chạy môi trường Production/Staging
Trong chế độ mặc định (không có profile `dev`), database sẽ không được insert dữ liệu mẫu để đảm bảo an toàn cho dữ liệu thật:
```bash
./mvnw.cmd -Dmaven.test.skip=true spring-boot:run
```

## 🧪 Testing
Để chạy test suite bằng H2 Database (không ảnh hưởng MySQL thật):
```bash
./mvnw.cmd test
```

## 🔒 Bảo mật (Security)

### 1. Quản lý Secret
- **TUYỆT ĐỐI KHÔNG** commit file `.env` lên Git. File này đã được đưa vào `.gitignore`.
- Nếu lỡ commit nhầm, hãy thực hiện **rotate** (thay đổi) toàn bộ các secret ngay lập tức.
- Sử dụng `.env.example` để chia sẻ cấu trúc file môi trường cho team mà không kèm giá trị thật.

### 2. Validation
- Luôn sử dụng `@Valid` tại Controller cho mọi `@RequestBody`.
- Các DTO phải có các ràng buộc dữ liệu (`@NotBlank`, `@Size`, `@Email`, v.v.).
- Lỗi validation sẽ được `GlobalExceptionHandler` xử lý và trả về thông báo chi tiết cho client.
