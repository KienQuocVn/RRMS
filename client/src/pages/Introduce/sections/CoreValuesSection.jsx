import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Box, CardMedia, Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { coreValueKeys } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const CoreValuesSection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <SectionTitle title={t('introduce.coreValues.title')} align="center" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.9fr) minmax(0, 1.1fr)' },
          gap: { xs: 4, md: 6 },
          alignItems: 'center'
        }}>
        <CardMedia
          component="img"
          image="https://lozido.com/images/pages/about/gia-tri-cot-loi.webp"
          alt={t('introduce.coreValues.imageAlt')}
          sx={{ width: '100%', maxWidth: 460, justifySelf: 'center' }}
        />

        <Stack spacing={2}>
          {coreValueKeys.map((key) => (
            <Box key={key} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <CheckCircleRoundedIcon sx={{ mt: 0.25, color: '#2e7d32' }} />
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{t(key)}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default CoreValuesSection
