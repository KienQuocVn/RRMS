import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import AnchorIcon from '@mui/icons-material/Anchor'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

import { getRoomById } from '~/apis/roomAPI'
import { cancelReserveAPlace } from '~/apis/ReserveAPlaceAPI'
import httpClient from '~/apis/httpClient'

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(Number(value))) return '0'
  return Number(value).toLocaleString('vi-VN')
}

const formatDateDisplay = (dateValue) => {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN')
}

const DEFAULT_PAYMENT_OPTIONS = ['Trả tiền mặt', 'Chuyển khoản ngân hàng']

function CancelReserveAPlaceModal({ open, onClose, roomId, onSuccess }) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentOptions, setPaymentOptions] = useState(DEFAULT_PAYMENT_OPTIONS)
  const [form, setForm] = useState({
    paymentMethod: 'Trả tiền mặt',
    note: '',
    refundAmount: 0
  })

  const reserve = room?.reserveAPlace

  useEffect(() => {
    if (!open || !roomId) return

    const loadData = async () => {
      try {
        const [roomResponse, paymentResponse] = await Promise.allSettled([
          getRoomById(roomId),
          httpClient.get('/api/v1/payment/list_payment')
        ])

        if (roomResponse.status === 'fulfilled' && roomResponse.value) {
          setRoom(roomResponse.value)
          const reservationNote = roomResponse.value?.reserveAPlace?.note || ''
          setForm({
            paymentMethod: 'Trả tiền mặt',
            note: reservationNote,
            refundAmount: 0
          })
        }

        if (paymentResponse.status === 'fulfilled') {
          const payments = paymentResponse.value?.data?.result || paymentResponse.value?.data || []
          if (Array.isArray(payments) && payments.length > 0) {
            const names = payments.map((item) => item.paymentName).filter(Boolean)
            if (names.length > 0) {
              setPaymentOptions(names)
              setForm((prev) => ({ ...prev, paymentMethod: names[0] }))
            }
          }
        }
      } catch (error) {
        console.error('Error loading cancel reserve data:', error)
      }
    }

    loadData()
  }, [open, roomId])

  const handleRefundChange = (event) => {
    const raw = event.target.value.replace(/[^0-9]/g, '')
    setForm((prev) => ({
      ...prev,
      refundAmount: raw ? Number.parseInt(raw, 10) : 0
    }))
  }

  const handleSubmit = async () => {
    const reservationId = reserve?.reserveAPlaceId || reserve?.roomReservationId
    if (!reservationId) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không tìm thấy thông tin cọc giữ chỗ.' })
      return
    }

    const depositAmount = Number(reserve?.deposit || 0)
    if (form.refundAmount < 0) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Số tiền hoàn trả không hợp lệ.' })
      return
    }

    if (form.refundAmount > depositAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Số tiền hoàn trả không được lớn hơn số tiền cọc giữ chỗ.'
      })
      return
    }

    try {
      setLoading(true)
      await cancelReserveAPlace({
        reservationId,
        refundAmount: form.refundAmount,
        note: form.note,
        paymentMethod: form.paymentMethod,
        roomName: room?.name || '',
        tenantName: reserve?.nameTenant || ''
      })

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã hủy cọc giữ chỗ. Phòng đã chuyển về trạng thái trống.'
      })

      if (typeof onSuccess === 'function') await onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to cancel reserve:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.response?.data?.message || 'Không thể hủy cọc giữ chỗ. Vui lòng thử lại.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#20a9e7',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <AnchorIcon />
          </Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            Hủy cọc giữ chỗ - {room?.name || '...'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#fafafa' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày cọc giữ chỗ"
              value={formatDateDisplay(reserve?.createDate)}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày dự kiến vào ở"
              value={formatDateDisplay(reserve?.moveInDate || reserve?.moveinDate)}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên người ở"
              value={reserve?.nameTenant || ''}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại người ở"
              value={reserve?.phoneTenant || ''}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số tiền cọc giữ chỗ (đ)"
              value={formatCurrency(reserve?.deposit)}
              InputProps={{ readOnly: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Phương thức thanh toán"
              value={form.paymentMethod}
              onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              size="small">
              {paymentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Giá thuê hiện tại
            </Typography>
            <Typography variant="h6" sx={{ color: '#20a9e7', fontWeight: 700 }}>
              {formatCurrency(room?.price)} đ
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Nhập ghi chú"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning" sx={{ alignItems: 'flex-start' }}>
              Chú thích: Nếu bạn có hoàn trả lại cho khách số tiền cọc này hãy ghi nhập vào đây. Điều này sẽ ghi nhận
              trong thu/chi.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số tiền cọc giữ chỗ hoàn trả (đ)"
              value={form.refundAmount ? formatCurrency(form.refundAmount) : '0'}
              onChange={handleRefundChange}
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          Đóng
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading || !reserve}>
          {loading ? 'Đang xử lý...' : 'Hủy cọc giữ chỗ'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CancelReserveAPlaceModal
