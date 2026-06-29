import { alpha } from '@mui/material/styles'

export const PRIMARY = '#20a9e7'
export const PRIMARY_HOVER = '#2b7ed7'
export const PAGE_BG = '#f5f7fa'
export const PANEL_BG = '#ffffff'
export const BORDER = '0.5px solid #e5e7eb'

export const ROLE_OPTIONS = ['Tất cả', 'Chủ trọ', 'Người thuê', 'Admin']
export const STATUS_OPTIONS = ['Tất cả', 'Đang hoạt động', 'Bị khóa', 'Chưa xác minh', 'Đã xóa']
export const VERIFICATION_OPTIONS = ['Tất cả', 'Đã xác minh CMND', 'Chưa xác minh', 'Đã xác minh số điện thoại']
export const JOIN_TIME_OPTIONS = ['Tất cả', 'Hôm nay', '7 ngày qua', '30 ngày qua', '3 tháng qua', 'Năm nay']
export const SORT_OPTIONS = ['Mới nhất', 'Cũ nhất', 'Nhiều bài nhất', 'Nhiều báo cáo nhất', 'Tên A-Z']
export const LOCK_REASON_OPTIONS = ['Vi phạm quy định', 'Spam', 'Lừa đảo', 'Thông tin sai lệch', 'Tài khoản giả mạo', 'Lý do khác']

export const LOCK_DURATION_OPTIONS = [
  { value: '3d', title: 'Khóa tạm thời 3 ngày' },
  { value: '7d', title: 'Khóa tạm thời 7 ngày' },
  { value: '30d', title: 'Khóa tạm thời 30 ngày' },
  {
    value: 'permanent',
    title: 'Khóa vĩnh viễn',
    description: 'Người dùng không thể đăng nhập lại',
    descriptionColor: '#791F1F'
  }
]

const ROLE_LABELS = {
  ADMIN: 'Admin',
  HOST: 'Chủ trọ',
  CUSTOMER: 'Người thuê',
  GUEST: 'Người thuê',
  EMPLOYEE: 'Admin',
  BROKER: 'Chủ trọ'
}

const ROLE_STYLES = {
  Admin: { bg: '#EEEDFE', color: '#3C3489' },
  'Chủ trọ': { bg: '#EAF3DE', color: '#27500A' },
  'Người thuê': { bg: '#E6F1FB', color: '#0C447C' }
}

const STATUS_STYLES = {
  'Đang hoạt động': { bg: '#EAF3DE', color: '#27500A' },
  'Bị khóa': { bg: '#FCEBEB', color: '#791F1F' },
  'Chưa xác minh': { bg: '#FAEEDA', color: '#633806' },
  'Đã xóa': { bg: '#F1EFE8', color: '#5F5E5A' }
}

const ACTIVITY_COLORS = ['#20a9e7', '#2E7D32', '#F59E0B', '#9CA3AF']

const SAMPLE_ADDRESSES = [
  '12 Nguyen Trai, Quan 1, TP.HCM',
  '45 Le Van Sy, Phu Nhuan, TP.HCM',
  '80 Tran Hung Dao, Quan 5, TP.HCM',
  '21 Nguyen Van Linh, Hai Chau, Da Nang',
  '116 Cach Mang Thang 8, Ninh Kieu, Can Tho'
]

const SAMPLE_POSTS = [
  { title: 'Phong tro trung tam, full noi that', price: '4,8 tr/thang', status: 'Dang hien thi' },
  { title: 'Can ho mini gan truong dai hoc', price: '5,2 tr/thang', status: 'Cho duyet' },
  { title: 'Phong co gac, gio tu do', price: '3,6 tr/thang', status: 'Tam an' }
]

const SAMPLE_ACTIVITY_TITLES = ['Dang bai: Phong tro Q.1', 'Bai duoc duyet', 'Cap nhat ho so tai khoan', 'Tai khoan duoc tao']

export const getRoleLabel = (roleValue) => {
  if (Array.isArray(roleValue)) {
    return getRoleLabel(roleValue[0])
  }

  return ROLE_LABELS[roleValue] || roleValue || 'Người thuê'
}

export const getRoleStyle = (roleLabel) => ROLE_STYLES[roleLabel] || ROLE_STYLES['Người thuê']

export const getStatusStyle = (statusLabel) => STATUS_STYLES[statusLabel] || STATUS_STYLES['Đang hoạt động']

export const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ND'

export const formatDate = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

export const formatRelativeTime = (value) => {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'

  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)))
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays} ngày trước`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} tháng trước`
  return formatDate(value)
}

const getJoinFilterMatch = (dateValue, filter) => {
  if (filter === 'Tất cả' || !dateValue) return true
  const joinedAt = new Date(dateValue)
  if (Number.isNaN(joinedAt.getTime())) return true

  const now = new Date()
  const diffDays = Math.floor((now - joinedAt) / (1000 * 60 * 60 * 24))

  if (filter === 'Hôm nay') return diffDays === 0
  if (filter === '7 ngày qua') return diffDays <= 7
  if (filter === '30 ngày qua') return diffDays <= 30
  if (filter === '3 tháng qua') return diffDays <= 90
  if (filter === 'Năm nay') return joinedAt.getFullYear() === now.getFullYear()
  return true
}

export const buildUserRecord = (account, index) => {
  const role = getRoleLabel(account.role)
  const postsCount = Math.max(0, ((account.username?.length || 5) + index * 3) % 15)
  const violationCount = (index * 2 + (account.phone?.length || 0)) % 5
  const verifiedIdentity = Boolean(account.cccd)
  const verifiedPhone = Boolean(account.phone)
  const statuses = ['Đang hoạt động', 'Bị khóa', 'Chưa xác minh', 'Đang hoạt động', 'Đã xóa']
  const status = statuses[index % statuses.length]
  const createdAt = account.createdAt || new Date(Date.now() - index * 86400000 * 11).toISOString()
  const lastLoginAt = new Date(new Date(createdAt).getTime() + 86400000 * (index + 2)).toISOString()
  const profileViews = 120 + index * 37
  const address = account.address || SAMPLE_ADDRESSES[index % SAMPLE_ADDRESSES.length]
  const posts = SAMPLE_POSTS.map((post, postIndex) => ({
    id: `${account.username}-post-${postIndex}`,
    title: `${post.title} ${postIndex === 0 ? 'Q.1' : postIndex === 1 ? 'gan trung tam' : 'gia tot'}`,
    price: post.price,
    status: post.status,
    thumbnail: account.avatar || '',
    accent: ['#20a9e7', '#34D399', '#F59E0B'][postIndex]
  }))
  const recentActivities = SAMPLE_ACTIVITY_TITLES.map((title, activityIndex) => ({
    id: `${account.username}-activity-${activityIndex}`,
    title,
    time: activityIndex === 0 ? `${index + 2} giờ trước` : activityIndex === 1 ? `${activityIndex + 1} ngày trước` : activityIndex === 2 ? '5 ngày trước' : formatDate(createdAt),
    color: ACTIVITY_COLORS[activityIndex]
  }))

  return {
    id: account.username || `user-${index}`,
    username: account.username || '',
    fullName: account.fullName || account.username || 'Người dùng chưa đặt tên',
    email: account.email || '--',
    phone: account.phone || '--',
    avatar: account.avatar || '',
    role,
    status,
    createdAt,
    lastLoginAt,
    postsCount,
    violationCount,
    verifiedIdentity,
    verifiedPhone,
    address,
    cccd: account.cccd || '',
    gender: account.gender || '',
    note: '',
    profileViews,
    posts,
    recentActivities
  }
}

export const filterUsers = (users, filters, searchValue) => {
  const keyword = searchValue.trim().toLowerCase()
  const list = users.filter((user) => {
    const matchesRole = filters.role === 'Tất cả' || user.role === filters.role
    const matchesStatus = filters.status === 'Tất cả' || user.status === filters.status
    const matchesVerification = filters.verification === 'Tất cả'
      || (filters.verification === 'Đã xác minh CMND' && user.verifiedIdentity)
      || (filters.verification === 'Chưa xác minh' && !user.verifiedIdentity)
      || (filters.verification === 'Đã xác minh số điện thoại' && user.verifiedPhone)
    const matchesTime = getJoinFilterMatch(user.createdAt, filters.joinedAt)
    const matchesSearch = !keyword
      || [user.fullName, user.email, user.phone, user.username].join(' ').toLowerCase().includes(keyword)

    return matchesRole && matchesStatus && matchesVerification && matchesTime && matchesSearch
  })

  if (filters.sort === 'Cũ nhất') {
    return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }
  if (filters.sort === 'Nhiều bài nhất') {
    return [...list].sort((a, b) => b.postsCount - a.postsCount)
  }
  if (filters.sort === 'Nhiều báo cáo nhất') {
    return [...list].sort((a, b) => b.violationCount - a.violationCount)
  }
  if (filters.sort === 'Tên A-Z') {
    return [...list].sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'))
  }

  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const getStats = (users) => {
  const total = users.length
  const hosts = users.filter((user) => user.role === 'Chủ trọ').length
  const tenants = users.filter((user) => user.role === 'Người thuê').length
  const locked = users.filter((user) => user.status === 'Bị khóa').length

  return [
    {
      key: 'total',
      label: 'Tổng người dùng',
      value: total.toLocaleString('vi-VN'),
      icon: 'groups',
      bg: '#E6F1FB',
      color: '#0C447C'
    },
    {
      key: 'hosts',
      label: 'Chủ trọ',
      value: hosts.toLocaleString('vi-VN'),
      icon: 'apartment',
      bg: '#EAF3DE',
      color: '#27500A'
    },
    {
      key: 'tenants',
      label: 'Người thuê',
      value: tenants.toLocaleString('vi-VN'),
      icon: 'person',
      bg: '#FAEEDA',
      color: '#633806'
    },
    {
      key: 'locked',
      label: 'Tài khoản bị khóa',
      value: locked.toLocaleString('vi-VN'),
      icon: 'lock',
      bg: '#FCEBEB',
      color: '#791F1F'
    }
  ]
}

export const getNotificationPreview = (userName, duration, reason) =>
  `Tai khoan ${userName || 'nguoi dung'} da bi khoa ${duration === 'permanent' ? 'vinh vien' : 'tam thoi'} do: ${reason || 'vi pham quy dinh'}. Vui long lien he quan tri vien neu can ho tro.`

export const getUserRowStyles = (theme, selected, locked) => ({
  cursor: 'pointer',
  backgroundColor: selected ? '#E6F1FB' : locked ? '#FFF8F8' : '#ffffff',
  borderLeft: selected ? `2px solid ${PRIMARY}` : '2px solid transparent',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: selected ? '#E6F1FB' : alpha(PRIMARY, 0.08)
  },
  '& td': {
    color: locked ? '#6B7280' : theme.palette.text.primary
  }
})
