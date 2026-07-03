import { useEffect, useState, useCallback, useMemo } from 'react'
import { Box, Paper, Grid } from '@mui/material'
import ServiceList from './components/ServiceList'
import UsageReport from './components/UsageReport'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import ModelCreateService from './ModelCreateService'
import ModelUpdateService from './ModelUpdateService'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import httpClient from '~/apis/httpClient'
import { isValidRouteParam } from '~/utils/apiAdapters'
import { getMotelDetail, getRoomsByMotelId, deleteMotelServiceAPI } from '~/apis/motelServiceAPI'

const ServiceManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [motelServices, setMotelServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [invoices, setInvoices] = useState([])
  // State cho bộ lọc tháng - mặc định tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  })

  const fetchMotelServicesWithCount = useCallback(async (id) => {
    try {
      if (!isValidRouteParam(id)) {
        setMotelServices([])
        setRooms([])
        setInvoices([])
        return
      }

      const [serviceRes, roomRes, invoiceRes] = await Promise.all([
        getMotelDetail(id),
        getRoomsByMotelId(id),
        httpClient.get(`/api/v1/invoices/motel/${id}`)
      ])

      if (serviceRes?.code === 200 && serviceRes.result?.motelServices) {
        const services = serviceRes.result.motelServices || []
        const fetchedRooms = roomRes?.result || []
        const fetchedInvoices = invoiceRes?.data?.result?.items || []

        setRooms(fetchedRooms)
        setInvoices(fetchedInvoices)

        // Đếm số phòng đang áp dụng dịch vụ
        const serviceCounts = {}
        fetchedRooms.forEach((room) => {
          const roomServices = room.services || []
          roomServices.forEach((rs) => {
            const serviceId = rs.service?.motelServiceId || rs.serviceId
            if (serviceId) {
              serviceCounts[serviceId] = (serviceCounts[serviceId] || 0) + 1
            }
          })
        })

        const servicesWithCount = services.map((service) => ({
          ...service,
          count: serviceCounts[service.motelServiceId] || 0,
        }))

        setMotelServices(servicesWithCount)
      } else {
        setMotelServices([])
        setRooms([])
        setInvoices([])
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error)
      setMotelServices([])
      setRooms([])
      setInvoices([])
    }
  }, [])

  const roomData = useMemo(() => {
    const filterYearMonthStr = `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, '0')}`

    // Lọc hóa đơn của tháng được chọn
    const monthlyInvoices = invoices.filter((inv) => inv.invoiceCreateMonth === filterYearMonthStr)

    return rooms.map((room) => {
      // Tìm hóa đơn của phòng này trong tháng đó
      const roomInvoice = monthlyInvoices.find((inv) => inv.roomId === room.roomId)
      const roomServices = {}

      motelServices.forEach((service) => {
        const serviceId = service.motelServiceId
        if (roomInvoice) {
          // Nếu có hóa đơn, lấy lượng sử dụng từ chi tiết hóa đơn
          const serviceDetail = roomInvoice.serviceDetails?.find(
            (sd) => sd.serviceName === service.nameService
          )
          roomServices[`usage_${serviceId}`] = serviceDetail ? (serviceDetail.quantity || 0) : 0
          roomServices[`total_${serviceId}`] = serviceDetail ? (serviceDetail.totalPrice || 0) : 0
        } else {
          // Nếu không có hóa đơn, lấy từ cài đặt mặc định của phòng (nếu phòng có đăng ký dịch vụ này)
          const registeredService = room.services?.find(
            (rs) => (rs.service?.motelServiceId || rs.serviceId) === serviceId
          )
          roomServices[`usage_${serviceId}`] = registeredService ? (registeredService.quantity || 0) : 0
          roomServices[`total_${serviceId}`] = registeredService 
            ? (registeredService.quantity || 0) * (registeredService.service?.price || service.price || 0)
            : 0
        }
      })

      return {
        nameRoom: room.name,
        ...roomServices
      }
    })
  }, [rooms, invoices, motelServices, selectedMonth])

  const deleteMotelService = async (serviceId) => {
    if (!serviceId) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Không có dịch vụ nào để xóa.'
      })
      return
    }

    const confirmDelete = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Không'
    })

    if (!confirmDelete.isConfirmed) {
      return
    }

    try {
      await deleteMotelServiceAPI(serviceId)
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Dịch vụ đã được xóa thành công!'
      })
      fetchMotelServicesWithCount(motelId)
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã xảy ra lỗi khi xóa dịch vụ. Vui lòng thử lại sau.'
      })
    }
  }

  const refreshServices = () => {
    fetchMotelServicesWithCount(motelId)
  }

  useEffect(() => {
    if (motelId) {
      fetchMotelServicesWithCount(motelId)
    }
  }, [motelId, fetchMotelServicesWithCount])

  const openEditModal = (service) => {
    setSelectedService(service)
    setIsUpdateModalOpen(true)
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false)
    setSelectedService(null)
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
          overflow: 'hidden',
          backgroundColor: '#fff',
          p: 2,
        }}
      >
        <Grid container spacing={3}>
          {/* Left Column: Service List */}
          <Grid item xs={12} md={4}>
            <ServiceList
              motelServices={motelServices}
              openEditModal={openEditModal}
              deleteMotelService={deleteMotelService}
            />
          </Grid>

          {/* Right Column: Usage Report */}
          <Grid item xs={12} md={8}>
            <UsageReport
              roomData={roomData}
              motelServices={motelServices}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Modal them dich vu  */}
      <ModelCreateService motelId={motelId} refreshServices={refreshServices} />

      {isUpdateModalOpen && (
        <ModelUpdateService
          serviceData={selectedService}
          closeModal={closeUpdateModal}
          refreshServices={() => fetchMotelServicesWithCount(motelId)}
        />
      )}
    </Box>
  )
}

export default ServiceManager
