import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { BORDER, LOCK_DURATION_OPTIONS, LOCK_REASON_OPTIONS, getNotificationPreview } from './userManagementUtils'

const UserLockModal = ({ open, user, form, onClose, onChange, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    PaperProps={{
      sx: {
        borderRadius: '12px',
        width: 440,
        maxWidth: 'calc(100vw - 24px)',
        boxShadow: 'none'
      }
    }}
    BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.45)' } }}>
    <DialogTitle sx={{ px: 3, py: 2.5 }}>
      <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1.5}>
          <LockOutlinedIcon sx={{ color: '#E24B4A', fontSize: 24, mt: 0.2 }} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Khóa tài khoản</Typography>
            <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.35 }}>{user?.fullName || '[Tên người dùng]'}</Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </DialogTitle>

    <DialogContent sx={{ px: 3, pb: 3 }}>
      <Stack spacing={2.25}>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.25 }}>
            Thời gian khóa <Box component="span" sx={{ color: '#E24B4A' }}>*</Box>
          </Typography>
          <Stack spacing={1}>
            {LOCK_DURATION_OPTIONS.map((option) => {
              const active = form.duration === option.value
              return (
                <Box
                  key={option.value}
                  onClick={() => onChange('duration', option.value)}
                  sx={{
                    border: active ? '1.5px solid #E24B4A' : BORDER,
                    borderRadius: '8px',
                    p: 1.25,
                    bgcolor: active ? '#FFF5F5' : '#ffffff',
                    cursor: 'pointer'
                  }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{option.title}</Typography>
                  {option.description && (
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: option.descriptionColor }}>{option.description}</Typography>
                  )}
                </Box>
              )
            })}
          </Stack>
        </Box>

        <TextField
          select
          label="Lý do khóa *"
          value={form.reason}
          onChange={(event) => onChange('reason', event.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }}>
          {LOCK_REASON_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {form.reason === 'Lý do khác' && (
          <TextField
            multiline
            minRows={3}
            placeholder="Nhập lý do cụ thể..."
            value={form.otherReason}
            onChange={(event) => onChange('otherReason', event.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }}
          />
        )}

        <FormControlLabel
          control={<Switch checked={form.sendNotification} onChange={(event) => onChange('sendNotification', event.target.checked)} />}
          label={<Typography sx={{ fontSize: 13 }}>Gửi thông báo cho người dùng</Typography>}
        />

        {form.sendNotification && (
          <Box sx={{ p: 1.5, borderRadius: '8px', border: BORDER, bgcolor: '#F9FAFB' }}>
            <Typography sx={{ fontSize: 12, color: '#6B7280', mb: 0.75 }}>Nội dung thông báo</Typography>
            <Typography sx={{ fontSize: 13, color: '#111827' }}>
              {getNotificationPreview(user?.fullName, form.duration, form.reason === 'Lý do khác' ? form.otherReason : form.reason)}
            </Typography>
          </Box>
        )}

        <FormControlLabel
          control={<Checkbox checked={form.hidePosts} onChange={(event) => onChange('hidePosts', event.target.checked)} />}
          label={<Typography sx={{ fontSize: 13 }}>Ẩn toàn bộ bài đăng của người dùng này</Typography>}
        />

        <Stack direction="row" spacing={1.25} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: '#D1D5DB',
              color: '#4B5563'
            }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: '#E24B4A',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#C73939', boxShadow: 'none' }
            }}>
            Xác nhận khóa
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  </Dialog>
)

export default UserLockModal
