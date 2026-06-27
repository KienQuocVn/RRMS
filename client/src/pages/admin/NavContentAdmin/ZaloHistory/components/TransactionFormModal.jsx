import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import { getNonNegativeNumberFieldProps } from '~/utils/numberInputUtils'

const paymentOptions = ['Tiền mặt', 'Chuyển khoản', 'ZALO Pay']

const getTodayValue = () => new Date().toISOString().split('T')[0]

const TransactionFormModal = ({ open, onClose, onSubmit, historyItem, title, submitLabel, defaultCategory }) => {
  const formId = `zalo-transaction-form-${title.replace(/\s+/g, '-').toLowerCase()}`
  const formKey = `${title}-${historyItem?.id ?? 'default'}`

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <DialogContent dividers>
        <Box key={formKey} id={formId} component="form" onSubmit={onSubmit} sx={{ pt: 0.5 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
              <Typography variant="body2" sx={{ color: '#475467' }}>
                Gắn với lịch sử gửi Zalo:
              </Typography>
              <Typography sx={{ color: '#101828', fontWeight: 700 }}>
                {historyItem ? `${historyItem.roomName} - ${historyItem.phone}` : 'Chưa chọn dòng dữ liệu'}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth required name="roomName" label="Phòng" defaultValue={historyItem?.roomName || ''} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth name="phone" label="Số điện thoại" defaultValue={historyItem?.phone || ''} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  type="number"
                  name="amount"
                  label="Nhập số tiền"
                  {...getNonNegativeNumberFieldProps()}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth required name="paymentMethod" label="Phương thức thanh toán" defaultValue="">
                  <MenuItem value="">Chọn phương thức</MenuItem>
                  {paymentOptions.map((payment) => (
                    <MenuItem key={payment} value={payment}>
                      {payment}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth required name="payer" label="Người thanh toán / nhận" defaultValue={historyItem?.roomName || ''} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  name="description"
                  label="Nội dung thanh toán"
                  defaultValue={historyItem ? `Phát sinh từ lịch sử gửi Zalo - ${historyItem.roomName}` : ''}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 7 }}>
                <TextField fullWidth required name="category" label="Danh mục phiếu" defaultValue={defaultCategory} />
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="date"
                  label="Ngày lập phiếu"
                  defaultValue={getTodayValue()}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Hủy
          </Button>
          <Button type="submit" form={formId} variant="contained" color="success">
            {submitLabel}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionFormModal
