import { useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoadingPage from '~/components/LoadingPage/LoadingPage'
import { useRegister } from './hooks/useRegister'
import RegisterHeader from './sections/RegisterHeader'
import RegisterForm from './sections/RegisterForm'

const Register = ({ setIsAdmin }) => {
  const { t } = useTranslation()
  const { form, updateField, loading, handleRegister } = useRegister()

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <LoadingPage />

  return (
    <Box
      component="body"
      sx={{
        backgroundColor: '#f7fafc',
        background: 'url(./login-background.webp) no-repeat',
        backgroundSize: 'contain',
        backgroundPositionY: '60%',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="md" sx={{ mb: 5 }}>
        <Box className="login-container d-flex" id="login" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Box className="login-content-container" sx={{ maxWidth: 800, minWidth: 300, width: '100%', alignSelf: 'center' }}>
            <RegisterHeader />

            <RegisterForm form={form} updateField={updateField} onSubmit={handleRegister} />

            <Typography textAlign="center" mt={5} variant="body2">
              {t('auth.copyright')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Register
