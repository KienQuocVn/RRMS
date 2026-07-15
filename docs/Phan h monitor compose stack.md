# Phần H — Dựng bộ Prometheus + node-exporter + Grafana + Alertmanager

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần G của lab Monitoring đã hoàn thành** (đã quyết định phương án RAM, thư mục `/opt/monitoring` đã sẵn sàng).

## Checklist

### H1 — docker-compose.yml (khai báo 4 service, đã tối ưu cho VPS 2GB RAM / 20GB disk)

- [x] **1.1. Tạo file** `/opt/monitoring/docker-compose.yml`:
  ```bash
  nano /opt/monitoring/docker-compose.yml
  ```
  Dán nội dung sau — **nhớ đổi mật khẩu Grafana ở dòng có ghi chú**:
  ```yaml
  services:
    # ---- Bộ não: thu thập & lưu trữ metrics ----
    prometheus:
      image: prom/prometheus:v2.53.0
      container_name: prometheus
      restart: unless-stopped
      volumes:
        - ./prometheus:/etc/prometheus
        - prometheus-data:/prometheus
      command:
        - --config.file=/etc/prometheus/prometheus.yml
        - --storage.tsdb.retention.time=7d      # disk chỉ 20GB — giữ dữ liệu tối đa 7 ngày
        - --storage.tsdb.retention.size=512MB    # chặn cứng dung lượng, tránh disk đầy
      mem_limit: 384m
      ports:
        - "127.0.0.1:9090:9090"      # chỉ nghe nội bộ, KHÔNG mở ra internet
      extra_hosts:
        - "host.docker.internal:host-gateway"    # để container gọi được backend :7000 trên VPS
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

    # ---- Mắt trên máy chủ: CPU, RAM, disk, network ----
    node-exporter:
      image: prom/node-exporter:v1.8.1
      container_name: node-exporter
      restart: unless-stopped
      pid: host
      volumes:
        - /:/host:ro,rslave
      command:
        - --path.rootfs=/host
      mem_limit: 64m
      ports:
        - "127.0.0.1:9100:9100"
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

    # ---- Màn hình: vẽ dashboard ----
    grafana:
      image: grafana/grafana:11.1.0
      container_name: grafana
      restart: unless-stopped
      volumes:
        - grafana-data:/var/lib/grafana
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=DoiMatKhauNay!2026   # ← ĐỔI mật khẩu
        - GF_SERVER_ROOT_URL=https://rrms.click/grafana
        - GF_SERVER_SERVE_FROM_SUB_PATH=true
      mem_limit: 256m
      ports:
        - "127.0.0.1:3001:3000"      # 3001 vì cổng 3000 dễ đụng process khác
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

    # ---- Loa báo động: nhận alert từ Prometheus, gửi Telegram ----
    alertmanager:
      image: prom/alertmanager:v0.27.0
      container_name: alertmanager
      restart: unless-stopped
      volumes:
        - ./alertmanager:/etc/alertmanager
      command:
        - --config.file=/etc/alertmanager/alertmanager.yml
      mem_limit: 64m
      ports:
        - "127.0.0.1:9093:9093"
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

  volumes:
    prometheus-data:
    grafana-data:
  ```
  > **`mem_limit` trên từng service** và **retention giới hạn của Prometheus** là 2 điểm khác biệt so với lab gốc — cần thiết vì VPS chỉ có 2GB RAM/20GB disk, phải chủ động khống chế thay vì để mặc định (mặc định Prometheus giữ dữ liệu 15 ngày, không giới hạn dung lượng — dễ ăn hết disk 20GB vốn đã chia sẻ với MySQL/Elasticsearch/code build).

### H2 — prometheus.yml (lấy số liệu từ đâu — đã đổi sang backend Spring Boot)

- [x] **2.1. Tạo file** `/opt/monitoring/prometheus/prometheus.yml`:
  ```bash
  nano /opt/monitoring/prometheus/prometheus.yml
  ```
  ```yaml
  global:
    scrape_interval: 15s
    evaluation_interval: 15s

  rule_files:
    - alert-rules.yml

  alerting:
    alertmanagers:
      - static_configs:
          - targets: ['alertmanager:9093']

  scrape_configs:
    - job_name: 'node-exporter'                    # sức khoẻ máy chủ VPS
      static_configs:
        - targets: ['node-exporter:9100']

    - job_name: 'rrms-backend'                      # sức khoẻ backend Spring Boot
      metrics_path: '/actuator/prometheus'          # khác mặc định /metrics — Spring Boot Actuator dùng path này
      static_configs:
        - targets: ['host.docker.internal:7000']    # backend chạy NGOÀI Docker (systemd), trên VPS
  ```
  > **Khác lab gốc**: job đổi tên từ `mern-api` thành `rrms-backend`, port đổi từ `5000` thành `7000`, và bắt buộc thêm dòng `metrics_path: '/actuator/prometheus'` — vì Spring Boot Actuator không dùng đường dẫn mặc định `/metrics` như `prom-client`.

### H3 — Tạo 2 file cấu hình tạm (Phần K sẽ thay bằng bản thật)

- [x] **3.1. Tạo `alert-rules.yml` bản tạm:**
  ```bash
  nano /opt/monitoring/prometheus/alert-rules.yml
  ```
  ```yaml
  groups: []
  ```

- [x] **3.2. Tạo `alertmanager.yml` bản tạm:**
  ```bash
  nano /opt/monitoring/alertmanager/alertmanager.yml
  ```
  ```yaml
  route:
    receiver: 'tam-thoi'
  receivers:
    - name: 'tam-thoi'
  ```

### H4 — Khởi động stack + kiểm tra

- [ ] **4.1. Khởi động cả 4 service:**
  ```bash
  cd /opt/monitoring
  docker compose up -d
  docker compose ps
  ```
  Cả 4 dòng phải có `STATUS = Up`: `prometheus`, `node-exporter`, `grafana`, `alertmanager`.

- [ ] **4.2. Kiểm tra Prometheus đã "nhìn thấy" cả 2 nguồn số liệu:**
  ```bash
  sleep 20
  curl -s localhost:9090/api/v1/targets | grep -o '"health":"[a-z]*"'
  ```
  Phải thấy đúng 2 dòng `"health":"up"` (node-exporter và rrms-backend). Nếu có `"down"` → xem mục Debug ở Phần E.

- [ ] **4.3. Kiểm tra RAM thực tế sau khi bật cả bộ giám sát** (đối chiếu với ước tính ở Phần G):
  ```bash
  free -h
  docker stats --no-stream
  ```
  Nếu `free -h` cho thấy RAM khả dụng (`available`) gần về 0 hoặc swap dùng nhiều ngay cả lúc hệ thống rảnh → quay lại Phần G, cân nhắc đổi sang Phương án B (tắt Elasticsearch tạm thời).

## Kết quả Phần H

Khi tất cả các mục trên đã tick `[x]`: cả 4 container giám sát đang chạy ổn định, chỉ bind `127.0.0.1` (không lộ ra internet), Prometheus đã thu thập được số liệu từ cả VPS (node-exporter) lẫn backend RRMS. Tiếp tục sang **Phần J — Grafana: dashboard qua Nginx**.
