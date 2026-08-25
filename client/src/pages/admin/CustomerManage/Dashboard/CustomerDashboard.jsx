import { useEffect, useState } from 'react'
import WelcomeBanner from './WelcomeBanner'
import StatCards from './StatCards'
import RoomCard from './RoomCard'
import InvoiceCard from './InvoiceCard'
import ActivityFeed from './ActivityFeed'
import { getTenantDashboard } from '~/apis/tenantAPI'

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const user = JSON.parse(sessionStorage.getItem('user') || 'null')
      const username = user?.username || 'customer'
      const data = await getTenantDashboard(username)
      if (data) {
        setDashboardData(data)
      }
    }
    fetchDashboard()
  }, [])

  const handlePayNow = () => {
    // TODO: navigate to payment page or open modal
  }

  const data = dashboardData || {
    customerName: 'Kiều Kiến Quốc',
    roomStatus: 'Đang thuê',
    roomCode: 'PHÒNG 302',
    roomAddress: '123 Đường Lê Lợi, Quận 1, TP. HCM',
    roomArea: '25 m²',
    roomFloor: 'Tầng 3 (Phòng 302)',
    roomPrice: '4.500.000 đ/tháng',
    hostName: 'Trần Thị B (090xxxx123)',
    invoiceAmount: '5.750.000',
    invoiceStatus: 'Chưa đóng',
    invoiceDue: 'Đến hạn 10/06',
    invoiceMonth: '06/2026',
    isInvoicePaid: false,
    invoiceItems: [
      { label: 'Tiền phòng', amount: '4.500.000 đ' },
      { label: 'Điện (250kWh × 3.5k)', amount: '875.000 đ' },
      { label: 'Nước (4 khối × 25k)', amount: '100.000 đ' },
      { label: 'Internet', amount: '200.000 đ' },
      { label: 'Phí vệ sinh', amount: '75.000 đ' }
    ],
    invoiceTotal: '5.750.000 đ',
    contractMonths: '4 tháng',
    contractExpiry: 'Hết hạn 12/2026',
    myPosts: undefined
  }

  const welcomeMessage = data.isInvoicePaid
    ? 'Hóa đơn tháng này đã được thanh toán đầy đủ. Cảm ơn bạn!'
    : `Hóa đơn tháng ${data.invoiceMonth || ''} đã đến hạn. Vui lòng thanh toán trước ngày ${data.invoiceDue?.replace('Đến hạn ', '') || ''}.`

  return (
    <div style={{ padding: 20, background: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Welcome Banner (Ẩn khi đã thanh toán) */}
      {!data.isInvoicePaid && data.invoiceStatus !== 'Đã thanh toán' && (
        <WelcomeBanner
          name={data.customerName || 'Kiều Kiến Quốc'}
          message={`Hóa đơn tháng ${data.invoiceMonth || ''} đã đến hạn. Vui lòng thanh toán trước ngày ${data.invoiceDue?.replace('Đến hạn ', '') || ''}.`}
          onPayNow={handlePayNow}
        />
      )}

      {/* Block 2 — Stat Cards */}
      <StatCards
        data={{
          roomStatus: data.roomStatus,
          roomCode: data.roomCode,
          roomAddress: data.roomAddress,
          invoiceAmount: data.invoiceAmount,
          invoiceStatus: data.invoiceStatus,
          invoiceDue: data.invoiceDue,
          contractMonths: data.contractMonths,
          contractExpiry: data.contractExpiry,
          myPosts: data.myPosts
        }}
      />

      {/* Block 3 — Two column row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <RoomCard
          room={{
            address: data.roomAddress,
            area: data.roomArea,
            floor: data.roomFloor,
            price: data.roomPrice,
            hostName: data.hostName
          }}
        />
        <InvoiceCard
          invoice={{
            month: data.invoiceMonth,
            items: data.invoiceItems || [],
            total: data.invoiceTotal,
            isPaid: data.isInvoicePaid,
            invoiceStatus: data.invoiceStatus
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

