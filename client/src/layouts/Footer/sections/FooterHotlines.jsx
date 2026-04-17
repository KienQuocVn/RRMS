import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { footerHotlines } from '../footer.data'

export function FooterHotlines() {
  const { t } = useTranslation()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ mb: 1.8, fontSize: 15, color: '#667085' }}>{t('footer.supportText')}</Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2
        }}
      >
        {footerHotlines.map((item) => (
          <Box
            key={item.cityKey}
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: 2.5,
              border: '1px solid rgba(140, 180, 120, 0.18)',
              background: 'linear-gradient(180deg, #f7fbe9 0%, #eef7de 100%)',
              boxShadow: '0 10px 22px rgba(149, 163, 184, 0.08)'
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#667085' }}>{t(`footer.hotlines.${item.cityKey}`)}</Typography>
            <Typography sx={{ mt: 0.2, fontSize: 13, fontWeight: 800, color: item.accent, textTransform: 'uppercase' }}>
              {t(`footer.hotlines.${item.labelKey}`)}
            </Typography>
            <Typography sx={{ mt: 0.55, fontSize: { xs: 18, md: 20 }, fontWeight: 900, color: '#101828' }}>
              {item.phone}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
