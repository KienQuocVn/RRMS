import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  IconButton,
  Checkbox,
  Divider,
  styled
} from '@mui/material'
import { useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import Radio from '@mui/material/Radio'
import Swal from 'sweetalert2'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '~/configs/firebaseConfig'
import { v4 } from 'uuid'
import { getByIdTenant, updateTenant } from '~/apis/tenantAPI'
import { normalizeTenantPayload } from '~/utils/apiAdapters'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const initialData = {
  fullname: '',
  phone: '',
  idType: 'CCCD',
  cccd: '',
  zalo: '',
  gender: 'MALE',
  birthday: '',
  job: '',
  address: '',
  licenseDate: '',
  placeOfLicense: '',
  frontPhoto: '',
  backPhoto: '',
  type_of_tenant: false,
  temporaryResidence: false,
  informationVerify: false
}

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '6px', backgroundColor: '#fff' },
  '& .MuiInputLabel-root': { fontSize: 13 }
}

const SectionLabel = ({ title, sub }) => (
  <Box sx={{ borderLeft: '4px solid #2b7ed7', pl: 1, mb: 1, mt: 1.5 }}>
    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
    {sub && <Typography sx={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>{sub}</Typography>}
  </Box>
)

const UploadBox = ({ label, value, onChange, progress }) => (
  <Box
    component="label"
    sx={{
      height: 100,
      border: '1px solid #d9e8fb',
      borderRadius: '6px',
      bgcolor: '#dcebff',
      color: '#1677ff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 0.75,
      overflow: 'hidden',
      position: 'relative'
    }}>
    {value ? (
      <Box component="img" src={value} alt={label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <>
        <CloudUploadIcon sx={{ fontSize: 30 }} />
        <Typography sx={{ color: '#333', fontSize: 12, textDecoration: 'underline' }}>{label}</Typography>
      </>
    )}
    {progress > 0 && progress < 100 && (
      <Typography sx={{ position: 'absolute', right: 8, bottom: 6, fontSize: 11, fontWeight: 700 }}>
        {progress}%
      </Typography>
    )}
    <VisuallyHiddenInput type="file" accept="image/*" onChange={onChange} />
  </Box>
)

function EditTenantModal({ open, onClose, tenantId, onSuccess }) {
  const [tenant, setTenant] = useState(initialData)
  const [frontProgress, setFrontProgress] = useState(0)
  const [backProgress, setBackProgress] = useState(0)
  const [phoneError, setPhoneError] = useState('')

  const updateField = (field, value) => setTenant((prev) => ({ ...prev, [field]: value }))

  useEffect(() => {
    if (!open || !tenantId) return
    setTenant(initialData)
    setPhoneError('')

    getByIdTenant(tenantId)
      .then((res) => {
        const data = res?.result || {}
        setTenant({
          ...initialData,
          ...data,
          // API trả về fullName (PascalCase), map sang fullname
          fullname: data.fullName || data.fullname || '',
          type_of_tenant: Boolean(data.typeOfTenant ?? data.type_of_tenant),
          gender: data.gender || 'MALE',
          idType: data.idType || 'CCCD',
          birthday: data.birthday || '',
          licenseDate: data.licenseDate || ''
        })
      })
      .catch((err) => console.error('Error loading tenant:', err))
  }, [open, tenantId])

  const uploadImage = (file, field, setProgress) => {
    const storageRef = ref(storage, `images/tenant/${v4()}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => console.error('Upload error:', err),
      () => getDownloadURL(uploadTask.snapshot.ref).then((url) => updateField(field, url))
    )
  }

  const validatePhone = (value) => {
    updateField('phone', value)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/
    setPhoneError(value === '' || phoneRegex.test(value) ? '' : 'Số điện thoại không hợp lệ')
  }

  const handleSave = async () => {
    if (!tenant.fullname?.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Vui lòng nhập tên khách thuê.' })
      return
    }

    try {
      await updateTenant(tenantId, normalizeTenantPayload(tenant))
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật khách thuê thành công!' })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Update tenant error:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Cập nhật thất bại, vui lòng thử lại!' })
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95vw', sm: 520 },
          maxHeight: '92vh',
          bgcolor: '#fff',
          borderRadius: '10px',
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: '#20a9e722',
                color: '#2b7ed7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <EditIcon />
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Chỉnh sửa khách thuê</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ border: '2px solid #fdebe5', color: '#333', '&:hover': { bgcolor: '#fff7f4' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Avatar upload */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 120 }}>
              <UploadBox
                label="Hình đại diện"
                compact
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onloadend = () => updateField('avatar', reader.result)
                  reader.readAsDataURL(file)
                }}
              />
            </Box>
          </Box>

          {/* Tên + SĐT */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Tên khách thuê *"
              size="small"
              value={tenant.fullname}
              onChange={(e) => updateField('fullname', e.target.value)}
              sx={fieldSx}
              fullWidth
            />
            <TextField
              label="Số điện thoại khách thuê"
              size="small"
              value={tenant.phone}
              onChange={(e) => validatePhone(e.target.value)}
              error={Boolean(phoneError)}
              helperText={phoneError}
              sx={fieldSx}
              fullWidth
            />
          </Box>

          {/* Sử dụng APP */}
          <Box
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: '#fff4e6',
              borderRadius: '8px',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start'
            }}>
            <Checkbox size="small" sx={{ p: 0.25, mt: 0.25 }} />
            <Box>
              <Typography sx={{ color: '#64b5f6', fontSize: 13, fontWeight: 700 }}>
                Sử dụng APP - Dành cho khách thuê
              </Typography>
              <Typography sx={{ color: '#777', fontSize: 12 }}>
                Gửi hóa đơn tự động cho khách, hợp đồng online vv...
              </Typography>
            </Box>
          </Box>

          {/* ID Type */}
          <RadioGroup row value={tenant.idType} onChange={(e) => updateField('idType', e.target.value)}>
            <FormControlLabel value="CCCD" control={<Radio size="small" />} label="Định dạng CCCD" />
            <FormControlLabel value="Passport" control={<Radio size="small" />} label="Định dạng Passport/Visa" />
          </RadioGroup>

          {/* CCCD */}
          <TextField
            label="CMND/CCCD"
            size="small"
            value={tenant.cccd}
            onChange={(e) => updateField('cccd', e.target.value)}
            sx={fieldSx}
            fullWidth
          />

          {/* Zalo */}
          <TextField
            label="Zalo của khách"
            size="small"
            value={tenant.zalo || ''}
            onChange={(e) => updateField('zalo', e.target.value)}
            sx={fieldSx}
            fullWidth
          />

          {/* Birthday + Gender */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Ngày sinh"
              type="date"
              size="small"
              value={tenant.birthday || ''}
              onChange={(e) => updateField('birthday', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <FormControl size="small" sx={fieldSx} fullWidth>
              <InputLabel>Giới tính *</InputLabel>
              <Select value={tenant.gender} label="Giới tính *" onChange={(e) => updateField('gender', e.target.value)}>
                <MenuItem value="MALE">Nam</MenuItem>
                <MenuItem value="FEMALE">Nữ</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Địa chỉ, Công việc */}
          <TextField
            label="Địa chỉ"
            size="small"
            value={tenant.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            sx={fieldSx}
            fullWidth
          />
          <TextField
            label="Nhập công việc"
            size="small"
            value={tenant.job || ''}
            onChange={(e) => updateField('job', e.target.value)}
            sx={fieldSx}
            fullWidth
          />

          {/* License */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Ngày cấp CMND/CCCD"
              type="date"
              size="small"
              value={tenant.licenseDate || ''}
              onChange={(e) => updateField('licenseDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              label="Nơi cấp CMND/CCCD"
              size="small"
              value={tenant.placeOfLicense || ''}
              onChange={(e) => updateField('placeOfLicense', e.target.value)}
              sx={fieldSx}
            />
          </Box>

          {/* Ảnh CCCD */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <UploadBox
              label="Ảnh mặt trước CMND/CCCD"
              value={tenant.frontPhoto}
              progress={frontProgress}
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'frontPhoto', setFrontProgress)}
            />
            <UploadBox
              label="Ảnh mặt sau CMND/CCCD"
              value={tenant.backPhoto}
              progress={backProgress}
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'backPhoto', setBackProgress)}
            />
          </Box>

          <Divider />

          {/* Tình trạng switches */}
          <SectionLabel title="Tình trạng" sub="Tình trạng về thông tin cá nhân khách" />
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(tenant.type_of_tenant)}
                onChange={(e) => updateField('type_of_tenant', e.target.checked)}
                color="success"
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Là người liên hệ của phòng</Typography>
                <Typography sx={{ fontSize: 12, color: '#555' }}>
                  Là người chịu trách nhiệm nhận hóa đơn, báo cáo các vấn đề của phòng
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(tenant.temporaryResidence)}
                onChange={(e) => updateField('temporaryResidence', e.target.checked)}
                color="success"
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Đã đăng ký tạm trú</Typography>
                <Typography sx={{ fontSize: 12, color: '#555' }}>Tình trạng đăng ký tạm trú của khách thuê</Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(tenant.informationVerify)}
                onChange={(e) => updateField('informationVerify', e.target.checked)}
                color="success"
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Thông tin đã được xác minh</Typography>
                <Typography sx={{ fontSize: 12, color: '#555' }}>
                  Tình trạng cung cấp thông tin hoặc giấy tờ để làm tạm trú
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid #e5e7eb',
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            flexShrink: 0,
            bgcolor: '#fff'
          }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ bgcolor: '#626b74', '&:hover': { bgcolor: '#505861' }, px: 3 }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: '#2b7ed7', '&:hover': { bgcolor: '#0a58ca' }, px: 3 }}>
            Chỉnh sửa khách thuê
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditTenantModal
