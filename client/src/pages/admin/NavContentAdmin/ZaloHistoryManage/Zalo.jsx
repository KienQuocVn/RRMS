import { useEffect, useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import YearMonthFilter from '../YearMonthFilter'
import { extractEntityId } from '~/utils/apiAdapters'
import AddExpenseModal from './components/AddExpenseModal'
import AddReceiptModal from './components/AddReceiptModal'
import ZaloHistoryDetailModal from './components/ZaloHistoryDetailModal'
import ZaloHistoryFilters from './components/ZaloHistoryFilters'
import ZaloHistoryHeader from './components/ZaloHistoryHeader'
import ZaloHistoryTable from './components/ZaloHistoryTable'

const today = new Date()
const defaultMonth = today.getMonth() + 1
const defaultYear = today.getFullYear()

const buildMockHistory = (month, year) => [
  {
    id: 'zh-01',
    roomName: 'quoc',
    phone: '0829-280-927',
    description: 'Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    detail: '(Mã lỗi -118) - Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    month,
    year,
    sentAt: `00:03 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'error',
    paymentDate: 'Không tính phí',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-02',
    roomName: 'quoc',
    phone: '0',
    description: 'Gửi hóa đơn thành công',
    detail: '',
    month,
    year,
    sentAt: `00:03 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'success',
    paymentDate: 'Chưa thanh toán',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-03',
    roomName: 'THU',
    phone: '0829-280-922',
    description: 'Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    detail: '(Mã lỗi -118) - Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    month,
    year,
    sentAt: `00:03 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'error',
    paymentDate: 'Không tính phí',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-04',
    roomName: 'THU',
    phone: '0',
    description: 'Gửi hóa đơn thành công',
    detail: '',
    month,
    year,
    sentAt: `00:03 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'success',
    paymentDate: 'Chưa thanh toán',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-05',
    roomName: 'A02',
    phone: '0829-280-927',
    description: 'Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    detail: '(Mã lỗi -118) - Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    month,
    year,
    sentAt: `00:02 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'error',
    paymentDate: 'Không tính phí',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-06',
    roomName: 'A02',
    phone: '0',
    description: 'Gửi hóa đơn thành công',
    detail: '',
    month,
    year,
    sentAt: `00:02 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'success',
    paymentDate: 'Chưa thanh toán',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-07',
    roomName: 'B05',
    phone: '0829-280-931',
    description: 'Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    detail: '(Mã lỗi -118) - Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá',
    month,
    year,
    sentAt: `00:01 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'error',
    paymentDate: 'Không tính phí',
    billingType: 'Miễn phí'
  },
  {
    id: 'zh-08',
    roomName: 'B05',
    phone: '0',
    description: 'Gửi hóa đơn thành công',
    detail: '',
    month,
    year,
    sentAt: `00:01 - 10/${String(month).padStart(2, '0')}/${year}`,
    status: 'success',
    paymentDate: 'Chưa thanh toán',
    billingType: 'Miễn phí'
  }
]

const ZaloHistory = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)
  const [selectedYear, setSelectedYear] = useState(defaultYear)
  const [selectedRoom, setSelectedRoom] = useState('all')
  const [showSuccess, setShowSuccess] = useState(true)
  const [showError, setShowError] = useState(true)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)

  const historyRows = useMemo(() => buildMockHistory(selectedMonth, selectedYear), [selectedMonth, selectedYear])

  const currentMotel = Array.isArray(motels)
    ? motels.find((motel) => extractEntityId(motel, ['motelId', 'id']) === motelId)
    : null

  useEffect(() => {
    setIsAdmin(true)
  }, [setIsAdmin])

  const periodRows = historyRows

  const roomOptions = useMemo(() => {
    return Array.from(new Set(periodRows.map((row) => row.roomName)))
  }, [periodRows])

  const visibleRows = useMemo(() => {
    return periodRows.filter((row) => {
      if (selectedRoom !== 'all' && row.roomName !== selectedRoom) return false
      if (!showSuccess && row.status === 'success') return false
      if (!showError && row.status === 'error') return false
      return true
    })
  }, [periodRows, selectedRoom, showSuccess, showError])

  const successCount = periodRows.filter((row) => row.status === 'success').length
  const errorCount = periodRows.filter((row) => row.status === 'error').length

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month)
    setSelectedYear(year)
    setSelectedRoom('all')
  }

  const handleOpenDetails = (row) => {
    setSelectedHistory(row)
    setDetailModalOpen(true)
  }

  const handleOpenReceipt = (row = null) => {
    if (row) setSelectedHistory(row)
    setDetailModalOpen(false)
    setReceiptModalOpen(true)
  }

  const handleOpenExpense = (row = null) => {
    if (row) setSelectedHistory(row)
    setDetailModalOpen(false)
    setExpenseModalOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailModalOpen(false)
    setSelectedHistory(null)
  }

  const handleResetFilters = () => {
    setSelectedRoom('all')
    setShowSuccess(true)
    setShowError(true)
  }

  const handleTransactionSubmit = (event, transactionType) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const amount = formData.get('amount')
    const roomName = formData.get('roomName')

    if (!amount || !roomName) return

    const transactionLabel = transactionType === 'receipt' ? 'phiếu thu' : 'phiếu chi'

    setReceiptModalOpen(false)
    setExpenseModalOpen(false)

    Swal.fire({
      icon: 'success',
      title: `Đã tạo ${transactionLabel}`,
      text: `Giao diện modal ${transactionLabel} đã được tách riêng và sẵn sàng nối vào luồng backend hiện có.`
    })
  }

  const handleSendTest = () => {
    Swal.fire({
      icon: 'info',
      title: 'Gửi thử hóa đơn qua ZALO',
      text: 'Nút hành động đã sẵn sàng ở giao diện mới. Bạn có thể nối vào API gửi thử hiện có mà không cần đổi lại layout.'
    })
  }

  return (
    <Box sx={{ backgroundColor: '#e4eef5', minHeight: '100vh' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      <Box
        sx={{
          backgroundColor: '#fff',
          p: { xs: 1.5, md: 2 },
          borderRadius: 3,
          m: '0 10px 10px 10px'
        }}>
        <Stack spacing={2}>
          <YearMonthFilter onMonthChange={handleMonthChange} />

          <ZaloHistoryHeader
            motelName={currentMotel?.motelName}
            roomOptions={roomOptions}
            selectedRoom={selectedRoom}
            onSelectedRoomChange={setSelectedRoom}
          />

          <ZaloHistoryFilters
            totalCount={periodRows.length}
            successCount={successCount}
            errorCount={errorCount}
            showSuccess={showSuccess}
            showError={showError}
            onToggleSuccess={() => setShowSuccess((prev) => !prev)}
            onToggleError={() => setShowError((prev) => !prev)}
            onResetFilters={handleResetFilters}
            onSendTest={handleSendTest}
            settingsLink={`/quanlytro/${motelId}/cai-dat-nha-tro#bill_setting`}
          />

          <ZaloHistoryTable
            rows={visibleRows}
            onOpenDetails={handleOpenDetails}
            onOpenReceipt={handleOpenReceipt}
            onOpenExpense={handleOpenExpense}
          />
        </Stack>
      </Box>

      <ZaloHistoryDetailModal
        open={detailModalOpen}
        historyItem={selectedHistory}
        onClose={handleCloseDetails}
        onOpenReceipt={handleOpenReceipt}
        onOpenExpense={handleOpenExpense}
      />

      <AddReceiptModal
        open={receiptModalOpen}
        historyItem={selectedHistory}
        onClose={() => setReceiptModalOpen(false)}
        onSubmit={(event) => handleTransactionSubmit(event, 'receipt')}
      />

      <AddExpenseModal
        open={expenseModalOpen}
        historyItem={selectedHistory}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={(event) => handleTransactionSubmit(event, 'expense')}
      />
    </Box>
  )
}

export default ZaloHistory
