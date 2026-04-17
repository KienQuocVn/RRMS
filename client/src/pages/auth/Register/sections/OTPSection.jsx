import { Box, Button, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import OTPInput from '../../ForgotPassword/components/OTPInput'

const OTPSection = ({ gmail, otp, onOtpChange, onResend, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h5" textAlign="center" fontWeight={700} mb={2}>
        {t('auth.register.otpTitle')}
      </Typography>

      <Box display="flex" justifyContent="center" my={3}>
        <Box sx={{ width: 300 }}>
          <OTPInput length={5} value={otp} onChange={onOtpChange} />
        </Box>
      </Box>

      <Typography variant="body2" mb={2}>
        <Trans i18nKey="auth.register.otpDescription" values={{ gmail }} components={{ strong: <strong /> }} />
      </Typography>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" onClick={onResend} sx={{ px: 3, py: 1.5 }}>
          {t('auth.register.resend')}
        </Button>
        <Button variant="contained" onClick={onConfirm} sx={{ px: 3, py: 1.5 }}>
          {t('auth.register.confirmOtp')}
        </Button>
      </Box>
    </Box>
  )
}

export default OTPSection
