import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function FooterCopyright() {
  const { t } = useTranslation()

  return (
    <Box sx={{ textAlign: 'center', pb: { xs: 1, md: 0.5 } }}>
      <Typography sx={{ fontSize: 14, color: '#101828' }}>{t('footer.copyright.line1')}</Typography>
      <Typography sx={{ mt: 0.7, fontSize: 14, fontWeight: 800, color: '#475467', textTransform: 'uppercase' }}>
        {t('footer.copyright.company')}
      </Typography>
      <Typography sx={{ mt: 0.7, fontSize: 13, color: '#667085' }}>{t('footer.copyright.line3')}</Typography>
    </Box>
  )
}
