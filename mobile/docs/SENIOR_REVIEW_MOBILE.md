# 🔍 ĐÁNH GIÁ MOBILE (React Native + Expo) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Software Engineer Review
> **Ngày đánh giá**: 2026-04-17
> **Phiên bản đánh giá**: 1.0.0
> **Stack**: React Native 0.81.5 + Expo SDK 54 + Expo Router 6 + TypeScript

---

## 📊 TỔNG QUAN ĐÁNH GIÁ

| Tiêu chí | Điểm (1-10) | Ghi chú |
|----------|-------------|---------|
| Kiến trúc tổng thể | 7/10 | Expo Router tốt, file-based routing clear |
| Code Quality | 6/10 | TypeScript có nhưng chưa strict, coding standards tốt |
| Design System | 8/10 | Theme constants được define rõ ràng |
| Performance | 5/10 | Chưa có optimization patterns |
| API Integration | 4/10 | Đã setup Axios client/endpoints, chờ gắn vào component |
| State Management | 3/10 | Chưa có solution, dùng local state |
| Testing | 1/10 | Không có tests |
| Documentation | 8/10 | CODING_STANDARDS.md rất tốt |
| Security | 2/10 | Chưa implement authentication flow |
| Feature Completeness | 4/10 | Có UI nhưng chưa có logic backend |

**Điểm trung bình: 4.6/10** - Nền tảng tốt nhưng cần kết nối backend.

---

## ✅ ĐIỂM MẠNH

### 1. Tài liệu Coding Standards xuất sắc (8/10)

`mobile/docs/CODING_STANDARDS.md` là file documentation tốt nhất trong toàn bộ dự án:
- Quy tắc đặt tên rõ ràng (file, component, function, variable)
- Design system tokens đầy đủ (colors, spacing, typography, shadows)
- Import conventions có thứ tự
- Git commit conventions
- Performance guidelines
- Accessibility rules

> [!TIP]
> Đây là mẫu documentation nên áp dụng cho cả client và server.

### 2. File-based Routing Structure tốt

```
app/
├── (auth)/     ← Auth group (no tab bar)
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (tabs)/     ← Main app (with tab bar)
│   ├── (home)/
│   └── rooms/
├── deposit.tsx
├── contract.tsx
├── invoice.tsx
└── bill.tsx
```

### 3. Design System Tokens có sẵn

```typescript
// constants/theme.ts
export const Colors = { primary: '#1DB954', ... };
export const Spacing = { xs: 4, sm: 8, md: 12, base: 16, ... };
export const FontSize = { xs: 10, sm: 12, md: 14, base: 16, ... };
export const BorderRadius = { sm: 4, md: 8, lg: 12, xl: 16, ... };
export const Shadows = { sm: {...}, md: {...}, lg: {...} };
```

---

## 🚨 VẤN ĐỀ NGHIÊM TRỌNG

### 1. Thiếu Data Fetching Layer (Đã setup base)

> [!WARNING]
> **Mức độ: HIGH** - App hiện tại chỉ có UI shell và mock data, nhưng đã thiết lập sẵn cấu trúc gọi API.

**Cấu trúc đã thiết lập:**
```
services/
  api/
    client.ts      ← Axios instance + Interceptors
    endpoints.ts   ← Các URL endpoints
```

**Toàn bộ data trong các screens vẫn là hardcoded/mock:**
- Home screen: mock data cho menu, notifications
- Deposit screen: mock data
- Contract screen: mock data
- Invoice screen: mock data

**Giải pháp tiếp theo**: Khởi tạo các services cụ thể (như auth.service) thay vì file code mẫu, và kết nối với màn hình:
```typescript
// services/api/client.ts
import axios from 'axios';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.x.x:8080'  // Dev
  : 'https://api.rrms.com';     // Production

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      await AsyncStorage.removeItem('auth_token');
      router.replace('/login');
    }
    throw error;
  }
);

export default apiClient;
```

---

### 2. Không có Authentication State Management

**Hiện tại**: Auth screens có UI nhưng:
- Không lưu token sau login
- Không check auth state khi app start
- Không bảo vệ routes cần authentication
- Không có logout flow

**Giải pháp - Auth Context + Secure Storage**:
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check auth state on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Protect routes
  useEffect(() => {
    if (isLoading) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token && !inAuthGroup) {
      router.replace('/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)/(home)');
    }
  }, [token, segments, isLoading]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    const response = await authService.login({ phone, password });
    await AsyncStorage.setItem('auth_token', response.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

### 3. Thiếu Essential Dependencies

**Cần cài đặt ngay**:
```bash
npx expo install @react-native-async-storage/async-storage  # Token storage
npx expo install axios                                        # HTTP client
npx expo install react-native-toast-message                   # Notifications
```

**Nên cài thêm khi cần**:
```bash
npx expo install zustand          # State management nhẹ
npx expo install dayjs            # Date handling
npx expo install react-hook-form  # Form management
npx expo install zod              # Schema validation
```

---

## ⚠️ VẤN ĐỀ KIẾN TRÚC

### 4. Screen Files quá dài (✅ ĐÃ GIẢI QUYẾT)

Vấn đề các file màn hình như `add-building.tsx`, `deposit.tsx`, `edit-building.tsx` quá dài đã được tái cấu trúc thành công theo Single Responsibility Principle.

**Cấu trúc mới đã áp dụng:**
```
app/
  deposit.tsx          ← Chỉ chứa layout + navigation logic (< 60 dòng)
components/
  deposit/
    index.ts           ← Barrel export
    deposit-header.tsx ← Header component
    deposit-form.tsx   ← Form/Sections component
    room-card.tsx      ← Child UI
hooks/
  use-deposit.ts       ← Custom hook chứa logic và state
types/
  deposit.types.ts     ← TypeScript types
```

> [!NOTE]
> Cách tiếp cận này giúp các file trong `app/` rất gọn nhẹ và tái sử dụng code UI dễ dàng hơn. Cần tiếp tục duy trì pattern này cho các màn hình khác như `contract.tsx`.

---

### 5. Thiếu Type Definitions cho Backend APIs

`types/` folder tồn tại nhưng chưa có types cho:
- API response/request formats
- Room, Motel, Contract, Invoice, Tenant data models
- Form data types

**Giải pháp**:
```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// types/motel.types.ts
export interface Motel {
  motelId: string;
  motelName: string;
  address: string;
  area: number;
  // ...
}

export interface Room {
  roomId: string;
  name: string;
  price: number;
  status: boolean;
  motelId: string;
  tenants: Tenant[];
  // ...
}

// types/auth.types.ts
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  avatar: string;
  roles: string[];
}
```

---

### 6. Không có Error Handling Pattern

Hiện tại không có:
- Global error boundary
- Network error handling
- Form validation error display pattern
- Retry mechanism cho failed requests

**Giải pháp - Error Boundary**:
```typescript
// components/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Report to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={styles.container}>
          <Text style={styles.title}>Đã xảy ra lỗi</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.buttonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
```

---

## 📋 DANH SÁCH CẦN CẢI THIỆN

### API & Backend Integration (Đang tiến hành)
- [x] Cài đặt `axios` + cấu trúc thư mục
- [x] Tạo `services/api/client.ts` (HTTP client + interceptors)
- [x] Tạo `services/api/endpoints.ts` (API routes)
- [ ] Cài đặt `@react-native-async-storage/async-storage`
- [ ] Tạo `services/api/auth.service.ts` (Login, Register, Forgot Password)
- [ ] Tạo `services/api/motel.service.ts` (CRUD Motel)
- [ ] Tạo `services/api/room.service.ts` (CRUD Room)
- [ ] Tạo `services/api/contract.service.ts` (CRUD Contract)
- [ ] Tạo `services/api/invoice.service.ts` (CRUD Invoice)
- [ ] Kết nối tất cả screens với real API data

### Authentication
- [ ] Implement AuthContext + AuthProvider
- [ ] Implement route protection (redirect unauthenticated users)
- [ ] Implement login flow hoàn chỉnh
- [ ] Implement logout flow
- [ ] Implement token refresh
- [ ] Implement biometric login (for re-authentication)

### State Management
- [ ] Cài đặt `zustand` hoặc implement React Context
- [ ] AuthStore: user, token, roles
- [ ] MotelStore: motels list, selected motel, rooms
- [ ] UIStore: loading states, modals, toasts

### Type Safety
- [ ] Tạo types cho tất cả API request/response
- [ ] Tạo types cho tất cả data models
- [ ] Enable `strict: true` trong `tsconfig.json`
- [ ] Xóa tất cả `any` types

### Screen Optimization
- [x] Tách `add-building.tsx` thành sub-components
- [x] Tách `deposit.tsx` thành sub-components
- [x] Tách `edit-building.tsx` thành sub-components
- [ ] Tách `contract.tsx` thành sub-components
- [ ] Implement proper form validation (react-hook-form + zod)

### UX/UI Enhancement
- [ ] Implement pull-to-refresh cho danh sách
- [ ] Implement skeleton loading
- [ ] Implement toast notifications
- [ ] Implement bottom sheet cho actions
- [ ] Implement haptic feedback cho interactions
- [ ] Implement proper keyboard avoiding behavior

### Offline & Performance
- [ ] Implement offline caching cho critical data
- [ ] Implement image caching
- [ ] Optimize FlatList performance (keyExtractor, getItemLayout)
- [ ] Implement pagination cho danh sách lớn

### Testing
- [ ] Setup Jest + React Native Testing Library
- [ ] Unit tests cho services
- [ ] Unit tests cho custom hooks
- [ ] Component tests cho auth screens
- [ ] Integration tests cho critical flows

---

## 🔄 LUỒNG XỬ LÝ CẦN IMPLEMENT

### 1. Luồng Authentication (CHƯA CÓ)
```
App Start → Check stored token → 
  Có token → Validate (introspect) → 
    Hợp lệ → Go to Home
    Hết hạn → Try refresh → 
      Success → Go to Home
      Fail → Go to Login
  Không token → Go to Login

Login → API call → 
  Success → Store token → Go to Home
  Fail → Show error → Stay on Login
```

### 2. Luồng CRUD Nhà trọ (MỚI CHỈ CÓ UI)
```
Home → Chọn nhà trọ → Load rooms →
  Thêm phòng → Form → API call → Refresh list
  Sửa phòng → Form (prefilled) → API call → Refresh list
  Xóa phòng → Confirm → API call → Refresh list
```

### 3. Luồng Hợp đồng (MỚI CHỈ CÓ UI)
```
Chọn phòng → Lập hợp đồng → 
  Chọn khách thuê (tìm hoặc tạo mới) →
  Điền thông tin hợp đồng →
  Preview hợp đồng →
  Xác nhận → API call → 
    Success → Cập nhật trạng thái phòng
```

### 4. Luồng Hóa đơn (MỚI CHỈ CÓ UI)
```
Chọn phòng → Lập hóa đơn →
  Auto load dịch vụ (điện, nước, internet...) →
  Nhập chỉ số mới →
  Tìm khoản phát sinh →
  Preview hóa đơn →
  Gửi → API call →
    Success → Thông báo cho khách thuê
```

### 5. Luồng cần bổ sung hoàn toàn mới
- [ ] Push notifications (Expo Notifications)
- [ ] Deep linking (mở app từ notification)
- [ ] QR code scan cho check-in khách thuê
- [ ] Camera integration cho chụp ảnh phòng/CCCD
- [ ] Import/Export Excel data
- [ ] Bản đồ tìm nhà trọ (react-native-maps)

---

## 🗺️ ROADMAP ĐỀ XUẤT

### Phase 1: API Foundation (2 tuần)
1. Setup HTTP client + interceptors
2. Implement auth service + AuthContext
3. Kết nối Login/Register/Forgot Password
4. Token management (store, refresh, expire)

### Phase 2: Core Features Connection (3-4 tuần)
1. Kết nối Home screen (real data)
2. CRUD Motel (thêm, sửa, xóa nhà trọ)
3. CRUD Room (thêm, sửa, xóa phòng)
4. Danh sách khách thuê

### Phase 3: Business Flows (3-4 tuần)
1. Luồng tạo hợp đồng hoàn chỉnh
2. Luồng lập hóa đơn hoàn chỉnh
3. Luồng thanh toán
4. Luồng cọc giữ chỗ

### Phase 4: Polish & Enhance (2-3 tuần)
1. Push notifications
2. Offline support
3. Performance optimization
4. Error handling hoàn chỉnh
5. Testing

---

## 📝 SO SÁNH VỚI CLIENT WEB

| Tiêu chí | Client Web (React) | Mobile (React Native) |
|----------|--------------------|-----------------------|
| Documentation | 4/10 | 8/10 ✅ |
| Architecture | 4/10 | 7/10 ✅ |
| API Integration | 6/10 (kết nối nhưng messy) | 2/10 ❌ (chưa kết nối) |
| Type Safety | 1/10 (JS thuần) | 6/10 (TypeScript) |
| Design System | 3/10 | 8/10 ✅ |
| State Management | 3/10 | 3/10 |

> [!IMPORTANT]
> Mobile đặt nền tảng tốt hơn Web (TypeScript, Design System, Coding Standards), nhưng cần ưu tiên kết nối API backend ngay để không chỉ là UI shell.
