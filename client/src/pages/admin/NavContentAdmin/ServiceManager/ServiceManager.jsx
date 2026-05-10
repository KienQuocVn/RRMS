import axios from 'axios'
import { useEffect, useState } from 'react'
import { Box, Paper, Grid } from '@mui/material'
import ServiceList from './components/ServiceList'
import UsageReport from './components/UsageReport'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import ModelCreateService from './ModelCreateService'
import ModelUpdateService from './ModelUpdateService'
import { env } from '~/configs/environment'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { isValidRouteParam } from '~/utils/apiAdapters'



const ServiceManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null
  const { motelId } = useParams() 
  const [motelServices, setMotelServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [roomData, setRoomData] = useState([]);
  const generateColumns = () => {
    const dynamicColumns = motelServices.map(service => ({
      title: service.nameService, // Tiêu đề là tên dịch vụ
      columns: [
        { title: 'Sử dụng', field: `usage_${service.motelServiceId}`, hozAlign: 'right', sorter: 'number', width: 75 },
        { title: 'Thành tiền', field: `total_${service.motelServiceId}`, hozAlign: 'center', width: 100 }
      ]
    }));
    
    return [
      { title: 'Tên phòng', field: 'nameRoom', hozAlign: 'center', width: 100 },
      ...dynamicColumns
    ];
  };

  const columns = generateColumns();

  const options = {
    height: '400px', // Chiều cao của bảng
    maxWidth: '100%',
    movableColumns: true, // Cho phép di chuyển cột
    resizableRows: true, // Cho phép thay đổi kích thước hàng
    movableRows: true,
    resizableColumns: true, // Cho phép thay đổi kích thước cột
    resizableColumnFit: true,
    layout: 'fitColumns',
    responsiveLayout: 'collapse',
    rowHeader: {
      formatter: 'responsiveCollapse',
      width: 10,
      minWidth: 30,
      hozAlign: 'center',
      resizable: false,
      headerSort: false
    },
    columnHeaderVertAlign: 'bottom'
  }



  const fetchMotelServicesWithCount = async (id) => {
    try {
      if (!isValidRouteParam(id)) {
        setMotelServices([]);
        setRoomData([]);
        return;
      }

      const serviceResponse = await axios.get(`${env.API_URL}/api/v1/motels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const roomResponse = await axios.get(`${env.API_URL}/api/v1/rooms/motel/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (serviceResponse.data?.code === 200 && serviceResponse.data.result?.motelServices) {
        const motelServices = serviceResponse.data?.result?.motelServices || [];
        const rooms = roomResponse.data?.result || [];

        const serviceCounts = {};
        rooms.forEach((room) => {
          const services = room.services || [];
          services.forEach((service) => {
            const serviceId = service.service?.motelServiceId || service.serviceId;
            if (serviceId) {
              serviceCounts[serviceId] = (serviceCounts[serviceId] || 0) + 1;
            }
          });
        });

        const servicesWithCount = motelServices.map((service) => ({
          ...service,
          count: serviceCounts[service.motelServiceId] || 0,
        }));

        setMotelServices(servicesWithCount);

        // Chuẩn bị dữ liệu phòng cho bảng
        const roomDataFormatted = rooms.map((room) => {
          const roomServices = (room.services || []).reduce((acc, service) => {
            const serviceId = service.service?.motelServiceId || service.serviceId;
            if (serviceId) {
              acc[`usage_${serviceId}`] = service.quantity || 0;
              acc[`total_${serviceId}`] = (service.quantity || 0) * (service.service?.price || 0);
            }
            return acc;
          }, {});
          

          return {
            nameRoom: room.name,
            ...roomServices
          };
        });

        setRoomData(roomDataFormatted);
      } else {
        setMotelServices([]);
        setRoomData([]);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setMotelServices([]);
      setRoomData([]);
    }
  };
  
  

  const deleteMotelService = async (serviceId) => {
    // Kiểm tra xem serviceId có tồn tại không
    if (!serviceId) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Không có dịch vụ nào để xóa.'
      })
      return
    }

    // Xác nhận xóa dịch vụ
    const confirmDelete = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Không'
    })

    // Nếu người dùng không xác nhận, thoát hàm
    if (!confirmDelete.isConfirmed) {
      return
    }

    try {
      // Thực hiện yêu cầu xóa dịch vụ
      await axios.delete(`${env.API_URL}/api/v1/motel-services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

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
  }, [motelId]) 

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
              columns={columns}
              options={options}
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
