/**
 * InvoiceCard — Block 3 Right (45%)
 * Chi tiết hóa đơn tháng hiện tại: danh sách khoản, tổng cộng, nút thanh toán.
 * Không dùng hardcode data. Hiển thị empty state khi không có dữ liệu.
 */

const InvoiceCard = ({ invoice, onPay }) => {
  if (!invoice) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '0.5px solid #e5e7eb',
          borderRadius: 12,
          padding: 16,
          flex: '0 0 calc(45% - 16px)',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: 120
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
        </svg>
        <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>Chưa có hóa đơn tháng này</p>
      </div>
    )
  }

  const { month, items = [], total } = invoice

  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        flex: '0 0 calc(45% - 16px)',
        minWidth: 0
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
          Hóa đơn tháng {month}
        </h2>
      </div>

      {/* Line items */}
      <div>
        {items.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
            Chưa có chi tiết hóa đơn
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 0',
                borderBottom: '0.5px solid #f5f5f5',
                fontSize: 13
              }}
            >
              <span style={{ color: '#374151' }}>{item.label}</span>
              <span style={{ color: '#1a1a1a', fontWeight: 400 }}>{item.amount}</span>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '0.5px', background: '#e5e7eb', margin: '10px 0 8px' }} />

      {/* Total row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
        >
          TỔNG CỘNG
        </span>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#20a9e7' }}>{total ?? '—'}</span>
      </div>

      {/* Pay button */}
      <button
        onClick={onPay}
        style={{
          display: 'block',
          width: '100%',
          height: 38,
          background: '#20a9e7',
          color: '#ffffff',
          fontWeight: 500,
          borderRadius: 8,
          fontSize: 13,
          border: 'none',
          cursor: 'pointer',
          marginTop: 12,
          fontFamily: 'inherit',
          transition: 'background 0.18s'
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#2b7ed7')}
        onMouseLeave={e => (e.currentTarget.style.background = '#20a9e7')}
      >
        Thanh toán
      </button>
    </div>
  )
}

export default InvoiceCard
