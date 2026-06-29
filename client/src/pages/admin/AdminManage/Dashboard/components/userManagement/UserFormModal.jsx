import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { PRIMARY, PRIMARY_HOVER, BORDER, getInitials } from './userManagementUtils'

const ROLE_OPTIONS = [
  { value: 'Người thuê', label: 'Người thuê', icon: PersonOutlineRoundedIcon },
  { value: 'Chủ trọ', label: 'Chủ trọ', icon: ApartmentRoundedIcon },
  { value: 'Admin', label: 'Admin', icon: AdminPanelSettingsRoundedIcon }
]

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 13
  }
}

const roleToPayload = (role) => {
  if (role === 'Chủ trọ') return 'HOST'
  if (role === 'Admin') return 'ADMIN'
  return 'CUSTOMER'
}

const UserFormModal = ({
  open,
  mode,
  form,
  showPassword,
  onClose,
  onChange,
  onToggleShowPassword,
  onSubmit
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    PaperProps={{
      sx: {
        borderRadius: '12px',
        width: 520,
        maxWidth: 'calc(100vw - 24px)',
        boxShadow: 'none'
      }
    }}
    BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.45)' } }}>
    <DialogTitle sx={{ px: 3, py: 2.5 }}>
      <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1.5}>
          <PersonAddAlt1RoundedIcon sx={{ color: PRIMARY, fontSize: 24, mt: 0.2 }} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
              {mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.4 }}>Điền đầy đủ thông tin bên dưới</Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </DialogTitle>

    <DialogContent sx={{ px: 3, pb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2
        }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={1} alignItems="center">
              <Box
                component="label"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '1.5px dashed #E5E7EB',
                  bgcolor: '#F9FAFB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}>
                <input type="file" hidden accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    onChange('avatar', URL.createObjectURL(file))
                  }
                }} />
                {form.avatar ? (
                  <Avatar src={form.avatar} sx={{ width: '100%', height: '100%' }} />
                ) : (
                  <Stack spacing={0.5} alignItems="center">
                    <PhotoCameraOutlinedIcon sx={{ color: '#9CA3AF' }} />
                    <Typography sx={{ fontSize: 10, color: '#6B7280' }}>{getInitials(form.fullName)}</Typography>
                  </Stack>
                )}
              </Box>
              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Tải ảnh lên</Typography>
            </Stack>
          </Box>

          <TextField label="Họ và tên *" value={form.fullName} onChange={(event) => onChange('fullName', event.target.value)} sx={inputSx} />
          <TextField label="Email *" value={form.email} onChange={(event) => onChange('email', event.target.value)} sx={inputSx} />
          <TextField label="Số điện thoại" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} sx={inputSx} />
        </Stack>

        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>
              Vai trò <Box component="span" sx={{ color: '#E24B4A' }}>*</Box>
            </Typography>
            <Stack spacing={1}>
              {ROLE_OPTIONS.map((option) => {
                const active = form.role === option.value
                const Icon = option.icon
                return (
                  <Box
                    key={option.value}
                    onClick={() => onChange('role', option.value)}
                    sx={{
                      border: active ? `1.5px solid ${PRIMARY}` : BORDER,
                      borderRadius: '8px',
                      p: 1.25,
                      bgcolor: active ? '#F0F9FF' : '#ffffff',
                      cursor: 'pointer'
                    }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Icon sx={{ fontSize: 18, color: active ? PRIMARY : '#6B7280' }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{option.label}</Typography>
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Box>

          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => onChange('password', event.target.value)}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <IconButton edge="end" onClick={onToggleShowPassword}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              )
            }}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(event) => onChange('confirmPassword', event.target.value)}
            sx={inputSx}
          />
          <TextField label="Tên đăng nhập" value={form.username} onChange={(event) => onChange('username', event.target.value)} sx={inputSx} disabled={mode === 'edit'} />
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <TextField label="Địa chỉ" value={form.address} onChange={(event) => onChange('address', event.target.value)} sx={inputSx} />
        <FormControlLabel
          control={<Switch checked={form.sendWelcomeEmail} onChange={(event) => onChange('sendWelcomeEmail', event.target.checked)} />}
          label={<Typography sx={{ fontSize: 13 }}>Gửi email chào mừng kèm mật khẩu</Typography>}
        />
        <FormControlLabel
          control={<Switch checked={form.requireEmailVerification} onChange={(event) => onChange('requireEmailVerification', event.target.checked)} />}
          label={<Typography sx={{ fontSize: 13 }}>Yêu cầu xác minh email trước khi đăng nhập</Typography>}
        />
      </Stack>

      <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ mt: 3 }}>
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
          onClick={() => onSubmit(roleToPayload(form.role))}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            bgcolor: PRIMARY,
            boxShadow: 'none',
            '&:hover': { bgcolor: PRIMARY_HOVER, boxShadow: 'none' }
          }}>
          {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo tài khoản'}
        </Button>
      </Stack>
    </DialogContent>
  </Dialog>
)

export default UserFormModal
