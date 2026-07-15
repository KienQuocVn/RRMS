# Phần F — Dạy backend Spring Boot (RRMS) tự công bố metrics

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần A, B, B0, C, D (CI/CD), E của lab Deploy RRMS đã hoàn thành** — backend chạy qua systemd `rrms-backend` tại `127.0.0.1:7000`, `git push` lên `main` tự động test/build/deploy lên VPS (không cần SSH tay).

## Khác biệt so với lab gốc (MERN + prom-client)

**RRMS dùng Spring Boot — đã có sẵn cơ chế chuẩn công nghiệp** để làm việc này: **Micrometer** (thư viện đo lường) + **Spring Boot Actuator** (expose endpoint quản trị, trong đó có `/actuator/prometheus`). Không cần tự viết middleware đo giờ như bên Node — chỉ cần khai báo dependency + vài dòng cấu hình.

## Checklist

### F1 — Thêm dependency vào backend

- [x] **1.1. Mở `server/pom.xml`**, thêm 2 dependency sau vào phần `<dependencies>`:
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
      <groupId>io.micrometer</groupId>
      <artifactId>micrometer-registry-prometheus</artifactId>
      <scope>runtime</scope>
  </dependency>
  ```
  > `spring-boot-starter-actuator` mở các endpoint quản trị (`/actuator/health`, `/actuator/prometheus`...). `micrometer-registry-prometheus` là "adapter" giúp Micrometer xuất số liệu đúng định dạng Prometheus hiểu được — không có nó, `/actuator/prometheus` sẽ không tồn tại.

### F2 — Cấu hình expose endpoint

- [x] **2.1. Mở `server/src/main/resources/application.properties`** (cấu hình production đang dùng thật), thêm:
  ```properties
  # ---- Actuator / Prometheus metrics ----
  management.endpoints.web.exposure.include=health,prometheus
  management.endpoint.health.show-details=never
  management.metrics.distribution.percentiles-histogram.http.server.requests=true
  management.metrics.tags.application=rrms-backend
  ```
  > `percentiles-histogram.http.server.requests=true` là dòng quan trọng nhất — nếu thiếu, Prometheus sẽ không có đủ dữ liệu "bucket" để tính p95 (95% request nhanh hơn X giây) ở Phần D. `show-details=never` tránh lộ chi tiết nội bộ (tên DB, trạng thái từng thành phần) khi endpoint `/actuator/health` bị gọi từ bên ngoài.

- [x] **2.2. (Nếu profile `dev` có file riêng)** kiểm tra `application-dev.properties` không ghi đè lại `management.endpoints.web.exposure.include` bằng giá trị khác/rỗng — nếu có, xoá dòng đó ở file `dev` để dùng đúng cấu hình vừa thêm ở `application.properties`.

### F3 — Test ở local trước khi đưa lên VPS
 
- [x] **3.1. Chạy backend local:**
  ```bash
  cd server
  ./mvnw spring-boot:run
  ```
 
- [x] **3.2. Kiểm tra endpoint Prometheus** (terminal khác):
  ```bash
  curl http://localhost:7000/actuator/prometheus | head -30
  ```
  Phải thấy các dòng dạng:
  ```
  # HELP jvm_memory_used_bytes The amount of used memory
  # TYPE jvm_memory_used_bytes gauge
  jvm_memory_used_bytes{application="rrms-backend",area="heap",...} 1.2345678E7
  http_server_requests_seconds_count{application="rrms-backend",...} 3.0
  ```
 
- [x] **3.3. Kiểm tra endpoint health:**
  ```bash
  curl http://localhost:7000/actuator/health
  # → {"status":"UP"}
  ```
 
- [x] **3.4. Xác nhận middleware đo đúng request thật** — mở web local vài lần / gọi vài API, sau đó chạy lại:
  ```bash
  curl -s http://localhost:7000/actuator/prometheus | grep http_server_requests_seconds_count
  ```
  Số đếm (`_count`) phải tăng lên theo số lần bạn thao tác.
 
### F4 — Đưa lên production qua pipeline CI/CD có sẵn (không SSH tay)
 
> **Khác với lab gốc** (phải tự SSH vào VPS, `git pull`, `npm install`, `pm2 restart`): dự án RRMS đã có CI/CD tự động từ trước (Phần D) — chỉ cần `git push`, hệ thống tự build `.jar` mới (đã gồm Actuator) và tự restart `rrms-backend` trên VPS.
 
- [x] **4.1. Commit và push:**
  ```bash
  git add server/pom.xml server/src/main/resources/application.properties
  git commit -m "feat: expose Prometheus metrics via Micrometer + Actuator"
  git push
  ```
 
- [x] **4.2. Theo dõi tab Actions** trên GitHub — đợi workflow `Deploy` chạy xanh (~3-5 phút).
 
- [x] **4.3. Xác nhận nhận được tin nhắn Telegram** `✅ RRMS deploy THÀNH CÔNG`.
 
- [x] **4.4. SSH vào VPS, kiểm tra endpoint đã sống trên production:**
  ```bash
  ssh -p 24700 root@103.72.97.127
  curl -s http://127.0.0.1:7000/actuator/prometheus | head -5
  curl -s http://127.0.0.1:7000/actuator/health
  ```

### F5 — Xác nhận endpoint KHÔNG lộ ra internet
 
- [x] **5.1. Mở trình duyệt (hoặc `curl` từ máy local), gọi thẳng qua domain thật:**
  ```bash
  curl -s https://rrms.click/actuator/prometheus | head -5
  ```
  Phải trả về **HTML của trang React** (do Nginx `try_files` chuyển hướng SPA), **KHÔNG PHẢI** danh sách metrics — vì Nginx (Phần C) chỉ proxy đúng `/api/` về backend, các đường dẫn khác (bao gồm `/actuator/...`) rơi vào `location /` và bị trả về `index.html`.
 
  > Đây là lớp bảo vệ tương đương với lab gốc (`/metrics` của Express không lộ ra ngoài) — số liệu nội bộ hệ thống không bị công khai cho người lạ.
 
## Kết quả Phần F
 
Khi tất cả các mục trên đã tick `[x]`: backend RRMS đã công bố metrics chuẩn Prometheus tại `127.0.0.1:7000/actuator/prometheus` (chỉ gọi được từ chính VPS), việc đưa thay đổi lên production đã đi qua đúng pipeline CI/CD có sẵn — không cần thao tác thủ công nào trên VPS. Tiếp tục sang **Phần G — Kiểm tra Docker + đánh giá RAM/Disk**.