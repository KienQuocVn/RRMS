export const PAGE_BG = '#f5f7fa'
export const CARD_BG = '#ffffff'
export const BORDER = '0.5px solid #e5e7eb'
export const PRIMARY = '#20a9e7'
export const PRIMARY_HOVER = '#2b7ed7'

export const STATUS_STYLES = {
  'Chờ xử lý': { background: '#FAEEDA', color: '#633806' },
  'Đang xem xét': { background: '#E6F1FB', color: '#0C447C' },
  'Đã xử lý': { background: '#EAF3DE', color: '#27500A' },
  'Đã bỏ qua': { background: '#F1EFE8', color: '#5F5E5A' }
}

export const SEVERITY_STYLES = {
  Thấp: { background: '#F1EFE8', color: '#444441' },
  'Trung bình': { background: '#FAEEDA', color: '#633806' },
  Cao: { background: '#FCEBEB', color: '#791F1F' },
  'Nghiêm trọng': { background: '#A32D2D', color: '#ffffff' }
}

export const REASON_STYLES = {
  'Lừa đảo': { background: '#FCEBEB', color: '#791F1F' },
  'Thông tin sai': { background: '#FAEEDA', color: '#BA7517' },
  Spam: { background: '#F1EFE8', color: '#5F5E5A' },
  'Hình ảnh': { background: '#F2EDFF', color: '#6D4CC4' }
}

export const SUBJECT_TYPE_STYLES = {
  'Bài đăng': { background: '#E6F1FB', color: '#0C447C' },
  'Người dùng': { background: '#EAF3DE', color: '#27500A' },
  'Bình luận': { background: '#F1EFE8', color: '#444441' }
}

export const getCountColor = (count) => {
  if (count >= 10) return '#A32D2D'
  if (count >= 6) return '#E24B4A'
  if (count >= 3) return '#BA7517'
  return '#6B7280'
}
