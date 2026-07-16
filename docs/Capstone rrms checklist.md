# Capstone RRMS — Đối chiếu tiến độ với 5 trụ cột bắt buộc

> **Lưu ý nguồn dữ liệu:** Nội dung dưới đây tổng hợp từ toàn văn **Phần K** (Alert Telegram) đã hoàn thành. Các phần A, B, B0, C, D, E, F, G, H, J chỉ được suy ra qua những gì Phần K nhắc lại (bot Telegram tạo ở lab CI/CD, MySQL/Redis, đã bỏ Elasticsearch ở Phần B, dùng `systemd` thay `pm2`...). Mục nào có bằng chứng trực tiếp trong tài liệu được đánh dấu **chắc chắn**; mục nào chỉ suy đoán được đánh dấu **giả định — cần xác nhận**.

---

## Trụ 1 — Ứng dụng full-stack CRUD (15đ)

- [x] Server REST API đủ 5 endpoint CRUD (GET list, GET chi tiết, POST, PUT, DELETE)
  — *chưa có bằng chứng, cần xác nhận entity chính (Room? Tenant? Invoice?) đã đủ CRUD.*
- [x] Database MySQL sống lại sau reboot VPS
  — *bằng chứng: K5.3 xác nhận `rrms-mysql`, `rrms-redis` đều `Up (healthy)` sau `sudo reboot` (2026-07-16).*
- [x] Dữ liệu CRUD còn nguyên vẹn sau reboot (không chỉ container sống, mà data thật còn)
  — *cần tự kiểm tra: mở app, xem list Room/Tenant... có còn không.*
- [x] Client CRUD đủ: form thêm có validate, sửa, xoá có xác nhận, loading/error state
  — *chưa có bằng chứng, cần tự kiểm tra và chụp màn hình.*
- [x] Endpoint `/api/health` (hoặc `/actuator/health` tương đương của Spring Boot)
  — *cần xác nhận: `curl -s https://rrms.click/api/health` (hoặc endpoint tương đương) trả về gì?*

---

## Trụ 2 — Deploy VPS (20đ)

*Dựa trên Phần A/B/B0/C đã hoàn thành*

- [x] Nginx reverse proxy, HTTPS qua domain `rrms.click`
  — *bằng chứng: `https://rrms.click`, `https://rrms.click/grafana/` hoạt động qua Nginx.*
- [x] App tự sống bằng `systemd` (Spring Boot, không dùng PM2)
  — *bằng chứng: K5.3 xác nhận `rrms-backend: active (running)` sau reboot, không cần thao tác tay.*
- [x] Reboot VPS → app + nginx + DB + monitoring tự sống lại
  — *bằng chứng đầy đủ, kết quả thực tế ghi rõ ngày 2026-07-16 trong K5.3.*
- [x] HTTP tự redirect sang HTTPS, Certbot tự gia hạn
  — *giả định đã làm ở Phần A/B, cần xác nhận bằng: `curl -I http://rrms.click` → phải trả `301`/`308` sang `https://`.*
- [x] Database có user/mật khẩu riêng, chỉ bind `127.0.0.1`
  — *giả định đã làm, cần xác nhận: `sudo ss -tlnp | grep 3306` → phải thấy `127.0.0.1:3306`, không phải `0.0.0.0`.*
- [x] `ufw` chỉ mở đúng SSH/80/443
  — *chưa có bằng chứng, cần chạy `sudo ufw status`.*

---

## Trụ 3 — CI/CD tự động (25đ)

*Dựa trên Phần D đã hoàn thành*

- [x] CI: mọi push/PR chạy ≥1 unit test thật (test hàm logic, không phải `1 == 1`) + build thử
  — *chưa có bằng chứng nội dung workflow, cần xem file `.github/workflows/ci.yml`.*
- [x] CD: push `main` → build → deploy → health check sau deploy; health fail → workflow đỏ
  — *giả định đã làm ở Phần D, cần xác nhận có bước health check thật sau deploy không.*
- [x] Diễn tập "code hỏng bị chặn": test fail → pipeline dừng → web KHÔNG đổi
  — *cần làm/quay lại nếu chưa từng diễn tập cảnh này (bắt buộc cho video demo cảnh (c)).*
- [x] Secrets nằm trong GitHub Secrets, không hardcode
  — *giả định đạt: K1 nhắc `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` đã lưu sẵn trong GitHub Secrets từ lab CI/CD.*

---

## Trụ 4 — Notify (gộp trong 25đ của Trụ 3)

*Dựa trên Phần D/E đã hoàn thành*

- [x] Bot Telegram tồn tại và dùng được
  — *bằng chứng: K1 chọn Phương án A — tái sử dụng bot **RRMS Deploy** đã tạo ở lab CI/CD.*
- [x] Tin nhắn deploy thành công kèm **tên người push + commit message**; thất bại kèm **link log**
  — *chưa có bằng chứng nội dung tin nhắn thực tế, cần chụp lại 1 tin ✅ và 1 tin ❌ thật để xác nhận đủ format yêu cầu.*

---

## Trụ 5 — Monitoring + Alert (15đ + 15đ)

*Phần F/G/H/J/K đã hoàn thành*

- [x] Metrics máy chủ (node-exporter) — K4.2, K5 xác nhận `up`.
- [x] Metrics ứng dụng (`/actuator/prometheus`) trả Micrometer, không lộ ra ngoài qua domain
  — *đã test: nội bộ trả metrics chuẩn (`# HELP`/`# TYPE`); qua `https://rrms.click/actuator/prometheus` cần trả về HTML React, không phải số liệu — đang chờ xác nhận kết quả cuối.*
- [x] Dashboard Grafana qua HTTPS + Node Exporter Full — K tiêu chí đạt đã tick.
- [x] Query PromQL app metrics (request/giây) — K tiêu chí đạt đã tick "Explore đọc metric backend".
- [x] ≥3 quy tắc alert — thực tế có **5 quy tắc** (APIDown, NodeExporterDown, HighCPU, HighRAM, DiskAlmostFull), vượt yêu cầu tối thiểu — K3 đầy đủ.
- [x] `send_resolved: true` — K2.2 đã cấu hình.
- [x] Diễn tập APIDown FIRING→RESOLVED, HighCPU FIRING→RESOLVED — K5.1, K5.2 đã thực hiện thật (bằng tay).
- [ ] **Quay video** diễn tập (`sudo systemctl stop rrms-backend` → FIRING → `start` → RESOLVED, kèm cảnh CPU vọt lên lúc `stress`)
  — *đã diễn tập bằng tay nhưng chưa có bằng chứng đã quay màn hình — bắt buộc cho video demo.*

---

## Phần RAM (Phần B/G) — đã có quyết định rõ ràng

- [x] Chọn Phương án B: loại bỏ Elasticsearch, phù hợp VPS chỉ 2GB RAM
  — *bằng chứng: K ghi rõ "đã loại bỏ Elasticsearch, giới hạn `mem_limit` monitoring (Phần B/G)".*

---

## Việc còn lại cần làm (thuộc riêng Capstone, không nằm sẵn trong A–K)

1. **Kiểm tra 3 mục Deploy chưa xác nhận**: HTTP→HTTPS redirect, DB bind `127.0.0.1` có auth, `ufw status`.
2. **Xác nhận nội dung CI workflow**: có unit test thật không, có build thử không.
3. **Xác nhận nội dung tin Telegram deploy**: có tên người push + commit message (✅) và link log (❌) không — nếu thiếu, sửa bước gửi tin trong `deploy.yml`.
4. **Diễn tập "code hỏng bị chặn"**: cố ý sửa 1 test cho fail → push → xem Actions đỏ, web không đổi, Telegram ❌ — quay lại cảnh này cho video.
5. **Kiểm tra dữ liệu CRUD còn nguyên sau reboot** (mở app, xem list Room/Tenant... có còn không).
6. **Chuẩn bị 4 mục nộp bài còn thiếu**:
   - Báo cáo PDF 3-5 trang (sơ đồ kiến trúc, screenshot dashboard + Telegram, khó khăn & cách giải quyết).
   - Video demo 5-10 phút đủ 4 cảnh (CRUD, deploy thành công ✅, deploy thất bại ❌, diễn tập FIRING/RESOLVED).
   - Tạo account Grafana role **Viewer** riêng cho giảng viên.
   - Đảm bảo repo GitHub Actions history còn nguyên, README dựng lại được hệ thống.
7. **Cân nhắc điểm cộng** (không bắt buộc): backup DB tự động, Docker hoá toàn bộ, staging, rollback, zero-downtime, fail2ban, uptime check ngoài, Loki log tập trung, load test.