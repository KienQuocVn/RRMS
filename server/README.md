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
.\mvnw.cmd spring-boot:run
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
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
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
./mvnw.cmd spring-boot:run
```

## 🧪 Testing
Để chạy test suite bằng H2 Database (không ảnh hưởng MySQL thật):
```bash
./mvnw.cmd test
```

## 🔍 Lưu ý về Database
- Dự án sử dụng **Flyway** để quản lý version database.
- Schema sẽ được tự động đồng bộ hóa thông qua các file trong `src/main/resources/db/migration`.
- Tránh sửa trực tiếp database trong MySQL client, hãy dùng Flyway script.
