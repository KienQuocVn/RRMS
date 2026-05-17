# 📋 RRMS Mobile - Coding Standards & Conventions

> Tài liệu quy chuẩn phát triển cho dự án RRMS Mobile (React Native + Expo)
> Phiên bản: 1.0.0 | Cập nhật: 2026-04-17

---

## 📁 1. Cấu trúc Source Code

```
mobile/
├── app/                          # Expo Router - File-based routing
│   ├── _layout.tsx               # Root layout (Stack: auth + tabs)
│   ├── modal.tsx                 # Modal screens
│   ├── (auth)/                   # 🔐 Nhóm Auth (Login, Register, ForgotPass)
│   │   ├── _layout.tsx           # Auth Stack layout
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   └── (tabs)/                   # 📱 Nhóm Main App (Bottom Tabs)
│       ├── _layout.tsx           # Bottom Tab layout
│       ├── (home)/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       └── rooms/
│           ├── index.tsx
│           ├── add.tsx
│           └── [id].tsx
│
├── components/                   # 🧩 UI Components tái sử dụng
│   ├── auth/                     # Components cho Auth screens
│   │   ├── index.ts              # Barrel exports
│   │   ├── auth-logo.tsx
│   │   ├── auth-input.tsx
│   │   ├── auth-button.tsx
│   │   ├── password-hints.tsx
│   │   ├── support-footer.tsx
│   │   └── warning-box.tsx
│   ├── ui/                       # Components UI chung (Button, Modal, Card...)
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.tsx
│   │   └── icon-symbol.ios.tsx
│   └── shared/                   # Components dùng chung toàn app
│
├── constants/                    # 🎨 Design tokens & hằng số
│   └── theme.ts                  # Colors, Spacing, Fonts, Shadows...
│
├── hooks/                        # 🪝 Custom React Hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── services/                     # 🌐 API calls & business logic
│   ├── api/                      # REST API client
│   │   ├── client.ts             # Axios/fetch instance
│   │   ├── auth.service.ts       # Auth API endpoints
│   │   └── rooms.service.ts      # Rooms API endpoints
│   └── storage/                  # Local storage (AsyncStorage)
│       └── auth.storage.ts
│
├── types/                        # 📝 TypeScript type definitions
│   ├── auth.types.ts
│   ├── room.types.ts
│   └── common.types.ts
│
├── utils/                        # 🔧 Utility functions
│   ├── validation.ts             # Form validation helpers
│   ├── format.ts                 # Formatting (currency, date, phone...)
│   └── helpers.ts                # Các helper chung
│
├── assets/                       # 🖼️ Static assets
│   └── images/
│       ├── logo.png
│       ├── icon.png
│       └── splash-icon.png
│
├── docs/                         # 📖 Tài liệu dự án
│   └── CODING_STANDARDS.md       # (File này)
│
├── themes/                       # 🎭 Theme configuration (reserved)
├── scripts/                      # 🔨 Build & development scripts
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

---

## 📛 2. Quy tắc đặt tên

### 2.1. File & Thư mục

| Loại              | Convention       | Ví dụ                                  |
| ----------------- | ---------------- | -------------------------------------- |
| Component file    | `kebab-case.tsx` | `auth-input.tsx`, `room-card.tsx`      |
| Screen/Route file | `kebab-case.tsx` | `forgot-password.tsx`, `login.tsx`     |
| Layout file       | `_layout.tsx`    | `_layout.tsx` (Expo Router convention) |
| Hook file         | `use-xxx.ts`     | `use-auth.ts`, `use-rooms.ts`          |
| Service file      | `xxx.service.ts` | `auth.service.ts`                      |
| Type file         | `xxx.types.ts`   | `auth.types.ts`                        |
| Utility file      | `kebab-case.ts`  | `validation.ts`, `format.ts`           |
| Barrel export     | `index.ts`       | `components/auth/index.ts`             |
| Constant file     | `kebab-case.ts`  | `theme.ts`, `api-config.ts`            |

### 2.2. Component & Function

| Loại             | Convention                  | Ví dụ                             |
| ---------------- | --------------------------- | --------------------------------- |
| React Component  | `PascalCase`                | `AuthInput`, `RoomCard`           |
| Screen Component | `PascalCase + Screen`       | `LoginScreen`, `HomeScreen`       |
| Layout Component | `PascalCase + Layout`       | `AuthLayout`, `TabsLayout`        |
| Custom Hook      | `camelCase` (bắt đầu `use`) | `useAuth`, `useRooms`             |
| Handler function | `handle + Action`           | `handleLogin`, `handleSubmit`     |
| Helper function  | `camelCase`                 | `formatCurrency`, `validatePhone` |
| Constants        | `UPPER_SNAKE_CASE`          | `API_BASE_URL`, `MAX_RETRY`       |
| Interface/Type   | `PascalCase`                | `AuthInputProps`, `Room`          |
| Enum             | `PascalCase`                | `RoomStatus`, `UserRole`          |

### 2.3. Biến & State

```typescript
// ✅ Đúng
const [isLoading, setIsLoading] = useState(false);
const [phoneNumber, setPhoneNumber] = useState("");
const [rooms, setRooms] = useState<Room[]>([]);

// ❌ Sai
const [loading, setloading] = useState(false); // setter phải camelCase
const [data, setData] = useState([]); // tên không rõ nghĩa
```

---

## 🎨 3. Design System

### 3.1. Màu sắc (Brand Colors)

| Token           | Hex       | Sử dụng                         |
| --------------- | --------- | ------------------------------- |
| `primary`       | `#1DB954` | Nút chính, link, icon active    |
| `primaryDark`   | `#17a348` | Hover/pressed state             |
| `primaryLight`  | `#e8f8ee` | Background nhẹ                  |
| `error`         | `#F44336` | Validation error, required (\*) |
| `warning`       | `#FF9800` | Cảnh báo                        |
| `success`       | `#4CAF50` | Thành công                      |
| `textPrimary`   | `#212121` | Text chính                      |
| `textSecondary` | `#757575` | Text phụ                        |
| `border`        | `#E0E0E0` | Viền input, card                |
| `background`    | `#FFFFFF` | Nền chính                       |

> ⚠️ **KHÔNG** sử dụng hardcode màu trong StyleSheet. Luôn import từ `@/constants/theme`.

### 3.2. Spacing (8px Grid)

```typescript
import { Spacing } from '@/constants/theme';

// Sử dụng:
padding: Spacing.base,  // 16px
margin: Spacing.lg,     // 20px
gap: Spacing.sm,        // 8px
```

| Token  | Value | Sử dụng                  |
| ------ | ----- | ------------------------ |
| `xs`   | 4px   | Khoảng cách nhỏ nhất     |
| `sm`   | 8px   | Giữa icon và text        |
| `md`   | 12px  | Padding nội bộ           |
| `base` | 16px  | Padding chung (mặc định) |
| `lg`   | 20px  | Section spacing          |
| `xl`   | 24px  | Page padding             |
| `2xl`  | 32px  | Section gap lớn          |

### 3.3. Typography

| Token  | Size | Sử dụng              |
| ------ | ---- | -------------------- |
| `xs`   | 10px | Caption nhỏ          |
| `sm`   | 12px | Helper text, hints   |
| `md`   | 14px | Label, body nhỏ      |
| `base` | 16px | Body text (mặc định) |
| `lg`   | 18px | Subtitle             |
| `xl`   | 20px | Title nhỏ            |
| `2xl`  | 24px | Title lớn            |
| `3xl`  | 30px | Heading              |

### 3.4. Border Radius

```typescript
import { BorderRadius } from '@/constants/theme';

borderRadius: BorderRadius.lg,  // 12px (mặc định cho input, button, card)
```

### 3.5. Shadows

```typescript
import { Shadows } from '@/constants/theme';

// Spread shadow object:
...Shadows.md,  // Cho card, elevated components
```

---

## 🏗️ 4. Kiến trúc Component

### 4.1. Cấu trúc file Component

```typescript
/**
 * ComponentName - Mô tả ngắn gọn
 * Dùng cho: [context sử dụng]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

// ── Interface ──
interface ComponentNameProps {
  /** Mô tả prop */
  title: string;
  /** Optional prop */
  variant?: 'primary' | 'outline';
}

// ── Component ──
export default function ComponentName({ title, variant = 'primary' }: ComponentNameProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 16,
    color: Colors.textSuccess,
  },
});
```

### 4.2. Nguyên tắc thiết kế Component

1. **Single Responsibility** - Mỗi component chỉ làm 1 việc
2. **Props Interface** - Luôn khai báo TypeScript interface cho props
3. **Default Export** - Mỗi component file export default 1 component
4. **Barrel Export** - Nhóm components liên quan dùng `index.ts`
5. **JSDoc Comment** - Mô tả mục đích, context sử dụng ở đầu file
6. **Styles cuối file** - `StyleSheet.create()` luôn ở cuối file

---

## 📱 5. Expo Router Conventions

### 5.1. Route Groups

- `(auth)` - Nhóm xác thực (không cần đăng nhập)
- `(tabs)` - Nhóm chính (cần đăng nhập, bottom tabs)

### 5.2. Layout files

```typescript
// Mỗi _layout.tsx PHẢI có default export
export default function LayoutName() {
  return <Stack>or<Tabs>;
}
```

### 5.3. Screen naming

| File          | Route    | Mục đích       |
| ------------- | -------- | -------------- |
| `index.tsx`   | `/`      | Trang mặc định |
| `login.tsx`   | `/login` | Đăng nhập      |
| `[id].tsx`    | `/:id`   | Dynamic route  |
| `_layout.tsx` | -        | Layout wrapper |

---

## ⚡ 6. Performance & Tốc độ tải

### 6.1. Quy tắc chung

- [ ] **Lazy imports**: Sử dụng `React.lazy()` cho màn hình nặng
- [ ] **Memoization**: `React.memo()`, `useMemo()`, `useCallback()` khi cần
- [ ] **Image optimization**: Sử dụng `expo-image` thay vì `<Image>` RN thuần
- [ ] **FlatList**: Dùng `FlatList` thay `ScrollView` cho danh sách
- [ ] **Bundle size**: Kiểm tra bundle size thường xuyên

### 6.2. Hình ảnh

```typescript
// ✅ Dùng expo-image (có cache tích hợp)
import { Image } from "expo-image";

// ❌ Không dùng Image từ react-native cho remote images
import { Image } from "react-native"; // chỉ dùng cho local assets
```

### 6.3. State Management

- **Local state**: `useState` cho state đơn giản trong 1 component
- **Shared state**: `React.Context` + `useReducer` cho state chia sẻ
- **Server state**: Dùng service layer (`services/`) + custom hooks

---

## 📦 7. Thư viện sử dụng

### 7.1. Core (đã cài)

| Thư viện                       | Phiên bản | Mục đích                           |
| ------------------------------ | --------- | ---------------------------------- |
| `expo`                         | ~54.0     | Framework                          |
| `expo-router`                  | ~6.0      | File-based routing                 |
| `react-native-reanimated`      | ~4.1      | Animations                         |
| `react-native-gesture-handler` | ~2.28     | Gestures                           |
| `@expo/vector-icons`           | ^15.0     | Icons (Ionicons, MaterialIcons...) |
| `expo-image`                   | ~3.0      | Optimized image loading            |

### 7.2. Nên cài thêm (khi cần)

| Thư viện                                    | Mục đích               |
| ------------------------------------------- | ---------------------- |
| `@react-native-async-storage/async-storage` | Lưu token, preferences |
| `axios`                                     | HTTP client            |
| `react-hook-form` + `zod`                   | Form validation        |
| `zustand`                                   | State management nhẹ   |
| `dayjs`                                     | Xử lý ngày tháng       |
| `react-native-toast-message`                | Toast notifications    |

### 7.3. Quy tắc thêm thư viện

1. ✅ Kiểm tra tương thích Expo trước khi cài
2. ✅ Ưu tiên thư viện có hỗ trợ Expo
3. ✅ Dùng `npx expo install <package>` thay `npm install`
4. ❌ KHÔNG cài thư viện native cần link thủ công (Expo Go không hỗ trợ)

---

## 🔄 8. Import/Export Conventions

### 8.1. Thứ tự import

```typescript
// 1. React & React Native
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

// 2. Third-party libraries
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 3. Internal modules (dùng alias @/)
import { AuthInput, AuthButton } from "@/components/auth";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/api/auth.service";
import type { LoginRequest } from "@/types/auth.types";
```

### 8.2. Path Alias

```typescript
// ✅ Dùng alias
import { Colors } from "@/constants/theme";

// ❌ Không dùng relative path dài
import { Colors } from "../../../constants/theme";
```

---

## 🧪 9. Quy trình phát triển

### 9.1. Checklist trước khi commit

- [ ] Không có `console.log` thừa (dùng `__DEV__` guard)
- [ ] Không có hardcode colors/spacing (dùng theme tokens)
- [ ] Không có `any` type (trừ trường hợp bắt buộc)
- [ ] Mỗi route file có `export default`
- [ ] Component có JSDoc comment
- [ ] Test trên cả iOS và Android (nếu có)

### 9.2. Git Commit Convention

```
<type>(<scope>): <description>

Ví dụ:
feat(auth): add login screen with phone validation
fix(rooms): fix room list not loading
style(auth): update button colors to match design
refactor(theme): reorganize design tokens
docs: update coding standards
```

| Type       | Mô tả                         |
| ---------- | ----------------------------- |
| `feat`     | Tính năng mới                 |
| `fix`      | Sửa bug                       |
| `style`    | Thay đổi UI/CSS               |
| `refactor` | Tái cấu trúc code             |
| `docs`     | Cập nhật tài liệu             |
| `chore`    | Cập nhật dependencies, config |

---

## 🎯 10. Quy tắc thiết kế giao diện

### 10.1. Responsive

- Sử dụng `flex` layout thay vì fixed width/height
- Test trên ít nhất 3 kích thước màn hình (small, medium, large)
- Sử dụng `KeyboardAvoidingView` cho màn hình có form
- Sử dụng `SafeAreaView` hoặc `useSafeAreaInsets` cho notch/island

### 10.2. Accessibility

- Mỗi `TouchableOpacity` có `hitSlop` tối thiểu `{ top: 10, bottom: 10, left: 10, right: 10 }`
- Mỗi nút/input có `accessibilityLabel`
- Contrast ratio text/background >= 4.5:1

### 10.3. Animation

- Sử dụng `react-native-reanimated` cho animations phức tạp
- Expo Router `animation: 'slide_from_right'` cho screen transitions
- Thời gian animation: 200-300ms cho micro-interactions

---

## 🚀 11. Senior Development Patterns

### 11.1. Networking Excellence

- **Interceptors**: Sử dụng axios interceptors để tự động chèn token và xử lý lỗi global (401, 403, 500).
- **Service Layer**: Tách biệt logic gọi API khỏi UI component. Mỗi domain nghiệp vụ có 1 service file riêng.
- **DTO Mapping**: Chuyển đổi dữ liệu từ Backend (Snake Case hoặc định dạng thô) sang Camel Case hoặc Model thân thiện với UI tại Service Layer.
- **Error Propagation**: Luôn sử dụng `try-catch` và trả về một cấu trúc lỗi đồng nhất để UI có thể hiển thị thông báo thân thiện.

### 11.2. State Management (Zustand + Persistence)

- **Persist Middleware**: Sử dụng middleware `persist` của Zustand để tự động đồng bộ hóa state với `AsyncStorage`.
- **Atomic Selectors**: Luôn sử dụng selectors khi truy xuất state để tránh re-render dư thừa.
- **Hydration Safety**: Xử lý trạng thái "vừa load" khi state đang được phục hồi từ bộ nhớ đệm (AsyncStorage).

### 11.3. Clean Code & SOLID

- **Interface Segregation**: Không bắt một component nhận quá nhiều props không liên quan.
- **Dependency Inversion**: Service client không nên phụ thuộc vào hardcode URL (luôn dùng biến môi trường).

---

## 🔒 12. Bảo mật & Độ tin cậy (Senior Level)

### 12.1. Quản lý Secret & Token

- **Environment Variables**: KHÔNG bao giờ commit `.env`. Luôn có `.env.example`.
- **Bearer Token**: Token phải được lưu trữ an toàn trong `AsyncStorage` (hoặc `SecureStore` nếu cần bảo mật cao hơn).
- **Refresh Token**: Implement cơ chế tự động refresh token khi token hiện tại sắp hết hạn để duy trì phiên đăng nhập bền vững.

### 12.2. Error Handling & Monitoring

- **Global Error Handling**: Xử lý lỗi tập trung tại Axios Interceptor và Global Exception Handler (nếu có).
- **Retry Mechanism**: Thiết lập chính sách thử lại (retry) cho các request quan trọng khi mạng không ổn định.
- **Offline Mode**: Thiết kế App để người dùng vẫn có thể xem được dữ liệu cũ từ cache khi không có mạng.

---

## 🛠️ 13. Cấu hình Đa nền tảng (Web vs Native)

Dự án ưu tiên khả năng chạy ổn định trên cả trình duyệt (Web) và thiết bị thật (Native).

### 13.1. Quản lý ESM & `import.meta`

- Trình duyệt (Chrome/Edge) và Metro Web có thể không hỗ trợ hoàn toàn `import.meta` từ các thư viện ESM hiện đại.
- Ưu tiên sử dụng các phiên bản thư viện đã được transpiled (như Zustand 4.x) cho giai đoạn phát triển Web.

### 13.2. Tính năng thử nghiệm (Experimental Features)

- **React Compiler** & **New Architecture** chỉ nên bật khi tiến hành kiểm thử hiệu năng cuối cùng trên thiết bị Native.
- Trong quá trình phát triển tính năng (Feature Development), các cờ này nên được tắt để đảm bảo tốc độ bundling và khả năng debug tốt nhất trên trình duyệt.

### 13.3. Font & Icons trên Web

- Đảm bảo `@expo/vector-icons` và `expo-font` được load đúng cách bằng cách giữ cho bundling sạch lỗi `SyntaxError`. Lỗi bundle sẽ ngăn cản việc chèn CSS font vào trình duyệt.
