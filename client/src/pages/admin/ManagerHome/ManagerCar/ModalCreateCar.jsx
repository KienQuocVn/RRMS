import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Swal from 'sweetalert2'
import { getRoomById } from '~/apis/roomAPI'
import { createCar, getCarByCarId, updateCar } from '~/apis/carAPI'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '~/configs/firebaseConfig'

function ModalCreateCar({ open, onClose, roomId, carId }) {
  const [room, setRoom] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [car, setCar] = useState({
    name: '',
    number: '',
    image: '',
    roomId: roomId
  })

  // Handle Input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCar((prev) => ({ ...prev, [name]: value }))
    // Clear error
    if (value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  // Handle Image Upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setLoading(true)
      const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`)
      try {
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        setSelectedImage(downloadURL)
        setCar((prev) => ({ ...prev, image: downloadURL }))
      } catch (error) {
        console.error('Lỗi khi tải lên hình ảnh:', error)
        Swal.fire({ icon: 'error', title: 'Lỗi upload ảnh!', text: 'Vui lòng thử lại.' })
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchDataRoom = async (id) => {
    try {
      const response = await getRoomById(id)
      if (response) setRoom(response)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDataCar = async (id) => {
    try {
      const response = await getCarByCarId(id)
      if (response?.data) {
        setCar(response.data)
        setSelectedImage(response.data.image)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    // Validate
    const newErrors = {
      name: car.name.trim() === '',
      number: car.number.trim() === ''
    }
    setErrors(newErrors)

    if (newErrors.name || newErrors.number) {
      return
    }

    try {
      if (roomId) {
        const payload = { ...car, roomId: room.roomId }

        if (carId === 'Create') {
          await createCar(payload)
          Swal.fire({
            icon: 'success',
            title: 'Tạo thành công!',
            text: 'Bạn đã thêm thông tin xe thành công.',
            confirmButtonText: 'Đóng'
          })
        } else {
          await updateCar(carId, payload)
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            text: 'Bạn đã cập nhật thông tin xe thành công.',
            confirmButtonText: 'Đóng'
          })
        }
        onClose()
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Không thể xử lý, vui lòng thử lại sau.',
        confirmButtonText: 'Đóng'
      })
    }
  }

  useEffect(() => {
    if (open) {
      if (roomId) fetchDataRoom(roomId)
      if (carId !== 'Create' && carId) {
        fetchDataCar(carId)
      } else {
        setCar({ name: '', number: '', image: '', roomId: roomId })
        setSelectedImage(null)
        setErrors({})
      }
    }
  }, [roomId, carId, open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <DirectionsCarIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          {carId === 'Create' ? 'Thêm thông tin xe' : 'Cập nhật thông tin xe'} -{' '}
          {room ? room.name : 'Đang tải...'}
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ mt: 1 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Tên loại xe (vd: Honda Vision)"
            name="name"
            value={car.name}
            onChange={handleInputChange}
            error={errors.name}
            helperText={errors.name ? 'Vui lòng nhập tên loại xe' : ''}
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Biển số xe"
            name="number"
            value={car.number}
            onChange={handleInputChange}
            error={errors.number}
            helperText={errors.number ? 'Vui lòng nhập biển số xe' : ''}
            required
            variant="outlined"
          />

          <Box>
            <Typography variant="subtitle2" fontWeight="600" mb={1}>
              Hình ảnh xe (Tùy chọn)
            </Typography>
            <input
              type="file"
              style={{ display: 'none' }}
              id="car-image-upload"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="car-image-upload" style={{ width: '100%', display: 'block', cursor: 'pointer' }}>
              <Paper
                variant="outlined"
                sx={{
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'grey.300',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    borderColor: 'primary.main'
                  }
                }}>
                {loading ? (
                  <Typography color="text.secondary">Đang tải ảnh lên...</Typography>
                ) : selectedImage ? (
                  <Box
                    component="img"
                    src={selectedImage}
                    alt="Car"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography color="text.secondary">Nhấn để chọn 1 ảnh</Typography>
                  </>
                )}
              </Paper>
            </label>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" variant="text">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {carId === 'Create' ? 'Thêm mới' : 'Lưu cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCreateCar
