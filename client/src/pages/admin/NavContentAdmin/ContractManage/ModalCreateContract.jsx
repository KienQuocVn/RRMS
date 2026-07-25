import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import BookIcon from '@mui/icons-material/Book'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Swal from 'sweetalert2'
import {
  getRoomById,
  getServiceRoombyRoomId,
  updateSerivceRoom,
  DeleteRoomServiceByid,
  createRoomService
} from '~/apis/roomAPI'
import { getMotelById } from '~/apis/motelAPI'
import { getAllMotelDevices, getAllDeviceByRomId, deleteRoomDevice, insertRoomDevice } from '~/apis/deviceAPT'
import { getContractTemplatesByMotelId, createTenant, createContract } from '~/apis/contractTemplateAPI'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'
import { formatVndInput, getVndInputFieldProps, parseVndInput } from '~/utils/currencyInputUtils'
import { deleteTenantById } from '~/apis/tenantAPI'

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback
}

const MODAL_ALERT_Z_INDEX = 2000

const fireModalAlert = (options) => {
  const originalDidOpen = options?.didOpen

  return Swal.fire({
    target: document.body,
    ...options,
    didOpen: (popup) => {
      const container = Swal.getContainer()
      if (container) {
        container.style.zIndex = String(MODAL_ALERT_Z_INDEX)
      }
      if (typeof originalDidOpen === 'function') {
        originalDidOpen(popup)
      }
    }
  })
}

const formatCurrencyValue = (value) => formatVndInput(value) || '0'

function ModalCreateContract({ toggleModal, modalOpen, roomId, motelId, onSuccess }) {
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null
  const [room, setRoom] = useState({})
  const [motelServices, setMotelServices] = useState([])
  const [motelDevices, setMotelSDevices] = useState([])
  const [contractTemplates, setcontractTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [roomServices, setRoomServices] = useState([])
  const [roomDevices, setRoomDevices] = useState([])

  const [tenant, setTenant] = useState({
    fullName: '',
    phone: '',
    cccd: '',
    email: '',
    birthday: null,
    gender: 'MALE',
    address: '',
    job: '',
    licenseDate: null,
    placeOfLicense: '',
    frontPhoto: '',
    backPhoto: '',
    role: true,
    relationship: '',
    typeOfTenant: false,
    temporaryResidence: false,
    informationVerify: false
  })

  const [contract, setContract] = useState({
    roomId: null,
    tenantId: null,
    username: username,
    contracttemplateId: null,
    brokerId: null,
    moveinDate: new Date().toISOString().slice(0, 10),
    leaseTerm: '',
    closeContract: '',
    description: '',
    debt: 0.0,
    price: 0.0,
    deposit: 0.0,
    collectioncycle: '1',
    createdate: new Date().toISOString().slice(0, 10),
    signcontract: 'Khách chưa ký',
    language: 'Tieng Viet',
    countTenant: 1,
    status: 'ACTIVE',
    commissionRate: 0,
    commissionAmount: 0,
    invoiceDate: 1
  })

  const fetchDataRoom = async (id) => {
    if (id) {
      try {
        const response = await getRoomById(id)
        if (response) {
          setRoom(response)
          fetchDataServiceRooms(id)
          fetchDataDeviceRooms(id)
          setContract((prev) => ({
            ...prev,
            roomId: response.roomId,
            price: response.price,
            deposit: response.price
          }))
        }
      } catch (error) {
        console.error('Error fetching room:', error)
      }
    }
  }

  const fetchDataServiceRooms = async (id) => {
    try {
      const roomServicesResponse = await getServiceRoombyRoomId(id)
      const updatedServices = motelServices.map((service) => {
        const roomService = roomServicesResponse.find((rs) => rs.service.motelServiceId === service.motelServiceId)
        return {
          ...service,
          isSelected: !!roomService,
          quantity: roomService ? roomService.quantity : 0,
          roomId: id,
          roomServiceId: roomService ? roomService.roomServiceId : null
        }
      })
      setRoomServices(updatedServices)
    } catch (error) {
      console.error('Error fetching room services:', error)
    }
  }
  const fetchDataDeviceRooms = async (id) => {
    try {
      const roomDevicesResponse = await getAllDeviceByRomId(id)
      const updatedDevices = motelDevices.map((device) => {
        const roomDevice = roomDevicesResponse.result.find(
          (rd) => rd.motelDevice.motel_device_id === device.motel_device_id
        )
        return {
          ...device,
          isSelected: !!roomDevice,
          quantity: roomDevice ? roomDevice.quantity : 0,
          roomId: id,
          roomDeviceId: roomDevice ? roomDevice.roomDeviceId : null
        }
      })
      setRoomDevices(updatedDevices)
    } catch (error) {
      console.error('Error fetching room devices:', error)
    }
  }

  const handleContractChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number' && isNegativeNumberValue(value)) return
    setContract((prev) => {
      const newContract = { ...prev }
      if (name === 'price' || name === 'deposit') {
        const numericValue = parseVndInput(value)
        newContract[name] = numericValue
      } else if (name === 'leaseTerm' && prev.moveinDate) {
        const monthsToAdd = parseInt(value, 10)
        if (!isNaN(monthsToAdd)) {
          const moveinDate = new Date(prev.moveinDate)
          moveinDate.setMonth(moveinDate.getMonth() + monthsToAdd)
          newContract.closeContract = moveinDate.toISOString().slice(0, 10)
        }
        newContract.leaseTerm = value
      } else {
        newContract[name] = value
      }
      return newContract
    })
  }

  const handleTenantChange = (e) => {
    const { name, value } = e.target
    setTenant((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setTenant(prev => ({ ...prev, [type]: file }))
    }
  }

  const fetchMotelServices = async (id) => {
    try {
      const response = await getMotelById(id)
      if (response.data?.code === 200 && response.data.result?.motelServices) {
        setMotelServices(response.data.result.motelServices)
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
    }
  }

  const fetchMotelDevices = async (id) => {
    try {
      const response = await getAllMotelDevices(id)
      if (response.code === 200) {
        setMotelSDevices(response.result)
      }
    } catch (error) {
      console.error('Error fetching motel devices:', error)
    }
  }

  const fetchMotelContractTemplate = async (id) => {
    try {
      const response = await getContractTemplatesByMotelId(id)
      if (response) {
        setcontractTemplates(response)
      }
    } catch (error) {
      console.error('Error fetching contract templates:', error)
    }
  }

  const handleApplyServices = async () => {
    const servicesToDelete = roomServices.filter((s) => !s.isSelected && s.roomServiceId)
    const servicesToUpdateOrAdd = roomServices.filter((s) => s.isSelected)

    const deletePromises = servicesToDelete.map((s) => DeleteRoomServiceByid(s.roomServiceId))
    const updateOrAddPromises = servicesToUpdateOrAdd.map((s) => {
      const data = {
        roomServiceId: s.roomServiceId || null,
        roomId: room.roomId,
        serviceId: s.motelServiceId,
        quantity: s.quantity || 1
      }
      return s.roomServiceId ? updateSerivceRoom(s.roomServiceId, data) : createRoomService(data)
    })

    await Promise.all([...deletePromises, ...updateOrAddPromises])
  }

  const handleApplyDevice = async () => {
    const devicesToDelete = roomDevices.filter((d) => !d.isSelected && d.roomDeviceId)
    const devicesToAdd = roomDevices.filter((d) => d.isSelected && !d.roomDeviceId)

    const deletePromises = devicesToDelete.map((d) => deleteRoomDevice(d.roomId, d.motel_device_id))
    const addPromises = devicesToAdd.map((d) => {
      const data = {
        room: { roomId: d.roomId },
        motelDevice: { motel_device_id: d.motel_device_id },
        quantity: d.quantity || 1
      }
      return insertRoomDevice(data)
    })

    await Promise.all([...deletePromises, ...addPromises])
  }

  const buildTenantAddress = () => {
    return '' // Removed address as requested
  }

  const validateBeforeSubmit = () => {
    if (!room?.roomId) return 'Chưa chọn phòng nào!'
    if (!tenant.fullName?.trim()) return 'Vui lòng nhập tên người ở.'
    if (!tenant.phone?.trim()) return 'Vui lòng nhập số điện thoại.'
    if (!contract.contracttemplateId) return 'Vui lòng chọn mẫu văn bản hợp đồng.'
    if (!contract.moveinDate) return 'Vui lòng chọn ngày vào ở.'
    if (!contract.price) return 'Vui lòng nhập giá thuê.'
    if (!contract.deposit) return 'Vui lòng nhập tiền cọc.'

    return null
  }

  const handleSubmit = async () => {
    const validationMessage = validateBeforeSubmit()
    if (validationMessage) {
      fireModalAlert({ icon: 'warning', title: 'Thông báo', text: validationMessage })
      return
    }
    let createdTenantId = null
    try {
      setLoading(true)
      fireModalAlert({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })
      await handleApplyServices()
      await handleApplyDevice()
      const tenantPayload = {
        ...tenant,
        address: buildTenantAddress()
      }
      const tenantResponse = await createTenant(room.roomId, tenantPayload)
      createdTenantId = tenantResponse?.result?.tenantId || null
      if (!createdTenantId) {
        fireModalAlert({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tạo thông tin khách thuê. Vui lòng kiểm tra lại!'
        })
        return
      }
      const { contracttemplateId, ...rest } = contract
      const updatedContract = {
        ...rest,
        tenantId: createdTenantId,
        contractTemplateId: contracttemplateId,
        language: contract.language || 'Tieng Viet'
      }
      const createdContract = await createContract(updatedContract)
      if (typeof onSuccess === 'function') {
        await onSuccess({ contract: createdContract, roomId: room.roomId })
      }
      await fireModalAlert({ icon: 'success', title: 'Thành công', text: 'Tạo hợp đồng thành công!' })
      toggleModal()
    } catch (error) {
      const apiMessage = getErrorMessage(error, 'Có lỗi xảy ra trong quá trình xử lý!')
      const normalizedMessage = String(apiMessage).toLowerCase()
      if (createdTenantId && !normalizedMessage.includes('cccd already exists')) {
        try {
          await deleteTenantById(createdTenantId)
        } catch (cleanupError) {
          console.error('Failed to rollback tenant after contract creation error:', cleanupError)
        }
      }
      const displayMessage = normalizedMessage.includes('cccd already exists')
        ? 'CCCD đã tồn tại. Có thể khách thuê đã được tạo ở lần trước nhưng bước tạo hợp đồng bị lỗi. Vui lòng kiểm tra lại danh sách khách thuê hoặc đổi CCCD/passport khác.'
        : apiMessage
      fireModalAlert({ icon: 'error', title: 'Lỗi', text: displayMessage })
      console.error('Create contract modal error:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (modalOpen && roomId && motelId) {
      fetchDataRoom(roomId)
      fetchMotelServices(motelId)
      fetchMotelDevices(motelId)
      fetchMotelContractTemplate(motelId)
    }
  }, [modalOpen, roomId, motelId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              mr: 2,
              bgcolor: '#20a9e7',
              color: 'white',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <BookIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Thêm hợp đồng mới - {room?.name || '...'}
          </Typography>
        </Box>
        <IconButton onClick={toggleModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Section: Thời hạn hợp đồng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <CalendarTodayIcon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Thời hạn hợp đồng
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Dùng xác định ngày vào ở, văn bản hợp đồng...
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Thời hạn hợp đồng"
                  name="leaseTerm"
                  value={contract.leaseTerm}
                  onChange={handleContractChange}
                  size="small">
                  <MenuItem value="">--Chọn thời hạn--</MenuItem>
                  {[
                    { v: '1', l: '1 tháng' },
                    { v: '2', l: '2 tháng' },
                    { v: '3', l: '3 tháng' },
                    { v: '6', l: '6 tháng' },
                    { v: '12', l: '1 năm' },
                    { v: '24', l: '2 năm' }
                  ].map((opt) => (
                    <MenuItem key={opt.v} value={opt.v}>
                      {opt.l}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày vào ở *"
                  name="moveinDate"
                  value={contract.moveinDate}
                  onChange={handleContractChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày đến hạn hợp đồng"
                  name="closeContract"
                  value={contract.closeContract}
                  onChange={handleContractChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Thông tin khách thuê */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <PersonIcon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Thông tin khách thuê
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Dùng để làm tạm trú, văn bản hợp đồng...
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số lượng thành viên *"
                  name="countTenant"
                  value={contract.countTenant}
                  onChange={handleContractChange}
                  size="small"
                  {...getNonNegativeNumberFieldProps()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên người ở *"
                  name="fullName"
                  value={tenant.fullName}
                  onChange={handleTenantChange}
                  size="small"
                  error={!tenant.fullName?.trim()}
                  helperText={!tenant.fullName?.trim() ? 'Vui lòng nhập tên người ở' : ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại người ở *"
                  name="phone"
                  value={tenant.phone}
                  onChange={handleTenantChange}
                  size="small"
                  error={!tenant.phone?.trim()}
                  helperText={!tenant.phone?.trim() ? 'Vui lòng nhập sđt người ở' : 'Nhập sđt ZALO để hỗ trợ gửi hóa đơn tự động'}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox defaultChecked sx={{ color: '#20a9e7', '&.Mui-checked': { color: '#20a9e7' } }} />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#20a9e7' }}>Sử dụng APP - Dành cho khách thuê</Typography>
                      <Typography variant="caption" color="text.secondary">Gửi hóa đơn tự động cho khách, hợp đồng online vv...</Typography>
                    </Box>
                  }
                  sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 1, width: '100%', ml: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CMND/CCCD"
                  name="cccd"
                  value={tenant.cccd}
                  onChange={handleTenantChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày sinh"
                  name="birthday"
                  value={tenant.birthday || ''}
                  onChange={handleTenantChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Giới tính *"
                  name="gender"
                  value={tenant.gender}
                  onChange={handleTenantChange}
                  size="small">
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#20a9e7', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                  Mở rộng thông tin khách thuê
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Dịch vụ sử dụng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dịch vụ sử dụng
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Thêm dịch vụ sử dụng như: điện, nước, rác, wifi...
            </Typography>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
              {motelServices.map((service) => {
                const isSelected = roomServices.some((s) => s.motelServiceId === service.motelServiceId && s.isSelected)
                return (
                  <Box
                    key={service.motelServiceId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      '&:last-child': { mb: 0 }
                    }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setRoomServices((prev) => {
                              const exists = prev.find((s) => s.motelServiceId === service.motelServiceId)
                              if (checked) {
                                if (exists)
                                  return prev.map((s) =>
                                    s.motelServiceId === service.motelServiceId
                                      ? { ...s, isSelected: true, quantity: s.quantity || 1 }
                                      : s
                                  )
                                return [...prev, { ...service, isSelected: true, quantity: 1 }]
                              }
                              return prev.map((s) =>
                                s.motelServiceId === service.motelServiceId ? { ...s, isSelected: false } : s
                              )
                            })
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {service.nameService}
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrencyValue(service.price)}đ / {service.chargetype}
                          </Typography>
                        </Box>
                      }
                    />
                    <TextField
                      size="small"
                      type="number"
                      sx={{ width: 100 }}
                      value={roomServices.find((s) => s.motelServiceId === service.motelServiceId)?.quantity || 0}
                      disabled={!isSelected}
                      onChange={(e) => {
                        if (isNegativeNumberValue(e.target.value)) return
                        const qty = parseInt(e.target.value) || 0
                        setRoomServices((prev) =>
                          prev.map((s) => (s.motelServiceId === service.motelServiceId ? { ...s, quantity: qty } : s))
                        )
                      }}
                      {...getNonNegativeNumberFieldProps()}
                    />
                  </Box>
                )
              })}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Giá trị hợp đồng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Thông tin giá trị hợp đồng:
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Giá tiền phòng và mức tiền cọc sẽ thu
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giá thuê (đ) *"
                  name="price"
                  value={formatVndInput(contract.price)}
                  onChange={handleContractChange}
                  size="small"
                  InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                  {...getVndInputFieldProps()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tiền cọc (đ) *"
                  name="deposit"
                  value={formatVndInput(contract.deposit)}
                  onChange={handleContractChange}
                  size="small"
                  InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                  {...getVndInputFieldProps()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Chu kỳ thu tiền"
                  name="collectioncycle"
                  value={contract.collectioncycle}
                  onChange={handleContractChange}
                  size="small">
                  <MenuItem value="1">1 tháng</MenuItem>
                  <MenuItem value="2">2 tháng</MenuItem>
                  <MenuItem value="3">3 tháng</MenuItem>
                  <MenuItem value="6">6 tháng</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Ngày thu tiền hàng tháng *"
                  name="invoiceDate"
                  value={contract.invoiceDate}
                  onChange={handleContractChange}
                  size="small"
                  {...getNonNegativeNumberFieldProps()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="description"
                  value={contract.description}
                  onChange={handleContractChange}
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Tài sản phòng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tài sản của phòng
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Các tài sản trong quá trình thuê phòng
            </Typography>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
              {motelDevices.map((device) => {
                const isSelected = roomDevices.some((d) => d.motel_device_id === device.motel_device_id && d.isSelected)
                return (
                  <Box
                    key={device.motel_device_id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      '&:last-child': { mb: 0 }
                    }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setRoomDevices((prev) => {
                              const exists = prev.find((d) => d.motel_device_id === device.motel_device_id)
                              if (checked) {
                                if (exists)
                                  return prev.map((d) =>
                                    d.motel_device_id === device.motel_device_id
                                      ? { ...d, isSelected: true, quantity: d.quantity || 1 }
                                      : d
                                  )
                                return [...prev, { ...device, isSelected: true, quantity: 1 }]
                              }
                              return prev.map((d) =>
                                d.motel_device_id === device.motel_device_id ? { ...d, isSelected: false } : d
                              )
                            })
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {device.deviceName}
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrencyValue(device.value)}đ / {device.unit}
                          </Typography>
                        </Box>
                      }
                    />
                    <TextField
                      size="small"
                      type="number"
                      sx={{ width: 100 }}
                      value={roomDevices.find((d) => d.motel_device_id === device.motel_device_id)?.quantity || 0}
                      disabled={!isSelected}
                      onChange={(e) => {
                        if (isNegativeNumberValue(e.target.value)) return
                        const qty = parseInt(e.target.value) || 0
                        setRoomDevices((prev) =>
                          prev.map((d) => (d.motel_device_id === device.motel_device_id ? { ...d, quantity: qty } : d))
                        )
                      }}
                      {...getNonNegativeNumberFieldProps()}
                    />
                  </Box>
                )
              })}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Mẫu văn bản hợp đồng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Chọn mẫu văn bản hợp đồng
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Bạn có thể cấu hình mẫu của mình, Nếu chưa có hãy tạo mẫu
            </Typography>
            <TextField
              select
              fullWidth
              label="Danh sách mẫu văn bản hợp đồng đang có"
              value={contract.contracttemplateId || ''}
              onChange={(e) => setContract((prev) => ({ ...prev, contracttemplateId: e.target.value }))}
              size="small">
              <MenuItem value="">--Chọn mẫu--</MenuItem>
              {contractTemplates.map((t) => (
                <MenuItem key={t.contractTemplateId} value={t.contractTemplateId}>
                  {t.templatename}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Chứng từ */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Chứng từ
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Hình ảnh chứng từ
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ p: 3, borderStyle: 'dashed', bgcolor: '#e3f2fd', borderColor: '#20a9e7', color: '#20a9e7' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CloudUploadIcon fontSize="large" />
                <Typography>
                  {tenant.frontPhoto ? tenant.frontPhoto.name : 'Hình ảnh chứng từ hợp đồng'}
                </Typography>
              </Box>
              <input type="file" hidden accept="image/*" onChange={(e) => handlePhotoUpload(e, 'frontPhoto')} />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Section: Môi giới */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 0.5, borderRadius: 1, mr: 1, display: 'flex' }}>
                <Inventory2Icon sx={{ color: '#20a9e7' }} fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Môi giới
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2, fontStyle: 'italic' }}>
              Chọn người giới thiệu hợp đồng và phí môi giới
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Danh sách môi giới"
                  name="brokerId"
                  value={contract.brokerId || ''}
                  onChange={handleContractChange}
                  size="small">
                  <MenuItem value="">--- Chọn môi giới ---</MenuItem>
                  <MenuItem value="1">Nguyễn Văn A</MenuItem>
                  <MenuItem value="2">Trần Thị B</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mức hoa hồng (%)"
                  name="commissionRate"
                  value={contract.commissionRate || 0}
                  onChange={handleContractChange}
                  size="small"
                  type="number"
                  {...getNonNegativeNumberFieldProps()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số tiền nhận (đ)"
                  name="commissionAmount"
                  value={formatVndInput(contract.commissionAmount || 0)}
                  onChange={handleContractChange}
                  size="small"
                  InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                  {...getVndInputFieldProps()}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox defaultChecked sx={{ color: '#20a9e7', '&.Mui-checked': { color: '#20a9e7' } }} />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tạo phiếu chi</Typography>
                      <Typography variant="caption" color="text.secondary">Tạo phiếu chi hoa hồng cho môi giới</Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1791c8' }, textTransform: 'none', px: 3 }}
          disabled={loading}>
          Thêm hợp đồng mới
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCreateContract

