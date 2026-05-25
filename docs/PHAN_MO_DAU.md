# BÁO CÁO ĐỒ ÁN TỐT NGHIỆP: PHẦN MỞ ĐẦU

---

## LỜI CAM ĐOAN

Tôi xin cam đoan đây là công trình nghiên cứu khoa học độc lập của bản thân tôi dưới sự hướng dẫn chuyên môn của Giáo viên hướng dẫn. Các kết quả, số liệu thực nghiệm, sơ đồ thiết kế và mã nguồn chương trình được trình bày trong đồ án này là hoàn toàn trung thực, khách quan và chưa từng được công bố trong bất kỳ công trình khoa học hay luận văn, đồ án tốt nghiệp của tác giả nào khác.

Mọi tài liệu tham khảo, số liệu trích dẫn từ các nguồn nghiên cứu trong và ngoài nước đều được chỉ rõ nguồn gốc, dịch thuật trung thực và liệt kê đầy đủ trong danh mục tài liệu tham khảo của đồ án. Tôi xin chịu hoàn toàn trách nhiệm trước Hội đồng khoa học của Nhà trường và pháp luật về tính xác thực của những lời cam đoan trên.

*Hà Nội, ngày 22 tháng 05 năm 2026*

**Tác giả đồ án**

*(Ký và ghi rõ họ tên)*

---

## LỜI CẢM ƠN

Trước hết, tôi xin bày tỏ lòng biết ơn chân thành và sâu sắc nhất tới Giáo viên hướng dẫn – người đã luôn dành thời gian quý báu để định hướng đề tài, rà soát từng nội dung thiết kế, tận tình chỉ dẫn và động viên tôi trong suốt quá trình nghiên cứu và thực hiện đề tài tốt nghiệp này. Những lời khuyên và nhận xét chuyên môn định hướng của Thầy/Cô là bài học khoa học vô giá đối với tôi.

Tôi xin chân thành cảm ơn Ban Giám hiệu Nhà trường, Ban chủ nhiệm Khoa Công nghệ Thông tin cùng toàn thể quý Thầy Cô giáo đã truyền đạt những kiến thức nền tảng và chuyên sâu quý báu trong suốt quá trình tôi học tập và rèn luyện tại trường. Những tri thức đó chính là bệ phóng giúp tôi hoàn thành nghiên cứu thực tiễn này.

Cuối cùng, tôi xin gửi lời cảm ơn sâu sắc tới gia đình, bạn bè và các đồng nghiệp trong đội ngũ dự án phát triển RRMS, những người đã luôn hỗ trợ, tạo điều kiện thuận lợi nhất về mặt tinh thần, thời gian và chia sẻ chuyên môn để tôi có thể tập trung hoàn thành đồ án một cách trọn vẹn nhất.

Mặc dù đã có nhiều cố gắng rà soát và hoàn thiện hệ thống một cách kỹ lưỡng, song do giới hạn về mặt thời gian cũng như kinh nghiệm thực tiễn, đồ án chắc chắn không tránh khỏi những thiếu sót nhất định. Tôi rất mong nhận được những ý kiến đóng góp, chỉ bảo quý báu của quý Thầy Cô trong Hội đồng khoa học để đề tài ngày càng được hoàn thiện và có khả năng ứng dụng thực tế cao hơn.

*Tôi xin chân thành cảm ơn!*

---

## TÓM TẮT ĐỒ ÁN

Đề tài **"Thiết kế và xây dựng Hệ thống Quản lý Nhà trọ Đa nền tảng RRMS (Rental Room Management System)"** tập trung giải quyết các bất cập và tối ưu hóa quy trình vận hành của mô hình cho thuê nhà ở truyền thống tại Việt Nam hiện nay. RRMS xây dựng một hệ sinh thái chuyển đổi số toàn diện kết nối trực tiếp ba nhóm đối tượng: Chủ nhà trọ (Host), Khách thuê trọ (Tenant) và Người môi giới (Broker). 

Về mặt công nghệ, hệ thống triển khai kiến trúc đa nền tảng vững chắc bao gồm:
* **Backend Spring Boot 3.3.3 & Java 17:** Đóng vai trò xử lý logic tập trung, quản lý giao dịch CSDL thông qua Spring Data JPA/Hibernate.
* **Web Frontend React JS (Vite):** Cung cấp giao diện quản trị Admin chuyên sâu, trực quan cho chủ nhà trọ thực hiện các tác vụ quản lý khu trọ, hóa đơn, dịch vụ và xem biểu đồ báo cáo tài chính.
* **Mobile App React Native (Expo SDK 54):** Được thiết kế tối ưu bằng TypeScript với cấu trúc định tuyến Expo Router và Zustand, đem lại trải nghiệm tìm kiếm phòng, cọc giữ chỗ và thanh toán trực tuyến mượt mà cho khách thuê.
* **Các dịch vụ tối ưu hiệu năng:** Sử dụng bộ nhớ đệm **Redis** để lưu trữ cấu hình tĩnh, xử lý OTP với cơ chế TTL và giới hạn tần suất yêu cầu (Rate Limiting). Sử dụng **Elasticsearch** xây dựng công cụ tìm kiếm toàn văn (Full-text Search) đa tiêu chí tốc độ cao dựa trên chỉ mục đảo ngược (Inverted Index).
* **Bảo mật & Tích hợp cổng thanh toán:** Triển khai cơ chế xác thực không trạng thái (Stateless Authentication) với cặp **JWT (Access & Refresh Token)**, xác thực liên kết **OAuth2 Google Login**, và tích hợp đồng thời 4 cổng thanh toán **Stripe**, **PayPal**, **VNPay**, **MoMo** có cơ chế verify chữ ký số Webhook/IPN.

Kết quả nghiên cứu thực nghiệm cho thấy hệ thống hoạt động ổn định, giải quyết triệt để vấn đề N+1 query trên CSDL quan hệ MySQL, giảm thiểu tối đa các rủi ro bảo mật OTP, tự động hóa tới 70% các tác vụ tính toán hóa đơn thủ công và tạo ra một môi trường giao dịch minh bạch, an toàn không dùng tiền mặt giữa chủ trọ và khách thuê.

* **Từ khóa:** RRMS, Spring Boot, React, React Native, Redis, Elasticsearch, Cổng thanh toán, Webhook, JWT.

---

## ABSTRACT

The graduation thesis titled **"Design and Development of RRMS - a Cross-platform Rental Room Management System"** addresses the critical operational inefficiencies and lack of transparency in traditional residential rental management in Vietnam. RRMS introduces a comprehensive digital transformation ecosystem connecting Hosts, Tenants, and Brokers.

Architecturally, the system is designed with advanced industry standards:
* **Backend Spring Boot 3.3.3 & Java 17:** Serving as a centralized server managing complex business logics and database transactions using Spring Data JPA/Hibernate.
* **Web Frontend React JS (Vite):** Providing a professional dashboard for Hosts to manage motels, rooms, services, digital contracts, and financial reports with rich analytics charts.
* **Mobile App React Native (Expo SDK 54):** Built on TypeScript, styled with custom UI components, routed with Expo Router, and managed by Zustand to deliver native performance for Tenants in searching motels, reserving rooms, and making online payments.
* **Performance Optimizations:** Leveraging **Redis** for configurations caching, OTP validation with TTL, and Rate Limiting; and utilizing **Elasticsearch** to implement high-speed, multi-criteria spatial and text search based on Inverted Indexes.
* **Security & Payment Integrations:** Ensuring robust security via stateless authentication using **JWT (Access & Refresh Token)**, **OAuth2 Google Sign-in**, and integrating 4 payment gateways (**Stripe**, **PayPal**, **VNPay**, **MoMo**) with digital signature verification via Webhook/IPN APIs.

Experimental results demonstrate that RRMS successfully eliminates database performance bottlenecks like the N+1 query problem, mitigates security risks, automates up to 70% of billing workflows, and establishes a secure cashless transaction platform.

* **Keywords:** RRMS, Spring Boot, React, React Native, Redis, Elasticsearch, Payment Gateway, Webhook, JWT.

---

## MỤC LỤC CHI TIẾT (TABLE OF CONTENTS)

```
LỜI CAM ĐOAN .................................................................................... i
LỜI CẢM ƠN ..................................................................................... ii
TÓM TẮT ĐỒ ÁN ................................................................................. iii
ABSTRACT .......................................................................................... iv
MỤC LỤC CHI TIẾT .............................................................................. v
DANH MỤC KÝ HIỆU VÀ TỪ VIẾT TẮT ..................................................... vii
DANH MỤC BẢNG BIỂU ......................................................................... viii
DANH MỤC HÌNH VẼ VÀ SƠ ĐỒ ............................................................. ix

CHƯƠNG I: GIỚI THIỆU CHUNG (INTRODUCTION) ........................................ 1
  1.1. ĐẶT VẤN ĐỀ VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI .................................. 1
  1.2. MỤC TIÊU NGHIÊN CỨU ......................................................... 4
  1.3. ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU ......................................... 6
  1.4. PHƯƠNG PHÁP NGHIÊN CỨU .................................................... 9
  1.5. Ý NGHĨA KHOA HỌC VÀ THỰC TIỄN .......................................... 11
  1.6. BỐ CỤC CỦA ĐỒ ÁN ............................................................ 13

CHƯƠNG II: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG ........................... 15
  2.1. NỀN TẢNG PHÁT TRIỂN ỨNG DỤNG PHÍA CLIENT ............................... 15
    2.1.1. Kiến trúc Web Single Page Application (SPA) và React JS .............. 15
    2.1.2. Nền tảng di động đa nền tảng React Native và Expo SDK .............. 19
  2.2. KIẾN TRÚC BACKEND SPRING BOOT VÀ HỆ QUẢN TRỊ CSDL .................. 22
    2.2.1. Spring Boot Framework và Kiến trúc phân lớp .......................... 22
    2.2.2. Cơ chế JPA/Hibernate trong quản lý giao dịch CSDL ................... 24
  2.3. CƠ CHẾ CACHING VÀ LƯU TRỮ VỚI REDIS SERVER .............................. 27
  2.4. CÔNG NGHỆ TÌM KIẾM TOÀN VĂN VỚI ELASTICSEARCH ........................ 30
  2.5. CƠ CHẾ BẢO MẬT: OAUTH2, JWT VÀ CHỮ KÝ SỐ ............................... 33
  2.6. QUY TRÌNH HOẠT ĐỘNG CỦA CÁC CỔNG THANH TOÁN TRỰC TUYẾN ........... 38

CHƯƠNG III: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ...................................... 45
  3.1. ĐẶC TẢ CA SỬ DỤNG (USE CASE DIAGRAM) ..................................... 45
  3.2. CÁC QUYỀN TRUY CẬP PHẦN MỀM (AUTHORIZATION & ROLES) ............... 52
  3.3. SƠ ĐỒ THỰC THỂ LIÊN KẾT (ERD & EER) ...................................... 55
  3.4. BIỂU ĐỒ DÒNG DỮ LIỆU (DATA FLOW DIAGRAM) ................................. 59
  3.5. BIỂU ĐỒ LỚP CHI TIẾT (CLASS DIAGRAM) ........................................ 62
  3.6. BIỂU ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAM) ........................................ 68
  3.7. BIỂU ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM) ........................................ 85

CHƯƠNG IV: THIẾT KẾ GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG ............... 95
  4.1. SƠ ĐỒ TRANG WEB (SITEMAP) .................................................. 95
  4.2. HỆ THỐNG THIẾT KẾ FIGMA (DESIGN SYSTEM) .................................. 98
  4.3. CHI TIẾT MÀN HÌNH CHỨC NĂNG (MOCKUPS & SCREENS) ...................... 105

CHƯƠNG V: THIẾT KẾ CƠ SỞ DỮ LIỆU CHI TIẾT ....................................... 112
  5.1. THIẾT KẾ LOGIC CÁC BẢNG DỮ LIỆU (DATA SCHEMAS) ......................... 112
    5.1.1. Bảng Accounts (Tài khoản người dùng) .................................. 112
    5.1.2. Bảng Auth (Thông tin đăng nhập liên kết) .............................. 113
    5.1.3. Bảng Roles & Permissions (Quyền hạn) ................................. 114
    5.1.4. Bảng Motels (Thông tin khu trọ) ........................................ 115
    5.1.5. Bảng Rooms (Thông tin chi tiết phòng) ................................. 116
    5.1.6. Bảng Contracts (Hợp đồng thuê nhà) .................................... 118
    5.1.7. Bảng Invoices (Hóa đơn dịch vụ hàng tháng) ............................. 120
    5.1.8. Bảng Payments (Lịch sử thanh toán giao dịch) .......................... 122
    5.1.9. Các bảng liên quan thiết bị và dịch vụ phụ trợ ......................... 124

CHƯƠNG VI: TRIỂN KHAI VÀ XÂY DỰNG DỰ ÁN ........................................... 135
  6.1. HIỆN THỰC HÓA GIAO DIỆN (FRONTEND & MOBILE IMPLEMENTATION) .......... 135
  6.2. HIỆN THỰC HÓA LOGIC (BACKEND IMPLEMENTATION) .......................... 145
  6.3. QUY TRÌNH TRIỂN KHAI HỆ THỐNG (DEPLOYMENT & DEV OPS) ................... 158

CHƯƠNG VII: KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG ...................................... 165
  7.1. KIỂM THỬ ĐƠN VỊ & KIỂM THỬ TÍCH HỢP (UNIT & INTEGRATION TESTS) ........ 165
  7.2. KỊCH BẢN KIỂM THỬ CHỨC NĂNG (TEST CASES) ................................. 172

CHƯƠNG VIII: TỔNG KẾT VÀ HƯỚNG PHÁT TRIỂN ..................................... 185
  8.1. KẾT QUẢ ĐẠT ĐƯỢC .............................................................. 185
  8.2. HẠN CHẾ CỦA ĐỀ TÀI ........................................................... 187
  8.3. HƯỚNG PHÁT TRIỂN DÀI HẠN .................................................... 189
  8.4. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH ............................................. 191

TÀI LIỆU THAM KHẢO ....................................................................... 195
```

---

## DANH MỤC KÝ HIỆU VÀ TỪ VIẾT TẮT

| Từ viết tắt | Thuật ngữ Tiếng Anh | Định nghĩa / Giải nghĩa |
|---|---|---|
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng |
| **CRUD** | Create, Read, Update, Delete | Các thao tác cơ bản trên dữ liệu (Thêm, Đọc, Sửa, Xóa) |
| **DB** | Database | Cơ sở dữ liệu |
| **DBMS** | Database Management System | Hệ quản trị cơ sở dữ liệu |
| **DFD** | Data Flow Diagram | Biểu đồ luồng dữ liệu |
| **DTO** | Data Transfer Object | Đối tượng chuyển đổi dữ liệu giữa các tầng kiến trúc |
| **ERD** | Entity Relationship Diagram | Biểu đồ quan hệ thực thể |
| **EER** | Enhanced Entity Relationship | Biểu đồ quan hệ thực thể mở rộng |
| **FK** | Foreign Key | Khóa ngoại |
| **PK** | Primary Key | Khóa chính |
| **IDE** | Integrated Development Environment | Môi trường phát triển tích hợp (VS Code, IntelliJ IDEA...) |
| **IT** | Information Technology | Công nghệ thông tin |
| **JS / TS** | JavaScript / TypeScript | Ngôn ngữ lập trình kịch bản phía Client |
| **JWT** | JSON Web Token | Tiêu chuẩn mã hóa token xác thực dạng JSON |
| **SPA** | Single Page Application | Ứng dụng web chạy trên một trang đơn |
| **MPA** | Multi-page Application | Ứng dụng web truyền thống chạy trên nhiều trang |
| **JSI** | JavaScript Interface | Giao diện tương tác trực tiếp JS-Native trong React Native |
| **OTP** | One-Time Password | Mật khẩu xác thực một lần |
| **TTL** | Time-To-Live | Thời gian tồn tại tự động của dữ liệu trong RAM |
| **RBAC** | Role-Based Access Control | Kiểm soát truy cập dựa trên vai trò |
| **SRS** | Software Requirements Specification | Đặc tả yêu cầu phần mềm |
| **UI / UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng |
| **AWS** | Amazon Web Services | Dịch vụ điện toán đám mây của Amazon |
| **CDC** | Change Data Capture | Cơ chế bắt giữ thay đổi dữ liệu theo thời gian thực |
| **HMAC** | Hash-based Message Authentication Code | Mã xác thực thông điệp dựa trên hàm băm |
| **IPN** | Instant Payment Notification | Thông báo trạng thái thanh toán tức thời từ cổng giao dịch |
| **PCI-DSS** | Payment Card Industry Data Security Standard | Tiêu chuẩn bảo mật dữ liệu thẻ thanh toán quốc tế |

---

## DANH MỤC BẢNG BIỂU (LIST OF TABLES)

* **Bảng 1.1**: Đánh giá tổng hợp chất lượng các thành phần trong dự án RRMS (Chương I - Trang 3)
* **Bảng 1.2**: Các chức năng đã hoàn thành và chưa hoàn thành của Web, Backend và Mobile (Chương I - Trang 7)
* **Bảng 1.3**: Phân tích các luồng xử lý cần sửa đổi và bổ sung trong hệ thống (Chương I - Trang 8)
* **Bảng 1.4**: Phân chia công việc và lộ trình Roadmap chi tiết các Phase dự án (Chương I - Trang 10)
* **Bảng 2.1**: Cấu trúc chỉ mục đảo ngược (Inverted Index) của Elasticsearch (Chương II - Trang 31)
* **Bảng 3.1**: Phân tích quyền truy cập (Matrix Roles & Permissions) của các tác nhân (Chương III - Trang 53)
* **Bảng 5.1**: Chi tiết cấu trúc vật lý bảng `Accounts` trong CSDL MySQL (Chương V - Trang 112)
* **Bảng 5.2**: Chi tiết cấu trúc vật lý bảng `Auth` trong CSDL MySQL (Chương V - Trang 113)
* **Bảng 5.3**: Chi tiết cấu trúc vật lý bảng `Motels` trong CSDL MySQL (Chương V - Trang 115)
* **Bảng 5.4**: Chi tiết cấu trúc vật lý bảng `Rooms` trong CSDL MySQL (Chương V - Trang 117)
* **Bảng 5.5**: Chi tiết cấu trúc vật lý bảng `Contracts` trong CSDL MySQL (Chương V - Trang 119)
* **Bảng 5.6**: Chi tiết cấu trúc vật lý bảng `Invoices` trong CSDL MySQL (Chương V - Trang 121)
* **Bảng 7.1**: Kịch bản kiểm thử (Test Case) cho tính năng xác thực đăng nhập (Chương VII - Trang 173)
* **Bảng 7.2**: Kịch bản kiểm thử (Test Case) cho tính năng đăng ký tài khoản (Chương VII - Trang 175)

---

## DANH MỤC HÌNH VẼ VÀ SƠ ĐỒ (LIST OF FIGURES)

* **Hình 1.1**: Sơ đồ cấu trúc kiến trúc hệ thống hiện tại của dự án RRMS (Chương I - Trang 4)
* **Hình 1.2**: Sơ đồ đề xuất kiến trúc hệ thống tổng thể dài hạn cho RRMS (Chương I - Trang 5)
* **Hình 2.1**: So sánh luồng xử lý giữa kiến trúc MPA truyền thống và kiến trúc SPA hiện đại (Chương II - Trang 16)
* **Hình 2.2**: Mô phỏng sự khác biệt giữa kiến trúc Bridge-based và kiến trúc JSI mới trong React Native (Chương II - Trang 20)
* **Hình 2.3**: Kiến trúc phân lớp logic phần mềm phía Backend Spring Boot (Chương II - Trang 23)
* **Hình 2.4**: Sơ đồ trạng thái vòng đời của một thực thể (Entity Lifecycle) trong JPA/Hibernate (Chương II - Trang 25)
* **Hình 2.5**: Luồng xử lý Caching và ghi đè dữ liệu giữa Spring Boot, Redis và MySQL (Chương II - Trang 28)
* **Hình 2.6**: Mô hình đồng bộ dữ liệu CDC từ MySQL sang công cụ tìm kiếm Elasticsearch (Chương II - Trang 32)
* **Hình 2.7**: Luồng xác thực không trạng thái (Stateless Authentication) sử dụng Access & Refresh Token (Chương II - Trang 34)
* **Hình 2.8**: Sơ đồ tuần tự các bước xác thực liên kết OAuth2 qua máy chủ Google (Chương II - Trang 36)
* **Hình 2.9**: Quy trình tuần tự xử lý giao dịch thanh toán trực tuyến tổng quát và verify Webhook (Chương II - Trang 39)
* **Hình 3.1**: Biểu đồ ca sử dụng (Use Case Diagram) tổng thể hệ thống quản lý nhà trọ RRMS (Chương III - Trang 46)
* **Hình 3.2**: Sơ đồ Use Case chi tiết dành cho vai trò Chủ nhà trọ (Host) (Chương III - Trang 48)
* **Hình 3.3**: Sơ đồ Use Case chi tiết dành cho vai trò Khách thuê trọ (Tenant) (Chương III - Trang 50)
* **Hình 3.4**: Sơ đồ mô hình dữ liệu thực thể liên kết mở rộng (EERD) của hệ thống (Chương III - Trang 56)
* **Hình 3.5**: Sơ đồ biểu đồ dòng dữ liệu (DFD) mức 1 của hệ thống (Chương III - Trang 60)
* **Hình 3.6**: Biểu đồ lớp (Class Diagram) các thực thể cốt lõi trong hệ thống (Chương III - Trang 63)
* **Hình 3.7**: Biểu đồ hoạt động (Activity Diagram) của nghiệp vụ tạo hợp đồng thuê phòng (Chương III - Trang 70)
* **Hình 3.8**: Biểu đồ tuần tự (Sequence Diagram) luồng đặt phòng và thanh toán đặt cọc trực tuyến (Chương III - Trang 86)
* **Hình 4.1**: Sơ đồ phân cấp cấu trúc trang web (Sitemap) dành cho Host và Admin (Chương IV - Trang 96)
* **Hình 4.2**: Thiết kế Wireframe các màn hình chính trên nền tảng di động Android/iOS (Chương IV - Trang 101)
* **Hình 6.1**: Giao diện thực tế trang Dashboard thống kê doanh thu trên Web Admin (Chương VI - Trang 115)
* **Hình 6.2**: Giao diện thực tế bản đồ tìm kiếm và định vị nhà trọ trên ứng dụng di động (Chương VI - Trang 128)
