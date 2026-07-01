/**
 * StatCards — Block 2
 * 4 thẻ thống kê nhanh: Trạng thái phòng, Hóa đơn, Hợp đồng, Bài đăng
 */

/* Icons SVG inline */
const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20a9e7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 22V12h6v10M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/>
  </svg>
)

const ReceiptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l3-3 3 3 3-3 3 3V4a2 2 0 0 0-2-2z"/>
    <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/>
  </svg>
)

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20a9e7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)

const NewsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18l-4-2-4 2-4-2-4 2z"/>
    <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>
  </svg>
)

const cardBase = {
  background: '#ffffff',
  border: '0.5px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  flex: 1,
  minWidth: 0,
  position: 'relative'
}

const labelStyle = {
  fontSize: 11,
  color: '#6b7280',
  marginBottom: 4,
  display: 'block'
}

const valueStyle = {
  fontSize: 20,
  fontWeight: 500,
  color: '#1a1a1a',
  lineHeight: 1.2
}

const bottomTextStyle = {
  fontSize: 11,
  color: '#6b7280',
  marginTop: 6,
  display: 'block'
}

const StatCards = ({ data = {} }) => {
  const {
    roomStatus = 'Đang thuê',
    roomCode = 'PHÒNG 302',
    roomAddress = '123 Đường Lê Lợi, Quận 1',
    invoiceAmount = '1.250.000',
    invoiceStatus = 'Chưa đóng',
    invoiceDue = 'Đến hạn 12/2026',
    contractMonths = '4 tháng',
    contractExpiry = 'Hết hạn 12/2026',
    postCount = '2 bài',
    postActive = '1 đang hiển thị',
    postPending = '1 đang chờ duyệt'
  } = data

  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>

      {/* Card 1 — Trạng thái phòng */}
      <div style={cardBase}>
        <div style={{ position: 'absolute', top: 14, right: 14 }}><BuildingIcon /></div>
        <span style={labelStyle}>Trạng thái phòng</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a' }}>{roomStatus}</span>
          <span
            style={{
              background: '#EAF3DE',
              color: '#27500A',
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {roomCode}
          </span>
        </div>
        <span style={bottomTextStyle}>{roomAddress}</span>
      </div>

      {/* Card 2 — Hóa đơn tháng này */}
      <div style={cardBase}>
        <div style={{ position: 'absolute', top: 14, right: 14 }}><ReceiptIcon /></div>
        <span style={labelStyle}>Hóa đơn tháng này</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={valueStyle}>{invoiceAmount}</span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>đ</span>
          <span
            style={{
              background: '#FAEEDA',
              color: '#BA7517',
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 500,
              marginLeft: 4
            }}
          >
            {invoiceStatus}
          </span>
        </div>
        <span style={bottomTextStyle}>{invoiceDue}</span>
      </div>

      {/* Card 3 — Hợp đồng còn lại */}
      <div style={cardBase}>
        <div style={{ position: 'absolute', top: 14, right: 14 }}><FileTextIcon /></div>
        <span style={labelStyle}>Hợp đồng còn lại</span>
        <span style={valueStyle}>{contractMonths}</span>
        <span style={bottomTextStyle}>{contractExpiry}</span>
      </div>

      {/* Card 4 — Bài đăng của tôi */}
      <div style={cardBase}>
        <div style={{ position: 'absolute', top: 14, right: 14 }}><NewsIcon /></div>
        <span style={labelStyle}>Bài đăng của tôi</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={valueStyle}>{postCount}</span>
          <span style={{ fontSize: 11, color: '#20a9e7' }}>{postActive}</span>
        </div>
        <span style={{ ...bottomTextStyle, color: '#BA7517' }}>{postPending}</span>
      </div>

    </div>
  )
}

export default StatCards
