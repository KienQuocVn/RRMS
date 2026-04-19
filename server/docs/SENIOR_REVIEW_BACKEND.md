# 🔍 ĐÁNH GIÁ BACKEND (Spring Boot) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Backend Review
> **Ngày đánh giá**: 2026-04-19
> **Phiên bản đánh giá**: 2.0.0
> **Phạm vi**: Toàn bộ backend `server/` gồm `src/main`, `src/test`, `resources`, migration SQL và build config
> **Stack**: Spring Boot 3.3.3 + Java 17 + MySQL + Redis + Elasticsearch
> **Cơ sở đánh giá**: đọc code hiện trạng, rà soát cấu trúc package/file, và chạy `./mvnw.cmd test`

---

## 📊 TỔNG QUAN ĐÁNH GIÁ

| Tiêu chí           | Điểm (1-10) | Ghi chú                                                                 |
| ------------------ | ----------- | ----------------------------------------------------------------------- |
| Kiến trúc tổng thể | 6/10        | Layered architecture rõ hơn trước, có DTO/Mapper/Repository/Flyway      |
| Bảo mật            | 4/10        | OTP + rate limit đã tốt hơn, nhưng vẫn còn lộ secrets và payment flow yếu |
| Code Quality       | 5/10        | Data layer sạch hơn, nhưng vẫn còn class lớn, debug code, naming rối    |
| Error Handling     | 4/10        | Có `AppException` + `GlobalExceptionHandler`, nhưng coverage còn mỏng   |
| Testing            | 4/10        | Có 33 file test, nhưng `mvn test` đang fail 35 lỗi / 119 tests          |
| Performance        | 5/10        | Đã bỏ EAGER phổ biến và thêm index, nhưng N+1 vẫn còn ở các luồng chính |
| Scalability        | 5/10        | Có Redis/Elasticsearch/rate limit, nhưng mức tận dụng vẫn còn cục bộ    |
| Documentation      | 3/10        | Có springdoc dependency, nhưng tài liệu backend vẫn rất mỏng            |
| Database Design    | 7/10        | Cải thiện rõ rệt: Flyway, audit fields, schema tách bảng hợp lý hơn     |
| API Design         | 4/10        | Một phần đã dùng `ApiResponse`, nhưng response và naming vẫn thiếu chuẩn |

**Điểm trung bình: 4.7/10** - Backend đã tiến bộ rõ ở tầng dữ liệu, nhưng vẫn chưa đạt mức production-ready.

---

## ✅ Những điểm đã cải thiện rõ sau đợt nâng cấp database

### 1. Data layer đã trưởng thành hơn đáng kể

- Đã có Flyway migration với `V1__baseline.sql`, `V2__sync_restructured_schema.sql`, `V3__link_transactions_to_invoices.sql`
- `spring.jpa.hibernate.ddl-auto=validate` là bước tiến đúng hướng so với kiểu chạy phụ thuộc ORM tự sửa schema
- Có `BaseEntity` + JPA auditing cho `created_at` và `updated_at`
- Nhiều entity chính đã chuyển sang `@Getter/@Setter` thay vì `@Data`
- `FetchType.LAZY` đã được áp dụng ở nhiều quan hệ lớn như `Account`, `Room`, `Contract`

### 2. Thiết kế dữ liệu đã bớt “gộp tất cả vào một bảng”

- Tách thêm các bảng `contract_occupants`, `contract_device_handovers`, `meter_readings`
- Bổ sung liên kết `transactions -> invoices`
- Có thêm index ở nhiều bảng quan trọng như `accounts`, `rooms`, `contracts`, `invoices`
- `count_tenant` đã đổi về kiểu số nguyên thay vì text như review cũ từng nêu

### 3. Một số điểm nóng về auth đã được xử lý đúng hướng

- OTP không còn nằm trong static variable ở `AuthenController`
- OTP đã chuyển sang Redis key theo user/email và có TTL 5 phút
- Đã có `@RateLimited` cho login/register/forgot-password

Kết luận ngắn: phần database và auth flow hiện tại tốt hơn bản review cũ một khoảng đáng kể. Đây là lý do điểm `Database Design`, `Performance`, `Scalability` và `Testing` không còn ở mức rất thấp như trước.

---

## 🚨 Các vấn đề nghiêm trọng còn tồn tại

### 1. Secrets vẫn đang lộ trong codebase

**Mức độ: CRITICAL**

Các giá trị thật vẫn xuất hiện trong:

- `server/application-dev.properties`
- `server/src/main/java/com/rrms/rrms/configs/CustomerEnvironment.java`
- `server/src/main/resources/application.properties` vẫn còn một số config nhạy cảm/public key hardcoded

Những secret hiện còn lộ gồm:

- Redis password
- JWT signer
- Gmail app password
- PayPal secret
- Stripe secret key
- MoMo secret
- VNPay secret
- Cloudflare captcha secret

Điểm cộng là `application.properties` đã dùng placeholder env cho nhiều trường, nhưng việc giữ secret thật trong repo vẫn khiến điểm bảo mật chưa thể lên cao.

### 2. Payment flow vẫn chưa đủ an toàn cho production

**Mức độ: HIGH**

Các dấu hiệu chính:

- `PaymentController` còn hardcode `localhost` ở PayPal/VNPay/MoMo return URL
- `VNPayConfig.vnp_ReturnUrl` vẫn trỏ cứng về `http://localhost:8080/...`
- `paymentCallback()` chỉ dựa vào `vnp_ResponseCode`, chưa verify chữ ký callback
- `paymentMoMo()` đang dùng `notifyURL = "http://google.com.vn"`

Điều này khiến flow thanh toán hiện tại phù hợp demo/dev hơn là production.

### 3. Test suite đang đỏ

**Mức độ: HIGH**

Kết quả chạy thực tế:

- `mvn test`: **119 tests**
- **35 errors**
- build fail

Các nguyên nhân nổi bật:

- Thiếu `src/test/resources/test.properties`
- Nhiều test load full Spring context nhưng cấu hình test chưa đủ
- Một số test bị lỗi thật, ví dụ `MotelDeviceServiceTest` gặp `NullPointerException`
- Nhiều test class tồn tại nhưng nội dung test bị comment gần như toàn bộ, ví dụ `AuthenControllerTest`, `InvoiceServiceTest`

### 4. Sample data bootstrap đang nằm trong runtime path chính

**Mức độ: HIGH**

`server/src/main/java/com/rrms/rrms/database/DB.java` là một `@Configuration` chứa `CommandLineRunner` seed dữ liệu lớn, không thấy guard bằng profile riêng như `dev` hay `local`.

Rủi ro:

- Làm bẩn môi trường ngoài ý muốn
- Khó kiểm soát dữ liệu khởi tạo
- Tăng độ phức tạp khi chạy test/staging/prod

---

## ⚠️ Nhận định chi tiết theo từng hạng mục

### Kiến trúc tổng thể - 6/10

Điểm tốt:

- Có tách lớp controller/service/repository/dto/mapper tương đối rõ
- Data layer có hướng đi đúng hơn nhờ Flyway + auditing + schema evolution
- Có aspect riêng cho rate limiting

Điểm trừ:

- Nhiều class quá lớn: `AuthenController`, `AccountService`, `InvoiceService`, `DB`
- Business logic vẫn còn nằm ở controller
- Vẫn còn nhiều “legacy slice” và naming khó bảo trì như `TemporaryR_contract`, `SupportControlller`, `INameMotelServiceService`

### Bảo mật - 4/10

Điểm tốt:

- OTP qua Redis là cải tiến đáng ghi nhận
- Có rate limit cho auth endpoints
- `PUBLIC_ENDPOINTS` không còn mở quá rộng kiểu `/api-accounts/**`

Điểm trừ:

- Secret thật còn trong repo
- `csrf().disable()` toàn cục
- Input validation gần như chưa được triển khai hệ thống
- Payment callback verification còn yếu
- `CustomerEnvironment` vẫn hardcode thông tin MoMo

### Code Quality - 5/10

Điểm tốt:

- Entity chính đã bớt dùng Lombok kiểu nguy hiểm cho JPA
- Mapper/DTO được dùng ở khá nhiều nơi
- Một phần code đã có logging thay cho in thẳng console

Điểm trừ:

- Vẫn còn `System.out.println()` và `printStackTrace()`
- `OpenAPIConfig.java` đang bị comment toàn bộ
- Có nhiều bug “nhỏ nhưng thật”:
  - `SearchController` nhận `DESC` nhưng vẫn gọi hàm sort tăng dần
  - `AccountController#getAccountByUsername` dựng `Map` response nhưng lại trả thẳng object khác
- Compile cho thấy rất nhiều cảnh báo MapStruct về unmapped properties

### Error Handling - 4/10

Điểm tốt:

- Có `AppException`
- Có `GlobalExceptionHandler` cho `AppException` và `AccessDeniedException`

Điểm trừ:

- `GlobalExceptionHandler` hiện rất mỏng, chưa cover validation, `EntityNotFoundException`, `MethodArgumentNotValidException`, payment exception, parse exception
- Nhiều controller vẫn `catch (Exception)` rồi tự build response thủ công
- HTTP status và message chưa đồng nhất toàn hệ thống

### Testing - 4/10

Điểm tốt:

- Số lượng test file đã tăng đáng kể so với review cũ
- Có test cho service, controller và config
- Có đưa H2 vào dependency test

Điểm trừ:

- Build test hiện không xanh
- Test resources/config thiếu
- Có khá nhiều test “tồn tại trên danh nghĩa” nhưng bị comment
- Chưa thấy chiến lược integration test/database test rõ ràng

### Performance - 5/10

Điểm tốt:

- Đã bỏ `FetchType.EAGER` phổ biến ở model chính
- Có index ở các trường truy vấn thường xuyên
- Schema chuẩn hơn giúp giảm join bất hợp lý trong dài hạn

Điểm trừ:

- `InvoiceService#getInvoicesByMotelId()` vẫn gọi repository lồng nhau theo room -> contract -> invoice -> detail, rất dễ tạo N+1
- Chưa thấy `@EntityGraph`, `JOIN FETCH` hay pagination được dùng thực tế
- `spring.jpa.show-sql=true` vẫn bật mặc định, chưa phù hợp production

### Scalability - 5/10

Điểm tốt:

- Có Redis rate limiter
- Có Redis, Elasticsearch, Logstash, Kibana trong `docker-compose.yml`
- Có một số cache annotation ở `RolesController`

Điểm trừ:

- Caching còn quá ít, chưa phải chiến lược toàn hệ thống
- Elasticsearch đã có repository nhưng flow search chính vẫn chủ yếu dùng JPA
- Chưa có actuator/health/readiness
- Chưa thấy background jobs, outbox, audit log hay async processing rõ ràng

### Documentation - 3/10

Điểm tốt:

- Có dependency springdoc
- Controller có dùng `@Operation`, `@Tag` ở nhiều nơi

Điểm trừ:

- `server/docs/` hiện gần như chỉ có chính file review này
- Không có backend README riêng trong `server/`
- `OpenAPIConfig` đang bị comment toàn bộ
- Thiếu runbook cho local/dev/test/deploy

### Database Design - 7/10

Đây là phần tiến bộ mạnh nhất.

Điểm tốt:

- Có migration versioned
- Bổ sung bảng trung gian/phụ trợ đúng hướng domain hơn
- Nhiều bảng có index hợp lý
- Sử dụng UUID cho phần lớn entity mới/chính
- Có audit fields dùng chung

Điểm trừ:

- `Account.username` vẫn là primary key dạng business key
- Naming convention vẫn lẫn lộn camelCase, snake_case, viết tắt, typo
- Một số table/entity vẫn mang dấu vết legacy như `TemporaryR_contract`
- Chưa thấy unique constraint/business constraint mạnh cho nhiều rule nghiệp vụ quan trọng

### API Design - 4/10

Điểm tốt:

- Nhiều endpoint mới đã dùng `ApiResponse<T>`
- Có chia controller theo domain

Điểm trừ:

- Vẫn trộn `ApiResponse`, `ResponseEntity<?>`, `Map<String,Object>`, object trả trực tiếp
- Naming route chưa RESTful và chưa nhất quán:
  - `/searchs`
  - `/get-all-account`
  - `/createAccount`
  - `/roomNews`
- Chưa có API versioning
- Chưa thấy pagination ở các list endpoint lớn

---

## 📌 Kết luận senior-level

So với lần review trước, backend này **đã cải thiện thật** ở phần data model và JPA hygiene. Việc bổ sung Flyway, auditing, các bảng mới cho occupant/handover/meter reading, và loại bỏ EAGER phổ biến là những thay đổi đúng hướng và có giá trị dài hạn.

Tuy nhiên, codebase hiện vẫn đang ở trạng thái **“đủ để phát triển tiếp và demo nội bộ, nhưng chưa đủ an toàn để tin cậy như production backend”**. Ba điểm đang kéo chất lượng chung xuống mạnh nhất là:

1. **Security hygiene chưa đạt** vì secrets thật vẫn còn trong repo và payment callback chưa đủ chặt.
2. **Testing chưa đáng tin** vì test suite đỏ ngay khi chạy thực tế.
3. **API/controller quality còn phân mảnh** vì response contract, naming, validation và error handling chưa được chuẩn hóa.

---

## 🎯 Ưu tiên xử lý trong 2-4 tuần tới

### Priority 1 - Bắt buộc trước khi coi là production candidate

1. [x] Xóa toàn bộ secret thật khỏi repo, rotate toàn bộ credential đang lộ
2. [x] Tách `DB.java` sample seed sang profile `dev` hoặc module seed riêng
3. [/] Sửa test infrastructure:
   - [x] thêm `src/test/resources/application-test.properties` (sử dụng H2)
   - [ ] tách test unit và test context
   - [/] đưa build test về trạng thái xanh (đang rà soát)
4. [ ] Hoàn thiện payment callback verification cho VNPay/MoMo/PayPal (Đang rà soát logic chữ ký)

### Priority 2 - Nâng chất lượng lõi

1. Chuẩn hóa toàn bộ response về một contract duy nhất
2. Bổ sung validation annotation cho request DTO
3. Refactor các class lớn: `AuthenController`, `AccountService`, `InvoiceService`
4. Loại bỏ debug prints, dead code, commented config

### Priority 3 - Tối ưu truy vấn và khả năng mở rộng

1. Xử lý N+1 ở invoice/search/report flows
2. Thêm pagination cho endpoint list
3. Dùng cache/search theo chiến lược rõ ràng thay vì điểm lẻ tẻ
4. Bổ sung health check, observability và runbook vận hành

---

## ✅ Chốt lại

Nếu chỉ xét riêng phần database, dự án đã đi từ mức “cần sửa nền móng” lên mức “có nền tảng tương đối tốt để phát triển tiếp”. Nhưng nếu xét toàn bộ backend theo chuẩn senior engineer cho production, hệ thống hiện tại vẫn mới ở **mức trung bình thấp** do security hygiene, testing reliability và API consistency chưa theo kịp phần data layer.
