# DANH GIA BACKEND (Spring Boot) - Goc nhin Senior Engineer

> Nguoi danh gia: Senior Backend Review  
> Ngay danh gia: 2026-04-21  
> Pham vi: Toan bo backend `server/` voi doi chieu code hien tai + compile/test thuc te  
> Co so danh gia: doc source `src/main`, `src/test`, migration SQL, security config, va chay:
> - `./mvnw.cmd -DskipTests compile` -> `BUILD SUCCESS`
> - `./mvnw.cmd test` -> `BUILD FAILURE`
> - `./mvnw.cmd "-Dtest=InvoiceServiceTest,TransactionServiceTest" test` -> `BUILD SUCCESS`

---

## Tong quan nhanh

Backend hien tai da co nhung cai thien that o 3 truc da neu truoc do:

- Diem nong invoice N+1 da duoc xu ly o `InvoiceService` bang query phan trang theo ID + batch fetch detail.
- API contract da tien bo cuc bo o cac module `Account`, `Invoice`, `Transaction`, `Permission`, `Statistics`, `Report`.
- Error handling da tot hon o cac module vua refactor nho `ErrorCode`, `AppException`, `GlobalExceptionHandler`.

Tuy nhien, neu nhin toan codebase voi tieu chuan production-grade, du an van o trang thai "dang chuyen doi do dang". Nghia la co nhung module da vao nep moi, nhung phan lon codebase van mang dau vet legacy:

- response contract chua dong nhat toan bo
- service layer van nem nhieu `RuntimeException` / `IllegalArgumentException`
- full test suite van do
- security surface van rong
- naming/migration debt van con nguyen

---

## Cap nhat Phase 1 (2026-04-21)

Nhung hang muc da trien khai xong trong dot nay:

- Da sua bug auth refresh token bang cach thong nhat `JWT subject = username` trong `AuthorityService.generateToken(...)`, giu `refreshToken(...)` lookup theo `findByUsername(...)`.
- Da bo sung unit test cho `generateToken()` va `refreshToken()` trong `AuthorityServiceTest`.
- Da sua logic sai ro rang o `SearchController`: nhanh `DESC` nay goi dung `getRoomsSortedByPriceDESC()`.
- Da them alias backward-compatible cho route search:
  - giu `/searchs`
  - them `/search`
  - them `/api/v1/search`
- Da them alias backward-compatible cho support route:
  - giu `/support`
  - them `/supports`
  - them `/api/v1/supports`
- Da cap nhat `SecurityConfig` de cac alias moi o tren duoc phep truy cap giong route cu.
- Da loai bo flow tra `null` nguy hiem trong `MotelService.findById(...)`, `update(...)`, `delete(...)`; hien da dung `AppException(ErrorCode.MOTEL_NOT_FOUND)`.
- Da don mot phan error contract service legacy:
  - `AuthorityService.generateToken(...)` dung `ErrorCode.TOKEN_GENERATION_FAILED`
  - `SupportService` khong con lookup account -> `null` -> `save(null)`, ma tra `AppException(ErrorCode.ACCOUNT_NOT_FOUND)`

Tac dong danh gia:

- `Bao mat`: bug auth refresh token duoc xem la **da giai quyet trong Phase 1**.
- `API Design`: route naming legacy chua xoa hẳn, nhung da co alias chuan hon de frontend/backend chuyen dan an toan.
- `Error Handling`: da giam them mot nhom `null`/`RuntimeException` o cac flow hay dung, nhung toan he thong van chua dong nhat het.

---

## Tinh trang cac van de ban dau

| Van de cu | Trang thai hien tai | Nhan dinh |
| --- | --- | --- |
| Log thong tin nhay cam trong auth | **Da cai thien lon** | `AuthenController` hien tai khong con log raw OAuth attributes/JWT token nhu baseline cu. Van de log nhay cam khong con la finding HIGH chinh nua. |
| Test suite chua dat CI gate | **Chua giai quyet** | Full `./mvnw.cmd test` van fail. Ngoai ra van con rat nhieu test bi comment hoac legacy. |
| Invoice N+1 | **Da giai quyet tai diem nong chinh** | `InvoiceService#getInvoicesByMotelId` da doi sang `findInvoiceIdsByMotelId(...)` + `findDetailedByInvoiceIdIn(...)`. |
| Public endpoint surface rong | **Chua giai quyet** | `SecurityConfig` van whitelist rong (`/authen/**`, `/searchs/**`, `/support/**`, callback payment...). |
| Migration rong va naming legacy | **Chua giai quyet** | `V2`, `V3` van rong; `TemporaryR_contract`, `SupportControlller`, `/searchs` van ton tai. |

---

## TONG QUAN DANH GIA

| Tieu chi | Diem (1-10) | Ghi chu |
| --- | --- | --- |
| Kien truc tong the | **6.7/10** | Layered architecture ro (`Controller -> Service -> Repository`) va da co config/aspect tach lop. Nhung van con controller/service qua day (`AuthenController`, `PaymentController`, mot so service report), va naming legacy chua duoc don dep het. |
| Bao mat | **7.1/10** | Secret/env, JWT, Redis OTP, rate limit, verify callback thanh toan da co. Diem tru lon hien tai la `PUBLIC_ENDPOINTS` van qua rong, CSRF dung `withHttpOnlyFalse()`, va auth flow con bug refresh token do nham `phone`/`username`. |
| Code Quality | **6.4/10** | DI field injection bang `@Autowired` gan nhu da duoc loai bo; Spotless giu style sach; mot so module da duoc refactor theo huong ro hon. Nhung van con nhieu dead/commented test code, naming typo, va kha nhieu null/legacy flow tra ve `null` hoac string error. |
| Error Handling | **7.0/10** | `AppException`, `ErrorCode`, `GlobalExceptionHandler` da tot hon va mot so module trong diem da theo contract moi. Tuy vay, toan codebase van con khoang **60** diem nem `RuntimeException` / `IllegalArgumentException` trong service/controller. |
| Testing | **4.8/10** | Co test breadth kha rong, da bo sung `test.properties`, va mot so test moi cho invoice/transaction pass. Nhung full suite van fail; co it nhat **8** test suite hong va **26** failure/error markers trong surefire reports, chua tinh nhieu file test bi comment. |
| Performance | **6.8/10** | Invoice hotspot da duoc xu ly, bat dau co pagination cho mot so endpoint lon. Nhung cac flow dashboard/report khac van co pattern loop-query, vi du `MotelService#getRoomCountsByContractStatus`. |
| Scalability | **5.8/10** | Co Redis cho OTP/rate-limit, co nen search/log stack, va da bat dau tach query batch o mot so diem. Nhung van chua co strategy caching, async job, outbox, readiness/operability ro rang. |
| Documentation | **5.8/10** | Da co review/backend docs tot hon va OpenAPI van hoat dong. Nhung van thieu runbook van hanh, convention API/error contract cho toan team, va testing strategy ro. |
| Database Design | **7.0/10** | Data model, auditing, index va Flyway da la diem manh tuong doi. Diem tru van la migration rong `V2`, `V3`, business-key PK o `Account.username`, va naming entity/table legacy. |
| API Design | **6.3/10** | Da co `ApiResponse<T>` + `PageResponse<T>` o nhom module moi refactor, va co alias `/api/v1/...`. Nhung van tron nhieu kieu response tren toan he thong; route naming legacy van con (`/searchs`, `/get-motel-id`, `/createAccount`, ...). |

**Diem trung binh xap xi: 6.4/10** — Backend da tien bo ro so voi baseline 5.9/10, nhung chua dat production-grade vi van con khoang cach o 4 tru cot: **do tin cay test**, **surface security/auth correctness**, **dong nhat API/error contract toan he thong**, va **toi uu cac flow report/list ngoai invoice**.

---

## Cac van de nghiem trong dang ton tai hien nay

### 1. Refresh token co bug nghiep vu phone/username

**Muc do: HIGH**

- `AuthorityService.generateToken(...)` ghi `subject(account.getPhone())` tai `AuthorityService.java:168`.
- `AuthorityService.refreshToken(...)` lai lay subject roi goi `accountRepository.findByUsername(username)` tai `AuthorityService.java:198-209`.
- Ket qua la refresh token co nguy co fail hoac lookup sai account neu `subject` dang la phone chứ khong phai username.
- Day la bug auth thuc te, nghiem trong hon ca finding log auth cu.

### 2. Full test suite chua dat muc CI gate

**Muc do: HIGH**

- `./mvnw.cmd test` hien tai fail.
- Surefire report hien co it nhat **8** test suite hong va **26** failure/error markers.
- Failures hien nhin thay ro:
  - `CustomerEnvironmentTest`: test legacy khong khop behavior moi
  - `CaptchaControllerTest`
  - `BulletinBoardControllerTest`
  - `ContractServiceTest`
  - `MotelDeviceServiceTest`
  - `TypeRoomControllerTest`
  - `SearchControllerTest`
  - `MotelDeviceControllerTest`
- Ngoai ra van con nhieu file test bi comment phan lon hoac toan bo, nen test breadth "co mat" nhung chua tuong duong test protection.

### 3. Security surface van rong va kho harden

**Muc do: HIGH**

- `SecurityConfig.PUBLIC_ENDPOINTS` van permit ca cum rong nhung:
  - `/authen/**`
  - `/searchs/**`
  - `/support/**`
- CSRF dang dung `CookieCsrfTokenRepository.withHttpOnlyFalse()` tai `SecurityConfig.java:84-85`.
- Cung luc do `PUBLIC_ENDPOINTS` duoc bo qua CSRF, nen muc hardening hien tai van phu thuoc rat nhieu vao frontend hygiene/XSS discipline.

### 4. API contract va error contract moi chi dong nhat cuc bo

**Muc do: MEDIUM-HIGH**

- Cac module vua refactor da theo `ApiResponse<T>` tot hon.
- Nhung tren toan backend van con rat nhieu controller tra:
  - `ResponseEntity<T>`
  - `ResponseEntity<?>`
  - `Map<String, Object>`
  - raw entity / raw string
- Van con khoang **60** vi tri nem `RuntimeException` / `IllegalArgumentException` trong service/controller.
- Nghia la frontend/channels tich hop van chua the dua vao mot contract that su on dinh tren toan he thong.

### 5. Dashboard/report flow van con query theo vong lap

**Muc do: MEDIUM**

- Invoice hotspot da duoc giai quyet, nhung `MotelService#getRoomCountsByContractStatus` van goi lap lai:
  - `findContractsByMotelIdAndStatus(...)`
  - `findByMotelMotelId(...)`
  - `findContractsByRoomId(...)`
  - `findByRoom_RoomId(...)`
- Day la pattern de gay slow query theo quy mo motel/room, dac biet o dashboard.

### 6. Naming va migration hygiene van la no ky thuat ro rang

**Muc do: MEDIUM**

- `V2__sync_restructured_schema.sql` va `V3__link_transactions_to_invoices.sql` van la migration rong.
- Naming typo/legacy van ton tai:
  - `SupportControlller`
  - `TemporaryR_contract`
  - route `/searchs`
- Day khong chi la van de dep code; no lam giam kha nang onboarding, tim kiem va bao tri dai han.

---

## Phat hien moi quan trong trong lan review nay

### Search sorting dang sai logic cho nhanh `DESC`

**Muc do: MEDIUM**

- `SearchController.java:52-55`
- Ca `ASC` va `DESC` deu dang goi `searchService.getRoomsSortedByPriceASC()`.
- Nghia la endpoint co contract nhin nhu ho tro sort hai chieu, nhung hanh vi thuc te khong dung.

### Auth success va mot so endpoint van tra raw style

**Muc do: MEDIUM**

- `AuthenController.loginFailure()` van tra `ResponseEntity<String>`.
- OAuth success flow van viet JSON thu cong vao response thay vi dung response DTO/controller contract thong nhat.
- `PaymentController` van tron `Map`, `ResponseEntity<?>`, raw `PaymentResponse`, raw `String`.

### Mot so service van tra `null` thay vi error ro rang

**Muc do: MEDIUM**

- Vi du `MotelService.update(...)` co the tra `null` neu motel khong ton tai.
- Kieu flow nay de dan den null propagation, controller phai tu doan nghia cua `null`, va kho theo doi contract.

---

## Nhan dinh chi tiet theo tung hang muc

### Kien truc tong the - 6.7/10

Diem tot:

- Cau truc domain package ro va quen thuoc cho team Java Spring.
- Co config/aspect tach ro trach nhiem.
- Mot so refactor moi da dua query/perf va API contract theo huong chuan hon.

Diem tru:

- Nhieu module van day business logic trong controller.
- `PaymentController`, `AuthenController`, mot so service dashboard/report van qua day.
- Naming legacy chua duoc don sach.

### Bao mat - 7.1/10

Diem tot:

- Secret dang di theo env placeholder.
- JWT, OTP Redis, rate limit, OAuth2, verify callback da co.
- Van de log raw token/attributes trong auth khong con ro nhu baseline cu.

Diem tru:

- Bug refresh token phone/username can fix ngay.
- `PUBLIC_ENDPOINTS` van qua rong.
- `withHttpOnlyFalse()` + CSRF bypass cho public endpoints can review lai.

### Code Quality - 6.4/10

Diem tot:

- Khong con dau hieu `@Autowired` field injection pho bien trong `src/main`.
- Spotless giu formatting on.
- Da co mot so utility moi ro rang nhu `PageableUtils`, `PageResponse`.

Diem tru:

- Rat nhieu code test bi comment.
- Van con dead routes, typo, legacy style.
- Encoding/comment tieng Viet bi vo o nhieu file lam giam readability.

### Error Handling - 7.0/10

Diem tot:

- Truc `ErrorCode` + `AppException` + `GlobalExceptionHandler` da tot hon baseline.
- Module refactor moi su dung contract loi de doan hon.

Diem tru:

- Toan he thong van chua dong nhat.
- 60 diem `RuntimeException` / `IllegalArgumentException` la con so qua lon neu muc tieu la production-grade API.

### Testing - 4.8/10

Diem tot:

- Da co `test.properties`, compile test on, va targeted tests moi cho invoice/transaction pass.
- Mot so suite van xanh tot nhu `OpenAPIConfigTest`, `StatisticsServiceTest`, `BrokerServiceTest`, `SearchServiceTest`.

Diem tru:

- Full suite van fail.
- Test legacy khong theo code moi.
- Test bi comment qua nhieu.
- Chua co phan tang ro rang unit vs slice vs integration.

### Performance - 6.8/10

Diem tot:

- Invoice hotspot da duoc cai thien thuc su.
- Da bat dau dua pagination vao account/invoice/transaction.

Diem tru:

- Dashboard/report van loop-query.
- Search/list khac chua co pagination co he thong.
- Chua co read-model/projection strategy dong nhat cho flow tong hop.

### Scalability - 5.8/10

Diem tot:

- Da co Redis/rate-limit.
- Da co mot so dau hieu toi uu query batch.

Diem tru:

- Chua co async job/outbox/cache strategy.
- Chua ro health/readiness/operability khi scale.

### Documentation - 5.8/10

Diem tot:

- Tai lieu review da co va co gia tri theo doi suc khoe du an.
- OpenAPI van co mat.

Diem tru:

- Chua co runbook trien khai/rollback/incident.
- Chua co API convention va error-contract guideline cho toan team.

### Database Design - 7.0/10

Diem tot:

- Auditing + Flyway + UUID + index la nen kha on.
- Schema nhin chung da tot hon ban dau.

Diem tru:

- Migration rong.
- Business-key PK o `Account.username`.
- Naming entity/table legacy chua dong nhat.

### API Design - 6.3/10

Diem tot:

- Da co `ApiResponse<T>` va `PageResponse<T>` o mot nhom endpoint quan trong.
- Da co alias `/api/v1/...` cho mot so module.

Diem tru:

- Toan he thong van tron nhieu style response.
- Route naming legacy van nhieu.
- Pagination/versioning chua phu toan bo.

---

## Ke hoach cai thien de xep tu de den kho

### Phase 1 - De, loi ich cao, rui ro thap

1. Sua bug auth refresh token:
   - thong nhat `subject` la `username` hoac doi `refreshToken` sang lookup theo phone
   - bo sung unit test cho `generateToken` / `refreshToken`
2. Sua logic sai ro rang o controller:
   - `SearchController` sort `DESC`
   - cac flow tra `null` trong service nhu `MotelService.update(...)`
3. Don route/name typo de giam debt:
   - tao alias dung chuan cho `/searchs`
   - doi ten `SupportControlller` theo alias/backward-compatible truoc, rename class sau
4. Chuan hoa them `ErrorCode` cho mot so service legacy de giam `RuntimeException` nhanh nhat o cac module hay dung.

### Phase 2 - Trung binh, tac dong rong

1. Chuan hoa contract API cho nhom controller con lai:
   - `PaymentController`
   - `ContractController`
   - `MotelServiceController`
   - `RoomController`
   - `ReserveAPlaceController`
2. Dat convention chung:
   - `ApiResponse<T>` cho single payload
   - `PageResponse<T>` cho list lon
   - alias `/api/v1/...` + giu backward compatibility tam thoi
3. Giam so diem nem `RuntimeException` / `IllegalArgumentException` xuong muc co kiem soat.

### Phase 3 - Trung binh den kho, can co chien luoc

1. Phuc hoi do tin cay test:
   - sua `CustomerEnvironmentTest`
   - sua cac suite dang fail
   - bo test commented, hoac xoa hẳn nếu khong co gia tri
   - chia ro unit / web slice / integration
2. Chuan hoa test config H2/JPA/schema teardown de test khong vo context ngau nhien.
3. Dua full `./mvnw.cmd test` ve xanh truoc khi mo them refactor lon.

### Phase 4 - Kho, tac dong kien truc

1. Toi uu cac flow dashboard/report:
   - `MotelService#getRoomCountsByContractStatus`
   - report/search list lon
   - uu tien projection/read model thay vi loop-query
2. Thiet ke lai security surface:
   - thu hep `PUBLIC_ENDPOINTS`
   - xem lai CSRF strategy cho web/frontend
   - tach endpoint public that su can thiet
3. Don migration hygiene va naming debt:
   - xu ly `V2`, `V3`
   - ke hoach rename entity/controller/route legacy khong pha compatibility

---

## Ket luan senior-level

Neu cau hoi la: "Nhung van de cu da giai quyet chua?" thi cau tra loi chinh xac la:

- **Da giai quyet ro**: invoice N+1 hotspot, test property file missing, mot phan API contract va error contract o module trong diem, auth sensitive logging issue cu.
- **Moi giai quyet mot phan**: API design toan he thong, error handling toan he thong, pagination cho endpoint lon.
- **Chua giai quyet**: full test suite stability, public endpoint surface, migration/naming debt.
- **Phat sinh finding moi quan trong**: bug refresh token phone/username va bug sort `DESC` cua search.

Danh gia cong bang nhat cho du an hien tai la:

> Backend dang o muc **co tien bo that va dang di dung huong**, nhung **chua nen coi la da harden xong**.  
> Uu tien cao nhat tiep theo khong phai them feature, ma la **auth correctness + test stability + contract cleanup**.
