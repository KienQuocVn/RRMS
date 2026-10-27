# CHƯƠNG V: KIỂM THỬ, ĐÁNH GIÁ VÀ TỔNG KẾT

## 5.1. Mục tiêu và phạm vi

Chương này tổng hợp cách kiểm thử và kết quả kiểm chứng được đối với hệ thống RRMS, gồm backend Spring Boot, web client React/Vite và mobile client React Native/Expo. Phạm vi được đối chiếu với mã nguồn, cấu hình build, các lớp kiểm thử sẵn có và kết quả chạy lệnh trong môi trường phát triển.

Kết quả trong chương chỉ khẳng định những gì đã chạy và quan sát được. Build thành công không đồng nghĩa mọi luồng nghiệp vụ đã được kiểm thử đầu cuối; một lớp test tồn tại trong repository cũng không được xem là đạt cho đến khi test được chạy.

## 5.2. Phương pháp kiểm thử

### 5.2.1. Kiểm thử backend

Backend sử dụng Maven, Spring Boot Test, JUnit Platform và Mockito theo các dependency trong `server/pom.xml`. Bộ test hiện có bao phủ các nhóm cấu hình và bảo mật, controller, service nghiệp vụ. Các chủ đề thể hiện trong tên test gồm xác thực, tài khoản, tìm kiếm, hợp đồng, hóa đơn, giao dịch, khu trọ, phòng, thiết bị, người thuê, loại phòng, Redis, OpenAPI và VNPay.

Lệnh kiểm thử:

```text
cd server
./mvnw test
```

Trên Windows có thể dùng `mvnw.cmd test`.

### 5.2.2. Kiểm tra build web

Web client dùng Vite. Lệnh `npm run build` tạo bundle production và các tài nguyên PWA. Build kiểm tra khả năng phân tích, biên dịch và đóng gói mã frontend; đây không phải là kiểm thử tương tác trình duyệt hay xác nhận kết nối với mọi dịch vụ runtime.

### 5.2.3. Kiểm tra mobile

Mobile dùng Expo/React Native và khai báo lệnh `lint` cùng các lệnh khởi chạy trong `mobile/package.json`. Tại thời điểm lập báo cáo, không thấy script test tự động, E2E hoặc lệnh build phát hành được khai báo trong package này. Vì vậy không ghi nhận mobile đã được kiểm thử tự động trong lượt đánh giá này.

## 5.3. Kết quả kiểm thử và build

| Hạng mục | Cách thực hiện | Kết quả quan sát | Nhận xét |
|---|---|---|---|
| Biên dịch backend | `mvnw -DskipTests compile` trong `server` | Thành công | Toàn bộ mã nguồn backend biên dịch được trong môi trường hiện tại. |
| Test backend | `mvnw test` trong `server` | 89 test; 0 failure; 0 error; 0 skipped; `BUILD SUCCESS` | Bộ test tự động hiện có chạy đạt. Đây là kết quả của bộ test trong repository, không phải chứng nhận bao phủ toàn bộ nghiệp vụ. |
| Build web production | `npm run build` trong `client` | Thành công; Vite tạo bundle và PWA service worker | Build cần chạy ngoài sandbox vì tiến trình esbuild ban đầu bị chặn với `spawn EPERM`; chạy lại thành công. |
| Kiểm tra tương tác web đầu cuối | Không chạy trong lượt này | Chưa xác nhận | Chưa có kết quả E2E trình duyệt, kiểm tra trên nhiều trình duyệt hoặc test hồi quy thủ công được lập biên bản. |
| Build/test mobile | Không chạy trong lượt này | Chưa xác nhận | Repository không khai báo script test tự động trong `mobile/package.json`; chưa đánh giá cài đặt/chạy trên thiết bị thật. |
| Kiểm thử tải và hiệu năng | Không chạy trong lượt này | Chưa xác nhận | Không đưa ra số liệu throughput, độ trễ hoặc khả năng chịu tải. |

### 5.3.1. Cảnh báo từ quá trình build web

Build production hoàn tất nhưng Vite cảnh báo có chunk JavaScript lớn hơn 500 kB sau minify. Bundle chính lớn nhất được báo khoảng 802 kB trước gzip; nhiều thư viện được tách thành các chunk riêng. Đây là cảnh báo về kích thước tải và khả năng tối ưu phân tách mã, không làm build thất bại. Quá trình build cũng cảnh báo dữ liệu Browserslist `caniuse-lite` đã cũ khoảng sáu tháng; nên cập nhật dependency định kỳ và build lại để rà soát.

## 5.4. Đánh giá mức độ kiểm chứng

Kết quả hiện tại cho thấy backend biên dịch được, toàn bộ 89 test tự động đang được Maven phát hiện đều đạt, và web client đóng gói được cho production. Đây là bằng chứng tích cực ở mức kiểm thử tự động và build.

Các kết quả này chưa xác nhận đầy đủ những điều kiện phụ thuộc môi trường: MySQL/Redis đang hoạt động, cấu hình domain/CORS, dịch vụ Esgoo, OAuth, email và cổng thanh toán. Những tích hợp đó cần kiểm thử trên môi trường có cấu hình hợp lệ. Tương tự, các test unit/controller không thay thế cho kiểm thử luồng web/mobile qua giao diện với database và dịch vụ thật.

Một lượt chạy backend độc lập trước đó trong môi trường phát triển không kết nối được MySQL và dừng khi Flyway khởi tạo. Lỗi kết nối này phụ thuộc trạng thái dịch vụ database tại thời điểm chạy; nó không mâu thuẫn với kết quả `mvnw test` đạt được, do mục tiêu và cấu hình chạy của hai lệnh khác nhau. Khi triển khai hoặc nghiệm thu cần xác nhận riêng kết nối tới database thực tế.

## 5.5. Hạn chế và hướng hoàn thiện

1. Bổ sung test tập trung cho các nhánh nghiệp vụ quan trọng chưa được thể hiện đầy đủ trong bộ test, đặc biệt là tính tiền hóa đơn, dữ liệu thiết bị/dịch vụ thiếu, cập nhật trạng thái thanh toán và giới hạn đăng nhập.
2. Thêm kiểm thử tích hợp với database kiểm thử tách biệt, đồng thời mô phỏng Redis và các dịch vụ ngoài để xác nhận hành vi khi dịch vụ phụ trợ lỗi.
3. Thiết lập E2E cho các luồng cốt lõi: đăng nhập, quản lý khu trọ/phòng, hợp đồng, lập và thu hóa đơn, tìm kiếm phòng; chạy trên pipeline trước khi phát hành.
4. Bổ sung quy trình kiểm tra mobile trên Android/iOS, gồm lint/type-check, build ứng dụng và các luồng xác thực, gọi API, lưu phiên.
5. Theo dõi coverage từ JaCoCo và đặt mục tiêu theo từng module sau khi có baseline đáng tin cậy; không suy diễn tỷ lệ coverage từ số lượng test.
6. Tối ưu chunk web bằng lazy loading và phân tách các thư viện lớn khi phù hợp; cập nhật dữ liệu Browserslist trong một thay đổi dependency được kiểm tra riêng.
7. Kiểm thử tải, bảo mật và khả năng phục hồi theo môi trường triển khai trước khi công bố các chỉ tiêu hiệu năng hoặc mức sẵn sàng.

## 5.6. Tổng kết đồ án

RRMS được hiện thực theo mô hình có backend Spring Boot cung cấp API, web client React/Vite và ứng dụng mobile React Native/Expo. Backend tổ chức nghiệp vụ theo controller/service/repository, dùng MySQL với JPA/Flyway, JWT/Spring Security cho xác thực và phân quyền, Redis cho một số bộ đếm giới hạn; web và mobile cung cấp giao diện theo các vai trò sử dụng. Các chương I–IV lần lượt trình bày bối cảnh và mục tiêu, cơ sở lý thuyết, phân tích/thiết kế, sau đó là cách hiện thực hệ thống.

Trong phạm vi đánh giá đã thực hiện, backend có 89 test tự động đạt và web build production thành công. Các kết quả này xác nhận trạng thái kỹ thuật của những bước kiểm tra đó tại thời điểm chạy, nhưng chưa thay thế nghiệm thu nghiệp vụ đầu cuối hoặc kiểm tra tích hợp trên hạ tầng triển khai. Mobile, E2E, tải và các tích hợp bên ngoài vẫn cần được kiểm chứng bổ sung.

Vì vậy, hệ thống có nền tảng triển khai và kiểm thử tự động ban đầu, còn chất lượng phát hành cần được hoàn thiện bằng kiểm thử tích hợp/E2E, xác nhận cấu hình môi trường và khắc phục các cảnh báo tối ưu bundle. Kết luận này giữ đúng giới hạn bằng chứng đã thu thập, không khẳng định hệ thống không còn lỗi hoặc đã đạt chỉ tiêu chưa đo lường.
