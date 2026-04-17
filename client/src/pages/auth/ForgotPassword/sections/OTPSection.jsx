import { Box, Button, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import OTPInput from '../components/OTPInput'

const OTPSection = ({ email, otp, onOtpChange, onResend, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', px: { xs: 0.5, sm: 1 } }}>
      <Typography variant="h5" textAlign="center" fontWeight={700} mb={2.5}>
        {t('auth.forgotPassword.otpTitle')}
      </Typography>

      <Box display="flex" justifyContent="center" my={3}>
        <OTPInput length={5} value={otp} onChange={onOtpChange} />
      </Box>

      <Typography variant="body1" mb={3} sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'center' }}>
        <Trans i18nKey="auth.forgotPassword.otpDescription" values={{ email }} components={{ strong: <strong /> }} />
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button variant="outlined" onClick={onResend} sx={{ px: 3, py: 1.5, borderRadius: '12px', textTransform: 'none' }}>
          {t('auth.forgotPassword.resend')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #84cf42 0%, #3ea942 100%)'
          }}
        >
          {t('auth.forgotPassword.confirmOtp')}
        </Button>
      </Box>
    </Box>
  )
}

export default OTPSection
