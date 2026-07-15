# Phần E — Telegram notify (dự án RRMS: Spring Boot + MySQL + React)

> Yêu cầu **Phần D đã hoàn thành** — pipeline CI (`ci.yml`) và CD (`deploy.yml`) đã chạy được, `git push` lên `main` tự test/build/deploy lên VPS thành công.

## Bước 21 — Tạo bot Telegram + lấy chat_id

- [ ] Mở Telegram, tìm **@BotFather** (có tick xanh) → bấm **Start** → gõ `/newbot`.
- [ ] Đặt tên hiển thị (ví dụ: `RRMS Deploy`) → đặt username — phải kết thúc bằng `bot` (ví dụ: `rrms_deploy_bot`).
- [ ] BotFather trả về token dạng `123456789:AAH-abc...xyz` — copy lại, đây là "mật khẩu" của bot.
- [ ] Bấm vào link `t.me/rrms_deploy_bot` BotFather gửi kèm → bấm **Start** → gửi cho bot một tin nhắn bất kỳ (ví dụ "hello") — bước này bắt buộc: bot không thể chủ động nhắn cho người chưa từng chat với nó.
- [ ] Lấy `chat_id`: mở trình duyệt, dán URL sau (thay token của bạn) và tìm số `id`:

  ```
  https://api.telegram.org/bot<TOKEN_CUA_BAN>/getUpdates
  ```

  Kết quả JSON — tìm mục `"chat"` và copy số `"id"`:

  ```json
  {
  "ok": true,
  "result": [
    {
      "update_id": 795081463,
      "message": {
        "message_id": 3,
        "from": {
          "id": 1966318345,
          "is_bot": false,
          "first_name": "Kien",
          "last_name": "Quoc",
          "username": "kienquoc28",
          "language_code": "vi"
        },
        "chat": {
          "id": 1966318345,
          "first_name": "Kien",
          "last_name": "Quoc",
          "username": "kienquoc28",
          "type": "private"
        },
        "date": 1784103688,
        "text": "hello"
      }
    }
  ]
}
  ```
- [ ] Test ngay bằng curl — điện thoại phải nhận được tin nhắn:

  ```bash
  curl -s -X POST "https://api.telegram.org/bot123456789:AAH-abc.../sendMessage" \
    -d chat_id=987654321 \
    -d text="Xin chào từ RRMS bot 🤖"
  ```

> Muốn thông báo vào NHÓM (cả team cùng thấy)? Tạo group Telegram → thêm bot vào group → gửi 1 tin nhắn trong group → gọi lại `getUpdates` → `chat_id` của group là một SỐ ÂM (ví dụ `-100123456789`) — dùng số âm đó làm `TELEGRAM_CHAT_ID`.

## Bước 22 — Nối Telegram vào pipeline

- [ ] Thêm 2 secret mới (đúng thao tác như Bước 18 ở Phần D):
  - `TELEGRAM_BOT_TOKEN` — token BotFather cấp.
  - `TELEGRAM_CHAT_ID` — số id lấy từ `getUpdates`.

- [ ] Mở `.github/workflows/deploy.yml`, dán 2 step sau vào cuối job `deploy` (cùng cấp thụt lề với step "Restart service"), rồi commit + push:

```yaml
      # ---------- 5. Thông báo Telegram ----------
      - name: Telegram — deploy thành công
        if: success()
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
            -d parse_mode=HTML \
            --data-urlencode text="✅ <b>RRMS deploy THÀNH CÔNG</b>
          👤 <b>Người thực hiện:</b> ${{ github.actor }}
          📝 <b>Commit:</b> ${{ github.event.head_commit.message }}
          🔗 <a href='https://rrms.click'>Xem website</a>"

      - name: Telegram — deploy thất bại
        if: failure()
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
            -d parse_mode=HTML \
            --data-urlencode text="❌ <b>RRMS deploy THẤT BẠI!</b>
          👤 <b>Người thực hiện:</b> ${{ github.actor }}
          📝 <b>Commit:</b> ${{ github.event.head_commit.message }}
          🔍 <a href='https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}'>Xem chi tiết log lỗi</a>"
```

> **Giải thích `if: success()` / `if: failure()`**: mặc định một step chỉ chạy khi mọi step trước nó thành công. `if: failure()` đảo ngược điều đó — step CHỈ chạy khi có step trước bị lỗi. Nhờ vậy mỗi lần deploy bạn nhận đúng 1 tin: hoặc ✅ hoặc ❌ kèm link log để vào xem ngay lỗi ở đâu.

---

## Bước cuối — Nghiệm thu toàn bộ pipeline

- [ ] Test vòng lặp vàng: mở `client/src/App.jsx` trên máy local, đổi tiêu đề thành `🏠 RRMS v2` → `git add . && git commit -m "doi tieu de" && git push`.
- [ ] Mở tab **Actions** → workflow `Deploy` chạy → xanh ✓ sau ~3-5 phút.
- [ ] Điện thoại nhận tin Telegram `✅ RRMS deploy THÀNH CÔNG` kèm tên bạn và commit message.
- [ ] F5 `https://rrms.click` (Ctrl+Shift+R nếu bị cache) → tiêu đề đã đổi. Từ sửa code đến lên production: 1 lệnh `git push`.
- [ ] Test đường thất bại: cố ý làm hỏng 1 unit test backend (sửa `assertEquals` sai giá trị) → push → workflow đỏ ở step "Test backend" → nhận tin ❌ kèm link log → bấm link thấy ngay test nào fail.
- [ ] Sửa test lại cho đúng → push → xanh, nhận ✅ — chính là giá trị của CI: code hỏng không bao giờ lên được production.
- [ ] Kiểm tra trên VPS: `sudo systemctl status rrms-backend` (active/running), `sudo journalctl -u rrms-backend -n 30` xem log app.
- [ ] Reboot VPS → đợi 60 giây → web tự sống lại (`systemd` + `nginx` + Docker Compose `mysql/redis/elasticsearch` đều đã `enable`/`restart: unless-stopped`).

---

## Debug khi gặp lỗi

- **Step scp/ssh báo "ssh: unable to authenticate" hoặc "handshake failed"**: sai `VPS_PASSWORD`/`VPS_USER`/`VPS_PORT` — test lại bằng cách tự SSH từ máy local với đúng thông tin đó. Nếu VPS tắt đăng nhập bằng mật khẩu: mở `/etc/ssh/sshd_config`, đặt `PasswordAuthentication yes` rồi `sudo systemctl restart ssh`.
- **"Invalid workflow file"**: YAML thụt lề sai (tab thay vì space) hoặc thiếu dấu hai chấm. GitHub chỉ ra đúng dòng lỗi trong tab Actions.
- **`mvnw: Permission denied` trên runner**: file `mvnw` cần quyền thực thi — chạy `chmod +x server/mvnw` ở local rồi commit lại (git giữ file mode).
- **Build backend chậm/timeout trên runner**: thêm `cache: maven` ở `actions/setup-java` (đã có trong workflow mẫu) để cache `~/.m2` giữa các lần chạy.
- **`systemctl restart rrms-backend` báo lỗi quyền (`Permission denied`)**: `VPS_USER` không phải root hoặc không có quyền `sudo` không mật khẩu cho lệnh này — kiểm tra lại user SSH dùng trong secrets.
- **`curl .../search` hoặc `.../actuator/health` fail ở cuối workflow**: app crash ngay sau restart — SSH vào VPS chạy `sudo journalctl -u rrms-backend -n 50` để xem lỗi thật (thường là sai `DB_PASSWORD` trong `server/.env`, hoặc MySQL/Elasticsearch trong Docker Compose chưa chạy — kiểm tra `docker compose ps`).
- **Lỗi "text file busy" khi copy jar**: không dùng `cp` đè lên jar đang chạy — phải dùng `mv` (atomic) như script mẫu.
- **Telegram trả về 401 Unauthorized**: token sai. 400 "chat not found": `chat_id` sai hoặc bạn chưa bấm Start/gửi tin nhắn cho bot lần đầu.
- **`getUpdates` trả về `"result": []`**: gửi lại một tin nhắn cho bot rồi refresh URL.
- **Web không đổi sau khi deploy xanh**: cache trình duyệt — `Ctrl+Shift+R`; hoặc kiểm tra `ls -la /var/www/rrms/client/dist` xem timestamp file có mới không.
- **Frontend build xong nhưng gọi API lỗi CORS/URL sai**: `VITE_APP_API_URL` được "bake" lúc build trên runner (không phải lúc chạy trên VPS) — đảm bảo `client/.env.production` (không chứa secret nhạy cảm, có thể commit) đã trỏ đúng `https://rrms.click`, hoặc set biến môi trường ngay trong step "Build frontend" của workflow.
- **Workflow Deploy không chạy khi push**: bạn đang push lên nhánh khác `main`, hoặc file không nằm đúng đường dẫn `.github/workflows/deploy.yml`.

**Điểm mấu chốt cần nhớ**: pipeline chuẩn luôn là *test → build → deploy → verify → notify*, và build (Maven + npm) diễn ra trên runner chứ không phải trên VPS — VPS chỉ nhận thành phẩm (`.jar` + `dist`), nên đỡ tốn RAM/CPU của máy 2GB. Docker Compose (`mysql`/`redis`/`elasticsearch`) vẫn tự chạy độc lập trên VPS như Phần B/B0, workflow này không đụng tới. Secrets giữ mọi thông tin nhạy cảm ngoài code, kể cả khi repo Public. Telegram notify đóng vòng lặp phản hồi: bạn biết kết quả deploy trong vài giây dù đang ở bất cứ đâu.

## Tiêu chí đạt

- [ ] `git push` lên `main` → GitHub Actions tự test, build, deploy — không SSH tay bất kỳ bước nào.
- [ ] Website Spring Boot + MySQL chạy qua HTTPS trên domain riêng, các chức năng chính hoạt động trên production.
- [ ] Push code làm hỏng unit test → workflow đỏ, production KHÔNG bị thay đổi.
- [ ] Nhận tin Telegram ✅ khi deploy thành công và ❌ kèm link log khi thất bại.
- [ ] Backend do `systemd` quản lý (`systemctl status rrms-backend` = active), tự sống lại sau reboot VPS.
- [ ] `mysql`/`redis`/`elasticsearch` chỉ nghe `127.0.0.1` (đã cấu hình ở Phần B0).
- [ ] Repo Public không chứa `.env`, `target/`, `node_modules/`; mọi thông tin nhạy cảm (mật khẩu VPS, token Telegram) nằm trong GitHub Secrets.
- [ ] VPS không cần cài lại Maven/Node để deploy — `.jar` và `dist` được build trên GitHub runner (Maven/Node trên VPS chỉ còn cần nếu muốn build thủ công dự phòng).

## Bài tập

Thực hiện bài tập: CI/CD với GitHub Actions + Telegram notify cho dự án RRMS (Spring Boot + MySQL, React).

Nộp:
1. Link repo GitHub Public (phải có `.github/workflows/ci.yml` và `deploy.yml`, không chứa `.env`/`target/`/`node_modules/`).
2. Link website HTTPS đang chạy.
3. Video demo: sửa code → `git push` → tab Actions chạy xanh → web tự cập nhật → nhận tin Telegram ✅; sau đó cố ý làm hỏng test → push → workflow đỏ → nhận tin ❌ → sửa lại → xanh.