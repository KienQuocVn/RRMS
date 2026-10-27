# CHƯƠNG IV: TRIỂN KHAI VÀ HIỆN THỰC HÓA HỆ THỐNG

## 4.1. Mục tiêu và phạm vi triển khai

Chương này trình bày cách hiện thực hóa hệ thống RRMS từ thiết kế ở Chương III, tập trung vào ba thành phần trong mã nguồn: backend, ứng dụng web và ứng dụng mobile. Nội dung được tổng hợp từ các thư mục `server/src/main`, `client/src`, `mobile/app`, `mobile/services` và các cấu hình dự án. Các chức năng được mô tả dưới đây là những phần có dấu vết triển khai trong mã nguồn; sự hiện diện của một thư viện, màn hình thử nghiệm hoặc mục trong tài liệu yêu cầu không tự nó chứng minh một quy trình đã hoàn thiện.

RRMS được tổ chức thành ứng dụng web React chạy trên trình duyệt, ứng dụng di động React Native/Expo và backend Spring Boot cung cấp API. Backend đảm nhiệm xác thực, quy tắc nghiệp vụ, truy cập dữ liệu và kết nối các dịch vụ; hai ứng dụng client gọi API để hiển thị và cập nhật thông tin.

## 4.2. Môi trường và công nghệ hiện thực

| Thành phần | Công nghệ thể hiện trong dự án | Vai trò |
|---|---|---|
| Backend | Java 17, Spring Boot 3.3.3, Spring Web, Spring Data JPA, Spring Security, Maven | Cung cấp REST API, xử lý nghiệp vụ, bảo vệ tài nguyên và làm việc với cơ sở dữ liệu |
| Cơ sở dữ liệu | MySQL, Hibernate/JPA, Flyway | Lưu dữ liệu nghiệp vụ và quản lý phiên bản lược đồ qua các migration |
| Web client | React 18, Vite, React Router, Axios, Material UI và Bootstrap | Giao diện công khai, tìm kiếm phòng và trang nghiệp vụ quản lý |
| Mobile client | React Native 0.86, Expo SDK 57, Expo Router, TypeScript, Zustand, Axios | Giao diện di động cho đăng nhập, tổng quan và các nghiệp vụ quản lý |
| Dịch vụ hỗ trợ | Redis, Springdoc OpenAPI, Actuator/Micrometer, Firebase trong client | Giới hạn tần suất một số yêu cầu, tài liệu API, endpoint giám sát và các tích hợp client |

Các phiên bản frontend/mobile được ghi theo `client/package.json`, `mobile/package.json` và `server/pom.xml` tại thời điểm rà soát. Tệp cấu hình phụ thuộc không chứng minh rằng mọi thư viện đều được sử dụng trong luồng nghiệp vụ đang hoạt động.

## 4.3. Hiện thực backend

### 4.3.1. Tổ chức mã nguồn và luồng xử lý

Mã backend nằm trong `server/src/main/java/com/rrms/rrms`, chia thành các nhóm chính: `controllers`, `services`, `repositories`, `models`, `dto`, `mapper`, `configs`, `exceptions` và `utils`. Luồng xử lý phổ biến bắt đầu tại controller nhận HTTP request, chuyển dữ liệu sang service để kiểm tra và thực hiện nghiệp vụ, sau đó service sử dụng repository thao tác các entity thông qua JPA. DTO và mapper được dùng để tách dữ liệu trao đổi API khỏi mô hình lưu trữ ở các luồng phù hợp.

Các nhóm controller thể hiện phạm vi nghiệp vụ gồm tài khoản và xác thực, khu trọ/phòng, bài đăng và tìm kiếm, hợp đồng, người thuê, dịch vụ và chỉ số điện nước, hóa đơn/giao dịch, đặt cọc, thiết bị, thông báo, hỗ trợ, môi giới và báo cáo vi phạm. Các đường dẫn API hiện có không hoàn toàn đồng nhất về tiền tố; một số nhóm dùng `/api/v1/...`, trong khi nhóm khác dùng các đường dẫn như `/contracts`, `/invoices` hoặc `/payment`.

### 4.3.2. Xác thực, phân quyền và kiểm soát yêu cầu

`SecurityConfig` cấu hình Spring Security, bộ giải mã JWT HMAC-SHA512, bộ mã hóa mật khẩu BCrypt và chuyển claim `roles` trong JWT thành quyền có tiền tố `ROLE_`. Ứng dụng bật bảo vệ phương thức; một số endpoint công khai được khai báo riêng, còn các endpoint còn lại yêu cầu xác thực. Luồng xác thực trong `AuthenController` có các thao tác đăng nhập, đăng ký, đăng xuất, làm mới token, đăng nhập xã hội và các bước xác nhận qua email. Mức độ phân quyền cụ thể phụ thuộc cấu hình endpoint và các annotation trên từng controller/service.

Redis được dùng trực tiếp qua `StringRedisTemplate` trong luồng xác thực và thành phần `RedisRateLimiter`. Bộ giới hạn tăng bộ đếm theo khóa và đặt thời hạn cho cửa sổ giới hạn. Không mô tả Redis như một lớp cache dữ liệu tổng quát nếu không có bằng chứng tương ứng trong mã nguồn.

### 4.3.3. Nghiệp vụ và dữ liệu

Các service hiện thực những thao tác quản lý vòng đời dữ liệu chính. Chẳng hạn, quản lý khu trọ và phòng hỗ trợ tạo/cập nhật/truy vấn; quản lý hợp đồng liên kết phòng với thông tin thuê và trạng thái; quản lý chỉ số điện nước và dịch vụ cung cấp dữ liệu đầu vào cho hóa đơn; giao dịch cập nhật số tiền đã thu và trạng thái thanh toán hóa đơn. Các thao tác thay đổi trạng thái nghiệp vụ được xử lý ở tầng service, thay vì để giao diện client tự quyết định trạng thái cuối cùng.

Cấu hình Flyway và các tập lệnh `V1` đến `V10` trong `server/src/main/resources/db/migration` cho thấy lược đồ được thay đổi tuần tự. Các entity JPA ánh xạ những nhóm dữ liệu như tài khoản, khu trọ, phòng, hợp đồng, dịch vụ, hóa đơn, giao dịch, bài đăng, thông báo và lịch sử đăng nhập. MySQL là kho lưu trữ quan hệ chính theo cấu hình và dependency hiện có.

### 4.3.4. Hóa đơn và thanh toán

`InvoiceService` xử lý tạo/truy vấn hóa đơn, ghi nhận khoản thu và trạng thái thanh toán. `TransactionService` lưu giao dịch, tính số tiền đã thanh toán và cập nhật trạng thái hóa đơn theo khoản phải thu. `PaymentController` và các lớp cấu hình liên quan chứa các luồng tích hợp thanh toán. Mã nguồn có các thư viện/cấu hình Stripe và PayPal; đồng thời có thành phần tạo yêu cầu MoMo và cấu hình VNPay. Đây là bằng chứng về các điểm tích hợp trong backend, nhưng không đồng nghĩa mọi cổng đã được kiểm chứng với thông tin xác thực môi trường thật hoặc đang bật trong mọi cấu hình triển khai.

Trong phạm vi chức năng quản lý nhà trọ, chủ trọ cũng có thể ghi nhận khoản thu thủ công qua nghiệp vụ hóa đơn/giao dịch. Chương trình cần phân biệt cách ghi nhận này với xác nhận tự động từ cổng thanh toán.

### 4.3.5. Tài liệu API và khả năng quan sát

Backend khai báo Springdoc OpenAPI để sinh tài liệu mô tả API và Spring Boot Actuator cùng Micrometer Prometheus registry cho endpoint giám sát. Các thành phần này hỗ trợ việc xem hợp đồng API và thu thập chỉ số; việc triển khai dashboard/alerting ở môi trường vận hành thuộc cấu hình triển khai tương ứng.

## 4.4. Hiện thực ứng dụng web

### 4.4.1. Cấu trúc client và gọi API

Web client được xây dựng bằng React và Vite. `client/src/App.jsx` kết hợp các nhóm route công khai và route nghiệp vụ; `PublicRoutes.jsx` khai báo các trang không yêu cầu quyền quản lý, còn `AdminRoutes.jsx` sử dụng route bảo vệ cho các màn hình quản trị. Mã nguồn có các API module riêng trong `client/src/apis`, dùng Axios client và URL dịch vụ lấy từ cấu hình môi trường. Cách tổ chức này gom phần giao tiếp HTTP ra khỏi thành phần giao diện.

### 4.4.2. Chức năng phía người dùng

Các route và trang công khai hiện có hỗ trợ đăng ký/đăng nhập, tìm kiếm và xem chi tiết tin phòng, trang giới thiệu/liên hệ, quản lý hồ sơ, lưu tin yêu thích, đánh giá và hỗ trợ thanh toán. Trang tìm kiếm có bộ lọc và danh sách kết quả; trang chi tiết trình bày thông tin bài đăng và đánh giá. Một số trang thử nghiệm nhận diện ảnh/CCCD, so khớp khuôn mặt, hội thoại hoặc âm thanh cũng có trong thư mục giao diện. Chúng không được xem là chức năng AI hoàn chỉnh của toàn hệ thống nếu chưa có quy trình backend và tích hợp dịch vụ được xác nhận.

### 4.4.3. Chức năng quản lý

Các module dưới `client/src/pages/admin` cung cấp giao diện cho vai trò quản lý, bao gồm dashboard, quản lý khu trọ/phòng, người thuê, hợp đồng, hóa đơn và ghi nhận thanh toán, thiết bị, dịch vụ, môi giới, báo cáo, cài đặt, tài khoản, bài đăng, hỗ trợ và kiểm duyệt. Các biểu đồ và thẻ thống kê hiển thị dữ liệu tổng hợp lấy từ các API hoặc tính toán ở client tùy từng trang.

Route bảo vệ và điều kiện vai trò ở giao diện giúp điều hướng người dùng phù hợp. Đây là lớp trải nghiệm sử dụng; backend vẫn là nơi cần áp dụng quyền truy cập cuối cùng cho dữ liệu và nghiệp vụ nhạy cảm.

## 4.5. Hiện thực ứng dụng mobile

### 4.5.1. Điều hướng, dịch vụ API và lưu trữ

Mobile client sử dụng React Native, Expo và Expo Router với cấu trúc route theo thư mục tại `mobile/app`. Các màn hình được nhóm theo xác thực, trang tổng quan/quản lý, tác vụ, hộp thư và cài đặt. `mobile/services/api` chứa client Axios, endpoint và các service theo miền như xác thực, khu trọ, phòng, hợp đồng, người thuê, dịch vụ, tài chính, đặt chỗ và thông báo. Thông tin xác thực được thao tác qua lớp lưu trữ trong `mobile/services/storage`; một số trạng thái giao diện dùng Zustand.

API client mobile có cơ chế xây dựng và thử các địa chỉ backend khả dụng, lưu lại địa chỉ kết nối gần nhất và phục hồi một lần khi lỗi kết nối. Cơ chế này phục vụ các môi trường phát triển khác nhau; URL thực tế vẫn phụ thuộc cấu hình chạy ứng dụng.

### 4.5.2. Các nhóm chức năng

Các màn hình đã triển khai bao gồm đăng nhập, đăng ký và quên mật khẩu; tổng quan tình trạng phòng; thêm/chỉnh sửa khu trọ; quản lý khách thuê, hợp đồng, tài sản/thiết bị, dịch vụ và số điện nước; xem hóa đơn, ghi nhận thu tiền, đặt cọc và kết thúc hợp đồng; báo cáo tài chính; thiết lập khu trọ; tìm người thuê; cùng các màn hình thông báo, hồ sơ, tài khoản và tác vụ.

Việc một màn hình tồn tại không đồng nghĩa toàn bộ hành động trên màn hình đã kết nối hoàn chỉnh tới backend. Khi đưa vào báo cáo chính thức, nên chọn các luồng đã đối chiếu được cả giao diện, service gọi API và endpoint backend, đồng thời bổ sung ảnh chụp từ ứng dụng chạy thực tế.

## 4.6. Một số luồng nghiệp vụ được hiện thực

### 4.6.1. Quản lý hợp đồng thuê

1. Người quản lý chọn khu trọ/phòng và nhập thông tin người thuê, giá thuê, tiền cọc, thời hạn và các dữ liệu hợp đồng.
2. Web hoặc mobile gửi yêu cầu đến API hợp đồng.
3. `ContractController` tiếp nhận yêu cầu và chuyển sang service để kiểm tra, tạo hoặc cập nhật hợp đồng cùng các dữ liệu liên quan.
4. Repository lưu dữ liệu qua JPA; trạng thái phòng được cập nhật theo quy tắc nghiệp vụ của luồng.
5. Client nhận phản hồi và tải lại thông tin hợp đồng/phòng.

Chi tiết điều kiện chuyển trạng thái cần được đối chiếu với từng phương thức service cụ thể trước khi khẳng định cùng một quy tắc áp dụng cho mọi trường hợp.

### 4.6.2. Lập hóa đơn và ghi nhận thanh toán

1. Người quản lý chọn phòng/kỳ cần lập hóa đơn và cung cấp các khoản phí, chỉ số hoặc dịch vụ áp dụng.
2. Client gửi dữ liệu đến API hóa đơn; service kiểm tra dữ liệu và lưu hóa đơn cùng chi tiết.
3. Khi ghi nhận thu tiền, client gửi số tiền, ngày thu và thông tin giao dịch đến nghiệp vụ thu tiền.
4. Backend lưu giao dịch và tính lại số tiền đã thanh toán/trạng thái hóa đơn.
5. Client hiển thị kết quả và lịch sử thu tương ứng.

Với thanh toán qua cổng trung gian, backend tạo yêu cầu thanh toán/callback theo từng tích hợp. Kết quả cần được kiểm tra bằng cấu hình và thông tin phản hồi của cổng; không nên suy diễn rằng mọi giao dịch mẫu ở giao diện đã tạo ra giao dịch thật.

### 4.6.3. Tìm kiếm và xem tin phòng

1. Người dùng nhập từ khóa hoặc điều kiện lọc tại web client.
2. API module gửi yêu cầu tìm kiếm tới endpoint tìm kiếm/bài đăng.
3. Backend truy vấn dữ liệu bài đăng và trả về danh sách phù hợp.
4. Web hiển thị kết quả; người dùng có thể mở trang chi tiết, lưu tin hoặc gửi đánh giá nếu đã xác thực theo yêu cầu của endpoint.

Trong source backend đã rà soát không thấy dependency hay nhóm triển khai Elasticsearch. Do đó, mô tả phù hợp là chức năng tìm kiếm được hiện thực qua API và tầng truy vấn hiện có; không khẳng định sử dụng Elasticsearch nếu chưa bổ sung bằng chứng triển khai.

## 4.7. Nhận xét về mức độ hiện thực và giới hạn

Việc rà soát source cho thấy RRMS đã có ba phần chính: backend Spring Boot với các nhóm API nghiệp vụ và lưu trữ MySQL; web client với các trang công khai/quản lý; mobile client với điều hướng và các màn hình quản lý. Một số khả năng được nêu trong tài liệu phân tích cần được diễn đạt thận trọng trong báo cáo triển khai:

- Elasticsearch không xuất hiện trong dependency backend đã rà soát; không mô tả đây là công cụ tìm kiếm đang vận hành.
- Redis được sử dụng rõ trong giới hạn tần suất và luồng xác thực; chưa đủ căn cứ để mô tả là cache dữ liệu tổng quát.
- Có mã giao diện thử nghiệm AI/OCR/so khớp ảnh ở web, nhưng chưa đủ bằng chứng để kết luận các quy trình AI đó là chức năng tích hợp xuyên suốt cả ba thành phần.
- Mã nguồn có cấu hình/SDK và endpoint cho các cổng thanh toán, nhưng cần kiểm chứng thông tin môi trường, callback và giao dịch thật trước khi nêu kết quả vận hành.
- Các tuyên bố về hiệu năng, phần trăm tự động hóa, bảo mật đạt chuẩn hoặc kiểm thử tải cần có số liệu/biên bản kiểm chứng riêng; chương này không xem chúng là kết quả mặc định.

## 4.8. Tổng kết chương IV

Chương IV đã trình bày cách hiện thực RRMS theo ba thành phần backend, web và mobile. Backend cung cấp API, xử lý nghiệp vụ và kết nối cơ sở dữ liệu; web cung cấp giao diện tìm kiếm và quản trị; mobile cung cấp các màn hình quản lý trên thiết bị di động và gọi lại các API dùng chung. Các luồng hợp đồng, hóa đơn/thanh toán và tìm kiếm minh họa sự phối hợp giữa client với backend. Những khả năng chưa đủ bằng chứng triển khai được ghi nhận là giới hạn để báo cáo phản ánh trung thực tình trạng mã nguồn.
