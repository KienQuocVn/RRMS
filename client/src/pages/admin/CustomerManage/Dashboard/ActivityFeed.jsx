/**
 * ActivityFeed — Block 4
 * Danh sách thông báo & hoạt động gần đây, 5 items
 */
import { Link } from 'react-router-dom'

/* Icon circles */
const BellFeedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#20a9e7">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const ToolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)

const FileTextFeedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const DEFAULT_FEED = [
  {
    id: 1,
    iconBg: '#E6F1FB',
    icon: <BellFeedIcon />,
    title: 'Thông báo hóa đơn tháng 6',
    sub: 'Hệ thống đã tự động tạo hóa đơn đến hạn tháng này của bạn.',
    time: '2 giờ trước'
  },
  {
    id: 2,
    iconBg: '#EAF3DE',
    icon: <CheckCircleIcon />,
    title: 'Thanh toán thành công',
    sub: 'Giao dịch 2.000.000 đ phí đặt cọc đã đang được xác nhận.',
    time: '1 ngày trước'
  },
  {
    id: 3,
    iconBg: '#FAEEDA',
    icon: <ToolIcon />,
    title: 'Yêu cầu bảo trì đang xử lý',
    sub: "Chủ trọ đã tiếp nhận yêu cầu sửa 'Sàn vỡ phòng tắm' của bạn.",
    time: '2 ngày trước'
  },
  {
    id: 4,
    iconBg: '#F1EFE8',
    icon: <FileTextFeedIcon />,
    title: 'Cập nhật hợp đồng',
    sub: 'Bản phụ lục hợp đồng mới đã được tải lên lưu mục tài liệu.',
    time: '3 ngày trước'
  },
  {
    id: 5,
    iconBg: '#F1EFE8',
    icon: <SettingsIcon />,
    title: 'Hệ thống bảo trì',
    sub: 'Cổng thanh toán sẽ bảo trì vào lúc 02:00 sáng mai.',
    time: '5 ngày trước'
  }
]

const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const ActivityFeed = ({ items = DEFAULT_FEED }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginTop: 16
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
          Thông báo &amp; hoạt động
        </h2>
        <Link
          to="/customerManage/thong-bao"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: '#20a9e7',
            textDecoration: 'none'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#2b7ed7')}
          onMouseLeave={e => (e.currentTarget.style.color = '#20a9e7')}
        >
          Tất cả <ArrowRight />
        </Link>
      </div>

      {/* Feed list */}
      <div>
        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '10px 0',
              borderBottom: idx < items.length - 1 ? '0.5px solid #f5f5f5' : 'none'
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: item.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, margin: '0 12px', minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4 }}>
                {item.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
                {item.sub}
              </p>
            </div>

            {/* Time */}
            <span
              style={{
                fontSize: 11,
                color: '#9ca3af',
                whiteSpace: 'nowrap',
                alignSelf: 'center',
                flexShrink: 0
              }}
            >
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed
