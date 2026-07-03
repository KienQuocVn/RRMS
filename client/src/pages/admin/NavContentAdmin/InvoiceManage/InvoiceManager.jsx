import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { env } from '~/configs/environment'
import { isValidRouteParam } from '~/utils/apiAdapters'
import YearMonthFilter from '../YearMonthFilter'
import ModalEditInvoice from './ModalEditInvoice'
import ModalCollectMoneyInvoice from './ModalCollectMoneyInvoice'
import InvoiceHeader from './components/InvoiceHeader'
import InvoiceFilterBar from './components/InvoiceFilterBar'
import InvoiceTable from './components/InvoiceTable'
import InvoiceActionMenu from './components/InvoiceActionMenu'
import BulkInvoiceWizardDialog from './components/BulkInvoiceWizardDialog'

const InvoiceManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null
  const { motelId } = useParams()

  const [invoice, setInvoice] = useState({})
  const [invoices, setInvoices] = useState([])
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(null)
  const [services, setServices] = useState([])
  const [modalOpenInvoice, setModalOpenInvoice] = useState(false)
  const [modalOpenCollectMoney, setModalOpenCollectMoney] = useState(false)
  const [bulkInvoiceOpen, setBulkInvoiceOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState({ done: false, new: false, debt: false, cancel: false })
  const [sortValue, setSortValue] = useState('room-asc')
  const [searchText, setSearchText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const menuRef = useRef(null)

  const toggleModalInvoice = () => {
    setModalOpenInvoice(!modalOpenInvoice)
  }

  const toggleModalCollectMoney = () => {
    setModalOpenCollectMoney(!modalOpenCollectMoney)
  }

  const fetchInvoices = async (currentMotelId) => {
    try {
      if (!isValidRouteParam(currentMotelId)) {
        setInvoices([])
        return
      }

      const response = await axios.get(`${env.API_URL}/api/v1/invoices/motel/${currentMotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setInvoices(response.data?.result?.items || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMotelServices = async (currentMotelId) => {
    try {
      if (!isValidRouteParam(currentMotelId)) {
        setServices([])
        return
      }

      const response = await axios.get(`${env.API_URL}/api/v1/motels/${currentMotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const motelData = response.data?.result
      if (motelData?.motelServices) {
        setServices(motelData.motelServices.map((service) => service.nameService))
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setIsAdmin(true)
    fetchInvoices(motelId)
    fetchMotelServices(motelId)
  }, [motelId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsAdmin(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDataInvoice = async (id) => {
    try {
      const invoiceData = invoices.find((item) => item.invoiceId === id)
      if (invoiceData) {
        const serviceDetails = invoiceData.serviceDetails.map((service) => ({
          roomServiceId: service.roomServiceId,
          serviceName: service.serviceName,
          servicePrice: service.servicePrice,
          quantity: service.quantity,
          chargetype: service.chargetype,
          totalPrice: service.totalPrice,
          isSelected: true
        }))

        const status =
          invoiceData.paymentStatus === 'CANCELED'
            ? 'Đã bị hủy'
            : invoiceData.paymentStatus === 'PAID'
              ? 'Đã thu xong'
              : 'Chưa thu'

        setInvoice({ ...invoiceData, serviceDetails, status })
      } else {
        console.warn(`Invoice with ID ${id} not found in invoices list.`)
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error)
    }
  }

  const handleActionClick = (e, invoiceId) => {
    e.stopPropagation()
    const targetElement = e.currentTarget
    const rect = targetElement.getBoundingClientRect()

    setMenuPosition({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height
    })

    fetchDataInvoice(invoiceId)
    setShowMenu(invoiceId)
  }

  const updateInvoiceStatus = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((currentInvoice) =>
        currentInvoice.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : currentInvoice
      )
    )
  }

  const cancelInvoice = async (invoiceId) => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy hóa đơn?',
      text: 'Bạn có chắc chắn muốn hủy hóa đơn này không? Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      try {
        await axios.put(
          `${env.API_URL}/api/v1/invoices/${invoiceId}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setInvoices((prevInvoices) =>
          prevInvoices.map((currentInvoice) =>
            currentInvoice.invoiceId === invoiceId
              ? { ...currentInvoice, status: 'Đã bị hủy' }
              : currentInvoice
          )
        )

        Swal.fire('Đã hủy!', 'Hóa đơn đã được hủy thành công.', 'success')
        await fetchInvoices(motelId)
      } catch (error) {
        console.error('Error canceling invoice:', error)
        Swal.fire('Thất bại!', 'Hủy hóa đơn thất bại. Vui lòng thử lại!', 'error')
      }
    }
  }

  const deleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`${env.API_URL}/api/v1/invoices/delete/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      Swal.fire('Thành công!', 'Hóa đơn đã được xóa.', 'success')
      setInvoices((prevInvoices) => prevInvoices.filter((currentInvoice) => currentInvoice.invoiceId !== invoiceId))
    } catch (error) {
      console.error('Error deleting invoice:', error)
      Swal.fire('Lỗi!', 'Xóa hóa đơn thất bại.', 'error')
    }
  }

  const handleItemClick = (label) => {
    if (label === 'Xem chi tiết hóa đơn') {
      alert(`Xem chi tiet hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Gửi hóa đơn qua App') {
      alert(`gui hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'In hóa đơn') {
      alert(`in hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Chia sẻ hóa đơn') {
      alert(`chia se hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Gửi hóa đơn qua Zalo') {
      alert(`gui hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Xóa hóa đơn') {
      Swal.fire({
        title: 'Xác nhận xóa hóa đơn?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteInvoice(showMenu)
        }
      })
      setShowMenu(null)
    } else if (label === 'Thu tiền') {
      toggleModalCollectMoney(!toggleModalCollectMoney)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Hủy hóa đơn') {
      cancelInvoice(showMenu)
      setShowMenu(null)
    } else if (label === 'Chỉnh sửa') {
      toggleModalInvoice(!modalOpenInvoice)
      fetchDataInvoice(showMenu)
      setShowMenu(null)
    } else {
      setShowMenu(null)
      alert(`Action: ${label} on room ${showMenu}`)
    }
  }

  const handleFilterChange = (e) => {
    const { id, checked } = e.target
    setFilterStatus((prev) => ({
      ...prev,
      [id]: checked
    }))
  }

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const invoicesByMonth = useMemo(() => {
    const filterYearMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`
    return invoices.filter((inv) => inv.invoiceCreateMonth === filterYearMonthStr)
  }, [invoices, selectedMonth, selectedYear])

  const filteredData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const filtered = invoicesByMonth
      .filter((currentInvoice) => {
        // Tìm kiếm theo tên phòng
        if (searchText && !currentInvoice.roomName?.toLowerCase().includes(searchText.toLowerCase())) {
          return false
        }

        const isPaid = currentInvoice.paymentStatus === 'PAID'
        const isCanceled = currentInvoice.paymentStatus === 'CANCELED'
        const isOverdue = currentInvoice.dueDate && new Date(currentInvoice.dueDate).setHours(0, 0, 0, 0) < today
        const isDebt = currentInvoice.paymentStatus === 'PARTIAL' || (currentInvoice.paymentStatus === 'UNPAID' && isOverdue)
        const isUnpaid = currentInvoice.paymentStatus === 'UNPAID' && !isOverdue

        const matchesDone = filterStatus.done && isPaid
        const matchesNew = filterStatus.new && isUnpaid
        const matchesDebt = filterStatus.debt && isDebt
        const matchesCancel = filterStatus.cancel && isCanceled

        const anyFilterSelected = filterStatus.done || filterStatus.new || filterStatus.debt || filterStatus.cancel
        if (anyFilterSelected) {
          return matchesDone || matchesNew || matchesDebt || matchesCancel
        }

        return true
      })
      .map((currentInvoice) => {
        const serviceData = {}

        ;(services || []).forEach((serviceName) => {
          const serviceDetail = currentInvoice.serviceDetails?.find((service) => service.serviceName === serviceName)
          serviceData[serviceName] = serviceDetail ? serviceDetail.totalPrice : 0
        })

        return {
          invoiceId: currentInvoice.invoiceId,
          roomId: currentInvoice.roomId,
          roomName: currentInvoice.roomName,
          roomPrice: currentInvoice.roomPrice,
          invoiceCreateMonth: currentInvoice.invoiceCreateMonth,
          invoiceCreateDate: currentInvoice.invoiceCreateDate,
          dueDate: currentInvoice.dueDate,
          moveinDate: currentInvoice.moveinDate,
          dueDateofmoveinDate: currentInvoice.dueDateofmoveinDate,
          deposit: currentInvoice.deposit,
          ...serviceData,
          adjustments: currentInvoice.additionItems?.reduce(
            (sum, item) => (item.addition ? sum + item.amount : sum - item.amount),
            0
          ),
          total: currentInvoice.totalAmount,
          status: currentInvoice.paymentStatus === 'CANCELED'
            ? 'Đã bị hủy'
            : currentInvoice.paymentStatus === 'PAID'
              ? 'Đã thu xong'
              : 'Chưa thu'
        }
      })

    // Sắp xếp dữ liệu
    filtered.sort((a, b) => {
      if (sortValue === 'room-asc') {
        return a.roomName.localeCompare(b.roomName, 'vi', { numeric: true })
      }
      if (sortValue === 'room-desc') {
        return b.roomName.localeCompare(a.roomName, 'vi', { numeric: true })
      }
      if (sortValue === 'date-asc') {
        return new Date(a.invoiceCreateDate || 0) - new Date(b.invoiceCreateDate || 0)
      }
      if (sortValue === 'date-desc') {
        return new Date(b.invoiceCreateDate || 0) - new Date(a.invoiceCreateDate || 0)
      }
      return 0
    })

    return filtered
  }, [invoicesByMonth, services, filterStatus, searchText, sortValue])

  const handlePrint = () => {
    if (filteredData.length === 0) {
      Swal.fire('Thông báo', 'Không có dữ liệu hóa đơn để in', 'info')
      return
    }

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Danh sách hóa đơn - Tháng ${selectedMonth}/${selectedYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #20a9e7; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            h2 { text-align: center; color: #20a9e7; margin-bottom: 5px; }
            .meta { text-align: center; font-size: 14px; margin-bottom: 20px; color: #666; }
          </style>
        </head>
        <body>
          <h2>DANH SÁCH HÓA ĐƠN</h2>
          <div class="meta">Tháng ${String(selectedMonth).padStart(2, '0')}/${selectedYear}</div>
          <table>
            <thead>
              <tr>
                <th>Tên phòng</th>
                <th>Tiền phòng</th>
                ${services.map(s => `<th>${s}</th>`).join('')}
                <th>Thu/Trả cọc</th>
                <th>Cộng thêm/Giảm trừ</th>
                <th>Tổng cộng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(row => `
                <tr>
                  <td><strong>${row.roomName}</strong></td>
                  <td>${row.roomPrice?.toLocaleString('vi-VN')} đ</td>
                  ${services.map(s => `<td>${(row[s] || 0)?.toLocaleString('vi-VN')} đ</td>`).join('')}
                  <td>${(row.deposit || 0)?.toLocaleString('vi-VN')} đ</td>
                  <td>${(row.adjustments || 0)?.toLocaleString('vi-VN')} đ</td>
                  <td><strong>${row.total?.toLocaleString('vi-VN')} đ</strong></td>
                  <td>${row.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleExportExcel = (type = 'full') => {
    if (filteredData.length === 0) {
      Swal.fire('Thông báo', 'Không có dữ liệu hóa đơn để xuất', 'info')
      return
    }

    let excelData = []
    if (type === 'compact') {
      excelData = filteredData.map((row) => {
        const totalServicesPrice = services.reduce((sum, serviceName) => sum + (row[serviceName] || 0), 0)
        return {
          'Tên phòng': row.roomName,
          'Tiền phòng (đ)': row.roomPrice,
          'Tổng tiền dịch vụ (đ)': totalServicesPrice,
          'Thu/Trả cọc (đ)': row.deposit || 0,
          'Cộng thêm/Giảm trừ (đ)': row.adjustments || 0,
          'Tổng cộng cần thu (đ)': row.total,
          'Trạng thái': row.status
        }
      })
    } else {
      excelData = filteredData.map((row) => {
        const rowData = {
          'Tên phòng': row.roomName,
          'Tiền phòng (đ)': row.roomPrice
        }
        services.forEach((serviceName) => {
          rowData[`${serviceName} (đ)`] = row[serviceName] || 0
        })
        rowData['Thu/Trả cọc (đ)'] = row.deposit || 0
        rowData['Cộng thêm/Giảm trừ (đ)'] = row.adjustments || 0
        rowData['Tổng cộng cần thu (đ)'] = row.total
        rowData['Trạng thái'] = row.status
        return rowData
      })
    }

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `HoaDon_${selectedMonth}_${selectedYear}`)

    const fileName = type === 'compact'
      ? `DanhSachHoaDon_RutGon_${selectedMonth}_${selectedYear}.xlsx`
      : `DanhSachHoaDon_DayDu_${selectedMonth}_${selectedYear}.xlsx`
    XLSX.writeFile(wb, fileName)
    Swal.fire('Thành công!', `Đã xuất file excel ${fileName}`, 'success')
  }

  const bulkInvoiceRooms = useMemo(() => {
    const roomMap = new Map()

    invoices.forEach((currentInvoice) => {
      if (!roomMap.has(currentInvoice.roomId)) {
        roomMap.set(currentInvoice.roomId, {
          roomId: currentInvoice.roomId,
          roomName: currentInvoice.roomName,
          roomPrice: currentInvoice.roomPrice,
          invoiceCount: 0,
          monthLabel: selectedMonth
        })
      }

      const currentRoom = roomMap.get(currentInvoice.roomId)
      currentRoom.invoiceCount += 1
    })

    return Array.from(roomMap.values()).sort((a, b) => a.roomName.localeCompare(b.roomName))
  }, [invoices, selectedMonth])

  const handleBulkInvoiceSubmit = () => {
    Swal.fire({
      icon: 'success',
      title: 'Đã lưu giao diện lập phiếu',
      text: 'Luồng bước 1 và bước 2 đã sẵn sàng để nối API lập phiếu thu.'
    })
    setBulkInvoiceOpen(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      <Paper
        elevation={0}
        sx={{
          mx: '10px',
          mb: '10px',
          borderRadius: '12px',
          border: '1px solid #e8f4fd',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
          <YearMonthFilter onMonthChange={handleMonthChange} />
        </Box>

        <Box sx={{ p: '14px 16px 10px' }}>
          <InvoiceHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onCreateInvoice={() => setBulkInvoiceOpen(true)}
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
          <InvoiceFilterBar
            invoices={invoicesByMonth}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
            filteredData={filteredData}
            sortValue={sortValue}
            onSortChange={setSortValue}
            searchText={searchText}
            onSearchChange={setSearchText}
          />
        </Box>

        <Box sx={{ px: '10px', pb: '16px', position: 'relative' }}>
          <InvoiceTable data={filteredData} services={services} onActionClick={handleActionClick} />
          {showMenu && invoice && invoice.status && (
            <InvoiceActionMenu
              menuRef={menuRef}
              menuPosition={menuPosition}
              invoice={invoice}
              onItemClick={handleItemClick}
            />
          )}
        </Box>
      </Paper>

      <BulkInvoiceWizardDialog
        open={bulkInvoiceOpen}
        onClose={() => setBulkInvoiceOpen(false)}
        rooms={bulkInvoiceRooms}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSubmit={handleBulkInvoiceSubmit}
      />

      <ModalEditInvoice
        modalOpen={modalOpenInvoice}
        toggleModal={toggleModalInvoice}
        invoice={invoice}
        onUpdateInvoice={(updatedInvoice) => {
          setInvoices((prevInvoices) =>
            prevInvoices.map((currentInvoice) =>
              currentInvoice.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : currentInvoice
            )
          )
        }}
      />

      <ModalCollectMoneyInvoice
        modalOpen={modalOpenCollectMoney}
        toggleModal={toggleModalCollectMoney}
        invoice={invoice}
        fetchInvoices={() => fetchInvoices(motelId)}
        updateInvoiceStatus={updateInvoiceStatus}
      />
    </Box>
  )
}

export default InvoiceManager
