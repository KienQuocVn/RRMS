# Lab: Deploy RRMS (Spring Boot + React + MySQL) lên VPS với Nginx

Lab này áp dụng cho dự án **RRMS — Hệ thống quản lý nhà trọ** trong trạng thái hiện tại của repo: code backend Spring Boot (thư mục `server`) và frontend React/Vite (thư mục `client`) đã viết xong, có Dockerfile riêng cho từng phần, có `docker-compose.yml` cho hạ tầng, code đã push GitHub, và bạn đang test bằng MySQL Workbench ở local.

Mục tiêu: đưa đúng dự án đang chạy này lên một VPS Ubuntu thật — dùng Docker Compose cho hạ tầng (MySQL, Redis, Elasticsearch...), **systemd** giữ backend Spring Boot luôn sống, Nginx serve React build + reverse proxy API, và cấp HTTPS miễn phí bằng Certbot. Lab **không** yêu cầu code lại ứng dụng từ đầu — vì phần đó dự án của bạn đã có sẵn.

## Vì sao kiến trúc này?

Nginx nghe cổng 80/443 vì Java app không nên chạy bằng root và không nên trực tiếp đối mặt internet; Nginx serve file tĩnh React nhanh hơn nhiều lần, xử lý TLS/HTTPS, nén gzip. Systemd giữ Spring Boot (chạy dưới dạng file `.jar`) sống 24/7, tự khởi động lại khi crash hoặc khi VPS reboot — đây là cách làm chuẩn cho ứng dụng Java trên Linux. Docker Compose lo phần hạ tầng (MySQL, Redis, Elasticsearch/Kibana/Logstash) đúng như bạn đang dùng ở local, tránh phải cài đặt lại từ đầu trên VPS.

### Sơ đồ tổng thể hệ thống sau khi hoàn thành

```
Người dùng (trình duyệt)
        │  HTTPS (cổng 443)
        ▼
┌────────────────────────────── VPS Ubuntu ──────────────────────────────┐
│  Nginx (nghe 80/443, SSL Let's Encrypt)                                │
│   ├── /            → file tĩnh React build (client/dist)              │
│   ├── /api/...     → proxy về Spring Boot :7000 (systemd)              │
│   └── /uploads/... → thư mục ảnh server/uploads (nếu dự án có upload)  │
│                              │                                         │
│                              ▼                                         │
│         Docker Compose: mysql :3306, redis :6379,                     │
│         elasticsearch :9200, kibana :5601, logstash :5000              │
└──────────────────────────────────────────────────────────────────────┘
```

## 0. Cấu hình hiện tại của dự án (đừng đổi khi deploy)

### Backend

- Thư mục: `server`
- Framework: Spring Boot `3.3.3`
- Java/JDK: `17`
- Maven compiler: source/target `${java.version}` = `17`
- Artifact: `com.rrms:rrms:0.0.1-SNAPSHOT`
- Port mặc định: `7000`
- Profile hiện tại: `dev`
- Docker build image: `maven:3.9-eclipse-temurin-17`
- Docker runtime image: `eclipse-temurin:17-jre-alpine`

Vị trí cấu hình chính: `server/pom.xml`, `server/Dockerfile`, `server/src/main/resources/application.properties`, `server/src/main/resources/application-dev.properties`, `server/.env`.

### Frontend

- Thư mục: `client`
- React: `18.3.1`
- Vite: `5.4.1`
- Node Docker image: `node:20-alpine`
- Web server Docker image: `nginx:1.27-alpine`
- Port dev: `5173`
- API URL hiện tại: `http://localhost:7000`

Vị trí cấu hình chính: `client/package.json`, `client/Dockerfile`, `client/.env`, `client/src/configs/environment.js`.

### Database và hạ tầng Docker

- MySQL image: `mysql:8.0`
- Redis image: `redis:7-alpine`
- Elasticsearch/Kibana/Logstash: `7.17.24`
- Docker Compose project name: `rrms`
- Network: `rrms-network`

Trong `docker-compose.yml`, các service đang bật là `mysql`, `redis`, `elasticsearch`, `kibana`, `logstash`. Hai service `backend` và `frontend` đã có sẵn cấu hình nhưng đang được comment — giai đoạn deploy này **giữ nguyên cách đó**: hạ tầng chạy bằng Docker Compose, backend/frontend chạy trực tiếp trên VPS (không đóng container) để dễ quản lý bằng systemd và Nginx.

### Database config đang dùng

```env
DB_PASSWORD=12345
DB_USERNAME=root
DB_NAME=rrms
DB_ROOT_USERNAME=rrms
```

`docker-compose.yml` đọc biến từ file `.env` ở thư mục gốc repo. Backend Spring Boot đọc thêm `server/.env` thông qua:

```properties
spring.config.import=optional:file:.env[.properties],optional:file:server/.env[.properties]
```

Khi deploy, đảm bảo các biến DB quan trọng trong `.env` gốc và `server/.env` khớp với nhau, và **không đổi** `DB_NAME`, port `7000`, hay tên thư mục `server`/`client`.

## Yêu cầu trước khi làm

- Một VPS Ubuntu 22.04+ (DigitalOcean/Vultr/Linode… hoặc VPS giá rẻ), có IP public + tài khoản root hoặc user có quyền sudo.
- Một domain (hoặc subdomain) có thể trỏ A record về IP của VPS — bắt buộc để cấp HTTPS bằng Certbot.
- Dự án đã chạy ổn định ở local theo đúng cấu hình ở mục 0 (nếu chưa, hãy xác nhận lại trước khi deploy — đừng nâng version hay đổi công nghệ giữa chừng).
- Biết dùng terminal cơ bản: `cd`, `ls`, `nano`.
- (Tuỳ chọn) Cài **DBeaver** hoặc **MySQL Workbench** trên máy local để xem dữ liệu bằng giao diện.

## Lộ trình 3 phần

**Phần A** (Bước 1-2): chốt repo GitHub, đảm bảo không push file build/secret. **Phần B** (Bước 3-7): chuẩn bị VPS — Docker Compose cho hạ tầng, Java/Node, pull code, systemd cho backend. **Phần C** (Bước 8-9): Nginx + domain + HTTPS. Làm tuần tự, đừng nhảy cóc.

---

# PHẦN A — Chốt repo GitHub và file không được push

## Bước 1 — Kiểm tra cấu trúc repo và các file không push

Tại thư mục gốc RRMS nên có:

```text
RRMS/
  client/
  server/
  docker-compose.yml
  .dockerignore
  .gitignore
  docs/
```

Không đổi tên `server` thành `backend` và không đổi `client` thành `frontend` — repo hiện tại đang dùng đúng hai tên này.

Không push các thư mục/file sau:

```text
server/target/
client/node_modules/
client/dist/
.env
server/.env
client/.env
*.log
```

Repo hiện tại đã có `.gitignore` bỏ qua `.env`, file IDE và một số file hệ thống. Nếu cần chia sẻ cấu hình, tạo file mẫu như `.env.example` và không để mật khẩu thật trong đó.

## Bước 2 — Push code lên GitHub

```bash
git status
git add .
git commit -m "Update RRMS deploy lab"
git push
```

Đảm bảo branch mới nhất trên GitHub có: `server/pom.xml`, `server/Dockerfile`, `client/package.json`, `client/Dockerfile`, `docker-compose.yml`.

Refresh trang repo trên GitHub → thấy đầy đủ `server/` và `client/`, không thấy `target/`, `node_modules/`, hay file `.env` thật → Phần A hoàn thành.

---

# PHẦN B — Chuẩn bị VPS: Docker Compose, Java, Node, systemd

## Bước 3 — SSH vào VPS, cài Docker + JDK + Maven + Node

```bash
ssh root@YOUR_VPS_IP

sudo apt update && sudo apt upgrade -y
sudo apt install -y git ca-certificates curl

# Docker + Docker Compose (theo hướng dẫn chính thức của Docker cho Ubuntu)
# Sau khi cài xong, kiểm tra:
docker version
docker compose version

# JDK 17 (đúng version dự án đang dùng)
sudo apt install -y openjdk-17-jdk
java -version   # openjdk 17...

# Maven
sudo apt install -y maven
mvn -version

# Node.js 20 — cần để build frontend React
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

## Bước 4 — Clone repo về VPS

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

cd /var/www
git clone https://github.com/YOUR_USERNAME/RRMS.git rrms
cd /var/www/rrms
ls   # phải thấy: server  client  docker-compose.yml
```

## Bước 5 — Tạo file `.env` trên VPS theo đúng cấu hình đang dùng

Tại thư mục gốc `/var/www/rrms`, tạo `.env`:

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
KIBANA_PORT=5601
LOGSTASH_PORT=5000
```

Sao chép file này thành `server/.env` với cùng nội dung phần biến DB/JWT/mail/OAuth (để backend đọc được qua `spring.config.import`).

> **Quan trọng — đổi trước khi lên thật**: đây là dữ liệu mẫu đang dùng ở local (`DB_PASSWORD=12345`...). Khi deploy thật lên VPS công khai, đổi lại toàn bộ password/token thành giá trị mạnh, chỉ lưu trên server, không push lên GitHub. Đồng thời sửa `VITE_APP_API_URL`, `VITE_REDIRECT_URI`, OAuth callback/payment callback sang đúng domain thật (ví dụ `rrms.vn`) **trước khi build frontend**, vì Vite bake các biến `VITE_*` ngay lúc build, sửa sau khi build sẽ không có tác dụng.

## Bước 6 — Khởi động hạ tầng bằng Docker Compose

```bash
docker compose up -d mysql redis elasticsearch kibana logstash
docker compose ps
```

Kiểm tra MySQL:

```bash
docker exec -it rrms-mysql mysql -uroot -p12345 -e "SHOW DATABASES;"
# → phải thấy database "rrms"
```

Kiểm tra log nếu có lỗi:

```bash
docker compose logs -f mysql
```

## Bước 7 — Build backend, build frontend, và giữ backend sống bằng systemd

Build backend:

```bash
cd /var/www/rrms/server
./mvnw clean package -DskipTests
ls target/*.jar   # ví dụ: rrms-0.0.1-SNAPSHOT.jar
```

Chạy thử trực tiếp trước khi giao cho systemd:

```bash
PORT=7000 SPRING_PROFILES_ACTIVE=dev java -jar target/rrms-0.0.1-SNAPSHOT.jar
# → phải thấy Tomcat khởi động ở cổng 7000

# Mở tab SSH khác, test:
curl http://localhost:7000

# OK rồi thì Ctrl+C để tắt
```

Build frontend thành file tĩnh:

```bash
cd /var/www/rrms/client
npm install
npm run build
ls dist   # index.html  assets/...
```

Tạo systemd service để backend chạy nền, tự khởi động lại khi crash hoặc reboot — thay cho việc gõ `java -jar` thủ công mỗi lần:

```bash
sudo nano /etc/systemd/system/rrms-backend.service
```

```ini
[Unit]
Description=RRMS Spring Boot Backend
After=network.target docker.service

[Service]
User=www-data
WorkingDirectory=/var/www/rrms/server
ExecStart=/usr/bin/java -jar /var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar
Environment=PORT=7000
Environment=SPRING_PROFILES_ACTIVE=dev
Restart=on-failure
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Cấp quyền cho `www-data` (user chạy service) truy cập thư mục project:

```bash
sudo chown -R www-data:www-data /var/www/rrms/server
```

Kích hoạt + khởi động service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rrms-backend

sudo systemctl status rrms-backend     # phải thấy: Active: active (running)
sudo journalctl -u rrms-backend -f     # xem log realtime (Ctrl+C để thoát)
```

**Lỗi hay gặp**: quên `sudo systemctl enable` (chỉ chạy `start`) → sau khi reboot app không tự bật lại. Luôn dùng `enable --now`. Kiểm tra lại bằng cách reboot VPS ở bước cuối.

---

# PHẦN C — Nginx + Domain + HTTPS

## Bước 8 — Cài và cấu hình Nginx

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/rrms
```

```nginx
server {
    listen 80;
    server_name rrms.vn www.rrms.vn;   # ← đổi thành domain thật của bạn

    client_max_body_size 10M;

    # ---- 1) FRONTEND: serve file tĩnh React đã build ----
    root /var/www/rrms/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ---- 2) API: proxy về Spring Boot (systemd) cổng 7000 ----
    location /api/ {
        proxy_pass http://127.0.0.1:7000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- 3) ẢNH UPLOAD (nếu dự án lưu file trên đĩa) ----
    location /uploads/ {
        alias /var/www/rrms/server/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/rrms /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx

sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

Mở `http://YOUR_VPS_IP` → phải thấy giao diện RRMS. Nếu chưa, xem mục Debug bên dưới.

## Bước 9 — Trỏ domain + cấp HTTPS bằng Certbot

**9.1 — Trỏ DNS**: thêm A record cho `rrms.vn` (và `www.rrms.vn` nếu cần) trỏ về `YOUR_VPS_IP`. Kiểm tra: `ping rrms.vn`.

**9.2 — Sửa `server_name`** trong file Nginx đúng domain thật, rồi `sudo nginx -t && sudo systemctl reload nginx`.

**9.3 — Chạy Certbot:**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rrms.vn -d www.rrms.vn

sudo certbot renew --dry-run
```

---

## Bước cuối — Nghiệm thu kết quả

- Mở `https://rrms.vn` → thấy giao diện RRMS với ổ khoá HTTPS.
- Test các luồng chính (đăng nhập, CRUD, upload...) qua domain thật.
- Gõ `http://rrms.vn` → tự động chuyển sang HTTPS.
- F5 trang web nhiều lần → không bao giờ gặp 404.
- Chạy `sudo systemctl restart rrms-backend` rồi reload trang → web vẫn hoạt động.
- Reboot VPS (`sudo reboot`), đợi 60 giây, truy cập lại → mọi thứ tự sống lại (Docker containers hạ tầng, `rrms-backend`, `nginx` đều đã bật tự động — kiểm tra Docker containers có `restart: always`/`unless-stopped` trong `docker-compose.yml`, nếu chưa có thì thêm).
- Mở DBeaver/Workbench từ máy local → kết nối `YOUR_VPS_IP:3306` (nếu đã mở port ra ngoài và giới hạn bằng `ufw`) → thấy database `rrms` với dữ liệu đúng như trên web.

## Debug khi gặp lỗi

- **502 Bad Gateway**: Nginx chạy nhưng backend không lên. Kiểm tra `sudo systemctl status rrms-backend` và `sudo journalctl -u rrms-backend -n 100` — thường do sai `DB_PASSWORD`/`DB_USERNAME` hoặc MySQL container chưa chạy.
- **F5 ở trang con bị 404 / trang trắng**: thiếu dòng `try_files $uri $uri/ /index.html;` trong `location /`.
- **Upload báo "413 Request Entity Too Large"**: thiếu `client_max_body_size 10M;` trong Nginx.
- **`Communications link failure` / kết nối MySQL bị từ chối**: container `mysql` chưa chạy (`docker compose ps`), hoặc backend đang trỏ sai host — vì MySQL chạy trong Docker, backend chạy ngoài Docker nên vẫn dùng `127.0.0.1:3306` (cổng đã map ra host qua `MYSQL_PORT`).
- **`Access denied for user`**: sai `DB_USERNAME`/`DB_PASSWORD` giữa `.env` gốc và `server/.env` — đảm bảo hai file khớp nhau.
- **Certbot báo "Challenge failed"**: domain chưa trỏ đúng IP VPS (`dig +short rrms.vn`), DNS chưa propagate, hoặc cổng 80 bị firewall chặn.
- **Frontend gọi API bị lỗi CORS/URL sai sau khi build**: quên cập nhật `VITE_APP_API_URL` sang domain thật trước khi `npm run build` — phải build lại vì biến `VITE_*` được bake lúc build, không đọc lại lúc runtime.
- **`java: command not found` trong systemd**: sai đường dẫn `ExecStart`, kiểm tra bằng `which java` rồi sửa lại path trong file service.

**Điểm mấu chốt cần nhớ**: mỗi tầng một nhiệm vụ — Nginx (80/443) serve React tĩnh + proxy `/api`; Spring Boot (:7000) chỉ lo logic nghiệp vụ, do systemd giữ sống; MySQL/Redis/ELK chạy trong Docker Compose đúng như ở local. Frontend không bao giờ chạy `npm run dev` trên production, backend không bao giờ chạy `spring-boot:run` trên production.

## Ghi chú quan trọng (giữ nguyên từ cấu hình dự án)

- Không nâng Java, Spring Boot, Node, MySQL khi chưa test lại toàn bộ app.
- Không đổi `DB_NAME=rrms` thành `rrms_db`, vì dự án hiện tại đang dùng `rrms`.
- Không đổi backend port `7000` thành `8080`, vì cấu hình hiện tại đang dùng `7000`.
- Không đổi tên thư mục `server`/`client` thành `backend`/`frontend`.
- Nếu MySQL Workbench đang kết nối database local có dữ liệu sẵn, cần backup/export trước khi chuyển sang MySQL container trên VPS.
- File `.env` trong repo có thông tin nhạy cảm. Khi deploy thật, đổi lại password/token và chỉ lưu trên server, không push lên GitHub.

## Tiêu chí đạt

- Website RRMS chạy qua HTTPS trên domain riêng (có ổ khoá, HTTP tự redirect sang HTTPS).
- Các chức năng chính hoạt động đúng trên production qua domain thật.
- `systemctl status rrms-backend` hiển thị `active (running)`; sau khi reboot VPS toàn bộ hệ thống tự sống lại.
- Nginx serve React build và proxy `/api` (không truy cập trực tiếp cổng 7000 từ ngoài).
- MySQL/Redis/ELK chạy ổn định trong Docker Compose, dữ liệu đúng như ở local.
- Repo GitHub không chứa mật khẩu thật, `target/`, `node_modules`, hay file build.

## Bài tập

Thực hiện: Deploy RRMS (Spring Boot + React + MySQL, hạ tầng Docker Compose) lên VPS với Nginx + systemd + HTTPS.

Nộp: (1) link repo GitHub (không chứa mật khẩu thật và `node_modules`/`target`), (2) link website đang chạy HTTPS trên domain thật, (3) video demo: mở web qua domain → test các chức năng chính → chạy `systemctl status rrms-backend` trên VPS → reboot VPS → web tự sống lại → kết nối DBeaver/Workbench từ máy local thấy dữ liệu.