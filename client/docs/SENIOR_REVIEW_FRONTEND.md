# 🔍 ĐÁNH GIÁ FRONTEND (React + Vite) - Góc nhìn Senior Engineer

> **Người đánh giá**: Senior Software Engineer Review
> **Ngày đánh giá**: 2026-04-17
> **Phiên bản đánh giá**: 1.0.0
> **Stack**: React 18 + Vite + MUI + Axios + React Router DOM

---

## 📊 TỔNG QUAN ĐÁNH GIÁ

| Tiêu chí            | Điểm (1-10) | Ghi chú                                            |
| ------------------- | ----------- | -------------------------------------------------- |
| Kiến trúc tổng thể  | 4/10        | App.jsx monolithic, chưa có state management       |
| Code Quality        | 4/10        | Naming inconsistent, code duplication nhiều        |
| Performance         | 4/10        | Không có code splitting, lazy loading              |
| Security (Frontend) | 3/10        | Token trong sessionStorage, hardcode URLs          |
| UX/UI               | 6/10        | MUI cho UI tốt nhưng responsive chưa đầy đủ        |
| Testing             | 1/10        | Không có test nào                                  |
| SEO                 | 3/10        | SPA thuần, không có SSR/meta tags                  |
| Accessibility       | 2/10        | Thiếu aria labels, keyboard navigation             |
| Bundle Size         | 4/10        | Quá nhiều dependencies, chưa optimize              |
| Documentation       | 4/10        | Có frontend-source-structure.md nhưng chưa áp dụng |

**Điểm trung bình: 3.5/10** - Cần refactor đáng kể.

---

## 🚨 VẤN ĐỀ NGHIÊM TRỌNG (CRITICAL)

### 1. App.jsx Monolithic - God Component (498 dòng)

> [!CAUTION] > **Mức độ: HIGH** - Bottleneck cho mọi thay đổi và gây re-render toàn bộ app

**Vị trí**: `src/App.jsx`

**Vấn đề**:

- 498 dòng code trong 1 file
- Quản lý toàn bộ state: `username`, `avatar`, `account`, `token`, `isAdmin`, `isNavAdmin`, `motels`
- Gần 60 Route definitions
- 57 imports
- Re-fetch user data MỖI LẦN location thay đổi (dòng 89-100)
- Duplicate routes: `/bao-cao` xuất hiện 2 lần, `/AdminStatis` xuất hiện 2 lần, `/AdminManagerBoard` 2 lần

```javascript
// ❌ Re-fetch MỖI navigation
useEffect(() => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  if (user) {
    getAccountByUsername(user.username).then((res) => {
      setAccount(res.data) // API call mỗi lần navigate
    })
    fetchMotelsByUsername(user.username) // API call mỗi lần navigate
  }
}, [location]) // ← Trigger trên MỌI route change
```

**Giải pháp**:

```
src/
  app/
    App.jsx (< 50 dòng)
    providers/
      AuthProvider.jsx      ← Context cho auth state
      MotelProvider.jsx     ← Context cho motel state
    routes/
      PublicRoutes.jsx      ← Routes cho Guest
      AdminRoutes.jsx       ← Routes cho Admin/Host
      MotelRoutes.jsx       ← Routes cho quản lý trọ
      AuthRoutes.jsx        ← Login/Register/Forgot
```

---

### 2. Token lưu trong sessionStorage - Không an toàn

> [!WARNING] > **Mức độ: HIGH** - XSS Attack có thể đánh cắp token

**Vị trí**: Toàn bộ API calls

```javascript
// ❌ Token hardcode pattern lặp lại HÀNG CHỤC LẦN
const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null

return await axios.post(`${env.API_URL}/motels/create`, Motel, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

**Hậu quả**:

- Token dễ bị đánh cắp qua XSS
- Pattern lặp lại ~30+ lần → code duplication nghiêm trọng
- Không có auto-refresh token khi hết hạn
- Không có interceptor xử lý 401/403

**Giải pháp**: Tạo Axios Interceptor:

```javascript
// services/api/httpClient.js
import axios from 'axios'
import { env } from '~/configs/environment'

const httpClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000
})

// Request interceptor - Auto attach token
httpClient.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// Response interceptor - Auto handle errors
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      // If fail, redirect to login
    }
    return Promise.reject(error)
  }
)

export default httpClient
```

---

### 3. Hardcode `localhost:8080` trong nhiều API calls

**Vị trí**: `src/apis/apiClient.js`

```javascript
// ❌ KHÔNG hoạt động trên production
export const getAccountByUsername = async (username) => {
  return await axios.get(`http://localhost:7000/api-accounts/get-account/${username}`)
}

export const createBroker = async (data) => {
  return await axios.post(`http://localhost:7000/broker`, data, {...})
}

export const getBrokers = async (motelId) => {
  return await axios.get(`http://localhost:7000/broker/${motelId}`, {...})
}

export const introspect = async () => {
  return await axios.post(`http://localhost:7000/authen/introspect`, {...})
}
```

**Giải pháp**: Thay tất cả bằng `${env.API_URL}` hoặc dùng httpClient đã cấu hình baseURL.

---

### 4. Không có Code Splitting / Lazy Loading

```javascript
// ❌ Import TẤT CẢ pages ngay lập tức
import Detail from './pages/detail/Detail'
import Home from './pages/Home/Home'
import Chart from './pages/charts/Chart'
// ... 54 imports khác
```

**Hậu quả**: Initial bundle load TẤT CẢ code, kể cả Admin pages mà user thường không bao giờ truy cập → thời gian load lần đầu rất chậm.

**Giải pháp**:

```javascript
import { lazy, Suspense } from 'react'
import LoadingPage from './components/LoadingPage'

// Lazy load các pages
const Home = lazy(() => import('./pages/Home/Home'))
const Detail = lazy(() => import('./pages/detail/Detail'))
const AdminManage = lazy(() => import('./pages/admin/AdminManage/AdminManage'))

// Wrap routes
;<Suspense fallback={<LoadingPage />}>
  <Routes>
    <Route path="/" element={<Home />} />
    {/* ... */}
  </Routes>
</Suspense>
```

---

## ⚠️ VẤN ĐỀ KIẾN TRÚC

### 5. API Layer - Code Duplication nghiêm trọng

**Vấn đề**: `src/apis/apiClient.js` có 347 dòng với pattern lặp lại liên tục:

```javascript
// Pattern lặp lại 30+ lần:
export const someAPI = async (data) => {
  const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null
  return await axios.post(`${env.API_URL}/endpoint`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
```

**Giải pháp**: Sử dụng httpClient + tổ chức theo domain:

```
services/
  api/
    httpClient.js       ← Axios instance + interceptors
    auth.api.js         ← Login, Register, Forgot Password
    motel.api.js        ← CRUD Motel
    room.api.js         ← CRUD Room
    contract.api.js     ← CRUD Contract
    invoice.api.js      ← CRUD Invoice
    bulletin.api.js     ← Bulletin Board
```

---

### 6. Không có State Management

- Toàn bộ state nằm ở `App.jsx` và truyền qua props (prop drilling qua 3-4 levels)
- Pattern `setIsAdmin={setIsAdmin}` lặp lại ở MỌI route (~40 lần)
- Không có React Context, Redux, hay Zustand

```javascript
// ❌ Prop drilling nightmare
<MainManagement
  motels={motels}
  setmotels={setmotels}
  setIsAdmin={setIsAdmin}
  isNavAdmin={isNavAdmin}
  setIsNavAdmin={setIsNavAdmin}
/>
```

**Giải pháp (React Context + Custom Hook)**:

```javascript
// contexts/AuthContext.jsx
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Auto-load user on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setIsAdmin(parsed.roles?.includes('ADMIN') || parsed.roles?.includes('HOST'))
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

---

### 7. ProtectedRoute gọi Swal.fire() trong render

```javascript
const ProtectedRoute = ({ children, requiredRoles }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user || !user.roles) {
    Swal.fire({  // ❌ Side effect trong render
      icon: 'warning',
      title: 'Thông báo',
      text: 'Vui lòng đăng nhập!',
    });
    return <Navigate to="/login" replace />;
  }
  // ...
```

**Hậu quả**: `Swal.fire()` là side effect, không nên gọi trong render phase. Có thể gây multiple alerts khi React re-render.

**Giải pháp**:

```javascript
const ProtectedRoute = ({ children, requiredRoles }) => {
  const location = useLocation()
  const user = JSON.parse(sessionStorage.getItem('user'))

  if (!user || !user.roles) {
    // Redirect với state để hiển thị message ở Login page
    return <Navigate to="/login" state={{ from: location, message: 'Vui lòng đăng nhập!' }} replace />
  }

  if (requiredRoles && !requiredRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/" state={{ message: 'Bạn không có quyền truy cập!' }} replace />
  }

  return children
}
```

---

### 8. Naming Convention không nhất quán

| Hiện tại                         | Vấn đề                       | Nên sửa                     |
| -------------------------------- | ---------------------------- | --------------------------- |
| `ScrollToTop .jsx`               | Có dấu cách trong tên file   | `ScrollToTop.jsx`           |
| `deviceAPT.js`                   | Typo: APT thay vì API        | `deviceAPI.js`              |
| `mock-data-banner-horizontal.js` | Nằm cùng level với API files | `mock/banner-horizontal.js` |
| `setmotels`                      | Không camelCase              | `setMotels`                 |
| `ContractTemplateRespone.java`   | Typo: Respone                | `ContractTemplateResponse`  |
| `RoomServiceRespone2.java`       | Typo + số 2                  | `RoomServiceDetailResponse` |
| `Zalo_history`                   | Snake case cho component     | `ZaloHistory`               |

---

### 9. Bundle Size quá lớn

**60+ dependencies** trong `package.json`, nhiều thư viện chồng chéo:

| Nhóm          | Thư viện                                                         | Vấn đề                        |
| ------------- | ---------------------------------------------------------------- | ----------------------------- |
| CSS Framework | `bootstrap` + `react-bootstrap` + `reactstrap` + `@mui/material` | **4 UI frameworks cùng lúc!** |
| Charts        | `chart.js` + `react-chartjs-2` + `apexcharts` + `@mui/x-charts`  | **3 chart libraries!**        |
| Date          | `date-fns` + `dayjs` + `flatpickr` + `@mui/x-date-pickers`       | **4 date libraries!**         |
| Carousel      | `react-slick` + `slick-carousel` + `swiper`                      | **2 carousel libraries!**     |

**Giải pháp**:

1. Chuẩn hóa UI: Chỉ dùng `@mui/material` (bỏ bootstrap, reactstrap)
2. Charts: Chỉ dùng `@mui/x-charts` HOẶC `apexcharts`
3. Date: Chỉ dùng `dayjs` + `@mui/x-date-pickers`
4. Carousel: Chỉ dùng `swiper`

---

## 📋 DANH SÁCH CẦN CẢI THIỆN

### Kiến trúc & Code Organization

- [x] Tách `App.jsx` thành route groups
- [x] Implement React Context cho Auth, Motel state
- [x] Tạo Axios interceptor (httpClient)
- [x] Code splitting với `React.lazy()`
- [ ] Áp dụng cấu trúc đề xuất trong `frontend-source-structure.md`
- [x] Xóa duplicate routes trong `App.jsx`
- [x] Tổ chức API calls theo domain _(hoàn thành: loại bỏ `apiClient.js` legacy, dùng các domain modules trong `src/apis/_` - 2026-04-17)\*

### Security

- [x] Xóa tất cả `localhost:8080` hardcoded URLs
- [x] Tạo Axios interceptor cho token management
- [ ] Implement auto refresh token
- [x] Fix ProtectedRoute side effects
- [ ] Xem xét chuyển từ `sessionStorage` sang `httpOnly cookie` cho token

### Performance

- [x] Lazy load tất cả page components
- [ ] Loại bỏ UI frameworks dư thừa (giữ MUI, bỏ Bootstrap)
- [ ] Loại bỏ chart/date/carousel libraries dư thừa _(đang làm: removed `chart.js`, `react-chartjs-2`, `apexcharts` và migrate chart usage sang `@mui/x-charts` - 2026-04-17)_
- [ ] Thêm React.memo cho components render nhiều lần _(đang làm: added `memo` + `useCallback`/`useMemo` cho `layouts/Header/Header.jsx` - 2026-04-17)_
- [ ] Optimize re-renders (useCallback, useMemo) _(đang làm - 2026-04-17)_
- [x] Sửa useEffect dependency `[location]` - quá rộng

### Code Quality

- [ ] Fix tất cả naming inconsistencies
- [ ] Tách Header.jsx thành sub-components (theo đề xuất trong docs)
- [x] Xóa mock-data files khỏi `src/apis/`
- [x] Sửa file name có space: `ScrollToTop .jsx`
- [ ] Thêm ESLint rules cho consistency
- [ ] Xóa `eslint-disable` comments

### UX/UI

- [x] Thêm Error Boundary component
- [ ] Thêm Loading states cho async operations
- [ ] Thêm Empty states cho danh sách trống
- [ ] Cải thiện responsive design
- [ ] Thêm skeleton loading
- [ ] Thêm toast notification thống nhất (thay Swal)

### Testing

- [ ] Setup Vitest (đã có Vite)
- [ ] Viết unit test cho utility functions
- [ ] Viết component tests cho core components
- [ ] Viết integration tests cho critical flows (Login, Register)

### SEO & Accessibility

- [ ] Thêm `react-helmet` cho dynamic meta tags
- [ ] Thêm aria labels cho interactive elements
- [ ] Đảm bảo keyboard navigation
- [ ] Thêm proper heading hierarchy

---

## 🔄 LUỒNG XỬ LÝ CẦN SỬA/BỔ SUNG

### 1. Luồng Authentication - Cần cải thiện

```
Hiện tại: Login → Lưu sessionStorage → Done
Cần bổ sung:
  - Auto refresh token khi sắp hết hạn
  - Handle 401 response tự động redirect login
  - Remember me option
  - Persist login across tabs (thay sessionStorage bằng localStorage hoặc cookie)
```

### 2. Luồng Error Handling - Thiếu hoàn toàn

```
Hiện tại: Mỗi component tự try/catch hoặc toast riêng
Cần: Global error boundary + centralized error handler qua interceptor
```

### 3. Luồng cần bổ sung

- [ ] Offline support (PWA config đã có nhưng chưa implement service worker)
- [ ] Loading skeleton cho tất cả data-fetching pages
- [ ] Optimistic updates cho CRUD operations
- [ ] Proper form validation (Formik + Yup đã có nhưng không đồng bộ)
- [ ] Notification center (realtime)

---

## 🗺️ ROADMAP ĐỀ XUẤT

### Phase 1: Critical Fixes (1 tuần)

1. Xóa tất cả `localhost:8080` hardcoded
2. ✅ Tạo httpClient với interceptors (đã hoàn thành 2026-04-17)
3. ✅ Fix duplicate routes (đã hoàn thành 2026-04-17)
4. ✅ Fix ProtectedRoute side effects (đã hoàn thành 2026-04-17)

### Phase 2: Architecture Refactor (2-3 tuần)

1. ✅ Tách App.jsx thành route groups (đã hoàn thành 2026-04-17)
2. ✅ Implement AuthContext + MotelContext (đã hoàn thành 2026-04-17)
3. ✅ Code splitting (lazy loading) (đã hoàn thành 2026-04-17)
4. Tổ chức lại API layer _(đang làm - 2026-04-17)_

### Phase 3: Dependency Cleanup (1-2 tuần)

1. Remove duplicate UI frameworks
2. Remove duplicate chart/date libraries
3. Analyze và optimize bundle size

### Phase 4: Quality & Polish (2-3 tuần)

1. Fix naming conventions
2. Tách Header thành sub-components
3. ✅ Add Error Boundary (đã hoàn thành 2026-04-17)
4. Add Loading/Empty states
5. Setup testing framework
