import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
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
  const [filterStatus, setFilterStatus] = useState({ done: false, new: false })
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

  const filteredData = useMemo(() => {
    return invoices
      .filter((currentInvoice) => {
        if (filterStatus.done && currentInvoice.paymentStatus === 'PAID') return true
        if (filterStatus.new && currentInvoice.paymentStatus !== 'PAID') return true
        return !filterStatus.done && !filterStatus.new
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
          status: currentInvoice.paymentStatus === 'PAID' ? 'Đã thu xong' : 'Chưa thu'
        }
      })
  }, [invoices, services, filterStatus])

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
          <YearMonthFilter
            onMonthChange={(month, year) => {
              setSelectedMonth(month)
              setSelectedYear(year)
            }}
          />
        </Box>

        <Box sx={{ p: '14px 16px 10px' }}>
          <InvoiceHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onCreateInvoice={() => setBulkInvoiceOpen(true)}
          />
          <InvoiceFilterBar
            invoices={invoices}
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
