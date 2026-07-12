import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { missionItemKeys } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const MissionVisionSection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <SectionTitle title={t('introduce.missionVision.title')} align="center" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.9fr) minmax(320px, 1.1fr)' },
          gap: { xs: 3, md: 5 },
          alignItems: 'stretch'
        }}>
        <Stack spacing={2.5}>
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>{t('introduce.missionVision.missionTitle')}</Typography>
            <Stack spacing={1.5}>
              {missionItemKeys.map((key) => (
                <Typography key={key} sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t(key)}
                </Typography>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>{t('introduce.missionVision.visionTitle')}</Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{t('introduce.missionVision.visionText')}</Typography>
          </Paper>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            minHeight: 320,
            border: '1px solid',
            borderColor: '#e5e7eb',
            background:
              'linear-gradient(135deg, rgba(255,248,220,0.9) 0%, rgba(255,255,255,1) 36%, rgba(243,244,246,1) 100%)'
          }}>
          <FormatQuoteRoundedIcon sx={{ fontSize: 56, color: '#111827' }} />
          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: 44, md: 74 },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.05em',
              color: '#111827'
            }}>
            Make
            <br />
            Commerce
            <br />
            Better
          </Typography>
          <Typography sx={{ mt: 2.5, maxWidth: 420, color: 'text.secondary', lineHeight: 1.8 }}>
            {t('introduce.missionVision.quoteBody')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default MissionVisionSection
