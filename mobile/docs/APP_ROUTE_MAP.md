# Mobile App Route Map

Tai lieu nay mo ta cau truc `mobile/app` sau khi duoc tach thanh nhieu `route group` nho hon de de tim man hinh theo tab va theo nghiep vu.

## Nguyen tac

- Folder dang `(...)` chi dung de nhom code, khong thay doi URL route.
- Vi du: `app/(finance)/(billing)/invoice.tsx` van duoc mo bang `router.push('/invoice')`.
- Muc tieu la giu nguyen navigation hien tai nhung de doc, sua va mo rong an toan hon.

## Cau truc hien tai

```text
app/
|-- (auth)/
|-- (tabs)/
|   |-- (home)/
|   |-- rooms/
|   |-- inbox.tsx
|   |-- tasks.tsx
|   |-- find-tenants.tsx
|   `-- more.tsx
|-- (account)/
|   |-- (profile)/
|   |-- (support)/
|   `-- (legal)/
|-- (communication)/
|   `-- (chat)/
|-- (finance)/
|   |-- (billing)/
|   |-- (contracts)/
|   |-- (banking)/
|   `-- (bookkeeping)/
|-- (management)/
|   |-- (buildings)/
|   `-- (occupancy)/
|-- (settings)/
|   |-- (configuration)/
|   |-- (policies)/
|   `-- (access)/
|-- _layout.tsx
`-- modal.tsx
```

## Mapping theo tab

### Home tab

- Man hinh tab: `app/(tabs)/(home)/index.tsx`
- Header menu:
  - `/add-building` -> `app/(management)/(buildings)/add-building.tsx`
  - `/edit-building` -> `app/(management)/(buildings)/edit-building.tsx`
  - `/motel-settings` -> `app/(settings)/(configuration)/motel-settings.tsx`
- Quick actions:
  - `/deposit` -> `app/(finance)/(contracts)/deposit.tsx`
  - `/contract` -> `app/(finance)/(contracts)/contract.tsx`
  - `/checkout` -> `app/(finance)/(billing)/checkout.tsx`
  - `/invoice` -> `app/(finance)/(billing)/invoice.tsx`
  - `/bill` -> `app/(finance)/(billing)/bill.tsx`
  - `/collect` -> `app/(finance)/(billing)/collect.tsx`
- Management menu:
  - `/rooms-list` -> `app/(management)/(occupancy)/rooms-list.tsx`
  - `/invoices-list` -> `app/(finance)/(billing)/invoices-list.tsx`
  - `/services-settings` -> `app/(settings)/(configuration)/services-settings.tsx`
  - `/contracts-list` -> `app/(finance)/(contracts)/contracts-list.tsx`
  - `/tenants-list` -> `app/(management)/(occupancy)/tenants-list.tsx`
  - `/assets-list` -> `app/(management)/(occupancy)/assets-list.tsx`
  - `/vehicles-list` -> `app/(management)/(occupancy)/vehicles-list.tsx`
  - `/tenant-app-settings` -> `app/(settings)/(configuration)/tenant-app-settings.tsx`
  - `/invoice-settings` -> `app/(settings)/(configuration)/invoice-settings.tsx`
  - `/motel-settings` -> `app/(settings)/(configuration)/motel-settings.tsx`
- Expanded menu:
  - `/broker-management` -> `app/(management)/(buildings)/broker-management.tsx`
  - `/bank-account` -> `app/(finance)/(banking)/bank-account.tsx`
- Other actions:
  - `/finance-summary` -> `app/(finance)/(billing)/finance-summary.tsx`
  - `/service-summary` -> `app/(finance)/(billing)/service-summary.tsx`
  - `/zalo-history` -> `app/(finance)/(banking)/zalo-history.tsx`
  - `/transfer-history` -> `app/(finance)/(banking)/transfer-history.tsx`
- Overview cards:
  - `/room-stats` -> `app/(management)/(occupancy)/room-stats.tsx`
  - `/finance-stats` -> `app/(finance)/(billing)/finance-stats.tsx`

### Inbox tab

- Man hinh tab: `app/(tabs)/inbox.tsx`
- Man hinh lien quan:
  - `/new-chat` -> `app/(communication)/(chat)/new-chat.tsx`
  - `/notification-settings` -> `app/(settings)/(access)/notification-settings.tsx`

### Tasks tab

- Man hinh tab: `app/(tabs)/tasks.tsx`

### Find Tenants tab

- Man hinh tab: `app/(tabs)/find-tenants.tsx`

### More tab

- Man hinh tab: `app/(tabs)/more.tsx`
- Man hinh lien quan:
  - `/profile` -> `app/(account)/(profile)/profile.tsx`
  - `/company-management` -> `app/(management)/(buildings)/company-management.tsx`
  - `/brand-settings` -> `app/(settings)/(configuration)/brand-settings.tsx`
  - `/representative-info` -> `app/(account)/(profile)/representative-info.tsx`
  - `/digital-signature` -> `app/(account)/(profile)/digital-signature.tsx`
  - `/change-password` -> `app/(account)/(profile)/change-password.tsx`
  - `/link-phone` -> `app/(account)/(profile)/link-phone.tsx`
  - `/permissions` -> `app/(settings)/(access)/permissions.tsx`
  - `/notification-settings` -> `app/(settings)/(access)/notification-settings.tsx`
  - `/help-center` -> `app/(account)/(support)/help-center.tsx`
  - `/app-info` -> `app/(account)/(support)/app-info.tsx`
  - `/privacy-policy` -> `app/(account)/(legal)/privacy-policy.tsx`
  - `/terms-of-use` -> `app/(account)/(legal)/terms-of-use.tsx`

## Mapping theo nhom nghiep vu

- `(management)/(buildings)`: them/sua toa nha, quan ly moi gioi, quan ly cong ty-nhom.
- `(management)/(occupancy)`: phong, nhom phong, khach thue, xe, tai san, thong ke phong.
- `(finance)/(billing)`: hoa don, thu tien, thanh toan, tong ket tai chinh.
- `(finance)/(contracts)`: hop dong va tien coc.
- `(finance)/(banking)`: tai khoan ngan hang va lich su giao dich.
- `(finance)/(bookkeeping)`: thu/chi.
- `(settings)/(configuration)`: cai dat he thong nha tro, dich vu, hoa don, app khach thue, bat/tat tinh nang.
- `(settings)/(policies)`: tien ich, noi quy, tang gia.
- `(settings)/(access)`: quyen va thong bao.
- `(account)/(profile)`: ho so, bao mat, lien ket, thong tin dai dien.
- `(account)/(support)`: thong tin phan mem, tro giup.
- `(account)/(legal)`: chinh sach va dieu khoan.

## Ghi chu

- `app/(settings)/(configuration)/rental-settings.tsx` hien dang re-export tu `motel-settings.tsx` de giu compatibility.
- Nhom `app/(tabs)/rooms/` la luong an danh mo tu Home tab va chua thay doi.
