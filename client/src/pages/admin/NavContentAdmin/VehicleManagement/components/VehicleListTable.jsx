import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
  Avatar,
  ListItemIcon
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { Colors } from '~/theme'
import { deleteCar } from '~/apis/carAPI'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const VehicleRow = ({ vehicle, onRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleMenuClose()
    try {
      const result = await Swal.fire({
        title: 'Xóa phương tiện',
        text: 'Bạn có chắc chắn muốn xóa phương tiện này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      })

      if (result.isConfirmed) {
        await deleteCar(vehicle.carId)
        toast.success('Xóa phương tiện thành công')
        onRefresh()
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi xóa')
    }
  }

  // Phân tích hình ảnh (có thể lưu nhiều URL cách nhau bằng dấu phẩy)
  const images = vehicle.image ? vehicle.image.split(',') : []
  const displayImage = images.length > 0 ? images[0] : null

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: '#fff' }}>
      <TableCell sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <Avatar sx={{ bgcolor: Colors.error, width: 32, height: 32, mr: 2 }}>
          <DirectionsCarIcon fontSize="small" />
        </Avatar>
        <Typography variant="body2">{vehicle.tenantName || 'Không có tên'}</Typography>
      </TableCell>
      <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>{vehicle.name}</TableCell>
      <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>{vehicle.number}</TableCell>
      <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
        {displayImage ? (
          <img src={displayImage} alt="xe" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Chưa có
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>Xe máy</TableCell> {/* Có thể điều chỉnh dựa vào data */}
      <TableCell align="right" sx={{ borderBottom: '1px solid #f0f0f0' }}>
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" color="info" />
            </ListItemIcon>
            Sửa
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Xóa
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}

const RoomGroup = ({ room, vehicles, onRefresh }) => {
  const [open, setOpen] = useState(true)

  if (!vehicles || vehicles.length === 0) return null

  return (
    <>
      <TableRow sx={{ bgcolor: '#e3f2fd' }}>
        <TableCell colSpan={6} sx={{ py: 1, borderBottom: '1px solid #bbdefb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
            {open ? <ArrowDropDownIcon fontSize="small" /> : <ArrowRightIcon fontSize="small" />}
            <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
              {room.name_room || room.name || 'Phòng'}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {vehicles.map((vehicle) => (
                  <VehicleRow key={vehicle.carId} vehicle={vehicle} onRefresh={onRefresh} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const VehicleListTable = ({ vehicles, rooms, onRefresh }) => {
  // Nhóm xe theo roomId
  const groupedVehicles = rooms
    .map((room) => ({
      ...room,
      vehicles: vehicles.filter((v) => v.roomId === room.roomId)
    }))
    .filter((g) => g.vehicles.length > 0) // Chỉ hiển thị phòng có xe

  // Lấy danh sách xe chưa thuộc phòng nào (trường hợp data lỗi)
  const orphanedVehicles = vehicles.filter((v) => !rooms.some((r) => r.roomId === v.roomId))

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: '25%', py: 2 }}>Tên khách thuê</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Tên xe</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Biển số xe</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Hình xe</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Loại xe</TableCell>
            <TableCell align="right" sx={{ width: '5%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedVehicles.length === 0 && orphanedVehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  Chưa có dữ liệu phương tiện
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {groupedVehicles.map((group) => (
                <RoomGroup key={group.roomId} room={group} vehicles={group.vehicles} onRefresh={onRefresh} />
              ))}

              {orphanedVehicles.length > 0 && (
                <RoomGroup room={{ roomId: 'other', name: 'Khác' }} vehicles={orphanedVehicles} onRefresh={onRefresh} />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default VehicleListTable
