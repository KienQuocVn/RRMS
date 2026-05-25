import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, Stack, Typography } from '@mui/material'

const getPaymentName = (transaction) => transaction?.payment?.paymentName || transaction?.paymentName || '--'

const formatDateDisplay = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const DetailField = ({ label, value }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid #eaecf0',
        backgroundColor: '#fff'
      }}>
      <Typography variant="caption" sx={{ color: '#667085', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: '#101828', fontWeight: 600 }}>{value || '--'}</Typography>
    </Box>
  )
}

const TransactionDetailModal = ({ open, onClose, transaction, formatCurrency, onDelete }) => {
  const isReceipt = transaction?.transactionType === true

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Chi tiết phiếu {isReceipt ? 'thu' : 'chi'}</DialogTitle>

      <DialogContent dividers>
        {transaction ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: isReceipt ? '#ecfdf3' : '#fef3f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <PaymentsOutlinedIcon sx={{ color: isReceipt ? '#16a34a' : '#ef4444' }} />
              </Box>
              <Chip
                label={isReceipt ? 'Khoản thu' : 'Khoản chi'}
                sx={{
                  fontWeight: 700,
                  backgroundColor: isReceipt ? '#16a34a' : '#ef4444',
                  color: '#fff'
                }}
              />
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Danh mục thu/chi" value={transaction.category} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Số tiền" value={formatCurrency(transaction.amount)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Người thanh toán / nhận" value={transaction.payerName} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Phương thức thanh toán" value={getPaymentName(transaction)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailField label="Nội dung thanh toán" value={transaction.paymentDescription} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Ngày ghi nhận thu/chi" value={formatDateDisplay(transaction.transactionDate)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Ngày tạo phiếu" value={formatDateDisplay(transaction.transactionDate)} />
              </Grid>
            </Grid>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Đóng
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => onDelete(transaction?.transactionId)}>
            Xóa phiếu
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionDetailModal
