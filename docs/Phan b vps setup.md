# Phần B — Chuẩn bị VPS: Docker Compose, Java, Node, systemd

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần A đã hoàn thành** (code đã có trên GitHub, sạch secret/build file) **và Phần B0 đã hoàn thành** (`Phan_B0_Xu_ly_ELK.md` — đã gỡ Kibana/Logstash, cấu hình lại Elasticsearch, sửa endpoint bulletin-boards search, đã push code mới lên GitHub).

Cấu hình thực tế cần giữ nguyên trong phần này:

- Backend: thư mục `server`, Spring Boot `3.3.3`, JDK `17`, artifact `com.rrms:rrms:0.0.1-SNAPSHOT`, port `7000`, profile `dev`.
- Frontend: thư mục `client`, React `18.3.1`, Vite `5.4.1`.
- Hạ tầng: `mysql:8.0`, `redis:7-alpine`, `elasticsearch:7.17.24` (đã gỡ Kibana/Logstash ở Phần B0), project Docker Compose tên `rrms`, network `rrms-network`.
- DB hiện tại: `DB_NAME=rrms`, `DB_USERNAME=root`, `DB_PASSWORD=12345`, `DB_ROOT_USERNAME=rrms`.

**Không đổi**: tên thư mục `server`/`client`, port `7000`, `DB_NAME=rrms`, version Java/Node/MySQL.

## Checklist

### B1 — Cài đặt công cụ trên VPS

- [x] **1.1. SSH vào VPS:**
  ```bash
  ssh root@YOUR_VPS_IP
  sudo apt update && sudo apt upgrade -y
  sudo apt install -y git ca-certificates curl
  ```

- [x] **1.2. Cài Docker + Docker Compose**, kiểm tra:
  ```bash
  docker version
  docker compose version
  ```

- [x] **1.3. Cài JDK 17** (đúng version dự án đang dùng, KHÔNG cài JDK 21):
  ```bash
  sudo apt install -y openjdk-17-jdk
  java -version   # phải thấy openjdk 17...
  ```

- [x] **1.4. Cài Maven:**
  ```bash
  sudo apt install -y maven
  mvn -version
  ```

- [x] **1.5. Cài Node.js 20:**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  node -v   # phải thấy v20.x
  ```

### B2 — Clone code và cấu hình môi trường

- [x] **2.1. Tạo thư mục và clone repo:**
  ```bash
  sudo mkdir -p /var/www
  sudo chown -R $USER:$USER /var/www
  cd /var/www
  git clone https://github.com/YOUR_USERNAME/RRMS.git rrms
  cd /var/www/rrms
  ls   # phải thấy: server  client  docker-compose.yml
  ```

- [x] **2.2. Tạo file `.env` ở thư mục gốc `/var/www/rrms`:**
  ```env
  DB_NAME=rrms
  DB_USERNAME=root
  DB_PASSWORD=12345
  MYSQL_PORT=3306

  REDIS_PASSWORD=rrms_redis_secret_password_123
  REDIS_PORT=6379

  PORT=7000
  SPRING_PROFILES_ACTIVE=dev
  JWT_SIGNER=BE6HM/oN7KIuLdNEoYjXYrLFSrGEX7bNywc9Z3AKkdGsHhbkJeM2XbqCKqfT0aqC
  SECRET_KEY_CAPTCHA=0x4AAAAAAAkocny94-Ex4wStgWnpEPYJhd8
  CORS_ALLOWED_ORIGINS=https://rrms.vn,http://localhost:5173,http://localhost:3000

  VITE_APP_API_URL=https://rrms.vn
  VITE_PORT=5173
  CLIENT_PORT=5173
  VITE_REDIRECT_URI=https://rrms.vn/oauth2/redirect

  ELASTICSEARCH_PORT=9200
  # KIBANA_PORT và LOGSTASH_PORT không còn dùng — đã gỡ 2 service này ở Phần B0
  ```
  > **Đổi trước khi lên thật**: các giá trị trên là mẫu đang dùng ở local. Trước khi công khai cho người dùng thật, đổi toàn bộ password/token thành giá trị mạnh, chỉ lưu trên server, không push GitHub. Sửa `VITE_APP_API_URL`, `VITE_REDIRECT_URI` sang đúng domain thật.

- [x] **2.3. Sao chép các biến DB/JWT/mail/OAuth cần thiết sang `server/.env`** (backend đọc file này qua `spring.config.import`).

### B3 — Khởi động hạ tầng bằng Docker Compose

- [x] **3.0. Tạo swap file 2GB trước khi chạy Docker Compose** (VPS chỉ có 2GB RAM, cần lưới an toàn tránh OOM khi Elasticsearch + MySQL + backend cùng chạy):
  ```bash
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  free -h   # xác nhận thấy dòng Swap: 2.0Gi
  ```

- [x] **3.1. Chạy hạ tầng** 
  ```bash
  docker compose up -d mysql redis elasticsearch
  docker compose ps
  ```

- [x] **3.2. Kiểm tra MySQL có database `rrms`:**
  ```bash
  docker exec -it rrms-mysql mysql -uroot -p12345 -e "SHOW DATABASES;"
  ```

- [x] **3.3. Kiểm tra Elasticsearch khởi động thành công** (quan trọng — `BulletinBoardService` inject repository Elasticsearch, backend sẽ lỗi nếu ES không lên):
  ```bash
  curl http://localhost:9200
  ```
  Phải trả về JSON có `"cluster_name"`, `"tagline": "You Know, for Search"` — không lỗi kết nối.

- [x] **3.4. Kiểm tra log nếu có container lỗi:**
  ```bash
  docker compose logs -f mysql
  docker compose logs -f elasticsearch
  ```

### B4 — Build backend, build frontend

- [x] **4.1. Build file `.jar` backend:**
  ```bash
  cd /var/www/rrms/server
  ./mvnw clean package -DskipTests
  ls target/*.jar   # ví dụ: rrms-0.0.1-SNAPSHOT.jar
  ```

- [x] **4.2. Chạy thử trực tiếp trước khi giao cho systemd:**
  ```bash
  PORT=7000 SPRING_PROFILES_ACTIVE=dev java -jar target/rrms-0.0.1-SNAPSHOT.jar
  ```
  Mở tab SSH khác, test: `curl http://localhost:7000` → có phản hồi thì Ctrl+C tắt tiến trình thử.

- [x] **4.3. Build frontend thành file tĩnh** (đảm bảo `VITE_APP_API_URL` trong `client/.env` đã đúng domain thật TRƯỚC khi build):
  ```bash
  cd /var/www/rrms/client
  npm install
  npm run build
  ls dist   # index.html  assets/...
  ```

- [x] **4.4. Dọn dẹp disk sau khi build** (VPS chỉ có 20GB, `node_modules` + Maven cache + Docker image dễ chiếm vài GB không cần thiết sau khi đã có file build):
  ```bash
  # Xoá node_modules sau khi đã build xong (không cần nữa để chạy production)
  rm -rf /var/www/rrms/client/node_modules

  # Xoá cache Maven đã tải (không cần giữ lại sau khi build .jar xong)
  rm -rf ~/.m2/repository

  # Dọn image/layer Docker không dùng
  docker system prune -f

  df -h /   # kiểm tra dung lượng còn trống
  ```
  > Nếu sau này cần build lại (sửa code), các bước `npm install`/`mvn package` sẽ tự tải lại — không mất gì ngoài thời gian build hơi lâu hơn lần đầu.

- [x] **4.5. (Tuỳ chọn, nếu disk vẫn thường xuyên căng) Cân nhắc build ở máy local/CI thay vì trên VPS** — chỉ upload file `.jar` và thư mục `client/dist` đã build sẵn lên VPS qua `scp`/`rsync`, VPS chỉ cần chạy, không cần cài Maven/Node hay giữ cache build. Phù hợp nếu muốn tiết kiệm tối đa disk/CPU cho VPS 1 Core.

### B5 — Giữ backend sống bằng systemd

- [x] **5.1. Tạo file service** `/etc/systemd/system/rrms-backend.service`:
  ```ini
  [Unit]
  Description=RRMS Spring Boot Backend
  After=network.target docker.service

  [Service]
  User=www-data
  WorkingDirectory=/var/www/rrms/server
  ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar
  Environment=PORT=7000
  Environment=SPRING_PROFILES_ACTIVE=dev
  Restart=on-failure
  RestartSec=5
  SuccessExitStatus=143

  [Install]
  WantedBy=multi-user.target
  ```
  > `-Xms256m -Xmx512m` giới hạn heap JVM tối đa 512MB — nếu không giới hạn, backend Spring Boot có thể tự chiếm nhiều RAM hơn cần thiết, gây cạnh tranh với Elasticsearch (512MB) + MySQL trên VPS chỉ có 2GB tổng. Nếu vẫn thấy RAM căng khi chạy thực tế (kiểm tra bằng `free -h` hoặc `docker stats`), hạ tiếp xuống `-Xmx384m`.

- [x] **5.2. Cấp quyền cho `www-data` truy cập thư mục project:**
  ```bash
  sudo chown -R www-data:www-data /var/www/rrms/server

- [x] **5.3. Kích hoạt + khởi động service:**
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable --now rrms-backend
  sudo systemctl status rrms-backend     # phải thấy: active (running)
  ```

- [x] **5.4. Xem log realtime để xác nhận không lỗi:**
  ```bash
  sudo journalctl -u rrms-backend -f
  ```

> **Lưu ý về bảo mật cổng**: theo cấu hình đã cập nhật ở Phần B0, MySQL/Redis/Elasticsearch giờ bind về `127.0.0.1` (chỉ truy cập được từ chính VPS, không lộ ra internet) — đây là thay đổi có chủ đích để an toàn hơn. Nếu muốn xem dữ liệu MySQL từ DBeaver/Workbench ở máy local, dùng SSH tunnel: `ssh -L 3306:127.0.0.1:3306 ubuntu@YOUR_VPS_IP`, sau đó kết nối Workbench vào `127.0.0.1:3306` như bình thường.

## Kết quả Phần B

Khi tất cả các mục trên đã tick `[x]`: hạ tầng Docker (MySQL/Redis/Elasticsearch) đang chạy, backend Spring Boot chạy ổn định qua systemd tại `127.0.0.1:7000`, frontend đã build ra `client/dist`. Tiếp tục sang **Phần C — Nginx + Domain + HTTPS**.