const REPORT_SEED = [
  {
    id: 'VR-001',
    subjectType: 'Bài đăng',
    subjectTitle: 'Phòng trọ full nội thất gần Đại học Văn Lang',
    subjectAddress: '12 Nguyễn Gia Trí, Bình Thạnh, TP.HCM',
    subjectPrice: '4.800.000đ/tháng',
    subjectImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=240&q=80',
    reason: 'Lừa đảo',
    reasonGroup: 'Lừa đảo',
    reportCount: 12,
    lastReporter: { name: 'thanhha99', initials: 'TH', avatar: '' },
    timeAgo: '2 giờ trước',
    createdAtLabel: '29/06/2026 lúc 09:15',
    status: 'Chờ xử lý',
    severity: 'Nghiêm trọng',
    latestContent:
      'Bài đăng yêu cầu chuyển cọc trước nhưng không cung cấp giấy tờ xác minh. Sau khi liên hệ thì người đăng liên tục né tránh và thay đổi nội dung trao đổi.',
    reportHistory: [
      { label: 'Báo cáo được tạo', time: '29/06/2026 09:15', color: '#20a9e7' },
      { label: 'Admin đang xem xét', time: '29/06/2026 10:05', color: '#BA7517' }
    ],
    stats: { uniqueReporters: 4, firstReportedAt: '20/06/2026' },
    reporters: [
      { id: 'r1', name: 'thanhha99', initials: 'TH', reason: 'Lừa đảo', timeAgo: '2 giờ trước' },
      { id: 'r2', name: 'namtran', initials: 'NT', reason: 'Thông tin sai', timeAgo: '5 giờ trước' },
      { id: 'r3', name: 'linhpham', initials: 'LP', reason: 'Spam', timeAgo: '1 ngày trước' },
      { id: 'r4', name: 'hungvo', initials: 'HV', reason: 'Hình ảnh', timeAgo: '2 ngày trước' },
      { id: 'r5', name: 'khanhdo', initials: 'KD', reason: 'Lừa đảo', timeAgo: '3 ngày trước' },
      { id: 'r6', name: 'vynguyen', initials: 'VN', reason: 'Spam', timeAgo: '4 ngày trước' },
      { id: 'r7', name: 'phucmai', initials: 'PM', reason: 'Thông tin sai', timeAgo: '6 ngày trước' }
    ]
  },
  {
    id: 'VR-002',
    subjectType: 'Người dùng',
    subjectTitle: 'nguyenvanduc',
    subjectAddress: 'Chủ trọ tại Quận 7, TP.HCM',
    subjectPrice: 'Tài khoản xác minh',
    subjectImage: '',
    reason: 'Thông tin sai lệch',
    reasonGroup: 'Thông tin sai',
    reportCount: 4,
    lastReporter: { name: 'hoa.nguyen', initials: 'HN', avatar: '' },
    timeAgo: '4 giờ trước',
    createdAtLabel: '29/06/2026 lúc 07:20',
    status: 'Đang xem xét',
    severity: 'Trung bình',
    latestContent: 'Người dùng thường xuyên thay đổi diện tích phòng giữa bài đăng và lúc tư vấn.',
    reportHistory: [{ label: 'Báo cáo được tạo', time: '29/06/2026 07:20', color: '#20a9e7' }],
    stats: { uniqueReporters: 3, firstReportedAt: '24/06/2026' },
    reporters: [
      { id: 'r8', name: 'hoa.nguyen', initials: 'HN', reason: 'Thông tin sai', timeAgo: '4 giờ trước' },
      { id: 'r9', name: 'quocanh', initials: 'QA', reason: 'Spam', timeAgo: '10 giờ trước' },
      { id: 'r10', name: 'tuyetmai', initials: 'TM', reason: 'Thông tin sai', timeAgo: '2 ngày trước' }
    ]
  },
  {
    id: 'VR-003',
    subjectType: 'Bình luận',
    subjectTitle: 'Bình luận trong bài "Phòng trọ giá rẻ Quận 10"',
    subjectAddress: 'Bình luận công khai',
    subjectPrice: 'Cần rà soát',
    subjectImage: '',
    reason: 'Nội dung phản cảm',
    reasonGroup: 'Spam',
    reportCount: 2,
    lastReporter: { name: 'vananh', initials: 'VA', avatar: '' },
    timeAgo: '6 giờ trước',
    createdAtLabel: '28/06/2026 lúc 22:10',
    status: 'Chờ xử lý',
    severity: 'Thấp',
    latestContent: 'Bình luận sử dụng ngôn từ xúc phạm và gây khó chịu cho người xem.',
    reportHistory: [{ label: 'Báo cáo được tạo', time: '28/06/2026 22:10', color: '#20a9e7' }],
    stats: { uniqueReporters: 2, firstReportedAt: '28/06/2026' },
    reporters: [
      { id: 'r11', name: 'vananh', initials: 'VA', reason: 'Spam', timeAgo: '6 giờ trước' },
      { id: 'r12', name: 'duytran', initials: 'DT', reason: 'Spam', timeAgo: '8 giờ trước' }
    ]
  },
  {
    id: 'VR-004',
    subjectType: 'Bài đăng',
    subjectTitle: 'Căn hộ mini ban công lớn tại Gò Vấp',
    subjectAddress: '35 Phan Văn Trị, Gò Vấp, TP.HCM',
    subjectPrice: '6.200.000đ/tháng',
    subjectImage: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=240&q=80',
    reason: 'Hình ảnh không phù hợp',
    reasonGroup: 'Hình ảnh',
    reportCount: 7,
    lastReporter: { name: 'kimchi', initials: 'KC', avatar: '' },
    timeAgo: '9 giờ trước',
    createdAtLabel: '28/06/2026 lúc 17:45',
    status: 'Chờ xử lý',
    severity: 'Cao',
    latestContent: 'Hình ảnh trong bài là ảnh từ nguồn khác, không đúng với phòng thực tế.',
    reportHistory: [{ label: 'Báo cáo được tạo', time: '28/06/2026 17:45', color: '#20a9e7' }],
    stats: { uniqueReporters: 5, firstReportedAt: '23/06/2026' },
    reporters: [
      { id: 'r13', name: 'kimchi', initials: 'KC', reason: 'Hình ảnh', timeAgo: '9 giờ trước' },
      { id: 'r14', name: 'tuanle', initials: 'TL', reason: 'Hình ảnh', timeAgo: '14 giờ trước' },
      { id: 'r15', name: 'yennhi', initials: 'YN', reason: 'Thông tin sai', timeAgo: '2 ngày trước' },
      { id: 'r16', name: 'binhminh', initials: 'BM', reason: 'Hình ảnh', timeAgo: '3 ngày trước' },
      { id: 'r17', name: 'hanhpham', initials: 'HP', reason: 'Spam', timeAgo: '5 ngày trước' }
    ]
  },
  {
    id: 'VR-005',
    subjectType: 'Người dùng',
    subjectTitle: 'tranminhhost',
    subjectAddress: 'Tài khoản môi giới',
    subjectPrice: 'Đã xác minh số điện thoại',
    subjectImage: '',
    reason: 'Spam',
    reasonGroup: 'Spam',
    reportCount: 9,
    lastReporter: { name: 'hoangvu', initials: 'HV', avatar: '' },
    timeAgo: '12 giờ trước',
    createdAtLabel: '28/06/2026 lúc 13:10',
    status: 'Đã xử lý',
    severity: 'Cao',
    latestContent: 'Người dùng đăng bài trùng lặp nhiều lần trong thời gian ngắn để đẩy tin.',
    reportHistory: [
      { label: 'Báo cáo được tạo', time: '28/06/2026 13:10', color: '#20a9e7' },
      { label: 'Đã cảnh cáo người dùng', time: '28/06/2026 18:20', color: '#27500A' }
    ],
    stats: { uniqueReporters: 6, firstReportedAt: '19/06/2026' },
    reporters: [
      { id: 'r18', name: 'hoangvu', initials: 'HV', reason: 'Spam', timeAgo: '12 giờ trước' },
      { id: 'r19', name: 'ngocdiep', initials: 'ND', reason: 'Spam', timeAgo: '1 ngày trước' },
      { id: 'r20', name: 'thaochi', initials: 'TC', reason: 'Thông tin sai', timeAgo: '2 ngày trước' }
    ]
  },
  {
    id: 'VR-006',
    subjectType: 'Bài đăng',
    subjectTitle: 'Phòng trọ tiện nghi gần bến xe Miền Đông',
    subjectAddress: '48 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM',
    subjectPrice: '3.900.000đ/tháng',
    subjectImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=240&q=80',
    reason: 'Giá không hợp lý',
    reasonGroup: 'Thông tin sai',
    reportCount: 3,
    lastReporter: { name: 'nganly', initials: 'NL', avatar: '' },
    timeAgo: '1 ngày trước',
    createdAtLabel: '27/06/2026 lúc 15:30',
    status: 'Đã bỏ qua',
    severity: 'Trung bình',
    latestContent: 'Giá trong bài thấp hơn nhiều so với giá báo khi gọi điện.',
    reportHistory: [
      { label: 'Báo cáo được tạo', time: '27/06/2026 15:30', color: '#20a9e7' },
      { label: 'Báo cáo bị bỏ qua', time: '27/06/2026 17:00', color: '#5F5E5A' }
    ],
    stats: { uniqueReporters: 3, firstReportedAt: '27/06/2026' },
    reporters: [
      { id: 'r21', name: 'nganly', initials: 'NL', reason: 'Thông tin sai', timeAgo: '1 ngày trước' },
      { id: 'r22', name: 'baotran', initials: 'BT', reason: 'Thông tin sai', timeAgo: '1 ngày trước' },
      { id: 'r23', name: 'trangvu', initials: 'TV', reason: 'Spam', timeAgo: '2 ngày trước' }
    ]
  },
  {
    id: 'VR-007',
    subjectType: 'Bình luận',
    subjectTitle: 'Bình luận trong bài "Studio cửa sổ lớn Quận 3"',
    subjectAddress: 'Bình luận công khai',
    subjectPrice: 'Cần kiểm duyệt',
    subjectImage: '',
    reason: 'Spam',
    reasonGroup: 'Spam',
    reportCount: 1,
    lastReporter: { name: 'ngoclinh', initials: 'NL', avatar: '' },
    timeAgo: '1 ngày trước',
    createdAtLabel: '27/06/2026 lúc 09:05',
    status: 'Đang xem xét',
    severity: 'Thấp',
    latestContent: 'Bình luận chèn link ngoài và số điện thoại không liên quan.',
    reportHistory: [{ label: 'Báo cáo được tạo', time: '27/06/2026 09:05', color: '#20a9e7' }],
    stats: { uniqueReporters: 1, firstReportedAt: '27/06/2026' },
    reporters: [{ id: 'r24', name: 'ngoclinh', initials: 'NL', reason: 'Spam', timeAgo: '1 ngày trước' }]
  },
  {
    id: 'VR-008',
    subjectType: 'Bài đăng',
    subjectTitle: 'Ký túc xá mini mới xây tại Thủ Đức',
    subjectAddress: '22 Võ Văn Ngân, Thủ Đức, TP.HCM',
    subjectPrice: '2.700.000đ/tháng',
    subjectImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=240&q=80',
    reason: 'Lừa đảo',
    reasonGroup: 'Lừa đảo',
    reportCount: 11,
    lastReporter: { name: 'huyentran', initials: 'HT', avatar: '' },
    timeAgo: '2 ngày trước',
    createdAtLabel: '26/06/2026 lúc 19:25',
    status: 'Chờ xử lý',
    severity: 'Nghiêm trọng',
    latestContent: 'Người đăng yêu cầu thanh toán phí giữ chỗ trước khi cho xem phòng và không có địa chỉ rõ ràng.',
    reportHistory: [{ label: 'Báo cáo được tạo', time: '26/06/2026 19:25', color: '#20a9e7' }],
    stats: { uniqueReporters: 5, firstReportedAt: '18/06/2026' },
    reporters: [
      { id: 'r25', name: 'huyentran', initials: 'HT', reason: 'Lừa đảo', timeAgo: '2 ngày trước' },
      { id: 'r26', name: 'quynhmai', initials: 'QM', reason: 'Lừa đảo', timeAgo: '2 ngày trước' },
      { id: 'r27', name: 'ductran', initials: 'DT', reason: 'Thông tin sai', timeAgo: '3 ngày trước' },
      { id: 'r28', name: 'vuongnguyen', initials: 'VN', reason: 'Lừa đảo', timeAgo: '5 ngày trước' }
    ]
  }
]

export const FILTER_OPTIONS = {
  statuses: ['Tất cả', 'Chờ xử lý', 'Đang xem xét', 'Đã xử lý', 'Đã bỏ qua'],
  reasons: ['Tất cả', 'Thông tin sai lệch', 'Lừa đảo', 'Hình ảnh không phù hợp', 'Spam', 'Nội dung phản cảm', 'Giá không hợp lý'],
  subjectTypes: ['Tất cả', 'Bài đăng', 'Người dùng', 'Bình luận'],
  severities: ['Tất cả', 'Thấp (1-2 lần)', 'Trung bình (3-5 lần)', 'Cao (6-10 lần)', 'Nghiêm trọng (10+ lần)'],
  times: ['Hôm nay', '7 ngày', '30 ngày', 'Tất cả']
}

export const QUICK_STATS = [
  { label: 'Chờ xử lý', value: 3, iconKey: 'flag', color: '#791F1F', background: '#FCEBEB' },
  { label: 'Đang xem xét', value: 5, iconKey: 'eye', color: '#633806', background: '#FAEEDA' },
  { label: 'Đã xử lý hôm nay', value: 7, iconKey: 'check', color: '#27500A', background: '#EAF3DE' },
  { label: 'Tổng báo cáo tháng này', value: 38, iconKey: 'chart', color: '#0C447C', background: '#E6F1FB' }
]

export const ACTION_OPTIONS = [
  {
    value: 'hide',
    title: 'Ẩn bài đăng tạm thời',
    description: 'Bài sẽ bị ẩn, chủ trọ có thể chỉnh sửa lại'
  },
  {
    value: 'delete',
    title: 'Xóa bài đăng vĩnh viễn',
    description: 'Không thể khôi phục',
    descriptionColor: '#791F1F'
  },
  {
    value: 'warn',
    title: 'Cảnh cáo chủ trọ',
    description: 'Gửi thông báo cảnh cáo, bài vẫn hiển thị'
  },
  {
    value: 'lock',
    title: 'Khóa tài khoản tạm thời',
    description: 'Khóa X ngày',
    hasDaysInput: true
  },
  {
    value: 'ignore',
    title: 'Bỏ qua báo cáo',
    description: 'Báo cáo không có căn cứ'
  }
]

export const getDefaultNotificationMessage = (action, report) => {
  switch (action) {
    case 'hide':
      return `Bài đăng "${report.subjectTitle}" đã tạm thời bị ẩn để chờ cập nhật lại nội dung theo quy định của hệ thống.`
    case 'delete':
      return `Bài đăng "${report.subjectTitle}" đã bị xóa vĩnh viễn do vi phạm chính sách đăng tin của hệ thống.`
    case 'warn':
      return `Tài khoản của bạn đã bị cảnh cáo do nội dung liên quan đến "${report.reason}". Vui lòng rà soát và tuân thủ quy định đăng tin.`
    case 'lock':
      return `Tài khoản của bạn đã bị khóa tạm thời do nhiều báo cáo vi phạm liên quan đến "${report.reason}".`
    case 'ignore':
    default:
      return `Báo cáo đối với "${report.subjectTitle}" đã được xem xét và hiện chưa ghi nhận căn cứ xử lýเพิ่มเติม.`
  }
}

const createVariant = (seed, index) => ({
  ...seed,
  id: `${seed.id}-${index + 1}`,
  timeAgo: index === 0 ? seed.timeAgo : `${(index % 6) + 1} ngày trước`,
  createdAtLabel: seed.createdAtLabel,
  lastReporter: {
    ...seed.lastReporter,
    name: `${seed.lastReporter.name}${index > 7 ? index : ''}`
  }
})

export const VIOLATION_REPORTS = Array.from({ length: 38 }, (_, index) => {
  const seed = REPORT_SEED[index % REPORT_SEED.length]
  return createVariant(seed, index)
})
