# Cau truc source frontend de xep lai du an React

## Muc tieu

Tai lieu nay duoc viet de chuan hoa lai frontend cua du an RRMS theo tung buoc, voi nguyen tac:

- Khong xoa chuc nang hien tai.
- Khong doi logic nghiep vu neu chua can.
- Refactor dan dan, uu tien de doc, de tim, de mo rong.

## Nhan xet nhanh tu du an hien tai

Du an cua ban da co cac nhom thu muc co ban:

- `src/pages`: chua cac man hinh theo route.
- `src/layouts`: chua cac phan khung giao dien lon nhu `Header`, `Footer`, navbar admin.
- `src/components`: chua mot so component dung lai.
- `src/apis`: chua cac file goi API.
- `src/utils`: chua ham xu ly dung chung.
- `src/i18n`: chua da ngon ngu.

Van de hien tai khong phai la "sai hoan toan", ma la:

- Chua co quy tac ro rang gi la `layout`, gi la `component`, gi la `feature`.
- Mot so component dang nam theo ten man hinh, mot so component lai nam o muc chung.
- `App.jsx` dang om kha nhieu route va state tong.
- `Header.jsx` rat lon, gom nhieu phan UI va logic trong cung 1 file.

## Cau truc React de xuat cho du an nay

Day la cau truc de xuat theo huong de nang cap dan tu code hien tai:

```text
src/
  app/
    providers/
    routes/
    store/
    App.jsx
    main.jsx

  assets/
    images/
    icons/

  components/
    common/
    forms/
    feedback/
    navigation/

  layouts/
    MainLayout/
      MainLayout.jsx
      MainLayout.css
    Header/
      Header.jsx
      Header.css
      components/
        LanguageSelect.jsx
        ModeSelect.jsx
        WarningEmailNotExits.jsx
    Footer/
      Footer.jsx
      Footer.css
    admin/

  pages/
    Home/
      Home.jsx
      Home.css
    Search/
      Search.jsx
    Detail/
      Detail.jsx
    Profile/
      Profile.jsx
    PostRooms/
    BulletinBoards/
    Admin/

  features/
    auth/
      components/
      hooks/
      services/
    motel/
      components/
      services/
    bulletin-board/
      components/
      services/
    profile/
      components/
      services/

  services/
    api/
      apiClient.js
      accountAPI.js
      motelAPI.js
      roomAPI.js

  hooks/

  contexts/

  utils/

  constants/

  configs/

  i18n/
```

## Quy tac dat file de khong bi lung tung nua

### 1. `pages`

Dat trong `pages` neu file do la man hinh gan voi route.

Vi du:

- `/login` -> `src/pages/Login/Login.jsx`
- `/profile` -> `src/pages/Profile/Profile.jsx`
- `/dang-tin` -> `src/pages/PostRooms/PostRooms.jsx`

### 2. `layouts`

Dat trong `layouts` neu file do la khung giao dien lon, xuat hien o nhieu trang hoac bao quanh noi dung trang.

Vi du:

- `Header`
- `Footer`
- `NavbarAdmin`
- `MainLayout`

### 3. `components`

Dat trong `components` neu file do la thanh phan UI dung lai, khong dai dien cho ca trang va khong phai khung tong.

Vi du:

- `ProtectedRoute`
- `LoadingPage`
- `ProvinceSelect`
- `ImageList`

### 4. `features`

Dat trong `features` neu muon tach code theo nghiep vu de de scale sau nay.

Vi du:

- `features/auth`
- `features/post-room`
- `features/profile`
- `features/motel`

Neu sau nay refactor sau hon, ta se dua cac component, hook, service ve theo tung nghiep vu tai day.

### 5. `services/api`

Nen dung cho cac file goi API. Hien tai du an dang dung `src/apis`, dieu nay van chap nhan duoc.

De it xao tron, giai doan dau co the:

- Giu nguyen `src/apis`
- Sau nay moi doi ten sang `src/services/api` neu can

## Header nen dat o `layouts` hay `components`?

Ket luan cho du an hien tai: `Header` nen dat trong `src/layouts`, khong nen chuyen len `src/components`.

Ly do:

- `Header` dang la phan khung tong cua ung dung, xuat hien tren nhieu trang.
- `Header` dang nhan state cap app nhu `username`, `avatar`, `token`, `account`, `motelId`.
- `Header` chua dieu huong chinh, tim kiem, menu tai khoan, doi ngon ngu, cac khu vuc desktop/mobile.
- Trong `App.jsx`, `Header` dang duoc render nhu mot phan cua bo cuc trang, cung vai tro voi `Footer`.

Noi cach khac:

- `Header` = layout
- `LanguageSelect`, `ModeSelect`, `WarningEmailNotExits` = component con cua Header

## De xuat toi uu rieng cho Header

Khong doi chuc nang, chi tach cho de quan ly:

```text
src/layouts/Header/
  Header.jsx
  Header.css
  components/
    TopBar.jsx
    MainNav.jsx
    SearchBar.jsx
    AccountMenu.jsx
    MobileHeader.jsx
    CategoryMenu.jsx
    LanguageSelect.jsx
    ModeSelect.jsx
    WarningEmailNotExits.jsx
```

Huong tach nay giup:

- File `Header.jsx` ngan hon.
- Moi phan chi phu trach 1 nhiem vu.
- De sua loi, de test, de doc.
- Khong can chuyen `Header` sang `components`.

## Mapping tu cau truc hien tai sang cau truc de xuat

Co the ap dung dan dan nhu sau:

- `src/layouts/Header/Header.jsx` -> giu nguyen trong `layouts/Header`
- `src/layouts/Header/Options/LanguageSelect.jsx` -> nen doi thanh `src/layouts/Header/components/LanguageSelect.jsx`
- `src/layouts/Header/Options/ModeSelect.jsx` -> nen doi thanh `src/layouts/Header/components/ModeSelect.jsx`
- `src/layouts/Header/WarningEmailNotExits.jsx` -> nen dua vao `src/layouts/Header/components/`
- `src/layouts/Footer/Footer.jsx` -> giu nguyen trong `layouts/Footer`
- `src/components/ProtectedRoute.jsx` -> giu trong `components`
- `src/apis/*` -> tam thoi giu nguyen
- `src/pages/*` -> giu nguyen, sau nay chuan hoa ten thu muc va ten file

## Lo trinh refactor an toan de giu nguyen 100% chuc nang

### Giai doan 1

- Viet tai lieu cau truc.
- Chot quy tac dat file.
- Khong sua logic.

### Giai doan 2

- Tach nho `Header.jsx` thanh cac component con.
- Cap nhat import cho ro rang hon.
- Khong doi giao dien va hanh vi.

### Giai doan 3

- Giam tai cho `App.jsx` bang cach tach `routes`.
- Gom cac API theo nhom nghiep vu.
- Chuan hoa ten file va ten folder.

### Giai doan 4

- Neu can moi dua dan sang `features/`.
- Toi uu state dung chung, custom hooks, va layout tong.

## Ket luan cho buoc hien tai

- Cau truc hien tai cua ban co nen tang dung, khong can dap di lam lai.
- `Header` dat trong `layouts` la dung huong.
- Viec can lam tiep theo khong phai chuyen `Header` sang `components`, ma la tach nho `Header` ben trong thu muc `layouts/Header`.
