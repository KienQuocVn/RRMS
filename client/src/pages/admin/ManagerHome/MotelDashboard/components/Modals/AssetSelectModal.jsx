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

import { insertRoomDevice, deleteRoomDevice, getAllDeviceByRomId } from '~/apis/deviceAPT'

const AssetSelectModal = ({ open, onClose, room, allDevices = [] }) => {
  const [deviceByRoom, setDeviceByRoom] = useState([])
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
      if (response && response.result) {
        setDeviceByRoom(response.result)
      } else {
        setDeviceByRoom([])
      }
    } catch (error) {
      console.error('Error fetching devices by room:', error)
      setDeviceByRoom([])
    } finally {
      setLoading(false)
    }
  }

  const applyRoomDevice = async (motel_device_idParam) => {
    const data = {
      room: room,
      motelDevice: {
        motel_device_id: motel_device_idParam
      },
      quantity: 1 // Default to 1, updating quantity wasn't fully implemented in old code either
    }
    const response = await insertRoomDevice(data)
    if (response.code === 200) {
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Thêm tài sản vào phòng thành công!' })
    } else {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Không đủ số lượng, vui lòng bổ sung kho!' })
    }
  }

  const cancelRoomDevice = async (roomId, motel_device_id) => {
    const response = await deleteRoomDevice(roomId, motel_device_id)
    if (response.result === true) {
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã hủy tài sản khỏi phòng!' })
    } else {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Hủy tài sản thất bại!' })
    }
  }

  const handleCheckboxChange = async (isChecked, deviceId) => {
    if (!room?.roomId) return

    if (isChecked) {
      await applyRoomDevice(deviceId)
    } else {
      await cancelRoomDevice(room.roomId, deviceId)
    }

    // Refresh the list after action
    await fetchDeviceByRoom(room.roomId)
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
            const isAssigned = deviceByRoom.some((it) => it.motelDevice?.motel_device_id === item.motel_device_id)

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
                            Giá trị: {item.value} đ /{' '}
                            {item.unit === 'CAI'
                              ? 'Cái'
                              : item.unit === 'CHIEC'
                                ? 'Chiếc'
                                : item.unit === 'BO'
                                  ? 'Bộ'
                                  : 'Cặp'}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <Typography variant="body2">Số lượng:</Typography>
                    <TextField size="small" type="number" value={1} disabled sx={{ width: 70 }} />
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
