/**
 * WelcomeBanner — Block 1
 * Gradient banner với lời chào, thông báo hóa đơn và nút thanh toán
 */
const WalletIllustration = () => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect
      x="8"
      y="22"
      width="72"
      height="50"
      rx="10"
      stroke="white"
      strokeWidth="3"
      strokeOpacity="0.18"
      fill="white"
      fillOpacity="0.07"
    />
    <rect x="8" y="34" width="72" height="12" fill="white" fillOpacity="0.12" />
    <rect x="56" y="50" width="16" height="10" rx="5" fill="white" fillOpacity="0.25" />
    <circle cx="22" cy="40" r="4" fill="white" fillOpacity="0.22" />
    <rect x="8" y="14" width="52" height="10" rx="5" fill="white" fillOpacity="0.1" />
  </svg>
)

const WelcomeBanner = ({ name = 'Kiều Kiến Quốc', message, onPayNow }) => {
  return (
    <div
      style={{
        width: '100%',
        borderRadius: 12,
        background: 'linear-gradient(90deg, #20a9e7 0%, #2b7ed7 100%)',
        padding: '24px 28px',
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Text side */}
      <div style={{ zIndex: 1 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 500,
            color: '#ffffff',
            lineHeight: 1.3
          }}>
          Xin chào, {name}
        </h1>
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 420,
            lineHeight: 1.5
          }}>
          {message || 'Hóa đơn tháng 6 đã đến hạn. Vui lòng thanh toán trước ngày 10/06.'}
        </p>
        <button
          onClick={onPayNow}
          style={{
            marginTop: 14,
            background: '#ffffff',
            color: '#20a9e7',
            fontWeight: 500,
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity 0.18s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
          Thanh toán ngay
        </button>
      </div>

      {/* Decorative illustration */}
      <div
        style={{
          position: 'absolute',
          right: 28,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.18,
          pointerEvents: 'none',
          zIndex: 0
        }}>
        <WalletIllustration />
      </div>
    </div>
  )
}

export default WelcomeBanner
