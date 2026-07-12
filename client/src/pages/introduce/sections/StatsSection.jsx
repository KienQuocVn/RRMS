import { alpha } from '@mui/material/styles'
import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { stats } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const StatsSection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <SectionTitle
        title={t('introduce.stats.title')}
        description={t('introduce.stats.description')}
        align="center"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2.5
        }}>
        {stats.map(({ labelKey, value, Icon }) => (
          <Paper
            key={labelKey}
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}>
            <Box
              sx={{
                width: 74,
                height: 74,
                mx: 'auto',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: '#22a55f',
                bgcolor: alpha('#22a55f', 0.1)
              }}>
              <Icon sx={{ fontSize: 36 }} />
            </Box>
            <Typography sx={{ mt: 2, fontSize: 32, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
              {value}
            </Typography>
            <Typography sx={{ mt: 0.75, color: 'text.secondary', fontWeight: 600 }}>{t(labelKey)}</Typography>
          </Paper>
        ))}
      </Box>

      <Typography sx={{ mt: 3, textAlign: 'center', color: 'text.secondary', lineHeight: 1.8 }}>
        {t('introduce.stats.footerText')}
      </Typography>
    </Container>
  )
}

export default StatsSection
