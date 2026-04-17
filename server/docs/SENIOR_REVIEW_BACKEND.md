# 🔍 ĐÁNH GIÁ BACKEND (Spring Boot) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Software Engineer Review
> **Ngày đánh giá**: 2026-04-17
> **Phiên bản đánh giá**: 1.0.0
> **Stack**: Spring Boot 3.3.3 + Java 17 + MySQL + Redis + Elasticsearch

---

## 📊 TỔNG QUAN ĐÁNH GIÁ

| Tiêu chí           | Điểm (1-10) | Ghi chú                                            |
| ------------------ | ----------- | -------------------------------------------------- |
| Kiến trúc tổng thể | 5/10        | Layered architecture cơ bản, chưa có domain-driven |
| Bảo mật            | 3/10        | **CRITICAL** - Hardcode secrets, lộ credentials    |
| Code Quality       | 5/10        | Có pattern nhưng chưa nhất quán                    |
| Error Handling     | 4/10        | GlobalExceptionHandler đơn giản, thiếu nhiều case  |
| Testing            | 2/10        | Gần như không có unit test                         |
| Performance        | 4/10        | N+1 query, EAGER fetch everywhere                  |
| Scalability        | 4/10        | Redis + Elasticsearch có nhưng chưa tận dụng tốt   |
| Documentation      | 2/10        | Swagger có nhưng docs folder trống                 |
| Database Design    | 5/10        | ERD có nhưng naming convention không nhất quán     |
| API Design         | 4/10        | RESTful cơ bản, response format không thống nhất   |

**Điểm trung bình: 3.8/10** - Cần cải thiện đáng kể để production-ready.

---

## 🚨 VẤN ĐỀ NGHIÊM TRỌNG (CRITICAL)

### 1. BẢO MẬT - Lộ toàn bộ credentials trong source code

> [!CAUTION]
> **Mức độ: CRITICAL** - Đây là lỗi bảo mật nghiêm trọng nhất của dự án.

**Vị trí**: `server/.env`, `application.properties`

```properties
# .env - LỘ TOÀN BỘ SECRETS
DB_PASSWORD=12345
JWT_SIGNER=BE6HM/oN7KIuLdNEoYjXYrLFSrGEX7bNywc9Z3AKkdGsHhbkJeM2XbqCKqfT0aqC
REDIS_PASSWORD=BdM0pUHgEJEzmTvgMSwboeCnCHfMhz48
PAYPAL_SECRET=EERA0BTA7HmkHWg81Y1hFIwPMw1TH5o4QiuViWOlibSvto53ePiiWG4QNpTw4uzSOSLtfb5pjfxLAe_f
STRIPE_SECRET_KEY=sk_test_...
MY_PASSWORD_APP=aebpmtubuaomkywb
```

```properties
# application.properties - HARDCODE MẬT KHẨU
spring.datasource.password=12345
spring.mail.password=aebpmtubuaomkywb
spring.security.oauth2.client.registration.google.client-secret=GOCSPX-...
```

**Hậu quả**:

- Bất kỳ ai truy cập được Git repository đều có thể chiếm quyền điều khiển toàn bộ hệ thống
- Truy cập database, Redis, Stripe, PayPal, Gmail
- Tạo JWT token giả mạo bất kỳ user nào

**Giải pháp**:

1. **Ngay lập tức**: Thêm `.env` vào `.gitignore`, rotate ALL secrets
2. **Tách biệt**: Sử dụng `.env.example` (template) + `.env` (actual, gitignored)
3. **Production**: Sử dụng vault service (HashiCorp Vault, AWS Secrets Manager)
4. `application.properties` chỉ chứa `${ENV_VAR}` references, không hardcode

---

### 2. OTP/Verification Code lưu trong static variable

> [!CAUTION]
> **Mức độ: CRITICAL** - Race condition + Session leak

**Vị trí**: `AuthenController.java` (dòng 231-232)

```java
private static int randomNumber = 0;        // ĐÂY LÀ BIẾN STATIC!
private static int randomNumberRegister = 0; // TOÀN BỘ USERS CHIA SẺ CHUNG!
```

**Hậu quả**:

- **Race condition**: Nếu 2 user cùng gửi yêu cầu quên mật khẩu, user đầu tiên bị ghi đè OTP
- **Security bypass**: Attacker chỉ cần brute-force 5 chữ số (10000-99999)
- **Không có expiration**: OTP không hết hạn

**Giải pháp**:

```java
// Lưu OTP trong Redis với TTL 5 phút
@Autowired
private StringRedisTemplate redisTemplate;

private void storeOTP(String email, String otp) {
    redisTemplate.opsForValue().set("otp:" + email, otp, 5, TimeUnit.MINUTES);
}

private boolean verifyOTP(String email, String otp) {
    String stored = redisTemplate.opsForValue().get("otp:" + email);
    if (stored != null && stored.equals(otp)) {
        redisTemplate.delete("otp:" + email); // Dùng 1 lần
        return true;
    }
    return false;
}
```

---

### 3. Hardcode `localhost:8080` trong API Client

> [!WARNING]
> **Mức độ: HIGH** - Không hoạt động khi deploy production

**Vị trí**: `apiClient.js` (frontend)

```javascript
// Các API này sẽ KHÔNG hoạt động trên production
export const getAccountByUsername = async (username) => {
  return await axios.get(`http://localhost:8080/api-accounts/get-account/${username}`)
}

export const createBroker = async (data) => {
  return await axios.post(`http://localhost:8080/broker`, data, {...})
}

export const introspect = async () => {
  return await axios.post(`http://localhost:8080/authen/introspect`, {...})
}
```

**Giải pháp**: Thay tất cả bằng `${env.API_URL}`

---

## ⚠️ VẤN ĐỀ KIẾN TRÚC

### 4. EAGER Fetching khắp nơi - N+1 Query Problem

**Vị trí**: Hầu hết entities (Account, Room, Motel,...)

```java
// Account.java
@OneToMany(mappedBy = "account", fetch = FetchType.EAGER) // ❌
List<Auth> authorities;

@OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) // ❌
private List<Contract> contracts;

@OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) // ❌
private List<Motel> motels;

// Room.java - 3 OneToMany ALL EAGER
@OneToMany(mappedBy = "room", ..., fetch = FetchType.EAGER) // contracts
@OneToMany(mappedBy = "room", ..., fetch = FetchType.EAGER) // tenants
@OneToMany(mappedBy = "room", ..., fetch = FetchType.EAGER) // reserveAPlaces
```

**Hậu quả**:

- Mỗi lần load 1 Account → load ALL Contracts, ALL Motels, ALL Auth
- Mỗi Motel lại load ALL Rooms → mỗi Room load ALL Tenants, Contracts, ReserveAPlaces
- **Cascading query explosion**: 1 request có thể sinh hàng trăm SQL queries

**Giải pháp**:

```java
// Mặc định LAZY cho tất cả @OneToMany
@OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
private List<Contract> contracts;

// Sử dụng @EntityGraph khi cần JOIN FETCH
@EntityGraph(attributePaths = {"contracts", "motels"})
@Query("SELECT a FROM Account a WHERE a.username = :username")
Optional<Account> findByUsernameWithDetails(@Param("username") String username);
```

---

### 5. Sử dụng `@Data` trên JPA Entity

**Vị trí**: Tất cả entity models

```java
@Entity
@Data // ❌ KHÔNG NÊN dùng trên JPA Entity
public class Account { ... }
```

**Hậu quả**:

- `@Data` sinh `equals()` và `hashCode()` bao gồm ALL fields → **StackOverflow** khi có circular reference (Account ↔ Contract ↔ Room)
- `toString()` cũng gây lazy loading exception

**Giải pháp**:

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Account)) return false;
        return username != null && username.equals(((Account) o).username);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode(); // Consistent hash cho JPA proxies
    }
}
```

---

### 6. Primary Key là `username` (String) cho Account

```java
@Id
@Column(columnDefinition = "VARCHAR(255)", nullable = false)
private String username; // ❌ Business data as PK
```

**Hậu quả**:

- Không thể đổi username mà không cascade update tất cả FK
- Performance kém hơn UUID/Long cho index
- Foreign key everywhere phải join bằng VARCHAR

**Giải pháp (long-term)**:

- Sử dụng UUID làm PK, thêm unique constraint cho `username`
- Tạo migration plan để chuyển đổi dần

---

### 7. Response Format không thống nhất

**AuthenController** sử dụng **3 kiểu response khác nhau**:

```java
// Kiểu 1: HashMap
Map<String, Object> response = new HashMap<>();
response.put("status", true);
response.put("message", "...");
return ResponseEntity.ok(response);

// Kiểu 2: ApiResponse<T>
return ApiResponse.<Boolean>builder()
    .code(HttpStatus.OK.value())
    .message("success")
    .result(true)
    .build();

// Kiểu 3: Custom DTO
return ResponseEntity.ok(loginResponse);
```

**Giải pháp**: Thống nhất sử dụng `ApiResponse<T>` cho TOÀN BỘ endpoints:

```java
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ApiResponse<T> {
    @Builder.Default
    private int code = 200;
    private String message;
    private T result;
    private Map<String, String> errors; // for validation
    private Instant timestamp = Instant.now();
}
```

---

### 8. Controller chứa Business Logic

**Vị trí**: `AuthenController.java` (414 dòng)

Controller đang chứa:

- OTP generation logic
- Email validation logic
- Password change flow
- Registration verification flow

**Giải pháp**: Tách tất cả business logic vào Service layer:

```
AuthenController (thin) → AuthenticationService → AccountService + MailService + OTPService
```

---

### 9. Thiếu Rate Limiting cho Authentication APIs

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // Không có rate limiting → brute force attack possible
}
```

**Giải pháp**: Sử dụng `RedisRateLimiter` (đã có trong configs nhưng chưa áp dụng):

```java
@PostMapping("/login")
@RateLimited(key = "login", maxAttempts = 5, windowSeconds = 300)
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) { ... }
```

---

## 📋 DANH SÁCH CẦN CẢI THIỆN

### Database & JPA

- [x] Chuyển tất cả `@OneToMany` sang `FetchType.LAZY`
- [x] Thay `@Data` bằng `@Getter @Setter` cho entities
- [x] Thêm database migration tool (Flyway/Liquibase) thay cho `ddl-auto=update`
- [x] Thêm `@CreatedDate`, `@LastModifiedDate` audit cho entities
- [ ] Fix naming convention: `TemporaryR_contract` → `TemporaryContract` (Đã fix `collection_cycle`, `contract_template`)
- [ ] Sử dụng UUID PK cho Account thay vì username
- [x] Thêm database indexes cho các trường search thường xuyên
- [x] Fix kiểu dữ liệu: `countTenant` dùng TEXT thay vì INT ở một số chỗ

### Security

- [x] **CRITICAL**: Xóa tất cả hardcoded secrets khỏi source
- [x] **CRITICAL**: Fix OTP storage (dùng Redis thay static variable)
- [x] Thêm Rate Limiting cho login/register/forgot-password
- [ ] Thêm input validation cho tất cả Request DTOs (`@Valid`, `@NotBlank`, `@Size`)
- [x] Review và thu hẹp PUBLIC_ENDPOINTS (`/api-accounts/**` quá rộng)
- [ ] Thêm CORS configuration chặt chẽ hơn (không dùng wildcard)
- [ ] Implement CSRF protection cho non-API endpoints
- [ ] Thêm refresh token rotation strategy

### API Design

- [ ] Thống nhất response format: TOÀN BỘ dùng `ApiResponse<T>`
- [ ] Thêm pagination cho list endpoints
- [ ] Versioning API (`/api/v1/...`)
- [ ] Chuẩn hóa HTTP status codes
- [ ] Thêm request/response logging middleware
- [ ] Thêm correlation ID cho request tracing

### Code Quality

- [ ] Tách business logic khỏi Controllers
- [ ] Thêm `@Valid` annotation cho tất cả `@RequestBody`
- [ ] Xóa `System.out.println()` (dùng `log.info()`)
- [ ] Fix typo trong tên class: `SupportControlller` → `SupportController`
- [ ] Fix naming: `IRoomServiceService`, `IContractServiceService` (confusing names)
- [ ] Tách `apiClient.js` (frontend) thành module riêng cho từng domain

### Testing

- [x] Viết unit test cho Service layer (target > 70% coverage)
- [ ] Viết integration test cho API endpoints
- [ ] Viết test cho security configuration
- [ ] Setup test profile riêng với H2 database

### Infrastructure

- [ ] Tận dụng Redis cho caching (đã cấu hình nhưng chưa dùng)
- [ ] Tận dụng Elasticsearch cho full-text search (đã cấu hình nhưng chưa tối ưu)
- [ ] Thêm health check endpoint (`/actuator/health`)
- [ ] Cấu hình logging structured (JSON format cho production)
- [ ] Thêm Docker health checks
- [ ] Setup CI/CD pipeline

---

## 🔄 LUỒNG XỬ LÝ CẦN SỬA/BỔ SUNG

### 1. Luồng Đăng ký (Register) - Cần bổ sung

```
Hiện tại: Register → Tạo account ngay
Cần sửa:  Register → Send OTP → Verify OTP → Tạo account
```

- Thiếu email/phone verification trước khi tạo tài khoản
- Không validate phone format phía server (comment out)

### 2. Luồng Quên mật khẩu - BUG NGHIÊM TRỌNG

```
Bug: OTP lưu static → race condition giữa nhiều users
Fix: Lưu Redis với key = "otp:forgot:{email}", TTL = 5min
```

### 3. Luồng Hợp đồng (Contract) - Thiếu validation

- Không check room availability trước khi tạo hợp đồng
- Không check overlap dates giữa các hợp đồng cùng phòng
- Thiếu luồng gia hạn hợp đồng
- Thiếu luồng thanh lý hợp đồng hoàn chỉnh

### 4. Luồng Thanh toán - Cần hoàn thiện

- Stripe, PayPal, MoMo, VNPay đều có nhưng thiếu webhook verification
- Thiếu idempotency cho payment requests
- Thiếu reconciliation (đối soát)

### 5. Luồng cần bổ sung mới

- [ ] Thông báo realtime (WebSocket/SSE) khi có hóa đơn mới, hợp đồng hết hạn
- [ ] Scheduled job: Tự động tạo hóa đơn hàng tháng
- [ ] Scheduled job: Cảnh báo hợp đồng sắp hết hạn
- [ ] Audit log: Ghi lại mọi thay đổi quan trọng
- [ ] Export báo cáo (Excel/PDF)

---

## 🗺️ ROADMAP ĐỀ XUẤT

### Phase 1: Security Fix (1-2 tuần)

1. Xóa hardcoded secrets, setup proper env management
2. Fix OTP storage (Redis)
3. Thêm rate limiting
4. Thu hẹp PUBLIC_ENDPOINTS

### Phase 2: Data Layer Fix (2-3 tuần)

1. Chuyển sang LAZY fetching
2. Fix entity annotations
3. Setup Flyway migration
4. Thêm proper indexes

### Phase 3: API Standardization (2-3 tuần)

1. Thống nhất response format
2. Thêm validation
3. Tách business logic khỏi controllers
4. API versioning

### Phase 4: Testing & Monitoring (2-3 tuần)

1. Unit tests cho services
2. Integration tests cho APIs
3. Setup actuator + monitoring
4. Structured logging

### Phase 5: Feature Enhancement (ongoing)

1. WebSocket notifications
2. Scheduled jobs
3. Report generation
4. Full-text search optimization
