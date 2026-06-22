# Rà Soát Luồng API RRMS: Backend, Frontend, Database

## 1. Mục tiêu tài liệu

Tài liệu này mô tả chi tiết cách dữ liệu chạy trong dự án RRMS theo 3 phần:

1. Backend Java Spring Boot nhận request, xử lý business, truy cập dữ liệu và trả response như thế nào.
2. Database đang được kết nối và sử dụng ra sao, bảng nào là lõi, JPA mapping thế nào, Redis và Elasticsearch tham gia ở đâu.
3. Frontend React gọi API như thế nào, lấy dữ liệu ở đâu, lưu state ra sao, và render lên website bằng component nào.

Tài liệu bám theo code hiện có trong repo `D:\RRMS`, không mô tả theo giả định.

---

## 2. Cấu trúc tổng thể của repo

- Backend Java: `server/`
- Frontend web React/Vite: `client/`
- Tài liệu dự án: `docs/`
- Mobile app: `mobile/`
- Migration database: `server/src/main/resources/db/migration/`

Luồng tổng quát của web hiện tại:

`Browser -> React Route/Page -> API module (Axios) -> Spring Controller -> Service -> Repository -> MySQL/Redis/Elasticsearch -> Service -> Controller -> JSON -> React state -> Component render`

---

## 3. Công nghệ đang dùng

### 3.1. Backend

Xem tại `server/pom.xml`.

- Java 17: `server/pom.xml:30`
- Spring Boot Web: `server/pom.xml:53`
- Spring Data JPA: `server/pom.xml:59`
- MySQL Connector: `server/pom.xml:71`
- Spring Dotenv để đọc `.env`: `server/pom.xml:78`
- Spring Data Redis: `server/pom.xml:85`
- Spring Data Elasticsearch: `server/pom.xml:91`
- Spring Security: `server/pom.xml:177`, `server/pom.xml:203`, `server/pom.xml:209`
- OpenAPI/Swagger: `server/pom.xml:133`
- MapStruct: `server/pom.xml:139`, `server/pom.xml:147`
- Flyway migration: `server/pom.xml:243`

### 3.2. Frontend

Xem tại `client/package.json`.

- React 18: `client/package.json:46`, `client/package.json:49`
- React Router DOM: `client/package.json:56`
- Axios: `client/package.json:31`
- Vite: `client/package.json:82`
- MUI: `client/package.json:20`
- i18next: `client/package.json:40`, `client/package.json:51`
- Google OAuth: `client/package.json:25`

### 3.3. Database và dịch vụ dữ liệu phụ trợ

- MySQL là database chính: `server/README.md:8`
- Redis dùng cho OTP và rate limiting: `server/README.md:9`
- Elasticsearch có mặt trong backend để tìm kiếm một số luồng bulletin board: `server/pom.xml:91`, `server/src/main/java/com/rrms/rrms/repositories/BulletinBoardElasticsearchRepository.java:12`
- Flyway giữ migration schema: `server/src/main/resources/db/migration/V1__baseline.sql`

---

## 4. Backend chạy theo lớp như thế nào

### 4.1. Mô hình chung

Một API backend trong RRMS thường đi theo chuỗi:

1. `Controller` nhận HTTP request và map URL.
2. `Service` xử lý business logic.
3. `Repository` đọc/ghi dữ liệu bằng JPA query hoặc Spring Data query method.
4. `Entity` map với bảng MySQL.
5. `Mapper` hoặc hàm convert đổi Entity sang DTO response.
6. `ApiResponse<T>` đóng gói kết quả trả về cho frontend.

### 4.2. Ví dụ khung chuẩn

Luồng `GET /api/v1/rooms/motel/{motelId}`:

1. `RoomController.getRoomsByMotelId(...)` nhận request tại `server/src/main/java/com/rrms/rrms/controllers/RoomController.java:92`
2. Controller gọi `roomService.getRoomsByMotelId(motelId)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java:125`
3. Service đọc motel trước, sau đó gọi `roomRepository.findByMotel(motel)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java:128`
4. Repository query dữ liệu từ bảng `rooms` qua entity `Room` tại `server/src/main/java/com/rrms/rrms/repositories/RoomRepository.java:35`
5. Service convert từng `Room` sang `RoomResponse`, đồng thời nạp thêm services và latest contract tại `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java` trong hàm `convertToResponse(...)`
6. Controller bọc vào `ApiResponse<List<RoomResponse>>` và trả JSON về cho frontend

### 4.3. Security và public/private endpoint

Phần security nằm ở:

- `server/src/main/java/com/rrms/rrms/configs/SecurityConfig.java:46` khai báo `PUBLIC_ENDPOINTS`
- `server/src/main/java/com/rrms/rrms/configs/SecurityConfig.java:90` cấu hình `authorizeHttpRequests(...)`
- `server/src/main/java/com/rrms/rrms/configs/SecurityConfig.java:82` đọc key JWT
- `server/src/main/java/com/rrms/rrms/configs/WebConfig.java:22` cấu hình CORS

Ý nghĩa:

- Các endpoint public như search, detail bulletin board, auth, captcha, support được cho đi qua không cần JWT.
- Các endpoint quản trị như `rooms`, `motels`, `accounts`, `contracts` thường yêu cầu token Bearer.
- JWT được dùng ở lớp resource server của Spring Security.

---

## 5. Database đang được nối vào backend như thế nào

### 5.1. Nguồn cấu hình

Các biến môi trường backend:

- `server/.env.example:2` `DB_PASSWORD`
- `server/.env.example:3` `DB_USERNAME`
- `server/.env.example:4` `DB_NAME`
- `server/.env.example:7` `PORT=7000`
- `server/.env.example:8` `SPRING_PROFILES_ACTIVE=dev`
- `server/.env.example:11` `JWT_SIGNER`
- `server/.env.example:15` `REDIS_HOST`
- `server/.env.example:16` `REDIS_PORT`

Triển khai cloud cũng map lại các biến này:

- `server/render.yaml:54` `PORT`
- `server/render.yaml:55` `DB_URL`
- `server/render.yaml:56` `DB_USERNAME`
- `server/render.yaml:57` `DB_PASSWORD`
- `server/render.yaml:58` `REDIS_HOST`
- `server/render.yaml:59` `REDIS_PORT`
- `server/render.yaml:62` `CORS_ALLOWED_ORIGINS`
- `server/render.yaml:64` `JWT_SIGNER`

Ghi chú quan trọng:

- File `server/src/main/resources/application-dev.properties:3` chỉ override `spring.jpa.hibernate.ddl-auto=update`.
- Nghĩa là datasource thật đang được cung cấp chủ yếu từ `.env` hoặc biến môi trường lúc chạy.

### 5.2. JPA mapping

Base entity audit:

- `server/src/main/java/com/rrms/rrms/configs/JpaAuditingConfig.java:7` bật `@EnableJpaAuditing`
- `server/src/main/java/com/rrms/rrms/models/BaseEntity.java:27` map `created_at`
- `server/src/main/java/com/rrms/rrms/models/BaseEntity.java:31` map `updated_at`
- `server/src/main/java/com/rrms/rrms/models/BaseEntity.java:34` map `is_deleted`

Entity lõi:

- `Account`: `server/src/main/java/com/rrms/rrms/models/Account.java:24`, khóa chính `username` ở dòng `43`
- `BulletinBoard`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:24`, khóa chính `bulletinBoardId` ở dòng `35`
- `Room`: `server/src/main/java/com/rrms/rrms/models/Room.java:23`, khóa chính `roomId` ở dòng `34`

Quan hệ quan trọng:

- `Account -> Auth/Role` để sinh quyền JWT: `server/src/main/java/com/rrms/rrms/models/Account.java:89`
- `BulletinBoard -> Account`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:39`
- `BulletinBoard -> Motel`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:97`
- `BulletinBoard -> Room`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:101`
- `Room -> Motel`: `server/src/main/java/com/rrms/rrms/models/Room.java:39`
- `Room -> Contracts`: `server/src/main/java/com/rrms/rrms/models/Room.java:71`
- `Room -> Reserve_a_place`: `server/src/main/java/com/rrms/rrms/models/Room.java:75`

### 5.3. Schema thật trong migration

Các bảng chính:

- `accounts`: `server/src/main/resources/db/migration/V1__baseline.sql:3`
- `auths`: `server/src/main/resources/db/migration/V1__baseline.sql:4`
- `bulletin_boards`: `server/src/main/resources/db/migration/V1__baseline.sql:10`
- `motels`: `server/src/main/resources/db/migration/V1__baseline.sql:28`
- `rooms`: `server/src/main/resources/db/migration/V1__baseline.sql:42`
- `invalidated_tokens`: `server/src/main/resources/db/migration/V1__baseline.sql:20`

Ràng buộc và tối ưu:

- Full text cho bulletin board: `server/src/main/resources/db/migration/V1__baseline.sql:157`
- Check giá phòng không âm: `server/src/main/resources/db/migration/V1__baseline.sql:160`

### 5.4. Redis và Elasticsearch đứng ở đâu

Redis:

- Dùng cho OTP quên mật khẩu và OTP đăng ký trong `AuthenController`
- Dùng cho rate limit thông qua annotation `@RateLimited`
- Đây không phải nguồn dữ liệu chính để render danh sách phòng

Elasticsearch:

- Chỉ thấy dùng rõ ở `BulletinBoardElasticsearchRepository`
- Luồng `GET /api/v1/bulletin-boards/search?address=...` dùng Elastic tại `server/src/main/java/com/rrms/rrms/services/servicesImp/BulletinBoardService.java:147`
- Luồng `GET /api/v1/search` hiện tại vẫn dựa vào JPA/MySQL, không phải Elastic

---

## 6. Frontend gọi API và render dữ liệu như thế nào

### 6.1. Axios client

Hai client HTTP chính:

- Authenticated client: `client/src/apis/httpClient.js:4`
- Public client: `client/src/apis/publicHttpClient.js:4`

Base URL:

- `client/src/configs/environment.js:2`
- `client/src/configs/environment.js:5`

Ý nghĩa:

- `publicHttpClient` dùng cho trang public như search và detail.
- `httpClient` dùng cho phần cần token.

### 6.2. Token đi từ đâu vào request

Trong `client/src/apis/httpClient.js`:

- `interceptors.request.use(...)`: `client/src/apis/httpClient.js:12`
- Đọc `sessionStorage.getItem('user')`: `client/src/apis/httpClient.js:14`
- Nếu có token thì gắn `Authorization: Bearer ...`
- `interceptors.response.use(...)`: `client/src/apis/httpClient.js:26`
- Nếu backend trả `401`, frontend xóa session và điều hướng về `/login`

### 6.3. Router và trang

Public route:

- `client/src/routes/PublicRoutes.jsx:35` route `/search`
- `client/src/routes/PublicRoutes.jsx:36` route `/detail/:bulletinBoardId`
- `client/src/routes/PublicRoutes.jsx:43` route `/RRMS`

Admin route:

- `client/src/routes/AdminRoutes.jsx`
- Hầu hết route admin đều bọc `ProtectedRoute`

Kiểm tra quyền frontend:

- `client/src/components/ProtectedRoute.jsx:3`
- Đọc `sessionStorage`: `client/src/components/ProtectedRoute.jsx:5`
- Chỉ cho vào nếu có role phù hợp

### 6.4. Chuẩn một page frontend load data

Một page frontend trong RRMS thường đi theo chuỗi:

1. Route khớp URL
2. React page mount bằng `useEffect`
3. Page gọi API module trong `client/src/apis`
4. API module gọi `axios`
5. Response trả về được `unwrapApiResult(...)` hoặc map tay
6. Dữ liệu đưa vào `useState`
7. Component con render list/card/table

Phần normalize dữ liệu API:

- `unwrapApiResult(...)`: `client/src/utils/apiAdapters.js:8`
- `normalizeRoomResponse(...)`: `client/src/utils/apiAdapters.js:105`
- `normalizeRoomCollection(...)`: `client/src/utils/apiAdapters.js:118`
- `normalizeRoomPayload(...)`: `client/src/utils/apiAdapters.js:155`

---

## 7. Luồng minh họa số 1: Public search và trang `/RRMS`

Đây là luồng chuẩn để load dữ liệu danh sách phòng public lên website.

### 7.1. File frontend tham gia

- Trang tổng hợp: `client/src/pages/RRMS/RRMS.jsx`
- API search: `client/src/apis/searchAPI.js`
- Hàm dựng dashboard từ dữ liệu API: `client/src/pages/RRMS/sections/rrmsData.js`
- Component hiển thị card: `client/src/pages/RRMS/sections/RoomCard.jsx`
- Trang search riêng: `client/src/pages/search/Search.jsx`

### 7.2. Luồng `/RRMS`

1. User vào route `/RRMS`
2. Route được map tại `client/src/routes/PublicRoutes.jsx:43`
3. `RRMS.jsx` mount và chạy `useEffect`
4. Ở `client/src/pages/RRMS/RRMS.jsx:57`, frontend gọi song song:
   - `getSearchRooms()`
   - `getLatestSearchRooms()`
5. Hai hàm này nằm ở:
   - `client/src/apis/searchAPI.js:21`
   - `client/src/apis/searchAPI.js:26`
6. Hai hàm dùng `publicHttpClient`, nghĩa là không cần token
7. Backend nhận:
   - `GET /api/v1/search`
   - `GET /api/v1/search/latest`
8. Controller map ở `server/src/main/java/com/rrms/rrms/controllers/SearchController.java:26`
9. Hàm xử lý:
   - `getRooms(...)`: `server/src/main/java/com/rrms/rrms/controllers/SearchController.java:71`
   - `getLatestRooms()`: `server/src/main/java/com/rrms/rrms/controllers/SearchController.java:110`
10. `SearchController` gọi `SearchService`
11. `SearchService.getRooms()` ở `server/src/main/java/com/rrms/rrms/services/servicesImp/SearchService.java:44`
12. `SearchService.findAllByDatenew()` ở `server/src/main/java/com/rrms/rrms/services/servicesImp/SearchService.java:138`
13. Service truy vấn MySQL qua repository:
   - `BulletinBoardRepository.findAllByIsActive(true)`: `server/src/main/java/com/rrms/rrms/repositories/BulletinBoardRepository.java:33`
   - `SearchRepository.findAllByDatenew(true)`: `server/src/main/java/com/rrms/rrms/repositories/SearchRepository.java:20`
14. Dữ liệu gốc lấy từ bảng `bulletin_boards` trong MySQL: `server/src/main/resources/db/migration/V1__baseline.sql:10`
15. Service map `BulletinBoard -> BulletinBoardSearchResponse`
16. JSON trả về theo form `ApiResponse.result`
17. Frontend nhận response, tách `payload.result`
18. `RRMS.jsx` đưa dữ liệu vào:
   - `setAllRooms(...)`
   - `setLatestRooms(...)`
19. Sau đó `buildRrmsDashboard(...)` xử lý dữ liệu hiển thị tại `client/src/pages/RRMS/sections/rrmsData.js:260`
20. Các hàm phụ tạo dữ liệu UI:
   - `buildLocationGroups(...)`: `client/src/pages/RRMS/sections/rrmsData.js:128`
   - `buildPopularRooms(...)`: `client/src/pages/RRMS/sections/rrmsData.js:176`
   - `buildReadyRooms(...)`: `client/src/pages/RRMS/sections/rrmsData.js:189`
   - `getEffectivePrice(...)`: `client/src/pages/RRMS/sections/rrmsData.js:74`
   - `getMoveInLabel(...)`: `client/src/pages/RRMS/sections/rrmsData.js:102`
21. Component card dùng dữ liệu đó để render:
   - `LatestRoomCard` trong `client/src/pages/RRMS/sections/RoomCard.jsx`
   - link chi tiết đi tới `/detail/:bulletinBoardId`

### 7.3. Luồng `/search`

1. User vào `/search?query=...`
2. Route ở `client/src/routes/PublicRoutes.jsx:35`
3. `Search.jsx` mount
4. Page lấy query từ URL, build `requestParams`
5. `Search.jsx` gọi `getSearchRooms(requestParams)` tại `client/src/pages/search/Search.jsx:69`
6. Kết quả lưu vào `setSearchData(result)` tại `client/src/pages/search/Search.jsx:71`
7. Backend vẫn đi vào `SearchController.getRooms(...)`
8. Nếu có filter, controller gọi `SearchService.searchRooms(...)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/SearchService.java:52`
9. Service gọi query JPA động `searchActiveBulletinBoards(...)` tại `server/src/main/java/com/rrms/rrms/repositories/BulletinBoardRepository.java:62`
10. Query lọc theo:
   - `query`
   - `district`
   - `minPrice`
   - `maxPrice`
   - `minArea`
   - `maxArea`
11. Sau khi frontend có `searchData`, component `RoomList` và các section con render danh sách

### 7.4. Kết luận luồng số 1

Luồng public search đang chủ yếu là:

`RRMS/Search page -> searchAPI.js -> publicHttpClient -> SearchController -> SearchService -> BulletinBoardRepository/SearchRepository -> bảng bulletin_boards -> DTO -> React state -> rrmsData -> RoomCard/RoomList`

---

## 8. Luồng minh họa số 2: Trang chi tiết `/detail/:bulletinBoardId`

Đây là luồng public nhưng có pha trộn thêm introspect để biết user đang login hay chưa.

### 8.1. File chính

- Route: `client/src/routes/PublicRoutes.jsx:36`
- Page: `client/src/pages/roomDetail/Detail.jsx`
- API bulletin board: `client/src/apis/bulletinBoardAPI.js:5`
- API introspect/account: `client/src/apis/accountAPI.js:9`, `client/src/apis/accountAPI.js:14`
- Backend controller bulletin board: `server/src/main/java/com/rrms/rrms/controllers/BulletinBoardController.java:27`
- Backend service bulletin board: `server/src/main/java/com/rrms/rrms/services/servicesImp/BulletinBoardService.java:75`

### 8.2. Luồng chi tiết

1. User bấm card phòng ở `/RRMS` hoặc `/search`
2. Frontend điều hướng đến `/detail/{bulletinBoardId}`
3. `Detail.jsx` lấy `bulletinBoardId` từ `useParams()`
4. Hàm `loadDetailPage()` gọi `getBulletinBoard(bulletinBoardId)` tại `client/src/pages/roomDetail/Detail.jsx:38`
5. `getBulletinBoard(...)` gọi public endpoint `/api/v1/bulletin-boards/{id}` tại `client/src/apis/bulletinBoardAPI.js:5`
6. Backend map endpoint này ở `server/src/main/java/com/rrms/rrms/controllers/BulletinBoardController.java:44`
7. Controller gọi `bulletinBoardService.getBulletinBoardById(id)`
8. Service xử lý ở `server/src/main/java/com/rrms/rrms/services/servicesImp/BulletinBoardService.java:75`
9. Service gọi `reloadBulletinBoard(...)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/BulletinBoardService.java:231`
10. `reloadBulletinBoard(...)` đọc dữ liệu bằng `bulletinBoardRepository.findById(...)`
11. Entity `BulletinBoard` có quan hệ với:
   - `Account`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:39`
   - `Motel`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:97`
   - `Room`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:101`
   - `BulletinBoardImage`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:106`
   - `BulletinBoardReviews`: `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java:111`
12. Service map entity sang `BulletinBoardResponse`
13. Frontend lấy `response.data.result` và `setDetail(nextDetail)` tại `client/src/pages/roomDetail/Detail.jsx:41`
14. Nếu bài đăng có địa chỉ, `Detail.jsx` gọi thêm `searchByName(...)` để lấy danh sách tương tự theo tỉnh/thành
15. Lời gọi này quay về lại `GET /api/v1/search`
16. Sau đó page render các section:
   - `DetailGallerySection`
   - `DetailSummarySection`
   - `DetailDescriptionSection`
   - `DetailReviewSection`
   - `DetailRelatedSection`

### 8.3. Nhánh introspect để biết user hiện tại

1. Cùng trong `loadDetailPage()`, page gọi `introspect()` tại `client/src/pages/roomDetail/Detail.jsx:59`
2. `introspect()` đọc token từ `sessionStorage` trong `client/src/apis/accountAPI.js:5`
3. Sau đó POST `/authen/introspect`
4. Endpoint map ở `server/src/main/java/com/rrms/rrms/controllers/AuthenController.java:105`
5. Controller gọi `AuthorityService.introspect(...)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java:71`
6. `AuthorityService` parse JWT bằng `verifyToken(...)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java:217`
7. Nếu token hợp lệ, service trả về `subject`, `issuer`, `roles`, `permissions`
8. Frontend lấy `issuer` rồi gọi tiếp `getAccountByUsername(...)`
9. Endpoint account là `/api-accounts/{username}`
10. Controller nằm ở `server/src/main/java/com/rrms/rrms/controllers/AccountController.java`

### 8.4. Điểm cần lưu ý trong luồng này

Theo code hiện tại có một điểm cần để ý:

- Frontend detail page gọi `getAccountByUsername(...)` cho người dùng thường.
- Nhưng backend `AccountController.getAccountByUsername(...)` đang gắn `@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")`.
- Nghĩa là về mặt annotation, endpoint này là API admin.

Nếu hệ thống vẫn chạy được ở runtime thì cần kiểm tra lại một trong các khả năng:

1. Frontend thực tế chỉ dùng được khi user có role phù hợp.
2. Quyền đang được nới ở nơi khác.
3. Đây là một mismatch giữa frontend và backend cần sửa.

---

## 9. Luồng minh họa số 3: Login + JWT + Admin dashboard + load room

Đây là luồng đầy đủ nhất vì có cả xác thực, phân quyền, lấy dữ liệu quản trị và hiển thị bảng phòng.

### 9.1. File frontend chính

- Hook login: `client/src/pages/auth/Login/hooks/useLogin.js`
- Context auth: `client/src/contexts/AuthContext.jsx`
- App shell: `client/src/App.jsx`
- Protected route: `client/src/components/ProtectedRoute.jsx`
- Admin route: `client/src/routes/AdminRoutes.jsx`
- Dashboard page: `client/src/pages/admin/ManagerHome/DashboardIndex.jsx`
- Bảng phòng: `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx`
- Room API: `client/src/apis/roomAPI.js`

### 9.2. Bước login

1. User nhập `phone` và `password` ở trang login
2. Hook `useLogin` cấu hình endpoint:
   - `LOGIN_ENDPOINT`: `client/src/pages/auth/Login/hooks/useLogin.js:11`
   - `SOCIAL_LOGIN_ENDPOINT`: `client/src/pages/auth/Login/hooks/useLogin.js:12`
3. Khi submit form, `handleSubmit(...)` chạy ở `client/src/pages/auth/Login/hooks/useLogin.js:130`
4. Frontend POST tới `${env.API_URL}/authen/login` tại `client/src/pages/auth/Login/hooks/useLogin.js:148`
5. Backend nhận request ở `server/src/main/java/com/rrms/rrms/controllers/AuthenController.java:91`
6. `AuthenController.login(...)` gọi:
   - `accountService.findByPhone(...)`
   - `authorityService.loginResponse(...)`
7. `AuthorityService.loginResponse(...)`: `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java:115`
8. Hàm này gọi `accountService.login(phone, password)`
9. `AccountService.login(...)` dùng `accountRepository.findByPhone(phone)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/AccountService.java:199`
10. `AccountRepository.findByPhone(...)` nằm ở `server/src/main/java/com/rrms/rrms/repositories/AccountRepository.java:30`
11. Nếu password đúng, `AuthorityService.buildLoginResponse(...)` chạy tại `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java:123`
12. `buildLoginResponse(...)` gọi `generateToken(...)` tại `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java:143`
13. JWT được ký bằng `jwt.signer-key` trong `SecurityConfig` và `AuthorityService`
14. Response trả về chứa:
   - `token`
   - `username`
   - `fullName`
   - `phone`
   - `email`
   - `avatar`
   - `roles`

### 9.3. Frontend lưu session và bật luồng admin

1. `handleLoginSuccess(...)` ở `client/src/pages/auth/Login/hooks/useLogin.js:49`
2. `saveSessionAndNavigate(...)` ở `client/src/pages/auth/Login/hooks/useLogin.js:28`
3. Frontend lưu `sessionStorage.setItem('user', ...)` ở `client/src/pages/auth/Login/hooks/useLogin.js:31`
4. Sau đó điều hướng tới `/RRMS` ở dòng `46`
5. Từ lúc này, `httpClient` có thể tự gắn `Authorization` ở mỗi request nhờ interceptor:
   - `client/src/apis/httpClient.js:12`
   - `client/src/apis/httpClient.js:14`

### 9.4. App shell đọc lại user sau khi login

1. `App.jsx` đọc `sessionStorage` tại `client/src/App.jsx:69`
2. `App.jsx` nạp lại:
   - `setUsername(...)`: `client/src/App.jsx:83`
   - `setAvatar(...)`: `client/src/App.jsx:84`
   - `setToken(...)`: `client/src/App.jsx:85`
3. Đồng thời gọi thêm:
   - `getAccountByUsername(user.username)`: `client/src/App.jsx:90`
   - `getMotelByUsername(user.username)`: `client/src/App.jsx:35`, `client/src/App.jsx:36`
4. Mục đích là bootstrap context chung cho phần header và khu quản trị

### 9.5. Route admin được bảo vệ thế nào

1. User vào `/quanlytro/:motelId`
2. Route được định nghĩa trong `client/src/routes/AdminRoutes.jsx`
3. Route này bọc bằng `ProtectedRoute`
4. `ProtectedRoute` đọc `sessionStorage` ở `client/src/components/ProtectedRoute.jsx:5`
5. Nếu không có `roles` hoặc role không khớp, frontend redirect về `/login`

### 9.6. Luồng load dữ liệu phòng trong dashboard

1. Sau khi qua `ProtectedRoute`, `DashboardIndex.jsx` render `MotelDashboard`
2. `MotelDashboard.jsx` dùng `useParams()` để lấy `motelId`
3. Trong `useEffect`, page gọi `fetchData()`
4. `fetchData()` gọi `getRoomByMotelId(activeMotelId)` tại `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx:118`
5. Hàm API nằm ở `client/src/apis/roomAPI.js:12`
6. `roomAPI.getRoomByMotelId(...)` dùng `httpClient.get('/api/v1/rooms/motel/{motelId}')`
7. Vì dùng `httpClient`, request sẽ mang JWT Bearer token
8. Backend nhận ở `server/src/main/java/com/rrms/rrms/controllers/RoomController.java:92`
9. `RoomController` gọi `roomService.getRoomsByMotelId(motelId)`
10. `RoomService.getRoomsByMotelId(...)` ở `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java:125`
11. Service đọc motel, sau đó query `roomRepository.findByMotel(motel)` tại dòng `128`
12. Repository nằm ở `server/src/main/java/com/rrms/rrms/repositories/RoomRepository.java:35`
13. Entity `Room` map tới bảng `rooms` tại:
   - `server/src/main/java/com/rrms/rrms/models/Room.java:23`
   - bảng thật `server/src/main/resources/db/migration/V1__baseline.sql:42`
14. `RoomService.convertToResponse(...)` còn nạp thêm:
   - room services
   - latest contract
   - room reservation
15. JSON trả về cho frontend theo `ApiResponse.result`
16. Frontend gọi `normalizeRoomCollection(...)` trong `roomAPI.js`
17. `normalizeRoomCollection(...)` ở `client/src/utils/apiAdapters.js:118`
18. `normalizeRoomResponse(...)` ở `client/src/utils/apiAdapters.js:105` chuẩn hóa:
   - `latestContract`
   - `roomReservation`
   - `reserveAPlace`
19. Cuối cùng page lưu vào `setRooms(dataRoom)` tại `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx:119`
20. `RoomListTable` dùng state này để vẽ bảng phòng

### 9.7. Đây là ví dụ hoàn chỉnh nhất của một API

API hoàn chỉnh có thể xem theo thứ tự này:

1. Frontend gọi: `client/src/apis/roomAPI.js:12`
2. Page sử dụng: `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx:118`
3. Backend endpoint: `server/src/main/java/com/rrms/rrms/controllers/RoomController.java:92`
4. Business logic: `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java:125`
5. Truy vấn DB: `server/src/main/java/com/rrms/rrms/repositories/RoomRepository.java:35`
6. Entity map bảng: `server/src/main/java/com/rrms/rrms/models/Room.java:23`
7. Bảng DB thật: `server/src/main/resources/db/migration/V1__baseline.sql:42`
8. Frontend normalize data: `client/src/utils/apiAdapters.js:105`, `client/src/utils/apiAdapters.js:118`
9. Frontend render: `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx`

Chuỗi này đúng với yêu cầu "từ cái nào gọi qua cái nào cho đến khi hoàn thành được 1 API".

---

## 10. Tóm tắt 3 luồng hoạt động của 3 phần Backend, Frontend, Database

### 10.1. Backend

Backend đang dùng:

- Spring Boot Web để expose REST API
- Spring Security + JWT để xác thực và phân quyền
- Spring Data JPA để thao tác MySQL qua Entity/Repository
- MapStruct hoặc convert tay để đổi Entity sang DTO
- Redis cho OTP/rate limit
- Elasticsearch cho một phần search bulletin board

Luồng hoạt động backend:

`Controller -> Service -> Repository -> Entity/MySQL -> Service map DTO -> ApiResponse`

### 10.2. Database

Database đang dùng:

- MySQL cho dữ liệu nghiệp vụ chính
- Flyway để quản lý schema
- JPA Auditing cho `created_at`, `updated_at`
- Redis cho token tạm/OTP/rate limit
- Elasticsearch cho fuzzy search theo address ở một số endpoint

Luồng hoạt động database:

`Environment/.env -> Spring Boot datasource -> Entity mapping -> Repository query -> MySQL tables`

### 10.3. Frontend

Frontend đang dùng:

- React + Vite + React Router
- Axios với hai client: public và auth
- sessionStorage để giữ user/token
- useEffect/useState để load và render dữ liệu
- MUI component để hiển thị card, table, form

Luồng hoạt động frontend:

`Route -> Page -> API module -> Axios -> Backend -> Response -> State -> Render component`

---

## 11. Danh sách file nên mở theo thứ tự để tự lần code

### 11.1. Muốn hiểu luồng public search

1. `client/src/routes/PublicRoutes.jsx`
2. `client/src/pages/RRMS/RRMS.jsx`
3. `client/src/apis/searchAPI.js`
4. `server/src/main/java/com/rrms/rrms/controllers/SearchController.java`
5. `server/src/main/java/com/rrms/rrms/services/servicesImp/SearchService.java`
6. `server/src/main/java/com/rrms/rrms/repositories/BulletinBoardRepository.java`
7. `server/src/main/java/com/rrms/rrms/repositories/SearchRepository.java`
8. `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java`
9. `server/src/main/resources/db/migration/V1__baseline.sql`
10. `client/src/pages/RRMS/sections/rrmsData.js`
11. `client/src/pages/RRMS/sections/RoomCard.jsx`

### 11.2. Muốn hiểu luồng chi tiết tin đăng

1. `client/src/pages/roomDetail/Detail.jsx`
2. `client/src/apis/bulletinBoardAPI.js`
3. `client/src/apis/accountAPI.js`
4. `server/src/main/java/com/rrms/rrms/controllers/BulletinBoardController.java`
5. `server/src/main/java/com/rrms/rrms/services/servicesImp/BulletinBoardService.java`
6. `server/src/main/java/com/rrms/rrms/controllers/AuthenController.java`
7. `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java`
8. `server/src/main/java/com/rrms/rrms/models/BulletinBoard.java`

### 11.3. Muốn hiểu luồng login và admin dashboard

1. `client/src/pages/auth/Login/hooks/useLogin.js`
2. `client/src/apis/httpClient.js`
3. `client/src/components/ProtectedRoute.jsx`
4. `client/src/routes/AdminRoutes.jsx`
5. `client/src/App.jsx`
6. `server/src/main/java/com/rrms/rrms/controllers/AuthenController.java`
7. `server/src/main/java/com/rrms/rrms/services/servicesImp/AuthorityService.java`
8. `server/src/main/java/com/rrms/rrms/services/servicesImp/AccountService.java`
9. `server/src/main/java/com/rrms/rrms/repositories/AccountRepository.java`
10. `client/src/pages/admin/ManagerHome/MotelDashboard/MotelDashboard.jsx`
11. `client/src/apis/roomAPI.js`
12. `server/src/main/java/com/rrms/rrms/controllers/RoomController.java`
13. `server/src/main/java/com/rrms/rrms/services/servicesImp/RoomService.java`
14. `server/src/main/java/com/rrms/rrms/repositories/RoomRepository.java`
15. `server/src/main/java/com/rrms/rrms/models/Room.java`

---

## 12. Kết luận ngắn

Theo code hiện tại, dữ liệu hiển thị lên website RRMS đi theo hai kiểu chính:

1. Public data như search, latest rooms, detail bulletin board đi bằng `publicHttpClient` và chủ yếu đọc từ bảng `bulletin_boards`.
2. Data quản trị như motel, room, contract, invoice đi bằng `httpClient`, kèm JWT Bearer token, rồi backend kiểm tra quyền trước khi cho truy cập.

Nếu cần đào sâu hơn, nên tiếp tục tài liệu hóa riêng từng module lớn như:

- Contract
- Invoice
- Tenant
- Payment
- Bulletin board posting flow

Nhưng với ba luồng trong tài liệu này, bạn đã có đủ trục chính để lần từ frontend xuống database và ngược lại.
