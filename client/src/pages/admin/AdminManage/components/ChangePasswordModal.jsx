import { useEffect, useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material'

const INITIAL_FORM = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

const INITIAL_ERRORS = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  general: ''
}

const MIN_PASSWORD_LENGTH = 8

const PASSWORD_FIELDS = [
  { name: 'oldPassword', label: 'Mật khẩu hiện tại' },
  { name: 'newPassword', label: 'Mật khẩu mới' },
  { name: 'confirmPassword', label: 'Nhập lại mật khẩu mới' }
]

export const validateChangePasswordForm = (form) => {
  const errors = { ...INITIAL_ERRORS }
  let isValid = true

  if (!form.oldPassword?.trim()) {
    errors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.'
    isValid = false
  }

  if (!form.newPassword?.trim()) {
    errors.newPassword = 'Vui lòng nhập mật khẩu mới.'
    isValid = false
  } else if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `Mật khẩu mới phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
    isValid = false
  } else if (form.oldPassword && form.newPassword === form.oldPassword) {
    errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
    isValid = false
  }

  if (!form.confirmPassword?.trim()) {
    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới.'
    isValid = false
  } else if (form.newPassword && form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu mới.'
    isValid = false
  }

  return { isValid, errors }
}

const mapApiErrorToForm = (error) => {
  const message = error?.response?.data?.message || ''

  if (/old password/i.test(message)) {
    return { oldPassword: 'Mật khẩu hiện tại không đúng.', general: '' }
  }

  if (/same as the old password/i.test(message)) {
    return { newPassword: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.', general: '' }
  }

  return { general: message || 'Không thể đổi mật khẩu, vui lòng thử lại.' }
}

const ChangePasswordModal = ({ open, loading, onClose, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors(INITIAL_ERRORS)
      setShowPassword(false)
    }
  }, [open])

  const handleFieldChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }))
  }

  const handleSubmit = async () => {
    const { isValid, errors: nextErrors } = validateChangePasswordForm(form)
    setErrors(nextErrors)

    if (!isValid) return

    try {
      await onSubmit({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      })
      setForm(INITIAL_FORM)
      setErrors(INITIAL_ERRORS)
    } catch (error) {
      const apiErrors = mapApiErrorToForm(error)
      setErrors((prev) => ({ ...prev, ...apiErrors }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
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
            <LockOutlinedIcon sx={{ color: '#3f51b5', fontSize: 24, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Đổi mật khẩu</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.35 }}>
                Cập nhật mật khẩu để bảo vệ tài khoản quản trị
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose} disabled={loading}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Stack spacing={2}>
          {errors.general && (
            <Box sx={{ p: 1.25, borderRadius: '8px', bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <Typography sx={{ fontSize: 13, color: '#B91C1C' }}>{errors.general}</Typography>
            </Box>
          )}

          {PASSWORD_FIELDS.map((field) => (
            <FormControl key={field.name} fullWidth error={Boolean(errors[field.name])}>
              <InputLabel htmlFor={`change-password-${field.name}`}>{field.label}</InputLabel>
              <OutlinedInput
                id={`change-password-${field.name}`}
                type={showPassword ? 'text' : 'password'}
                value={form[field.name]}
                onChange={(event) => handleFieldChange(field.name, event.target.value)}
                label={field.label}
                disabled={loading}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Hiện hoặc ẩn mật khẩu"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{ borderRadius: '8px', fontSize: 13 }}
              />
              {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
            </FormControl>
          ))}

          <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ pt: 0.5 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
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
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                bgcolor: '#3f51b5',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#303f9f', boxShadow: 'none' }
              }}>
              {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordModal
