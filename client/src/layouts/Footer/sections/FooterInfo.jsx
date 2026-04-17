import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function FooterInfo() {
  const { t } = useTranslation()

  return (
    <Box sx={{ maxWidth: 430 }}>
      <Box
        component="img"
        src="/logo.png"
        alt="RRMS logo"
        sx={{
          width: { xs: 168, md: 218 },
          height: 'auto',
          objectFit: 'contain',
          mb: 1.5
        }}
      />

      <Typography
        color="text.secondary"
        sx={{
          fontSize: { xs: 14, md: 15 },
          lineHeight: 1.7,
          maxWidth: 420
        }}
      >
        {t('footer.infoDescription')}
      </Typography>
    </Box>
  )
}
