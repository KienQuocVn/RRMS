import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  LinearProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { Colors } from '~/theme'
import { storage } from '~/configs/firebaseConfig'
import { updateCar } from '~/apis/carAPI'
import { getTenantsByRoomId } from '~/apis/tenantAPI'
import { toast } from 'react-toastify'

const MAX_IMAGES = 2

const EditVehicleModal = ({ open, onClose, vehicle, rooms, onSuccess }) => {
  const fileInputRef = useRef(null)
  const [tenants, setTenants] = useState([])
  const [formData, setFormData] = useState({
    tenantId: '',
    name: '',
    number: '',
    image: ''
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const room = rooms.find((r) => r.roomId === vehicle?.roomId)

  useEffect(() => {
    if (!open || !vehicle) return

    const urls = vehicle.image ? vehicle.image.split(',').filter(Boolean) : []
    setFormData({
      tenantId: vehicle.tenantId || '',
      name: vehicle.name || '',
      number: vehicle.number || '',
      image: vehicle.image || ''
    })
    setImagePreviews(urls.map((url) => ({ url, name: 'Ảnh xe' })))
    setUploadProgress(0)
  }, [open, vehicle])

  useEffect(() => {
    const fetchTenants = async () => {
      if (!open || !vehicle?.roomId) {
        setTenants([])
        return
      }
      try {
        const roomTenants = await getTenantsByRoomId(vehicle.roomId)
        setTenants(roomTenants)
      } catch (error) {
        console.error('Lỗi lấy khách thuê:', error)
        setTenants([])
        toast.error('Không thể tải danh sách khách thuê của phòng')
      }
    }

    fetchTenants()
  }, [open, vehicle?.roomId])

  const handleClose = () => {
    setTenants([])
    setFormData({ tenantId: '', name: '', number: '', image: '' })
    setImagePreviews([])
    setUploadProgress(0)
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const uploadImageToFirebase = (file) =>
    new Promise((resolve, reject) => {
      const imageName = uuidv4()
      const storageRef = ref(storage, `images/cars/${imageName}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          setUploadProgress(progress)
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
        }
      )
    })

  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const availableSlots = MAX_IMAGES - imagePreviews.length
    if (availableSlots <= 0) {
      toast.warning(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`)
      return
    }

    const filesToUpload = files.slice(0, availableSlots)
    if (files.length > availableSlots) {
      toast.warning(`Chỉ thêm được ${availableSlots} ảnh nữa`)
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadedUrls = []
      const newPreviews = []

      for (const file of filesToUpload) {
        if (!file.type.startsWith('image/')) {
          toast.warning(`"${file.name}" không phải file ảnh`)
          continue
        }
        const url = await uploadImageToFirebase(file)
        uploadedUrls.push(url)
        newPreviews.push({ url, name: file.name })
      }

      if (uploadedUrls.length > 0) {
        setImagePreviews((prev) => [...prev, ...newPreviews])
        setFormData((prev) => {
          const existing = prev.image ? prev.image.split(',').filter(Boolean) : []
          return { ...prev, image: [...existing, ...uploadedUrls].join(',') }
        })
        toast.success('Tải ảnh lên thành công')
      }
    } catch (error) {
      console.error('Upload ảnh thất bại:', error)
      toast.error('Tải ảnh lên thất bại')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => {
      const urls = prev.image ? prev.image.split(',').filter(Boolean) : []
      urls.splice(index, 1)
      return { ...prev, image: urls.join(',') }
    })
  }

  const handleSubmit = async () => {
    if (!vehicle?.carId) return

    if (!formData.tenantId) {
      toast.warning('Vui lòng chọn khách thuê')
      return
    }
    if (!formData.name.trim()) {
      toast.warning('Tên loại xe không được bỏ trống')
      return
    }
    if (!formData.number.trim()) {
      toast.warning('Biển số xe không được bỏ trống')
      return
    }
    if (uploading) {
      toast.warning('Vui lòng đợi ảnh tải lên xong')
      return
    }

    setLoading(true)
    try {
      const payload = {
        roomId: vehicle.roomId,
        tenantId: formData.tenantId,
        name: formData.name.trim(),
        number: formData.number.trim(),
        image: formData.image || ''
      }

      await updateCar(vehicle.carId, payload)
      toast.success('Cập nhật phương tiện thành công!')
      onSuccess()
      handleClose()
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật phương tiện'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!vehicle) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: '50%', mr: 1, display: 'flex' }}>
            <EditIcon sx={{ color: Colors.info }} fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Sửa thông tin xe
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#fbfbfb' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Phòng
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              value={room?.name_room || room?.name || '—'}
              disabled
              sx={{ bgcolor: '#f5f5f5' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Khách thuê
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <Select
                name="tenantId"
                value={formData.tenantId}
                onChange={handleChange}
                displayEmpty
                disabled={tenants.length === 0}>
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
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Thông tin xe
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên loại xe *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ borderLeft: `3px solid ${Colors.info}`, pl: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Hình ảnh
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
              Chọn tối đa {MAX_IMAGES} ảnh từ máy tính
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />

            <Box
              sx={{
                bgcolor: '#e3f2fd',
                border: '1px dashed #90caf9',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: uploading || imagePreviews.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
                opacity: uploading || imagePreviews.length >= MAX_IMAGES ? 0.7 : 1,
                '&:hover': {
                  bgcolor: uploading || imagePreviews.length >= MAX_IMAGES ? '#e3f2fd' : '#bbdefb'
                }
              }}
              onClick={() => {
                if (!uploading && imagePreviews.length < MAX_IMAGES) {
                  fileInputRef.current?.click()
                }
              }}>
              <CloudUploadIcon color="info" fontSize="large" sx={{ mb: 1 }} />
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline' }}>
                Chọn ảnh từ máy tính ({imagePreviews.length}/{MAX_IMAGES})
              </Typography>
            </Box>

            {uploading && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">
                  Đang tải ảnh lên... {uploadProgress}%
                </Typography>
              </Box>
            )}

            {imagePreviews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={`${preview.url}-${index}`} sx={{ position: 'relative' }}>
                    <img
                      src={preview.url}
                      alt={preview.name}
                      style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'white',
                        boxShadow: 1,
                        '&:hover': { bgcolor: '#ffebee' }
                      }}>
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="info"
          disabled={loading || uploading}
          startIcon={<EditIcon />}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditVehicleModal
