export const FILTER_OPTIONS = {
  statuses: ['Tất cả', 'Chờ xử lý', 'Đang xem xét', 'Đã xử lý', 'Đã bỏ qua'],
  reasons: ['Tất cả', 'Thông tin sai lệch', 'Lừa đảo', 'Hình ảnh không phù hợp', 'Spam', 'Nội dung phản cảm', 'Giá không hợp lý'],
  subjectTypes: ['Tất cả', 'Bài đăng', 'Người dùng', 'Bình luận'],
  severities: ['Tất cả', 'Thấp (1-2 lần)', 'Trung bình (3-5 lần)', 'Cao (6-10 lần)', 'Nghiêm trọng (10+ lần)'],
  times: ['Hôm nay', '7 ngày', '30 ngày', 'Tất cả']
}

export const ACTION_OPTIONS = [
  {
    value: 'HIDE',
    title: 'Ẩn bài đăng tạm thời',
    description: 'Bài sẽ bị ẩn, chủ trọ có thể chỉnh sửa lại'
  },
  {
    value: 'DELETE',
    title: 'Xóa bài đăng vĩnh viễn',
    description: 'Không thể khôi phục',
    descriptionColor: '#791F1F'
  },
  {
    value: 'WARN',
    title: 'Cảnh cáo chủ trọ',
    description: 'Gửi thông báo cảnh cáo, bài vẫn hiển thị'
  },
  {
    value: 'LOCK',
    title: 'Khóa tài khoản tạm thời',
    description: 'Khóa X ngày',
    hasDaysInput: true
  },
  {
    value: 'IGNORE',
    title: 'Bỏ qua báo cáo',
    description: 'Báo cáo không có căn cứ'
  }
]

export const getDefaultNotificationMessage = (action, report) => {
  switch (action) {
    case 'HIDE':
      return `Bài đăng "${report.subjectTitle}" đã tạm thời bị ẩn để chờ cập nhật lại nội dung theo quy định của hệ thống.`
    case 'DELETE':
      return `Bài đăng "${report.subjectTitle}" đã bị xóa vĩnh viễn do vi phạm chính sách đăng tin của hệ thống.`
    case 'WARN':
      return `Tài khoản của bạn đã bị cảnh cáo do nội dung liên quan đến "${report.reason}". Vui lòng rà soát và tuân thủ quy định đăng tin.`
    case 'LOCK':
      return `Tài khoản của bạn đã bị khóa tạm thời do nhiều báo cáo vi phạm liên quan đến "${report.reason}".`
    case 'IGNORE':
    default:
      return `Báo cáo đối với "${report.subjectTitle}" đã được xem xét và hiện chưa ghi nhận căn cứ xử lý bổ sung.`
  }
}

export const EMPTY_QUICK_STATS = [
  { label: 'Chờ xử lý', value: 0, iconKey: 'flag', color: '#791F1F', background: '#FCEBEB' },
  { label: 'Đang xem xét', value: 0, iconKey: 'eye', color: '#633806', background: '#FAEEDA' },
  { label: 'Đã xử lý hôm nay', value: 0, iconKey: 'check', color: '#27500A', background: '#EAF3DE' },
  { label: 'Tổng báo cáo tháng này', value: 0, iconKey: 'chart', color: '#0C447C', background: '#E6F1FB' }
]

export const mapStatsToQuickStats = (stats = {}) => [
  { label: 'Chờ xử lý', value: stats.pending ?? 0, iconKey: 'flag', color: '#791F1F', background: '#FCEBEB' },
  { label: 'Đang xem xét', value: stats.reviewing ?? 0, iconKey: 'eye', color: '#633806', background: '#FAEEDA' },
  { label: 'Đã xử lý hôm nay', value: stats.resolvedToday ?? 0, iconKey: 'check', color: '#27500A', background: '#EAF3DE' },
  { label: 'Tổng báo cáo tháng này', value: stats.monthTotal ?? 0, iconKey: 'chart', color: '#0C447C', background: '#E6F1FB' }
]
