import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'

import MotelStatsCards from './components/MotelStatsCards'
import RoomFilterBar from './components/RoomFilterBar'
import RoomListTable from './components/RoomListTable'

// Modals using MUI (New)
import AddRoomModal from './components/Modals/AddRoomModal'
import ServiceSelectModal from './components/Modals/ServiceSelectModal'
import AssetSelectModal from './components/Modals/AssetSelectModal'
import NoteModal from './components/Modals/NoteModal'
import InvoiceModal from './components/Modals/InvoiceModal'

// API
import { getRoomByMotelId, getServiceRoombyRoomId, DeleteRoomByid } from '~/apis/roomAPI'
import { getAllMotelDevices, getAllDeviceByRomId } from '~/apis/deviceAPT'
import { getMotelById } from '~/apis/motelAPI'
import { getContractByIdRoom2 } from '~/apis/contractTemplateAPI'
import { deleteReserveAPlace } from '~/apis/ReserveAPlaceAPI'
import { isValidRouteParam } from '~/utils/apiAdapters'

// Old Modals
import RentRoomModal from '../../NavContentAdmin/RentRoomModal'
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
  const [loading, setLoading] = useState(true)

  // Data for Modals
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [motelServices, setMotelServices] = useState([])
  const [allDevices, setAllDevices] = useState([])
  const [roomServices, setRoomServices] = useState([])
  const [deviceDetails, setDeviceDetails] = useState([])
  const [contract, setContract] = useState({})

  // Modal States
  const [modals, setModals] = useState({
    addRoom: false,
    serviceSelect: false,
    assetSelect: false,
    note: false,
    invoice: false,
    rentRoom: false,
    createContract: false,
    reserveAPlace: false,
    reserveAPlaceDetail: false,
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
    { id: 'name', label: 'Tên giường', visible: true },
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

  useEffect(() => {
    if (activeMotelId) {
      fetchData()
      fetchMotelServices()
      fetchDevices()
    }
  }, [activeMotelId])

  const toggleModal = (modalName, isOpen = true) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }))
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const dataRoom = await getRoomByMotelId(activeMotelId)
      if (dataRoom) setRooms(dataRoom)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMotelServices = async () => {
    try {
      const response = await getMotelById(activeMotelId)
      setMotelServices(response.data?.result?.motelServices || [])
    } catch (error) {
      console.error('Error fetching motel services:', error)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await getAllMotelDevices(activeMotelId)
      setAllDevices(response.result || [])
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }

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
    } catch (error) {
      console.error('Error prefetching room data', error)
    }
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
        Swal.fire('Lỗi', 'Không thể xóa phòng', 'error')
      }
    }
  }

  const handleDeleteReserve = async (reserveId) => {
    const result = await Swal.fire({
      title: 'Hủy cọc?',
      text: 'Không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy cọc'
    })
    if (result.isConfirmed) {
      try {
        await deleteReserveAPlace(reserveId)
        Swal.fire('Thành công', 'Hủy cọc thành công', 'success')
        fetchData()
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể hủy cọc', 'error')
      }
    }
  }

  const handleActionClick = async (action, room) => {
    await prefetchRoomData(room)

    switch (action) {
      case 'detail':
        window.open(`/quanlytro/${activeMotelId}/Chi-tiet-phong/${room.roomId}`, '_blank')
        break
      case 'collect':
        toggleModal('invoice')
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
        if (room.reserveAPlace?.reserveAPlaceId) handleDeleteReserve(room.reserveAPlace.reserveAPlaceId)
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
      default:
        break
    }
  }

  // Calculate Counts
  const counts = {
    active: rooms.filter((r) => r.latestContract?.status === 'ACTIVE').length,
    empty: rooms.filter((r) => {
      const s = r.latestContract?.status
      const rs = r.reserveAPlace?.status
      return !s && !rs
    }).length,
    reportEnd: rooms.filter((r) => r.latestContract?.status === 'ReportEnd').length,
    expire: rooms.filter((r) => r.latestContract?.status === 'IATExpire').length,
    overdue: rooms.filter((r) => false).length, // Placeholder if no overdue logic available
    stake: rooms.filter((r) => r.reserveAPlace?.status === 'ACTIVE').length,
    debt: rooms.filter((r) => (r.debt || 0) > 0).length
  }

  const filteredRooms = rooms.filter((room) => {
    if (searchTerm && !room.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

    const status = room.latestContract?.status
    const reserveStatus = room.reserveAPlace?.status
    const isRoomEmpty = !status && !reserveStatus

    // If no filters selected, show all
    if (!Object.values(filters).some(Boolean)) return true

    if (filters.isEmpty && isRoomEmpty) return true
    if (filters.isActive && status === 'ACTIVE') return true
    if (filters.isStake && reserveStatus === 'ACTIVE') return true
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
        onExportExcel={() => alert('Export Excel requires original ExportToExcel component')}
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
        onAddSuccess={fetchData}
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
        room={selectedRoom}
        contract={contract}
        roomServices={roomServices}
        deviceDetails={deviceDetails}
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
      />
      <ModalEndContract
        modalOpen={modals.endContract}
        toggleModal={() => toggleModal('endContract', false)}
        roomId={selectedRoom?.roomId}
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
      <ModalCreateContract
        modalOpen={modals.createContract}
        toggleModal={() => toggleModal('createContract', false)}
        motelId={activeMotelId}
        roomId={selectedRoom?.roomId}
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
