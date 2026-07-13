# Phần D — CI/CD với GitHub Actions (dự án RRMS: Spring Boot + MySQL + React)

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần A, B, B0, C đã hoàn thành** — backend Spring Boot chạy qua `systemd` (`rrms-backend`) tại `127.0.0.1:7000`, frontend React đã build ra `client/dist`, Nginx + HTTPS đã chạy ổn định trên domain thật (ví dụ `rrms.click`).

Deploy thủ công nghĩa là: mỗi lần sửa code, bạn phải SSH vào VPS → `git pull` → `mvn package` → build frontend → restart `rrms-backend`. Mất nhiều phút mỗi lần, tốn RAM/CPU của VPS 2GB để build ngay trên đó, dễ quên bước. Lab này xây dựng pipeline CI/CD hoàn chỉnh bằng GitHub Actions: từ giờ chỉ cần `git push` — hệ thống tự chạy test, tự build backend (`.jar`) + frontend React (`dist/`) **trên GitHub runner** (không tốn tài nguyên VPS), tự đưa lên VPS, tự restart `systemd`, và bắn thông báo về Telegram cho bạn biết deploy thành công ✅ hay thất bại ❌ (xem Phần E).

```
Lập trình viên (máy local)
        │  git push origin main
        ▼
┌─────────────────────── GitHub ────────────────────────┐
│  Repo RRMS                                             │
│  GitHub Actions (runner ubuntu-latest):                │
│   1. mvn test          → chạy unit test backend        │
│   2. mvn package       → server/target/rrms-....jar    │
│   3. npm run build     → client/dist/                  │
│   4. scp jar + dist    → VPS                           │
│   5. ssh: mv jar vào chỗ cũ, thay dist cũ               │
│   6. ssh: systemctl restart rrms-backend                │
│   7. curl kiểm tra backend còn sống                     │
└───────────────┬───────────────────┬────────────────────┘
                │ SSH (deploy key/pass) │ Bot API
                ▼                   ▼
┌────────────── VPS Ubuntu ──────────────┐   📱 Telegram
│ Nginx (80/443, SSL - Certbot)          │   ✅ Deploy thành công
│  ├ /        → client/dist  (React)     │   ❌ Deploy thất bại + link log
│  ├ /api/    → proxy 127.0.0.1:7000     │
│  └ /uploads → server/uploads/          │
│ systemd: rrms-backend (jar Spring Boot)│
│ docker compose: mysql, redis, elasticsearch │
└─────────────────────────────────────────┘
```

- Backend build ra file `.jar` bằng Maven (`mvn package`).
- Cần cả **JDK 17** và **Node 20** trên runner (backend Java + frontend React).
- Hạ tầng `mysql`/`redis`/`elasticsearch` chạy bằng Docker Compose **trên VPS** — không nằm trong workflow deploy, vẫn giữ nguyên như Phần B/B0 (workflow chỉ deploy `.jar` + `dist`, không đụng tới Docker Compose).
- Backend do `systemd` (`rrms-backend`) quản lý.
- Health check gọi vào cổng nội bộ `7000` của Spring Boot.

---

## Bước 18 — Khai báo GitHub Secrets

GitHub Actions cần thông tin đăng nhập VPS để copy file và chạy lệnh. Ta lưu chúng dưới dạng Secrets — biến được GitHub mã hoá, chỉ runner đọc được lúc chạy và tự động bị che thành `***` trong log:

- [x] Mở repo `RRMS` trên GitHub → tab **Settings**.
- [x] Menu trái → **Secrets and variables** → **Actions**.
- [x] Bấm **New repository secret**, tạo lần lượt 4 secret sau (Name gõ CHÍNH XÁC, Value là giá trị của bạn):
  - `VPS_HOST` — IP của VPS, ví dụ `103.72.97.127`.
  - `VPS_PORT` — cổng SSH, mặc định `24700`.
  - `VPS_USER` — user SSH (ví dụ `root`).
  - `VPS_PASSWORD` — mật khẩu SSH của user đó.

> Vì sao không viết thẳng mật khẩu vào file YAML? Repo Public — hardcode vào workflow là cả thế giới đọc được. Secret thì ngược lại: sau khi lưu, ngay cả bạn cũng không xem lại được giá trị, chỉ có thể ghi đè. Dự án thật lâu dài nên chuyển sang SSH key thay password — với lab này, password là đủ và dễ hiểu nhất.

---

## Bước 19 — Workflow CI: tự test mọi lần push

Trên máy local, ở thư mục gốc `RRMS/`:

```bash
mkdir -p .github/workflows
```

Tạo file `.github/workflows/ci.yml` — chạy test + build thử ở mọi push và pull request:

```yaml
# .github/workflows/ci.yml
name: CI

# Chạy ở MỌI pull request và mọi lần push lên main
on:
  pull_request:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server
    steps:
      - uses: actions/checkout@v4          # tải code về runner

      - uses: actions/setup-java@v4        # cài JDK trên runner
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: maven

      - name: Cấp quyền thực thi cho mvnw
        run: chmod +x mvnw

      - name: Tạo file test.properties từ file application-test.properties mẫu
        run: cp src/test/resources/application-test.properties src/test/resources/test.properties

      - name: Chạy unit test
        run: ./mvnw -B test

      - name: Build thử (đóng gói .jar)
        run: ./mvnw -B package -DskipTests

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: client/package-lock.json

      - name: Cài dependency (npm ci nhanh & tái lập được, dùng cho CI)
        run: npm ci

      - name: Build thử
        run: npm run build
```

- [x] Tạo file trên theo đúng nội dung.

---

## Bước 20 — Workflow CD: tự deploy khi push main

Tạo file `.github/workflows/deploy.yml` — trái tim của bài lab. Build trên runner → copy sang VPS bằng thông tin đăng nhập ở Bước 18 → kích hoạt bản mới → tự kiểm tra sống:

```yaml
# .github/workflows/deploy.yml
name: Deploy

# Chỉ chạy khi push (hoặc merge PR) vào nhánh main
on:
  push:
    branches: [main]

# Không cho 2 lần deploy chạy chồng lên nhau
concurrency:
  group: deploy-production
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # ---------- 1. Build backend Spring Boot ----------
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: maven

      - name: Cấp quyền thực thi cho mvnw
        working-directory: server
        run: chmod +x mvnw

      - name: Tạo file test.properties từ file application-test.properties mẫu
        working-directory: server
        run: cp src/test/resources/application-test.properties src/test/resources/test.properties

      - name: Test backend
        working-directory: server
        run: ./mvnw -B test

      - name: Build .jar
        working-directory: server
        run: ./mvnw -B package -DskipTests

      - name: Tìm tên file jar vừa build
        id: jar
        working-directory: server
        run: |
          JAR_PATH=$(ls target/*.jar | grep -v original | head -n 1)
          echo "path=$JAR_PATH" >> "$GITHUB_OUTPUT"

      # ---------- 2. Build frontend React ----------
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: client/package-lock.json

      - name: Build frontend
        working-directory: client
        # VITE_APP_API_URL được "bake" lúc build — nếu domain không đổi,
        # có thể để trong client/.env.production đã commit sẵn (không chứa secret nhạy cảm)
        run: |
          npm ci
          npm run build

      # ---------- 3. Copy sản phẩm build lên VPS ----------
      - name: Copy jar + dist lên VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          port: ${{ secrets.VPS_PORT }}
          username: ${{ secrets.VPS_USER }}
          password: ${{ secrets.VPS_PASSWORD }}
          source: "server/${{ steps.jar.outputs.path }},client/dist"
          target: /tmp/rrms-deploy

      # ---------- 4. Kích hoạt bản mới trên VPS ----------
      - name: Restart service
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          port: ${{ secrets.VPS_PORT }}
          username: ${{ secrets.VPS_USER }}
          password: ${{ secrets.VPS_PASSWORD }}
          script: |
            set -e

            # Đảm bảo các thư mục đích tồn tại trên VPS
            mkdir -p /var/www/rrms/server/target /var/www/rrms/client

            # Backend: tìm file .jar đệ quy trong thư mục tạm và di chuyển ghi đè trực tiếp
            NEW_JAR=$(find /tmp/rrms-deploy -name "*.jar" | head -n 1)
            if [ -n "$NEW_JAR" ]; then
              mv -f "$NEW_JAR" /var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar
            else
              echo "Error: No JAR file found in /tmp/rrms-deploy"
              exit 1
            fi

            # Frontend: thay toàn bộ dist cũ
            rm -rf /var/www/rrms/client/dist
            mv /tmp/rrms-deploy/client/dist /var/www/rrms/client/dist
            rm -rf /tmp/rrms-deploy

            # Khởi động lại backend (systemd đọc lại đúng file .jar cố định)
            sudo systemctl restart rrms-backend

            # Kiểm tra sống sau deploy — fail ở đây thì workflow đỏ
            sleep 8
            curl -fs http://127.0.0.1:7000/api/v1/search || curl -fs http://127.0.0.1:7000/actuator/health
```

> **Lưu ý về đường dẫn `.jar`**: `systemd` (Bước 5.1 của Phần B) trỏ cố định vào `/var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar`. Vì tên file build ra luôn giống nhau (version cố định trong `pom.xml`), script trên ghi đè đúng vào đường dẫn đó — không cần sửa file service mỗi lần deploy.
>
> **Lưu ý về health check**: nếu dự án chưa bật Spring Boot Actuator, dùng tạm một endpoint GET công khai đã có sẵn (ví dụ `/api/v1/search`) để kiểm tra "sống". Nếu có `spring-boot-starter-actuator`, đổi hẳn sang `curl -fs http://127.0.0.1:7000/actuator/health`.
>
> **Quyền `sudo` không cần mật khẩu cho lệnh restart**: vì kết nối SSH bằng `VPS_USER` (thường là `root`) nên `sudo systemctl restart rrms-backend` chạy được ngay không cần thêm cấu hình. Nếu sau này đổi sang user thường (không phải root), cần thêm dòng `NOPASSWD` cho đúng lệnh này trong `/etc/sudoers`.

### YAML cực kỳ khó tính với thụt lề

Thụt lề bằng ĐÚNG 2 dấu cách mỗi cấp, tuyệt đối không dùng phím Tab. Lỗi "Invalid workflow file" gần như luôn do thụt lề sai. Nên bật hiển thị whitespace trong editor khi sửa YAML.

- [x] Tạo 2 file `ci.yml` và `deploy.yml` theo đúng nội dung ở trên.

Commit và push — pipeline chạy ngay:

```bash
# Đứng ở thư mục gốc RRMS/
git add .github
git commit -m "Them CI/CD workflows"
git push

# Mở repo trên GitHub → tab "Actions" → thấy 2 workflow đang chạy 🎉
```

- [x] Vào tab **Actions** của repo: workflow `Deploy` chạy khoảng 3–5 phút (Maven + npm build). Khi mọi step xanh ✓ → mở `https://rrms.click` → website đã sống. Đây là lần auto-deploy đầu tiên của bạn — từ giờ không bao giờ phải SSH deploy tay nữa.

> Phần thông báo Telegram (Bước 21–22) được tách sang **Phần E**, nối tiếp ngay sau Bước 20 này.