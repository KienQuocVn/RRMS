import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const RegisterHeader = () => {
  const { t } = useTranslation()

  return (
    <Box textAlign="center" mt={5}>
      <Link to="/" title={t('auth.brandTitle')}>
        <Box
          component="img"
          src="/LOGO-NHATRO.png"
          alt={t('auth.brandTitle')}
          title={t('auth.brandTitle')}
          sx={{
            width: 80,
            borderRadius: '50%',
            border: '2px solid #4bcffa',
            my: '15px',
            boxShadow: '0 1rem 2rem 0 rgb(0 0 0 / 3%), 0 0.5rem 1rem 0 rgb(0 0 0 / 5%)'
          }}
        />
      </Link>

      <Typography variant="h4" fontWeight={800} mb={2}>
        <Box component="span" sx={{ color: '#4bcffa' }}>
          {t('auth.register.title')}
        </Box>
      </Typography>

      <Typography variant="h5" fontWeight={700} mb={2}>
        <Box component="span" sx={{ color: '#4bcffa' }}>
          {t('auth.brandTitle')}
        </Box>
        <br />
        {t('auth.brandSubtitle')}
      </Typography>
    </Box>
  )
}

export default RegisterHeader
