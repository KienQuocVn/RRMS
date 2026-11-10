import { Link } from 'react-router-dom'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover': { backgroundColor: '#f1f5f9' },
    '&.Mui-focused': { backgroundColor: '#fff' }
  }
}

const ForgotPasswordForm = ({ email, emailError, setEmail, onSubmit, loading }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      {/* Icon minh hoạ */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EmailOutlinedIcon sx={{ fontSize: 36, color: '#0284c7' }} />
        </Box>
      </Box>

      <Typography variant="body1" textAlign="center" sx={{ color: '#475569', mb: 3, lineHeight: 1.7 }}>
        {t('auth.forgotPassword.step1Description')}
      </Typography>

      <TextField
        fullWidth
        required
        id="forgot-password-email"
        label={t('auth.forgotPassword.emailLabel')}
        placeholder={t('auth.forgotPassword.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && onSubmit()}
        size="medium"
        type="email"
        error={!!emailError}
        helperText={emailError}
        sx={inputSx}
        autoFocus
        autoComplete="email"
      />

      <Button
        fullWidth
        variant="contained"
        onClick={onSubmit}
        disabled={loading}
        id="btn-send-otp"
        sx={{
          mt: 3,
          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '1rem',
          py: 1.6,
          textTransform: 'none',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            boxShadow: '0 12px 28px rgba(2, 132, 199, 0.4)'
          },
          '&.Mui-disabled': { opacity: 0.7 }
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: '#fff' }} />
        ) : (
          t('auth.forgotPassword.submitSendOtp')
        )}
      </Button>

      <Box textAlign="center" mt={2.5}>
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{ textDecoration: 'none', textTransform: 'none', fontSize: '0.95rem', color: '#64748b' }}
        >
          ← {t('auth.forgotPassword.backToLogin')}
        </Button>
      </Box>
    </Box>
  )
}

export default ForgotPasswordForm
