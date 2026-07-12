import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded'
import { Box, Card, CardMedia, Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { storyParagraphKeys } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const StorySection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' },
          gap: { xs: 4, md: 6 },
          alignItems: 'start'
        }}>
        <Box>
          <SectionTitle title={t('introduce.story.title')} />
          <Stack spacing={2}>
            {storyParagraphKeys.map((key) => (
              <Typography key={key} sx={{ color: 'text.secondary', lineHeight: 1.9, fontSize: 16 }}>
                {t(key)}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)'
          }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image="https://bandon.vn/resize/1000x700/a-c/zc-1/f/uploads/posts/cach-tim-phong-tro-sinh-vien-1.jpg"
              alt={t('introduce.story.imageAlt')}
              sx={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(17,24,39,0) 30%, rgba(17,24,39,0.78) 100%)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
              <PlayCircleFilledWhiteRoundedIcon sx={{ fontSize: 42 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#fff' }}>{t('introduce.story.cardTitle')}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: 14 }}>
                  {t('introduce.story.cardDescription')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default StorySection
