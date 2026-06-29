import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { QUICK_REJECT_REASONS } from './postApprovalUtils'

const RejectPostModal = ({
  open,
  postTitle,
  reason,
  selectedReasons,
  notifyOwner,
  onClose,
  onReasonChange,
  onToggleQuickReason,
  onToggleNotifyOwner,
  onSubmit
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: '12px',
        p: 0.5,
        boxShadow: 'none'
      }
    }}
    BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.45)' } }}>
    <DialogTitle sx={{ fontSize: 16, fontWeight: 600, pb: 0.5 }}>Từ chối bài đăng</DialogTitle>
    <DialogContent>
      <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2 }}>
        Bài: {postTitle || 'Chưa chọn bài đăng'}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>
        Lý do từ chối <Box component="span" sx={{ color: '#E24B4A' }}>*</Box>
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        value={reason}
        onChange={(event) => onReasonChange(event.target.value)}
        placeholder="Nhập lý do cụ thể để thông báo cho chủ trọ..."
      />

      <Typography sx={{ fontSize: 13, fontWeight: 500, mt: 2, mb: 1 }}>Lý do phổ biến</Typography>
      <Stack>
        {QUICK_REJECT_REASONS.map((item) => (
          <FormControlLabel
            key={item}
            control={<Checkbox checked={selectedReasons.includes(item)} onChange={() => onToggleQuickReason(item)} />}
            label={<Typography sx={{ fontSize: 13 }}>{item}</Typography>}
          />
        ))}
      </Stack>

      <FormControlLabel
        sx={{ mt: 1 }}
        control={<Checkbox checked={notifyOwner} onChange={(event) => onToggleNotifyOwner(event.target.checked)} />}
        label={<Typography sx={{ fontSize: 13 }}>Gửi thông báo cho chủ trọ</Typography>}
      />

      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderColor: '#d1d5db',
            color: '#4b5563'
          }}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            textTransform: 'none',
            bgcolor: '#E24B4A',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#cc3c3b', boxShadow: 'none' }
          }}>
          Xác nhận từ chối
        </Button>
      </Stack>
    </DialogContent>
  </Dialog>
)

export default RejectPostModal
