import { useState, useMemo, useEffect } from 'react'
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
  InputAdornment,
  Autocomplete,
  IconButton,
  Alert
} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

import { createRoom, createRoomService } from '~/apis/roomAPI'
import { getMotelAreaSummary } from '~/apis/motelAPI'
import { createRoomGroup, deleteRoomGroup } from '~/apis/roomGroupAPI'
import { updateContractStatusClose } from '~/apis/contractTemplateAPI'
import {
  formatRoomGroupLabel,
  getDefaultGroupFromList,
  normalizeRoomGroup,
  sortRoomGroupItems
} from '~/utils/roomGroupUtils'
import {
  formatVndInput,
  getVndInputFieldProps,
  parseVndInput,
  parseVndNumber,
} from '~/utils/currencyInputUtils'
import {
  getNonNegativeNumberFieldProps,
  isNegativeNumberValue,
} from '~/utils/numberInputUtils'

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

const AddRoomModal = ({
  open,
  onClose,
  activeMotelId,
  motelServices = [],
  roomGroups = [],
  rooms = [],
  onGroupsChange,
  onAddSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    price: '',
    invoiceDate: 1,
    prioritize: 'Tất cả',
    selectedServices: []
  })

  const [groupInput, setGroupInput] = useState(getDefaultGroupFromList(roomGroups))
  const [loading, setLoading] = useState(false)
  const [areaSummary, setAreaSummary] = useState(null)

  const groupOptions = useMemo(() => sortRoomGroupItems(roomGroups), [roomGroups])

  const remainingArea = useMemo(() => {
    if (!areaSummary?.totalArea) return null
    const used = Number(areaSummary.usedArea) || 0
    const total = Number(areaSummary.totalArea) || 0
    return Math.max(0, total - used)
  }, [areaSummary])

  useEffect(() => {
    if (!open || !activeMotelId) {
      setAreaSummary(null)
      return
    }

    getMotelAreaSummary(activeMotelId)
      .then((res) => setAreaSummary(res.data?.result || null))
      .catch(() => setAreaSummary(null))
  }, [open, activeMotelId])

  useEffect(() => {
    if (open) {
      const defaultGroup = getDefaultGroupFromList(roomGroups)
      setGroupInput(defaultGroup)
    }
  }, [open, roomGroups])

  const getRoomCountForGroup = (groupName) => {
    const normalizedName = normalizeRoomGroup(groupName)
    return rooms.filter((room) => normalizeRoomGroup(room.group) === normalizedName).length
  }

  const handleDeleteFloor = async (event, group) => {
    event.preventDefault()
    event.stopPropagation()

    const roomCount = group.roomCount ?? getRoomCountForGroup(group.name)
    if (roomCount > 0) {
      fireModalAlert({
        icon: 'warning',
        title: 'Không thể xóa',
        text: `Tầng "${formatRoomGroupLabel(group.name)}" đang có ${roomCount} phòng. Vui lòng chuyển hoặc xóa phòng trước.`
      })
      return
    }

    const confirmResult = await fireModalAlert({
      icon: 'question',
      title: 'Xác nhận xóa',
      text: `Bạn có chắc muốn xóa tầng "${formatRoomGroupLabel(group.name)}"?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })

    if (!confirmResult.isConfirmed) return

    try {
      await deleteRoomGroup(group.roomGroupId)
      if (onGroupsChange) await onGroupsChange()

      if (normalizeRoomGroup(groupInput) === normalizeRoomGroup(group.name)) {
        const remainingGroups = roomGroups.filter((item) => item.roomGroupId !== group.roomGroupId)
        setGroupInput(getDefaultGroupFromList(remainingGroups))
      }

      fireModalAlert({ icon: 'success', title: 'Đã xóa tầng', timer: 1500, showConfirmButton: false })
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể xóa tầng này.'
      fireModalAlert({ icon: 'error', title: 'Lỗi', text: message })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number' && isNegativeNumberValue(value)) return
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseVndInput(value)
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
    if (isNegativeNumberValue(quantity)) return
    setFormData((prev) => {
      const updatedServices = prev.selectedServices.map((s) =>
        s.serviceId === serviceId ? { ...s, quantity: parseInt(quantity) || 0 } : s
      )
      return { ...prev, selectedServices: updatedServices }
    })
  }

  const ensureGroupSaved = async (groupName) => {
    const normalizedName = normalizeRoomGroup(groupName)
    const exists = roomGroups.some((group) => normalizeRoomGroup(group.name) === normalizedName)

    if (!exists) {
      await createRoomGroup({ motelId: activeMotelId, name: normalizedName })
      if (onGroupsChange) await onGroupsChange()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !groupInput.trim()) {
      fireModalAlert({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập tên phòng, tầng/dãy và giá thuê.' })
      return
    }

    const roomArea = parseInt(formData.area, 10)
    if (!formData.area || Number.isNaN(roomArea) || roomArea <= 0) {
      fireModalAlert({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập diện tích phòng (m²).' })
      return
    }

    if (areaSummary?.totalArea && remainingArea != null && roomArea > remainingArea) {
      fireModalAlert({
        icon: 'error',
        title: 'Vượt quá diện tích',
        text: `Diện tích phòng (${roomArea} m²) vượt quá phần còn lại của căn nhà (${remainingArea} m²).`
      })
      return
    }

    if (!areaSummary?.totalArea) {
      fireModalAlert({
        icon: 'warning',
        title: 'Chưa có diện tích nhà trọ',
        text: 'Nhà trọ chưa có tổng diện tích (theo sổ đỏ). Vui lòng cập nhật thông tin nhà trọ trước khi thêm phòng.'
      })
      return
    }

    setLoading(true)
    try {
      const groupName = normalizeRoomGroup(groupInput.trim())
      await ensureGroupSaved(groupName)

      const payload = {
        ...formData,
        price: parseVndNumber(formData.price),
        area: roomArea,
        group: groupName,
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

      await updateContractStatusClose('IATExpire', 10).catch(() => {})

      fireModalAlert({ icon: 'success', title: 'Thông báo', text: 'Thêm phòng thành công!' })

      setFormData({
        name: '',
        area: '',
        price: '',
        invoiceDate: 1,
        prioritize: 'Tất cả',
        selectedServices: []
      })
      setGroupInput(getDefaultGroupFromList(roomGroups))

      onClose()
      if (onAddSuccess) onAddSuccess()
    } catch (error) {
      console.error('Error creating room:', error)
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi thêm phòng.'
      fireModalAlert({ icon: 'error', title: 'Thông báo', text: message })
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

        {areaSummary?.totalArea ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Diện tích căn nhà (sổ đỏ): <strong>{areaSummary.totalArea} m²</strong>
            {' · '}
            Đã dùng: <strong>{areaSummary.usedArea || 0} m²</strong>
            {' · '}
            Còn lại: <strong>{remainingArea} m²</strong>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nhà trọ chưa có tổng diện tích. Vui lòng cập nhật diện tích căn nhà (theo sổ đỏ) trước khi thêm phòng.
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Tên phòng *" name="name" fullWidth value={formData.name} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              autoSelect={false}
              clearOnBlur={false}
              options={groupOptions}
              inputValue={groupInput}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return formatRoomGroupLabel(option)
                return formatRoomGroupLabel(option.name)
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === 'reset') return
                setGroupInput(newInputValue)
              }}
              onChange={(_, newValue) => {
                const name = typeof newValue === 'string' ? newValue : newValue?.name || ''
                setGroupInput(name)
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                const canDelete = Boolean(option.roomGroupId)

                return (
                  <Box
                    component="li"
                    key={key}
                    {...optionProps}
                    sx={{
                      display: 'flex !important',
                      alignItems: 'center',
                      width: '100%',
                      gap: 1,
                      pr: 0.5
                    }}>
                    <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                      {formatRoomGroupLabel(option.name)}
                    </Typography>
                    {canDelete && (
                      <IconButton
                        size="small"
                        aria-label={`Xóa ${option.name}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => handleDeleteFloor(e, option)}
                        sx={{
                          flexShrink: 0,
                          ml: 'auto',
                          mr: 0.25,
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' }
                        }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tầng/dãy *"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Diện tích (m²) "
              name="area"
              type="number"
              fullWidth
              required
              value={formData.area}
              onChange={handleInputChange}
              helperText={
                remainingArea != null
                  ? `Diện tích tối đa có thể nhập: ${remainingArea} m²`
                  : 'Nhập diện tích sử dụng của phòng'
              }
              {...getNonNegativeNumberFieldProps(1)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá thuê (đ) *"
              name="price"
              fullWidth
              value={formatVndInput(formData.price)}
              onChange={handleInputChange}
              InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
              {...getVndInputFieldProps()}
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
                      {...getNonNegativeNumberFieldProps()}
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
