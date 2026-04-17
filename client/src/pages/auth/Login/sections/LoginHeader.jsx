import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const LoginHeader = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ textAlign: 'center', mt: 5, mb: 3 }}>
      <Link to="/" title={t('auth.brandTitle')}>
        <Box
          component="img"
          src="/LOGO-NHATRO.png"
          alt={t('auth.brandTitle')}
          sx={{
            width: 80,
            borderRadius: '50%',
            border: '2px solid #4bcffa',
            my: 2,
            boxShadow: '0 1rem 2rem rgba(0,0,0,0.03), 0 0.5rem 1rem rgba(0,0,0,0.05)'
          }}
        />
      </Link>

      <Typography variant="h5" fontWeight={800} lineHeight={1.3} color="text.primary">
        <Box component="span" sx={{ color: '#4bcffa', display: 'block' }}>
          {t('auth.brandTitle')}
        </Box>
        {t('auth.brandSubtitle')}
      </Typography>
    </Box>
  )
}

export default LoginHeader
