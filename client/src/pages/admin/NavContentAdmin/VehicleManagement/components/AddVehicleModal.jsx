import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddIcon from '@mui/icons-material/Add'
import { Colors } from '~/theme'
import { createCar } from '~/apis/carAPI'
import { getContractByIdRoom } from '~/apis/contractTemplateAPI'
import { toast } from 'react-toastify'

const AddVehicleModal = ({ open, onClose, rooms, motelId, onSuccess }) => {
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [tenants, setTenants] = useState([])
  const [formData, setFormData] = useState({
    tenantId: '',
    name: '',
    number: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)

  // Fetch tenants (từ active contracts) khi chọn phòng
  useEffect(() => {
    const fetchTenants = async () => {
      if (!selectedRoomId) {
        setTenants([])
        return
      }
      try {
        const contractsResponse = await getContractByIdRoom(selectedRoomId)
        const contracts = Array.isArray(contractsResponse)
          ? contractsResponse
          : contractsResponse
            ? [contractsResponse]
            : []
        // Lọc các hợp đồng ACTIVE và lấy thông tin tenant
        const activeContracts = contracts.filter((c) => c.status === 'ACTIVE')
        const roomTenants = activeContracts.map((c) => c.tenant).filter(Boolean)
        setTenants(roomTenants)

        // Reset tenant đã chọn nếu không có trong danh sách mới
        if (roomTenants.length > 0) {
          setFormData((prev) => ({ ...prev, tenantId: roomTenants[0].tenantId }))
        } else {
          setFormData((prev) => ({ ...prev, tenantId: '' }))
        }
      } catch (error) {
        console.error('Lỗi lấy khách thuê:', error)
      }
    }

    fetchTenants()
  }, [selectedRoomId])

  const handleClose = () => {
    setSelectedRoomId('')
    setFormData({ tenantId: '', name: '', number: '', image: '' })
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedRoomId || !formData.tenantId || !formData.name || !formData.number) {
      toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)
    try {
      const payload = {
        roomId: selectedRoomId,
        tenantId: formData.tenantId,
        name: formData.name,
        number: formData.number,
        image: formData.image || '' // Mặc định rỗng nếu chưa có
      }

      await createCar(payload)
      toast.success('Thêm phương tiện thành công!')
      onSuccess()
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm phương tiện')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: '50%', mr: 1, display: 'flex' }}>
            <AddIcon sx={{ color: Colors.info }} fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Thêm thông tin xe cho giường
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#fbfbfb' }}>
        <Grid container spacing={3}>
          {/* Cột trái: Chọn giường (phòng) */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Chọn giường sử dụng xe
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                Danh sách giường để thêm xe
              </Typography>
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
              {rooms.map((room) => (
                <Box
                  key={room.roomId}
                  onClick={() => setSelectedRoomId(room.roomId)}
                  sx={{
                    border: `1px solid ${selectedRoomId === room.roomId ? Colors.info : '#e0e0e0'}`,
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    cursor: 'pointer',
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: Colors.info,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
                    }
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#e0e0e0', mr: 2 }}>
                      <Box component="span" sx={{ fontSize: 20 }}>
                        🏪
                      </Box>
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {room.name_room || room.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'inline-block',
                          bgcolor: Colors.info,
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          fontSize: 10,
                          mb: 0.5
                        }}>
                        Đang ở
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          $ {room.price?.toLocaleString()} đ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          👤 1/1 người
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Cột phải: Chọn khách thuê & form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Chọn khách thuê
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                Chọn khách thuê đang sử dụng xe này
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={!selectedRoomId || tenants.length === 0}>
                  <MenuItem value="" disabled>
                    -- Chọn khách thuê --
                  </MenuItem>
                  {tenants.map((tenant) => (
                    <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                      {tenant.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Thông tin
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                Thông tin xe
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tên loại xe *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Biển số xe *"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Hình ảnh
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                Hình ảnh
              </Typography>
              <Box
                sx={{
                  bgcolor: '#e3f2fd',
                  border: '1px dashed #90caf9',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#bbdefb' }
                }}
                onClick={() => {
                  // TODO: Thay bằng file input thật
                  const fakeImageUrl = prompt('Nhập URL hình ảnh (tạm thời):')
                  if (fakeImageUrl) {
                    setFormData((prev) => ({
                      ...prev,
                      image: prev.image ? `${prev.image},${fakeImageUrl}` : fakeImageUrl
                    }))
                    toast.success('Đã thêm URL hình ảnh')
                  }
                }}>
                <CloudUploadIcon color="info" fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline' }}>
                  Chọn tối đa 2 ảnh
                </Typography>

                {/* Hiển thị số ảnh đã upload */}
                {formData.image && (
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Đã chọn {formData.image.split(',').length} ảnh
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#fbfbfb' }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: '#757575', '&:hover': { bgcolor: '#616161' } }}>
          Đóng
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="info" disabled={loading} startIcon={<AddIcon />}>
          {loading ? 'Đang thêm...' : 'Thêm thông tin xe'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddVehicleModal
