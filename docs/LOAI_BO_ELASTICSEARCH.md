# Loại bỏ Elasticsearch / ELK — ghi chép thay đổi

**Ngày:** 2026-07-16  
**Lý do:** VPS cấu hình thấp (~2GB RAM). Elasticsearch chiếm ~400–512MB heap (+ overhead container ~1GB limit) — quá lớn so với nhu cầu demo/production nhỏ.  
**Hướng thay thế:** Tìm kiếm thông thường qua **MySQL + Spring Data JPA** (`LIKE` / filter), không dùng inverted index Elasticsearch.

Tài liệu liên quan đã cập nhật vận hành: `DOCKER_COMPOSE.md`, `Phan b vps setup.md`, `Phan a github.md`, `DANH_SACH_CHUC_NANG_BACKEND.md` (A-11).

---

## 1. Kết quả rà soát trước khi gỡ

| Khu vực | Trạng thái trước khi gỡ hẳn |
|---|---|
| Frontend (`client`) | Đã gọi `/api/v1/search*` — **không** phụ thuộc ES client |
| Mobile | `/api/v1/search/by-address` — MySQL |
| Backend search chính | `SearchService` đã dùng `BulletinBoardRepository` (JPA) |
| Backend bulletin search | `BulletinBoardService.searchBulletinBoards` đã chuyển sang JPA `findByAddress` |
| Docker | Vẫn còn service `elasticsearch` (và comment Kibana/Logstash) |
| CI/CD (`.github/workflows`) | **Không** chạy container ES |
| Deploy VPS docs | Vẫn hướng dẫn `docker compose up … elasticsearch` và health-check `:9200` |
| Tests | `RrmsApplicationTests` còn `@MockBean` ES repo (sẽ vỡ khi xóa repo) |

---

## 2. Những gì ĐÃ XÓA

### 2.1. Backend — source & dependency

| File / thành phần | Hành động |
|---|---|
| `server/src/main/java/.../repositories/BulletinBoardElasticsearchRepository.java` | **Xóa** — Spring Data ES repo fuzzy match `address` |
| `server/src/main/java/.../repositories/RoomRepositoryElasticsearch.java` | **Xóa** — ES repo search room theo address / fuzzy |
| `server/pom.xml` | **Gỡ** `spring-boot-starter-data-elasticsearch` (đã gỡ trước) và **gỡ** `logstash-logback-encoder` |
| `server/src/main/resources/application.properties` | **Xóa** `spring.elasticsearch.*`, `spring.data.elasticsearch.repositories.enabled` |
| `server/src/main/resources/logback-spring.xml` | **Gỡ** profile `logstash` (TCP appender sang Logstash) |
| `server/src/main/resources/application-dev.properties` | **Xóa** comment hướng dẫn bật profile `logstash` |
| `server/logstash/**` | **Xóa toàn bộ** (`config/logstash.yml`, `pipeline/logstash.conf`, `pipeline/bulletin_board.conf`, `lib/.gitkeep`) — đồng bộ MySQL→ES + log ship |
| `RoomReservationService.java` | Thay `commons-codec` Hex (trước là transitive từ ES/Logstash) bằng `java.util.HexFormat` |

### 2.2. Code chết / comment Elasticsearch (dọn)

| File | Hành động |
|---|---|
| `SearchController.java` | Xóa các endpoint comment: `/address`, `/addressFuzzy`, `/nocache/address`, `/addressNoElastic` |
| `SearchService.java` | Xóa method comment gọi `roomRepositoryElasticsearch`; bỏ inject `SearchRepository` không dùng |
| `ISearchService.java` | Xóa chữ ký method ES comment |
| `RrmsApplicationTests.java` | Xóa `@MockBean BulletinBoardElasticsearchRepository` |
| `SearchServiceTest.java` | Xóa `@Mock SearchRepository` thừa |
| `BulletinBoardServiceTest.java` | Xóa import comment `ResourceNotFoundException` của ES |
| `application-test.properties`, `test.properties` | Xóa cấu hình / comment giả lập ES |

### 2.3. Docker / env / script

| File | Hành động |
|---|---|
| `docker-compose.yml` | **Xóa** service `elasticsearch`, volume `elasticsearch_data`, toàn bộ block comment Kibana/Logstash/backend/frontend phụ thuộc ES |
| `.env.example` | **Xóa** `ELASTICSEARCH_PORT`, `KIBANA_PORT`, `LOGSTASH_PORT` |
| `scripts/prepare-docker.sh` | Không còn tải MySQL JDBC jar cho Logstash (no-op) |
| `README.md` | Gỡ badge Elasticsearch / Logstash / Kibana |

### 2.4. Endpoint / path không còn tồn tại

Các path REST cũ (chỉ còn trong `client/rest_api/search.rest` trước khi sửa) **không còn** trên backend:

- `GET /searchs/address` (ES)
- `GET /searchs/addressFuzzy` (ES)
- `GET /searchs/nocache/address` (ES)

---

## 3. Những gì ĐÃ THAY THẾ (tìm kiếm thông thường)

### 3.1. Mapping chức năng

| Trước (Elasticsearch) | Sau (MySQL / JPA) |
|---|---|
| Index `bulletin-boards` + Logstash JDBC sync | Bảng `bulletin_boards` (source of truth) |
| `BulletinBoardElasticsearchRepository.findByAddress` (fuzzy) | `BulletinBoardRepository.findByAddress` (`LIKE`) |
| `RoomRepositoryElasticsearch` address / fuzzy | Không dùng (public search theo **BulletinBoard**) |
| Fuzzy / analyzer ES | `LIKE '%keyword%'` trên `title`, `address`, `description` |

### 3.2. API giữ nguyên (frontend/mobile không đổi URL)

| Method | Path | Triển khai hiện tại |
|---|---|---|
| GET | `/api/v1/search` | `BulletinBoardRepository.searchActiveBulletinBoards` + filter category Java |
| GET | `/api/v1/search/sort` | Order by `rentPrice` ASC/DESC |
| GET | `/api/v1/search/latest` | Active, newest first |
| GET | `/api/v1/search/oldest` | Active, oldest style |
| GET | `/api/v1/search/by-address` | `findByAddress` (LIKE) |
| GET | `/api/v1/bulletin-boards/search?address=` | Cùng JPA `findByAddress` |

### 3.3. Database

- Giữ nguyên schema; FULLTEXT index `ft_bb_search(title, description, address)` trong Flyway **vẫn có** (có thể dùng sau với `MATCH … AGAINST`).
- Hiện repository dùng **`LIKE`**, không bắt buộc FULLTEXT.

### 3.4. Frontend / Mobile / CI

| Thành phần | Thay đổi |
|---|---|
| `client/src/apis/searchAPI.js` | **Giữ** — đã đúng path MySQL |
| UI `/search` | **Giữ** |
| Mobile `SEARCH.ADDRESS` | **Giữ** |
| `.github/workflows/ci.yml`, `deploy.yml` | **Không cần** thêm/bớt service ES (vốn không có) |
| `client/rest_api/search.rest` | **Cập nhật** sang `/api/v1/search*` |

---

## 4. Việc cần làm trên VPS sau khi pull code

```bash
cd /var/www/rrms
git pull

# Dừng và gỡ container ES/Kibana/Logstash nếu còn
docker compose rm -sf elasticsearch kibana logstash 2>/dev/null || true
docker volume rm rrms_elasticsearch_data 2>/dev/null || true

# Chỉ chạy hạ tầng còn lại
docker compose up -d mysql redis

# Xóa biến cũ khỏi .env (nếu có): ELASTICSEARCH_PORT, KIBANA_PORT, LOGSTASH_PORT, ELASTIC_SEARCH_URL
# Đảm bảo SPRING_PROFILES_ACTIVE không còn ",logstash"

# Build & restart backend như quy trình CI/systemd hiện tại
```

Ước tính RAM giải phóng: **~400MB–1GB** so với lúc ES chạy.

---

## 5. Docs lịch sử (chưa viết lại toàn bộ luận văn)

Các file lý thuyết/deploy cũ vẫn có thể **đề cập Elasticsearch** (phục vụ lịch sử đồ án). Khi đọc vận hành thực tế, ưu tiên tài liệu này:

| File | Ghi chú |
|---|---|
| `Phan b0 xu ly elk.md` | **Lịch sử** bước gỡ Kibana/Logstash, *giữ* ES — đã bị thay bởi việc gỡ hẳn ES |
| `CHUONG_2_…` §2.4, `PHAN_MO_DAU.md`, `CHUONG_1_…` | Lý thuyết ES — cập nhật luận văn khi cần nộp bản cuối |
| `SENIOR_REVIEW_OVERVIEW.md`, `RA_SOAT_…`, `Deploy.md`, `Phan g…`, `Phan K…` | Có đoạn ES / “tắt tạm ES” — vận hành mới: **không bật lại ES** |
| DrawIO kiến trúc | Node Elasticsearch còn trên sơ đồ — cập nhật khi vẽ lại |

---

## 6. Kiểm thử sau khi gỡ

- [x] `mvn test` — `RrmsApplicationTests` + `SearchServiceTest` **BUILD SUCCESS** (không còn phụ thuộc ES)
- [ ] Gọi thủ công: `GET /api/v1/search?query=...`
- [ ] `GET /api/v1/search/by-address?address=...`
- [ ] `GET /api/v1/bulletin-boards/search?address=...`
- [ ] Frontend trang Search vẫn load danh sách
- [ ] VPS: `docker compose ps` chỉ còn `mysql`, `redis` (+ monitoring nếu có)

---

## 7. Trade-off chấp nhận

| Mất đi | Đánh đổi được |
|---|---|
| Fuzzy / typo tolerance (Levenshtein) | Tiết kiệm RAM VPS |
| Analyzer / không dấu nâng cao | Giảm độ phức tạp sync Logstash |
| Search scale triệu bản ghi | Phù hợp data demo / SMB |
| ELK log aggregation | Log local / journald đủ dùng |

Nếu sau này scale lớn: ưu tiên bật MySQL `FULLTEXT` (`ft_bb_search`) trước khi đưa lại Elasticsearch.
