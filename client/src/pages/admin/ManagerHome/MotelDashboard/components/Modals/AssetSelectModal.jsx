import { useState, useEffect } from 'react'
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
  FormControlLabel
} from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import Swal from 'sweetalert2'

import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'

import {
  insertRoomDevice,
  deleteRoomDevice,
  getAllDeviceByRomId,
  changeQuantityRoomDevice
} from '~/apis/deviceAPT'

const getUnitLabel = (unit) => {
  const map = { CAI: 'Cái', cai: 'Cái', CHIEC: 'Chiếc', chiec: 'Chiếc', BO: 'Bộ', bo: 'Bộ', CAP: 'Cặp', cap: 'Cặp' }
  return map[unit] || unit || 'Cái'
}

const AssetSelectModal = ({ open, onClose, room, allDevices = [] }) => {
  const [deviceByRoom, setDeviceByRoom] = useState([])
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && room?.roomId) {
      fetchDeviceByRoom(room.roomId)
    }
  }, [open, room])

  const fetchDeviceByRoom = async (roomId) => {
    try {
      setLoading(true)
      const response = await getAllDeviceByRomId(roomId)
      const assignedDevices = response?.result || []
      setDeviceByRoom(assignedDevices)

      const quantityMap = {}
      assignedDevices.forEach((item) => {
        const motelDeviceId = item.motelDevice?.motel_device_id
        if (motelDeviceId) {
          quantityMap[motelDeviceId] = item.quantity || 1
        }
      })
      setQuantities(quantityMap)
    } catch (error) {
      console.error('Error fetching devices by room:', error)
      setDeviceByRoom([])
      setQuantities({})
    } finally {
      setLoading(false)
    }
  }

  const getAssignedDevice = (motelDeviceId) =>
    deviceByRoom.find((item) => item.motelDevice?.motel_device_id === motelDeviceId)

  const applyRoomDevice = async (motelDeviceId) => {
    const quantity = quantities[motelDeviceId] || 1
    const response = await insertRoomDevice({
      room: { roomId: room.roomId },
      motelDevice: { motel_device_id: motelDeviceId },
      quantity
    })

    if (response?.code === 201 || response?.code === 200) {
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Thêm tài sản vào phòng thành công!' })
      return true
    }

    Swal.fire({ icon: 'error', title: 'Thất bại', text: response?.message || 'Không đủ số lượng, vui lòng bổ sung kho!' })
    return false
  }

  const cancelRoomDevice = async (motelDeviceId) => {
    const response = await deleteRoomDevice(room.roomId, motelDeviceId)
    if (response?.result === true || response?.code === 200) {
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã hủy tài sản khỏi phòng!' })
      return true
    }

    Swal.fire({ icon: 'error', title: 'Thất bại', text: response?.message || 'Hủy tài sản thất bại!' })
    return false
  }

  const updateRoomDeviceQuantity = async (motelDeviceId, quantity) => {
    const response = await changeQuantityRoomDevice({
      roomId: room.roomId,
      motel_device_id: motelDeviceId,
      quantity
    })

    if (response?.result === true || response?.code === 200) {
      return true
    }

    Swal.fire({ icon: 'error', title: 'Thất bại', text: response?.message || 'Cập nhật số lượng thất bại!' })
    return false
  }

  const handleCheckboxChange = async (isChecked, motelDeviceId) => {
    if (!room?.roomId || loading) return

    try {
      setLoading(true)
      let success = false

      if (isChecked) {
        success = await applyRoomDevice(motelDeviceId)
      } else {
        success = await cancelRoomDevice(motelDeviceId)
      }

      if (success) {
        await fetchDeviceByRoom(room.roomId)
      }
    } catch (error) {
      console.error('Error updating room device:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra khi cập nhật tài sản phòng!' })
      await fetchDeviceByRoom(room.roomId)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (motelDeviceId, value) => {
    if (isNegativeNumberValue(value)) return
    const parsed = Number.parseInt(value, 10)
    setQuantities((prev) => ({
      ...prev,
      [motelDeviceId]: Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
    }))
  }

  const handleQuantityBlur = async (motelDeviceId) => {
    if (!room?.roomId || loading) return

    const assignedDevice = getAssignedDevice(motelDeviceId)
    if (!assignedDevice) return

    const nextQuantity = quantities[motelDeviceId] || 1
    if (nextQuantity === (assignedDevice.quantity || 1)) return

    try {
      setLoading(true)
      const success = await updateRoomDeviceQuantity(motelDeviceId, nextQuantity)
      if (success) {
        await fetchDeviceByRoom(room.roomId)
      }
    } catch (error) {
      console.error('Error updating room device quantity:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra khi cập nhật số lượng!' })
      await fetchDeviceByRoom(room.roomId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InventoryIcon />
        Thiết lập tài sản phòng &quot;{room?.name}&quot;
      </DialogTitle>

      <DialogContent sx={{ mt: 2, bgcolor: '#f8f9fa', p: 3 }}>
        {allDevices.length > 0 ? (
          allDevices.map((item) => {
            const assignedDevice = getAssignedDevice(item.motel_device_id)
            const isAssigned = Boolean(assignedDevice)
            const quantity = quantities[item.motel_device_id] ?? assignedDevice?.quantity ?? 1

            return (
              <Box
                key={item.motel_device_id}
                sx={{ bgcolor: 'white', p: 2, mb: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Grid container alignItems="center">
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAssigned}
                          onChange={(e) => handleCheckboxChange(e.target.checked, item.motel_device_id)}
                          disabled={loading}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2">{item.deviceName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Giá trị: {Number(item.value || 0).toLocaleString('vi-VN')} đ / {getUnitLabel(item.unit)}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <Typography variant="body2">Số lượng:</Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={quantity}
                      disabled={!isAssigned || loading}
                      onChange={(e) => handleQuantityChange(item.motel_device_id, e.target.value)}
                      onBlur={() => handleQuantityBlur(item.motel_device_id)}
                      {...getNonNegativeNumberFieldProps(1)}
                      sx={{ width: 70 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )
          })
        ) : (
          <Typography color="error" variant="body2">
            Khu trọ chưa thiết lập tài sản nào, cần thêm tài sản vào hệ thống!
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssetSelectModal
