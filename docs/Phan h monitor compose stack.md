# Phần H — Dựng bộ Prometheus + node-exporter + Grafana + Alertmanager

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần G của lab Monitoring đã hoàn thành** (đã quyết định phương án RAM, thư mục `/opt/monitoring` đã sẵn sàng).

## Checklist

### H1 — docker-compose.yml (khai báo 4 service, đã tối ưu cho VPS 2GB RAM / 20GB disk)

- [x] **1.1. Tạo file** `/opt/monitoring/docker-compose.yml`
  → Đã tạo trong repo (`monitoring/docker-compose.yml`), push GitHub, `git pull` + `cp` vào `/opt/monitoring` trên VPS thành công. Xác nhận bằng `docker compose config` — parse hợp lệ, `mem_limit` áp đúng cho 4 service (prometheus 384MB, node-exporter 64MB, grafana 256MB, alertmanager 64MB), mật khẩu Grafana đã đổi từ mẫu sang `Rrms2026_Monitor!` qua file `.env`.

### H2 — prometheus.yml (lấy số liệu từ đâu — đã đổi sang backend Spring Boot)

- [x] **2.1. Tạo file** `/opt/monitoring/prometheus/prometheus.yml`
  → Đã có trên VPS, job `rrms-backend` trỏ đúng `host.docker.internal:7000`, path `/actuator/prometheus`.

### H3 — Tạo 2 file cấu hình tạm (Phần K sẽ thay bằng bản thật)

- [x] **3.1. Tạo `alert-rules.yml` bản tạm** — đã có trên VPS.
- [x] **3.2. Tạo `alertmanager.yml` bản tạm** — đã có trên VPS.

### H4 — Khởi động stack + kiểm tra

- [x] **4.1. Khởi động cả 4 service:**
  ```bash
  cd /opt/monitoring
  docker compose up -d
  docker compose ps
  ```
  **Kết quả thực tế:** cả 4 image đã pull xong, cả 4 container `Up`:
  ```
  alertmanager    Up   127.0.0.1:9093->9093/tcp
  grafana         Up   127.0.0.1:3001->3000/tcp
  node-exporter   Up   127.0.0.1:9100->9100/tcp
  prometheus      Up   127.0.0.1:9090->9090/tcp
  ```

- [ ] **4.2. Kiểm tra Prometheus đã "nhìn thấy" cả 2 nguồn số liệu** — ⚠️ **CHƯA ĐẠT, đang debug:**
  ```bash
  sleep 20
  curl -s localhost:9090/api/v1/targets | grep -o '"health":"[a-z]*"'
  ```
  **Kết quả lần đầu:**
  ```
  "health":"up"      ← node-exporter
  "health":"down"    ← rrms-backend
  ```

  **Quá trình debug đã thực hiện:**

  1. `curl http://127.0.0.1:7000/actuator/prometheus` trên VPS → trả về `{"code":401,"message":"Unauthenticated"}` — backend có chạy (`ss -tlnp` xác nhận Java đang nghe `*:7000`), nhưng bị Spring Security chặn.
  2. `docker exec prometheus wget ... host.docker.internal:7000/...` → ban đầu **bị treo/timeout** (`context deadline exceeded`) — nguyên nhân: **UFW chặn traffic từ Docker bridge network vào port 7000** (UFW ban đầu chỉ mở `Nginx Full`, `OpenSSH`, `24700/tcp`, không có rule cho 7000).
  3. Tìm subnet Docker: `docker network inspect monitoring_default` → `Subnet: 172.19.0.0/16`.
  4. Mở firewall cho đúng subnet đó (không mở toàn bộ ra internet):
     ```bash
     sudo ufw allow from 172.19.0.0/16 to any port 7000 proto tcp
     sudo ufw reload
     ```
     → Đã áp dụng thành công, `ufw status` xác nhận rule `7000/tcp ALLOW 172.19.0.0/16`.
  5. Test lại: `docker exec prometheus wget -qO- --timeout=5 http://host.docker.internal:7000/actuator/prometheus`
     → **Không còn treo nữa** (xác nhận vấn đề mạng đã fix), nhưng trả về `HTTP/1.1 401` — đúng như dự đoán, vấn đề còn lại thuần là **Spring Security chặn endpoint**, không liên quan tới mạng/Docker/firewall nữa.

  **⏳ Việc cần làm tiếp để hoàn thành mục này:**
  - Sửa Spring Security config trong code backend (`SecurityConfig.java` hoặc tương đương) để `permitAll()` riêng cho `/actuator/health` và `/actuator/prometheus` (không mở toàn bộ `/actuator/**` để tránh lộ endpoint nhạy cảm như `/actuator/env`).
  - Build lại, deploy backend (qua CI/CD hoặc restart service thủ công).
  - Chạy lại `curl http://127.0.0.1:7000/actuator/prometheus` trên VPS → phải thấy dữ liệu metrics (dạng `# HELP jvm_...`) thay vì lỗi 401.
  - Chạy lại `curl -s localhost:9090/api/v1/targets | grep -o '"health":"[a-z]*"'` → phải thấy **2 dòng `"health":"up"`**.
  - Khi đạt, tick `[x]` mục 4.2.

- [x] **4.3. Kiểm tra RAM thực tế sau khi bật cả bộ giám sát** (đối chiếu với ước tính ở Phần G):
  ```bash
  free -h
  docker stats --no-stream
  ```
  **Kết quả thực tế:**
  ```
  Mem:   1.9Gi total | 967Mi used | 84Mi free | 4.0Mi shared | 911Mi buff/cache | 821Mi available
  Swap:  2.0Gi total | 573Mi used | 1.4Gi free
  ```

  | Container | MEM USAGE / LIMIT | MEM % |
  |---|---|---|
  | prometheus | 60.5 MiB / 384 MiB | 15.77% |
  | grafana | 145.6 MiB / 256 MiB | 56.87% |
  | alertmanager | 32.0 MiB / 64 MiB | 49.98% |
  | node-exporter | 12.6 MiB / 64 MiB | 19.75% |
  | rrms-redis | 5.0 MiB / 1.918 GiB | 0.25% |
  | rrms-mysql | 154.7 MiB / 1.918 GiB | 7.87% |

  **So với baseline Phần G (sau khi tắt Elasticsearch, trước khi bật giám sát):** available giảm từ **912Mi → 821Mi** (giảm ~91MB), swap tăng nhẹ từ 487Mi → 573Mi. Mức tiêu thụ nằm trong dự tính ban đầu (~500-700MB cho 4 container), **chưa cần lo lắng** — RAM available vẫn còn dư dả, không cần quay lại đổi phương án ở Phần G.

  > Sẽ đo lại RAM một lần nữa sau khi target `rrms-backend` lên `up` — vì lúc đó Prometheus sẽ bắt đầu ghi thêm time-series từ backend, có thể tăng nhẹ RAM/disk theo thời gian.

## Kết quả Phần H — HIỆN TẠI

| Mục | Trạng thái |
|---|---|
| H1 (docker-compose.yml) | ✅ Hoàn thành |
| H2 (prometheus.yml) | ✅ Hoàn thành |
| H3 (2 file cấu hình tạm) | ✅ Hoàn thành |
| H4.1 (khởi động 4 container) | ✅ Hoàn thành — cả 4 `Up`, chỉ bind `127.0.0.1` |
| H4.2 (Prometheus thấy đủ 2 target `up`) | ❌ **Chưa đạt** — node-exporter `up`, rrms-backend `down` do Spring Security chặn `/actuator/prometheus` (đã loại trừ nguyên nhân mạng/firewall) |
| H4.3 (kiểm tra RAM) | ✅ Hoàn thành — RAM còn an toàn, available 821Mi |

**⚠️ Phần H chưa đóng hoàn toàn.** Việc còn lại duy nhất trước khi sang Phần J:

1. Mở endpoint `/actuator/prometheus` (và `/actuator/health`) trong Spring Security config — `permitAll()`, không yêu cầu xác thực.
2. Build + deploy lại backend.
3. Xác nhận `curl 127.0.0.1:7000/actuator/prometheus` trả metrics thay vì 401.
4. Xác nhận Prometheus targets đều `up`.
5. Tick `[x]` H4.2, đóng Phần H.

Sau khi H4.2 đạt → tiếp tục sang **Phần J — Grafana: dashboard qua Nginx**.