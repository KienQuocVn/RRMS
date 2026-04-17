import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const LoginSidebar = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(to left, #6fceee, #4bcffa)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Box
        component="img"
        src="/qr-code.png"
        alt={t('auth.sidebar.qrAlt')}
        sx={{
          width: 110,
          borderRadius: 2,
          border: '2px solid #1d6b1b',
          mb: 1.5
        }}
      />

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {t('auth.sidebar.scanTitle')}
      </Typography>

      <Typography variant="caption" sx={{ fontSize: 13, opacity: 0.9 }}>
        {t('auth.sidebar.description')}
      </Typography>
    </Box>
  )
}

export default LoginSidebar
