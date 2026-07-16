# Phần K — Alert: hệ thống tự gọi bạn khi có sự cố

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần J của lab Monitoring đã hoàn thành** (Grafana truy cập được, có dashboard, đọc được số liệu backend RRMS).

## Checklist

### K1 — Bot Telegram: tái sử dụng bot đã có, hoặc tạo bot riêng cho monitoring

Dự án RRMS đã có sẵn 1 bot Telegram tạo ở lab CI/CD (**RRMS Deploy**, dùng để báo deploy thành công/thất bại). Có 2 lựa chọn:

- [x] **Phương án A — Dùng lại bot cũ (nhanh):** dùng đúng `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` đã lưu từ trước (GitHub Secrets / lab CI-CD Telegram). Nhược điểm: tin nhắn "deploy thành công" và tin nhắn "cảnh báo CPU cao" sẽ lẫn vào cùng 1 khung chat.

- [ ] **Phương án B — Tạo bot riêng cho monitoring (không chọn lần này):**
  1. Mở Telegram → tìm `@BotFather` → **Start** → gõ `/newbot`
  2. Đặt tên hiển thị, ví dụ: `RRMS Monitor`
  3. Đặt username kết thúc bằng `bot`, ví dụ: `rrms_monitor_bot`
  4. Copy token BotFather trả về
  5. Bấm vào link bot vừa tạo → **Start** → gửi 1 tin nhắn bất kỳ (bắt buộc)
  6. Lấy `chat_id` bằng cách dán URL sau vào trình duyệt (thay token):
     ```
     https://api.telegram.org/bot<TOKEN_CUA_BAN>/getUpdates
     ```
     Tìm số ở `"chat":{"id": ...}`.
  7. Test bằng `curl.exe` (PowerShell) hoặc `curl` (VPS/Mac/Linux):
     ```bash
     curl -s -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" -d chat_id=<CHAT_ID> -d text="Xin chao tu he thong giam sat RRMS"
     ```

> Ghi rõ token + chat_id sẽ dùng (Phương án A hoặc B) để điền vào Bước E2. Đây là 2 giá trị nhạy cảm — chỉ điền trực tiếp vào file trên VPS, không dán vào chat AI.

### K2 — alertmanager.yml bản thật

- [x] **2.1. Mở lại file trên VPS:**
  ```bash
  nano /opt/monitoring/alertmanager/alertmanager.yml
  ```

- [x] **2.2. Xoá bản tạm, dán bản thật** (thay đúng token + chat_id đã chọn ở E1):
  ```yaml
  route:
    receiver: telegram
    group_by: ['alertname']
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 3h

  receivers:
    - name: telegram
      telegram_configs:
        - bot_token: 'DAN_TOKEN_VAO_DAY'
          chat_id: DAN_CHAT_ID_VAO_DAY
          parse_mode: 'HTML'
          send_resolved: true
  ```
  > `chat_id` là **số**, không bọc dấu nháy. `send_resolved: true` giúp bạn tự động nhận tin "đã hết sự cố" ✅, không chỉ mỗi tin báo lỗi.

### K3 — Viết 5 quy tắc cảnh báo (đã đổi tên job + lệnh khắc phục theo systemd)

- [x] **3.1. Mở lại file:**
  ```bash
  nano /opt/monitoring/prometheus/alert-rules.yml
  ```

- [x] **3.2. Xoá bản tạm, dán bản thật** (đã đổi `job="mern-api"` → `job="rrms-backend"`, lệnh khắc phục đổi từ `pm2` sang `systemctl`/`journalctl`, và điều chỉnh ngưỡng disk cho phù hợp VPS chỉ có 20GB):
  ```yaml
  groups:
    - name: canh-bao-he-thong
      rules:
        # 1) Backend chết — nghiêm trọng nhất, báo sau 1 phút
        - alert: APIDown
          expr: up{job="rrms-backend"} == 0
          for: 1m
          labels:
            severity: critical
          annotations:
            summary: "🔴 Backend RRMS không phản hồi"
            description: "Endpoint /actuator/prometheus đã chết hơn 1 phút. Vào VPS chạy: sudo systemctl status rrms-backend và sudo journalctl -u rrms-backend -n 50"

        # 2) Mất số liệu máy chủ (node-exporter chết / VPS sập)
        - alert: NodeExporterDown
          expr: up{job="node-exporter"} == 0
          for: 1m
          labels:
            severity: critical
          annotations:
            summary: "🔴 Mất tín hiệu giám sát máy chủ"
            description: "node-exporter không phản hồi hơn 1 phút — kiểm tra: cd /opt/monitoring && docker compose ps"

        # 3) CPU > 80% — rate[2m] + for:2m (rate[5m]+for:5m cần ~10 phút stress; timeout 420s sẽ không kịp FIRING)
        - alert: HighCPU
          expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
          for: 2m
          labels:
            severity: warning
          annotations:
            summary: "🟠 CPU đang ở mức {{ $value | printf \"%.0f\" }}%"
            description: "CPU vượt 80% liên tục 2 phút. Vào VPS chạy: htop xem process nào ngốn (backend Java, MySQL, hay build đang chạy)."

        # 4) RAM dùng > 85% liên tục 5 phút — VPS chỉ 2GB
        - alert: HighRAM
          expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 85
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "🟠 RAM đang ở mức {{ $value | printf \"%.0f\" }}%"
            description: "RAM vượt 85% liên tục 5 phút — nguy cơ backend/MySQL bị kill vì OOM. Kiểm tra: free -h và docker stats --no-stream"

        # 5) Ổ đĩa gốc còn dưới 20% — ngưỡng thấp hơn lab gốc vì disk chỉ có 20GB (không phải 40-80GB như VPS thông thường)
        - alert: DiskAlmostFull
          expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 80
          for: 10m
          labels:
            severity: warning
          annotations:
            summary: "🟠 Ổ đĩa đã dùng {{ $value | printf \"%.0f\" }}%"
            description: "Disk 20GB sắp đầy — dọn log/cache Docker hoặc nâng cấp. Kiểm tra: df -h và docker system prune -f"
  ```
  > **Lưu ý ngưỡng disk**: đổi từ `85%` (lab gốc) xuống `80%` vì VPS chỉ có 20GB tổng — 15% còn trống của 20GB chỉ là ~3GB, quá sát để phản ứng kịp; hạ ngưỡng xuống giúp cảnh báo sớm hơn một chút.

### K4 — Áp dụng cấu hình

- [x] **4.1. Restart 2 service liên quan** (Prometheus không tự đọc lại file khi sửa):
  ```bash
  cd /opt/monitoring
  docker compose restart prometheus alertmanager
  ```

- [x] **4.2. Kiểm tra Prometheus đã nạp đủ 5 quy tắc:**
  ```bash
  sleep 5
  curl -s localhost:9090/api/v1/rules | grep -o '"name":"[A-Za-z]*"'
  ```
  Phải thấy: `APIDown`, `NodeExporterDown`, `HighCPU`, `HighRAM`, `DiskAlmostFull`.

### K5 — DIỄN TẬP SỰ CỐ (fire drill) — bắt buộc, không được bỏ qua

> Hệ thống báo động chỉ đáng tin khi đã được thử. **Khác lab gốc dùng `pm2`, RRMS dùng `systemctl`.**

- [x] **5.1.** Diễn tập backend chết — Telegram nhận `APIDown` FIRING rồi `RESOLVED`.

- [x] **5.2.** Diễn tập CPU — Telegram nhận `HighCPU` FIRING (~100%) rồi `RESOLVED`.
  > **Lưu ý khi stress trên VPS 1 CPU / 2GB:** CPU 100% có thể làm backend Java không kịp trả lời scrape → Prometheus báo thêm `APIDown` tạm thời, rồi `RESOLVED` khi tải hạ. Đây là **phản ứng phụ bình thường**, không phải lỗi cấu hình.

- [x] **5.3.** Reboot VPS — tự sống lại, không cần thao tác tay:
  ```bash
  sudo reboot
  # Sau ~90 giây, SSH lại (lệnh phải chạy TRÊN VPS, không phải Windows CMD):
  ssh -p 24700 root@103.72.97.127
  sudo systemctl status rrms-backend nginx --no-pager
  cd /var/www/rrms && docker compose ps
  cd /opt/monitoring && docker compose ps
  ```
  **Kết quả thực tế (2026-07-16):**
  - `rrms-backend`: `active (running)`
  - `nginx`: `active (running)`
  - `rrms-mysql`, `rrms-redis`: `Up (healthy)` — không còn Elasticsearch (đã loại bỏ ở Phần B)
  - `prometheus`, `node-exporter`, `grafana`, `alertmanager`: `Up`
  - `curl 127.0.0.1:7000/actuator/prometheus` → `200` (trước reboot)

  Kiểm tra thêm trên trình duyệt: `https://rrms.click` và `https://rrms.click/grafana/` (dùng ẩn danh nếu cửa sổ thường còn 404 do PWA).

## Debug khi gặp lỗi

- **Target `rrms-backend` "down" ở Phần C, bước 4.2**: (a) backend chưa deploy bản có Actuator — kiểm tra `curl 127.0.0.1:7000/actuator/prometheus` trên VPS trước; (b) thiếu `extra_hosts: host-gateway` trong `docker-compose.yml` của `/opt/monitoring` — container không gọi được ra ngoài tới `host.docker.internal:7000`.
- **`docker compose up` báo "port is already allocated"**: cổng `3001`/`9090`/`9093`/`9100` bị process khác chiếm — `sudo ss -tlnp | grep 3001` rồi đổi cổng bên trái trong `docker-compose.yml`.
- **`https://rrms.click/grafana` trả 404 hoặc trắng trang**: quên `sudo systemctl reload nginx`, dán `location` vào nhầm server block (phải là khối `listen 443 ssl`), hoặc thiếu `GF_SERVER_ROOT_URL`/`GF_SERVER_SERVE_FROM_SUB_PATH` trong compose.
- **Data source báo "connection refused"**: URL phải là `http://prometheus:9090` (tên service trong mạng Docker của `/opt/monitoring`) — điền `localhost` là sai vì `localhost` của container Grafana là chính nó.
- **Telegram không nhận alert khi diễn tập**: xem log `docker compose logs alertmanager` — thường do token/chat_id sai; `chat_id` phải là số không bọc dấu nháy; và phải từng bấm Start với đúng bot.
- **Sửa `alert-rules.yml`/`alertmanager.yml` xong nhưng alert không đổi**: quên `docker compose restart prometheus alertmanager` — Prometheus không tự đọc lại file.
- **"permission denied ... docker.sock"**: thêm `sudo` trước lệnh `docker`, hoặc `sudo usermod -aG docker $USER` rồi SSH lại.
- **VPS chậm hẳn sau khi bật monitoring**: hết RAM — `free -h` kiểm tra; quay lại Phần B, đổi sang Phương án B (tắt tạm Elasticsearch) hoặc Phương án C (nâng cấp VPS).
- **Grafana quên mật khẩu admin**: `docker compose exec grafana grafana cli admin reset-admin-password MatKhauMoi123`.
- **`curl /actuator/prometheus` từ ngoài domain vẫn trả về metrics (không phải HTML React)**: kiểm tra lại Nginx `location /` có đúng `try_files $uri $uri/ /index.html;` không, và không có `location` nào khác vô tình proxy `/actuator/` ra ngoài.

**Điểm mấu chốt cần nhớ**: monitoring trả lời câu hỏi "hệ thống ĐANG thế nào" (dashboard — nhìn khi bạn muốn), alerting trả lời "KHI NÀO tôi cần can thiệp" (Telegram — gọi bạn khi cần). Chuỗi giá trị: backend tự công bố `/actuator/prometheus` → Prometheus thu thập → Grafana trực quan hoá → Alertmanager cảnh báo. Vì VPS chỉ có 2GB RAM/20GB disk, mọi cấu hình trong lab này đều đã **chủ động giới hạn tài nguyên** (`mem_limit`, retention Prometheus, ngưỡng disk hạ thấp) — khác lab gốc chạy trên VPS rộng rãi hơn.

## Tiêu chí đạt (toàn bộ lab Monitoring)

- [x] Endpoint `/actuator/prometheus` trả Micrometer; không lộ ra internet qua domain (`https://rrms.click/actuator/prometheus` → HTML React).
- [x] 4 container monitoring đều `Up`; cổng chỉ bind `127.0.0.1`.
- [x] Prometheus thấy 2 target `up` (`node-exporter`, `rrms-backend`).
- [x] Grafana qua `https://rrms.click/grafana/`, dashboard Node Exporter Full, Explore đọc metric backend.
- [x] Diễn tập `APIDown`: FIRING → RESOLVED qua Telegram.
- [x] Diễn tập `HighCPU`: dashboard vọt lên → FIRING → RESOLVED qua Telegram.
- [x] Reboot VPS → backend, nginx, mysql/redis, monitoring tự sống lại.
- [x] Phương án RAM: đã loại bỏ Elasticsearch, giới hạn `mem_limit` monitoring (Phần B/G).

## Bài tập

Thực hiện: cài đặt monitoring (Prometheus + Grafana) và alert Telegram cho hệ thống RRMS (Spring Boot + MySQL) đang chạy trên VPS.

Nộp:
1. Link repo GitHub có commit thêm Actuator/Micrometer vào `pom.xml`/`application.properties`, đã deploy qua CI/CD (không SSH tay).
2. Screenshot dashboard **Node Exporter Full** và query PromQL request/giây của backend RRMS.
3. Video demo diễn tập sự cố: `sudo systemctl stop rrms-backend` → nhận Telegram `FIRING` → `sudo systemctl start rrms-backend` → nhận `RESOLVED`; kèm cảnh dashboard CPU vọt lên khi chạy `stress`.