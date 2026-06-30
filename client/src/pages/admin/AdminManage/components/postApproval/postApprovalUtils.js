import { DASHBOARD_COLORS } from '../../Dashboard/constants/dashboardTheme'

export const POST_APPROVAL_PAGE_SIZE_OPTIONS = [8, 16, 32]

export const POST_APPROVAL_STATUS_OPTIONS = [
  'Tất cả',
  'Chờ duyệt',
  'Đã duyệt',
  'Từ chối',
  'Đã ẩn'
]

export const POST_APPROVAL_ROOM_TYPE_OPTIONS = [
  'Tất cả',
  'Phòng trọ',
  'Căn hộ mini',
  'Nhà nguyên căn',
  'Ký túc xá'
]

export const POST_APPROVAL_CITY_OPTIONS = [
  'Tất cả',
  'TP.HCM',
  'Hà Nội',
  'Đà Nẵng',
  'Bình Dương'
]

export const POST_APPROVAL_PRICE_OPTIONS = [
  'Tất cả',
  'Dưới 2tr',
  '2tr-4tr',
  '4tr-7tr',
  'Trên 7tr'
]

export const POST_APPROVAL_TIME_OPTIONS = [
  'Hôm nay',
  '7 ngày qua',
  '30 ngày qua',
  'Tất cả'
]

export const QUICK_REJECT_REASONS = [
  'Thông tin không chính xác',
  'Hình ảnh không phù hợp',
  'Giá không hợp lý',
  'Nội dung vi phạm quy định',
  'Trùng lặp bài đăng'
]

export const POST_APPROVAL_STATUS_STYLES = {
  'Chờ duyệt': { background: '#FAEEDA', color: '#633806' },
  'Đã duyệt': { background: '#EAF3DE', color: '#27500A' },
  'Từ chối': { background: '#FCEBEB', color: '#791F1F' },
  'Đã ẩn': { background: '#F1EFE8', color: '#444441' }
}

export const POST_APPROVAL_STATS_THEME = [
  {
    key: 'pending',
    label: 'Chờ duyệt',
    color: '#BA7517',
    background: '#FAEEDA'
  },
  {
    key: 'approvedToday',
    label: 'Đã duyệt hôm nay',
    color: '#27500A',
    background: '#EAF3DE'
  },
  {
    key: 'rejectedToday',
    label: 'Từ chối hôm nay',
    color: '#791F1F',
    background: '#FCEBEB'
  },
  {
    key: 'monthTotal',
    label: 'Tổng bài tháng này',
    color: '#0C447C',
    background: '#E6F1FB'
  }
]

export const previewSectionLabelSx = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: DASHBOARD_COLORS.textMuted,
  mb: 1.25
}

export const getBoardStatusLabel = (board) => {
  if (board?.reviewStatus) return board.reviewStatus
  if (board?.isHidden) return 'Đã ẩn'
  if (board?.rejectionReason || board?.isRejected) return 'Từ chối'
  if (board?.isActive) return 'Đã duyệt'
  return 'Chờ duyệt'
}

export const formatCurrency = (value) => {
  const numericValue = Number(value ?? 0)
  return numericValue.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  })
}

export const getDisplayPrice = (board) => Number(board?.promotionalRentalPrice ?? board?.rentPrice ?? 0)

export const getOwnerName = (board) =>
  board?.account?.fullName || board?.account?.username || 'Chủ trọ chưa cập nhật'

export const getOwnerInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'CT'
  return parts.slice(-2).map((item) => item.charAt(0).toUpperCase()).join('')
}

export const getBoardImages = (board) =>
  (board?.bulletinBoardImages || [])
    .map((item) => item?.imageLink)
    .filter(Boolean)

export const getBoardAmenities = (board) =>
  (board?.bulletinBoardRentalAmenities || [])
    .map((item) => item?.rentalAmenities?.name)
    .filter(Boolean)

export const getBoardPostedDate = (board) => {
  const rawDate = board?.createdAt || board?.moveInDate || board?.account?.createdAt
  if (!rawDate) return null
  const date = new Date(rawDate)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'
  return date.toLocaleDateString('vi-VN')
}

export const formatDateTime = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'
  return `${date.toLocaleDateString('vi-VN')} lúc ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

export const extractAddressParts = (address = '') => {
  const parts = address.split(',').map((item) => item.trim()).filter(Boolean)
  const city = parts.at(-1) || 'Chưa cập nhật'
  const district = parts.length > 1 ? parts.at(-2) : city
  return {
    district,
    city,
    shortAddress: [district, city].filter(Boolean).join(', '),
    fullAddress: parts.join(', ') || 'Chưa cập nhật'
  }
}

export const getRoomTypeLabel = (board) => board?.rentalCategory || 'Phòng trọ'

export const buildDerivedStats = (boards = [], actionStats = {}) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const pending = boards.filter((board) => getBoardStatusLabel(board) === 'Chờ duyệt').length
  const monthTotal = boards.filter((board) => getBoardPostedDate(board)?.getMonth() === currentMonth).length

  return {
    pending,
    approvedToday: actionStats.approvedToday ?? 0,
    rejectedToday: actionStats.rejectedToday ?? 0,
    monthTotal: monthTotal || boards.length
  }
}

export const matchesPriceRange = (price, priceRange) => {
  if (priceRange === 'Tất cả') return true
  if (priceRange === 'Dưới 2tr') return price < 2000000
  if (priceRange === '2tr-4tr') return price >= 2000000 && price <= 4000000
  if (priceRange === '4tr-7tr') return price > 4000000 && price <= 7000000
  if (priceRange === 'Trên 7tr') return price > 7000000
  return true
}

export const matchesTimeRange = (date, timeRange) => {
  if (timeRange === 'Tất cả' || !date) return true
  const now = new Date()
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  if (timeRange === 'Hôm nay') return diffDays <= 1
  if (timeRange === '7 ngày qua') return diffDays <= 7
  if (timeRange === '30 ngày qua') return diffDays <= 30
  return true
}

export const normalizeBoard = (board, index = 0) => {
  const ownerName = getOwnerName(board)
  const images = getBoardImages(board)
  const amenities = getBoardAmenities(board)
  const postedDate = getBoardPostedDate(board)
  const displayPrice = getDisplayPrice(board)
  const addressParts = extractAddressParts(board?.address || '')
  return {
    ...board,
    uiKey: board?.bulletinBoardId || `board-${index}`,
    statusLabel: getBoardStatusLabel(board),
    ownerName,
    ownerInitials: getOwnerInitials(ownerName),
    images,
    amenities,
    displayPrice,
    priceLabel: formatCurrency(displayPrice),
    roomTypeLabel: getRoomTypeLabel(board),
    postedDate,
    postedDateLabel: formatDate(postedDate),
    postedDateTimeLabel: formatDateTime(postedDate),
    addressParts,
    descriptionText: board?.description || 'Bài đăng chưa có mô tả chi tiết.',
    ownerPhone: board?.account?.phone || 'Chưa cập nhật',
    ownerEmail: board?.account?.email || 'Chưa cập nhật',
    ownerAvatar: board?.account?.avatar || '',
    ownerRole: 'Chủ trọ',
    rejectionReason: board?.rejectionReason || '',
    ownerStats: {
      totalPosts: 0,
      approvedPosts: 0
    },
    history: buildBoardHistory(board, postedDate)
  }
}

const buildBoardHistory = (board, postedDate) => {
  const statusLabel = getBoardStatusLabel(board)
  const baseTimestamp = formatDateTime(postedDate || new Date())
  const history = [
    {
      id: 'created',
      label: 'Bài được đăng',
      timestamp: baseTimestamp
    }
  ]

  if (statusLabel === 'Chờ duyệt') {
    history.push({
      id: 'pending',
      label: 'Đang chờ admin duyệt',
      timestamp: baseTimestamp
    })
  }

  if (statusLabel === 'Đã duyệt') {
    history.push({
      id: 'approved',
      label: 'Bài đã được duyệt',
      timestamp: baseTimestamp
    })
  }

  if (statusLabel === 'Từ chối') {
    history.push({
      id: 'rejected',
      label: 'Bài bị từ chối',
      timestamp: baseTimestamp
    })
  }

  if (statusLabel === 'Đã ẩn') {
    history.push({
      id: 'hidden',
      label: 'Bài đã bị ẩn',
      timestamp: baseTimestamp
    })
  }

  return history
}
