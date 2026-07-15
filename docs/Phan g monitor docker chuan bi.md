# Phần G — Kiểm tra Docker + đánh giá RAM/Disk trước khi thêm giám sát

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần F của lab Monitoring đã hoàn thành** (backend đã công bố `/actuator/prometheus`, đã deploy qua CI/CD).

## Khác biệt so với lab gốc

*Dự án RRMS đã có Docker + Docker Compose từ Phần B của lab Deploy chính** (`Phan_B_VPS_Setup.md`) — dùng để chạy `mysql`, `redis`, `elasticsearch`. Không cần cài lại. Swap 2GB cũng đã tạo sẵn. Phần này chỉ cần **xác nhận lại** và — quan trọng hơn — **đánh giá xem VPS còn đủ tài nguyên để thêm 4 container giám sát hay không**, vì VPS chỉ có cấu hình khiêm tốn (1 Core / 2GB RAM / 20GB disk).

## Checklist

### G1 — Xác nhận Docker đã sẵn sàng

- [x] **1.1. SSH vào VPS:**
  ```bash
  ssh -p 24700 root@103.72.97.127
  ```
  → Đã SSH thành công vào VPS (`root@cloud`).

- [x] **1.2. Kiểm tra Docker + Compose:**
  ```bash
  docker version
  docker compose version
  ```
  **Kết quả thực tế:**
  ```
  Docker Engine - Community: v29.6.1 (Client & Server), API 1.55
  containerd: v2.2.6
  runc: 1.3.6
  Docker Compose: v5.3.1
  ```
  → Docker + Compose đã cài đặt, chạy tốt.

- [x] **1.3. Kiểm tra swap đã có (tạo từ Phần B lab Deploy):**
  ```bash
  free -h
  # Phải thấy dòng Swap: 2.0Gi
  ```
  **Kết quả thực tế:** `Swap: 2.0Gi total | 898Mi used | 1.1Gi free` → có swap 2.0Gi như dự kiến, nhưng **đã dùng tới ~45%** ngay cả trước khi thêm giám sát.

### G2 — ⚠️ Đánh giá RAM/Disk hiện tại — bắt buộc đọc trước khi tiếp tục

- [x] **2.1. Xem RAM/disk đang dùng:**
  ```bash
  free -h
  df -h /
  docker stats --no-stream
  ```

**Số liệu thực tế đo được — TRƯỚC khi tắt Elasticsearch (thay cho bảng ước tính ban đầu):**

```
Mem:   1.9Gi total | 1.3Gi used | 101Mi free | 4.0Mi shared | 577Mi buff/cache | 513Mi available
Swap:  2.0Gi total | 898Mi used | 1.1Gi free

Disk (/): 20G total | 13G used | 7.4G avail | 64% used
```

| Container | CPU % | MEM USAGE / LIMIT | MEM % |
|---|---|---|---|
| rrms-redis | 0.95% | 5.0 MiB / 1.918 GiB | 0.25% |
| rrms-mysql | 0.67% | 174.6 MiB / 1.918 GiB | 8.89% |
| rrms-elasticsearch | 0.26% | 416.5 MiB / 1 GiB | 40.68% |

→ Tổng RAM 3 container: **~596 MB**. Phần chênh lệch với `used = 1.3Gi` (~735MB) là do Backend Spring Boot (systemd) + Nginx + hệ điều hành chạy ngoài Docker.

**⚠️ Đánh giá tại thời điểm đó — nghiêm trọng hơn dự tính ban đầu trong checklist:**

1. Swap đã dùng 898Mi (45%) dù chưa thêm container giám sát nào.
2. RAM available chỉ còn 513Mi, gần như không có vùng đệm cho ~500-700MB mà Phần H cần thêm.
3. Disk còn 7.4G/20G (64% đã dùng) — tạm ổn, cần theo dõi khi Prometheus ghi time-series liên tục.

### G3 — Chọn 1 trong 3 phương án trước khi tiếp tục (bắt buộc quyết định)

- [ ] Phương án A — Chấp nhận dùng swap nhiều hơn.

- [x] **Phương án B — Tạm tắt Elasticsearch trong lúc chạy demo monitoring** ✅ **ĐÃ CHỌN VÀ THỰC HIỆN:**
  ```bash
  cd /var/www/rrms
  docker compose stop elasticsearch
  ```
  **Kết quả:** `rrms-elasticsearch` đã Stop thành công. Chỉ còn `rrms-redis` và `rrms-mysql` chạy.
  Bật lại khi cần: `docker compose start elasticsearch`

> **Phương án đã chọn: B — Tạm tắt Elasticsearch**

**Số liệu thực tế đo được — SAU khi tắt Elasticsearch:**

```
Mem:   1.9Gi total | 886Mi used | 513Mi free | 4.0Mi shared | 564Mi buff/cache | 912Mi available
Swap:  2.0Gi total | 487Mi used | 1.5Gi free
```

| Container | CPU % | MEM USAGE / LIMIT | MEM % |
|---|---|---|---|
| rrms-redis | 0.79-2.50% | ~4.9 MiB / 1.918 GiB | 0.25% |
| rrms-mysql | 1.29-2.40% | ~172-174 MiB / 1.918 GiB | 8.75-8.86% |

**So sánh trước/sau:**

| Chỉ số | Trước (có Elasticsearch) | Sau (đã tắt) | Chênh lệch |
|---|---|---|---|
| RAM used | 1.3Gi | 886Mi | giảm ~440MB |
| RAM available | 513Mi | **912Mi** | **tăng ~400MB** |
| Swap used | 898Mi (45%) | 487Mi (24%) | giảm ~411MB |
| Swap free | 1.1Gi | 1.5Gi | tăng ~400MB |

→ Đúng như dự đoán: giải phóng ~400-440MB RAM thật, swap cũng giảm áp lực đáng kể (từ 45% xuống 24%). Với **available = 912Mi**, dư địa cho 4 container giám sát (~500-700MB ước tính ở Phần H) giờ đã thoải mái hơn nhiều so với trước (513Mi).

### G4 — Tạo cây thư mục cấu hình

- [x] **4.1. Tạo thư mục:**
  ```bash
  sudo mkdir -p /opt/monitoring/{prometheus,alertmanager}
  sudo chown -R $USER:$USER /opt/monitoring
  cd /opt/monitoring
  ```
  → Đã tạo thành công. (Lưu ý: do đang đăng nhập bằng `root`, quyền sở hữu thư mục vẫn hiển thị `root:root` — không ảnh hưởng vì thao tác tiếp theo cũng chạy bằng root.)

- [x] **4.2. Xác nhận cấu trúc:**
  ```bash
  ls -la /opt/monitoring
  ```
  **Kết quả thực tế:**
  ```
  drwxr-xr-x 4 root root 44 Jul 15 19:48 .
  drwxr-xr-x 4 root root 42 Jul 15 19:48 ..
  drwxr-xr-x 2 root root  6 Jul 15 19:48 alertmanager
  drwxr-xr-x 2 root root  6 Jul 15 19:48 prometheus
  ```
  → Đúng 2 thư mục con `prometheus/` và `alertmanager/` đã sẵn sàng.

## Kết quả Phần G

Toàn bộ 4 mục đã hoàn thành:

- **G1** — Docker 29.6.1 + Compose v5.3.1 + swap 2.0Gi đều sẵn sàng.
- **G2** — Đã đo số liệu RAM/disk thật, phát hiện swap đã dùng 45% từ trước khi thêm giám sát (nghiêm trọng hơn ước tính ban đầu).
- **G3** — Đã chọn **Phương án B**, tắt Elasticsearch, xác nhận giải phóng thành công **~400MB RAM** (available từ 513Mi → 912Mi, swap từ 45% → 24%).
- **G4** — Cây thư mục `/opt/monitoring/{prometheus,alertmanager}` đã tạo xong, tách biệt với `/var/www/rrms`.

**Trạng thái tài nguyên hiện tại trước khi bước vào Phần H:** RAM available 912Mi, swap free 1.5Gi, disk 7.4G trống — đủ dư địa để triển khai 4 container giám sát (~500-700MB ước tính).

Tiếp tục sang **Phần H — Dựng bộ Prometheus + node-exporter + Grafana + Alertmanager**.