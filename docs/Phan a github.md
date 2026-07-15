# Phần A — Chốt repo GitHub và file không được push

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp.

ssh -p 24700 root@103.72.97.127

Dự án: **RRMS** — backend `server` (Spring Boot 3.3.3, JDK 17, port `7000`), frontend `client` (React 18.3.1, Vite 5.4.1). Không đổi tên thư mục `server`/`client`, không đổi port, không nâng version trong quá trình thực hiện phần này.

## Checklist

- [x] **1. Kiểm tra cấu trúc repo gốc** — xác nhận thư mục gốc RRMS có đủ:
  ```text
  RRMS/
    client/
    server/
    docker-compose.yml
    .dockerignore
    .gitignore
    docs/
  ```
  Không đổi tên `server` → `backend`, không đổi `client` → `frontend`.

- [x] **2. Kiểm tra `.gitignore` chặn đúng các file/thư mục sau** (không được có trong git tracking):
  ```text
  server/target/
  client/node_modules/
  client/dist/
  .env
  server/.env
  client/.env
  *.log
  ```
  Chạy lệnh kiểm tra:
  ```bash
  git status --ignored
  git ls-files | grep -E "target/|node_modules/|dist/|\.env$"
  ```
  Nếu lệnh thứ hai trả về kết quả nào đó → có file nhạy cảm/nặng đang bị tracking, cần `git rm --cached` file đó trước khi tiếp tục.

- [x] **3. Tạo file `.env.example`** (nếu chưa có) ở thư mục gốc, liệt kê tên biến nhưng KHÔNG chứa giá trị thật:
  ```env
  DB_NAME=
  DB_USERNAME=
  DB_PASSWORD=
  MYSQL_PORT=
  REDIS_PASSWORD=
  REDIS_PORT=
  PORT=
  SPRING_PROFILES_ACTIVE=
  JWT_SIGNER=
  SECRET_KEY_CAPTCHA=
  CORS_ALLOWED_ORIGINS=
  VITE_APP_API_URL=
  VITE_PORT=
  CLIENT_PORT=
  VITE_REDIRECT_URI=
  # ELASTICSEARCH_PORT / KIBANA_PORT / LOGSTASH_PORT — đã loại bỏ (xem docs/LOAI_BO_ELASTICSEARCH.md)
  KIBANA_PORT=
  LOGSTASH_PORT=
  ```

- [x] **4. Xác nhận các file cấu hình cần thiết đã có trong repo** (không bị `.gitignore` chặn nhầm):
  - [x] `server/pom.xml`
  - [x] `client/package.json`
  - [x] `server/Dockerfile`
  - [x] `client/Dockerfile`
  - [x] `docker-compose.yml`

- [x] **5. Commit và push code lên GitHub:**
  ```bash
  git status
  git add .
  git commit -m "Update RRMS deploy lab"
  git push
  ```

- [x] **6. Nghiệm thu trên GitHub** — mở lại repo trên github.com, xác nhận:
  - [x] Có đầy đủ `server/` và `client/`
  - [x] KHÔNG thấy `target/`
  - [x] KHÔNG thấy `node_modules/`
  - [x] KHÔNG thấy file `.env` chứa giá trị thật

## Kết quả Phần A

Khi tất cả các mục trên đã tick `[x]`: source trên GitHub sẵn sàng để pull về VPS, không kèm file build nặng và không kèm file secret thật. Tiếp tục sang **Phần B — Chuẩn bị VPS**.



