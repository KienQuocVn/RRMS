import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, Stack, Typography } from '@mui/material'

const DetailField = ({ label, value, valueStyles }) => {
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
      <Typography sx={{ color: '#101828', fontWeight: 600, ...valueStyles }}>{value || '--'}</Typography>
      </Box>
  )
}

const ZaloHistoryDetailModal = ({ open, historyItem, onClose, onOpenReceipt, onOpenExpense }) => {
  const isSuccess = historyItem?.status === 'success'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Chi tiết lịch sử gửi Zalo</DialogTitle>

      <DialogContent dividers>
        {historyItem ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
              <Chip
                icon={
                  isSuccess ? (
                    <CheckCircleOutlineRoundedIcon sx={{ color: '#fff !important' }} />
                  ) : (
                    <ErrorOutlineRoundedIcon sx={{ color: '#fff !important' }} />
                  )
                }
                label={isSuccess ? 'Gửi thành công' : 'Gửi thất bại'}
                sx={{
                  fontWeight: 700,
                  backgroundColor: isSuccess ? '#16a34a' : '#ef4444',
                  color: '#fff'
                }}
              />
              <Chip
                label={historyItem.billingType}
                sx={{
                  fontWeight: 700,
                  backgroundColor: '#ecfdf3',
                  color: '#15803d'
                }}
              />
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Phòng/Giường" value={historyItem.roomName} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Số điện thoại" value={historyItem.phone} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Tháng gửi" value={`${historyItem.month}/${historyItem.year}`} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Thời gian gửi" value={historyItem.sentAt} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField
                  label="Trạng thái"
                  value={isSuccess ? 'Thành công' : 'Xảy ra lỗi'}
                  valueStyles={{ color: isSuccess ? '#15803d' : '#d92d20' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField
                  label="Ngày thanh toán"
                  value={historyItem.paymentDate}
                  valueStyles={{ color: historyItem.paymentDate === 'Chưa thanh toán' ? '#d92d20' : '#98a2b3' }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailField label="Mô tả" value={historyItem.description} />
              </Grid>
              {historyItem.detail ? (
                <Grid size={{ xs: 12 }}>
                  <DetailField label="Chi tiết lỗi" value={historyItem.detail} valueStyles={{ color: '#ef4444', fontStyle: 'italic' }} />
                </Grid>
              ) : null}
            </Grid>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<RequestQuoteOutlinedIcon />}
            onClick={() => onOpenExpense(historyItem)}
            sx={{
              backgroundColor: '#facc15',
              color: '#111827',
              '&:hover': { backgroundColor: '#eab308' }
            }}>
            Thêm phiếu chi
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptLongOutlinedIcon />}
            onClick={() => onOpenReceipt(historyItem)}
            sx={{
              backgroundColor: '#16a34a',
              '&:hover': { backgroundColor: '#15803d' }
            }}>
            Thêm phiếu thu
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default ZaloHistoryDetailModal
