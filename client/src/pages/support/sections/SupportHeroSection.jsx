import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function SupportHeroSection() {
  const { t } = useTranslation()

  return (
    <Stack spacing={0.75} alignItems="center" textAlign="center">
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: 32, md: 46 },
          lineHeight: 1.2,
          fontWeight: 800,
          color: '#334154',
          letterSpacing: '-0.02em'
        }}
      >
        {t('support.title')}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 15, md: 17 },
          color: '#111827'
        }}
      >
        {t('support.subtitle')}
      </Typography>
    </Stack>
  )
}
