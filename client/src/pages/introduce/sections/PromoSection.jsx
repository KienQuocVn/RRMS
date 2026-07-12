import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Box, Button, CardMedia, Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { promoCards } from '../hooks/introduceData'

const PromoSection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            borderRadius: 4,
            px: { xs: 3, md: 5 },
            py: { xs: 3.5, md: 4.5 },
            color: '#123524',
            background: 'linear-gradient(90deg, #efffd5 0%, #dbf9f3 100%)',
            border: '1px solid #d7f0d6'
          }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(260px, 0.8fr)' },
              gap: 3,
              alignItems: 'center'
            }}>
            <Box>
              <Typography sx={{ fontSize: { xs: 30, md: 36 }, fontWeight: 800, lineHeight: 1.15 }}>
                {t('introduce.promo.heroTitle')}
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 800,
                  color: '#8e24aa'
                }}>
                {t('introduce.promo.heroSubtitle')}
              </Typography>
              <Typography sx={{ mt: 1.75, color: 'rgba(18,53,36,0.78)', lineHeight: 1.8, maxWidth: 560 }}>
                {t('introduce.promo.heroDescription')}
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 3,
                  borderRadius: 999,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#ff9800',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#f57c00', boxShadow: 'none' }
                }}>
                {t('introduce.promo.heroButton')}
              </Button>
            </Box>

            <Box sx={{ position: 'relative', maxWidth: 320, width: '100%', mx: 'auto' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: -12,
                  width: 22,
                  height: 22,
                  bgcolor: '#ffd54f',
                  borderRadius: '50%'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 30,
                  right: -10,
                  width: 16,
                  height: 16,
                  bgcolor: '#ff8a65',
                  borderRadius: '50%'
                }}
              />
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '40px 40px 120px 40px',
                  background: 'linear-gradient(160deg, #2196f3 0%, #5e35b1 100%)',
                  p: 2
                }}>
                <CardMedia
                  component="img"
                  image="/images/quan-ly-tro-smart.png"
                  alt={t('introduce.promo.heroImageAlt')}
                  sx={{ width: '100%', borderRadius: 4 }}
                />
              </Paper>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {promoCards.map((card, index) => {
            const Icon = index === 0 ? CampaignRoundedIcon : StarRoundedIcon

            return (
              <Paper
                key={card.titleKey}
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 3.5,
                  background: card.background,
                  color: '#fff'
                }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 170px' },
                    alignItems: 'center',
                    gap: 2,
                    p: { xs: 3, md: 3.5 }
                  }}>
                  <Box>
                    <Icon sx={{ fontSize: 28, mb: 1 }} />
                    <Typography sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 800, lineHeight: 1.2 }}>
                      {t(card.titleKey)}
                    </Typography>
                    <Typography sx={{ mt: 1.25, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75 }}>
                      {t(card.descriptionKey)}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={card.to}
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        mt: 2.5,
                        borderRadius: 999,
                        textTransform: 'none',
                        fontWeight: 700,
                        color: '#1f2937',
                        bgcolor: '#fff',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#f8fafc', boxShadow: 'none' }
                      }}>
                      {t(card.buttonLabelKey)}
                    </Button>
                  </Box>

                  <CardMedia
                    component="img"
                    image={card.image}
                    alt={t(card.titleKey)}
                    sx={{ width: '100%', maxWidth: 190, justifySelf: 'center', borderRadius: 3 }}
                  />
                </Box>
              </Paper>
            )
          })}
        </Box>
      </Stack>
    </Container>
  )
}

export default PromoSection
