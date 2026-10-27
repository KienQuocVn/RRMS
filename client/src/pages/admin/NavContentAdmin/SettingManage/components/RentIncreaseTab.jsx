import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  InputAdornment,
  Button,
  CircularProgress,
  Chip
} from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import Swal from 'sweetalert2'
import { getRoomByMotelId, updateRoom } from '~/apis/roomAPI'
import { formatVndInput, getVndInputFieldProps, parseVndInput } from '~/utils/currencyInputUtils'

const RentIncreaseTab = () => {
  const { motelId } = useParams()
  const [newRentPrice, setNewRentPrice] = useState('3000000')
  const [rooms, setRooms] = useState([])
  const [selectedRoomIds, setSelectedRoomIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Tải danh sách phòng hiện tại theo nhà trọ
  const fetchRooms = useCallback(async () => {
    if (!motelId) return
    try {
      setLoading(true)
      const data = await getRoomByMotelId(motelId)
      const list = Array.isArray(data) ? data : []
      setRooms(list)
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách phòng của nhà trọ!'
      })
    } finally {
      setLoading(false)
    }
  }, [motelId])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // Xử lý chọn/bỏ chọn tất cả
  const isAllSelected = rooms.length > 0 && selectedRoomIds.length === rooms.length
  const isIndeterminate = selectedRoomIds.length > 0 && selectedRoomIds.length < rooms.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRoomIds([])
    } else {
      setSelectedRoomIds(rooms.map((r) => r.roomId))
    }
  }

  // Xử lý chọn/bỏ chọn từng phòng
  const handleToggleRoom = (roomId) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  // Hàm thực hiện tăng giá thuê
  const handleSaveRentIncrease = useCallback(async () => {
    const numericPrice = parseVndInput(newRentPrice)

    if (!numericPrice || numericPrice <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Vui lòng nhập giá thuê mới hợp lệ (lớn hơn 0đ)!'
      })
      return
    }

    if (selectedRoomIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Vui lòng chọn ít nhất một phòng để áp dụng giá mới!'
      })
      return
    }

    const confirmResult = await Swal.fire({
      title: 'Xác nhận cập nhật giá thuê',
      html: `Bạn có chắc chắn muốn cập nhật giá thuê mới là <b>${formatVndInput(numericPrice)}đ</b> cho <b>${selectedRoomIds.length}</b> phòng đã chọn không?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#20a9e7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    })

    if (!confirmResult.isConfirmed) return

    try {
      setSaving(true)
      Swal.fire({
        title: 'Đang cập nhật giá thuê...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const targetRooms = rooms.filter((r) => selectedRoomIds.includes(r.roomId))
      const updatePromises = targetRooms.map((room) =>
        updateRoom(room.roomId, {
          ...room,
          motelId: room.motelId || motelId,
          price: numericPrice
        })
      )

      await Promise.all(updatePromises)

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã cập nhật giá thuê mới thành công cho ${selectedRoomIds.length} phòng!`
      })

      // Tải lại danh sách phòng để hiển thị giá mới cập nhật
      await fetchRooms()
    } catch (error) {
      console.error('Lỗi khi cập nhật giá thuê:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giá thuê phòng!'
      })
    } finally {
      setSaving(false)
    }
  }, [newRentPrice, selectedRoomIds, rooms, motelId, fetchRooms])

  // Lắng nghe sự kiện lưu từ nút "Lưu cài đặt" ở Header
  useEffect(() => {
    const handleHeaderSave = () => {
      handleSaveRentIncrease()
    }
    window.addEventListener('save-motel-settings', handleHeaderSave)
    return () => {
      window.removeEventListener('save-motel-settings', handleHeaderSave)
    }
  }, [handleSaveRentIncrease])

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Tăng giá thuê
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tăng giá thuê cho tất cả các phòng hoặc chỉ 1 số phòng
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Giá thuê mới *"
        value={formatVndInput(newRentPrice)}
        onChange={(event) => setNewRentPrice(parseVndInput(event.target.value))}
        variant="outlined"
        sx={{ mb: 4 }}
        InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
        {...getVndInputFieldProps()}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}>
        <Box sx={{ borderLeft: '4px solid #2b7ed7', pl: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Chọn phòng muốn áp dụng
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Danh sách phòng chọn áp dụng (Đã chọn {selectedRoomIds.length}/{rooms.length} phòng)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleToggleSelectAll}
                color="info"
                disabled={loading || rooms.length === 0}
              />
            }
            label="Chọn tất cả"
          />
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveOutlinedIcon />}
            onClick={handleSaveRentIncrease}
            disabled={saving || loading || selectedRoomIds.length === 0}
            sx={{
              backgroundColor: '#20a9e7',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              height: 40,
              '&:hover': { backgroundColor: '#2b7ed7' }
            }}>
            {saving ? 'Đang lưu...' : 'Áp dụng giá mới'}
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress color="info" />
        </Box>
      ) : rooms.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: '#999' }}>
          <Typography variant="body1">Chưa có phòng nào trong nhà trọ này.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {rooms.map((room) => {
            const isChecked = selectedRoomIds.includes(room.roomId)
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room.roomId}>
                <Paper
                  variant="outlined"
                  onClick={() => handleToggleRoom(room.roomId)}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderColor: isChecked ? '#20a9e7' : '#e0e0e0',
                    backgroundColor: isChecked ? 'rgba(32, 169, 231, 0.06)' : '#fff',
                    boxShadow: isChecked ? '0 2px 8px rgba(32, 169, 231, 0.2)' : 'none',
                    '&:hover': {
                      borderColor: '#20a9e7',
                      backgroundColor: 'rgba(32, 169, 231, 0.04)'
                    }
                  }}>
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleToggleRoom(room.roomId)}
                    color="info"
                    sx={{ p: 0.5 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="body2" fontWeight="600" noWrap>
                        {room.name || 'Phòng'}
                      </Typography>
                      {room.status && (
                        <Chip
                          label={room.status === 'OCCUPIED' ? 'Đang ở' : 'Trống'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: room.status === 'OCCUPIED' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(241, 196, 15, 0.15)',
                            color: room.status === 'OCCUPIED' ? '#27ae60' : '#d35400'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#20a9e7', mt: 0.5 }}>
                      {formatVndInput(room.price || 0)}đ
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}

export default RentIncreaseTab
