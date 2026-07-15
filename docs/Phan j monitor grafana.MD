# Phần J — Grafana: dashboard qua trình duyệt

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần H của lab Monitoring đã hoàn thành** (4 container đang chạy, Prometheus thấy đủ 2 target `up`).

## Checklist

### J1 — Mở đường Grafana qua Nginx (dùng lại file Nginx đã có từ Phần C của lab Deploy)

- [ ] **1.1. Mở file cấu hình Nginx đang dùng thật cho RRMS:**
  ```bash
  sudo nano /etc/nginx/sites-available/rrms
  ```

- [ ] **1.2. Tìm khối `server { listen 443 ssl; ... }`** (khối Certbot đã tạo ở Phần C lab Deploy) — dán thêm 2 `location` sau vào **bên trong** khối đó, cạnh các `location` cũ (`/`, `/api/`, `/uploads/`):
  ```nginx
      # ---- GRAFANA: dashboard giám sát (thêm mới) ----
      location /grafana/ {
          proxy_set_header Host $host;
          proxy_pass http://127.0.0.1:3001;
      }

      # WebSocket cho tính năng cập nhật realtime của Grafana
      location /grafana/api/live/ {
          proxy_set_header Host $host;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          proxy_pass http://127.0.0.1:3001;
      }
  ```
  > **Quan trọng**: phải dán vào đúng khối `listen 443 ssl` (khối HTTPS Certbot tạo), không phải khối `listen 80` — nếu dán nhầm, Grafana sẽ chỉ truy cập được qua HTTP không mã hoá hoặc bị lỗi redirect loop.

- [ ] **1.3. Kiểm tra cú pháp và reload:**
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```

### J2 — Đăng nhập Grafana + kết nối Prometheus

- [ ] **2.1. Mở trình duyệt:** `https://rrms.click/grafana`

- [ ] **2.2. Đăng nhập**: user `admin`, mật khẩu là giá trị `GF_SECURITY_ADMIN_PASSWORD` đã đặt ở Phần C.

- [ ] **2.3. Thêm data source**: Menu trái → **Connections** → **Data sources** → **Add data source** → chọn **Prometheus**.

- [ ] **2.4. Điền URL** (dùng tên service trong Docker Compose, **không phải `localhost`**):
  ```
  http://prometheus:9090
  ```

- [ ] **2.5. Bấm Save & test** → phải thấy thông báo xanh **"Successfully queried the Prometheus API"**.

### J3 — Dashboard máy chủ (Node Exporter Full)

- [ ] **3.1. Import dashboard có sẵn**: Menu trái → **Dashboards** → **New** → **Import**.

- [ ] **3.2. Ô "Import via grafana.com" gõ:** `1860` → **Load**.

- [ ] **3.3. Ở mục Prometheus cuối trang, chọn data source vừa tạo → Import.**

- [ ] **3.4. Xác nhận dashboard hiện CPU, RAM, disk, network của VPS theo thời gian thực** — để nguyên tab này, sẽ dùng lại ở Phần E khi diễn tập sự cố.

### J4 — Soi số liệu backend RRMS qua Explore (PromQL đã đổi theo Micrometer/Spring Boot)

> **Khác lab gốc**: `prom-client` (Node) đặt tên metric là `http_request_duration_seconds_*` và `process_resident_memory_bytes`. **Micrometer (Spring Boot)** đặt tên khác: `http_server_requests_seconds_*` và `jvm_memory_used_bytes`. Dùng đúng tên dưới đây, không copy nguyên PromQL từ lab MERN.

- [ ] **4.1. Mở Explore** (menu trái → **Explore**), dán từng dòng vào ô query, bấm **Run query**:

  **Số request/giây mà backend đang nhận:**
  ```promql
  rate(http_server_requests_seconds_count{application="rrms-backend"}[5m])
  ```

  **Độ trễ p95 — 95% request xử lý nhanh hơn X giây:**
  ```promql
  histogram_quantile(0.95, rate(http_server_requests_seconds_bucket{application="rrms-backend"}[5m]))
  ```

  **RAM heap mà JVM đang dùng (byte):**
  ```promql
  jvm_memory_used_bytes{application="rrms-backend",area="heap"}
  ```

- [ ] **4.2. Xác nhận middleware đo đúng** — mở `https://rrms.click`, bấm F5 vài lần / thử vài chức năng (đăng nhập, xem danh sách phòng...), rồi chạy lại query số 1 trong bước 4.1 — đường đồ thị request/giây phải nhích lên theo thao tác vừa làm.

## Kết quả Phần J

Khi tất cả các mục trên đã tick `[x]`: Grafana truy cập được qua `https://rrms.click/grafana` (HTTPS, qua Nginx), có dashboard máy chủ (Node Exporter Full) và đã xác nhận đọc được số liệu thật từ backend RRMS qua Explore. Tiếp tục sang **Phần K — Alert: hệ thống tự gọi bạn khi có sự cố**.