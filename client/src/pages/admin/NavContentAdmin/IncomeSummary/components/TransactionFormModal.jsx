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
  TextField
} from '@mui/material'

const getTodayValue = () => new Date().toISOString().split('T')[0]

const TransactionFormModal = ({ open, onClose, onSubmit, payments, title, submitLabel }) => {
  const formId = `transaction-form-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <DialogContent dividers>
        <Box id={formId} component="form" onSubmit={onSubmit} sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                autoFocus
                type="number"
                name="amount"
                label="Nhập số tiền"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth required name="paymentMethod" label="Phương thức thanh toán" defaultValue="">
                <MenuItem value="">Chọn phương thức</MenuItem>
                {payments.map((payment) => (
                  <MenuItem key={payment.paymentId} value={payment.paymentName}>
                    {payment.paymentName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required name="payer" label="Người thanh toán / nhận" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField fullWidth required name="description" label="Nội dung thanh toán" />
            </Grid>

            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField fullWidth required name="category" label="Danh mục phiếu" />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField fullWidth required type="date" name="date" label="Ngày lập phiếu" defaultValue={getTodayValue()} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
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
