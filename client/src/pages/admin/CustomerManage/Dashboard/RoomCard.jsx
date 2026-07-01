/**
 * RoomCard — Block 3 Left (55%)
 * Thông tin phòng đang thuê: ảnh + info grid + chủ trọ
 */
import { Link } from 'react-router-dom'

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const RoomCard = ({ room = {} }) => {
  const {
    imageUrl,
    address = '123 Đường Lê Lợi, Quận 1, TP. HCM',
    area = '25 m²',
    floor = 'Tầng 3 (Phòng 302)',
    price = '4.500.000 đ/tháng',
    hostName = 'Trần Thị B (090xxxx123)'
  } = room

  const infoItems = [
    { label: 'ĐỊA CHỈ', value: address },
    { label: 'DIỆN TÍCH', value: area },
    { label: 'TẦNG', value: floor },
    { label: 'GIÁ THUÊ', value: price, isPrice: true }
  ]

  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        flex: '0 0 55%',
        minWidth: 0
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Phòng của tôi</h2>
        <Link
          to="/customerManage/thong-tin-phong"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: '#20a9e7',
            textDecoration: 'none',
            transition: 'color 0.15s'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#2b7ed7')}
          onMouseLeave={e => (e.currentTarget.style.color = '#20a9e7')}
        >
          Xem chi tiết <ArrowRightIcon />
        </Link>
      </div>

      {/* Content Row */}
      <div style={{ display: 'flex', gap: 14 }}>
        {/* Thumbnail */}
        <div
          style={{
            width: 110,
            height: 80,
            borderRadius: 8,
            flexShrink: 0,
            overflow: 'hidden',
            background: '#e5e7eb'
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Ảnh phòng" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f0f2f5'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            {infoItems.map(({ label, value, isPrice }) => (
              <div key={label}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 10,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: isPrice ? '#20a9e7' : '#1a1a1a',
                    fontWeight: isPrice ? 500 : 400,
                    wordBreak: 'break-word'
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Chủ trọ */}
          <div style={{ marginTop: 10 }}>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 4
              }}
            >
              CHỦ TRỌ
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#20a9e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, color: '#1a1a1a' }}>{hostName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
