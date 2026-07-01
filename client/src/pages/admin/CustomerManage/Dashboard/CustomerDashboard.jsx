/**
 * CustomerDashboard — Trang Tổng quan (Dashboard Overview)
 * Gồm 4 blocks: WelcomeBanner, StatCards, RoomCard + InvoiceCard, ActivityFeed
 */
import WelcomeBanner from './WelcomeBanner'
import StatCards from './StatCards'
import RoomCard from './RoomCard'
import InvoiceCard from './InvoiceCard'
import ActivityFeed from './ActivityFeed'

const CustomerDashboard = () => {
  const handlePayNow = () => {
    // TODO: navigate to payment page or open modal
  }

  return (
    <div style={{ padding: 20, background: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Welcome Banner */}
      <WelcomeBanner
        name="Kiều Kiến Quốc"
        message="Hóa đơn tháng 6 đã đến hạn. Vui lòng thanh toán trước ngày 10/06."
        onPayNow={handlePayNow}
      />

      {/* Block 2 — Stat Cards */}
      <StatCards
        data={{
          roomStatus: 'Đang thuê',
          roomCode: 'PHÒNG 302',
          roomAddress: '123 Đường Lê Lợi, Quận 1',
          invoiceAmount: '1.250.000',
          invoiceStatus: 'Chưa đóng',
          invoiceDue: 'Đến hạn 12/2026',
          contractMonths: '4 tháng',
          contractExpiry: 'Hết hạn 12/2026',
          postCount: '2 bài',
          postActive: '1 đang hiển thị',
          postPending: '1 đang chờ duyệt'
        }}
      />

      {/* Block 3 — Two column row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <RoomCard
          room={{
            address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
            area: '25 m²',
            floor: 'Tầng 3 (Phòng 302)',
            price: '4.500.000 đ/tháng',
            hostName: 'Trần Thị B (090xxxx123)'
          }}
        />
        <InvoiceCard
          invoice={{
            month: '06/2026',
            items: [
              { label: 'Tiền phòng', amount: '4.500.000 đ' },
              { label: 'Điện (250kWh × 3.5k)', amount: '875.000 đ' },
              { label: 'Nước (4 khối × 25k)', amount: '100.000 đ' },
              { label: 'Internet', amount: '200.000 đ' },
              { label: 'Phí vệ sinh', amount: '75.000 đ' }
            ],
            total: '5.750.000 đ'
          }}
          onPay={handlePayNow}
        />
      </div>

      {/* Block 4 — Activity Feed */}
      <ActivityFeed />
    </div>
  )
}

export default CustomerDashboard
