/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, Stack } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { useParams } from 'react-router-dom'
import { env } from '~/configs/environment'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import YearMonthFilter from '../YearMonthFilter'
import { extractEntityId, unwrapApiResult, unwrapPageItems } from '~/utils/apiAdapters'
import AddExpenseModal from './components/AddExpenseModal'
import AddReceiptModal from './components/AddReceiptModal'
import IncomeSummaryFilters from './components/IncomeSummaryFilters'
import IncomeSummaryHeader from './components/IncomeSummaryHeader'
import IncomeSummaryStats from './components/IncomeSummaryStats'
import IncomeSummaryTable from './components/IncomeSummaryTable'
import TransactionDetailModal from './components/TransactionDetailModal'

const DEFAULT_SUMMARY = {
  totalIncome: 0,
  totalExpense: 0,
  profit: 0
}

const PAYMENT_LOAD_WARNING = 'Không thể tải danh sách phương thức thanh toán. Bạn vẫn có thể xem báo cáo, nhưng thao tác thêm phiếu có thể bị hạn chế.'

const DEFAULT_CATEGORY_OPTIONS = [
  'Thu tiền phòng',
  'Thu tiền cọc',
  'Thu tiền dịch vụ',
  'Thu nợ',
  'Thu cộng thêm hóa đơn',
  'Thu tiền phòng',
  'Thu tiền hàng tháng',
  'Thu tiền tháng đầu tiên',
  'Thu tiền kết thúc hợp đồng',
  'Thu tiền theo chu kỳ',
  'Thu cọc giữ chỗ',
  'Chi phí quản lý',
  'Chi hoàn tiền cọc',
  'Chi trả tiền điện',
  'Chi trả tiền nước',
  'Chi trả tiền wifi',
  'Chi trả tiền cáp TV',
  'Chi Cho vay',
  'Chi Trả nợ',
  'Chi giảm trừ hóa đơn',
  'Chi hoàn trả tiền kết thúc hợp đồng',
  'Chi hoàn cọc giữ chỗ',
  'Chi hoa hồng môi giới',
  'Chi tiền thuê nhà'
]

const getSafeArray = (payload, fallback = []) => {
  if (Array.isArray(payload)) return payload
  return fallback
}

const parseApiArray = (response) => {
  const pageItems = unwrapPageItems(response)
  if (Array.isArray(pageItems) && pageItems.length > 0) return pageItems

  const unwrapped = unwrapApiResult(response, response?.data)
  if (Array.isArray(unwrapped)) return unwrapped
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.items)) return response.data.items

  return []
}

const parseSummary = (response) => {
  const payload = unwrapApiResult(response, response?.data)

  if (!payload || typeof payload !== 'object') {
    return DEFAULT_SUMMARY
  }

  return {
    totalIncome: Number(payload.totalIncome || 0),
    totalExpense: Number(payload.totalExpense || 0),
    profit: Number(payload.profit || 0)
  }
}

const getTransactionPaymentName = (transaction) => {
  return transaction?.payment?.paymentName || transaction?.paymentName || ''
}

const getTransactionDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const normalizeText = (value) => {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const buildCategoryOptions = (categories = []) => {
  const normalizedCategoryMap = new Map()

  categories.filter(Boolean).forEach((category) => {
    normalizedCategoryMap.set(normalizeText(category), category)
  })

  const mergedCategories = []
  const seenCategories = new Set()

  DEFAULT_CATEGORY_OPTIONS.forEach((category) => {
    const resolvedCategory = normalizedCategoryMap.get(normalizeText(category)) || category
    const normalizedCategory = normalizeText(resolvedCategory)

    if (!seenCategories.has(normalizedCategory)) {
      seenCategories.add(normalizedCategory)
      mergedCategories.push(resolvedCategory)
    }
  })

  categories.filter(Boolean).forEach((category) => {
    const normalizedCategory = normalizeText(category)

    if (!seenCategories.has(normalizedCategory)) {
      seenCategories.add(normalizedCategory)
      mergedCategories.push(category)
    }
  })

  return mergedCategories
}

const IncomeSummary = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)

  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [showReceipts, setShowReceipts] = useState(true)
  const [showExpenses, setShowExpenses] = useState(true)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([])
  const [includedCategories, setIncludedCategories] = useState([])
  const [excludedCategories, setExcludedCategories] = useState([])
  const [reportScope, setReportScope] = useState('month')
  const [reportView, setReportView] = useState('detail')

  const userData = JSON.parse(sessionStorage.getItem('user'))
  const token = userData?.token
  const username = userData?.username

  const currentMotel = Array.isArray(motels)
    ? motels.find((motel) => extractEntityId(motel, ['motelId', 'id']) === motelId)
    : null

  useEffect(() => {
    setIsAdmin(true)
    fetchData()
  }, [setIsAdmin])

  const fetchData = async () => {
    if (!token || !username) {
      setTransactions([])
      setPayments([])
      setSummary(DEFAULT_SUMMARY)
      setLoading(false)
      setError('Không tìm thấy thông tin đăng nhập để tải dữ liệu thu chi.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [transactionsResult, paymentsResult, summaryResult] = await Promise.allSettled([
        axios.get(`${env.API_URL}/api/v1/transactions/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${env.API_URL}/api/v1/payment/list_payment`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${env.API_URL}/api/v1/transactions/summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { username }
        })
      ])

      if (transactionsResult.status === 'rejected') {
        throw transactionsResult.reason
      }

      if (summaryResult.status === 'rejected') {
        throw summaryResult.reason
      }

      setTransactions(parseApiArray(transactionsResult.value))
      setSummary(parseSummary(summaryResult.value))

      if (paymentsResult.status === 'fulfilled') {
        setPayments(getSafeArray(unwrapApiResult(paymentsResult.value, paymentsResult.value?.data), parseApiArray(paymentsResult.value)))
      } else {
        setPayments([])
        setError(PAYMENT_LOAD_WARNING)
        console.error('Không thể tải danh sách phương thức thanh toán:', paymentsResult.reason?.response?.data || paymentsResult.reason?.message)
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Có lỗi xảy ra khi lấy dữ liệu thu chi.')
      setTransactions([])
      setPayments([])
      setSummary(DEFAULT_SUMMARY)
      console.error('Có lỗi xảy ra khi lấy dữ liệu:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa giao dịch này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy'
    })

    if (!isConfirmed) return

    try {
      await axios.delete(`${env.API_URL}/api/v1/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { username }
      })

      if (selectedTransaction?.transactionId === id) {
        setDetailModalOpen(false)
        setSelectedTransaction(null)
      }

      Swal.fire('Thành công!', 'Giao dịch đã được xóa.', 'success')
      fetchData()
    } catch (deleteError) {
      console.error('Có lỗi xảy ra khi xóa giao dịch:', deleteError)
      Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa giao dịch.', 'error')
    }
  }

  const handleSubmit = async (event, transactionType) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const dateInput = formData.get('date')
    const date = new Date(dateInput)
    const currentDate = new Date()

    if (date > currentDate) {
      Swal.fire('Thông báo', 'Ngày lập phiếu đã được đặt về ngày hiện tại.', 'info')
      event.currentTarget.date.value = currentDate.toISOString().split('T')[0]
      return
    }

    const amount = parseFloat(formData.get('amount'))
    if (Number.isNaN(amount) || amount <= 0) {
      Swal.fire('Lỗi!', 'Số tiền không hợp lệ.', 'error')
      return
    }

    const paymentMethod = formData.get('paymentMethod')
    const payment = payments.find((item) => item.paymentName === paymentMethod)

    if (!payment) {
      Swal.fire('Lỗi!', 'Phương thức thanh toán không hợp lệ.', 'error')
      return
    }

    const data = {
      amount,
      paymentId: payment.paymentId,
      payerName: formData.get('payer'),
      paymentDescription: formData.get('description'),
      category: formData.get('category'),
      transactionDate: date.toISOString().split('T')[0]
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn thêm giao dịch này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy'
    })

    if (!isConfirmed) return

    try {
      const url =
        transactionType === 'receipt'
          ? `${env.API_URL}/api/v1/transactions/receipts`
          : `${env.API_URL}/api/v1/transactions/expenses`

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { username }
      })

      const createdTransaction = unwrapApiResult(response, response?.data)
      if (createdTransaction && typeof createdTransaction === 'object') {
        setTransactions((prev) => [createdTransaction, ...prev])
      }

      await fetchData()
      setReceiptModalOpen(false)
      setExpenseModalOpen(false)

      Swal.fire(
        'Thành công!',
        transactionType === 'receipt' ? 'Phiếu thu đã được tạo thành công!' : 'Phiếu chi đã được tạo thành công!',
        'success'
      )
    } catch (submitError) {
      console.error('Có lỗi xảy ra khi thêm giao dịch:', submitError?.response?.data || submitError.message)
      Swal.fire('Lỗi!', 'Có lỗi xảy ra khi thêm giao dịch.', 'error')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount || 0))
  }

  const matchesSelectedPeriod = (transaction) => {
    const transactionDate = getTransactionDate(transaction?.transactionDate)
    if (!transactionDate) return true

    const transactionMonth = transactionDate.getMonth() + 1
    const transactionYear = transactionDate.getFullYear()
    const quarterStart = Math.floor((selectedMonth - 1) / 3) * 3 + 1
    const quarterMonths = [quarterStart, quarterStart + 1, quarterStart + 2]

    if (reportScope === 'year') {
      return transactionYear === selectedYear
    }

    if (reportScope === 'quarter') {
      return transactionYear === selectedYear && quarterMonths.includes(transactionMonth)
    }

    if (reportScope === 'day') {
      // Trang hiện chỉ có bộ chọn tháng/năm, nên chế độ ngày sẽ bám theo tháng đang chọn.
      return transactionMonth === selectedMonth && transactionYear === selectedYear
    }

    return transactionMonth === selectedMonth && transactionYear === selectedYear
  }

  const periodTransactions = transactions.filter(matchesSelectedPeriod)

  const availableCategories = buildCategoryOptions(transactions.map((transaction) => transaction.category))

  const paymentMethodOptions = [...new Set(
    [
      ...payments.map((payment) => payment.paymentName),
      ...periodTransactions.map((transaction) => getTransactionPaymentName(transaction))
    ].filter(Boolean)
  )]

  const visibleTransactions = periodTransactions
    .filter((transaction) => {
      if (transaction.transactionType && !showReceipts) return false
      if (!transaction.transactionType && !showExpenses) return false

      const paymentMethod = getTransactionPaymentName(transaction)
      if (selectedPaymentMethods.length > 0 && !selectedPaymentMethods.includes(paymentMethod)) return false
      if (includedCategories.length > 0 && !includedCategories.includes(transaction.category)) return false
      if (excludedCategories.includes(transaction.category)) return false

      return true
    })
    .sort((left, right) => {
      const leftDate = getTransactionDate(left?.transactionDate)?.getTime() || 0
      const rightDate = getTransactionDate(right?.transactionDate)?.getTime() || 0
      return rightDate - leftDate
    })

  const displaySummary = visibleTransactions.reduce(
    (result, transaction) => {
      if (transaction.transactionType) {
        result.totalIncome += Number(transaction.amount || 0)
      } else {
        result.totalExpense += Number(transaction.amount || 0)
      }

      result.profit = result.totalIncome - result.totalExpense
      return result
    },
    { totalIncome: 0, totalExpense: 0, profit: 0 }
  )

  const summaryToDisplay = transactions.length === 0 ? summary : displaySummary
  const totalReceiptCount = periodTransactions.filter((transaction) => transaction.transactionType === true).length
  const totalExpenseCount = periodTransactions.filter((transaction) => transaction.transactionType === false).length

  const handleDownloadExcel = () => {
    const data = visibleTransactions.map((transaction) => ({
      'Danh mục thu chi': transaction.category,
      'Nội dung thanh toán': transaction.paymentDescription,
      'Người thanh toán / nhận': transaction.payerName,
      'Số tiền': Number(transaction.amount || 0),
      'Phương thức thanh toán': getTransactionPaymentName(transaction),
      'Ngày ghi nhận thu/chi': transaction.transactionDate,
      'Ngày tạo phiếu': transaction.transactionDate,
      'Loại giao dịch': transaction.transactionType ? 'Thu' : 'Chi'
    }))

    const summaryData = [
      { 'Danh mục thu chi': 'Tổng khoản thu (tiền vào)', 'Số tiền': summaryToDisplay.totalIncome },
      { 'Danh mục thu chi': 'Tổng khoản chi (tiền ra)', 'Số tiền': summaryToDisplay.totalExpense },
      { 'Danh mục thu chi': 'Lợi nhuận', 'Số tiền': summaryToDisplay.profit }
    ]

    const worksheet = XLSX.utils.json_to_sheet([...data, ...summaryData])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo thu chi')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const fileURL = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = fileURL
    link.setAttribute('download', 'transactions.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>In thu/chi</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d4d4d8; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f5f5f5; }
            .summary { margin-top: 20px; display: flex; gap: 12px; }
            .summary-card { border: 1px solid #d4d4d8; padding: 12px 16px; border-radius: 8px; min-width: 220px; }
            .header { margin-bottom: 12px; }
            .subtitle { color: #555; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Khoản thu / chi - tổng kết ${currentMotel?.motelName || 'nhà trọ'}</h2>
            <div class="subtitle">Báo cáo được in từ giao diện quản lý thu chi.</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Danh mục thu chi</th>
                <th>Nội dung thanh toán</th>
                <th>Người thanh toán / nhận</th>
                <th>Số tiền</th>
                <th>Phương thức thanh toán</th>
                <th>Ngày ghi nhận thu/chi</th>
                <th>Loại giao dịch</th>
              </tr>
            </thead>
            <tbody>
              ${visibleTransactions
                .map(
                  (transaction) => `
                    <tr>
                      <td>${transaction.category || ''}</td>
                      <td>${transaction.paymentDescription || ''}</td>
                      <td>${transaction.payerName || ''}</td>
                      <td>${formatCurrency(transaction.amount)}</td>
                      <td>${getTransactionPaymentName(transaction)}</td>
                      <td>${transaction.transactionDate || ''}</td>
                      <td>${transaction.transactionType ? 'Thu' : 'Chi'}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
          <div class="summary">
            <div class="summary-card"><strong>Tổng khoản thu:</strong> ${formatCurrency(summaryToDisplay.totalIncome)}</div>
            <div class="summary-card"><strong>Tổng khoản chi:</strong> ${formatCurrency(summaryToDisplay.totalExpense)}</div>
            <div class="summary-card"><strong>Lợi nhuận:</strong> ${formatCurrency(summaryToDisplay.profit)}</div>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '', 'width=900,height=650')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleResetFilters = () => {
    setShowReceipts(true)
    setShowExpenses(true)
    setSelectedPaymentMethods([])
    setIncludedCategories([])
    setExcludedCategories([])
    setReportScope('month')
    setReportView('detail')
  }

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const handleOpenDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setDetailModalOpen(true)
  }

  const handleManageCategories = () => {
    Swal.fire('Thông báo', 'Chức năng quản lý danh mục sẽ được nối vào luồng hiện có ở bước tiếp theo.', 'info')
  }

  const handleImportClick = () => {
    Swal.fire('Thông báo', 'Chức năng import thu/chi đang được chuẩn hóa theo giao diện mới.', 'info')
  }

  return (
    <Box>
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

          <IncomeSummaryHeader motelName={currentMotel?.motelName} onImportClick={handleImportClick} />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <IncomeSummaryFilters
            totalCount={periodTransactions.length}
            receiptCount={totalReceiptCount}
            expenseCount={totalExpenseCount}
            paymentMethodOptions={paymentMethodOptions}
            selectedPaymentMethods={selectedPaymentMethods}
            onSelectedPaymentMethodsChange={setSelectedPaymentMethods}
            showReceipts={showReceipts}
            showExpenses={showExpenses}
            onToggleReceipts={() => setShowReceipts((prev) => !prev)}
            onToggleExpenses={() => setShowExpenses((prev) => !prev)}
            categories={availableCategories}
            includedCategories={includedCategories}
            excludedCategories={excludedCategories}
            onIncludedCategoriesChange={setIncludedCategories}
            onExcludedCategoriesChange={setExcludedCategories}
            reportScope={reportScope}
            reportView={reportView}
            onReportScopeChange={setReportScope}
            onReportViewChange={setReportView}
            onResetFilters={handleResetFilters}
            onOpenExpense={() => setExpenseModalOpen(true)}
            onOpenReceipt={() => setReceiptModalOpen(true)}
            onPrint={handlePrint}
            onDownloadExcel={handleDownloadExcel}
            onManageCategories={handleManageCategories}
          />

          <IncomeSummaryStats summary={summaryToDisplay} formatCurrency={formatCurrency} />

          {loading ? (
            <Box
              sx={{
                minHeight: 260,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <IncomeSummaryTable
              transactions={visibleTransactions}
              reportView={reportView}
              formatCurrency={formatCurrency}
              onOpenDetails={handleOpenDetails}
              onDelete={handleDeleteTransaction}
            />
          )}
        </Stack>
      </Box>

      <AddReceiptModal
        open={receiptModalOpen}
        payments={payments}
        onClose={() => setReceiptModalOpen(false)}
        onSubmit={(event) => handleSubmit(event, 'receipt')}
      />

      <AddExpenseModal
        open={expenseModalOpen}
        payments={payments}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={(event) => handleSubmit(event, 'expense')}
      />

      <TransactionDetailModal
        open={detailModalOpen}
        transaction={selectedTransaction}
        formatCurrency={formatCurrency}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedTransaction(null)
        }}
        onDelete={handleDeleteTransaction}
      />
    </Box>
  )
}

export default IncomeSummary
