# 🔍 ĐÁNH GIÁ BACKEND (Spring Boot) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Backend Review
> **Ngày đánh giá**: 2026-04-20
> **Phiên bản đánh giá**: 2.2.0
> **Phạm vi**: Toàn bộ backend `server/` gồm `src/main`, `src/test`, `resources`, migration SQL và build config
> **Stack**: Spring Boot 3.3.3 + Java 17 + MySQL + Redis + Elasticsearch
> **Cơ sở đánh giá**: đọc code hiện trạng, rà soát cấu trúc package/file, `pom.xml`, Flyway `V1`–`V4`, và chạy **`.\mvnw.cmd test`** (Maven CLI có thể không có trên PATH môi trường build)

---

## 🛠️ Những cải thiện đã thực hiện (trong session này)

Tập trung theo thứ tự **dễ → khó** (testing làm cuối), ưu tiên thay đổi **ít rủi ro** nhưng nâng chất lượng ngay.

### 0) Cập nhật hiện trạng theo codebase hiện tại (2026-04-20)

- **`configs/`**
  - [x] `OpenAPIConfig.java`: bỏ comment toàn file, kích hoạt lại bean OpenAPI, chuyển server URL sang biến môi trường `OPENAPI_SERVER_URL`.
  - [x] `application.properties`: thêm `app.openapi.server-url=${OPENAPI_SERVER_URL:http://localhost:8080}`.
- **`test/configs/`**
  - [x] `OpenAPIConfigTest.java`: bỏ comment, chạy lại như unit config test cho OpenAPI bean và global headers.
- **`build`**
  - [x] `pom.xml`: đã gỡ compiler arg global `-Amapstruct.unmappedTargetPolicy=IGNORE`.
  - [x] MapStruct policy được đưa về code mapper (`@Mapper(..., unmappedTargetPolicy = ReportingPolicy.IGNORE)`) để cấu hình theo từng mapper.
  - [x] Xác minh lại `.\mvnw.cmd -DskipTests compile`: **BUILD SUCCESS**; Spotless giữ sạch codebase.
- **`runtime prints`**
  - [x] Không còn `System.out.println` / `printStackTrace` chạy runtime trong `src/main/java`; chỉ còn dòng đã comment trong `RedisConfig` và `CreateOrderMoMo`.

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
- **Auth Log Hygiene**: Đã bỏ log nhạy cảm trong `AuthenController` (không log OAuth attributes/JWT token).
- **Least-Privilege Public Endpoints**: Thu hẹp `SecurityConfig.PUBLIC_ENDPOINTS` còn đúng nhóm chức năng public cần thiết (auth, callback thanh toán, docs, search/detail, captcha, support).
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
| Kiến trúc tổng thể | **6.5/10**  | Layered architecture rõ (`Controller → Service → Repository`) và đã có các config/aspect tách lớp. Tuy nhiên còn controller/service quá dày (`AuthenController`, `PaymentController`, `InvoiceService`) và naming legacy (`TemporaryR_contract`, `SupportControlller`). |
| Bảo mật            | **7.0/10**  | Secret/env đã đi đúng hướng; JWT + CSRF + Redis OTP + rate limit đang hoạt động. Điểm trừ lớn: vẫn log thông tin nhạy cảm trong auth (OAuth attributes/JWT token), và `PUBLIC_ENDPOINTS` còn khá rộng ở `SecurityConfig`. |
| Code Quality       | **6.0/10**  | Spotless sạch; debug print runtime gần như đã dọn; `OpenAPIConfig` đã mở lại. Tuy nhiên còn không nhất quán DI (`@Autowired` + constructor), và MapStruct unmapped mới triage ở mức build (`IGNORE`) chưa xử lý triệt để mapping domain phức tạp. |
| Error Handling     | **6.5/10**  | Có `AppException`, `ErrorCode`, `GlobalExceptionHandler` tập trung. Nhưng vẫn lẫn `RuntimeException`/`IllegalArgumentException` trong service và chưa đồng nhất hoàn toàn contract lỗi giữa các module. |
| Testing            | **4.5/10**  | Có nền test tương đối rộng và có `application-test.properties`. Nhưng nhiều test còn bị comment, có test trỏ `classpath:test.properties` không tồn tại, và test legacy chưa theo refactor mới (build tổng thể vẫn chưa ổn định). |
| Performance        | **5.5/10**  | Có LAZY + index tốt ở nhiều entity. Điểm nghẽn chính còn tồn tại là luồng invoice dễ N+1 (`InvoiceService#getInvoicesByMotelId`) và thiếu pagination có hệ thống cho endpoint list lớn. |
| Scalability        | **5.5/10**  | Có Redis cho OTP/rate-limit, đã có nền search/cache ban đầu. Nhưng caching còn điểm lẻ, chưa có pattern async/job/outbox rõ ràng, và readiness/operability chưa đầy đủ. |
| Documentation      | **5.0/10**  | OpenAPI config đã hoạt động lại, nhiều controller có `@Operation/@Tag`. Tuy nhiên tài liệu vận hành backend vẫn thiếu chiều sâu (runbook, convention API, testing strategy). |
| Database Design    | **7.0/10**  | Data model/auditing/index đã khá vững; Flyway versioning có mặt. Điểm trừ: `V2` và `V3` đang là migration rỗng, `Account.username` vẫn business-key PK, naming legacy còn rải rác. |
| API Design         | **5.0/10**  | Đã dùng `ApiResponse<T>` ở nhiều endpoint. Nhưng vẫn trộn nhiều kiểu response (`ApiResponse`, `ResponseEntity`, `Map`, plain object/string), route naming chưa thống nhất RESTful, và thiếu versioning/pagination nhất quán. |

**Điểm trung bình: 5.9/10** — Backend đã tiến lên mức “có nền tảng vận hành dev/staging khá ổn”, nhưng còn khoảng cách tới production-grade ở 4 trụ cột: **an toàn log/bề mặt public**, **độ tin cậy test**, **đồng nhất API/error contract**, và **tối ưu truy vấn lớn**.

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

### 1. Log thông tin nhạy cảm trong luồng xác thực

**Mức độ: HIGH**

- `AuthenController` vẫn log đầy đủ OAuth attributes và JWT token ở mức `info`.
- Đây là rủi ro lộ dữ liệu trong log aggregation/monitoring pipeline dù business flow auth đã đúng.
- Hành động cần làm: giảm log xuống metadata an toàn (request id, provider, username đã mask), tuyệt đối không log raw token/claims.

### 2. Độ tin cậy test suite chưa đạt mức CI gate

**Mức độ: HIGH**

- Nhiều test class còn bị comment phần lớn hoặc toàn bộ, nên “test tồn tại nhưng không bảo vệ regression”.
- Có test dùng `@TestPropertySource(locations = "classpath:test.properties")` trong khi `src/test/resources` hiện chỉ có `application-test.properties`.
- Một số test legacy chưa theo refactor (ví dụ behavior cũ của `CustomerEnvironment`), làm giảm độ tin cậy khi merge.

### 3. Truy vấn tổng hợp invoice còn rủi ro N+1

**Mức độ: HIGH**

- `InvoiceService#getInvoicesByMotelId` duyệt nhiều lớp dữ liệu và gọi repository lặp theo vòng lồng nhau.
- Khi dữ liệu tăng (nhiều room/contract/invoice), response time sẽ tăng phi tuyến và gây áp lực DB.
- Cần chuyển sang truy vấn tổng hợp có `JOIN FETCH`/projection hoặc read model riêng cho report.

### 4. Bề mặt endpoint public còn rộng

**Mức độ: MEDIUM**

- `SecurityConfig` vẫn đang whitelist `PUBLIC_ENDPOINTS` với phạm vi rộng cho nhiều nhóm API.
- Kết hợp với CSRF cookie `withHttpOnlyFalse()` làm yêu cầu hardening frontend/cookie policy cao hơn.
- Cần rà soát theo principle of least privilege cho từng endpoint.

### 5. Tính nhất quán migration và naming còn nợ kỹ thuật

**Mức độ: MEDIUM**

- `V2__sync_restructured_schema.sql` và `V3__link_transactions_to_invoices.sql` hiện là migration rỗng.
- Naming legacy/typo còn tồn (`TemporaryR_contract`, `SupportControlller`), ảnh hưởng maintainability dài hạn.
- Cần chuẩn hóa naming + migration hygiene trước các đợt release lớn.

---

## ⚠️ Nhận định chi tiết theo từng hạng mục

### Kiến trúc tổng thể - 6.5/10

Điểm tốt:

- Có tách lớp controller/service/repository/dto/mapper tương đối rõ và dễ theo domain.
- Có các config/aspect rõ vai trò (`SecurityConfig`, `JpaAuditingConfig`, `RateLimitAspect`).
- Data layer có nền tốt với Flyway + auditing + schema evolution.

Điểm trừ:

- Một số class còn dày và ôm nhiều use-case (`AuthenController`, `PaymentController`, `InvoiceService`).
- Business logic vẫn còn xuất hiện ở controller thay vì đẩy hết về service/domain.
- Naming legacy/typo vẫn tồn tại (`TemporaryR_contract`, `SupportControlller`).

### Bảo mật - 7.0/10

Điểm tốt:

- Cấu hình nhạy cảm đã chuyển sang env placeholder trong `application.properties`.
- JWT resource server, CSRF, OTP Redis và rate limit đã có mặt.
- Callback thanh toán chính (VNPay) đã được verify chữ ký.

Điểm trừ:

- `AuthenController` còn log OAuth attributes và JWT token ở mức `info`.
- `PUBLIC_ENDPOINTS` trong `SecurityConfig` còn rộng, cần thu hẹp theo least privilege.
- `CookieCsrfTokenRepository.withHttpOnlyFalse()` yêu cầu hardening XSS rất chặt ở frontend.

### Code Quality - 6.0/10

Điểm tốt:

- Spotless giữ code style sạch toàn codebase.
- Hầu hết `System.out.println`/`printStackTrace` runtime đã được dọn.
- `OpenAPIConfig` và test liên quan đã được khôi phục.

Điểm trừ:

- Dependency injection trong `src/main` đã chuẩn hóa theo constructor injection (`@RequiredArgsConstructor` + `final` fields), loại bỏ `@Autowired` field injection.
- MapStruct không còn phụ thuộc compiler arg global; mapper policy được đặt trực tiếp ở code.
- Vẫn còn dead/commented code ở một số module làm giảm tín hiệu chất lượng thực.

### Error Handling - 6.5/10

Điểm tốt:

- Có `AppException` + `ErrorCode` + `GlobalExceptionHandler` làm trục xử lý lỗi tập trung.
- Validation lỗi (`@Valid`) đã được map về response có cấu trúc.

Điểm trừ:

- Service layer còn pha trộn `AppException` với `RuntimeException`/`IllegalArgumentException`.
- Chưa đồng nhất hoàn toàn giữa HTTP status, business error code và message contract cho mọi module.

### Testing - 4.5/10

Điểm tốt:

- Có mặt đầy đủ nhóm test controller/service/config và có `application-test.properties`.
- Một số test cấu hình mới đã chạy xanh (ví dụ `OpenAPIConfigTest`).

Điểm trừ:

- Nhiều test class còn comment phần lớn hoặc toàn bộ.
- Có test trỏ `classpath:test.properties` không khớp file thực tế trong `src/test/resources`.
- Một số test legacy chưa theo refactor mới (security/payment/environment).
- Chưa có chiến lược phân tầng test rõ ràng (unit vs slice vs integration) làm CI khó ổn định.

### Performance - 5.5/10

Điểm tốt:

- LAZY và index đã được áp dụng ở nhiều entity quan trọng.
- Dữ liệu nền tốt hơn giúp giảm một phần truy vấn không cần thiết.

Điểm trừ:

- `InvoiceService#getInvoicesByMotelId()` vẫn có pattern gọi repository lồng nhau, rủi ro N+1 cao.
- Chưa thấy chiến lược truy vấn tổng hợp nhất quán (`JOIN FETCH`, projection/read model) cho báo cáo/list lớn.
- Pagination chưa trở thành chuẩn bắt buộc cho các endpoint trả danh sách lớn.

### Scalability - 5.5/10

Điểm tốt:

- Có Redis cho OTP/rate limiting.
- Đã có nền search/log stack trong môi trường docker local.

Điểm trừ:

- Caching mới ở mức điểm lẻ (chưa thành chiến lược toàn hệ thống).
- Chưa rõ pattern async/background jobs/outbox cho workload tăng trưởng.
- Readiness/operability cho scale-out chưa đầy đủ.

### Documentation - 5.0/10

Điểm tốt:

- OpenAPI đã hoạt động lại và có cấu hình server URL theo env.
- Nhiều controller đã có `@Tag`/`@Operation`.

Điểm trừ:

- Thiếu backend runbook chi tiết cho local/dev/test/deploy.
- Thiếu tài liệu chuẩn hóa API convention và error contract cho team.

### Database Design - 7.0/10

Điểm tốt:

- Có Flyway migration và auditing chuẩn qua `BaseEntity`.
- Mô hình dữ liệu có nhiều bảng phụ trợ hợp lý hơn trước, index tốt hơn.
- UUID đã dùng cho nhiều aggregate chính.

Điểm trừ:

- `Account.username` vẫn là business key primary key.
- `V2` và `V3` là migration rỗng, làm giảm độ rõ lịch sử schema.
- Naming và legacy table/entity vẫn chưa đồng nhất hoàn toàn.

### API Design - 5.0/10

Điểm tốt:

- `ApiResponse<T>` đã được dùng ở nhiều endpoint.
- Domain controller đã được tách theo nhóm nghiệp vụ.

Điểm trừ:

- Vẫn trộn nhiều kiểu response (`ApiResponse`, `ResponseEntity`, `Map`, plain object/string).
- Naming route chưa nhất quán RESTful (`/searchs`, `/get-all-account`, `/createAccount`, ...).
- Chưa thấy chính sách versioning/pagination áp dụng đồng nhất toàn API.

---

## 📌 Kết luận senior-level

So với lần review trước, backend này **đã cải thiện thật** ở phần data model và JPA hygiene. Việc bổ sung Flyway, auditing, các bảng mới cho occupant/handover/meter reading, và loại bỏ EAGER phổ biến là những thay đổi đúng hướng và có giá trị dài hạn.

Tuy nhiên, codebase hiện vẫn đang ở trạng thái **“đủ để phát triển tiếp và demo nội bộ, nhưng chưa đạt production-grade ổn định”**. Ba điểm đang kéo chất lượng chung xuống mạnh nhất là:

1. **Bảo mật vận hành chưa kín** — còn log token/attributes trong auth flow và bề mặt endpoint public còn rộng.
2. **Testing chưa đủ tin cậy làm CI gate** — nhiều test bị comment/legacy, cấu hình test chưa đồng nhất hoàn toàn.
3. **Hiệu năng và contract API chưa nhất quán** — còn N+1 ở luồng invoice và response/route conventions còn phân mảnh.

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

Nếu chỉ xét riêng phần database, dự án đã đi từ mức “cần sửa nền móng” lên mức “có nền tảng tương đối tốt để phát triển tiếp”. Nếu xét toàn bộ backend theo chuẩn senior cho production, hệ thống hiện tại ở **~5.9/10** — **trung bình**: data layer và security baseline đã khá hơn rõ rệt, nhưng **hardening log/public surface**, **độ tin cậy test**, và **đồng nhất API/query strategy** vẫn là các khoảng trống lớn cần đóng trong các sprint kế tiếp.
