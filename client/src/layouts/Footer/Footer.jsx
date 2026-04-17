import { Box, Container, Divider } from '@mui/material'
import { FooterApps } from './sections/FooterApps'
import { FooterContact } from './sections/FooterContact'
import { FooterCopyright } from './sections/FooterCopyright'
import { FooterHotlines } from './sections/FooterHotlines'
import { FooterInfo } from './sections/FooterInfo'
import { FooterLinks } from './sections/FooterLinks'
import { FooterSocial } from './sections/FooterSocial'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #e2e8f0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: { xs: -40, md: 0 },
          bottom: 0,
          width: { xs: 180, md: 360 },
          height: { xs: 120, md: 220 },
          pointerEvents: 'none',
          opacity: 0.18,
          backgroundImage: 'url(/city_building_3474029.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom right',
          backgroundSize: 'contain'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 4.5, md: 5.5 } }}>
        <Box sx={{ maxWidth: 1140, mx: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.15fr) minmax(0, 0.7fr) minmax(0, 1fr)' },
              gap: { xs: 3, md: 4 }
            }}
          >
            <FooterInfo />
            <FooterLinks />
            <FooterContact />
          </Box>

          <Box sx={{ mt: { xs: 3.5, md: 4 } }}>
            <FooterHotlines />
          </Box>

          <Divider sx={{ my: { xs: 3, md: 3.5 }, borderColor: 'rgba(148, 163, 184, 0.2)' }} />

          <FooterSocial />

          <Box sx={{ mt: { xs: 3, md: 3.5 } }}>
            <FooterApps />
          </Box>

          <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
            <FooterCopyright />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
