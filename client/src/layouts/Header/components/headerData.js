export const topPrimaryLinks = [
  { to: '/', labelKey: 'trang-chu' },
  { to: '/search', labelKey: 'tim-kiem' },
  { to: '/contact', labelKey: 'lien-he' },
  { to: '/support', labelKey: 'tro-giup' }
]

export const topSecondaryLinks = [
  {
    to: 'https://docs.google.com/forms/d/e/1FAIpQLSc5begvG3B5NE29iy3JnXya_6zY_DyHdIIfb3TnnQTNqr5ZVQ/viewform?vc=0&amp;c=0&amp;w=1&amp;flr=0',
    labelKey: 'dong-gop',
    target: '_blank',
    rel: 'nofollow',
    spanClassName: 'aw__nx3kzrx show-desktop aw__szp9uz0'
  },
  {
    to: '/',
    labelKey: 'tai-ung-dung',
    spanClassName: 'aw__n1rd4x1j show-desktop aw__szp9uz0'
  },
  {
    to: '/introduce',
    labelKey: 've-chung-toi',
    spanClassName: 'aw__n1rd4x1j show-desktop aw__szp9uz0'
  }
]

export const categoryMenuItems = [
  {
    to: '#',
    label: 'Muốn thuê',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_muban.png?alt=media&token=0a78f985-f7dc-4211-b14c-cc64c9892136',
    active: true,
    hasChevron: true
  },
  {
    to: '#',
    label: 'Cho thuê',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_chothue.png?alt=media&token=6ebeeb22-5d71-45e9-b02c-3c03499ce555',
    hasChevron: true
  },
  {
    to: '#',
    label: 'Dự án',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_duan.png?alt=media&token=88b33caf-3f11-4025-a18c-653c0a6056c4',
    hasChevron: true
  },
  {
    to: '#',
    label: 'Tìm môi giới',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_timmoigioi.png?alt=media&token=a08d9169-cf8a-4fdd-aa1c-200a888b0abd'
  },
  {
    to: '/chart',
    label: 'Biểu đồ biến động giá',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_bieudogia.png?alt=media&token=e62c4212-ee82-4985-b2a5-02e225c1e4d1'
  },
  {
    to: '#',
    label: 'Vay mua nhà',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_vaymuanha.png?alt=media&token=ec55ddd5-2e94-408d-b167-d8f02582ac73'
  }
]

const accountSections = [
  {
    title: 'Quản lí đơn hàng',
    items: [
      { to: '#', label: 'Đơn mua', iconSrc: '/escrow_buy_orders.svg' },
      { to: '#', label: 'Đơn bán', iconSrc: '/escrow-orders.svg' },
      {
        to: '#',
        label: 'Ví bán hàng',
        iconSrc: '/escrow.svg',
        highlight: true,
        actionLabel: 'Liên kết ngay',
        actionIconSrc: '/chervon_right_orange.svg'
      }
    ]
  },
  {
    title: 'Tiện ích',
    items: [
      { to: '/heart', label: 'Tin đăng đã lưu', iconSrc: '/menu-saved-ad.svg', authOnly: true },
      { to: '#', label: 'Tìm kiếm đã lưu', iconSrc: '/menu-saved-search.svg', authOnly: true },
      { to: '/rating-history', label: 'Đánh giá từ tôi', iconSrc: '/menu-rating-management.svg', authOnly: true }
    ]
  },
  {
    title: 'Dịch vụ trả phí',
    items: [
      { to: '#', label: 'Gói PRO', iconSrc: '/sub-pro.svg' },
      { to: '#', label: 'Lịch sử giao dịch', iconSrc: '/circle-list.svg', authOnly: true },
      {
        to: '#',
        label: 'Cửa hàng',
        iconSrc: '/shop-more.svg',
        highlight: true,
        actionLabel: 'Tạo ngay',
        actionIconSrc: '/chervon_right_orange.svg'
      }
    ]
  },
  {
    title: 'Ưu đãi, khuyến mãi',
    items: [
      { to: '#', label: 'RRMS ưu đãi', iconSrc: '/reward-icon.svg' },
      { to: '#', label: 'Ưu đãi của tôi', iconSrc: '/voucher-icon.svg' }
    ]
  },
  {
    title: 'Khác',
    items: [
      { to: '/profile', label: 'Cài đặt tài khoản', iconSrc: '/setting.svg', authOnly: true },
      { to: '/support', label: 'Trợ giúp', iconSrc: '/setting.svg' },
      { label: 'Đăng xuất', iconSrc: '/setting.svg', action: 'logout', authOnly: true }
    ]
  }
]

export const getAccountSections = (tokenExists) =>
  accountSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.authOnly || tokenExists)
    }))
    .filter((section) => section.items.length > 0)
