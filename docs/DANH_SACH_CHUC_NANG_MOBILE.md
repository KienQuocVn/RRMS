# 📱 HỆ THỐNG RRMS - DANH SÁCH CHỨC NĂNG MOBILE (REACT NATIVE)

> Tài liệu đặc tả chi tiết toàn bộ các màn hình giao diện, luồng điều hướng (Expo Router), tính năng cơ bản, nâng cao và tích hợp công nghệ AI trên **Mobile React Native App (Expo)** thuộc hệ thống RRMS.
>
> Phiên bản: 1.0.0 | Cập nhật: 2026-06-01

---

> [!NOTE]
> **Quy chuẩn phát triển Mobile App (React Native):**
> - **Expo Router (File-based Routing)**: Sử dụng các nhóm thư mục route như `(auth)` (xác thực), `(tabs)` (tab chính), `(home-page)` (quản lý trọ), `(more-page)` (mở rộng), `(mail-box-page)` (chat & thông báo) để cấu trúc luồng màn hình.
> - **Auto-Login & Token Persistence**: Sử dụng `AsyncStorage` để lưu trữ mã bảo mật JWT, tự động khôi phục phiên đăng nhập và định tuyến màn hình thông minh khi mở app.
> - **Push Notifications**: Sử dụng Expo Notifications để đẩy thông báo thời gian thực về tiền phòng, nhắc nợ, sự cố phòng tới thiết bị di động.

---

## 📱 I. Danh sách các chức năng cơ bản trên Mobile (Basic Mobile Functions)

Dưới đây là bảng thống kê các chức năng cốt lõi được triển khai trên ứng dụng di động React Native:

| -- | Functions | Description | Entity | Models | Database | Diagram |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **M-01** | Register (Đăng ký tài khoản) | - Màn hình: `register.tsx` (Auth)<br>- Nghiệp vụ: Người dùng đăng ký tài khoản chủ trọ, khách thuê hoặc môi giới ngay trên app di động thông qua các ô nhập thông tin và xác nhận số điện thoại. | Customer / Host / Broker | `Account.java`, `Auth.java` | `accounts`, `auths` | Activity |
| **M-02** | Login (Đăng nhập di động) | - Màn hình: `login.tsx` (Auth)<br>- Nghiệp vụ: Nhập SĐT và mật khẩu. Sau khi xác thực thành công, lưu JWT Token vào bộ nhớ đệm `AsyncStorage` để tự động đăng nhập những lần sau. | Customer / Host / Broker / Admin | `Account.java`, `Auth.java` | `accounts`, `auths` | Activity |
| **M-03** | Forgot Password (Quên mật khẩu) | - Màn hình: `forgot-password.tsx` (Auth)<br>- Nghiệp vụ: Nhập email đăng ký tài khoản, nhận mã xác thực OTP gửi về email, điền mật khẩu mới và xác nhận đổi mật khẩu thành công. | Customer / Host / Broker / Admin | `Account.java` | `accounts` | Activity |
| **M-04** | View & Edit Profile (Xem và sửa thông tin cá nhân) | - Màn hình: `profile.tsx` và `edit-profile.tsx` (Profile)<br>- Nghiệp vụ: Hiển thị hồ sơ cá nhân. Cho phép thay đổi họ tên, giới tính, ngày sinh và tải lên ảnh đại diện mới từ thư viện điện thoại. | Customer / Host / Broker / Admin | `Account.java` | `accounts` | Activity |
| **M-05** | Change Password (Đổi mật khẩu bảo mật) | - Màn hình: `change-password.tsx` (Settings)<br>- Nghiệp vụ: Khách thuê hoặc chủ trọ đổi mật khẩu bằng cách xác thực mật khẩu cũ và nhập mật khẩu mới trực tiếp trên điện thoại. | Customer / Host / Broker / Admin | `Account.java` | `accounts` | Activity |
| **M-06** | Motel & Room Dashboard (Danh sách phòng & khu trọ) | - Màn hình: `index.tsx` và `[id].tsx` (Rooms Tab)<br>- Nghiệp vụ: Host xem danh sách khu trọ cá nhân và quản lý danh sách phòng trọ theo từng khu, hiển thị nhanh trạng thái phòng (Có người/Trống). | Host | `Room.java`, `Motel.java` | `rooms`, `motels` | Activity |
| **M-07** | Add Room (Thêm phòng trọ mới) | - Màn hình: `add.tsx` (Rooms Tab)<br>- Nghiệp vụ: Host thêm mới phòng trọ, điền tên phòng, diện tích, giá thuê gốc, tiền đặt cọc giữ chỗ và kích hoạt phòng hoạt động trên app. | Host | `Room.java` | `rooms` | Activity |
| **M-08** | Motel CRUD on Mobile (Quản lý khu trọ - CRUD) | - Màn hình: `add-building` và `edit-building` (Menu Management)<br>- Nghiệp vụ: Cho phép chủ nhà trọ thực hiện nhanh việc thêm khu trọ mới hoặc sửa tên, địa chỉ, quy định hóa đơn của tòa nhà trọ. | Host | `Motel.java` | `motels` | Activity |
| **M-09** | Rules Settings (Quản lý nội quy dãy trọ) | - Màn hình: `rules-settings.tsx` (Rental Settings)<br>- Nghiệp vụ: Thiết lập các nội quy sống tại khu trọ (giờ giấc, bảo vệ xe cộ, giữ vệ sinh chung) áp dụng trực tiếp lên các phòng trọ. | Host | `MotelRule.java`, `Rule.java` | `motel_rules` | Activity |
| **M-10** | Amenities Configuration (Cài đặt tiện ích phòng) | - Màn hình: `amenities-settings.tsx` (Rental Settings)<br>- Nghiệp vụ: Thiết lập danh sách tiện ích của phòng trọ (gác lửng, tủ lạnh, bếp gas) để phục vụ cho tin đăng cho thuê phòng trống. | Host | `RentalAmenities.java` | `rental_amenities` | Activity |

---

## ⚡ II. Danh sách các chức năng nâng cao trên Mobile (Advanced & AI Mobile Functions)

Các tính năng tối ưu hóa nghiệp vụ qua di động, tương tác thời gian thực và tích hợp camera quét AI:

| -- | Functions | Description | Entity | Models | Database | Diagram |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **MC-01** | E-Sign & Digital Signature (Ký hợp đồng số trên di động) | - Màn hình: `digital-signature.tsx` (Settings)<br>- Nghiệp vụ: Khách thuê xem hợp đồng điện tử dưới dạng PDF trực quan trên điện thoại, xác nhận đồng ý điều khoản, điền OTP để ký số trực tuyến tức thì. | Customer | `Contract.java` | `contracts` | Activity/Sequence |
| **MC-02** | Passport/ID Card OCR (AI quét CCCD bằng Camera điện thoại) | - Màn hình: `representative-info.tsx` (Settings)<br>- Nghiệp vụ: Tích hợp camera điện thoại chụp CCCD. Mô hình AI OCR tự động trích xuất Họ tên, Số CCCD, ngày sinh và cập nhật vào hồ sơ người đại diện. | Host / Customer / Broker | `Account.java` | `accounts` | Activity/Sequence |
| **MC-03** | Face Verification (AI đối khớp khuôn mặt bảo mật) | - Màn hình: `representative-info.tsx` (Settings)<br>- Nghiệp vụ: Chụp ảnh camera trước (selfie) của chủ tài khoản, gọi AI so sánh với ảnh chân dung trên CCCD để xác minh tài khoản chính chủ. | Host / Customer / Broker | `Account.java` | `accounts` | Activity/Sequence |
| **MC-04** | Service & Meter Readings (Chốt chỉ số điện nước kèm ảnh) | - Màn hình: `service-summary.tsx` (Other Actions)<br>- Nghiệp vụ: Host đi chốt chỉ số điện nước hàng tháng trực tiếp tại phòng bằng điện thoại. Cho phép mở camera chụp ảnh mặt đồng hồ điện nước lưu làm minh chứng đối soát. | Host | `MeterReading.java` | `meter_readings` | Activity |
| **MC-05** | Dynamic VietQR & Online Payments (Thanh toán qua mã QR di động) | - Màn hình: `transfer-history.tsx` (Other Actions)<br>- Nghiệp vụ: Khách thuê xem chi tiết hóa đơn tháng, hệ thống hiển thị mã VietQR động để chụp/lưu quét trên App Ngân hàng; hoặc thanh toán trực tiếp qua ví MoMo. | Customer | `Invoice.java`, `Payment.java`, `Transaction.java` | `invoices`, `payments`, `transactions` | Sequence |
| **MC-06** | Mobile Finance Summary (Báo cáo thu chi tài chính di động) | - Màn hình: `finance-summary.tsx` (Other Actions)<br>- Nghiệp vụ: Thống kê và hiển thị trực quan các khoản thu (tiền phòng, dịch vụ, cọc) và khoản chi bằng biểu đồ cột tương thích màn hình dọc di động. | Host | `Invoice.java`, `Transaction.java` | `invoices`, `transactions` | Activity |
| **MC-07** | Zalo Notification History (Lịch sử gửi thông báo Zalo OA) | - Màn hình: `zalo-history.tsx` (Other Actions)<br>- Nghiệp vụ: Xem lịch sử và trạng thái gửi tin nhắn SMS/Zalo ZNS nhắc nợ, gửi hóa đơn tự động từ hệ thống tới số điện thoại khách thuê. | Host | `Notification.java` | `notifications` | Activity |
| **MC-08** | Automatic Rental Price Increase (Thiết lập lịch tăng giá tự động) | - Màn hình: `price-increase.tsx` (Rental Settings)<br>- Nghiệp vụ: Lên lịch tự động tăng giá thuê phòng hoặc giá dịch vụ theo chu kỳ tháng/năm (ví dụ: tăng 10% giá phòng sau 1 năm ở) cho toàn bộ khu trọ. | Host | `Room.java`, `MotelService.java` | `rooms`, `motel_services` | Activity |
| **MC-09** | Motel Feature Toggles (Bật tắt tính năng dãy trọ) | - Màn hình: `toggle-features.tsx` (Rental Settings)<br>- Nghiệp vụ: Cho phép Host bật/tắt linh hoạt các phân hệ thông minh của khu trọ (Ví dụ: Cho phép/Không cho phép khách quét VietQR; Bật/tắt gửi tự động Zalo...). | Host | `Motel.java` | `motels` | Activity |
| **MC-10** | Tenant Support Tasks (Quản lý sửa chữa sự cố thời gian thực) | - Màn hình: `tasks.tsx` (Tasks Tab / Job Page)<br>- Nghiệp vụ: Tiếp nhận sự cố hỏng hóc (chập điện, hỏng khóa) của khách thuê. Host giao việc cho nhân viên sửa chữa. Hệ thống đẩy **Push Notification** lập tức tới thiết bị di động nhân viên. | Host / Employee / Tenant | `Support.java` | `supports` | Activity |
| **MC-11** | Real-time Chat Inbox (Hộp thư tin nhắn thời gian thực) | - Màn hình: `messages.tsx` (Mail Box Page)<br>- Nghiệp vụ: Tích hợp thư viện Socket Chat, hỗ trợ nhắn tin trò chuyện trao đổi trực tiếp thời gian thực giữa Khách thuê, Chủ trọ và Môi giới ngay trên di động. | Host / Customer / Broker | Chat/Inbox Service | `messages` | Sequence |

---

> [!TIP]
> **Khuyên dùng tối ưu hiệu năng trên di động (Mobile Optimization):**
> - Sử dụng thư viện `expo-image` để tải và cache hình ảnh phòng trọ, giúp giảm thiểu lưu lượng mạng di động (3G/4G) của người dùng.
> - Luôn cấu hình thuộc tính `hitSlop` (tối thiểu 10px) cho toàn bộ các nút bấm (`TouchableOpacity`) trên ứng dụng để cải thiện trải nghiệm tương tác cảm ứng.
