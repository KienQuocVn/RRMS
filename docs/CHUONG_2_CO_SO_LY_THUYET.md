# CHƯƠNG II: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG (THEORETICAL BACKGROUND)

---

## 2.1. NỀN TẢNG PHÁT TRIỂN ỨNG DỤNG PHÍA CLIENT (FRONTEND & MOBILE)

Hệ thống RRMS hướng tới việc phục vụ hai đối tượng người dùng chính với hành vi và môi trường thao tác hoàn toàn khác biệt: Chủ nhà trọ (Host) cần một giao diện quản trị màn hình rộng, đa tác vụ và trực quan trên trình duyệt Web; Khách thuê trọ (Tenant) cần một ứng dụng di động gọn nhẹ, mượt mà, hỗ trợ định vị và thanh toán tức thời. Do đó, hai công nghệ hàng đầu được lựa chọn cho phía Client là **React JS (Web)** và **React Native (Mobile)**.

### 2.1.1. Kiến trúc Web Single Page Application (SPA) và Thư viện React JS

Mô hình Web truyền thống (Multi-page Application - MPA) yêu cầu trình duyệt tải lại toàn bộ trang từ máy chủ mỗi khi người dùng chuyển hướng hoặc gửi biểu mẫu. Điều này làm tăng độ trễ và tiêu tốn băng thông không cần thiết. Để giải quyết vấn đề này, RRMS sử dụng kiến trúc **Single Page Application (SPA)** kết hợp với thư viện **React JS (phiên bản 18.3.1)**.

```
+-------------------------------------------------------------------+
|                  KIẾN TRÚC TRUYỀN THUYẾT (MPA)                    |
|  Browser  --(Request page URL)------------------->  Web Server    |
|  Browser  <--(Return full HTML/CSS/JS files)-------  Web Server    |
+-------------------------------------------------------------------+
|                KIẾN TRÚC SINGLE PAGE APP (SPA)                    |
|  Browser  --(Initial request)-------------------->  Web Server    |
|  Browser  <--(Return shell HTML & JS bundle)-------  Web Server    |
|  Browser  --(API Request / JSON data)------------>  API Gateway   |
|  Browser  <--(JSON data response)------------------  API Gateway   |
+-------------------------------------------------------------------+
```

#### 1. Cơ chế hoạt động của Single Page Application (SPA)
Trong mô hình SPA, toàn bộ tài nguyên tĩnh (HTML shell, CSS, JavaScript bundle) chỉ được tải về một lần duy nhất ở phiên làm việc đầu tiên. Khi người dùng tương tác (chuyển trang, lọc dữ liệu), client-side router (trong dự án là `react-router-dom v6`) sẽ chặn hành vi tải lại trang mặc định của trình duyệt và tự động cập nhật URL trên thanh địa chỉ, đồng thời render lại các component tương ứng mà không cần tải lại trang. Các truy vấn dữ liệu được thực hiện bất đồng bộ thông qua giao thức HTTP (sử dụng thư viện `axios`) để lấy dữ liệu dạng JSON từ RESTful API của backend Spring Boot.

#### 2. Virtual DOM và Cơ chế Reconciliation của React 18
* **Virtual DOM:** Là một bản đại diện dạng cây gọn nhẹ bằng JavaScript của DOM thật (Real DOM). Thay vì thao tác trực tiếp trên Real DOM (một tác vụ vô cùng đắt đỏ về mặt hiệu năng), React thực hiện mọi thay đổi trạng thái (state changes) trên Virtual DOM.
* **Thuật toán so khớp (Reconciliation/Diffing Algorithm):** Khi state của một component thay đổi, React sẽ tạo ra một cây Virtual DOM mới. Thuật toán Diffing của React sẽ so sánh cây Virtual DOM mới với cây Virtual DOM cũ với độ phức tạp thuật toán là $O(n)$ (thay vì $O(n^3)$ của các thuật toán so sánh cây thông thường) dựa trên hai giả định:
  1. Hai phần tử có kiểu khác nhau sẽ tạo ra hai cây khác nhau.
  2. Lập trình viên có thể cung cấp thuộc tính `key` để định danh các phần tử con qua các lần render khác nhau.
* **Concurrent Rendering (React 18):** React 18 giới thiệu cơ chế render đồng thời (Concurrent Features) thông qua cơ chế ngắt quãng (interruptible rendering). Bằng cách sử dụng các API mới như `useTransition` hay `useDeferredValue`, React có thể tạm dừng một tác vụ render có độ ưu tiên thấp (như lọc danh sách phòng trọ lớn) để ưu tiên xử lý các tương tác khẩn cấp của người dùng (như gõ ký tự vào ô tìm kiếm), giúp giao diện không bị đóng băng (lag/freeze).

#### 3. State Management và Lifecycle với React Hooks
Dự án sử dụng cơ chế Hook để quản lý trạng thái và vòng đời component:
* `useState`: Quản lý các trạng thái cục bộ của component (như trạng thái đóng/mở của modal thêm mới phòng).
* `useEffect`: Xử lý các tác vụ ngoại vi (side-effects) như gọi API lấy danh sách phòng trọ khi component mount, cập nhật tiêu đề trang, hoặc thiết lập timer.
* `useContext`: Cung cấp giải pháp truyền dữ liệu toàn cục (như thông tin người dùng đăng nhập, cấu hình ngôn ngữ của `react-i18next`) từ component cha xuống mọi component con mà không cần qua cơ chế prop-drilling.

---

### 2.1.2. Nền tảng di động đa nền tảng React Native và Expo SDK

Để tối ưu hóa chi phí phát triển và thời gian đưa sản phẩm ra thị trường (Time-to-market), ứng dụng di động dành cho Khách thuê trọ được xây dựng trên nền tảng **React Native (v0.81.5)** tích hợp **Expo SDK (v54.0.33)**.

#### 1. Nguyên lý hoạt động của React Native: Bridging vs New Architecture (JSI)
React Native cho phép biên dịch mã nguồn viết bằng JavaScript/TypeScript thành các thành phần giao diện gốc (Native UI Components) trên cả iOS và Android.

```
+---------------------------------------------------------------------------------+
| ARCHITECTURE COMPARISON IN REACT NATIVE                                         |
|                                                                                 |
| 1. OLD ARCHITECTURE (Bridge-based):                                             |
| [JS Thread] <---(JSON Serialization/Deserialization)---> [Bridge] <---> [Native] |
| (Không đồng bộ, nghẽn cổ chai khi truyền dữ liệu lớn hoặc hoạt họa phức tạp)      |
|                                                                                 |
| 2. NEW ARCHITECTURE (JSI - JavaScript Interface):                               |
| [JS Thread] <===============(Direct C++ Method Calls)===============> [Native]    |
| (Đồng bộ, truy cập trực tiếp đối tượng bộ nhớ Native, tối ưu hóa hiệu năng)    |
+---------------------------------------------------------------------------------+
```

* **Kiến trúc Bridge truyền thống:** JavaScript Thread và Native Thread giao tiếp bất đồng bộ qua một cầu nối (Bridge) bằng cách tuần tự hóa (serialize) dữ liệu thành chuỗi JSON và giải tuần tự hóa (deserialize) ở đầu nhận. Cơ chế này tạo ra hiện tượng nghẽn cổ chai (bottleneck) khi ứng dụng thực hiện các hoạt họa phức tạp hoặc cuộn danh sách phòng trọ quá nhanh.
* **Kiến trúc mới (New Architecture - JSI):** React Native v0.81.5 sử dụng **JavaScript Interface (JSI)** viết bằng C++. JSI cho phép JavaScript engine (Hermes) giữ tham chiếu trực tiếp đến các đối tượng C++ của lớp Native và ngược lại. Điều này giúp các luồng có thể gọi trực tiếp các phương thức của nhau một cách đồng bộ mà không cần qua cơ chế serialize JSON, cải thiện đáng kể tốc độ render và tương tác.

#### 2. Expo Router (File-based Routing)
Dự án sử dụng **Expo Router** để xử lý định tuyến (navigation) dựa trên cấu trúc thư mục (File-based Routing), tương tự như mô hình của Next.js trong Web. Expo Router tự động ánh xạ cấu trúc file trong thư mục `app/` thành các màn hình (screens) của ứng dụng di động, hỗ trợ cả mô hình Tab Navigation (thanh điều hướng phía dưới), Stack Navigation (chuyển trang dạng ngăn xếp), và Drawer Navigation (trượt từ cạnh màn hình).

#### 3. Quản lý trạng thái với Zustand
Thay vì sử dụng Redux Toolkit vốn cồng kềnh với nhiều boilerplate code (actions, reducers, sagas/thunks), ứng dụng di động RRMS sử dụng **Zustand (v4.5.5)** để quản lý state toàn cục.
* **Cơ chế hoạt động:** Zustand được xây dựng trên mô hình Pub/Sub và hook của React. Nó lưu trữ state trong một object JavaScript duy nhất bên ngoài cây component của React.
* **Ưu điểm:** Cấu trúc cực kỳ gọn nhẹ (chỉ khoảng 1KB), không yêu cầu sử dụng Context Provider bao quanh ứng dụng (tránh việc render lại toàn bộ cây component không cần thiết), hỗ trợ cập nhật state bất đồng bộ một cách tự nhiên và dễ dàng tích hợp với `AsyncStorage` để lưu giữ token đăng nhập lâu dài trên thiết bị di động.

---

## 2.2. KIẾN TRÚC BACKEND SPRING BOOT VÀ HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU

Kiến trúc backend của RRMS được thiết kế theo mô hình kiến trúc phân lớp hướng dịch vụ (Layered Architecture) trên nền tảng **Spring Boot 3.3.3** và **Java 17**, kết nối với hệ quản trị cơ sở dữ liệu quan hệ **MySQL**.

```
┌────────────────────────────────────────────────────────────────────────┐
|                      KIẾN TRÚC PHÂN LỚP BACKEND                        |
|                                                                        |
|       [Client App] (React / React Native)                              |
|            │                                                           |
|            ▼ (HTTP Request / Restful API)                              |
|    ┌───────────────┐                                                   |
|    │  Controller   │  --> Tiếp nhận request, validate dữ liệu (DTA)    |
|    └───────┬───────┘                                                   |
|            ▼                                                           |
|    ┌───────────────┐                                                   |
|    │    Service    │  --> Xử lý logic nghiệp vụ chính (Business Logic) │
|    └───────┬───────┘                                                   |
|            ▼                                                           |
|    ┌───────────────┐                                                   |
|    │  Repository   │  --> Giao tiếp CSDL qua Spring Data JPA           |
|    └───────┬───────┘                                                   |
|            ▼                                                           |
|   ┌─────────────────┐                                                  |
|   │ Database (MySQL)│                                                  |
|   └─────────────────┘                                                  |
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2.1. Spring Boot Framework và Kiến trúc phân lớp

Spring Boot 3.3.3 cung cấp cơ chế tự động cấu hình (Auto-configuration) và máy chủ nhúng Tomcat, giúp triển khai ứng dụng độc lập nhanh chóng. Hệ thống backend phân chia mã nguồn thành các lớp tách biệt nhằm tăng tính dễ bảo trì và kiểm thử:

1. **Presentation Layer (Controllers):** Tiếp nhận các yêu cầu HTTP, kiểm tra tính hợp lệ của dữ liệu đầu vào sử dụng annotation `@Valid` (Hibernate Validator), định tuyến đến Service tương ứng và trả về `ResponseEntity` chứa dữ liệu JSON.
2. **Business Logic Layer (Services):** Chứa toàn bộ logic nghiệp vụ của hệ thống (ví dụ: công thức tính tiền hóa đơn theo đơn giá lũy tiến, kiểm tra ràng buộc thời gian hợp đồng). Lớp này được đánh dấu bằng annotation `@Service` và kiểm soát giao dịch bằng `@Transactional`.
3. **Data Access Layer (Repositories):** Giao tiếp trực tiếp với cơ sở dữ liệu. Bằng cách kế thừa `JpaRepository` của Spring Data JPA, hệ thống có sẵn các phương thức CRUD cơ bản mà không cần viết mã SQL thủ công.
4. **Data Transfer Object (DTO) & Mapper (MapStruct):** Để tránh rò rỉ cấu trúc cơ sở dữ liệu và tối ưu hóa lượng dữ liệu truyền qua mạng, hệ thống sử dụng DTO. Thư viện **MapStruct (v1.5.5.Final)** được cấu hình tích hợp với **Lombok** để tự động tạo ra mã chuyển đổi (mapping) giữa Entity và DTO tại thời điểm biên dịch (compile-time), giúp tăng hiệu năng xử lý so với các thư viện ánh xạ sử dụng cơ chế phản chiếu (reflection) như ModelMapper.

---

### 2.2.2. Cơ chế hoạt động của JPA/Hibernate trong quản lý giao dịch CSDL

Spring Data JPA sử dụng **Hibernate** làm nhà cung cấp cơ chế ORM (Object-Relational Mapping) mặc định. Việc hiểu rõ cơ chế hoạt động của Hibernate là điều kiện kiên quyết để tối ưu hóa hiệu năng hệ thống.

#### 1. Persistence Context và Entity Lifecycle
Persistence Context là một bộ nhớ đệm cấp 1 (First-level Cache) quản lý tập hợp các thực thể (Entities) đang hoạt động trong một phiên làm việc (Session/Transaction). Mọi Entity trong JPA đều nằm trong 1 của 4 trạng thái vòng đời sau:

```
                  +--------------------------------+
                  |            Transient           |
                  +---------------+----------------+
                                  | persist()
                                  ▼
   find() / query +--------------------------------+
 ────────────────►│             Managed            ◄─────────────────+
                  +---------------+--------+-------+                 |
                                  |        | remove()                |
                       detach() / |        ▼                         | merge()
                       clear()    |      +----------------+          |
                                  |      |     Removed    |          |
                                  ▼      +----------------+          |
                  +---------------+----------------+                 |
                  |            Detached            ├─────────────────+
                  +--------------------------------+
```

* **Transient:** Đối tượng vừa được khởi tạo bằng từ khóa `new` trong Java, chưa được liên kết với một Session nào và chưa có ID trong cơ sở dữ liệu.
* **Managed (Persistent):** Đối tượng đã được liên kết với Session, có ID trong cơ sở dữ liệu. Mọi thay đổi trên các thuộc tính của đối tượng Managed sẽ được tự động đồng bộ xuống CSDL khi transaction kết thúc (cơ chế Dirty Checking).
* **Detached:** Đối tượng đã từng được liên kết với Session nhưng Session đó đã bị đóng hoặc đối tượng bị đẩy ra ngoài bằng lệnh `evict()` hoặc `clear()`. Thay đổi trên đối tượng Detached sẽ không được tự động cập nhật vào CSDL trừ khi được gọi qua phương thức `merge()`.
* **Removed:** Đối tượng bị đánh dấu xóa bằng phương thức `remove()`. Đối tượng sẽ bị xóa khỏi cơ sở dữ liệu vật lý khi thực hiện hành động flush transaction.

#### 2. Cơ chế quản lý giao dịch (@Transactional)
Khi một method trong lớp Service được chú thích bằng `@Transactional`, Spring Security và Spring AOP (Aspect-Oriented Programming) sẽ tạo ra một Proxy bao quanh method đó.
* Khi bắt đầu gọi method, Proxy sẽ mở một Transaction và liên kết một Session của Hibernate vào luồng hiện tại (ThreadLocal).
* Nếu method thực thi thành công, Proxy thực hiện lệnh `commit()`, lúc này Hibernate sẽ đẩy toàn bộ các thay đổi tích lũy trong Persistence Context xuống MySQL (hành động `flush`).
* Nếu xảy ra ngoại lệ (Runtime Exception), Proxy sẽ gọi lệnh `rollback()` để hoàn trả trạng thái dữ liệu về ban đầu, đảm bảo tính toàn vẹn dữ liệu (ACID).

#### 3. Phân tích các lỗi hiệu năng phổ biến và giải pháp tối ưu
Một trong những lỗi nghiêm trọng nhất được Senior Engineer chỉ ra trong dự án RRMS là việc cấu hình mặc định tải dữ liệu kiểu **EAGER** (Tải dữ liệu tức thời) trên các quan hệ một-nhiều hoặc nhiều-nhiều, dẫn đến lỗi hiệu năng **N+1 Query Problem**.

* **N+1 Query Problem là gì?**
  Giả sử thực thể `Motel` (Khu trọ) có mối quan hệ một-nhiều với thực thể `Room` (Phòng trọ). Nếu ta muốn lấy danh sách $N$ khu trọ và thông tin các phòng trọ của mỗi khu trọ:
  * 1 truy vấn đầu tiên được thực thi để lấy ra $N$ bản ghi `Motel`: 
    ```sql
    SELECT * FROM motel;
    ```
  * Sau đó, đối với mỗi khu trọ trong số $N$ khu trọ đó, Hibernate tiếp tục thực thi thêm 1 truy vấn riêng lẻ để lấy danh sách phòng trọ thuộc về khu trọ đó:
    ```sql
    SELECT * FROM room WHERE motel_id = ?; -- Chạy N lần
    ```
  Tổng cộng hệ thống phải thực hiện $N + 1$ câu lệnh SQL xuống database, làm quá tải kết nối và làm giảm tốc độ phản hồi API nghiêm trọng.
* **Giải pháp khắc phục:**
  1. **Chuyển cấu hình FetchType mặc định sang LAZY (Tải dữ liệu trì hoãn):** Chỉ tải dữ liệu liên quan khi thực sự gọi phương thức getter (ví dụ: `motel.getRooms()`).
  2. **Sử dụng JOIN FETCH trong JPQL:** Gộp hai thực thể vào một câu truy vấn duy nhất:
    ```sql
    SELECT m FROM Motel m JOIN FETCH m.rooms;
    ```
  3. **Sử dụng EntityGraph:** Định nghĩa cấu trúc các thực thể cần tải kèm theo thông qua annotation `@EntityGraph` trên repository method.

---

## 2.3. CƠ CHẾ CACHING VÀ LƯU TRỮ VỚI REDIS SERVER

Để giảm tải cho cơ sở dữ liệu quan hệ MySQL và xử lý các tác vụ yêu cầu tốc độ phản hồi cực nhanh dưới mức mili-giây, hệ thống RRMS tích hợp bộ nhớ đệm phân tán **Redis**.

```
                   +------------------------------+
                   |          CLIENT APP          |
                   +--------------+---------------+
                                  |
                                  | HTTP Request
                                  ▼
                   +--------------+---------------+
                   |     SPRING BOOT BACKEND      |
                   +-------+--------------+-------+
                           |              |
                           | Check Cache  | Cache Miss: Read DB & Write Cache
                     (1)   v              v  (2)
                   +-------+------+  +----+-------+
                   | REDIS SERVER |  |    MYSQL   |
                   +--------------+  +------------+
```

### 2.3.1. Cơ chế hoạt động của Redis
Redis (Remote Dictionary Server) là một hệ thống lưu trữ dữ liệu dạng Key-Value trong bộ nhớ RAM (In-memory database) mã nguồn mở.
* **Kiến trúc Single-threaded:** Redis sử dụng kiến trúc đơn luồng (Single-thread) kết hợp với cơ chế Multiplexing dựa trên luồng sự kiện (Event Loop) tương tự Node.js. Nhờ chạy trực tiếp trên bộ nhớ RAM và không phải chịu chi phí chuyển đổi ngữ cảnh (context switching) giữa các thread cũng như cơ chế lock dữ liệu (CPU lock), Redis có khả năng xử lý hàng trăm nghìn request mỗi giây với độ trễ cực thấp.
* **Cơ chế bền vững hóa dữ liệu (Persistence):** Mặc dù hoạt động trên RAM, Redis vẫn đảm bảo an toàn dữ liệu thông qua hai cơ chế ghi file xuống đĩa cứng: **RDB (Redis Database Backup)** - chụp ảnh nhanh trạng thái dữ liệu định kỳ, và **AOF (Append Only File)** - ghi lại mọi lệnh thay đổi dữ liệu vào file log theo thời gian thực.

---

### 2.3.2. Các kiểu dữ liệu chính và ứng dụng trong RRMS
Dự án sử dụng các kiểu dữ liệu của Redis cho từng bài toán cụ thể:
1. **String:** Kiểu dữ liệu đơn giản nhất, lưu trữ chuỗi ký tự, số hoặc dữ liệu nhị phân (dung lượng tối đa 512MB).
   * *Ứng dụng:* Lưu trữ dữ liệu cache cho các API có tần suất đọc lớn nhưng ít thay đổi như cấu hình dịch vụ (`/api/v1/services`), danh mục tỉnh/thành phố, hoặc lưu trữ chuỗi JSON của thông tin cá nhân tạm thời.
2. **Hash:** Cấu trúc lưu trữ dạng bản đồ (Map) giữa các field và value của một key, rất phù hợp để lưu trữ thông tin của một đối tượng cụ thể.
   * *Ứng dụng:* Lưu giữ chi tiết thông tin của một phiên làm việc (Session) hoặc thông tin phòng trọ đang được nhiều người cùng xem.
3. **Set & Sorted Set (ZSET):** Tập hợp các phần tử không trùng lặp (Sorted Set có thêm điểm số `score` để sắp xếp tự động).
   * *Ứng dụng:* Sorted Set được dùng để quản lý bảng xếp hạng tin đăng phòng trọ nổi bật dựa trên điểm số đánh giá và lượt xem.

---

### 2.3.3. Xử lý OTP và chống nghẽn cổ chai (Rate Limiting)
* **Lưu trữ mã OTP với TTL (Time-To-Live):** 
  Trong luồng quên mật khẩu hoặc đăng ký tài khoản, backend sẽ sinh ra một mã xác thực ngẫu nhiên gồm 6 chữ số và gửi qua SMS hoặc Email cho người dùng. 
  Thay vì lưu mã này vào một biến static trong Java (như code ban đầu gây ra lỗi race condition khi nhiều người dùng cùng request) hoặc lưu vào MySQL (gây ghi đĩa liên tục không cần thiết), hệ thống lưu mã OTP vào Redis dưới dạng một Key-Value:
  ```
  Key: "OTP:" + phone_number
  Value: otp_code
  ```
  Đi kèm với đó là cấu hình **TTL (Time-To-Live)** là 300 giây (5 phút). Sau thời gian này, Redis sẽ tự động giải phóng vùng nhớ chứa key này. Khi người dùng nhập OTP, hệ thống chỉ cần đọc từ Redis kiểm tra, vừa đảm bảo tốc độ vừa tự động dọn dẹp dữ liệu rác.
* **Rate Limiting (Giới hạn tần suất yêu cầu):**
  Để bảo vệ hệ thống khỏi các cuộc tấn công Brute-force dò mã OTP hoặc tấn công từ chối dịch vụ (DDoS), hệ thống sử dụng thuật toán **Token Bucket** hoặc **Fixed Window** được triển khai trên Redis. Cứ mỗi yêu cầu gửi OTP từ một địa chỉ IP hoặc số điện thoại, hệ thống sẽ tăng một bộ đếm (Counter) trên Redis có TTL là 60 giây. Nếu bộ đếm vượt quá ngưỡng cấu hình (ví dụ: tối đa 3 requests gửi OTP trong 1 phút), yêu cầu sẽ bị chặn ngay lập tức ở tầng Filter/Controller và trả về mã lỗi HTTP 429 Too Many Requests.

---

## 2.4. CÔNG NGHỆ TÌM KIẾM TOÀN VĂN VỚI ELASTICSEARCH

Bài toán tìm kiếm phòng trọ của khách thuê đòi hỏi tính linh hoạt cao (tìm kiếm theo từ khóa không dấu, viết sai chính tả, lọc đa tiêu chí theo bán kính địa lý, mức giá, tiện ích). Việc thực hiện câu lệnh `LIKE %keyword%` trên CSDL MySQL truyền thống sẽ dẫn đến hành vi quét toàn bộ bảng (Full Table Scan), làm mất hiệu lực của các chỉ mục (Indexes) và gây sập cơ sở dữ liệu khi lượng dữ liệu phòng trọ tăng lên. Do đó, RRMS sử dụng **Elasticsearch** làm công cụ tìm kiếm chính.

```
+---------------------------------------------------------------------------------+
|                   CƠ CHẾ HOẠT ĐỘNG CỦA ELASTICSEARCH                            |
|                                                                                 |
| 1. Khi tạo phòng trọ (Write/Index Flow):                                        |
| [MySQL Database] ---> (Change Data Capture / Event) ---> [Elasticsearch Index]  |
|                                                                                 |
| 2. Khi tìm kiếm phòng trọ (Search Flow):                                        |
| [Client App] --(Search Query)--> [Elasticsearch] --(Inverted Index)--> [Result] |
| (Tốc độ phản hồi hàng chục triệu bản ghi dưới 10ms)                             |
+---------------------------------------------------------------------------------+
```

### 2.4.1. Kiến trúc hướng tài liệu (Document-oriented)
Elasticsearch là một công cụ tìm kiếm và phân tích phân tán, xây dựng trên thư viện Apache Lucene. Khác với CSDL quan hệ lưu trữ dữ liệu dưới dạng các dòng (Rows) và cột (Columns) trong các bảng (Tables), Elasticsearch lưu trữ dữ liệu dưới dạng các tài liệu JSON (Documents). Các tài liệu có cấu trúc tương đương nhau được nhóm lại vào trong một Chỉ mục (Index) - tương đương với một bảng trong CSDL quan hệ.

---

### 2.4.2. Cơ chế Chỉ mục đảo ngược (Inverted Index)
Đây là cốt lõi công nghệ giúp Elasticsearch đạt được tốc độ tìm kiếm gần như tức thời ngay cả trên hàng triệu bản ghi.
* Thay vì ánh xạ: **Tài liệu -> Chứa các từ**, chỉ mục đảo ngược ánh xạ: **Từ -> Xuất hiện trong các tài liệu nào**.
* Ví dụ, có 2 phòng trọ với mô tả:
  * Document 1: "Phòng trọ quận 1 giá rẻ đầy đủ tiện nghi"
  * Document 2: "Phòng trọ giá rẻ quận Bình Thạnh"
* Chỉ mục đảo ngược được tạo ra dạng:

| Từ khóa (Term) | Danh sách tài liệu chứa từ (Posting List) |
|---|:---:|
| Phòng | Doc 1, Doc 2 |
| trọ | Doc 1, Doc 2 |
| quận | Doc 1, Doc 2 |
| 1 | Doc 1 |
| giá | Doc 1, Doc 2 |
| rẻ | Doc 1, Doc 2 |
| đầy | Doc 1 |
| đủ | Doc 1 |
| tiện | Doc 1 |
| nghi | Doc 1 |
| Bình | Doc 2 |
| Thạnh | Doc 2 |

Khi người dùng tìm kiếm cụm từ "phòng trọ Bình Thạnh", Elasticsearch chỉ cần tra cứu từ khóa "Bình" và "Thạnh" trong bảng chỉ mục đảo ngược và ngay lập tức trả về Document 2 mà không cần duyệt qua nội dung của bất kỳ tài liệu nào khác.

---

### 2.4.3. Quy trình Phân tích văn bản (Text Analysis)
Trước khi một tài liệu JSON được lưu trữ vào Elasticsearch Index, hoặc khi một câu truy vấn tìm kiếm được gửi đến, nó phải đi qua một bộ phân tích (**Analyzer**) gồm ba bước liên tiếp:
1. **Character Filters:** Loại bỏ các thẻ HTML, chuyển đổi các ký tự đặc biệt.
2. **Tokenizer:** Tách chuỗi văn bản thành các từ riêng biệt (Tokens). Trong dự án RRMS, để hỗ trợ tiếng Việt có dấu và không dấu, hệ thống sử dụng bộ tokenizer phân tách từ tiếng Việt chuyên dụng kết hợp với cơ chế sinh N-gram.
3. **Token Filters:** Biến đổi các token thu được:
   * **Lowercase Filter:** Chuyển tất cả chữ viết hoa thành chữ viết thường để việc tìm kiếm không phân biệt hoa thường.
   * **ASCII Folding Filter:** Chuyển đổi các ký tự có dấu thành không dấu (ví dụ: "quận" -> "quan"), giúp người dùng gõ không dấu vẫn tìm ra kết quả có dấu.
   * **Stopwords Filter:** Loại bỏ các từ vô nghĩa xuất hiện quá phổ biến (như "và", "hoặc", "của", "tại").

---

### 2.4.4. Tích hợp dữ liệu giữa MySQL và Elasticsearch
Dữ liệu nguồn (Single Source of Truth) vẫn được lưu trữ tại MySQL để đảm bảo tính nhất quán giao dịch. Hệ thống đồng bộ dữ liệu sang Elasticsearch theo cơ chế **Application-level Synchronization**:
* Khi một phòng trọ được tạo mới, cập nhật hoặc xóa thông qua API trên Spring Boot, mã nguồn của Service sau khi lưu thành công vào MySQL sẽ gửi một yêu cầu bất đồng bộ (sử dụng Spring Data Elasticsearch Repository) để lưu/cập nhật tài liệu tương ứng trên Elasticsearch Index.
* Trong trường hợp hệ thống lớn hơn, cơ chế này có thể được thay thế bằng công cụ CDC (Change Data Capture) như Debezium hoặc Logstash đọc trực tiếp từ MySQL Binary Log (binlog) để đẩy sang Elasticsearch mà không làm ảnh hưởng đến luồng code nghiệp vụ của ứng dụng Spring Boot.

---

## 2.5. CƠ CHẾ BẢO MẬT: OAUTH2, JWT VÀ CHỮ KÝ SỐ

Bảo mật là tiêu chí sống còn đối với một hệ thống quản lý có tích hợp giao dịch tài chính và lưu trữ thông tin cá nhân nhạy cảm của khách thuê. RRMS triển khai cơ chế bảo mật đa tầng từ xác thực người dùng đến bảo vệ API.

```
+---------------------------------------------------------------------------------+
| LUỒNG XÁC THỰC JWT (STATELESS AUTHENTICATION)                                   |
|                                                                                 |
| 1. Authentication (Login):                                                      |
| Client  --(Credentials: Phone/Password)-------------------> Backend App         |
| Client  <--(Access Token & Refresh Token)------------------ Backend App         |
|                                                                                 |
| 2. Authorization (Request API with JWT):                                        |
| Client  --(Request + Authorization: Bearer <Token>)------> Backend App         |
| Backend App verify Signature & Expiration of Token                              |
| Backend App  --(Return Protected Data)--------------------> Client              |
+---------------------------------------------------------------------------------+
```

### 2.5.1. Cơ chế hoạt động của JSON Web Token (JWT)
JWT là một tiêu chuẩn mở (RFC 7519) định nghĩa cách thức truyền tin an toàn giữa các bên dưới dạng một đối tượng JSON. JWT được sử dụng cho cơ chế xác thực không trạng thái (**Stateless Authentication**).

#### 1. Cấu trúc của JWT
Một token JWT gồm 3 phần được phân tách bằng dấu chấm (`.`):
* **Header:** Chứa thông tin về loại token (thường là JWT) và thuật toán mã hóa chữ ký (ví dụ: HS256 hoặc RS256).
  ```json
  { "alg": "HS256", "typ": "JWT" }
  ```
* **Payload:** Chứa các khai báo (Claims) về thực thể người dùng và các siêu dữ liệu bổ sung như:
  * `sub` (Subject): ID hoặc số điện thoại của người dùng.
  * `roles`: Danh sách quyền hạn (e.g., `ROLE_HOST`, `ROLE_TENANT`).
  * `iat` (Issued At): Thời điểm tạo token.
  * `exp` (Expiration Time): Thời điểm hết hạn của token.
* **Signature:** Được tạo ra bằng cách lấy chuỗi Header đã mã hóa Base64 kết hợp với chuỗi Payload đã mã hóa Base64, sau đó ký bằng một khóa bí mật (Secret Key) thông qua thuật toán được chỉ định trong Header.
  $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}), \text{SecretKey})$$

#### 2. Cơ chế xác thực Stateless Authentication
Sau khi người dùng đăng nhập thành công, Server sinh ra cặp JWT gồm **Access Token** (thời gian sống ngắn, ví dụ: 15 phút) và **Refresh Token** (thời gian sống dài, ví dụ: 7 ngày) rồi trả về cho Client.
* Ở mỗi request tiếp theo lên các API cần bảo mật, Client đính kèm Access Token vào Header của HTTP Request dưới dạng:
  ```http
  Authorization: Bearer <access_token>
  ```
* Server (sử dụng Spring Security Filter Chain) chỉ cần lấy token ra, giải mã Base64 phần Header và Payload, sau đó dùng Secret Key chạy lại thuật toán băm để so sánh Signature được tính toán với Signature đính kèm trong token.
* Nếu hai chữ ký trùng khớp và token chưa hết hạn (`exp` > thời gian hiện tại), Server công nhận tính hợp lệ của request và phân quyền dựa trên `roles` có trong Payload. Server hoàn toàn không cần truy vấn database hay đọc session từ bộ nhớ, giúp hệ thống có khả năng mở rộng quy mô (horizontal scaling) cực kỳ dễ dàng.

#### 3. Token Rotation (Quay vòng Token)
Để giảm thiểu rủi ro khi Access Token bị kẻ xấu đánh cắp, hệ thống triển khai cơ chế **Token Rotation**:
* Refresh Token được lưu trữ trong cơ sở dữ liệu đi kèm với trạng thái sử dụng.
* Khi Access Token hết hạn, Client gửi Refresh Token lên một endpoint riêng biệt (`/api/v1/auth/refresh`) để đổi lấy một cặp Access Token và Refresh Token mới.
* Ngay sau khi đổi thành công, Refresh Token cũ bị vô hiệu hóa. Nếu kẻ tấn công cố tình sử dụng lại một Refresh Token cũ đã qua sử dụng, hệ thống lập tức phát hiện ra hành vi gian lận (Replay Attack) và thu hồi toàn bộ các token đang hoạt động thuộc về tài khoản đó, bắt buộc người dùng thực sự phải đăng nhập lại.

---

### 2.5.2. Giao thức xác thực liên kết OAuth2
Để nâng cao trải nghiệm người dùng, tránh việc phải ghi nhớ quá nhiều mật khẩu, RRMS tích hợp tính năng đăng nhập bằng tài khoản Google thông qua giao thức **OAuth2 (Authorization Code Grant Flow)**.

```
┌──────┐              ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
│Client│              │  User Agent  │              │  Auth Server │              │Resource Server│
│(App) │              │ (Browser/OS) │              │   (Google)   │              │   (Google)   │
└──┬───┘              └──────┬───────┘              └──────┬───────┘              └──────┬───────┘
   │                         │                             │                             │
   │ 1. Đăng nhập Google     │                             │                             │
   ├────────────────────────►│                             │                             │
   │                         │ 2. Hiển thị trang đăng nhập  │                             │
   │                         ├────────────────────────────►│                             │
   │                         │ 3. Cấp Auth Code            │                             │
   │                         ◄─────────────────────────────┤                             │
   │ 4. Gửi Auth Code        │                             │                             │
   ◄─────────────────────────┤                             │                             │
   │                                                       │                             │
   │ 5. Trao đổi Auth Code lấy Token                       │                             │
   ├──────────────────────────────────────────────────────►│                             │
   │ 6. Trả về Access Token & ID Token                     │                             │
   ◄───────────────────────────────────────────────────────┤                             │
   │                                                                                     │
   │ 7. Gửi Access Token lấy Profile thông tin                                           │
   ├────────────────────────────────────────────────────────────────────────────────────►│
   │ 8. Trả về thông tin Email, Tên, Avatar                                               │
   ◄─────────────────────────────────────────────────────────────────────────────────────┤
```

1. **Khởi tạo:** Khi người dùng click nút "Đăng nhập bằng Google" trên ứng dụng Web React, ứng dụng sẽ chuyển hướng trình duyệt đến Máy chủ Ủy quyền (Authorization Server) của Google kèm theo các tham số như `client_id`, `redirect_uri` (địa chỉ nhận kết quả của backend), `response_type=code`, và `scope` (thông tin yêu cầu truy cập như email, profile).
2. **Ủy quyền:** Người dùng đăng nhập tài khoản Google và xác nhận cấp quyền cho ứng dụng RRMS.
3. **Cấp Authorization Code:** Google Authorization Server chuyển hướng trình duyệt quay lại `redirect_uri` của ứng dụng kèm theo một mã ủy quyền tạm thời gọi là **Authorization Code**.
4. **Trao đổi Token:** Backend Spring Boot nhận Authorization Code từ client, sau đó gửi một request POST trực tiếp (backchannel) từ server đến Google Authorization Server để đổi code này lấy **Access Token** và **ID Token** (sử dụng Client Secret lưu cấu hình ẩn của backend). Việc trao đổi này diễn ra trực tiếp giữa hai server nên tránh được rủi ro rò rỉ token trên trình duyệt.
5. **Đồng bộ tài khoản:** Backend sử dụng Access Token vừa nhận được để gọi API của Google Resource Server lấy thông tin hồ sơ của người dùng (Email, Tên, Ảnh đại diện). Nếu email này chưa tồn tại trong hệ thống RRMS, hệ thống sẽ tự động tạo một tài khoản mới với vai trò mặc định là `TENANT` và sinh mã JWT riêng của RRMS để trả về cho Client hoàn tất luồng đăng nhập.

---

### 2.5.3. Chữ ký số và Bảo mật Webhook

Khi tích hợp các dịch vụ của bên thứ ba, đặc biệt là các cổng thanh toán tài chính, việc bảo vệ đường truyền thông tin phản hồi trạng thái giao dịch (Webhook/IPN) là tối quan trọng để chống lại các cuộc tấn công thay đổi giá trị giao dịch hoặc giả mạo hóa đơn đã thanh toán.

#### 1. Nguyên lý chữ ký số trong truyền tin (Digital Signature)
Chữ ký số hoạt động dựa trên mật mã học bất đối xứng (Asymmetric Cryptography) hoặc khóa đối xứng băm (Symmetric Key Hashing):
* **Khóa đối xứng (HMAC-SHA256/SHA512):** Cả Server gửi (Cổng thanh toán) và Server nhận (RRMS Backend) đều cùng chia sẻ một chuỗi khóa bí mật (Secret Key). Khi cổng thanh toán gửi thông tin giao dịch qua Webhook, họ sẽ gộp toàn bộ nội dung của payload JSON và dùng Secret Key chạy thuật toán băm (HMAC) để tạo ra một chuỗi băm duy nhất (Signature) và đính kèm vào Header của request gửi sang RRMS.
* **Xác thực:** Khi nhận được request Webhook, backend RRMS sẽ lấy toàn bộ nội dung body nhận được, kết hợp với Secret Key được cấu hình sẵn trong file cấu hình bảo mật của server, tự chạy lại thuật toán băm HMAC. Nếu chuỗi băm tự tính toán trùng khớp hoàn toàn với Signature đính kèm ở Header, server công nhận gói tin này thực sự được gửi từ cổng thanh toán và nội dung không hề bị chỉnh sửa trên đường truyền (Integrity & Authentication).

#### 2. Quy trình xác thực Webhook đối với từng cổng thanh toán
* **Stripe:** Stripe gửi kèm chữ ký trong Header `Stripe-Signature`. SDK của Stripe cung cấp phương thức `Webhook.constructEvent(payload, sigHeader, endpointSecret)` để tự động kiểm tra chữ ký và chống tấn công Replay Attack bằng cách nhúng timestamp vào chữ ký.
* **PayPal:** PayPal sử dụng chữ ký bất đối xứng. Họ gửi kèm ID của chứng chỉ kỹ thuật số (Certificate ID) trong Header. Backend RRMS phải gửi một request POST ngược lại PayPal API (luồng Verification API) gửi kèm toàn bộ Header và Body nhận được để PayPal xác nhận chữ ký đó có đúng do họ ký hay không.
* **VNPay:** Sử dụng thuật toán băm khóa đối xứng **HMAC-SHA512**. Khi nhận phản hồi từ VNPay (qua IPN URL), backend sẽ sắp xếp tất cả các tham số nhận được theo thứ tự chữ cái (alphabetical order), nối các tham số thành một chuỗi query string dạng `key1=value1&key2=value2`, sau đó dùng khóa bí mật `vnp_HashSecret` để tính toán chuỗi mã hóa SHA512 và so sánh với tham số `vnp_SecureHash` gửi kèm.
* **MoMo:** Tương tự VNPay, MoMo yêu cầu sắp xếp các trường dữ liệu theo thứ tự bảng chữ cái và sử dụng thuật toán **HMAC-SHA256** với `Secret Key` do MoMo cấp để tạo chữ ký xác thực.

---

## 2.6. QUY TRÌNH HOẠT ĐỘNG CỦA CÁC CỔNG THANH TOÁN TRỰC TUYẾN

Hệ thống RRMS tích hợp 4 cổng thanh toán lớn nhằm đáp ứng nhu cầu thanh toán tiền phòng và đặt cọc linh hoạt: **Stripe**, **PayPal** (quốc tế) và **VNPay**, **MoMo** (nội địa Việt Nam). Quy trình hoạt động của các cổng này được chia làm hai nhóm chính dựa trên phương thức tích hợp.

```
┌──────┐             ┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│Client│             │ RRMS Backend │             │Payment Gateway│            │ Bank/Wallet  │
└──┬───┘             └──────┬───────┘             └──────┬───────┘             └──────┬───────┘
   │                        │                            │                            │
   │ 1. Yêu cầu thanh toán  │                            │                            │
   ├───────────────────────►│                            │                            │
   │                        │ 2. Khởi tạo GD (API call)  │                            │
   │                        ├───────────────────────────►│                            │
   │                        │ 3. Trả về Link thanh toán  │                            │
   │                        ◄────────────────────────────┤                            │
   │ 4. Chuyển hướng trang  │                            │                            │
   ├────────────────────────┼────────────────────────────┼───────────────────────────►│
   │                        │                            │ 5. Thực hiện thanh toán    │
   │                        │                            │◄───────────────────────────┤
   │                        │                            │ 6. Gửi Webhook/IPN (Async) │
   │                        │◄───────────────────────────┼────────────────────────────┤
   │                        │ 7. Verify Signature        │                            │
   │                        │    & Cập nhật Hóa đơn      │                            │
   │                        │    (Gạch nợ tự động)       │                            │
   │ 8. Redirect về Client  │                            │                            │
   ◄────────────────────────┼────────────────────────────┼────────────────────────────┘
```

### 2.6.1. Phương thức tích hợp qua SDK (Stripe, PayPal)
Đây là các cổng thanh toán hỗ trợ SDK mạnh mẽ, cho phép tích hợp sâu vào giao diện người dùng.

#### 1. Stripe (Stripe Payment Intents API)
* **Quy trình:**
  1. Khi khách thuê nhấn nút thanh toán hóa đơn bằng Stripe trên Web, client gửi yêu cầu lên Backend RRMS kèm theo ID hóa đơn và số tiền cần thanh toán.
  2. Backend RRMS gọi API của Stripe tạo một **PaymentIntent**. Đối tượng này chứa thông tin số tiền, loại tiền (VND, USD) và trạng thái giao dịch. Stripe trả về một chuỗi bí mật gọi là `client_secret`.
  3. Client Web nhận `client_secret` và sử dụng thư viện `@stripe/react-stripe-js` hiển thị form nhập thẻ tín dụng an toàn (Stripe Elements). Form này được tải trực tiếp từ server của Stripe dưới dạng iframe, đảm bảo thông tin thẻ tín dụng của khách thuê không bao giờ đi qua hoặc lưu trữ tại máy chủ RRMS (đạt chuẩn bảo mật dữ liệu thẻ thanh toán PCI-DSS).
  4. Người dùng nhập thông tin thẻ và nhấn gửi. Mã nguồn JavaScript của Stripe sẽ gửi thông tin thẻ trực tiếp lên Stripe Server để xử lý thanh toán.
  5. Khi thanh toán hoàn tất, Stripe Server gửi một thông báo bất đồng bộ (**Webhook Event: `payment_intent.succeeded`**) đến URL cấu hình của RRMS Backend.
  6. Backend xác thực chữ ký của Webhook, lấy ID hóa đơn được nhúng trong metadata của PaymentIntent và tiến hành cập nhật trạng thái hóa đơn thành "Đã thanh toán" (Paid), đồng thời ghi nhận lịch sử giao dịch.

#### 2. PayPal (PayPal REST SDK)
* **Quy trình:**
  1. Khách thuê chọn thanh toán bằng PayPal, Backend RRMS sử dụng SDK của PayPal khởi tạo một đối tượng **Payment** với cấu hình các link điều hướng: `return_url` (khi thanh toán thành công) và `cancel_url` (khi người dùng hủy giao dịch).
  2. PayPal API trả về thông tin giao dịch bao gồm một ID giao dịch và một liên kết chuyển hướng (approval link).
  3. Client nhận link và chuyển hướng người dùng sang trang thanh toán của PayPal để đăng nhập và phê duyệt thanh toán.
  4. Sau khi người dùng phê duyệt thành công trên giao diện PayPal, trình duyệt sẽ tự động chuyển hướng về `return_url` của Backend RRMS kèm theo tham số `paymentId` và `PayerID`.
  5. Backend thực hiện một API call trực tiếp sang PayPal để thực thi giao dịch (**Execute Payment**). Chỉ sau khi bước thực thi này thành công, tiền mới thực sự được chuyển từ tài khoản khách thuê sang tài khoản chủ trọ. Hệ thống tiến hành cập nhật trạng thái hóa đơn sang "Đã thanh toán".

---

### 2.6.2. Phương thức chuyển hướng thanh toán qua Cổng trung gian (VNPay, MoMo)
Đối với các cổng thanh toán nội địa, do đặc thù liên kết với các ngân hàng nội địa (qua ATM/Internet Banking) và ví điện tử, quy trình chủ yếu dựa trên cơ chế ký URL chuyển hướng.

#### 1. VNPay (VNPay Gateway)
* **Quy trình:**
  1. Khi người dùng chọn thanh toán qua VNPay, Backend RRMS thu thập các thông tin giao dịch bắt buộc: Mã đơn hàng, Số tiền, Địa chỉ IP của client, Thông tin mô tả giao dịch, và Mã ngân hàng (nếu có).
  2. Backend sắp xếp các trường dữ liệu này theo bảng chữ cái, tạo chuỗi query string, dùng khóa bí mật `vnp_HashSecret` để tính toán mã bảo mật `vnp_SecureHash` bằng thuật toán SHA512.
  3. Backend ghép `vnp_SecureHash` vào cuối chuỗi query string để tạo thành một URL thanh toán hoàn chỉnh của VNPay và trả về cho Client.
  4. Client chuyển hướng người dùng đến URL này. Người dùng thực hiện quét mã QR qua ứng dụng ngân hàng hoặc nhập thông tin thẻ ATM nội địa trên cổng VNPay.
  5. Sau khi thanh toán xong, VNPay thực hiện đồng thời hai việc:
     * Chuyển hướng trình duyệt của người dùng về `vnp_ReturnUrl` trên Frontend để hiển thị kết quả trực quan cho người dùng.
     * Gọi bất đồng bộ (server-to-server) đến địa chỉ `vnp_IpnUrl` (Instant Payment Notification) trên Backend RRMS để thông báo kết quả chính thức.
  6. Backend kiểm tra chữ ký SHA512 của dữ liệu IPN nhận được, kiểm tra số tiền khớp với hóa đơn trong DB, kiểm tra trạng thái hóa đơn hiện tại (chống việc cập nhật trùng lặp). Nếu mọi thứ hợp lệ, cập nhật trạng thái hóa đơn thành công và trả về phản hồi mã JSON đúng định dạng yêu cầu của VNPay (`{"RspCode": "00", "Message": "Confirm Success"}`).

#### 2. MoMo (Mô hình Thanh toán qua Ví MoMo)
* **Quy trình:**
  1. Tương tự như VNPay, Backend RRMS tạo một yêu cầu thanh toán (Request Payment) chứa các tham số: `partnerCode`, `accessKey`, `requestId`, `amount`, `orderId`, `orderInfo`, `redirectUrl` và `ipnUrl`.
  2. Tạo chữ ký điện tử `signature` bằng thuật toán HMAC-SHA256 kết hợp chuỗi tham số và `Secret Key` do MoMo cung cấp.
  3. Gửi một request POST chứa payload JSON và chữ ký sang API của MoMo (`https://test-payment.momo.vn/v2/gateway/api/create`).
  4. MoMo API trả về một đường link thanh toán (`payUrl`).
  5. Client chuyển hướng người dùng sang trang của MoMo hoặc hiển thị mã QR để người dùng dùng ứng dụng MoMo trên điện thoại quét mã thanh toán.
  6. Sau khi thanh toán thành công, MoMo gửi dữ liệu kết quả thông qua một request POST dạng JSON đến địa chỉ `ipnUrl` cấu hình trên Backend RRMS.
  7. Backend thực hiện xác thực chữ ký của payload nhận được bằng cách chạy lại HMAC-SHA256 với Secret Key của MoMo, đối soát dữ liệu và cập nhật gạch nợ hóa đơn tự động trong cơ sở dữ liệu MySQL.

---

## 2.7. TỔNG HỢP VÀ KẾT LUẬN CHƯƠNG II

Việc lựa chọn và kết hợp các công nghệ trong hệ thống RRMS được cân nhắc kỹ lưỡng dựa trên các tiêu chí khoa học và thực tiễn vận hành phần mềm:

* **Phía Client:** Sự kết hợp giữa **React JS** trên Web và **React Native** trên Mobile tạo ra giải pháp tối ưu cho từng đối tượng người dùng. Trình quản trị Web tận dụng tối đa sức mạnh render của Virtual DOM và mô hình SPA để xử lý các bảng dữ liệu lớn và biểu đồ thống kê phức tạp cho chủ trọ. Trong khi đó, ứng dụng Mobile viết bằng React Native chạy trên nhân Hermes kết hợp kiến trúc JSI mới mang lại trải nghiệm vuốt chạm mượt mà như một ứng dụng gốc (Native App) cho người thuê phòng.
* **Phía Server:** Sự vững chắc của **Spring Boot 3.3.3** kết hợp tính nhất quán dữ liệu của **MySQL** đảm bảo cho các nghiệp vụ tài chính, hợp đồng diễn ra chính xác tuyệt đối thông qua cơ chế quản lý giao dịch `@Transactional` của Hibernate.
* **Tối ưu hóa hiệu năng và mở rộng:** Việc đưa **Redis** vào làm cache tầng trung gian giúp giảm tải số lượng truy vấn đắt đỏ xuống MySQL, giải quyết triệt để bài toán OTP và chống DDoS. Đồng thời, cấu trúc chỉ mục đảo ngược của **Elasticsearch** giải quyết bài toán tìm kiếm phòng trọ đa thuộc tính tốc độ cao mà MySQL không thể đáp ứng hiệu quả.
* **Hệ thống bảo mật:** Triển khai cơ chế xác thực không trạng thái qua **JWT** kết hợp luồng đăng nhập **OAuth2 Google** mang lại sự an toàn và tiện lợi tối đa. Các giao dịch tài chính được bảo vệ chặt chẽ thông qua cơ chế ký số và xác thực chữ ký **Webhook/IPN** của 4 cổng thanh toán lớn.

Tất cả các nền tảng lý thuyết và công nghệ trên tạo thành một cơ sở khoa học vững chắc để nhóm thiết kế chi tiết kiến trúc hệ thống, sơ đồ ca sử dụng, sơ đồ tuần tự và cơ sở dữ liệu vật lý ở **Chương III**.
