import { useState } from 'react'
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import OTPInput from '../components/OTPInput'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover': { backgroundColor: '#f1f5f9' },
    '&.Mui-focused': { backgroundColor: '#fff' }
  }
}

const OTPSection = ({ email, otp, onOtpChange, onResend, onConfirm, onBack, errors, passNew, setPassNew, passConf, setPassConf, loading }) => {
  const { t } = useTranslation()
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)

  return (
    <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      {/* Icon */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LockResetOutlinedIcon sx={{ fontSize: 36, color: '#16a34a' }} />
        </Box>
      </Box>

      {/* Mô tả */}
      <Typography variant="body1" sx={{ color: '#475569', textAlign: 'center', lineHeight: 1.7, mb: 0.5 }}>
        <Trans i18nKey="auth.forgotPassword.otpDescription" values={{ email }} components={{ strong: <strong style={{ color: '#0284c7' }} /> }} />
      </Typography>

      {/* OTP Input */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={3} mb={errors.otp ? 0.5 : 2}>
        <OTPInput length={5} value={otp} onChange={onOtpChange} />
        {errors.otp && (
          <Typography variant="caption" color="error" mt={1}>
            {errors.otp}
          </Typography>
        )}
      </Box>

      {/* Gửi lại OTP */}
      <Box textAlign="center" mb={3}>
        <Button
          variant="text"
          size="small"
          onClick={onResend}
          disabled={loading}
          id="btn-resend-otp"
          sx={{ textTransform: 'none', fontSize: '0.9rem', color: '#0284c7' }}
        >
          {t('auth.forgotPassword.resend')}
        </Button>
      </Box>

      {/* Mật khẩu mới */}
      <TextField
        fullWidth
        required
        id="forgot-new-password"
        type={showPass ? 'text' : 'password'}
        label={t('auth.forgotPassword.newPasswordLabel')}
        placeholder={t('auth.forgotPassword.passwordPlaceholder')}
        value={passNew}
        onChange={(e) => setPassNew(e.target.value)}
        error={!!errors.passNew}
        helperText={errors.passNew}
        sx={{ ...inputSx, mb: 2 }}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPass((p) => !p)} edge="end" size="small">
                {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* Xác nhận mật khẩu */}
      <TextField
        fullWidth
        required
        id="forgot-confirm-password"
        type={showConf ? 'text' : 'password'}
        label={t('auth.forgotPassword.confirmPasswordLabel')}
        placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
        value={passConf}
        onChange={(e) => setPassConf(e.target.value)}
        error={!!errors.passConf || !!errors.identical}
        helperText={errors.passConf || errors.identical}
        sx={{ ...inputSx, mb: 0.5 }}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConf((p) => !p)} edge="end" size="small">
                {showConf ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* Nút xác nhận */}
      <Button
        fullWidth
        variant="contained"
        onClick={onConfirm}
        disabled={loading}
        id="btn-confirm-otp"
        sx={{
          mt: 3,
          background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '1rem',
          py: 1.6,
          textTransform: 'none',
          boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 12px 28px rgba(22, 163, 74, 0.4)'
          },
          '&.Mui-disabled': { opacity: 0.7 }
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: '#fff' }} />
        ) : (
          t('auth.forgotPassword.confirmOtp')
        )}
      </Button>

      {/* Quay lại */}
      <Box textAlign="center" mt={2}>
        <Button
          variant="text"
          onClick={onBack}
          disabled={loading}
          sx={{ textTransform: 'none', fontSize: '0.9rem', color: '#64748b' }}
        >
          ← {t('auth.forgotPassword.backToEmail')}
        </Button>
      </Box>
    </Box>
  )
}

export default OTPSection
