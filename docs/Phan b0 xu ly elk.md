# Phần B0 — Gỡ Kibana/Logstash + cấu hình lại Elasticsearch (LỊCH SỬ)

> **Cập nhật 2026-07-16:** Elasticsearch đã được **loại bỏ hoàn toàn**. File này giữ lại như nhật ký bước trung gian (chỉ gỡ Kibana/Logstash, vẫn giữ ES).  
> Tham chiếu hiện tại: [`LOAI_BO_ELASTICSEARCH.md`](./LOAI_BO_ELASTICSEARCH.md) và [`Phan b vps setup.md`](./Phan%20b%20vps%20setup.md).

> File gốc: chỉnh code trước khi lên VPS — mục tiêu lúc đó là gỡ Kibana + Logstash, giữ Elasticsearch nhẹ, và sửa search bulletin-boards sang JPA.

## Bối cảnh (theo rà soát của codex)


- `docker-compose.yml` dòng ~46 khai báo `elasticsearch`, `kibana`, `logstash`.
- `server/logstash/config/logstash.yml` và `server/logstash/pipeline/logstash.conf` — Logstash nhận log JSON qua TCP port `5000`, đẩy vào Elasticsearch index `springboot-%{app}`.
- `server/logstash/pipeline/bulletin_board.conf` — đọc bảng MySQL `bulletin_boards` mỗi phút, đồng bộ sang Elasticsearch index `bulletin-boards`.
- `server/src/main/resources/logback-spring.xml` — khi bật profile `logstash`, backend gửi log sang Logstash qua TCP.
- `server/pom.xml` — có dependency `spring-boot-starter-data-elasticsearch` và `logstash-logback-encoder`.
- `BulletinBoardService` **inject trực tiếp** `BulletinBoardElasticsearchRepository` → nếu tắt hẳn Elasticsearch, Spring Boot có khả năng **fail lúc khởi động**. Vì vậy: **giữ Elasticsearch, chỉ gỡ Kibana + Logstash**.
- Endpoint `/api/v1/bulletin-boards/search?address=...` (`BulletinBoardController.java`) phụ thuộc dữ liệu do Logstash đồng bộ — sau khi gỡ Logstash, endpoint này sẽ **không còn dữ liệu mới**, cần xử lý để không gây lỗi/trải nghiệm xấu khi demo.
- Các endpoint search chính đang dùng thực tế (`/api/v1/search`, `/api/v1/search/sort`, `/api/v1/search/latest`, `/api/v1/search/by-address` trong `SearchService.java`) dùng MySQL/JPA — **không bị ảnh hưởng**.

## Checklist

### 1. Gỡ Kibana + Logstash khỏi Docker Compose

- [x] **1.1. Mở `docker-compose.yml`**, xoá hoặc comment toàn bộ block service `kibana` và `logstash` (giữ nguyên `mysql`, `redis`, `elasticsearch`).

- [x] **1.2. Kiểm tra không còn service nào khác phụ thuộc (`depends_on`) vào `kibana`/`logstash`** — nếu có, gỡ dòng phụ thuộc đó ra.

- [x] **1.3. Xoá các biến môi trường không còn dùng trong `.env`** (nếu có khai báo riêng cho Kibana/Logstash port, ví dụ `KIBANA_PORT`, `LOGSTASH_PORT`) — có thể giữ lại nếu muốn bật lại sau này, nhưng thêm comment `# tạm không dùng (đã gỡ Kibana/Logstash)`.

### 2. Cấu hình lại Elasticsearch cho nhẹ và ổn định (single-node, không cần bảo mật cho demo)

- [x] **2.1. Sửa block `elasticsearch` trong `docker-compose.yml`** thành cấu hình tối giản:
  ```yaml
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.24
    container_name: rrms-elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    mem_limit: 1g
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - "127.0.0.1:${ELASTICSEARCH_PORT:-9200}:9200"
    networks:
      - rrms-network
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
  ```
  > **Bind về `127.0.0.1`** thay vì `0.0.0.0` — vì đã tắt `xpack.security.enabled`, nếu port 9200 lỡ mở ra internet công khai, bất kỳ ai cũng đọc/xoá được dữ liệu mà không cần đăng nhập. Bind localhost để chỉ backend chạy trên cùng VPS truy cập được, không lộ ra ngoài dù firewall có lỡ mở port này.
  >
  > `logging.max-size`/`max-file` giới hạn log Docker tối đa ~30MB cho service này, tránh disk 20GB của VPS bị log chiếm dần theo thời gian.
  > `discovery.type=single-node` tránh Elasticsearch cố tìm cluster (gây lỗi/chờ vô ích trên VPS 1 node). `xpack.security.enabled=false` tắt yêu cầu đăng nhập/HTTPS nội bộ giữa các node — phù hợp môi trường demo nội bộ, **không dùng cấu hình này nếu sau này mở Elasticsearch ra internet công khai**.
  >
  > **Lưu ý**: KHÔNG thêm `xpack.security.enrollment.enabled=false` — đây là setting của Elasticsearch **8.x**, không tồn tại ở bản `7.17.24` mà dự án đang dùng. Thêm vào sẽ khiến Elasticsearch báo lỗi "unknown setting" và container fail ngay lúc khởi động.

- [x] **2.2. Xác nhận `server/.env` hoặc `application-dev.properties` đang trỏ đúng Elasticsearch host/port** (thường là `localhost:9200` hoặc tên service `elasticsearch:9200` nếu backend cũng chạy trong Docker — dự án hiện tại backend chạy ngoài Docker nên dùng `localhost:9200`).

### 2b. Giảm RAM MySQL + bind port MySQL/Redis về localhost + giới hạn log (an toàn hơn cho VPS 2GB/20GB)

- [x] **2b.1. Sửa block `mysql` trong `docker-compose.yml`** — thêm giới hạn buffer pool và số connection, bind port về localhost, giới hạn log:
  ```yaml
  mysql:
    # ... giữ nguyên image, environment, volumes hiện có ...
    command: --innodb-buffer-pool-size=128M --max-connections=50
    ports:
      - "127.0.0.1:${MYSQL_PORT:-3306}:3306"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
  ```
  > `innodb-buffer-pool-size=128M` giới hạn RAM MySQL dùng để cache dữ liệu — mặc định MySQL có thể tự tăng theo RAM máy, gây cạnh tranh RAM với Elasticsearch/backend. `max-connections=50` đủ cho demo, giảm overhead RAM trên mỗi kết nối.

- [x] **2b.2. Sửa block `redis` trong `docker-compose.yml`** — bind port về localhost, giới hạn log:
  ```yaml
  redis:
    # ... giữ nguyên image, volumes hiện có ...
    ports:
      - "127.0.0.1:${REDIS_PORT:-6379}:6379"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
  ```

- [x] **2b.3. Vì sao bind về `127.0.0.1`**: MySQL/Redis/Elasticsearch không cần và không nên truy cập được từ internet — backend chạy trên cùng VPS vẫn kết nối bình thường qua `127.0.0.1:<port>`. Đây là lớp bảo vệ độc lập với `ufw` (Phần C) — kể cả nếu firewall lỡ cấu hình sai, port vẫn không lộ ra ngoài vì Docker chỉ bind nội bộ.

- [x] **2b.4. Nếu trước đó đã dùng DBeaver/MySQL Workbench kết nối trực tiếp từ máy local tới `YOUR_VPS_IP:3306`, việc bind localhost sẽ khiến cách này không còn hoạt động** — muốn xem dữ liệu từ xa sau khi bind, dùng SSH tunnel thay thế:
  ```bash
  ssh -L 3306:127.0.0.1:3306 ubuntu@YOUR_VPS_IP
  ```
  Sau đó kết nối Workbench/DBeaver vào `127.0.0.1:3306` trên máy local như bình thường.

### 3. Vô hiệu hoá logging gửi sang Logstash (tránh lỗi/log rác khi Logstash không còn tồn tại)

- [x] **3.1. Mở `server/src/main/resources/logback-spring.xml`**, tìm phần cấu hình liên quan đến profile `logstash` (thường là 1 `<springProfile name="logstash">` bọc quanh appender TCP gửi log ra port 5000).

- [x] **3.2. Xác nhận `SPRING_PROFILES_ACTIVE` trong `.env`/`server/.env` KHÔNG kích hoạt profile `logstash`** (hiện tại đang là `dev` — đúng, không cần đổi gì nếu chưa từng bật `logstash`).

- [x] **3.3. Nếu từng test với profile `logstash` được bật ở đâu đó (properties, script chạy, biến môi trường CI/CD), gỡ bỏ profile này** để tránh Spring Boot cố kết nối tới cổng 5000 không còn ai lắng nghe (thường chỉ gây log lỗi liên tục, không crash app, nhưng nên dọn cho sạch).

### 4. Xử lý endpoint `/api/v1/bulletin-boards/search` (không còn dữ liệu mới đồng bộ)

**Khuyến nghị: làm Phương án B** (sửa code) thay vì chỉ ghi chú bỏ qua — tránh để lại một API "vấp" bất ngờ nếu vô tình được demo hoặc gọi thử.

- [x] **Phương án B (khuyến nghị — sửa endpoint dùng MySQL/JPA thay vì Elasticsearch):**
  - [x] Sửa `BulletinBoardController.java` (dòng ~155) để endpoint `/api/v1/bulletin-boards/search` gọi sang service dùng MySQL/JPA (giống cách `/api/v1/search/by-address` đang làm trong `SearchService.java`) thay vì gọi `BulletinBoardElasticsearchRepository`.
  - [x] Test lại bằng Postman/curl: `GET /api/v1/bulletin-boards/search?address=...` trả về đúng dữ liệu từ MySQL.
  - [x] **Không xoá** dependency `spring-boot-starter-data-elasticsearch` hay interface `BulletinBoardElasticsearchRepository` khỏi code lúc này — vì `BulletinBoardService` vẫn đang inject nó; xoá vội sẽ gây lỗi compile/startup. Chỉ đơn giản là đổi controller để không gọi tới nó ở endpoint này nữa. Muốn dọn dẹp triệt để (xoá hẳn Elasticsearch khỏi dự án) cần một đợt refactor riêng, không nằm trong phạm vi B0.

- [ ] **Phương án A (dự phòng, chỉ dùng nếu không kịp sửa code trước demo):** không sửa code, chỉ ghi chú lại trong README/docs rằng endpoint `/api/v1/bulletin-boards/search` sẽ trả kết quả rỗng hoặc dữ liệu cũ vì không còn Logstash đồng bộ. Tránh bấm vào tính năng này khi demo trước người xem.

### 5. Test lại toàn bộ ở local trước khi build cho VPS

- [x] **5.1. Chạy hạ tầng đã gỡ Kibana/Logstash:**
  ```bash
  docker compose up -d mysql redis elasticsearch
  docker compose ps
  ```
  Xác nhận chỉ có 3 container này chạy, không còn `kibana`/`logstash`.

- [x] **5.2. Kiểm tra Elasticsearch khởi động thành công:**
  ```bash
  curl http://localhost:9200
  ```
  Phải trả về JSON có `"cluster_name"`, `"tagline": "You Know, for Search"` — không lỗi kết nối.

- [x] **5.3. Chạy backend, xác nhận KHÔNG có lỗi lúc khởi động liên quan Elasticsearch/Logstash:**
  ```bash
  cd server
  ./mvnw spring-boot:run
  ```
  Theo dõi log: không có exception dạng `NoNodeAvailableException`, `Connection refused: connect` tới port 5000, hay lỗi khởi tạo bean `BulletinBoardElasticsearchRepository`.

- [x] **5.4. Test nhanh các chức năng chính** (đăng nhập, CRUD, search chính `/api/v1/search`, `/api/v1/search/by-address`...) để đảm bảo không bị ảnh hưởng.

- [x] **5.5. Test endpoint `/api/v1/bulletin-boards/search`** theo đúng phương án đã chọn ở Bước 4 (rỗng có kiểm soát, hoặc đã sửa dùng MySQL).

- [x] **5.6. Commit các thay đổi vào GitHub:**
  ```bash
  git add .
  git commit -m "Remove Kibana/Logstash, optimize Elasticsearch config for VPS deploy"
  git push
  ```

## Kết quả Phần B0

Khi tất cả các mục trên đã tick `[x]`: `docker-compose.yml` chỉ còn `mysql`, `redis`, `elasticsearch` (đã giới hạn RAM); backend khởi động không lỗi; endpoint bulletin-boards search đã được xử lý theo phương án phù hợp. Sẵn sàng tiếp tục **`Phan_B_VPS_Setup.md`** với hạ tầng đã gọn nhẹ, phù hợp VPS 2GB RAM (Cloud Server Linux 2).

> Lưu ý khi sang `Phan_B_VPS_Setup.md`: ở bước "khởi động hạ tầng bằng Docker Compose" trên VPS, đổi lệnh thành:
> ```bash
> docker compose up -d mysql redis elasticsearch
> ```
> (bỏ `kibana` và `logstash` khỏi lệnh). Đồng thời thêm bước tạo swap file 2GB trên VPS trước khi chạy Docker Compose, để tránh OOM khi RAM chạm ngưỡng:
> ```bash
> sudo fallocate -l 2G /swapfile
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```