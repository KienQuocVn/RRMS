/**
 * InvoiceCard — Block 3 Right (45%)
 * Chi tiết hóa đơn tháng hiện tại: danh sách khoản, tổng cộng, nút thanh toán
 */

const lineItems = [
  { label: 'Tiền phòng', amount: '4.500.000 đ' },
  { label: 'Điện (250kWh × 3.5k)', amount: '875.000 đ' },
  { label: 'Nước (4 khối × 25k)', amount: '100.000 đ' },
  { label: 'Internet', amount: '200.000 đ' },
  { label: 'Phí vệ sinh', amount: '75.000 đ' }
]

const InvoiceCard = ({ invoice = {}, onPay }) => {
  const {
    month = '06/2026',
    items = lineItems,
    total = '5.750.000 đ'
  } = invoice

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
        {items.map((item, idx) => (
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
        ))}
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
        <span style={{ fontSize: 18, fontWeight: 500, color: '#20a9e7' }}>{total}</span>
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
