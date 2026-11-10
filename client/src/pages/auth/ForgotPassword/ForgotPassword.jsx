import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForgotPassword } from './hooks/useForgotPassword'
import ForgotPasswordForm from './sections/ForgotPasswordForm'
import OTPSection from './sections/OTPSection'

const ForgotPassword = ({ setIsAdmin }) => {
  const { t } = useTranslation()
  const {
    // step 1
    email,
    setEmail,
    emailError,
    requestOtp,
    // step 2
    otp,
    setOtp,
    passNew,
    setPassNew,
    passConf,
    setPassConf,
    step2Errors,
    resendOtp,
    handleAcceptChangePass,
    goBackToStep1,
    // shared
    step,
    loading
  } = useForgotPassword()

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stepTitle = step === 1 ? t('auth.forgotPassword.title') : t('auth.forgotPassword.otpTitle')

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(74, 222, 128, 0.08), transparent 30%), linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
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
              px: { xs: 2.5, sm: 4 },
              py: { xs: 3.5, sm: 4.5 },
              boxShadow: '0 24px 60px rgba(31, 53, 87, 0.15)'
            }}
          >
            <Box sx={{ width: '100%' }}>
              {/* Logo + Tiêu đề */}
              <Box textAlign="center" sx={{ mb: 3 }}>
                <Link to="/" title={t('auth.brandTitle')}>
                  <Box
                    component="img"
                    src="/LOGO-NHATRO.png"
                    alt={t('auth.brandTitle')}
                    sx={{
                      width: 72,
                      borderRadius: '50%',
                      border: '2px solid #38bdf8',
                      mb: 2,
                      boxShadow: '0 1rem 2rem 0 rgb(0 0 0 / 5%)'
                    }}
                  />
                </Link>

                {/* Step indicator */}
                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                  {[1, 2].map((s) => (
                    <Box
                      key={s}
                      sx={{
                        width: s === step ? 32 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: s === step ? '#0284c7' : s < step ? '#16a34a' : '#e2e8f0',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    fontWeight: 900,
                    lineHeight: 1.2,
                    color: '#1e293b'
                  }}
                >
                  {stepTitle}
                </Typography>
              </Box>

              {step === 1 ? (
                <ForgotPasswordForm
                  email={email}
                  emailError={emailError}
                  setEmail={setEmail}
                  onSubmit={requestOtp}
                  loading={loading}
                />
              ) : (
                <OTPSection
                  email={email}
                  otp={otp}
                  onOtpChange={setOtp}
                  onResend={resendOtp}
                  onConfirm={handleAcceptChangePass}
                  onBack={goBackToStep1}
                  errors={step2Errors}
                  passNew={passNew}
                  setPassNew={setPassNew}
                  passConf={passConf}
                  setPassConf={setPassConf}
                  loading={loading}
                />
              )}
            </Box>
          </Paper>

          <Typography textAlign="center" mt={4} variant="body2" sx={{ color: '#94a3b8' }}>
            {t('auth.forgotPassword.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default ForgotPassword
