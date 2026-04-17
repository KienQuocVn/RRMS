import AppleIcon from '@mui/icons-material/Apple'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { footerApps } from '../footer.data'

const storeButtonSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.2,
  py: 0.75,
  borderRadius: 1.5,
  backgroundColor: '#101828',
  color: '#fff',
  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.16)'
}

export function FooterApps() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
        p: { xs: 2, md: 2.25 },
        borderRadius: 3,
        backgroundColor: '#fff',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 18px 40px rgba(148, 163, 184, 0.08)'
      }}
    >
      {footerApps.map((app) => (
        <Box
          key={app.titleKey}
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/qr-code.png"
            alt={t(`footer.apps.${app.titleKey}`)}
            sx={{
              width: { xs: 80, md: 90 },
              height: { xs: 80, md: 90 },
              borderRadius: 2,
              border: '1px solid rgba(148, 163, 184, 0.25)',
              objectFit: 'cover'
            }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, lineHeight: 1.25, color: '#344054' }}>
              {t(`footer.apps.${app.titleKey}`)}
            </Typography>
            <Typography sx={{ mt: 0.35, fontSize: 14, color: '#667085' }}>{t(`footer.apps.${app.descriptionKey}`)}</Typography>

            <Box sx={{ mt: 1.25, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={storeButtonSx}>
                <AppleIcon sx={{ fontSize: 20 }} />
                <Box>
                  <Typography sx={{ fontSize: 9, lineHeight: 1 }}>{t('footer.apps.appStoreTop')}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>{t('footer.apps.appStoreBottom')}</Typography>
                </Box>
              </Box>

              <Box sx={storeButtonSx}>
                <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                <Box>
                  <Typography sx={{ fontSize: 9, lineHeight: 1 }}>{t('footer.apps.googlePlayTop')}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>{t('footer.apps.googlePlayBottom')}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
