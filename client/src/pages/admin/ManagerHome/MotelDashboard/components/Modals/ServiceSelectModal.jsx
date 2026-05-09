import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment
} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import Swal from 'sweetalert2'

import { updateSerivceRoom, DeleteRoomServiceByid } from '~/apis/roomAPI'

const ServiceSelectModal = ({ open, onClose, room, initialRoomServices = [], onUpdateSuccess }) => {
  const [roomServices, setRoomServices] = useState([])
  const [loading, setLoading] = useState(false)

  // Initialize state when modal opens or initial data changes
  useEffect(() => {
    if (open) {
      setRoomServices([...initialRoomServices])
    }
  }, [open, initialRoomServices])

  const handleCheckboxChange = (serviceId) => {
    setRoomServices((prev) =>
      prev.map((s) => {
        if (s.service.motelServiceId === serviceId) {
          return { ...s, isSelected: !s.isSelected }
        }
        return s
      })
    )
  }

  const handleQuantityChange = (serviceId, value) => {
    const quantity = parseFloat(value) || 0
    setRoomServices((prev) =>
      prev.map((s) => {
        if (s.service.motelServiceId === serviceId) {
          return {
            ...s,
            quantity,
            totalPrice: quantity * (s.service?.price || 0)
          }
        }
        return s
      })
    )
  }

  const handleApplyServices = async () => {
    setLoading(true)
    try {
      const servicesToDelete = roomServices.filter((s) => !s.isSelected)
      const servicesToUpdate = roomServices.filter((s) => s.isSelected)

      // Delete unselected services
      for (const service of servicesToDelete) {
        if (service.roomServiceId) {
          await DeleteRoomServiceByid(service.roomServiceId)
        }
      }

      // Update selected services
      for (const service of servicesToUpdate) {
        if (service.roomServiceId) {
          const serviceUpdate = {
            roomServiceId: service.roomServiceId,
            roomId: service.room.roomId || room.roomId,
            serviceId: service.service.motelServiceId,
            quantity: service.quantity
          }
          await updateSerivceRoom(service.roomServiceId, serviceUpdate)
        }
      }

      Swal.fire({ icon: 'success', title: 'Thông báo', text: 'Cập nhật dịch vụ phòng thành công!' })
      
      if (onUpdateSuccess) onUpdateSuccess()
      onClose()

    } catch (error) {
      console.error('Error updating room services:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Cập nhật dịch vụ thất bại.' })
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InboxIcon />
        Chỉnh sửa dịch vụ sử dụng phòng &quot;{room?.name}&quot;
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, bgcolor: '#f8f9fa', p: 3 }}>
        {roomServices.length > 0 ? (
          roomServices.map((rs, index) => (
            <Grid container alignItems="center" spacing={2} key={rs.roomServiceId || index} sx={{ mb: 3 }}>
              <Grid item xs={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rs.isSelected}
                      onChange={() => handleCheckboxChange(rs.service.motelServiceId)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {rs.service?.nameService}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Giá: {Number(rs.service?.price || 0).toLocaleString('vi-VN')} đ / {rs.service?.chargetype}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  size="small"
                  type="number"
                  disabled={!rs.isSelected}
                  value={rs.quantity || 0}
                  onChange={(e) => handleQuantityChange(rs.service.motelServiceId, e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{rs.service?.chargetype}</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Phòng này chưa có dịch vụ nào được cấu hình.
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy bỏ
        </Button>
        <Button 
          onClick={handleApplyServices} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Áp dụng dịch vụ'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ServiceSelectModal
