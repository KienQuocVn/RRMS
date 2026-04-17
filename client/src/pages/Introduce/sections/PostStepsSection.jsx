import { Box, Container, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { postingSteps } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const PostStepsSection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <SectionTitle
        title={t('introduce.postSteps.title')}
        description={t('introduce.postSteps.description')}
        align="center"
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {postingSteps.map((item) => (
          <Paper
            key={item.step}
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: 3,
              border: '1px solid',
              borderColor: `${item.color}33`,
              backgroundColor: '#fff'
            }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  color: '#fff',
                  fontWeight: 800,
                  bgcolor: item.color
                }}>
                {item.step}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#111827' }}>{t(item.titleKey)}</Typography>
                <Typography sx={{ mt: 0.75, color: 'text.secondary', lineHeight: 1.7 }}>{t(item.descriptionKey)}</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  )
}

export default PostStepsSection
