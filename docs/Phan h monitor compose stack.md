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

- [x] **4.2. Kiểm tra Prometheus đã "nhìn thấy" cả 2 nguồn số liệu:**
  ```bash
  sleep 20
  curl -s localhost:9090/api/v1/targets | grep -o '"health":"[a-z]*"'
  ```
  **Kết quả cuối cùng (đã đạt):**
  ```
  "health":"up"
  "health":"up"
  ```
  → Cả `node-exporter` và `rrms-backend` đều `up`.

  **Quá trình debug đã thực hiện (lưu lại để tham khảo):**

  1. Lần đầu: `node-exporter` = `up`, `rrms-backend` = `down`.
  2. `curl http://127.0.0.1:7000/actuator/prometheus` trên VPS → trả về `{"code":401,"message":"Unauthenticated"}` — backend có chạy, nhưng bị Spring Security chặn.
  3. `docker exec prometheus wget ... host.docker.internal:7000/...` → ban đầu **bị treo/timeout** — nguyên nhân: **UFW chặn traffic từ Docker bridge vào port 7000**.
  4. Tìm subnet Docker: `docker network inspect monitoring_default` → `Subnet: 172.19.0.0/16`.
  5. Mở firewall cho đúng subnet (không mở toàn bộ ra internet):
     ```bash
     sudo ufw allow from 172.19.0.0/16 to any port 7000 proto tcp
     sudo ufw reload
     ```
  6. Sau khi mở UFW: mạng OK nhưng vẫn `401` → cần `permitAll()` cho `/actuator/health` và `/actuator/prometheus` trong Spring Security, rồi build + deploy lại backend.
  7. Sau khi sửa Security + deploy: Prometheus scrape được metrics → **2 dòng `"health":"up"`**.

- [x] **4.3. Kiểm tra RAM thực tế sau khi bật cả bộ giám sát** (đối chiếu với ước tính ở Phần G):
  ```bash
  free -h
  docker stats --no-stream
  ```
  **Kết quả thực tế (lúc khởi động stack, trước khi target backend lên `up`):**
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

  **So với baseline Phần G (sau khi tắt Elasticsearch, trước khi bật giám sát):** available giảm từ **912Mi → 821Mi** (giảm ~91MB), swap tăng nhẹ từ 487Mi → 573Mi. Mức tiêu thụ nằm trong dự tính ban đầu (~500-700MB cho 4 container), **chưa cần lo lắng** — RAM available vẫn còn dư dả.

## Kết quả Phần H

| Mục | Trạng thái |
|---|---|
| H1 (docker-compose.yml) | ✅ Hoàn thành |
| H2 (prometheus.yml) | ✅ Hoàn thành |
| H3 (2 file cấu hình tạm) | ✅ Hoàn thành |
| H4.1 (khởi động 4 container) | ✅ Hoàn thành — cả 4 `Up`, chỉ bind `127.0.0.1` |
| H4.2 (Prometheus thấy đủ 2 target `up`) | ✅ Hoàn thành — `node-exporter` + `rrms-backend` đều `up` |
| H4.3 (kiểm tra RAM) | ✅ Hoàn thành — RAM còn an toàn, available 821Mi |

**Phần H đã đóng.** Tiếp tục sang **Phần J — Grafana: dashboard qua Nginx** ([`Phan j monitor grafana.MD`](./Phan%20j%20monitor%20grafana.MD)).
