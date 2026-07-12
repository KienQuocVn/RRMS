# Phần C — Nginx + Domain + HTTPS

> File này dùng để Claude Code (hoặc người thực hiện) làm từng việc theo checklist. Sau khi hoàn thành một mục, tick `[x]` vào đúng dòng đó trước khi chuyển sang mục kế tiếp. Yêu cầu **Phần B đã hoàn thành** (backend chạy qua systemd tại `127.0.0.1:7000`, frontend đã build ra `client/dist`).

## Checklist

### C1 — Cài và cấu hình Nginx

- [x] **1.1. Cài Nginx:**
  ```bash
  sudo apt install -y nginx
  ```

- [x] **1.2. Tạo file cấu hình site** `/etc/nginx/sites-available/rrms`:
  ```nginx
  server {
      listen 80;
      server_name rrms.click www.rrms.click;   # ← đổi thành domain thật của bạn

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

- [x] **1.3. Kích hoạt site và tắt site mặc định:**
  ```bash
  sudo ln -s /etc/nginx/sites-available/rrms /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default
  ```

- [x] **1.4. Kiểm tra cú pháp và reload:**
  ```bash
  sudo nginx -t            # phải thấy "syntax is ok"
  sudo systemctl reload nginx
  ```

- [x] **1.5. Mở firewall cho web + giữ SSH:**
  ```bash
  sudo ufw allow 'Nginx Full'
  sudo ufw allow OpenSSH
  sudo ufw enable
  sudo ufw status
  ```

- [ ] **1.6. Test bằng IP** — mở `http://YOUR_VPS_IP` trên trình duyệt, xác nhận thấy giao diện RRMS.

### C2 — Trỏ domain và cấp HTTPS bằng Certbot

- [x] **2.1. Trỏ DNS**: thêm A record cho `rrms.click` (và `www.rrms.click` nếu cần) trỏ về `YOUR_VPS_IP`. Kiểm tra:
  ```bash
  ping rrms.click
  dig +short rrms.click
  ```

- [x] **2.2. Xác nhận `server_name` trong file Nginx đúng domain thật**, sau đó:
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

- [ ] **2.3. Cài Certbot:**
  ```bash
  sudo apt install -y certbot python3-certbot-nginx
  ```

- [ ] **2.4. Xin chứng chỉ HTTPS:**
  ```bash
  sudo certbot --nginx -d rrms.click -d www.rrms.click
  ```

- [ ] **2.5. Kiểm tra cơ chế tự gia hạn:**
  ```bash
  sudo certbot renew --dry-run   # phải thấy "Congratulations, all simulated renewals succeeded"
  ```

### C3 — Nghiệm thu toàn hệ thống

- [ ] Mở `https://rrms.click` → thấy giao diện RRMS với ổ khoá HTTPS.
- [ ] Test các luồng chính (đăng nhập, CRUD, upload...) qua domain thật.
- [ ] Gõ `http://rrms.click` → tự động chuyển sang HTTPS.
- [ ] F5 trang web nhiều lần → không gặp lỗi 404.
- [ ] Chạy `sudo systemctl restart rrms-backend` rồi reload trang → web vẫn hoạt động.
- [ ] Reboot VPS (`sudo reboot`), đợi 60 giây, truy cập lại → mọi thứ tự sống lại:
  - [ ] Docker containers hạ tầng (`docker compose ps`)
  - [ ] `rrms-backend` (`sudo systemctl status rrms-backend`)
  - [ ] `nginx` (`sudo systemctl status nginx`)
  > Nếu container hạ tầng không tự bật lại sau reboot, kiểm tra `docker-compose.yml` đã có `restart: always` hoặc `unless-stopped` cho từng service chưa — nếu chưa, thêm vào.
- [ ] Mở DBeaver/MySQL Workbench từ máy local → kết nối `YOUR_VPS_IP:3306` (nếu đã mở port và giới hạn bằng `ufw`) → thấy database `rrms` với dữ liệu đúng như trên web.

## Debug khi gặp lỗi

- **502 Bad Gateway**: Nginx chạy nhưng backend không lên. Kiểm tra `sudo systemctl status rrms-backend` và `sudo journalctl -u rrms-backend -n 100` — thường do sai `DB_PASSWORD`/`DB_USERNAME` hoặc MySQL container chưa chạy.
- **F5 ở trang con bị 404 / trang trắng**: thiếu dòng `try_files $uri $uri/ /index.html;` trong `location /`.
- **Upload báo "413 Request Entity Too Large"**: thiếu `client_max_body_size 10M;` trong Nginx.
- **`Communications link failure` / kết nối MySQL bị từ chối**: container `mysql` chưa chạy (`docker compose ps`), hoặc backend đang trỏ sai host — MySQL chạy trong Docker, backend chạy ngoài Docker nên vẫn dùng `127.0.0.1:3306`.
- **`Access denied for user`**: sai `DB_USERNAME`/`DB_PASSWORD` giữa `.env` gốc và `server/.env`.
- **Certbot báo "Challenge failed"**: domain chưa trỏ đúng IP VPS, DNS chưa propagate, hoặc cổng 80 bị firewall chặn.
- **Frontend gọi API bị lỗi CORS/URL sai sau khi build**: quên cập nhật `VITE_APP_API_URL` sang domain thật trước khi `npm run build` — phải build lại vì biến `VITE_*` được bake lúc build, không đọc lại lúc runtime.
- **`java: command not found` trong systemd**: sai đường dẫn `ExecStart`, kiểm tra bằng `which java` rồi sửa lại path trong file service.

## Kết quả Phần C

Khi tất cả các mục trên đã tick `[x]`: website RRMS chạy qua HTTPS trên domain thật, tự phục hồi sau khi restart backend hoặc reboot VPS. Dự án đã hoàn tất deploy.