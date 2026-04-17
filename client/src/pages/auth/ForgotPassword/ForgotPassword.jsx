import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoadingPage from '~/components/LoadingPage/LoadingPage'
import { useForgotPassword } from './hooks/useForgotPassword'
import ForgotPasswordForm from './sections/ForgotPasswordForm'
import OTPSection from './sections/OTPSection'

const ForgotPassword = ({ setIsAdmin }) => {
  const { t } = useTranslation()
  const {
    email,
    setEmail,
    passNew,
    setPassNew,
    passConf,
    setPassConf,
    errors,
    pageOTP,
    loading,
    otp,
    setOtp,
    requestChangePassword,
    handleSendOtp,
    handleAcceptChangePass
  } = useForgotPassword()

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <LoadingPage />

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(88, 174, 255, 0.12), transparent 28%), linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              borderRadius: 4,
              overflow: 'hidden',
              px: { xs: 2.25, sm: 3 },
              py: { xs: 3, sm: 3.5 },
              boxShadow: '0 24px 60px rgba(31, 53, 87, 0.18)'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box textAlign="center" sx={{ mb: 2.5 }}>
                <Link to="/" title={t('auth.brandTitle')}>
                  <Box
                    component="img"
                    src="/LOGO-NHATRO.png"
                    alt={t('auth.brandTitle')}
                    sx={{
                      width: 80,
                      borderRadius: '50%',
                      border: '2px solid #4bcffa',
                      mb: 2,
                      boxShadow: '0 1rem 2rem 0 rgb(0 0 0 / 3%), 0 0.5rem 1rem 0 rgb(0 0 0 / 5%)'
                    }}
                  />
                </Link>

                <Typography
                  sx={{
                    fontSize: { xs: '1.65rem', sm: '1.9rem' },
                    fontWeight: 900,
                    lineHeight: 1.2,
                    color: '#1f3557'
                  }}
                >
                  {t('auth.forgotPassword.title')}
                </Typography>
              </Box>

              {!pageOTP ? (
                <ForgotPasswordForm
                  email={email}
                  passNew={passNew}
                  passConf={passConf}
                  errors={errors}
                  setEmail={setEmail}
                  setPassNew={setPassNew}
                  setPassConf={setPassConf}
                  onSubmit={requestChangePassword}
                />
              ) : (
                <OTPSection email={email} otp={otp} onOtpChange={setOtp} onResend={handleSendOtp} onConfirm={handleAcceptChangePass} />
              )}
            </Box>
          </Paper>

          <Typography textAlign="center" mt={5} variant="body1" sx={{ color: '#111827' }}>
            {t('auth.forgotPassword.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default ForgotPassword
