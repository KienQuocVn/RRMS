import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const HeroSection = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        backgroundImage:
          "linear-gradient(180deg, rgba(9, 16, 29, 0.72) 0%, rgba(9, 16, 29, 0.88) 100%), url('/images/bg-banner.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: { xs: 9, md: 12 }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, textAlign: 'center', mx: 'auto' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 30, md: 42 },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.03em'
            }}
          >
            {t('introduce.hero.title')}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontSize: { xs: 18, md: 22 },
              fontWeight: 600,
              color: 'rgba(255,255,255,0.92)'
            }}
          >
            {t('introduce.hero.subtitle')}
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,0.74)' }}>
            {t('introduce.hero.description')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
