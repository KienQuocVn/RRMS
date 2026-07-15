# Phần J — Grafana: dashboard qua trình duyệt

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần H của lab Monitoring đã hoàn thành** (4 container đang chạy, Prometheus thấy đủ 2 target `up`).

## Checklist

### J1 — Mở đường Grafana qua Nginx (dùng lại file Nginx đã có từ Phần C của lab Deploy)

- [x] **1.1. Mở file cấu hình Nginx đang dùng thật cho RRMS** (`/etc/nginx/sites-available/rrms`, symlink từ `sites-enabled`).

- [x] **1.2. Thêm 2 `location` Grafana** vào khối `listen 443 ssl` (cạnh `/`, API, `/uploads/`):
  ```nginx
      # ---- 4) GRAFANA: dashboard giám sát ----
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

- [x] **1.3. Kiểm tra cú pháp và reload** — `nginx -t` OK, `systemctl reload nginx` OK.

- [x] **1.4. Xác nhận Nginx proxy đúng tới Grafana:**
  - DNS `rrms.click` = IP VPS `103.72.97.127`
  - `curl -sI https://rrms.click/grafana/` → `302` + `Location: /grafana/login`
  - Grafana local `:3001` cũng `302` → `/grafana/login`

  > **Lưu ý PWA / cửa sổ thường vs ẩn danh:** Frontend RRMS dùng Vite PWA (Workbox). Service Worker đã đăng ký trên origin `rrms.click` có thể bắt navigation tới `/grafana/` và trả shell React → hiện **404 RRMS** dù Nginx đã đúng. Cửa sổ ẩn danh không có SW nên vào Grafana bình thường. Cách gỡ trên cửa sổ thường: xem mục [Xử lý 404 chỉ ở cửa sổ thường](#xử-lý-404-chỉ-ở-cửa-sổ-thường) bên dưới. Đã thêm `navigateFallbackDenylist` cho `/grafana` trong `client/vite.config.js` (có hiệu lực sau lần build/deploy frontend tiếp theo).

### J2 — Đăng nhập Grafana + kết nối Prometheus

- [x] **2.1.** Mở `https://rrms.click/grafana/` (nên dùng ẩn danh nếu cửa sổ thường còn 404 do SW).
- [x] **2.2.** Đăng nhập `admin` / mật khẩu trong `/opt/monitoring/.env` (`Rrms2026_Monitor!`).
- [x] **2.3–2.5.** Thêm data source Prometheus URL `http://prometheus:9090` → Save & test thành công.

### J3 — Dashboard máy chủ (Node Exporter Full)

- [x] **3.1–3.4.** Import dashboard `1860` (Node Exporter Full), chọn data source prometheus — hiện CPU/RAM/disk/network VPS (Job `node-exporter`, Instance `node-exporter:9100`).

### J4 — Soi số liệu backend RRMS qua Explore (PromQL đã đổi theo Micrometer/Spring Boot)

> **Khác lab gốc**: Micrometer (Spring Boot) dùng `http_server_requests_seconds_*` và `jvm_memory_used_bytes`.

- [x] **4.1.** Explore đọc được metric backend (`http_server_requests_seconds_count`, ứng dụng `rrms-backend`, instance `host.docker.internal:7000`) — có traffic scrape `/actuator/prometheus` và các API (`/authen/login`, `/api/v1/search`, …).
- [x] **4.2.** Xác nhận số liệu phản ánh request thật từ backend.

## Xử lý 404 chỉ ở cửa sổ thường

Nginx **không lỗi**. Trên Chrome/Edge cửa sổ thường:

1. Mở `https://rrms.click` (trang chủ RRMS).
2. F12 → tab **Application** → **Storage** → bấm **Clear site data** (hoặc **Service Workers** → **Unregister**).
3. Đóng tab, mở lại (không cần ẩn danh): `https://rrms.click/grafana/`

Sau khi deploy frontend có `navigateFallbackDenylist` cho `/grafana`, SW mới sẽ không còn “nuốt” đường dẫn này.

## Kết quả Phần J

**Phần J đã hoàn thành:** Grafana qua `https://rrms.click/grafana/` (HTTPS, Nginx), dashboard Node Exporter Full, Explore đọc được metric Micrometer từ backend RRMS. Tiếp tục sang **Phần K — Alert: hệ thống tự gọi bạn khi có sự cố**.
