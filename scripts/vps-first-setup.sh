#!/usr/bin/env bash
# =============================================================
# RRMS — VPS First-Time Setup Script
# Ubuntu 22.04 LTS | IP: 43.240.117.148 | SSH Port: 24700
# Chạy với quyền root: bash vps-first-setup.sh
# =============================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo "=========================================="
echo "  RRMS VPS Setup — $(date)"
echo "=========================================="

# ----------------------------------------------------------
# BƯỚC 1: Cập nhật hệ thống
# ----------------------------------------------------------
log "Cập nhật hệ thống..."
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq curl wget git ca-certificates gnupg lsb-release ufw htop

# ----------------------------------------------------------
# BƯỚC 2: Tạo Swap 2GB (quan trọng với VPS 2GB RAM)
# ----------------------------------------------------------
if [ ! -f /swapfile ]; then
  log "Tạo swap file 2GB..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  log "Swap 2GB đã tạo xong"
else
  warn "Swap file đã tồn tại, bỏ qua"
fi
free -h

# ----------------------------------------------------------
# BƯỚC 3: Cài Docker + Docker Compose
# ----------------------------------------------------------
if ! command -v docker &>/dev/null; then
  log "Cài Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker đã cài xong: $(docker --version)"
else
  warn "Docker đã cài: $(docker --version)"
fi

# ----------------------------------------------------------
# BƯỚC 4: Cài Java 17 JRE
# ----------------------------------------------------------
if ! java -version 2>&1 | grep -q "17"; then
  log "Cài Java 17..."
  apt-get install -y -qq openjdk-17-jre-headless
  log "Java đã cài: $(java -version 2>&1 | head -1)"
else
  warn "Java 17 đã cài sẵn"
fi

# ----------------------------------------------------------
# BƯỚC 5: Cài Nginx + Certbot
# ----------------------------------------------------------
if ! command -v nginx &>/dev/null; then
  log "Cài Nginx + Certbot..."
  apt-get install -y -qq nginx certbot python3-certbot-nginx
  systemctl enable nginx
  systemctl start nginx
  log "Nginx đã cài xong"
else
  warn "Nginx đã cài sẵn"
fi

# ----------------------------------------------------------
# BƯỚC 6: Tạo cấu trúc thư mục
# ----------------------------------------------------------
log "Tạo thư mục deploy..."
mkdir -p /var/www/rrms/server/target
mkdir -p /var/www/rrms/client/dist
mkdir -p /var/www/rrms/releases
mkdir -p /var/www/rrms/server/uploads
log "Thư mục đã tạo tại /var/www/rrms/"

# ----------------------------------------------------------
# BƯỚC 7: Tạo file .env production
# ----------------------------------------------------------
ENV_FILE="/var/www/rrms/.env"
if [ ! -f "$ENV_FILE" ]; then
  log "Tạo file .env tại $ENV_FILE ..."
  cat > "$ENV_FILE" << 'ENVEOF'
# === DATABASE ===
DB_NAME=rrms
DB_USERNAME=root
DB_PASSWORD=12345
MYSQL_PORT=3306

# === REDIS ===
REDIS_PASSWORD=
REDIS_PORT=6379

# === BACKEND ===
PORT=7000
SPRING_PROFILES_ACTIVE=dev
JWT_SIGNER=REPLACE_YOUR_JWT_SIGNER
SECRET_KEY_CAPTCHA=REPLACE_YOUR_CAPTCHA_SECRET
CORS_ALLOWED_ORIGINS=https://rrms.click,http://localhost:5173

# === MAIL ===
MY_GMAIL=REPLACE_YOUR_GMAIL
MY_PASSWORD_APP=REPLACE_YOUR_GMAIL_APP_PASSWORD

# === OAUTH2 ===
GOOGLE_CLIENT_ID=REPLACE_YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=REPLACE_YOUR_GOOGLE_CLIENT_SECRET

# === PAYMENT ===
PAYPAL_CLIENT_ID=REPLACE_YOUR_PAYPAL_CLIENT_ID
PAYPAL_SECRET=REPLACE_YOUR_PAYPAL_SECRET
PAYPAL_SUCCESS_URL=https://rrms.click/payment/paypal/success
PAYPAL_CANCEL_URL=https://rrms.click/payment/paypal/cancel

STRIPE_PUBLIC_KEY=REPLACE_YOUR_STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=REPLACE_YOUR_STRIPE_SECRET_KEY

MOMO_PARTNER_CODE=MOMOLRJZ20181206
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=REPLACE_YOUR_MOMO_SECRET_KEY
MOMO_NOTIFY_URL=https://rrms.click/payment/momo-notify
MOMO_RETURN_URL=https://rrms.click/payment/paymentMoMoSuccess

VNPAY_SECRET_KEY=REPLACE_YOUR_VNPAY_SECRET_KEY
VNPAY_RETURN_URL=https://rrms.click/payment/vnpay-callback
ENVEOF
  chmod 600 "$ENV_FILE"
  log "File .env đã tạo"
else
  warn "File .env đã tồn tại, bỏ qua (không ghi đè)"
fi

# ----------------------------------------------------------
# BƯỚC 8: Tạo docker-compose.yml cho MySQL + Redis
# ----------------------------------------------------------
DC_FILE="/var/www/rrms/docker-compose.yml"
if [ ! -f "$DC_FILE" ]; then
  log "Tạo docker-compose.yml..."
  cat > "$DC_FILE" << 'DCEOF'
name: rrms

services:
  mysql:
    image: mysql:8.0
    container_name: rrms-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME:-rrms}
    command: --innodb-buffer-pool-size=128M --max-connections=50
    ports:
      - "127.0.0.1:${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - rrms-network
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${DB_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  redis:
    image: redis:7-alpine
    container_name: rrms-redis
    restart: unless-stopped
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]
    ports:
      - "127.0.0.1:${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - rrms-network
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
  redis_data:

networks:
  rrms-network:
    driver: bridge
DCEOF
  log "docker-compose.yml đã tạo"
fi

# ----------------------------------------------------------
# BƯỚC 9: Khởi động MySQL + Redis
# ----------------------------------------------------------
log "Khởi động MySQL và Redis..."
cd /var/www/rrms
docker compose up -d mysql redis
log "Đang chờ MySQL healthy (30s)..."
sleep 30
docker compose ps

# ----------------------------------------------------------
# BƯỚC 10: Tạo systemd service cho backend
# ----------------------------------------------------------
SERVICE_FILE="/etc/systemd/system/rrms-backend.service"
log "Tạo systemd service rrms-backend..."
cat > "$SERVICE_FILE" << 'SVCEOF'
[Unit]
Description=RRMS Spring Boot Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/rrms/server
EnvironmentFile=/var/www/rrms/.env
ExecStart=/usr/bin/java \
  -Xms256m -Xmx512m \
  -jar /var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
SuccessExitStatus=143
StandardOutput=journal
StandardError=journal
SyslogIdentifier=rrms-backend

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable rrms-backend
log "systemd service rrms-backend đã tạo và enable"

# ----------------------------------------------------------
# BƯỚC 11: Cấu hình Nginx
# ----------------------------------------------------------
log "Cấu hình Nginx cho rrms.click..."
cat > /etc/nginx/sites-available/rrms << 'NGINXEOF'
server {
    listen 80;
    server_name rrms.click www.rrms.click;

    client_max_body_size 50M;

    # Frontend — React SPA (file tĩnh đã build)
    root /var/www/rrms/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API — proxy về Spring Boot :7000
    location /api/ {
        proxy_pass http://127.0.0.1:7000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Upload files
    location /uploads/ {
        alias /var/www/rrms/server/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

# Kích hoạt site
ln -sf /etc/nginx/sites-available/rrms /etc/nginx/sites-enabled/rrms
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
log "Nginx đã cấu hình xong"

# ----------------------------------------------------------
# BƯỚC 12: Firewall
# ----------------------------------------------------------
log "Cấu hình UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 24700/tcp comment 'SSH custom port'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
ufw status
log "Firewall đã cấu hình"

# ----------------------------------------------------------
# BƯỚC 13: Cấp SSL bằng Certbot
# ----------------------------------------------------------
warn "Đang cấp SSL cho rrms.click..."
warn "Yêu cầu: DNS A record của rrms.click đã trỏ về 43.240.117.148"
echo ""
read -rp "DNS đã trỏ về IP này chưa? (y/n): " dns_ready
if [[ "$dns_ready" == "y" || "$dns_ready" == "Y" ]]; then
  certbot --nginx \
    -d rrms.click \
    -d www.rrms.click \
    --non-interactive \
    --agree-tos \
    -m quockkps31817@fpt.edu.vn \
    --redirect
  log "SSL đã cấp thành công!"
  certbot renew --dry-run && log "Tự gia hạn SSL hoạt động tốt"
else
  warn "Bỏ qua SSL — chạy thủ công sau bằng lệnh:"
  echo "  certbot --nginx -d rrms.click -d www.rrms.click"
fi

# ----------------------------------------------------------
# HOÀN TẤT
# ----------------------------------------------------------
echo ""
echo "=========================================="
echo "  ✅ SETUP HOÀN TẤT!"
echo "=========================================="
echo ""
echo "📋 Trạng thái hệ thống:"
echo ""
docker compose -f /var/www/rrms/docker-compose.yml ps
echo ""
echo "⚠️  BƯỚC TIẾP THEO:"
echo "  1. Vào GitHub repo → Push code lên nhánh 'main'"
echo "  2. GitHub Actions sẽ tự build & deploy .jar + dist lên VPS"
echo "  3. Kiểm tra: https://rrms.click"
echo ""
echo "🔍 Lệnh kiểm tra sau deploy:"
echo "  systemctl status rrms-backend"
echo "  journalctl -u rrms-backend -n 50"
echo "  docker compose -f /var/www/rrms/docker-compose.yml ps"
echo ""
