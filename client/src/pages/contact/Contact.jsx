import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import { Box, Button, Container, Link as MuiLink, Paper, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

const contactCards = [
  {
    key: 'fanpage',
    href: 'https://www.facebook.com/profile.php?id=61562538557177',
    labelKey: 'contactPage.fanpage',
    value: 'Facebook',
    Icon: FacebookRoundedIcon,
    color: '#1877f2'
  },
  {
    key: 'messenger',
    href: 'https://www.facebook.com/profile.php?id=61562538557177',
    labelKey: 'contactPage.channels.messenger',
    value: 'Messenger',
    Icon: ChatBubbleOutlineRoundedIcon,
    color: '#0ea5e9'
  },
  {
    key: 'phone',
    href: 'tel:0373395604',
    labelKey: 'contactPage.channels.phone',
    value: '0373395604',
    Icon: PhoneInTalkRoundedIcon,
    color: '#16a34a'
  },
  {
    key: 'email',
    href: 'mailto:nguyentantai0118@gmail.com?Subject=Li%C3%AAn%20h%E1%BB%87%20RRSM.com',
    labelKey: 'contactPage.channels.email',
    value: 'RRMS.com@gmail.com',
    Icon: EmailRoundedIcon,
    color: '#f97316'
  }
]

const postingSteps = [
  {
    step: '1',
    titleKey: 'introduce.postSteps.items.0.title',
    descriptionKey: 'introduce.postSteps.items.0.description',
    color: '#16a34a'
  },
  {
    step: '2',
    titleKey: 'introduce.postSteps.items.1.title',
    descriptionKey: 'introduce.postSteps.items.1.description',
    color: '#2563eb'
  },
  {
    step: '3',
    titleKey: 'introduce.postSteps.items.2.title',
    descriptionKey: 'introduce.postSteps.items.2.description',
    color: '#f59e0b'
  }
]

const stats = [
  { value: '4.000+', labelKey: 'contactPage.stats.landlords', Icon: ApartmentRoundedIcon },
  { value: '10.000+', labelKey: 'contactPage.stats.tenants', Icon: GroupsRoundedIcon },
  { value: '10+', labelKey: 'contactPage.stats.brokers', Icon: HandshakeRoundedIcon },
  { value: '3.000+', labelKey: 'contactPage.stats.views', Icon: TrendingUpRoundedIcon }
]

const Contact = ({ setIsAdmin }) => {
  const { t } = useTranslation()

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box
      component="main"
      sx={{
        py: { xs: 4, md: 6 },
        background: 'linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box textAlign="center">
            <Typography sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 900, color: '#0f172a' }}>
              {t('contactPage.title')}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: { xs: 16, md: 20 }, color: '#475467' }}>
              {t('contactPage.subtitle')}
            </Typography>
            <Box sx={{ width: 120, height: 4, mx: 'auto', mt: 2, borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #22c55e)' }} />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              gap: 2
            }}
          >
            {contactCards.map((card) => {
              const Icon = card.Icon
              return (
                <Paper
                  key={card.key}
                  component={MuiLink}
                  href={card.href}
                  underline="none"
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
                    color: 'inherit',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 24px 50px rgba(15, 23, 42, 0.12)'
                    }
                  }}
                >
                  <Stack spacing={1.5} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 68,
                        height: 68,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: `${card.color}15`,
                        color: card.color
                      }}
                    >
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#344054' }}>{t(card.labelKey)}</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#101828' }}>{card.value}</Typography>
                  </Stack>
                </Paper>
              )
            })}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2
            }}
          >
            <Paper
              component="a"
              href="#"
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                display: 'block',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)'
              }}
            >
              <Box component="img" src="/banner1.png" alt={t('contactPage.banners.brokerAlt')} sx={{ width: '100%', display: 'block' }} />
            </Paper>
            <Paper
              component="a"
              href="#"
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                display: 'block',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)'
              }}
            >
              <Box component="img" src="/banner2.png" alt={t('contactPage.banners.promotionAlt')} sx={{ width: '100%', display: 'block' }} />
            </Paper>
          </Box>

          <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, boxShadow: '0 22px 48px rgba(15, 23, 42, 0.06)' }}>
            <Box textAlign="center">
              <Typography sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 900, color: '#0f172a' }}>
                {t('contactPage.stepsTitle')}
              </Typography>
              <Typography sx={{ mt: 1, color: '#475467' }}>{t('contactPage.stepsDescription')}</Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2
              }}
            >
              {postingSteps.map((item) => (
                <Paper
                  key={item.step}
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    borderRadius: 3,
                    borderColor: `${item.color}55`,
                    background: `linear-gradient(180deg, ${item.color}10 0%, #ffffff 100%)`
                  }}
                >
                  <Stack spacing={1.25}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: item.color,
                        color: '#fff',
                        fontWeight: 900
                      }}
                    >
                      {item.step}
                    </Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#101828' }}>{t(item.titleKey)}</Typography>
                    <Typography sx={{ color: '#475467', lineHeight: 1.7 }}>{t(item.descriptionKey)}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, boxShadow: '0 22px 48px rgba(15, 23, 42, 0.06)' }}>
            <Box textAlign="center">
              <Typography sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 900, color: '#0f172a' }}>
                {t('contactPage.whyTitle')}
              </Typography>
              <Typography sx={{ mt: 1, color: '#475467' }}>{t('contactPage.whyDescriptionLine1')}</Typography>
              <Typography sx={{ color: '#475467' }}>{t('contactPage.whyDescriptionLine2')}</Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                gap: 2
              }}
            >
              {stats.map((item) => {
                const Icon = item.Icon
                return (
                  <Paper
                    key={item.labelKey}
                    variant="outlined"
                    sx={{
                      p: 2.25,
                      borderRadius: 3,
                      textAlign: 'center',
                      borderColor: 'rgba(34, 197, 94, 0.18)',
                      background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)'
                    }}
                  >
                    <Icon sx={{ fontSize: 42, color: '#16a34a' }} />
                    <Typography sx={{ mt: 1.25, fontSize: 24, fontWeight: 900, color: '#101828' }}>{item.value}</Typography>
                    <Typography sx={{ mt: 0.5, color: '#475467' }}>{t(item.labelKey)}</Typography>
                  </Paper>
                )
              })}
            </Box>

            <Typography sx={{ mt: 3, textAlign: 'center', color: '#475467', lineHeight: 1.9 }}>{t('contactPage.summary')}</Typography>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button component={RouterLink} to="/register" variant="contained" sx={{ borderRadius: 999, px: 3, py: 1.2, fontWeight: 700 }}>
                {t('auth.register.submit')}
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}

export default Contact
