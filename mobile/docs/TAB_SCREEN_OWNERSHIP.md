# Tab Screen Ownership

Tai lieu nay di kem voi `src/features/tabs/` de giai quyet van de hien tai:

- Screen dang duoc nhom theo domain `(finance)`, `(management)`, `(settings)`, `(account)`.
- Khi sua UI theo tab, rat kho biet man nao thuoc Trang chu, Hop thu, Cong viec, Tim khach, Them +.
- Mot so screen duoc dung lai giua nhieu tab, can ownership ro rang truoc khi refactor sau.

## Trang thai da thuc hien

- Khong xoa file route cu trong `app/`.
- Khong doi URL `router.push('/...')` hien tai.
- Them cau truc ownership moi tai `src/features/tabs/` voi 5 folder chinh:
  - `home/`
  - `inbox/`
  - `tasks/`
  - `find-tenants/`
  - `more/`

## Cach dung

- Neu can tim man theo tab, bat dau tu `src/features/tabs/<tab-name>/`.
- Moi folder con the hien mot nhom man hinh nho hon, vi du:
  - `home/quick-actions`
  - `home/management`
  - `home/settings`
  - `home/analytics`
  - `more/account`
  - `more/organization`
  - `more/settings`
  - `more/support`
- Danh sach tong hop toan bo man hinh da duoc export tai `src/features/tabs/index.ts`.

## Ghi chu quan trong

- `notification-settings` la screen dung chung cho `inbox` va `more`.
- `rental-settings` hien la compatibility wrapper tro toi `motel-settings`.
- Luong `rooms/*` la luong an thuoc Home tab, duoc tach rieng trong `home/rooms`.

## Buoc tiep theo nen lam

- Chuyen dan implementation UI tu `app/` sang `src/features/tabs/.../screens` theo tung tab.
- Giu `app/` chi con cac route wrapper mong de expo-router de doc hon.
- Sau khi on dinh moi tinh den viec doi import nguoc lai, khong nen move hang loat route file trong cung mot buoc.
