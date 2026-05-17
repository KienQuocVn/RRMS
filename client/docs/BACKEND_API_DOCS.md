# RRMS BACKEND API DOCUMENTATION

Tài liệu này mô tả các API backend của RRMS để test nhanh bằng Postman. Phần `AuthenController` bên dưới đã được cập nhật theo code hiện tại sau khi backend được update.

---

## 1. Xác Thực & Tài Khoản

### AuthenController

**Base Path**: `/authen`  
**Base URL local**: `http://localhost:7000`  
**Auth requirement**: public, không cần `Authorization` header  
**Content-Type**: `application/json` cho các API `POST`

**Lưu ý nhanh**

- `ApiResponse<T>` có format chuẩn: `{ "code": ..., "message": "...", "result": ... }`.
- Một số API success không set `code` thủ công nên `code` thực tế là `1000`.
- `login`, `register`, `forgetpassword`, `authenticationRegister` có rate limit theo IP.
- OTP lưu Redis trong `5 phút`.

#### 1.1 loginFailure

- **URL**: `/authen/error`
- **Method**: `GET`
- **Mục đích**: callback khi đăng nhập Google thất bại.
- **Response** (`401 Unauthorized`, plain text):

```text
Đăng nhập thất bại!
```

#### 1.2 loginSuccess

- **URL**: `/authen/success`
- **Method**: `GET`
- **Mục đích**: callback sau OAuth2 Google login thành công.
- **Request**: không có body. Endpoint này phụ thuộc `OAuth2User`, thường test qua browser flow hơn Postman thuần.
- **Success Response** (`200 OK`, raw JSON):

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

- **Error Response** (`400 Bad Request`, plain text):

```text
Không xác thực được tài khoản Google
```

hoặc

```text
Không lấy được thông tin email hoặc tên
```

#### 1.3 login

- **URL**: `/authen/login`
- **Method**: `POST`
- **Rate limit**: `5` lần / `300` giây / IP
- **Request Body** (`LoginRequest`):

```json
{
  "phone": "0919925302",
  "password": "123456789"
}
```

- **Validation**:
  - `phone`: bắt buộc, dài `10-11` ký tự
  - `password`: bắt buộc, tối thiểu `6` ký tự
- **Success Response** (`200 OK`):

```json
{
  "code": 1000,
  "message": "Đăng nhập thành công",
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "authenticated": true,
    "username": "host01",
    "fullName": "Nguyen Van A",
    "phone": "0912345678",
    "email": "host01@example.com",
    "avatar": "https://example.com/avatar.png",
    "birthday": "1998-10-20",
    "gender": "MALE",
    "cccd": "079123456789",
    "roles": ["HOST"]
  }
}
```

#### 1.4 introspect

- **URL**: `/authen/introspect`
- **Method**: `POST`
- **Request Body** (`IntrospecTokenRequest`):

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

- **Success Response** (`200 OK`, token hợp lệ):

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "valid": true,
    "message": "Token is valid",
    "subject": "host01",
    "expirationTime": "2026-04-25T18:30:00.000+00:00",
    "issuer": "host01",
    "issuedAt": "2026-04-25T17:30:00.000+00:00",
    "roles": ["HOST"],
    "permissions": ["CREATE_ROOM", "VIEW_INVOICE"]
  }
}
```

- **Response khi token rỗng/không hợp lệ** (`200 OK`):

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "valid": false,
    "message": "Token is empty",
    "subject": null,
    "expirationTime": null,
    "issuer": null,
    "issuedAt": null,
    "roles": null,
    "permissions": null
  }
}
```

#### 1.5 logout

- **URL**: `/authen/logout`
- **Method**: `POST`
- **Request Body** (`LogoutRequest`):

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 1000,
  "message": "Đăng xuất thành công",
  "result": null
}
```

#### 1.6 register

- **URL**: `/authen/register`
- **Method**: `POST`
- **Rate limit**: `5` lần / `300` giây / IP
- **Request Body** (`RegisterRequest`):

```json
{
  "username": "host01",
  "phone": "0912345678",
  "email": "host01@example.com",
  "password": "Password@123",
  "userType": "HOST"
}
```

- **Validation**:
  - `username`: bắt buộc, tối thiểu `3` ký tự
  - `phone`: bắt buộc, dài `10-11` ký tự
  - `email`: bắt buộc, đúng định dạng email
  - `password`: DTO validate từ `6` ký tự, nhưng service thực tế chặn nếu dưới `8` ký tự
  - `userType`: bắt buộc, hệ thống hiện map `CUSTOMER` hoặc `HOST`
- **Success Response** (`200 OK`):

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "status": true,
    "message": "Đăng ký thành công",
    "username": "host01"
  }
}
```

- **Error Response** (`400 Bad Request`, username đã tồn tại):

```json
{
  "code": 400,
  "message": "Username already exists",
  "result": null
}
```

- **Error Response** (`400 Bad Request`, phone đã tồn tại):

```json
{
  "code": 400,
  "message": "Phone number already exists",
  "result": null
}
```

- **Error Response** (`400 Bad Request`, mật khẩu < 8 ký tự theo service):

```json
{
  "code": 400,
  "message": "Invalid password",
  "result": null
}
```

- **Rate Limit Response** (`429 Too Many Requests`):

```json
{
  "status": false,
  "message": "Too many requests. Please try again later.",
  "data": null
}
```

#### 1.7 refresh

- **URL**: `/authen/refreshToken`
- **Method**: `POST`
- **Request Body** (`RefreshRequest`):

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 1000,
  "message": "Làm mới token thành công",
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9.new-token",
    "authenticated": true,
    "username": "host01",
    "fullName": "Nguyen Van A",
    "phone": "0912345678",
    "email": "host01@example.com",
    "avatar": "https://example.com/avatar.png",
    "birthday": "1998-10-20",
    "gender": "MALE",
    "cccd": "079123456789",
    "roles": null
  }
}
```

- **Error Response** (`401 Unauthorized`):

```json
{
  "code": 401,
  "message": "Unauthenticated",
  "result": null
}
```

#### 1.8 checkMail

- **URL**: `/authen/checkMail`
- **Method**: `GET`
- **Query Params**:
  - `email`: `String`
- **Success Response** (`200 OK`, email tồn tại):

```json
{
  "code": 200,
  "message": "Thành công",
  "result": true
}
```

- **Response khi email không tồn tại** (`400 Bad Request`):

```json
{
  "code": 400,
  "message": "Lỗi",
  "result": false
}
```

#### 1.9 forgetpassword

- **URL**: `/authen/forgetpassword`
- **Method**: `POST`
- **Rate limit**: `3` lần / `300` giây / IP
- **Mục đích**: gửi OTP reset password, lưu vào Redis key `otp:forgot:{email}` trong `5 phút`.
- **Request Body** (`ChangePasswordByEmail`):

```json
{
  "email": "host01@example.com",
  "newPassword": null,
  "code": null
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 200,
  "message": "Thành công",
  "result": true
}
```

- **Error Response** (`400 Bad Request`):

```json
{
  "code": 400,
  "message": "Lỗi",
  "result": false
}
```

- **Rate Limit Response** (`429 Too Many Requests`):

```json
{
  "status": false,
  "message": "Too many requests. Please try again later.",
  "data": null
}
```

#### 1.10 authenticationRegister

- **URL**: `/authen/authenticationRegister`
- **Method**: `POST`
- **Rate limit**: `3` lần / `300` giây / IP
- **Mục đích**: gửi OTP xác thực đăng ký, lưu vào Redis key `otp:register:{gmail}` trong `5 phút`.
- **Request Body** (`AuthenticationRegister`):

```json
{
  "gmail": "host01@example.com",
  "code": null
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 200,
  "message": "Thành công",
  "result": true
}
```

- **Error Response** (`400 Bad Request`):

```json
{
  "code": 400,
  "message": "Lỗi",
  "result": false
}
```

- **Rate Limit Response** (`429 Too Many Requests`):

```json
{
  "status": false,
  "message": "Too many requests. Please try again later.",
  "data": null
}
```

#### 1.11 acceptChangePassword

- **URL**: `/authen/acceptChangePassword`
- **Method**: `POST`
- **Request Body** (`ChangePasswordByEmail`):

```json
{
  "email": "host01@example.com",
  "newPassword": "NewPassword@123",
  "code": "12345"
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 200,
  "message": "Thành công",
  "result": true
}
```

- **Error Response** (`400 Bad Request`, OTP sai hoặc hết hạn):

```json
{
  "code": 400,
  "message": "Mã OTP không đúng hoặc đã hết hạn",
  "result": false
}
```

- **Error Response** (`400 Bad Request`, email không tồn tại hoặc update thất bại):

```json
{
  "code": 400,
  "message": "Lỗi",
  "result": false
}
```

#### 1.12 acceptAuthenticationRegister

- **URL**: `/authen/acceptAuthenticationRegister`
- **Method**: `POST`
- **Request Body** (`AuthenticationRegister`):

```json
{
  "gmail": "host01@example.com",
  "code": "12345"
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 200,
  "message": "Thành công",
  "result": true
}
```

- **Error Response** (`400 Bad Request`):

```json
{
  "code": 400,
  "message": "Mã OTP không đúng hoặc đã hết hạn",
  "result": false
}
```

#### 1.13 checkRegister

- **URL**: `/authen/checkregister`
- **Method**: `POST`
- **Mục đích**: validate nhanh form đăng ký trước khi submit.
- **Quan trọng**: code hiện tại chỉ check trùng `username`; phần check trùng `phone` và `email` đang được comment out.
- **Request Body** (`RegisterRequest`):

```json
{
  "username": "host01",
  "phone": "0912345678",
  "email": "host01@example.com",
  "password": "Password@123",
  "userType": "HOST"
}
```

- **Success Response** (`200 OK`):

```json
{
  "code": 200,
  "message": "Thông tin hợp lệ",
  "result": true
}
```

- **Error Response** (`400 Bad Request`, username đã tồn tại):

```json
{
  "code": 400,
  "message": "Tên đăng nhập đã tồn tại",
  "result": false
}
```

- **Validation Error** (`400 Bad Request`):

```json
{
  "code": 1006,
  "message": "Email không hợp lệ",
  "result": null
}
```

#### 1.14 checkRegisterByUsername

- **URL**: `/authen/checkregister/{username}`
- **Method**: `POST`
- **Path Variables**:
  - `username`: `String`
- **Success Response** (`200 OK`, username đã tồn tại):

```json
{
  "code": 200,
  "message": "Tên đăng nhập đã tồn tại",
  "result": true
}
```

- **Response khi username chưa tồn tại** (`404 Not Found`):

```json
{
  "code": 404,
  "message": "Tên đăng nhập không tồn tại",
  "result": false
}
```

### Postman test flow gợi ý

1. `POST /authen/checkregister`
2. `POST /authen/authenticationRegister`
3. `POST /authen/acceptAuthenticationRegister`
4. `POST /authen/register`
5. `POST /authen/login`
6. `POST /authen/refreshToken`
7. `POST /authen/logout`

### AccountController

**Base Path**: `/api-accounts`  
**Alias Base Path**: `/api/v1/accounts`

#### 1.15 getAllAccounts

- **URL**: `/api-accounts`
- **Method**: `GET`
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<AccountResponse>>`
- **Success Message hiện tại**: `Tài khoản đã được khôi phục thành công`

#### 1.16 getAllAccounts

- **URL**: `/api-accounts/get-all-account`
- **Method**: `GET`
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<AccountResponse>>`
- **Success Message hiện tại**: `Tài khoản đã được khôi phục thành công`

#### 1.17 getAccountsByHostRole

- **URL**: `/api-accounts/by-host-role`
- **Method**: `GET`
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<AccountResponse>>`
- **Success Message hiện tại**: `Đã truy xuất thành công tài khoản máy chủ`

#### 1.18 getAccountsByHostRole

- **URL**: `/api-accounts/roles/host`
- **Method**: `GET`
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<AccountResponse>>`
- **Success Message hiện tại**: `Đã truy xuất thành công tài khoản máy chủ`

#### 1.19 getAccountByUsername

- **URL**: `/api-accounts/{username}`
- **Method**: `GET`
- **Path Variables**: `username` (String)
- **Response**: `ApiResponse<AccountResponse>`
- **Success Message hiện tại**: `Tài khoản đã được khôi phục thành công`

#### 1.20 createAccount

- **URL**: `/api-accounts`
- **Method**: `POST`
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ResponseEntity<ApiResponse<AccountResponse>>`
- **HTTP Status thành công**: `201 Created`
- **Success Message hiện tại**: `Tài khoản đã được tạo thành công`

#### 1.21 createAccount

- **URL**: `/api-accounts/createAccount`
- **Method**: `POST`
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ResponseEntity<ApiResponse<AccountResponse>>`
- **HTTP Status thành công**: `201 Created`
- **Success Message hiện tại**: `Tài khoản đã được tạo thành công`

#### 1.22 updateAccount

- **URL**: `/api-accounts/{username}`
- **Method**: `PUT`
- **Path Variables**: `username` (String)
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ApiResponse<AccountResponse>`
- **Success Message hiện tại**: `Tài khoản đã được cập nhật thành công.`

#### 1.23 updateAccount

- **URL**: `/api-accounts/updateAccount/{username}`
- **Method**: `PUT`
- **Path Variables**: `username` (String)
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ApiResponse<AccountResponse>`
- **Success Message hiện tại**: `Tài khoản đã được cập nhật thành công.`

#### 1.24 deleteAccount

- **URL**: `/api-accounts/{username}`
- **Method**: `DELETE`
- **Path Variables**: `username` (String)
- **Response**: `ApiResponse<Void>`
- **Success Message hiện tại**: `Tài khoản đã bị xóa thành công`

#### 1.25 deleteAccount

- **URL**: `/api-accounts/deleteAccount/{username}`
- **Method**: `DELETE`
- **Path Variables**: `username` (String)
- **Response**: `ApiResponse<Void>`
- **Success Message hiện tại**: `Tài khoản đã bị xóa thành công`

#### 1.26 updateAccount

- **URL**: `/api-accounts/update-acc`
- **Method**: `PUT`
- **Query Params**: `username` (String)
- **Request Body**: `Account`
- **Response**: `ApiResponse<Account>`
- **Success Message hiện tại**: `Tài khoản đã được cập nhật thành công.`

#### 1.27 getProfile

- **URL**: `/api-accounts/profile`
- **Method**: `GET`
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<AccountResponse>`
- **Success Message hiện tại**: `Đăng nhập thành công`

#### 1.28 updateProfile

- **URL**: `/api-accounts/profile`
- **Method**: `PUT`
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ApiResponse<AccountResponse>`
- **Success Message hiện tại**: `Cập nhật hồ sơ thành công`

#### 1.29 changePassword

- **URL**: `/api-accounts/profile/change-password`
- **Method**: `PUT`
- **Request Body** (`ChangePasswordRequest`):

```json
{
  "username": "string",
  "oldPassword": "password123",
  "newPassword": "password123"
}
```

- **Response**: `ApiResponse<String>`
- **Success Message hiện tại**: `Đổi mật khẩu thành công`

#### 1.30 searchAccounts

- **URL**: `/api-accounts/search`
- **Method**: `GET`
- **Query Params**: `search` (String)
- **Response**: `ApiResponse<PageResponse<AccountResponse>>`
- **Success Message hiện tại**: `Tài khoản đã được truy xuất thành công`

#### 1.31 getFavorites

- **URL**: `/api-accounts/me/favorites`
- **Method**: `GET`
- **Response**: `ApiResponse<java.util.List<com.rrms.rrms.dto.response.BulletinBoardResponse>>`
- **Success Message hiện tại**: `Danh sách yêu thích đã được truy xuất thành công`

#### 1.32 addFavorite

- **URL**: `/api-accounts/me/favorites/{bulletinBoardId}`
- **Method**: `POST`
- **Response**: `ApiResponse<Void>`
- **Success Message hiện tại**: `Đã thêm vào danh sách yêu thích thành công`

#### 1.33 removeFavorite

- **URL**: `/api-accounts/me/favorites/{bulletinBoardId}`
- **Method**: `DELETE`
- **Response**: `ApiResponse<Void>`
- **Success Message hiện tại**: `Đã xóa khỏi danh sách yêu thích thành công`

### ProfileController

**Base Path**: `/profile`

#### 1.34 getProfile

- **URL**: `/profile`
- **Method**: `GET`
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<AccountResponse>`

#### 1.35 updateProfile

- **URL**: `/profile`
- **Method**: `PUT`
- **Request Body** (`AccountRequest`):

```json
{
  "username": "string",
  "message": null,
  "password": "password123",
  "fullName": "string",
  "max": null,
  "message": null,
  "phone": "0123456789",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "cccd": "string",
  "avatar": "https://example.com/image.jpg",
  "role": [],
  "permissions": []
}
```

- **Response**: `ApiResponse<AccountResponse>`

#### 1.36 changePassword

- **URL**: `/profile/change-password`
- **Method**: `PUT`
- **Request Body** (`ChangePasswordRequest`):

```json
{
  "username": "string",
  "oldPassword": "password123",
  "newPassword": "password123"
}
```

- **Response**: `ApiResponse<String>`

---

## 🛡️ 2. QUYEN & VAI TRO

### RolesController

**Base Path**: `/roles`

#### 2.1 getAllRole

- **URL**: `/roles/getAllRole`
- **Method**: `GET`
- **Response**: `ApiResponse<List<RoleResponse>>`

#### 2.2 getRoleById

- **URL**: `/roles/getRole/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<RoleResponse>`

#### 2.3 getRoleByIdNoCache

- **URL**: `/roles/getRole/noCache/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<RoleResponse>`

#### 2.4 addRole

- **URL**: `/roles/createRole`
- **Method**: `POST`
- **Request Body** (`RoleRequest`):

```json
{
  "roleId": "00000000-0000-0000-0000-000000000000",
  "roleName": "string",
  "roleDescription": "string",
  "permissions": []
}
```

- **Response**: `ApiResponse<RoleResponse>`

#### 2.5 updateRole

- **URL**: `/roles/updateRole`
- **Method**: `PUT`
- **Request Body** (`RoleRequest`):

```json
{
  "roleId": "00000000-0000-0000-0000-000000000000",
  "roleName": "string",
  "roleDescription": "string",
  "permissions": []
}
```

- **Response**: `ApiResponse<RoleResponse>`

#### 2.6 deleteRole

- **URL**: `/roles/deleteRole/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

### PermissionController

**Base Path**: `/permissions`

#### 2.7 getAllPermission

- **URL**: `/permissions`
- **Method**: `GET`
- **Response**: `ApiResponse<List<PermissionResponse>>`

#### 2.8 getAllPermission

- **URL**: `/permissions/getAllPermission`
- **Method**: `GET`
- **Response**: `ApiResponse<List<PermissionResponse>>`

#### 2.9 addPermission

- **URL**: `/permissions`
- **Method**: `POST`
- **Request Body** (`PermissionRequest`):

```json
{
  "permissionId": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string"
}
```

- **Response**: `ResponseEntity<ApiResponse<PermissionResponse>>`

#### 2.10 addPermission

- **URL**: `/permissions/createPermission`
- **Method**: `POST`
- **Request Body** (`PermissionRequest`):

```json
{
  "permissionId": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string"
}
```

- **Response**: `ResponseEntity<ApiResponse<PermissionResponse>>`

#### 2.11 updatePermission

- **URL**: `/permissions/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`PermissionRequest`):

```json
{
  "permissionId": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string"
}
```

- **Response**: `ApiResponse<PermissionResponse>`

#### 2.12 updatePermission

- **URL**: `/permissions/updatePermission`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`PermissionRequest`):

```json
{
  "permissionId": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string"
}
```

- **Response**: `ApiResponse<PermissionResponse>`

#### 2.13 deletePermission

- **URL**: `/permissions/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

#### 2.14 deletePermission

- **URL**: `/permissions/deletePermission/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

---

## 🏠 3. NHA TRO

### MotelController

**Base Path**: `/api/v1/motels`

#### 3.1 getMotels

- **URL**: `/api/v1/motels`
- **Method**: `GET`
- **Response**: `ApiResponse<List<MotelResponse>>`

#### 3.2 getMotelById

- **URL**: `/api/v1/motels/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<MotelResponse>`

#### 3.3 getMotelsByAccount

- **URL**: `/api/v1/motels/account/{username}`
- **Method**: `GET`
- **Path Variables**: `username` (String)
- **Response**: `ApiResponse<List<MotelResponse>>`

#### 3.4 createMotel

- **URL**: `/api/v1/motels`
- **Method**: `POST`
- **Request Body** (`MotelRequest`):

```json
{
  "motelName": "string",
  "area": 0.0,
  "averagePrice": 0,
  "address": "123 Example Street",
  "methodofcreation": "string",
  "maxperson": 0,
  "invoicedate": 0,
  "paymentdeadline": 0,
  "createdDate": null,
  "typeRoom": null,
  "account": null,
  "motelServices": []
}
```

- **Response**: `ApiResponse<MotelResponse>`

#### 3.5 updateMotel

- **URL**: `/api/v1/motels/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`MotelRequest`):

```json
{
  "motelName": "string",
  "area": 0.0,
  "averagePrice": 0,
  "address": "123 Example Street",
  "methodofcreation": "string",
  "maxperson": 0,
  "invoicedate": 0,
  "paymentdeadline": 0,
  "createdDate": null,
  "typeRoom": null,
  "account": null,
  "motelServices": []
}
```

- **Response**: `ApiResponse<MotelResponse>`

#### 3.6 deleteMotel

- **URL**: `/api/v1/motels/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Boolean>`

### MotelDeviceController

**Base Path**: `/api/v1/motel-devices`

#### 3.7 getMotelDevices

- **URL**: `/api/v1/motel-devices/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<List<MotelDeviceResponse>>`

#### 3.8 insertMotelDevice

- **URL**: `/api/v1/motel-devices`
- **Method**: `POST`
- **Request Body** (`MotelDeviceRequest`):

```json
{
  "motel": null,
  "deviceName": "string",
  "icon": "string",
  "value": 0.0,
  "valueInput": 0.0,
  "totalQuantity": 1,
  "totalUsing": 0,
  "totalNull": 0,
  "supplier": "string",
  "unit": "string"
}
```

- **Response**: `ApiResponse<MotelDeviceResponse>`

#### 3.9 deleteMotelDevice

- **URL**: `/api/v1/motel-devices/{motelDeviceId}`
- **Method**: `DELETE`
- **Path Variables**: `motelDeviceId` (UUID)
- **Response**: `ApiResponse<Void>`

### MotelServiceController

**Base Path**: `/api/v1/motel-services`

#### 3.10 createMotelService

- **URL**: `/api/v1/motel-services`
- **Method**: `POST`
- **Request Body** (`MotelServiceRequest`):

```json
{
  "motelId": "00000000-0000-0000-0000-000000000000",
  "nameService": "string",
  "price": 0,
  "chargetype": "string",
  "selectedRooms": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<MotelServiceResponse>`

#### 3.11 updateMotelServiceByMotelId

- **URL**: `/api/v1/motel-services/motel/{motelId}`
- **Method**: `PUT`
- **Path Variables**: `motelId` (UUID)
- **Request Body** (`MotelServiceUpdateRequest`):

```json
{
  "nameService": "string",
  "price": 0,
  "chargetype": "string",
  "selectedRooms": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<MotelServiceResponse>`

#### 3.12 updateMotelService

- **URL**: `/api/v1/motel-services/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`MotelServiceUpdateRequest`):

```json
{
  "nameService": "string",
  "price": 0,
  "chargetype": "string",
  "selectedRooms": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<MotelServiceResponse>`

#### 3.13 getAllMotelServices

- **URL**: `/api/v1/motel-services`
- **Method**: `GET`
- **Response**: `ApiResponse<List<MotelServiceResponse>>`

#### 3.14 getMotelServiceById

- **URL**: `/api/v1/motel-services/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<MotelServiceResponse>`

#### 3.15 deleteMotelService

- **URL**: `/api/v1/motel-services/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

### NameMotelServiceController

**Base Path**: `/name-motel-services`

#### 3.16 createNameMotelService

- **URL**: `/name-motel-services`
- **Method**: `POST`
- **Request Body** (`NameMotelServiceRequest`):

```json
{
  "typeService": null,
  "nameService": null
}
```

- **Response**: `ResponseEntity<NameMotelServiceResponse>`

#### 3.17 updateNameMotelService

- **URL**: `/name-motel-services/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`NameMotelServiceRequest`):

```json
{
  "typeService": null,
  "nameService": null
}
```

- **Response**: `ResponseEntity<NameMotelServiceResponse>`

#### 3.18 getAllNameMotelServices

- **URL**: `/name-motel-services`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<NameMotelServiceResponse>>`

#### 3.19 getNameMotelServiceById

- **URL**: `/name-motel-services/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<NameMotelServiceResponse>`

#### 3.20 deleteNameMotelService

- **URL**: `/name-motel-services/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<Void>`

---

## 🛏️ 4. PHONG

### RoomController

**Base Path**: `/api/v1/rooms`

#### 4.1 createRoom

- **URL**: `/api/v1/rooms`
- **Method**: `POST`
- **Request Body** (`RoomRequest`):

```json
{
  "motelId": "00000000-0000-0000-0000-000000000000",
  "name": null,
  "group": null,
  "price": null,
  "prioritize": null,
  "area": null,
  "deposit": null,
  "status": null,
  "finance": null,
  "description": null
}
```

- **Response**: `ApiResponse<RoomResponse>`

#### 4.2 getRoomById

- **URL**: `/api/v1/rooms/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<RoomResponse>`

#### 4.3 getAllRooms

- **URL**: `/api/v1/rooms`
- **Method**: `GET`
- **Response**: `ApiResponse<List<RoomResponse>>`

#### 4.4 updateRoom

- **URL**: `/api/v1/rooms/{roomId}`
- **Method**: `PUT`
- **Path Variables**: `roomId` (UUID)
- **Request Body** (`RoomRequest`):

```json
{
  "motelId": "00000000-0000-0000-0000-000000000000",
  "name": null,
  "group": null,
  "price": null,
  "prioritize": null,
  "area": null,
  "deposit": null,
  "status": null,
  "finance": null,
  "description": null
}
```

- **Response**: `ApiResponse<RoomResponse>`

#### 4.5 deleteRoom

- **URL**: `/api/v1/rooms/{roomId}`
- **Method**: `DELETE`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 4.6 getRoomsByMotelId

- **URL**: `/api/v1/rooms/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<List<RoomResponse>>`

#### 4.7 getRoomsByMotelIdWithoutContract

- **URL**: `/api/v1/rooms/motel/{motelId}/without-contract`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<List<RoomResponse>>`

#### 4.8 getRoomsByMotelIdWithContract

- **URL**: `/api/v1/rooms/motel/{motelId}/with-contract`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<List<RoomResponse>>`

### RoomDeviceController

**Base Path**: `/api/v1/room-devices`

#### 4.9 insertRoomDevice

- **URL**: `/api/v1/room-devices`
- **Method**: `POST`
- **Request Body** (`RoomDeviceRequest`):

```json
{
  "room": null,
  "motelDevice": null,
  "quantity": 1
}
```

- **Response**: `ApiResponse<RoomDeviceResponse>`

#### 4.10 deleteRoomDevice

- **URL**: `/api/v1/room-devices/{roomId}/devices/{motelDeviceId}`
- **Method**: `DELETE`
- **Path Variables**: `roomId` (UUID), `motelDeviceId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 4.11 getDeviceByRomId

- **URL**: `/api/v1/room-devices/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<List<RoomDeviceResponse>>`

#### 4.12 updateQuantityRoomDevice

- **URL**: `/api/v1/room-devices/{roomId}/devices/{motelDeviceId}`
- **Method**: `PUT`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<Void>`

### RoomServiceController

**Base Path**: `/api/v1/room-services`

#### 4.13 createRoomService

- **URL**: `/api/v1/room-services`
- **Method**: `POST`
- **Request Body** (`RoomServiceRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "00000000-0000-0000-0000-000000000000",
  "quantity": null
}
```

- **Response**: `ApiResponse<RoomServiceResponse>`

#### 4.14 updateRoomService

- **URL**: `/api/v1/room-services/{roomServiceId}`
- **Method**: `PUT`
- **Path Variables**: `roomServiceId` (UUID)
- **Request Body** (`RoomServiceRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "00000000-0000-0000-0000-000000000000",
  "quantity": null
}
```

- **Response**: `ApiResponse<RoomServiceResponse>`

#### 4.15 getRoomServiceById

- **URL**: `/api/v1/room-services/{roomServiceId}`
- **Method**: `GET`
- **Path Variables**: `roomServiceId` (UUID)
- **Response**: `ApiResponse<RoomServiceResponse>`

#### 4.16 deleteRoomService

- **URL**: `/api/v1/room-services/{roomServiceId}`
- **Method**: `DELETE`
- **Path Variables**: `roomServiceId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 4.17 findAll

- **URL**: `/api/v1/room-services`
- **Method**: `GET`
- **Response**: `ApiResponse<List<RoomServiceResponse>>`

#### 4.18 findByRoomId

- **URL**: `/api/v1/room-services/room/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<List<RoomServiceDetailResponse>>`

### RoomImageController

**Base Path**: `/rooms-images`

#### 4.19 postRoomImage

- **URL**: `/rooms-images`
- **Method**: `POST`
- **Request Body** (`RoomImageRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "image": "https://example.com/image.jpg"
}
```

- **Response**: `ApiResponse<RoomImageResponse>`

### RoomReviewController

**Base Path**: `/room-reviews`

#### 4.20 createRoomReview

- **URL**: `/room-reviews`
- **Method**: `POST`
- **Request Body** (`RoomReviewRequest`):

```json
{
  "username": "string",
  "fullName": "string",
  "avatar": "https://example.com/image.jpg",
  "comment": "string",
  "rating": 0,
  "roomId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<RoomReviewResponse>`

### TypeRoomController

**Base Path**: `/api/v1/type-rooms`

#### 4.21 createTypeRoom

- **URL**: `/api/v1/type-rooms`
- **Method**: `POST`
- **Request Body** (`TypeRoomRequest`):

```json
{
  "name": "string"
}
```

- **Response**: `ApiResponse<TypeRoomResponse>`

#### 4.22 findAllTypeRooms

- **URL**: `/api/v1/type-rooms`
- **Method**: `GET`
- **Response**: `ApiResponse<List<TypeRoomResponse>>`

---

## 📜 5. HOP DONG

### ContractController

**Base Path**: `/contracts`

#### 5.1 createContract

- **URL**: `/contracts`
- **Method**: `POST`
- **Request Body** (`ContractRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "tenantId": "00000000-0000-0000-0000-000000000000",
  "username": null,
  "contractTemplateId": "00000000-0000-0000-0000-000000000000",
  "brokerId": "00000000-0000-0000-0000-000000000000",
  "moveInDate": null,
  "leaseTerm": null,
  "closeContract": null,
  "description": null,
  "debt": null,
  "price": null,
  "actualPrice": null,
  "deposit": null,
  "collectionCycle": null,
  "createDate": null,
  "signContract": null,
  "language": null,
  "countTenant": null,
  "status": null,
  "reportCloseContract": null
}
```

- **Response**: `ResponseEntity<ContractResponse>`

#### 5.2 getContractById

- **URL**: `/contracts/{contractId}`
- **Method**: `GET`
- **Path Variables**: `contractId` (UUID)
- **Response**: `ResponseEntity<ContractResponse>`

#### 5.3 updateContract

- **URL**: `/contracts/{contractId}`
- **Method**: `PUT`
- **Path Variables**: `contractId` (UUID)
- **Request Body** (`ContractRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "tenantId": "00000000-0000-0000-0000-000000000000",
  "username": null,
  "contractTemplateId": "00000000-0000-0000-0000-000000000000",
  "brokerId": "00000000-0000-0000-0000-000000000000",
  "moveInDate": null,
  "leaseTerm": null,
  "closeContract": null,
  "description": null,
  "debt": null,
  "price": null,
  "actualPrice": null,
  "deposit": null,
  "collectionCycle": null,
  "createDate": null,
  "signContract": null,
  "language": null,
  "countTenant": null,
  "status": null,
  "reportCloseContract": null
}
```

- **Response**: `ResponseEntity<ContractResponse>`

#### 5.4 deleteContract

- **URL**: `/contracts/{contractId}`
- **Method**: `DELETE`
- **Path Variables**: `contractId` (UUID)
- **Response**: `ResponseEntity<Void>`

#### 5.5 deleteContractByRoomId

- **URL**: `/contracts/room/{roomId}`
- **Method**: `DELETE`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ResponseEntity<Void>`

#### 5.6 getAllContractsByMotelId

- **URL**: `/contracts/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ResponseEntity<List<ContractResponse>>`

#### 5.7 getContractByRoomId

- **URL**: `/contractsroom/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ResponseEntity<ContractResponse>`

#### 5.8 updateContractStatus

- **URL**: `/contracts/update-status`
- **Method**: `PUT`
- **Query Params**: `roomId` (UUID), `newStatus` (ContractStatus)
- **Response**: `ResponseEntity<String>`

#### 5.9 updateContractDetailChangeRoom

- **URL**: `/contracts/update-contract`
- **Method**: `PUT`
- **Query Params**: `ContractId` (UUID), `roomId` (UUID), `deposit` (Double), `price` (Double)
- **Response**: `ResponseEntity<String>`

#### 5.10 updateContractsByDaysDifference

- **URL**: `/contracts/update-status-by-days-difference`
- **Method**: `PUT`
- **Query Params**: `newStatus` (ContractStatus), `thresholdDays` (int)
- **Response**: `String`

#### 5.11 updateContractsByDaysDifference2

- **URL**: `/contracts/update-status-by-days-difference2`
- **Method**: `PUT`
- **Query Params**: `newStatus` (ContractStatus), `thresholdDays` (int)
- **Response**: `String`

#### 5.12 updateCloseContract

- **URL**: `/contracts/update-close-contract`
- **Method**: `PUT`
- **Query Params**: `contractId` (UUID)
- **Response**: `ResponseEntity<String>`

### ContractTemplateController

**Base Path**: `/contract-templates`

#### 5.13 createContractTemplate

- **URL**: `/contract-templates`
- **Method**: `POST`
- **Request Body** (`ContractTemplateRequest`):

```json
{
  "motelId": "00000000-0000-0000-0000-000000000000",
  "namecontract": null,
  "templatename": null,
  "sortOrder": null,
  "content": null
}
```

- **Response**: `ResponseEntity<ContractTemplateResponse>`

#### 5.14 getContractTemplateById

- **URL**: `/contract-templates/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<ContractTemplateResponse>`

#### 5.15 getAllContractTemplates

- **URL**: `/contract-templates`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<ContractTemplateResponse>>`

#### 5.16 getContractTemplatesByMotelId

- **URL**: `/contract-templates/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ResponseEntity<List<ContractTemplateResponse>>`

#### 5.17 updateContractTemplate

- **URL**: `/contract-templates/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`ContractTemplateRequest`):

```json
{
  "motelId": "00000000-0000-0000-0000-000000000000",
  "namecontract": null,
  "templatename": null,
  "sortOrder": null,
  "content": null
}
```

- **Response**: `ResponseEntity<ContractTemplateResponse>`

#### 5.18 deleteContractTemplate

- **URL**: `/contract-templates/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<Void>`

### ContractDeviceController

**Base Path**: `/contract-device`

#### 5.19 createContractDevice

- **URL**: `/contract-device`
- **Method**: `POST`
- **Request Body** (`ContractDeviceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "motelDeviceId": "00000000-0000-0000-0000-000000000000",
  "quantity": null
}
```

- **Response**: `ResponseEntity<ContractDeviceResponse>`

#### 5.20 updateContractDevice

- **URL**: `/contract-device/{id}`
- **Method**: `PUT`
- **Path Variables**: `contractDeviceId` (UUID)
- **Request Body** (`ContractDeviceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "motelDeviceId": "00000000-0000-0000-0000-000000000000",
  "quantity": null
}
```

- **Response**: `ResponseEntity<ContractDeviceResponse>`

#### 5.21 deleteContractDevice

- **URL**: `/contract-device/{id}`
- **Method**: `DELETE`
- **Path Variables**: `contractDeviceId` (UUID)
- **Response**: `ResponseEntity<Void>`

#### 5.22 getContractDeviceById

- **URL**: `/contract-device/{id}`
- **Method**: `GET`
- **Path Variables**: `contractDeviceId` (UUID)
- **Response**: `ResponseEntity<ContractDeviceResponse>`

#### 5.23 getAllContractDevices

- **URL**: `/contract-device`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<ContractDeviceResponse>>`

### ContractDeviceHandoverController

**Base Path**: `/api/contract-device-handovers`

#### 5.24 getByContract

- **URL**: `/api/contract-device-handovers/contract/{contractId}`
- **Method**: `GET`
- **Path Variables**: `contractId` (UUID)
- **Response**: `ResponseEntity<List<ContractDeviceHandover>>`

#### 5.25 save

- **URL**: `/api/contract-device-handovers`
- **Method**: `POST`
- **Request Body**: `ContractDeviceHandover`
- **Response**: `ResponseEntity<ContractDeviceHandover>`

#### 5.26 delete

- **URL**: `/api/contract-device-handovers/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<Void>`

### ContractOccupantController

**Base Path**: `/api/contract-occupants`

#### 5.27 getByContract

- **URL**: `/api/contract-occupants/contract/{contractId}`
- **Method**: `GET`
- **Path Variables**: `contractId` (UUID)
- **Response**: `ResponseEntity<List<ContractOccupant>>`

#### 5.28 save

- **URL**: `/api/contract-occupants`
- **Method**: `POST`
- **Request Body**: `ContractOccupant`
- **Response**: `ResponseEntity<ContractOccupant>`

#### 5.29 delete

- **URL**: `/api/contract-occupants/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ResponseEntity<Void>`

### ContractServiceController

**Base Path**: `/contract-service`

#### 5.30 createContractService

- **URL**: `/contract-service`
- **Method**: `POST`
- **Request Body** (`ContractServiceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ResponseEntity<ContractServiceResponse>`

#### 5.31 updateContractService

- **URL**: `/contract-service/{id}`
- **Method**: `PUT`
- **Path Variables**: `contractServiceId` (UUID)
- **Request Body** (`ContractServiceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ResponseEntity<ContractServiceResponse>`

#### 5.32 deleteContractService

- **URL**: `/contract-service/{id}`
- **Method**: `DELETE`
- **Path Variables**: `contractServiceId` (UUID)
- **Response**: `ResponseEntity<Void>`

#### 5.33 getContractServiceById

- **URL**: `/contract-service/{id}`
- **Method**: `GET`
- **Path Variables**: `contractServiceId` (UUID)
- **Response**: `ResponseEntity<ContractServiceResponse>`

#### 5.34 getAllContractServices

- **URL**: `/contract-service`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<ContractServiceResponse>>`

### TemporaryContractController

**Base Path**: `/temporary-contracts`

#### 5.35 getAllTemRC

- **URL**: `/temporary-contracts`
- **Method**: `GET`
- **Response**: `ApiResponse<List<TemporaryContractResponse>>`

#### 5.36 getTemRCByAccount

- **URL**: `/temporary-contracts/account`
- **Method**: `GET`
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<List<TemporaryContractResponse>>`

#### 5.37 insertTemRC

- **URL**: `/temporary-contracts`
- **Method**: `POST`
- **Request Body** (`TemporaryContractRequest`):

```json
{
  "householdHead": "string",
  "representativeName": "string",
  "phone": "0123456789",
  "birth": null,
  "permanentAddress": "123 Example Street",
  "job": "string",
  "identifier": "string",
  "placeOfIssue": "string",
  "dateOfIssue": null,
  "motelId": "string",
  "tenantUsername": null
}
```

- **Response**: `ApiResponse<TemporaryContractResponse>`

#### 5.38 updateTemRC

- **URL**: `/temporary-contracts/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`TemporaryContractRequest`):

```json
{
  "householdHead": "string",
  "representativeName": "string",
  "phone": "0123456789",
  "birth": null,
  "permanentAddress": "123 Example Street",
  "job": "string",
  "identifier": "string",
  "placeOfIssue": "string",
  "dateOfIssue": null,
  "motelId": "string",
  "tenantUsername": null
}
```

- **Response**: `ApiResponse<TemporaryContractResponse>`

#### 5.39 deleteTemRC

- **URL**: `/temporary-contracts/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

---

## 👥 6. KHACH THUE

### TenantController

**Base Path**: `/tenant`

#### 6.1 getAllTenants

- **URL**: `/tenant`
- **Method**: `GET`
- **Response**: `ApiResponse<List<TenantResponse>>`

#### 6.2 getTenantById

- **URL**: `/tenant/tenant-id`
- **Method**: `GET`
- **Query Params**: `id` (UUID)
- **Response**: `ApiResponse<TenantResponse>`

#### 6.3 insertTenant

- **URL**: `/tenant/insert/{roomId}`
- **Method**: `POST`
- **Path Variables**: `roomId` (UUID)
- **Request Body** (`TenantRequest`):

```json
{
  "avatar": "https://example.com/image.jpg",
  "fullName": "string",
  "phone": "0123456789",
  "cccd": "string",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "address": "123 Example Street",
  "job": "string",
  "licenseDate": null,
  "placeOfLicense": "string",
  "frontPhoto": "string",
  "backPhoto": "string",
  "role": true,
  "relationship": "string",
  "typeOfTenant": true,
  "temporaryResidence": true,
  "informationVerify": true
}
```

- **Response**: `ApiResponse<TenantResponse>`

#### 6.4 updateTenant

- **URL**: `/tenant/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`TenantRequest`):

```json
{
  "avatar": "https://example.com/image.jpg",
  "fullName": "string",
  "phone": "0123456789",
  "cccd": "string",
  "email": "user@example.com",
  "birthday": null,
  "gender": null,
  "address": "123 Example Street",
  "job": "string",
  "licenseDate": null,
  "placeOfLicense": "string",
  "frontPhoto": "string",
  "backPhoto": "string",
  "role": true,
  "relationship": "string",
  "typeOfTenant": true,
  "temporaryResidence": true,
  "informationVerify": true
}
```

- **Response**: `ApiResponse<TenantResponse>`

#### 6.5 deleteTenant

- **URL**: `/tenant/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Boolean>`

#### 6.6 deleteTenantByRoomId

- **URL**: `/tenant/room/{roomID}`
- **Method**: `DELETE`
- **Path Variables**: `roomID` (UUID)
- **Response**: `ApiResponse<Boolean>`

#### 6.7 getAllTenantsRoomId

- **URL**: `/tenant/roomId/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<List<TenantResponse>>`

### BrokerController

**Base Path**: `/broker`

#### 6.8 createBroker

- **URL**: `/broker`
- **Method**: `POST`
- **Request Body** (`BrokerCreateRequest`):

```json
{
  "name": "string",
  "phone": "0123456789",
  "motelId": "00000000-0000-0000-0000-000000000000",
  "commissionRate": 0
}
```

- **Response**: `ApiResponse<BrokerResponse>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Tạo môi giới thành công`

#### 6.9 getAllBroker

- **URL**: `/broker/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (String)
- **Response**: `ApiResponse<List<BrokerResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy tất cả môi giới thành công`

### CarController

**Base Path**: `/cars`

#### 6.10 createCar

- **URL**: `/cars`
- **Method**: `POST`
- **Request Body** (`CarRequest`):

```json
{
  "name": null,
  "number": null,
  "image": null,
  "roomId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ResponseEntity<CarResponse>`

#### 6.11 getCarById

- **URL**: `/cars/{carId}`
- **Method**: `GET`
- **Path Variables**: `carId` (UUID)
- **Response**: `ResponseEntity<CarResponse>`

#### 6.12 getAllCars

- **URL**: `/cars`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<CarResponse>>`

#### 6.13 updateCar

- **URL**: `/cars/{carId}`
- **Method**: `PUT`
- **Path Variables**: `carId` (UUID)
- **Request Body** (`CarRequest`):

```json
{
  "name": null,
  "number": null,
  "image": null,
  "roomId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ResponseEntity<CarResponse>`

#### 6.14 deleteCar

- **URL**: `/cars/{carId}`
- **Method**: `DELETE`
- **Path Variables**: `carId` (UUID)
- **Response**: `ResponseEntity<Void>`

#### 6.15 getCarsByRoomId

- **URL**: `/cars/room/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ResponseEntity<List<CarResponse>>`

---

## 💰 7. HOA DON & THANH TOAN

### InvoiceController

**Base Path**: `/invoices`

#### 7.1 createInvoice

- **URL**: `/invoices`
- **Method**: `POST`
- **Request Body** (`InvoiceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "invoiceReason": null,
  "invoiceCreateMonth": null,
  "invoiceCreateDate": null,
  "serviceDetails": [],
  "deviceDetails": [],
  "additionItems": []
}
```

- **Response**: `ResponseEntity<ApiResponse<InvoiceResponse>>`

#### 7.2 createInvoice

- **URL**: `/invoices/create`
- **Method**: `POST`
- **Request Body** (`InvoiceRequest`):

```json
{
  "contractId": "00000000-0000-0000-0000-000000000000",
  "invoiceReason": null,
  "invoiceCreateMonth": null,
  "invoiceCreateDate": null,
  "serviceDetails": [],
  "deviceDetails": [],
  "additionItems": []
}
```

- **Response**: `ResponseEntity<ApiResponse<InvoiceResponse>>`

#### 7.3 cancelInvoice

- **URL**: `/invoices/{invoiceId}/cancel`
- **Method**: `PUT`
- **Path Variables**: `invoiceId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 7.4 deleteInvoice

- **URL**: `/invoices/{invoiceId}`
- **Method**: `DELETE`
- **Path Variables**: `invoiceId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 7.5 deleteInvoice

- **URL**: `/invoices/delete/{invoiceId}`
- **Method**: `DELETE`
- **Path Variables**: `invoiceId` (UUID)
- **Response**: `ApiResponse<Void>`

#### 7.6 updateInvoice

- **URL**: `/invoices/{invoiceId}`
- **Method**: `PUT`
- **Path Variables**: `invoiceId` (UUID)
- **Request Body** (`UpdateInvoiceRequest`):

```json
{
  "invoiceReason": null,
  "invoiceCreateMonth": null,
  "invoiceCreateDate": null,
  "dueDate": null,
  "serviceDetails": [],
  "deviceDetails": [],
  "additionItems": []
}
```

- **Response**: `ApiResponse<InvoiceResponse>`

#### 7.7 updateInvoice

- **URL**: `/invoices/update/{invoiceId}`
- **Method**: `PUT`
- **Path Variables**: `invoiceId` (UUID)
- **Request Body** (`UpdateInvoiceRequest`):

```json
{
  "invoiceReason": null,
  "invoiceCreateMonth": null,
  "invoiceCreateDate": null,
  "dueDate": null,
  "serviceDetails": [],
  "deviceDetails": [],
  "additionItems": []
}
```

- **Response**: `ApiResponse<InvoiceResponse>`

#### 7.8 getInvoicesByMotelId

- **URL**: `/invoices/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<InvoiceResponse>>`

#### 7.9 collectPayment

- **URL**: `/invoices/{invoiceId}/collect-payment`
- **Method**: `PATCH`
- **Path Variables**: `invoiceId` (UUID)
- **Request Body** (`CollectPaymentRequest`):

```json
{
  "totalAmount": null,
  "paymentName": null,
  "description": null,
  "paymentDate": null
}
```

- **Response**: `ApiResponse<InvoiceResponse>`

#### 7.10 generateQrCode

- **URL**: `/invoices/{invoiceId}/generate-qr`
- **Method**: `GET`
- **Path Variables**: `invoiceId` (UUID)
- **Response**: `ApiResponse<QRCodeResponse>`

### PaymentController

**Base Path**: `/payment`

#### 7.11 payment

- **URL**: `/payment/payment-paypal`
- **Method**: `POST`
- **Query Params**: `totalPrice` (double), `userName` (String)
- **Response**: `Map<String, String>`

#### 7.12 payment

- **URL**: `/payment/paypal/create`
- **Method**: `POST`
- **Query Params**: `totalPrice` (double), `userName` (String)
- **Response**: `Map<String, String>`

#### 7.13 cancel

- **URL**: `/payment/paypal/cancel`
- **Method**: `GET`
- **Response**: `String`

#### 7.14 error

- **URL**: `/payment/paypal/error`
- **Method**: `GET`
- **Response**: `String`

#### 7.15 success

- **URL**: `/payment/paypal/success`
- **Method**: `GET`
- **Response**: `String`

#### 7.16 getPay

- **URL**: `/payment/create_payment`
- **Method**: `POST`
- **Request Body**: `Map`
- **Response**: `ResponseEntity<?>`

#### 7.17 getPay

- **URL**: `/payment/vnpay/create`
- **Method**: `POST`
- **Request Body**: `Map`
- **Response**: `ResponseEntity<?>`

#### 7.18 paymentCallback

- **URL**: `/payment/vnpay-callback`
- **Method**: `GET`
- **Response**: `ResponseEntity<Void>`

#### 7.19 paymentSuccess

- **URL**: `/payment/paymentSuccess`
- **Method**: `GET`
- **Response**: `String`

#### 7.20 paymentFailed

- **URL**: `/payment/paymentFailed`
- **Method**: `GET`
- **Response**: `String`

#### 7.21 paymentMoMo

- **URL**: `/payment/payMoMo`
- **Method**: `POST`
- **Request Body**: `Map`
- **Response**: `PaymentResponse`

#### 7.22 paymentMoMo

- **URL**: `/payment/momo/create`
- **Method**: `POST`
- **Request Body**: `Map`
- **Response**: `PaymentResponse`

#### 7.23 paymentMoMoSuccess

- **URL**: `/payment/paymentMoMoSuccess`
- **Method**: `GET`
- **Response**: `String`

#### 7.24 createPaymentIntent

- **URL**: `/payment/payment-stripe`
- **Method**: `POST`
- **Request Body** (`StripeRequest`):

```json
{
  "amount": null,
  "email": null,
  "productName": null
}
```

- **Response**: `ResponseEntity<StripeResponse>`

#### 7.25 createPaymentIntent

- **URL**: `/payment/stripe/create`
- **Method**: `POST`
- **Request Body** (`StripeRequest`):

```json
{
  "amount": null,
  "email": null,
  "productName": null
}
```

- **Response**: `ResponseEntity<StripeResponse>`

#### 7.26 getAllPayments

- **URL**: `/payment/list_payment`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<com.rrms.rrms.models.Payment>>`

#### 7.27 getAllPayments

- **URL**: `/payment/list`
- **Method**: `GET`
- **Response**: `ResponseEntity<List<com.rrms.rrms.models.Payment>>`

### TransactionController

**Base Path**: `/transactions`

#### 7.28 getTransactionsByUsername

- **URL**: `/transactions/{username}`
- **Method**: `GET`
- **Path Variables**: `username` (String)
- **Query Params**: `page` (Integer)
- **Response**: `ApiResponse<PageResponse<TransactionResponse>>`

#### 7.29 createReceipt

- **URL**: `/transactions/receipts`
- **Method**: `POST`
- **Query Params**: `username` (String)
- **Request Body** (`TransactionRequest`):

```json
{
  "amount": null,
  "invoiceId": "00000000-0000-0000-0000-000000000000",
  "payerName": null,
  "paymentDescription": null,
  "category": null,
  "transactionDate": null,
  "transactionType": null
}
```

- **Response**: `ApiResponse<TransactionResponse>`

#### 7.30 createExpense

- **URL**: `/transactions/expenses`
- **Method**: `POST`
- **Query Params**: `username` (String)
- **Request Body** (`TransactionRequest`):

```json
{
  "amount": null,
  "invoiceId": "00000000-0000-0000-0000-000000000000",
  "payerName": null,
  "paymentDescription": null,
  "category": null,
  "transactionDate": null,
  "transactionType": null
}
```

- **Response**: `ApiResponse<TransactionResponse>`

#### 7.31 deleteTransaction

- **URL**: `/transactions/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<Void>`

#### 7.32 getSummary

- **URL**: `/transactions/summary`
- **Method**: `GET`
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<TransactionSummaryResponse>`

### MeterReadingController

**Base Path**: `/api/meter-readings`

#### 7.33 getAllByMotel

- **URL**: `/api/meter-readings/motel/{motelId}`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<List<MeterReadingResponse>>`

#### 7.34 getAllByRoom

- **URL**: `/api/meter-readings/room/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<List<MeterReadingResponse>>`

#### 7.35 save

- **URL**: `/api/meter-readings`
- **Method**: `POST`
- **Request Body** (`MeterReadingRequest`):

```json
{
  "roomId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "00000000-0000-0000-0000-000000000000",
  "oldIndex": null,
  "newIndex": null,
  "readingDate": null,
  "imageUrl": null
}
```

- **Response**: `ResponseEntity<ApiResponse<MeterReadingResponse>>`

#### 7.36 delete

- **URL**: `/api/meter-readings/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

---

## 📢 8. BAN TIN & TIM KIEM

### BulletinBoardController

**Base Path**: `/api/v1/bulletin-boards`

#### 8.1 getAllBulletinBoards

- **URL**: `/api/v1/bulletin-boards`
- **Method**: `GET`
- **Response**: `ApiResponse<List<BulletinBoardResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy tất cả bảng tin thành công`

#### 8.2 getBulletinBoardById

- **URL**: `/api/v1/bulletin-boards/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<BulletinBoardResponse>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy bảng tin theo id thành công`

#### 8.3 createBulletinBoard

- **URL**: `/api/v1/bulletin-boards`
- **Method**: `POST`
- **Request Body** (`BulletinBoardRequest`):

```json
{
  "username": "string",
  "title": "string",
  "rentalCategory": "string",
  "description": "string",
  "rentPrice": null,
  "promotionalRentalPrice": null,
  "deposit": null,
  "area": 0,
  "electricityPrice": null,
  "waterPrice": null,
  "maxPerson": "string",
  "moveInDate": null,
  "openingHours": "string",
  "closeHours": "string",
  "address": "123 Example Street",
  "longitude": 0.0,
  "latitude": 0.0,
  "status": true,
  "isActive": true,
  "bulletinBoardImages": [],
  "bulletinBoardRules": [],
  "bulletinBoardRentalAmenities": []
}
```

- **Response**: `ApiResponse<BulletinBoardResponse>`
- **HTTP Status thành công**: `201 Created`
- **Success Message hiện tại**: `Tạo bảng tin thành công`

#### 8.4 updateBulletinBoard

- **URL**: `/api/v1/bulletin-boards/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`BulletinBoardRequest`):

```json
{
  "username": "string",
  "title": "string",
  "rentalCategory": "string",
  "description": "string",
  "rentPrice": null,
  "promotionalRentalPrice": null,
  "deposit": null,
  "area": 0,
  "electricityPrice": null,
  "waterPrice": null,
  "maxPerson": "string",
  "moveInDate": null,
  "openingHours": "string",
  "closeHours": "string",
  "address": "123 Example Street",
  "longitude": 0.0,
  "latitude": 0.0,
  "status": true,
  "isActive": true,
  "bulletinBoardImages": [],
  "bulletinBoardRules": [],
  "bulletinBoardRentalAmenities": []
}
```

- **Response**: `ApiResponse<BulletinBoardResponse>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Cập nhật bảng tin thành công`

#### 8.5 getBulletinBoardTable

- **URL**: `/api/v1/bulletin-boards/table/{username}`
- **Method**: `GET`
- **Path Variables**: `username` (String)
- **Response**: `ApiResponse<List<BulletinBoardTableResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy bảng tin theo bảng thành công`

#### 8.6 getInactiveBulletinBoards

- **URL**: `/api/v1/bulletin-boards/inactive`
- **Method**: `GET`
- **Response**: `ApiResponse<List<BulletinBoardResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy các bảng tin không hoạt động thành công`

#### 8.7 approveBulletinBoard

- **URL**: `/api/v1/bulletin-boards/{id}/approve`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<BulletinBoardResponse>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Duyệt bảng tin thành công`

#### 8.8 deleteBulletinBoard

- **URL**: `/api/v1/bulletin-boards/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Xóa bảng tin thành công`

#### 8.9 searchBulletinBoards

- **URL**: `/api/v1/bulletin-boards/search`
- **Method**: `GET`
- **Query Params**: `address` (String)
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Tìm kiếm bảng tin thành công`

### BulletinBoardImageController

**Base Path**: `/bulletin-board-image`

#### 8.10 deleteBulletinBoardImage

- **URL**: `/bulletin-board-image/{bulletinBoardImageId}`
- **Method**: `DELETE`
- **Path Variables**: `bulletinBoardImageId` (UUID)
- **Response**: `ResponseEntity<Void>`

### BulletinBoardReviewsController

**Base Path**: `/bulletin-board-reviews`

#### 8.11 createBulletinBoardReviews

- **URL**: `/bulletin-board-reviews`
- **Method**: `POST`
- **Request Body** (`BulletinBoardReviewsRequest`):

```json
{
  "username": "string",
  "bulletinBoardId": "00000000-0000-0000-0000-000000000000",
  "rating": 0,
  "content": "string"
}
```

- **Response**: `ApiResponse<BulletinBoardReviewsResponse>`
- **HTTP Status thành công**: `201 Created`
- **Success Message hiện tại**: `Tạo đánh giá trên bảng tin thành công`

#### 8.12 getBulletinBoardReviewsByBulletinBoardIdAndUsername

- **URL**: `/bulletin-board-reviews`
- **Method**: `GET`
- **Query Params**: `bulletinBoardId` (UUID), `username` (String)
- **Response**: `ApiResponse<BulletinBoardReviewsResponse>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Nhận đánh giá bảng tin thành công`

#### 8.13 getRatingHistoryByBulletinBoardIdAndUsername

- **URL**: `/bulletin-board-reviews/rating-history`
- **Method**: `GET`
- **Query Params**: `username` (String)
- **Response**: `ApiResponse<List<RatingHistoryResponse>>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Lấy lịch sử xếp hạng thành công`

#### 8.14 deleteBulletinBoardReviewsByBulletinBoardReviewsId

- **URL**: `/bulletin-board-reviews/{bulletinBoardReviewsId}`
- **Method**: `DELETE`
- **Path Variables**: `bulletinBoardReviewsId` (UUID)
- **Response**: `ApiResponse<Integer>`
- **HTTP Status thành công**: `200 OK`
- **Success Message hiện tại**: `Xóa thành công các đánh giá trên bảng tin`

### SearchController

**Base Path**: `/api/v1/search`

#### 8.15 getRoomsSortedByPrice

- **URL**: `/api/v1/search/sort`
- **Method**: `GET`
- **Query Params**: `sortOrder` (String)
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

#### 8.16 getRooms

- **URL**: `/api/v1/search`
- **Method**: `GET`
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

#### 8.17 getLatestRooms

- **URL**: `/api/v1/search/latest`
- **Method**: `GET`
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

#### 8.18 getOldestRooms

- **URL**: `/api/v1/search/oldest`
- **Method**: `GET`
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

#### 8.19 searchByAddress

- **URL**: `/api/v1/search/by-address`
- **Method**: `GET`
- **Query Params**: `address` (String)
- **Response**: `ApiResponse<List<BulletinBoardSearchResponse>>`

---

## 📊 9. BAO CAO & THONG KE

### ReportController

**Base Path**: `/report`

#### 9.1 getTotalRooms

- **URL**: `/report/total-rooms`
- **Method**: `GET`
- **Query Params**: `motelId` (UUID), `username` (String)
- **Response**: `ApiResponse<Integer>`

#### 9.2 getRoomCountsByContractStatus

- **URL**: `/report/room-counts`
- **Method**: `GET`
- **Response**: `ApiResponse<List<MotelRoomCountResponse>>`

#### 9.3 getTotalTenants

- **URL**: `/report/{motelId}/tenants/count`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<Integer>`

#### 9.4 getTenantSummary

- **URL**: `/report/tenant/summary`
- **Method**: `GET`
- **Response**: `ApiResponse<List<TenantSummaryDTO>>`

#### 9.5 getTotalDeposit

- **URL**: `/report/{motelId}/deposits`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<Double>`

#### 9.6 getTotalReserveDeposit

- **URL**: `/report/{motelId}/reserve-deposits`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<Double>`

#### 9.7 getTotalPaidInvoices

- **URL**: `/report/{motelId}/total-paid-invoices`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<BigDecimal>`

#### 9.8 getTotalPaidRoomPrice

- **URL**: `/report/{motelId}/total-paid-room-price`
- **Method**: `GET`
- **Path Variables**: `motelId` (UUID)
- **Response**: `ApiResponse<BigDecimal>`

### StatisticsController

**Base Path**: `/statistics`

#### 9.9 getTotalAccounts

- **URL**: `/statistics/total-accounts`
- **Method**: `GET`
- **Response**: `ApiResponse<Long>`

#### 9.10 getTotalTenants

- **URL**: `/statistics/total-tenants`
- **Method**: `GET`
- **Response**: `ApiResponse<Long>`

#### 9.11 getTotalHostAccounts

- **URL**: `/statistics/total-host-accounts`
- **Method**: `GET`
- **Response**: `ApiResponse<Long>`

#### 9.12 getTotalMotels

- **URL**: `/statistics/total-motels`
- **Method**: `GET`
- **Response**: `ApiResponse<Long>`

#### 9.13 getAccountsCreatedLastWeek

- **URL**: `/statistics/total-account-last-week`
- **Method**: `GET`
- **Response**: `ApiResponse<Map<DayOfWeek, Long>>`

#### 9.14 getAccountsCreatedThisYear

- **URL**: `/statistics/accounts-total-this-year`
- **Method**: `GET`
- **Response**: `ApiResponse<Map<Integer, Long>>`

#### 9.15 getAccountsCreatedLastYear

- **URL**: `/statistics/accounts-total-last-year`
- **Method**: `GET`
- **Response**: `ApiResponse<Map<Integer, Long>>`

#### 9.16 getTotalMotelsByMonth

- **URL**: `/statistics/total-motel-by-month`
- **Method**: `GET`
- **Response**: `ApiResponse<Map<Integer, Long>>`

#### 9.17 getRecentHosts

- **URL**: `/statistics/account-recent-hosts`
- **Method**: `GET`
- **Response**: `ApiResponse<List<AccountResponse>>`

---

## 📅 10. KHAC

### SupportController

**Base Path**: `/support`

#### 10.1 createSupport

- **URL**: `/support`
- **Method**: `POST`
- **Request Body** (`SupportRequest`):

```json
{
  "username": null,
  "contactName": null,
  "contactPhone": null,
  "dateOfStay": null,
  "priceFirst": null,
  "priceEnd": null
}
```

- **Response**: `ResponseEntity<ApiResponse<SupportResponse>>`

#### 10.2 createSupport

- **URL**: `/support/create`
- **Method**: `POST`
- **Request Body** (`SupportRequest`):

```json
{
  "username": null,
  "contactName": null,
  "contactPhone": null,
  "dateOfStay": null,
  "priceFirst": null,
  "priceEnd": null
}
```

- **Response**: `ResponseEntity<ApiResponse<SupportResponse>>`

#### 10.3 getAllSupports

- **URL**: `/support`
- **Method**: `GET`
- **Response**: `ApiResponse<List<SupportResponse>>`

#### 10.4 getAllSupports

- **URL**: `/support/getAll`
- **Method**: `GET`
- **Response**: `ApiResponse<List<SupportResponse>>`

#### 10.5 getSupportById

- **URL**: `/support/{supportId}`
- **Method**: `GET`
- **Path Variables**: `supportId` (UUID)
- **Response**: `ApiResponse<SupportResponse>`

#### 10.6 deleteSupport

- **URL**: `/support/{supportId}`
- **Method**: `DELETE`
- **Path Variables**: `supportId` (UUID)
- **Response**: `ApiResponse<Void>`

### RoomReservationController

**Base Path**: `/room-reservations`

#### 10.7 createRoomReservation

- **URL**: `/room-reservations`
- **Method**: `POST`
- **Request Body** (`RoomReservationRequest`):

```json
{
  "createDate": "2024-01-01",
  "moveInDate": "2024-01-01",
  "nameTenant": "string",
  "phoneTenant": "0123456789",
  "deposit": 1000000.0,
  "note": "string",
  "status": null,
  "roomId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<RoomReservationResponse>`

#### 10.8 getRoomReservationById

- **URL**: `/room-reservations/{id}`
- **Method**: `GET`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<RoomReservationResponse>`

#### 10.9 getAllRoomReservations

- **URL**: `/room-reservations`
- **Method**: `GET`
- **Response**: `ApiResponse<List<RoomReservationResponse>>`

#### 10.10 updateRoomReservation

- **URL**: `/room-reservations/{id}`
- **Method**: `PUT`
- **Path Variables**: `id` (UUID)
- **Request Body** (`RoomReservationRequest`):

```json
{
  "createDate": "2024-01-01",
  "moveInDate": "2024-01-01",
  "nameTenant": "string",
  "phoneTenant": "0123456789",
  "deposit": 1000000.0,
  "note": "string",
  "status": null,
  "roomId": "00000000-0000-0000-0000-000000000000"
}
```

- **Response**: `ApiResponse<RoomReservationResponse>`

#### 10.11 deleteRoomReservation

- **URL**: `/room-reservations/{id}`
- **Method**: `DELETE`
- **Path Variables**: `id` (UUID)
- **Response**: `ApiResponse<Void>`

#### 10.12 getRoomReservationsByRoomId

- **URL**: `/room-reservations/room/{roomId}`
- **Method**: `GET`
- **Path Variables**: `roomId` (UUID)
- **Response**: `ApiResponse<List<RoomReservationResponse>>`

### CaptchaController

**Base Path**: `/api`

#### 10.13 verifyCaptcha

- **URL**: `/api/verify-captcha`
- **Method**: `POST`
- **Request Body**: `Map`
- **Response**: `ResponseEntity<Map<String, Object>>`

---

## 📌 11. CONTROLLERS KHÁC

### ServiceController

**Base Path**: `/service`

#### 11.1 createService

- **URL**: `/service`
- **Method**: `POST`
- **Request Body** (`ServiceRequest`):

```json
{
  "typeService": "string",
  "nameService": "string"
}
```

- **Response**: `ApiResponse<ServiceResponse>`

---

**GHI CHÚ CHUNG**:

- Hầu hết các API yêu cầu xác thực qua Header: `Authorization: Bearer <JWT_TOKEN>`.
- Các API trả về `ApiResponse<T>` sẽ có cấu trúc: `{ "code": 200, "message": "...", "result": { ... } }`.
- Sử dụng **Swagger UI** tại `http://localhost:7000/swagger-ui.html` để xem chi tiết nhất các Model DTO.
