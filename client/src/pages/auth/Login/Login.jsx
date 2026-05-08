import { Box, Container, Paper, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useLogin } from './hooks/useLogin'
import LoginHeader from './sections/LoginHeader'
import LoginForm from './sections/LoginForm'
import SocialLogin from './sections/SocialLogin'
import LoginSidebar from './sections/LoginSidebar'

const Login = ({ setUsername, setAvatar }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { phone, setPhone, password, setPassword, validCaptcha, setValidCaptcha, captchaResetKey, handleSubmit, loginWithGoogle, loginWithFacebook } =
    useLogin({ setUsername, setAvatar })

  useEffect(() => {
    const message = location.state?.message

    if (!message) return

    Swal.fire({
      icon: 'warning',
      title: t('auth.login.alerts.noticeTitle'),
      text: message
    })

    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate, t])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'url(./login-background.webp) no-repeat center 60% / contain',
        backgroundColor: '#f7fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Container maxWidth="md" sx={{ mb: 5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <LoginHeader />

          <Paper
            elevation={6}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              width: '100%'
            }}
          >
            <Grid container>
              <Grid item xs={12} md={8} sx={{ backgroundColor: '#fff', p: { xs: 3, md: '5%' } }}>
                <Typography variant="h6" align="center" color="text.primary" gutterBottom>
                  {t('auth.login.title')}
                </Typography>

                <LoginForm
                  phone={phone}
                  setPhone={setPhone}
                  password={password}
                  setPassword={setPassword}
                  validCaptcha={validCaptcha}
                  setValidCaptcha={setValidCaptcha}
                  captchaResetKey={captchaResetKey}
                  handleSubmit={handleSubmit}
                />

                <SocialLogin loginWithGoogle={loginWithGoogle} loginWithFacebook={loginWithFacebook} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Link style={{ color: '#1e90ff', textDecoration: 'none' }} to="/register">
                    {t('auth.login.createAccount')}
                  </Link>
                  <Link style={{ color: '#1e90ff', textDecoration: 'none' }} to="/forgot-password">
                    {t('auth.login.forgotPassword')}
                  </Link>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <LoginSidebar />
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
            {t('auth.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
