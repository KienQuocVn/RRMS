import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment
} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Swal from 'sweetalert2'

import { createRoom, createRoomService } from '~/apis/roomAPI'
import { updateContractStatusClose } from '~/apis/contractTemplateAPI'

const AddRoomModal = ({ open, onClose, activeMotelId, motelServices = [], onAddSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    group: 'a',
    area: '',
    price: '',
    invoiceDate: 1,
    prioritize: 'Tất cả',
    selectedServices: []
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseFloat(value) || ''
          : ['area', 'invoiceDate'].includes(name)
            ? parseInt(value, 10) || ''
            : value
    }))
  }

  const handleServiceSelection = (serviceId, isChecked) => {
    setFormData((prev) => {
      let updatedServices = [...prev.selectedServices]
      if (isChecked) {
        updatedServices.push({ serviceId, quantity: 1 })
      } else {
        updatedServices = updatedServices.filter((s) => s.serviceId !== serviceId)
      }
      return { ...prev, selectedServices: updatedServices }
    })
  }

  const handleQuantityChange = (serviceId, quantity) => {
    setFormData((prev) => {
      const updatedServices = prev.selectedServices.map((s) =>
        s.serviceId === serviceId ? { ...s, quantity: parseInt(quantity) || 0 } : s
      )
      return { ...prev, selectedServices: updatedServices }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.price) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập tên phòng và giá thuê.' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        motelId: activeMotelId,
        deposit: null,
        debt: null,
        moveInDate: null,
        contractDuration: null,
        status: false,
        finance: 'wait',
        countTenant: 0,
        paymentCircle: null
      }

      const response = await createRoom(payload)
      const roomId = response.roomId

      // Save selected services
      if (formData.selectedServices.length > 0) {
        const servicePromises = formData.selectedServices.map((service) =>
          createRoomService({
            roomId: roomId,
            serviceId: service.serviceId,
            quantity: service.quantity
          })
        )
        await Promise.all(servicePromises)
      }

      await updateContractStatusClose('IATExpire', 10).catch(() => {}) // API might fail, but ignore

      Swal.fire({ icon: 'success', title: 'Thông báo', text: 'Thêm phòng thành công!' })

      // Reset form
      setFormData({
        name: '',
        group: 'a',
        area: '',
        price: '',
        invoiceDate: 1,
        prioritize: 'Tất cả',
        selectedServices: []
      })

      onClose()
      if (onAddSuccess) onAddSuccess()
    } catch (error) {
      console.error('Error creating room:', error)
      Swal.fire({ icon: 'error', title: 'Thông báo', text: 'Có lỗi xảy ra khi thêm phòng.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#20a9e7', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddBoxIcon />
        Thêm phòng
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin phòng
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Nhập các thông tin cơ bản của phòng
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Tên phòng *" name="name" fullWidth value={formData.name} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Tầng/dãy"
              name="group"
              fullWidth
              value={formData.group}
              onChange={handleInputChange}>
              <MenuItem value="a">Tầng A</MenuItem>
              <MenuItem value="b">Tầng B</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Diện tích (m2)"
              name="area"
              type="number"
              fullWidth
              value={formData.area}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá thuê (đ) *"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Ngày lập hóa đơn hàng tháng"
              name="invoiceDate"
              fullWidth
              value={formData.invoiceDate}
              onChange={handleInputChange}>
              {Array.from({ length: 31 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Ngày {i + 1}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Ưu tiên người thuê"
              name="prioritize"
              fullWidth
              value={formData.prioritize}
              onChange={handleInputChange}>
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="Ưu tiên nữ">Ưu tiên nữ</MenuItem>
              <MenuItem value="Ưu tiên nam">Ưu tiên nam</MenuItem>
              <MenuItem value="Ưu tiên gia đình">Ưu tiên gia đình</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Dịch vụ sử dụng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thêm dịch vụ sử dụng như: điện, nước, rác, wifi...
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
          {motelServices.length > 0 ? (
            motelServices.map((service) => {
              const isSelected = formData.selectedServices.some((s) => s.serviceId === service.motelServiceId)
              const selectedService = formData.selectedServices.find((s) => s.serviceId === service.motelServiceId)

              return (
                <Grid container alignItems="center" spacing={2} key={service.motelServiceId} sx={{ mb: 2 }}>
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleServiceSelection(service.motelServiceId, e.target.checked)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {service.nameService}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Giá: {Number(service.price).toLocaleString('vi-VN')}đ / {service.chargetype}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      type="number"
                      disabled={!isSelected}
                      value={selectedService?.quantity || 0}
                      onChange={(e) => handleQuantityChange(service.motelServiceId, e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{service.chargetype}</InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>
              )
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chưa có dịch vụ nào được thiết lập cho khu trọ này.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={<AddBoxIcon />}
          sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1b8ec4' } }}>
          {loading ? 'Đang thêm...' : 'Thêm phòng'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddRoomModal
