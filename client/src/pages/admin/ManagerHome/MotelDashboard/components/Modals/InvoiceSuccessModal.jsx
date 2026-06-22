import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`

const ActionCard = ({ icon, title, subtitle, onClick }) => (
  <Paper
    component="button"
    type="button"
    variant="outlined"
    onClick={onClick}
    sx={{
      width: '100%',
      p: 1.2,
      borderRadius: 1,
      bgcolor: '#fff',
      textAlign: 'left',
      cursor: 'pointer',
      '&:hover': { borderColor: '#20a9e7', bgcolor: '#F8FFF7' }
    }}>
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: '#111827', mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: '#333' }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 0.4 }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  </Paper>
)

const InvoiceSuccessModal = ({ open, onClose, invoice, room, onCollect, onDetail }) => {
  const amount = invoice?.totalAmount || 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 505, maxWidth: 'calc(100vw - 24px)', borderRadius: 0, m: 1.5 } }}>
      <DialogContent sx={{ px: 3.4, py: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            border: '4px solid #20a9e7',
            mx: 'auto',
            color: '#20a9e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <CheckIcon sx={{ fontSize: 64 }} />
        </Box>

        <Typography sx={{ mt: 3, fontSize: 30, fontWeight: 900, color: '#5A5A5A' }}>Thành công!</Typography>
        <Typography sx={{ mt: 1.8, color: '#20a9e7', fontSize: 18, lineHeight: 1.35 }}>
          Tạo hóa đơn dọn tiền phòng thành công! Số tiền cần thu là: {formatCurrency(amount)}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 1.8,
            p: 1.5,
            bgcolor: '#FFF8E8',
            borderRadius: 1,
            textAlign: 'left',
            color: '#FF1E1E'
          }}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1}>
              <DoDisturbOnOutlinedIcon fontSize="small" />
              <Typography>Gửi hóa đơn ZALO thất bại. Xem lịch sử để giải quyết vấn đề.</Typography>
            </Stack>
            <Typography sx={{ pl: 3.6 }}>Không thể hóa đơn qua ZALO!</Typography>
            <Stack direction="row" spacing={1}>
              <DoDisturbOnOutlinedIcon fontSize="small" />
              <Typography>Gửi qua App khách thuê thất bại. Khách thuê chưa có tài khoản App</Typography>
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
          <AssignmentOutlinedIcon sx={{ color: '#B7825B' }} />
          <Typography sx={{ fontSize: 20, fontWeight: 900, color: '#3F3F3F' }}>Thao tác tiếp theo:</Typography>
        </Stack>

        <Stack spacing={1}>
          <ActionCard
            icon={<ReceiptLongOutlinedIcon />}
            title="Thực hiện thu tiền"
            subtitle="Thu tiền hóa đơn"
            onClick={() => onCollect?.(invoice)}
          />
          <ActionCard
            icon={<GroupsOutlinedIcon />}
            title="Xem chi tiết hóa đơn"
            subtitle={`Xem thông tin chi tiết hóa đơn${room?.name ? ` phòng ${room.name}` : ''}`}
            onClick={() => onDetail?.(invoice)}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 3.5, px: 3, bgcolor: '#20a9e7', fontWeight: 900, '&:hover': { bgcolor: '#2b7ed7' } }}>
          Đóng
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default InvoiceSuccessModal
