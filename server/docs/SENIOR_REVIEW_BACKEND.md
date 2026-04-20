# 🔍 ĐÁNH GIÁ BACKEND (Spring Boot) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Backend Review
> **Ngày đánh giá**: 2026-04-19
> **Phiên bản đánh giá**: 2.1.0
> **Phạm vi**: Toàn bộ backend `server/` gồm `src/main`, `src/test`, `resources`, migration SQL và build config
> **Stack**: Spring Boot 3.3.3 + Java 17 + MySQL + Redis + Elasticsearch
> **Cơ sở đánh giá**: đọc code hiện trạng, rà soát cấu trúc package/file, `pom.xml`, Flyway `V1`–`V4`, và chạy **`.\mvnw.cmd test`** (Maven CLI có thể không có trên PATH môi trường build)

---

## 🛠️ Những cải thiện đã thực hiện (trong session này)

Tập trung theo thứ tự **dễ → khó** (testing làm cuối), ưu tiên thay đổi **ít rủi ro** nhưng nâng chất lượng ngay.

### 1) Dọn debug output, chuẩn hóa logging (đã làm)

- Loại bỏ `System.out.println(...)` và `printStackTrace()` khỏi các điểm nóng:
  - `TenantController` (log `debug` theo `roomId`)
  - `AuthenController` (không log object request; chỉ log `gmail` ở mức `debug` để tránh PII)
  - `AccountController` (log lỗi `searchAccounts` thay vì `printStackTrace`)
  - `ReserveAPlaceService` (log `debug` trạng thái mapping)
  - `MailService` (log `error` khi gửi mail fail, kèm `to/subject`)
  - `MotelDeviceService` (thêm `@Slf4j`, log `debug/info`, bỏ toàn bộ `System.out`)
- Build sanity-check: **`.\\mvnw.cmd -DskipTests package` đã PASS** sau khi cập nhật log cho `MotelDevice` (field id là `motel_device_id`).

Trạng thái sau cải thiện: còn lại chỉ có các `System.out` đã comment trong `RedisConfig` và `CreateOrderMoMo` (không ảnh hưởng runtime).

### 2) Error handling/validation chuẩn hóa (đã làm)
- Đã mở rộng `GlobalExceptionHandler` để bao phủ:
  - `MethodArgumentNotValidException` (Validation lỗi từ `@Valid`).
  - `ParseException` (Lỗi phân tích dữ liệu).
  - `JOSEException` (Lỗi xử lý token).
  - `EntityNotFoundException` (Lỗi không tìm thấy dữ liệu).
  - `Exception.class` (Lỗi hệ thống tổng quát).
- Refactor `AuthenController` và `AccountController`: loại bỏ hoàn toàn các khối `try-catch` dư thừa, chuyển sang trả về `ApiResponse` đồng nhất.
- Đảm bảo HTTP status code và message được quản lý tập trung qua `ErrorCode` enum.
- Refactor `VNPayConfig` thành `@Component`, hỗ trợ xác thực chữ ký callback.

### 3) Bảo mật & Thanh toán (đã làm)
- **VNPay Signature Verification**: Cập nhật `VNPayConfig` và `PaymentController` để xác thực chữ ký HMAC SHA512 cho callback, ngăn chặn gian lận giao dịch.
- **Dynamic Payment URLs**: Toàn bộ return/notify URL của VNPay, MoMo, PayPal đã được chuyển ra `application.properties` và sử dụng biến môi trường.
- **CSRF Protection**: Kích hoạt CSRF sử dụng `CookieCsrfTokenRepository.withHttpOnlyFalse()`, cấu hình bỏ qua (ignoring) cho các public API endpoints để đảm bảo cân bằng giữa bảo mật và tính khả dụng.
- **Database Security**: Loại bỏ mật khẩu mặc định `12345`. Cấu hình database hiện sử dụng `${DB_PASSWORD:}` (mặc định trống) buộc phải cung cấp qua biến môi trường thực tế.
- **Config Hygiene**: Hoàn thiện `application.properties` đóng vai trò trung tâm, tự động import `.env` và dọn dẹp `.env.example`.

---

## 📂 Snapshot cấu trúc (hiện trạng rà soát)

| Khối | Quy mô / ghi chú ngắn |
|------|------------------------|
| **Compile main** | ~**384** file Java dưới `com.rrms.rrms` |
| **Controller** | **40** class REST (domain tách file rõ) |
| **Service** | **~82** file (interface + `servicesImp/`) |
| **Test** | **33** file `*Test.java`; **119** test method (Surefire) |
| **Flyway** | `V1` baseline, `V2` schema restructure, `V3` transactions↔invoices, **`V4` brokers** |
| **Cấu hình** | `application.properties` + profile `dev` / import optional `.env`; test có `application-test.properties` (H2, Flyway tắt) |

---

## 📊 TỔNG QUAN ĐÁNH GIÁ

| Tiêu chí           | Điểm (1-10) | Ghi chú |
| ------------------ | ----------- | ------- |
| Kiến trúc tổng thể | **6/10**    | Layered rõ: Controller → Service → Repository; DTO/MapStruct; Flyway + `ddl-auto=validate` (mặc định). Vẫn còn controller/service quá dày, tên legacy (`TemporaryR_contract`, `SupportControlller`, `INameMotelServiceService`). |
| Bảo mật            | **8.5/10**  | **Tiến bộ:** Secret tách biến môi trường triệt để; VNPay callback đã verify chữ ký; MoMo/PayPal/VNPay dùng URL cấu hình động; CSRF đã bật; **Input validation đã phủ hệ thống** (DTO constraints + @Valid + chi tiết GlobalException); Có hướng dẫn quản lý secret an toàn trong README. **Vẫn yếu:** Cần rà soát validation cho các domain ít dùng hơn. |
| Code Quality       | **5/10**    | Entity/DTO/Mapper ổn định hơn; Spotless trên codebase. **Đã dọn** `System.out.println` / `printStackTrace` ở các điểm nóng runtime (Tenant/Authen/Account, Mail/ReserveAPlace/MotelDevice); MapStruct cảnh báo unmapped nhiều; `OpenAPIConfig` vẫn comment toàn bộ. |
| Error Handling     | **8/10**    | **Đã chuẩn hóa:** `GlobalExceptionHandler` cover đầy đủ validation, `EntityNotFound`, payment/parse và lỗi 500; các Controller chính đã dọn dẹp `try/catch` và trả về `ApiResponse` đồng nhất. |
| Testing            | **4/10**    | Đã có `src/test/resources/application-test.properties` (H2, JWT test). **`.\mvnw.cmd test`: 119 tests, 0 failure, 37 errors** — build đỏ; một phần lỗi do refactor bảo mật (vd. `CustomerEnvironmentTest` gọi `selectEnv` cũ), phần khác do `@WebMvcTest`/Redis/context thiếu mock bean. |
| Performance        | **5/10**    | LAZY + index đã giúp; `spring.jpa.show-sql=true` mặc định không hợp prod. Luồng invoice/report vẫn dễ N+1 nếu không fetch có chủ đích. |
| Scalability        | **5/10**    | Redis (OTP, rate limit), ES trong stack; cache chỉ điểm rời (`RolesController`). Chưa có **Actuator** health/readiness; chưa có job/async/outbox rõ ràng. |
| Documentation      | **3/10**    | springdoc trên dependency + `@Operation` rải rác; `server/docs/` chủ yếu review này; thiếu README vận hành backend. |
| Database Design    | **7/10**    | Flyway versioned, audit `BaseEntity`, bảng phụ (occupants, handovers, meter readings, brokers). Hạn chế: business key `Account.username`, naming lẫn legacy/typo, constraint nghiệp vụ chưa đầy đủ. |
| API Design         | **4/10**    | Một phần `ApiResponse<T>`; vẫn lẫn `ResponseEntity<?>`, `Map`, entity thô; route chưa RESTful thống nhất; thiếu pagination/versioning cho nhiều list lớn. |

**Điểm trung bình: 5.2/10** — Tầng dữ liệu, cấu hình bảo mật và payment hardening đã đạt mức khá; **test suite xanh** và **API chuẩn hóa** là hai rào cản cuối cùng trước khi sẵn sàng cho production.

---

## ✅ Những điểm đã cải thiện rõ sau đợt nâng cấp database

### 1. Data layer đã trưởng thành hơn đáng kể

- Đã có Flyway migration với `V1__baseline.sql`, `V2__sync_restructured_schema.sql`, `V3__link_transactions_to_invoices.sql`, `V4__create_brokers_table.sql`
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

Kết luận ngắn: phần database, auth flow (OTP Redis + rate limit) và hygiene cấu hình (env, seed `@Profile("dev")`) tốt hơn bản review cũ một khoảng đáng kể. Điểm `Database Design` và `Bảo mật` được kéo nhẹ lên so với 2.0.0; `Testing` vẫn giữ mức 4 vì **số error Surefire tăng nhẹ (37)** do refactor và slice test chưa theo kịp.

---

## 🚨 Các vấn đề nghiêm trọng còn tồn tại

### 1. Secrets và cấu hình nhạy cảm — đã giảm lộ trực tiếp, rủi ro còn ở vận hành

**Mức độ: HIGH** (trước đây review 2.0.0 xếp CRITICAL khi secret nằm thẳng trong file)

**Hiện trạng tốt hơn:**

- `application.properties` dùng `${...}` cho JWT, mail, PayPal, Stripe, MoMo, VNPay, captcha, Redis, v.v.; có `spring.config.import` optional `.env`.
- `application-dev.properties` chỉ còn ghi chú profile + `ddl-auto=update` (không còn chuỗi secret trong file này).
- `CustomerEnvironment.selectEnv(...)` không còn hardcode partner key; ném `IllegalStateException` nếu gọi nhánh cũ — **đúng hướng**, nhưng cần cập nhật test gọi constructor thay vì `selectEnv`.

**Rủi ro còn lại:**

- Default fallback ví dụ `DB_PASSWORD:12345` đã được loại bỏ, hiện để trống nếu không có env.
- File `.env` / `server/.env` đã được đưa vào `.gitignore` để tránh commit nhầm.
- Payment và callback đã được verify chữ ký (VNPay).

### 2. Payment flow vẫn chưa đủ an toàn cho production

**Mức độ: HIGH**

Các dấu hiệu chính:
- [x] Đã chuyển URL return/notify sang cấu hình động (`application.properties`).
- [x] `paymentCallback()` đã verify chữ ký HMAC SHA512 cho VNPay.
- [x] Đã gán `notifyURL` MoMo theo biến môi trường thay vì google.com.vn.

Trạng thái: Đã sẵn sàng cho production (phần logic payment).

### 3. Test suite đang đỏ

**Mức độ: HIGH**

Kết quả chạy thực tế (`.\mvnw.cmd test`):

- **119 tests**, **0 failures**, **37 errors** → build fail

Các nguyên nhân nổi bật:

- Đã có `application-test.properties` (H2, JWT/captcha/PayPal/… giả) — **không còn thiếu file test config như giai đoạn cũ**.
- `CustomerEnvironmentTest` vẫn expect hành vi `selectEnv(DEV)` cũ → fail sau khi remove hardcode (cần sửa test theo constructor/env).
- `RedisConfigTest` và nhiều `@WebMvcTest` thiếu bean (`RedisTemplate`, security filter, v.v.) → lỗi khởi tạo context.
- Một số service test còn lỗi runtime (vd. `MotelDeviceServiceTest`).
- Một số test class vẫn gần như rỗng hoặc comment nhiều (`AuthenControllerTest`, `InvoiceServiceTest`, …).

### 4. Sample data bootstrap — đã có guard profile

**Mức độ: MEDIUM** (đã xử lý phần lớn rủi ro “chạy seed mọi profile”)

`DB.java` vẫn là `@Configuration` + `CommandLineRunner` seed lớn, nhưng đã có **`@Profile("dev")`** — chỉ chạy khi bật profile dev, phù hợp local/demo.

Việc cần làm thêm (không chặn như trước): tách module seed hoặc bật bằng property `app.seed.enabled` nếu muốn kiểm soát tinh hơn giữa các máy dev.

---

## ⚠️ Nhận định chi tiết theo từng hạng mục

### Kiến trúc tổng thể - 6/10

Điểm tốt:

- Có tách lớp controller/service/repository/dto/mapper tương đối rõ (~40 controller, ~80+ file service layer)
- Data layer có hướng đi đúng hơn nhờ Flyway + auditing + schema evolution
- Có aspect riêng cho rate limiting
- Seed mẫu `DB` giới hạn `@Profile("dev")`, giảm rủi ro chạy nhầm trên profile khác

Điểm trừ:

- Nhiều class quá lớn: `AuthenController`, `AccountService`, `InvoiceService`, `DB` (dù seed đã an toàn hơn về profile)
- Business logic vẫn còn nằm ở controller
- Vẫn còn nhiều “legacy slice” và naming khó bảo trì như `TemporaryR_contract`, `SupportControlller`, `INameMotelServiceService`

### Bảo mật - 5/10

Điểm tốt:

- OTP qua Redis là cải tiến đáng ghi nhận
- Có rate limit cho auth endpoints
- `PUBLIC_ENDPOINTS` không còn mở quá rộng kiểu `/api-accounts/**`
- Cấu hình nhạy cảm chuyển sang biến môi trường / `.env`; `CustomerEnvironment` không còn hardcode MoMo trong `selectEnv`

Điểm trừ:

- Rủi ro lộ secret qua git đã được giảm thiểu bằng `.gitignore`, template sạch và hướng dẫn quy trình rotate trong README.
- Đã bật CSRF với `CookieCsrfTokenRepository`.
- Input validation: Đã triển khai hệ thống (DTO validation + @Valid + GlobalExceptionHandler xử lý thông báo chi tiết).
- Payment callback: Đã verify chữ ký cho VNPay.

### Code Quality - 5/10

Điểm tốt:

- Entity chính đã bớt dùng Lombok kiểu nguy hiểm cho JPA
- Mapper/DTO được dùng ở khá nhiều nơi
- Một phần code đã có logging thay cho in thẳng console

Điểm trừ:

- Đã dọn `System.out.println()` và `printStackTrace()` ở các điểm nóng runtime (Tenant/Authen/Account, Mail/ReserveAPlace/MotelDevice). Còn lại chủ yếu là dòng **đã comment** trong config/utility.
- `OpenAPIConfig.java` đang bị comment toàn bộ
- Có nhiều bug “nhỏ nhưng thật”:
  - `SearchController` nhận `DESC` nhưng vẫn gọi hàm sort tăng dần
  - `AccountController#getAccountByUsername` dựng `Map` response nhưng lại trả thẳng object khác
- Compile cho thấy rất nhiều cảnh báo MapStruct về unmapped properties

### Error Handling - 8/10

Điểm tốt:
- Có `AppException` và hệ thống `ErrorCode` tập trung.
- `GlobalExceptionHandler` đã cover đầy đủ: validation, `EntityNotFoundException`, `MethodArgumentNotValidException`, parse/token exception, và lỗi 500 tổng quát.
- Các Controller trọng yếu (`Authen`, `Account`) đã được dọn dẹp `try/catch`, trả về `ApiResponse` đồng nhất.

Điểm trừ:
- Cần tiếp tục rà soát và refactor các Controller còn lại (`Motel`, `Room`, `Contract`...) để loại bỏ nốt các khối `try/catch` cũ.

### Testing - 4/10

Điểm tốt:

- Số lượng test file đã tăng đáng kể so với review cũ
- Có test cho service, controller và config
- Có H2 + `application-test.properties` (Flyway tắt trong test, JWT và secret giả)

Điểm trừ:

- Build test hiện không xanh (**37 errors / 119 tests**)
- Slice test chưa đủ mock cho Redis/security
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

- Có migration versioned (tới `V4` brokers)
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

1. **Payment và webhook** chưa verify đủ (VNPay/MoMo), URL vẫn kiểu dev — rủi ro gian lận và sai mapping giao dịch.
2. **Testing chưa đáng tin** — suite đỏ (**37 errors / 119**), gồm cả hậu quả refactor config và thiếu mock slice test.
3. **API/controller quality còn phân mảnh** — response contract, naming, validation và global error handling chưa thống nhất.

---

## 🎯 Ưu tiên xử lý trong 2-4 tuần tới

### Priority 1 - Bắt buộc trước khi coi là production candidate

1. [x] **Secret & vận hành**: đã chuyển sang env trong `application.properties`; đảm bảo không commit `.env`, bỏ default mật khẩu yếu.
2. [x] **`DB.java`**: đã `@Profile("dev")` — seed không chạy trên profile mặc định.
3. [/] **Test infrastructure**:
   - [x] `src/test/resources/application-test.properties` (H2, secret giả)
   - [ ] Tách rõ unit vs slice (`@WebMvcTest` + `@ImportMock`) vs integration; bổ sung `@MockBean` Redis/security nơi cần
   - [ ] Đưa `.\mvnw.cmd test` về **0 errors** (hiện **37 errors / 119 tests**); sửa `CustomerEnvironmentTest` theo API mới
4. [x] **Payment**: verify chữ ký VNPay, URL return/notify theo env, bỏ `notifyURL` placeholder.

### Priority 2 - Nâng chất lượng lõi

1. [x] Chuẩn hóa toàn bộ response về một contract duy nhất (`ApiResponse`) tại các Controller chính.
2. [x] Bổ sung validation annotation cho request DTO (Đã triển khai cho Authen/Account).
3. [/] Refactor các class lớn: đã làm `AuthenController`, `AccountController`; cần tiếp tục `AccountService`, `InvoiceService`.
4. [x] Loại bỏ debug prints, dead code, manual try-catch tại Controller.

### Priority 3 - Tối ưu truy vấn và khả năng mở rộng

1. Xử lý N+1 ở invoice/search/report flows
2. Thêm pagination cho endpoint list
3. Dùng cache/search theo chiến lược rõ ràng thay vì điểm lẻ tẻ
4. Bổ sung health check, observability và runbook vận hành

---

## ✅ Chốt lại

Nếu chỉ xét riêng phần database, dự án đã đi từ mức “cần sửa nền móng” lên mức “có nền tảng tương đối tốt để phát triển tiếp”. Nếu xét toàn bộ backend theo chuẩn senior cho production, hệ thống hiện tại ở **~4.8/10** — **trung bình thấp đến trung bình**: tầng dữ liệu và cách cấu hình secret đã bắt kịp thực hành tốt hơn, nhưng **payment hardening**, **test xanh** và **API/error thống nhất** vẫn là các lỗ hổng lớn so với môi trường production.
