import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  styled,
  IconButton,
  CircularProgress,
  Checkbox
} from '@mui/material'
import { useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import axios from 'axios'
import Swal from 'sweetalert2'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '~/configs/firebaseConfig'
import { v4 } from 'uuid'
import { getByIdTenant, updateTenant } from '~/apis/tenantAPI'
import { env } from '~/configs/environment'
import { getRoomByMotelIdWContract } from '~/apis/roomAPI'
import { useParams } from 'react-router-dom'
import { normalizeTenantPayload } from '~/utils/apiAdapters'
import { Colors } from '~/theme'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const initialTenantData = {
  fullname: '',
  phone: '',
  idType: 'CCCD',
  cccd: '',
  zalo: '',
  gender: 'MALE',
  birthday: '',
  job: '',
  licenseDate: '',
  placeOfLicense: '',
  frontPhoto: '',
  backPhoto: '',
  address: '',
  relationship: '',
  type_of_tenant: false,
  temporaryResidence: false,
  informationVerify: false
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 56,
    borderRadius: '4px',
    backgroundColor: '#fff'
  },
  '& .MuiInputLabel-root': {
    fontSize: 13
  }
}

const SectionHeading = ({ title, description }) => (
  <Box sx={{ borderLeft: `4px solid ${Colors.success}`, pl: 0.75, mb: 1.25 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#20242a', lineHeight: 1.2 }}>{title}</Typography>
    <Typography sx={{ fontSize: 13, color: '#555', fontStyle: 'italic', lineHeight: 1.35 }}>{description}</Typography>
  </Box>
)

const UploadBox = ({ label, value, onChange, progress, compact = false }) => (
  <Box
    component="label"
    sx={{
      height: compact ? 120 : 100,
      border: compact ? '2px solid #1677ff' : '1px solid #d9e8fb',
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
        <CloudUploadIcon sx={{ fontSize: compact ? 34 : 30 }} />
        <Typography sx={{ color: '#333', fontSize: 13, textDecoration: 'underline' }}>{label}</Typography>
      </>
    )}
    {progress > 0 && progress < 100 && (
      <Typography sx={{ position: 'absolute', right: 8, bottom: 6, fontSize: 12, fontWeight: 700 }}>
        {progress}%
      </Typography>
    )}
    <VisuallyHiddenInput type="file" accept="image/*" onChange={onChange} />
  </Box>
)

const getRoomCapacity = (room) => room?.capacity || room?.maximumPeople || room?.maxPeople || room?.numberOfPeople || 1
const getRoomTenantCount = (room) => room?.tenantCount || room?.tenants?.length || room?.currentTenants || 1

const AddTenantModalV2 = ({ open, onClose, reloadData, avatar, editId }) => {
  const [tenant, setTenant] = useState(initialTenantData)
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [avatarImage, setAvatarImage] = useState('')
  const [frontProgress, setFrontProgress] = useState(0)
  const [backProgress, setBackProgress] = useState(0)
  const [phoneError, setPhoneError] = useState('')
  const [cccdError, setCccdError] = useState('')
  const { motelId } = useParams()

  const activeRooms = rooms.filter((room) => room.latestContract?.status === 'ACTIVE')

  useEffect(() => {
    if (!open || !motelId || !avatar) return

    const fetchRooms = async () => {
      setLoadingRooms(true)
      try {
        const dataRoom = await getRoomByMotelIdWContract(motelId)
        const occupiedRooms = (dataRoom || []).filter((room) => room.latestContract?.status === 'ACTIVE')
        setRooms(occupiedRooms)
        if (occupiedRooms.length > 0 && !selectedRoomId) {
          setSelectedRoomId(occupiedRooms[0].roomId)
        }
      } catch (error) {
        console.error('Error fetching active rooms:', error)
      } finally {
        setLoadingRooms(false)
      }
    }

    fetchRooms()
  }, [avatar, motelId, open, selectedRoomId])

  useEffect(() => {
    if (!open) return

    setTenant(initialTenantData)
    setAvatarImage('')
    setPhoneError('')
    setCccdError('')

    if (editId) {
      getByIdTenant(editId).then((res) => {
        const data = res.result || {}
        setTenant({
          ...initialTenantData,
          ...data,
          fullname: data.fullName || data.fullname || '',
          type_of_tenant: Boolean(data.typeOfTenant ?? data.type_of_tenant),
          gender: data.gender || 'MALE',
          idType: data.idType || 'CCCD'
        })
      })
    }
  }, [editId, open])

  const updateTenantField = (field, value) => {
    setTenant((prev) => ({ ...prev, [field]: value }))
  }

  const uploadImage = (file, field, setProgress) => {
    const storageRef = ref(storage, `images/tenant/${v4()}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (error) => console.error('Upload error:', error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => updateTenantField(field, url))
      }
    )
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setAvatarImage(reader.result)
    reader.readAsDataURL(file)
  }

  const validatePhone = (value) => {
    updateTenantField('phone', value)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/
    setPhoneError(value === '' || phoneRegex.test(value) ? '' : 'Số điện thoại không hợp lệ')
  }

  const validateCccd = (value) => {
    const numericValue = value.replace(/\D/g, '')
    updateTenantField('cccd', numericValue)
    const cccdRegex = /^(?:\d{9}|\d{12})$/
    setCccdError(numericValue === '' || cccdRegex.test(numericValue) ? '' : 'CMND/CCCD phải có 9 hoặc 12 chữ số')
  }

  const saveTenant = async (event) => {
    event.preventDefault()

    if (!selectedRoomId) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng chọn phòng đang ở để thêm khách thuê.' })
      return
    }

    const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null
    if (!token) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Thiếu mã đăng nhập, vui lòng đăng nhập lại.' })
      return
    }

    if (!tenant.fullname?.trim() || !tenant.phone?.trim()) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập tên và số điện thoại khách thuê.' })
      return
    }

    try {
      await axios.post(`${env.API_URL}/tenant/insert/${selectedRoomId}`, normalizeTenantPayload(tenant), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      })

      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Thêm khách thuê thành công!' })
      reloadData?.()
      onClose()
    } catch (error) {
      console.error('Failed to save tenant:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Thêm khách thuê không thành công.' })
    }
  }

  const handleUpdateClick = () => {
    if (!tenant || !editId) {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Vui lòng cung cấp đầy đủ thông tin khách hàng!' })
      return
    }

    updateTenant(editId, tenant)
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật khách hàng thành công!' })
        reloadData?.()
        onClose()
      })
      .catch((error) => {
        console.error('Failed to update tenant:', error)
        Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Cập nhật khách hàng thất bại!' })
      })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={saveTenant}
        sx={{
          position: 'absolute',
          inset: { xs: 0, md: '50% auto auto 50%' },
          transform: { xs: 'none', md: 'translate(-50%, -50%)' },
          width: { xs: '100%', md: 1120 },
          height: { xs: '100%', md: '92vh' },
          bgcolor: '#fff',
          boxShadow: 24,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
        <Box
          sx={{
            height: 54,
            px: 1.5,
            borderBottom: '1px solid #dde3ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                bgcolor: '#2b7ed7',
                color: '#fbfbfb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 4px #2b7ed7'
              }}>
              <PersonAddAlt1OutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2b3037' }}>
              Thêm thông tin khách thuê cho phòng
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              width: 38,
              height: 38,
              border: '3px solid #fdebe5',
              color: '#111',
              '&:hover': { bgcolor: '#fff7f4' }
            }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 1, py: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '452px 1fr' }, gap: 2 }}>
            <Box>
              <SectionHeading title="Danh sách phòng" description="Danh sách phòng để thêm khách thuê" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loadingRooms && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress size={28} />
                  </Box>
                )}

                {!loadingRooms && activeRooms.length === 0 && (
                  <Box sx={{ border: '1px dashed #cfd8e3', borderRadius: 1, p: 2, color: '#667085' }}>
                    Không có phòng đang ở để thêm khách thuê.
                  </Box>
                )}

                {!loadingRooms &&
                  activeRooms.map((room) => {
                    const isSelected = selectedRoomId === room.roomId

                    return (
                      <Box
                        key={room.roomId}
                        onClick={() => setSelectedRoomId(room.roomId)}
                        sx={{
                          minHeight: 68,
                          border: '1px solid',
                          borderColor: isSelected ? '#1677ff' : '#e5e7eb',
                          borderRadius: '9px',
                          px: 1.25,
                          py: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          bgcolor: isSelected ? '#f4f9ff' : '#fff',
                          '&:hover': { borderColor: '#1677ff', bgcolor: '#f8fbff' }
                        }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: '#ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#4b5563',
                            flexShrink: 0
                          }}>
                          <StorefrontOutlinedIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#20242a' }}>
                            {room.name || 'Không có tên phòng'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.6 }}>
                            <Typography sx={{ fontSize: 14, color: '#20242a' }}>
                              {Number(room.price || 0).toLocaleString('vi-VN')} đ
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#20242a' }}>
                          <PersonOutlineOutlinedIcon sx={{ fontSize: 19 }} />
                          <Typography sx={{ fontSize: 14 }}>
                            {getRoomTenantCount(room)}/{getRoomCapacity(room)} người
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}
              </Box>
            </Box>

            <Box>
              {avatar && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Box sx={{ width: 120 }}>
                    <UploadBox label="Hình đại diện" value={avatarImage} onChange={handleAvatarChange} compact />
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                <TextField
                  label="Tên khách thuê"
                  value={tenant.fullname}
                  onChange={(event) => updateTenantField('fullname', event.target.value)}
                  required
                  sx={fieldSx}
                />
                <TextField
                  label="Số điện thoại khách thuê"
                  value={tenant.phone}
                  onChange={(event) => validatePhone(event.target.value)}
                  error={Boolean(phoneError)}
                  helperText={phoneError}
                  sx={fieldSx}
                />
              </Box>

              {avatar && (
                <Box sx={{ mt: 1, px: 1, py: 1, bgcolor: '#fff4e6', borderRadius: '8px', display: 'flex', gap: 1 }}>
                  <Checkbox size="small" sx={{ p: 0.25, alignSelf: 'flex-start' }} />
                  <Box>
                    <Typography sx={{ color: '#64b5f6', fontSize: 14, fontWeight: 700 }}>
                      Sử dụng APP - Dành cho khách thuê
                    </Typography>
                    <Typography sx={{ color: '#777', fontSize: 13 }}>
                      Gửi hóa đơn tự động cho khách, hợp đồng online vv...
                    </Typography>
                  </Box>
                </Box>
              )}

              {avatar && (
                <RadioGroup
                  row
                  value={tenant.idType}
                  onChange={(event) => updateTenantField('idType', event.target.value)}
                  sx={{ mt: 1 }}>
                  <FormControlLabel value="CCCD" control={<Radio size="small" />} label="Định dạng CCCD" />
                  <FormControlLabel value="Passport" control={<Radio size="small" />} label="Định dạng Passport/Visa" />
                </RadioGroup>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="CMND/CCCD"
                  value={tenant.cccd}
                  onChange={(event) => validateCccd(event.target.value)}
                  error={Boolean(cccdError)}
                  helperText={cccdError}
                  sx={fieldSx}
                />
                <TextField
                  label="Zalo của khách"
                  value={tenant.zalo}
                  onChange={(event) => updateTenantField('zalo', event.target.value)}
                  sx={fieldSx}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <TextField
                    label="Ngày sinh"
                    type="date"
                    value={tenant.birthday}
                    onChange={(event) => updateTenantField('birthday', event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                  <FormControl sx={fieldSx} required>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={tenant.gender}
                      label="Giới tính"
                      onChange={(event) => updateTenantField('gender', event.target.value)}>
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nữ</MenuItem>
                      <MenuItem value="OTHER">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  label="Địa chỉ"
                  value={tenant.address}
                  onChange={(event) => updateTenantField('address', event.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  label="Nhập công việc"
                  value={tenant.job}
                  onChange={(event) => updateTenantField('job', event.target.value)}
                  sx={fieldSx}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <TextField
                    label="Ngày cấp CMND/CCCD"
                    type="date"
                    value={tenant.licenseDate}
                    onChange={(event) => updateTenantField('licenseDate', event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                  <TextField
                    label="Nơi cấp CMND/CCCD"
                    value={tenant.placeOfLicense}
                    onChange={(event) => updateTenantField('placeOfLicense', event.target.value)}
                    sx={fieldSx}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <UploadBox
                    label="Ảnh mặt trước CMND/CCCD"
                    value={tenant.frontPhoto}
                    progress={frontProgress}
                    onChange={(event) =>
                      event.target.files?.[0] && uploadImage(event.target.files[0], 'frontPhoto', setFrontProgress)
                    }
                  />
                  <UploadBox
                    label="Ảnh mặt sau CMND/CCCD"
                    value={tenant.backPhoto}
                    progress={backProgress}
                    onChange={(event) =>
                      event.target.files?.[0] && uploadImage(event.target.files[0], 'backPhoto', setBackProgress)
                    }
                  />
                </Box>

                <SectionHeading title="Thông tin quản lý" description="Tình trạng giấy tờ và tình trạng tạm trú" />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <TextField label="Ngày đăng ký tạm trú" type="date" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                  <TextField label="Ngày hết hạn tạm trú" type="date" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                </Box>

                <SectionHeading title="Thông tin xe" description="Thông tin xe của khách thuê" />
                <Box sx={{ border: '1px dashed #d5dbe3', borderRadius: '8px', p: 1.25 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>Thông tin xe #1</Typography>
                    <IconButton
                      size="small"
                      sx={{ border: '1px solid #ff4d4f', borderRadius: '4px', color: '#ff4d4f' }}>
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                    <TextField label="Tên loại xe" sx={fieldSx} />
                    <TextField label="Biển số xe" sx={fieldSx} />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: '#626b74', '&:hover': { bgcolor: '#505861' } }}>
                  Thêm xe mới
                </Button>

                <SectionHeading title="Mẫu Tạm trú" description="Mẫu dùng cho đăng ký tạm trú" />
                <FormControl sx={fieldSx}>
                  <InputLabel>Mẫu tạm trú áp dụng</InputLabel>
                  <Select defaultValue="CT01" label="Mẫu tạm trú áp dụng">
                    <MenuItem value="CT01">CT01 (Mặc định rrms)</MenuItem>
                  </Select>
                </FormControl>

                <SectionHeading title="Tình trạng" description="Tình trạng về thông tin cá nhân khách" />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tenant.type_of_tenant}
                      onChange={(event) => updateTenantField('type_of_tenant', event.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Là người liên hệ của phòng</Typography>
                      <Typography sx={{ fontSize: 13, color: '#555' }}>
                        Là người chịu trách nhiệm nhận hóa đơn, báo cáo các vấn đề của phòng
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tenant.temporaryResidence}
                      onChange={(event) => updateTenantField('temporaryResidence', event.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Đã đăng ký tạm trú</Typography>
                      <Typography sx={{ fontSize: 13, color: '#555' }}>
                        Tình trạng đăng ký tạm trú của khách thuê
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tenant.informationVerify}
                      onChange={(event) => updateTenantField('informationVerify', event.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Thông tin đã được xác minh</Typography>
                      <Typography sx={{ fontSize: 13, color: '#555' }}>
                        Tình trạng cung cấp thông tin hoặc giấy tờ để làm tạm trú
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid #dde3ea',
            px: 1.25,
            py: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            bgcolor: '#fff',
            flexShrink: 0
          }}>
          <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#626b74', '&:hover': { bgcolor: '#505861' } }}>
            Đóng
          </Button>
          <Button
            type={avatar ? 'submit' : 'button'}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={avatar ? undefined : handleUpdateClick}
            sx={{ bgcolor: Colors.success, '&:hover': { bgcolor: '#0a58ca' } }}>
            {avatar ? 'Thêm thông tin khách thuê' : 'Lưu'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddTenantModalV2
