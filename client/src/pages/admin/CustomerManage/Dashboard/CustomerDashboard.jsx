/**
 * CustomerDashboard — Trang Tổng quan (Dashboard Overview)
 * Fetch data thực từ API. Hiển thị thông báo lỗi khi không tải được, không dùng hardcode.
 */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import WelcomeBanner from './WelcomeBanner'
import StatCards from './StatCards'
import RoomCard from './RoomCard'
import InvoiceCard from './InvoiceCard'
import ActivityFeed from './ActivityFeed'
import { getBulletinBoardTable } from '~/apis/bulletinBoardAPI'
import { fetchInvoices } from '~/apis/invoiceAPI'
import { useMotel } from '~/hooks/useMotel'

/* ── Skeleton / Error helpers ── */
const LoadingBox = ({ height = 80 }) => (
  <div
    style={{
      height,
      borderRadius: 12,
      background: 'linear-gradient(90deg,#f0f2f5 25%,#e8eaed 50%,#f0f2f5 75%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.4s infinite',
      marginTop: 16
    }}
  />
)

const ErrorAlert = ({ message }) => (
  <div
    style={{
      background: '#fff7ed',
      border: '0.5px solid #fed7aa',
      borderRadius: 10,
      padding: '12px 16px',
      marginTop: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span style={{ fontSize: 13, color: '#7c2d12' }}>{message}</span>
  </div>
)

/* ── Utility ── */
const formatCurrency = (number) => {
  if (number == null) return '—'
  return Number(number).toLocaleString('vi-VN')
}

const getCurrentYearMonth = () => {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/* ── Component chính ── */
const CustomerDashboard = () => {
  const navigate = useNavigate()
  const { motels } = useMotel()

  // Lấy user từ session
  const [user] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('user') || 'null') } catch { return null }
  })

  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const username = user?.username
      if (!username) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.')
        setLoading(false)
        return
      }

      // Chạy song song: bài đăng + hóa đơn (nếu có motelId)
      const rental = motels?.[0] ?? null
      const motelId = rental?.motelId ?? rental?.contract?.room?.motelId ?? null
      const room = rental?.room ?? rental?.contract?.room ?? null

      const [postsRes, invoicesRes] = await Promise.allSettled([
        getBulletinBoardTable(username),
        motelId ? fetchInvoices(motelId, { page: 0, size: 100, sortBy: 'invoiceCreateDate', sortDirection: 'DESC' }) : Promise.resolve(null)
      ])

      // Bài đăng
      let posts = []
      if (postsRes.status === 'fulfilled') {
        const raw = postsRes.value
        posts = Array.isArray(raw?.result) ? raw.result : Array.isArray(raw) ? raw : []
      }

      // Hóa đơn gần nhất
      let latestInvoice = null
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value) {
        const items = invoicesRes.value?.result?.items ?? invoicesRes.value?.items ?? invoicesRes.value?.result ?? []
        const tenantInvoices = items.filter((invoice) => (invoice?.roomId ?? invoice?.room?.roomId) === room?.roomId)
        if (tenantInvoices.length > 0) latestInvoice = tenantInvoices[0]
      }

      setDashData({ posts, latestInvoice, motelId })
    } catch (err) {
      console.error('CustomerDashboard fetch error:', err)
      setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }, [user, motels])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handlePayNow = () => {
    navigate('/customerManage/hoa-don')
  }

  /* ── Tên hiển thị ── */
  const displayName = user?.displayName || user?.username || 'Bạn'

  /* ── Stat cards data ── */
  const buildStatData = () => {
    if (!dashData) return {}

    const { posts, latestInvoice } = dashData
    const activePost = posts.filter(p => p.status === 'ACTIVE' || p.active === true)
    const pendingPost = posts.filter(p => p.status === 'PENDING' || p.status === 'INACTIVE')

    // Hóa đơn
    const invoiceAmount = latestInvoice ? formatCurrency(latestInvoice.totalAmount ?? latestInvoice.amount) : null
    const invoiceStatus = (latestInvoice?.paymentStatus ?? latestInvoice?.status) === 'PAID' ? 'Đã đóng' : latestInvoice ? 'Chưa đóng' : null
    const invoiceDue = latestInvoice?.dueDate
      ? `Đến hạn ${new Date(latestInvoice.dueDate).toLocaleDateString('vi-VN')}`
      : latestInvoice ? `Tháng ${getCurrentYearMonth()}` : null

    // Hợp đồng từ motel đầu tiên
    const contract = motels?.[0]?.contract
    const contractEndDate = contract?.closeContract ?? contract?.reportCloseContract ?? contract?.contractEndDate
    const contractMonths = contractEndDate
      ? `${Math.max(0, Math.ceil((new Date(contractEndDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)))} tháng`
      : null
    const contractExpiry = contractEndDate
      ? `Hết hạn ${new Date(contractEndDate).toLocaleDateString('vi-VN')}`
      : null

    // Phòng
    const rental = motels?.[0]
    const room = rental?.room ?? rental?.contract?.room
    const roomStatus = room?.status === 'OCCUPIED' ? 'Đang thuê' : room?.status ?? null
    const roomCode = room?.roomName ?? room?.roomCode ?? room?.name ?? null
    const roomAddress = rental?.address ?? room?.address ?? null

    return {
      roomStatus, roomCode, roomAddress,
      invoiceAmount, invoiceStatus, invoiceDue,
      contractMonths, contractExpiry,
      postCount: posts.length > 0 ? `${posts.length} bài` : null,
      postActive: activePost.length > 0 ? `${activePost.length} đang hiển thị` : null,
      postPending: pendingPost.length > 0 ? `${pendingPost.length} đang chờ duyệt` : null
    }
  }

  /* ── Room props ── */
  const buildRoomData = () => {
    const rental = motels?.[0]
    const room = rental?.room ?? rental?.contract?.room
    if (!room) return null
    return {
      imageUrl: room.imageUrl ?? room.thumbnail ?? null,
      address: room.address ?? rental.address ?? null,
      area: room.area != null ? `${room.area} m²` : null,
      floor: room.floor ?? room.group ?? null,
      price: room.price != null ? `${formatCurrency(room.price)} đ/tháng` : null,
      hostName: room.ownerName ?? room.hostName ?? rental.ownerName ?? null
    }
  }

  /* ── Invoice props ── */
  const buildInvoiceData = () => {
    const inv = dashData?.latestInvoice
    if (!inv) return null
    const items = []
    if (inv.roomFee != null) items.push({ label: 'Tiền phòng', amount: `${formatCurrency(inv.roomFee)} đ` })
    if (inv.electricityFee != null) items.push({ label: 'Tiền điện', amount: `${formatCurrency(inv.electricityFee)} đ` })
    if (inv.waterFee != null) items.push({ label: 'Tiền nước', amount: `${formatCurrency(inv.waterFee)} đ` })
    if (inv.internetFee != null) items.push({ label: 'Internet', amount: `${formatCurrency(inv.internetFee)} đ` })
    if (inv.garbageFee != null) items.push({ label: 'Phí vệ sinh', amount: `${formatCurrency(inv.garbageFee)} đ` })

    // Nếu server trả items dạng mảng
    const rawItems = inv.items ?? inv.invoiceDetails ?? []
    const lineItems = items.length > 0 ? items
      : rawItems.map(i => ({ label: i.label ?? i.name ?? i.serviceName, amount: `${formatCurrency(i.amount ?? i.value)} đ` }))

    return {
      month: inv.invoiceCreateMonth ?? inv.invoiceMonth ?? inv.month ?? getCurrentYearMonth(),
      items: lineItems,
      total: `${formatCurrency(inv.totalAmount ?? inv.amount)} đ`
    }
  }

  return (
    <div style={{ padding: 20, background: '#f5f7fa', minHeight: '100%' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* Block 1 — Welcome Banner */}
      <WelcomeBanner
        name={displayName}
        message={
          dashData?.latestInvoice && dashData.latestInvoice.status !== 'PAID'
            ? `Bạn có hóa đơn tháng ${dashData.latestInvoice.invoiceMonth ?? getCurrentYearMonth()} chưa thanh toán.`
            : 'Chào mừng bạn đến với trang quản lý thông tin người thuê.'
        }
        onPayNow={handlePayNow}
      />

      {/* Loading state */}
      {loading && (
        <>
          <LoadingBox height={90} />
          <LoadingBox height={130} />
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <LoadingBox height={160} />
            <LoadingBox height={160} />
          </div>
        </>
      )}

      {/* Error state */}
      {!loading && error && <ErrorAlert message={error} />}

      {/* Data loaded */}
      {!loading && !error && dashData && (
        <>
          {/* Block 2 — Stat Cards */}
          <StatCards data={buildStatData()} />

          {/* Block 3 — Two column row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            <RoomCard room={buildRoomData()} />
            <InvoiceCard invoice={buildInvoiceData()} onPay={handlePayNow} />
          </div>

          {/* Block 4 — Activity Feed */}
          <ActivityFeed items={[]} />
        </>
      )}
    </div>
  )
}

export default CustomerDashboard
