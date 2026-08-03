import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'

import MotelStatsCards from './components/MotelStatsCards'
import RoomFilterBar from './components/RoomFilterBar'
import RoomListTable from './components/RoomListTable'

// Modals using MUI (New)
import AddRoomModal from './components/Modals/AddRoomModal'
import ServiceSelectModal from './components/Modals/ServiceSelectModal'
import AssetSelectModal from './components/Modals/AssetSelectModal'
import NoteModal from './components/Modals/NoteModal'
import InvoiceModal from './components/Modals/InvoiceModal'
import InvoiceSuccessModal from './components/Modals/InvoiceSuccessModal'
import CollectPaymentModal from './components/Modals/CollectPaymentModal'

// API
import { getRoomByMotelId, getServiceRoombyRoomId, DeleteRoomByid } from '~/apis/roomAPI'
import { getAllMotelDevices, getAllDeviceByRomId } from '~/apis/deviceAPT'
import { getMotelById } from '~/apis/motelAPI'
import { getContractByIdRoom2 } from '~/apis/contractTemplateAPI'
import { fetchAllInvoicesByMotelId } from '~/apis/invoiceAPI'
import CancelReserveAPlaceModal from '../ReserveAPlace/CancelReserveAPlaceModal'
import { isValidRouteParam, isReserveAPlaceStatus } from '~/utils/apiAdapters'
import { getRoomGroupsByMotelId } from '~/apis/roomGroupAPI'
import {
  enrichRoomsWithDebt,
  getInvoiceRemainingAmount,
  getUnpaidInvoicesByRoom,
  mergeInvoicesById
} from '~/utils/invoiceDebt'

// Old Modals
import RentRoomModal from '../RentRoomModal'
import ModalCreateContract from '../../NavContentAdmin/ContractManage/ModalCreateContract'
import ReserveAPlaceModal from '../ReserveAPlace/ReserveAPlaceModal'
import ReserveAPlaceDetail from '../ReserveAPlace/ReserveAPlaceDetail'
import ModalReportContract from '../../NavContentAdmin/ContractManage/ModalReportContract'
import ModalCancelReportContract from '../../NavContentAdmin/ContractManage/ModalCancelReportContract'
import ModalEndContract from '../../NavContentAdmin/ContractManage/ModalEndContract'
import ModalChangeRoom from '../../NavContentAdmin/ContractManage/ModalChangeRoom'
import ModalExtendContract from '../../NavContentAdmin/ContractManage/ModalExtendContract'
import ModalListCar from '../ManagerCar/ModalListCar'

const MotelDashboard = ({ Motel }) => {
  const { motelId } = useParams()
  const activeMotelId = isValidRouteParam(motelId) ? motelId : Motel?.[0]?.motelId

  const [rooms, setRooms] = useState([])
  const [motelRoomGroups, setMotelRoomGroups] = useState([])
  const [motelInvoices, setMotelInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  // Data for Modals
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [motelServices, setMotelServices] = useState([])
  const [allDevices, setAllDevices] = useState([])
  const [roomServices, setRoomServices] = useState([])
  const [deviceDetails, setDeviceDetails] = useState([])
  const [contract, setContract] = useState({})
  const [createdInvoice, setCreatedInvoice] = useState(null)
  const [collectInvoice, setCollectInvoice] = useState(null)
  const [roomUnpaidInvoices, setRoomUnpaidInvoices] = useState([])
  const [collectInvoices, setCollectInvoices] = useState([])

  // Modal States
  const [modals, setModals] = useState({
    addRoom: false,
    serviceSelect: false,
    assetSelect: false,
    note: false,
    invoice: false,
    invoiceSuccess: false,
    collectPayment: false,
    rentRoom: false,
    createContract: false,
    reserveAPlace: false,
    reserveAPlaceDetail: false,
    cancelReserveAPlace: false,
    reportContract: false,
    cancelReportContract: false,
    endContract: false,
    changeRoom: false,
    extendContract: false,
    listCar: false
  })

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    isEmpty: false,
    isActive: false,
    isStake: false,
    isIATExpire: false,
    isReportEnd: false,
    isOverdue: false,
    isDebt: false
  })

  // Columns State
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Tên phòng', visible: true },
    { id: 'group', label: 'Nhóm', visible: true },
    { id: 'price', label: 'Giá thuê', visible: true },
    { id: 'deposit', label: 'Tiền cọc', visible: true },
    { id: 'debt', label: 'Tiền nợ', visible: true },
    { id: 'priority', label: 'Ưu tiên', visible: true },
    { id: 'invoiceDate', label: 'Ngày lập hóa đơn', visible: true },
    { id: 'paymentCircle', label: 'Chu kỳ thu tiền', visible: true },
    { id: 'moveinDate', label: 'Ngày vào ở', visible: true },
    { id: 'duration', label: 'Thời hạn hợp đồng', visible: true },
    { id: 'status', label: 'Tình trạng', visible: true },
    { id: 'finance', label: 'Tài chính', visible: true }
  ])

  const handleToggleColumn = (colId) => {
    setColumns((prev) => prev.map((col) => (col.id === colId ? { ...col, visible: !col.visible } : col)))
  }

  const roomGroups = useMemo(() => motelRoomGroups, [motelRoomGroups])

  const fetchRoomGroups = useCallback(async () => {
    if (!isValidRouteParam(activeMotelId)) return
    try {
      const groups = await getRoomGroupsByMotelId(activeMotelId)
      setMotelRoomGroups(groups || [])
    } catch (error) {
      console.error('Failed to fetch room groups:', error)
    }
  }, [activeMotelId])

  const toggleModal = (modalName, isOpen = true) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }))
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const dataRoom = await getRoomByMotelId(activeMotelId)

      let invoices = []
      try {
        invoices = await fetchAllInvoicesByMotelId(activeMotelId)
      } catch (invoiceError) {
        console.error('Failed to fetch invoices for debt calculation:', invoiceError)
      }

      setMotelInvoices(invoices)
      if (dataRoom) {
        setRooms(invoices.length > 0 ? enrichRoomsWithDebt(dataRoom, invoices) : dataRoom)
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }, [activeMotelId])

  const fetchMotelServices = useCallback(async () => {
    try {
      const response = await getMotelById(activeMotelId)
      setMotelServices(response.data?.result?.motelServices || [])
    } catch (error) {
      console.error('Error fetching motel services:', error)
    }
  }, [activeMotelId])

  const fetchDevices = useCallback(async () => {
    try {
      const response = await getAllMotelDevices(activeMotelId)
      setAllDevices(response.result || [])
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }, [activeMotelId])

  useEffect(() => {
    if (activeMotelId) {
      fetchData()
      fetchMotelServices()
      fetchDevices()
      fetchRoomGroups()
    }
  }, [activeMotelId, fetchData, fetchDevices, fetchMotelServices, fetchRoomGroups])

  // Pre-fetch room specific data
  const prefetchRoomData = async (room) => {
    setSelectedRoom(room)
    try {
      // Fetch Contract
      const contractRes = await getContractByIdRoom2(room.roomId)
      setContract(contractRes || {})

      // Fetch Services
      const servicesRes = await getServiceRoombyRoomId(room.roomId)
      if (servicesRes && Array.isArray(servicesRes)) {
        const mapped = servicesRes.map((s) => ({
          ...s,
          isSelected: true,
          quantity: s.quantity || 1,
          totalPrice: (s.quantity || 1) * (s.service?.price || 0)
        }))
        setRoomServices(mapped)
      } else {
        setRoomServices([])
      }

      // Fetch Devices
      const devicesRes = await getAllDeviceByRomId(room.roomId)
      setDeviceDetails(devicesRes?.result || [])

      const unpaidInvoices = getUnpaidInvoicesByRoom(motelInvoices, room.roomId)
      setRoomUnpaidInvoices(unpaidInvoices)

      return contractRes || room.latestContract || {}
    } catch (error) {
      console.error('Error prefetching room data', error)
      return room.latestContract || {}
    }
  }

  const roomDebtAmount = roomUnpaidInvoices.reduce((total, invoice) => total + getInvoiceRemainingAmount(invoice), 0)

  const openCollectPayment = async (room, invoice = null) => {
    try {
      const invoices = invoice
        ? mergeInvoicesById([invoice, ...getUnpaidInvoicesByRoom(motelInvoices, room.roomId)])
        : getUnpaidInvoicesByRoom(motelInvoices, room.roomId)
      setCollectInvoices(invoices)
      setCollectInvoice(invoice || invoices[0] || null)
      toggleModal('collectPayment')
    } catch (error) {
      console.error('Failed to fetch unpaid invoice:', error)
      Swal.fire('Lỗi', 'Không thể tải hóa đơn cần thu của phòng này.', 'error')
    }
  }

  const handleInvoiceCreated = (invoice) => {
    const nextUnpaidInvoices = mergeInvoicesById([invoice, ...roomUnpaidInvoices])
    setCreatedInvoice(invoice)
    setCollectInvoice(invoice)
    setRoomUnpaidInvoices(nextUnpaidInvoices)
    setCollectInvoices(nextUnpaidInvoices)
    toggleModal('invoice', false)
    toggleModal('invoiceSuccess', true)
    fetchData()
  }

  const handleDeleteRoom = async (roomId) => {
    const result = await Swal.fire({
      title: 'Xóa phòng?',
      text: 'Không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa'
    })
    if (result.isConfirmed) {
      try {
        await DeleteRoomByid(roomId)
        Swal.fire('Đã xóa!', 'Xóa phòng thành công', 'success')
        fetchData()
      } catch (error) {
        console.error('Failed to delete room:', error)
        Swal.fire('Lỗi', 'Không thể xóa phòng', 'error')
      }
    }
  }

  const handleActionClick = async (action, room) => {
    const activeContract = await prefetchRoomData(room)
    const contractId = activeContract?.contractId || room.latestContract?.contractId

    switch (action) {
      case 'detail':
        window.open(`/quanlytro/${activeMotelId}/Chi-tiet-phong/${room.roomId}`, '_blank')
        break
      case 'invoice':
        toggleModal('invoice')
        break
      case 'collect':
        await openCollectPayment(room)
        break
      case 'rent':
        toggleModal('createContract')
        break
      case 'deposit':
        toggleModal('reserveAPlace')
        break
      case 'services':
        toggleModal('serviceSelect')
        break
      case 'devices':
        toggleModal('assetSelect')
        break
      case 'edit':
        toggleModal('note')
        break
      case 'delete':
        handleDeleteRoom(room.roomId)
        break
      case 'view_reserve':
        toggleModal('reserveAPlaceDetail')
        break
      case 'cancel_reserve':
        toggleModal('cancelReserveAPlace')
        break
      case 'report_end':
        toggleModal('reportContract')
        break
      case 'cancel_report':
        toggleModal('cancelReportContract')
        break
      case 'end_contract':
        toggleModal('endContract')
        break
      case 'change_room':
        toggleModal('changeRoom')
        break
      case 'extend_contract':
        toggleModal('extendContract')
        break
      case 'list_car':
        toggleModal('listCar')
        break
      case 'list_tenant':
        toggleModal('rentRoom')
        break
      case 'view_contract':
        if (contractId) window.open(`/quanlytro/${activeMotelId}/Contract-Preview/${contractId}`, '_blank')
        break
      case 'print_contract':
        if (contractId) {
          const printWindow = window.open(`/quanlytro/${activeMotelId}/Contract-Preview/${contractId}`, '_blank')
          if (printWindow) {
            printWindow.onload = () => printWindow.print()
          }
        }
        break
      case 'share_contract':
        if (contractId) {
          const shareLink = `${window.location.origin}/quanlytro/${activeMotelId}/Contract-Preview/${contractId}`
          await navigator.clipboard.writeText(shareLink)
          Swal.fire('Thành công', 'Đã sao chép liên kết hợp đồng', 'success')
        }
        break
      case 'share_code':
        Swal.fire('Thông báo', 'Chức năng chia sẻ mã kết nối chưa được cấu hình.', 'info')
        break
      default:
        break
    }
  }

  const handleExportExcel = () => {
    if (!rooms || rooms.length === 0) {
      Swal.fire('Thông báo', 'Không có dữ liệu phòng để xuất.', 'info')
      return
    }

    const dataToExport = rooms.map((room) => {
      const statusText =
        room.latestContract?.status === 'ACTIVE'
          ? 'Đang ở'
          : room.latestContract?.status === 'IATExpire'
            ? 'Sắp kết thúc HĐ'
            : room.latestContract?.status === 'ReportEnd'
              ? 'Đang báo KT'
              : isReserveAPlaceStatus(room.reserveAPlace?.status)
                ? 'Đang cọc giữ chỗ'
                : 'Đang trống'

      return {
        'Tên phòng': room.name || 'N/A',
        'Tầng/Nhóm': formatRoomGroupLabel(room.group) || 'Chưa phân nhóm',
        'Giá thuê (đ)': room.price || 0,
        'Tiền cọc (đ)': room.deposit || room.latestContract?.deposit || 0,
        'Tiền nợ (đ)': room.debt || 0,
        'Mức ưu tiên': room.prioritize || 'Tất cả',
        'Ngày lập hóa đơn hàng tháng': room.invoiceDate ? `Ngày ${room.invoiceDate}` : 'Ngày 1',
        'Chu kỳ thu tiền (tháng)': room.paymentCircle || 1,
        'Ngày vào ở': room.latestContract?.moveinDate
          ? new Date(room.latestContract.moveinDate).toLocaleDateString('vi-VN')
          : 'N/A',
        'Thời hạn hợp đồng (tháng)': room.latestContract?.duration || 'N/A',
        'Tình trạng': statusText,
        'Tài chính': room.debt > 0 ? 'Nợ tiền' : 'Chờ kỳ thu mới'
      }
    })

    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Tự động căn chỉnh độ rộng cột
    const colWidths = Object.keys(dataToExport[0]).map((key) => {
      const maxLength = Math.max(key.length, ...dataToExport.map((row) => String(row[key] || '').length))
      return { wch: maxLength + 2 }
    })
    ws['!cols'] = colWidths

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách phòng')
    XLSX.writeFile(wb, `Danh_sach_phong_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '_')}.xlsx`)

    Swal.fire('Thành công', 'Đã xuất file excel danh sách phòng thành công!', 'success')
  }

  // Calculate Counts
  const counts = {
    active: rooms.filter((r) => r.latestContract?.status === 'ACTIVE').length,
    empty: rooms.filter((r) => {
      const s = r.latestContract?.status
      const rs = r.reserveAPlace?.status
      return !s && !isReserveAPlaceStatus(rs)
    }).length,
    reportEnd: rooms.filter((r) => r.latestContract?.status === 'ReportEnd').length,
    expire: rooms.filter((r) => r.latestContract?.status === 'IATExpire').length,
    overdue: 0, // Placeholder if no overdue logic available
    stake: rooms.filter((r) => isReserveAPlaceStatus(r.reserveAPlace?.status)).length,
    debt: rooms.filter((r) => (r.debt || 0) > 0).length
  }

  const filteredRooms = rooms.filter((room) => {
    if (searchTerm && !room.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

    const status = room.latestContract?.status
    const reserveStatus = room.reserveAPlace?.status
    const isRoomEmpty = !status && !isReserveAPlaceStatus(reserveStatus)

    // If no filters selected, show all
    if (!Object.values(filters).some(Boolean)) return true

    if (filters.isEmpty && isRoomEmpty) return true
    if (filters.isActive && status === 'ACTIVE') return true
    if (filters.isStake && isReserveAPlaceStatus(reserveStatus)) return true
    if (filters.isIATExpire && status === 'IATExpire') return true
    if (filters.isReportEnd && status === 'ReportEnd') return true
    if (filters.isDebt && (room.debt || 0) > 0) return true
    // Overdue not strictly defined in old code, mocking for now

    return false
  })

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 80px)' }}>
      <MotelStatsCards rooms={rooms} loading={loading} />
      <RoomFilterBar
        filters={filters}
        setFilters={setFilters}
        onSearchChange={setSearchTerm}
        onExportExcel={handleExportExcel}
        onAddRoom={() => toggleModal('addRoom')}
        counts={counts}
        columns={columns}
        onToggleColumn={handleToggleColumn}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RoomListTable rooms={filteredRooms} columns={columns} onActionClick={handleActionClick} />
      )}

      {/* --- NEW MUI Modals --- */}
      <AddRoomModal
        open={modals.addRoom}
        onClose={() => toggleModal('addRoom', false)}
        activeMotelId={activeMotelId}
        motelServices={motelServices}
        roomGroups={roomGroups}
        rooms={rooms}
        onGroupsChange={fetchRoomGroups}
        onAddSuccess={() => {
          fetchData()
          fetchRoomGroups()
        }}
      />
      <ServiceSelectModal
        open={modals.serviceSelect}
        onClose={() => toggleModal('serviceSelect', false)}
        room={selectedRoom}
        initialRoomServices={roomServices}
        onUpdateSuccess={fetchData}
      />
      <AssetSelectModal
        open={modals.assetSelect}
        onClose={() => toggleModal('assetSelect', false)}
        room={selectedRoom}
        allDevices={allDevices}
      />
      <NoteModal
        open={modals.note}
        onClose={() => toggleModal('note', false)}
        room={selectedRoom}
        onUpdateSuccess={fetchData}
      />
      <InvoiceModal
        open={modals.invoice}
        onClose={() => toggleModal('invoice', false)}
        onCreated={handleInvoiceCreated}
        room={selectedRoom}
        contract={contract}
        roomServices={roomServices}
        deviceDetails={deviceDetails}
        outstandingDebt={roomDebtAmount}
      />
      <InvoiceSuccessModal
        open={modals.invoiceSuccess}
        onClose={() => toggleModal('invoiceSuccess', false)}
        invoice={createdInvoice}
        room={selectedRoom}
        onCollect={(invoice) => {
          toggleModal('invoiceSuccess', false)
          openCollectPayment(selectedRoom, invoice)
        }}
        onDetail={(invoice) => {
          Swal.fire({
            icon: 'info',
            title: 'Chi tiết hóa đơn',
            text: `Hóa đơn ${invoice?.invoiceId || ''} - Tổng tiền ${Number(invoice?.totalAmount || 0).toLocaleString('vi-VN')} đ`
          })
        }}
      />
      <CollectPaymentModal
        open={modals.collectPayment}
        onClose={() => toggleModal('collectPayment', false)}
        invoice={collectInvoice}
        invoices={collectInvoices}
        room={selectedRoom}
        contract={contract}
        onCollected={(paidInvoice) => {
          const nextInvoices = collectInvoices.filter((invoice) => invoice.invoiceId !== paidInvoice?.invoiceId)
          setCollectInvoices(nextInvoices)
          setRoomUnpaidInvoices((previous) =>
            previous.filter((invoice) => invoice.invoiceId !== paidInvoice?.invoiceId)
          )
          setCollectInvoice(nextInvoices[0] || null)
          fetchData()
        }}
        onDetail={(invoice) => {
          Swal.fire({
            icon: 'info',
            title: 'Chi tiết hóa đơn',
            text: `Hóa đơn ${invoice?.invoiceId || ''} - Tổng tiền ${Number(invoice?.totalAmount || 0).toLocaleString('vi-VN')} đ`
          })
        }}
      />

      {/* --- OLD External Modals --- */}
      <RentRoomModal
        modalOpen={modals.rentRoom}
        toggleModal={() => toggleModal('rentRoom', false)}
        roomId={selectedRoom?.roomId}
        fetchRooms={fetchData}
      />
      <ModalChangeRoom
        modalOpen={modals.changeRoom}
        toggleModal={() => toggleModal('changeRoom', false)}
        roomId={selectedRoom?.roomId}
        motelId={activeMotelId}
        onSuccess={fetchData}
      />
      <ModalEndContract
        modalOpen={modals.endContract}
        toggleModal={() => toggleModal('endContract', false)}
        roomId={selectedRoom?.roomId}
        onSuccess={fetchData}
      />
      <ModalExtendContract
        modalOpen={modals.extendContract}
        toggleModal={() => toggleModal('extendContract', false)}
        roomId={selectedRoom?.roomId}
      />
      <ReserveAPlaceModal
        modalOpen={modals.reserveAPlace}
        toggleModal={() => toggleModal('reserveAPlace', false)}
        roomId={selectedRoom?.roomId}
      />
      <ReserveAPlaceDetail
        modalOpen={modals.reserveAPlaceDetail}
        toggleModal={() => toggleModal('reserveAPlaceDetail', false)}
        roomId={selectedRoom?.roomId}
      />
      <CancelReserveAPlaceModal
        open={modals.cancelReserveAPlace}
        onClose={() => toggleModal('cancelReserveAPlace', false)}
        roomId={selectedRoom?.roomId}
        onSuccess={fetchData}
      />
      <ModalCreateContract
        modalOpen={modals.createContract}
        toggleModal={() => toggleModal('createContract', false)}
        motelId={activeMotelId}
        roomId={selectedRoom?.roomId}
        onSuccess={fetchData}
      />
      <ModalReportContract
        modalOpen={modals.reportContract}
        toggleModal={() => toggleModal('reportContract', false)}
        roomId={selectedRoom?.roomId}
      />
      <ModalCancelReportContract
        modalOpen={modals.cancelReportContract}
        toggleModal={() => toggleModal('cancelReportContract', false)}
        roomId={selectedRoom?.roomId}
      />
      <ModalListCar
        modalOpen={modals.listCar}
        toggleModal={() => toggleModal('listCar', false)}
        roomId={selectedRoom?.roomId}
      />
    </Box>
  )
}

export default MotelDashboard
