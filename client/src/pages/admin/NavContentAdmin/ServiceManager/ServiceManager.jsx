import { useEffect, useState, useCallback } from 'react'
import { Box, Paper, Grid } from '@mui/material'
import ServiceList from './components/ServiceList'
import UsageReport from './components/UsageReport'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import ModelCreateService from './ModelCreateService'
import ModelUpdateService from './ModelUpdateService'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { isValidRouteParam } from '~/utils/apiAdapters'
import { getMotelDetail, getRoomsByMotelId, deleteMotelServiceAPI } from '~/apis/motelServiceAPI'

const ServiceManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [motelServices, setMotelServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [roomData, setRoomData] = useState([])
  // State cho bộ lọc tháng - mặc định tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  })

  const fetchMotelServicesWithCount = useCallback(async (id) => {
    try {
      if (!isValidRouteParam(id)) {
        setMotelServices([])
        setRoomData([])
        return
      }

      const [serviceRes, roomRes] = await Promise.all([
        getMotelDetail(id),
        getRoomsByMotelId(id)
      ])

      if (serviceRes?.code === 200 && serviceRes.result?.motelServices) {
        const services = serviceRes.result.motelServices || []
        const rooms = roomRes?.result || []

        // Đếm số phòng đang áp dụng dịch vụ
        const serviceCounts = {}
        rooms.forEach((room) => {
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

        // Chuẩn bị dữ liệu phòng cho bảng báo cáo
        const roomDataFormatted = rooms.map((room) => {
          const roomServices = (room.services || []).reduce((acc, rs) => {
            const serviceId = rs.service?.motelServiceId || rs.serviceId
            if (serviceId) {
              acc[`usage_${serviceId}`] = rs.quantity || 0
              acc[`total_${serviceId}`] = (rs.quantity || 0) * (rs.service?.price || 0)
            }
            return acc
          }, {})

          return {
            nameRoom: room.name,
            ...roomServices
          }
        })

        setRoomData(roomDataFormatted)
      } else {
        setMotelServices([])
        setRoomData([])
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error)
      setMotelServices([])
      setRoomData([])
    }
  }, [])

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
