import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import { Link } from 'react-router-dom'

export default function BannerSection() {
  const heroBadges = [
    {
      label: 'Quản lý nhiều toà nhà',
      icon: <ApartmentRoundedIcon sx={{ fontSize: 20 }} />,
      position: { top: '10%', left: '4%' }
    },
    {
      label: 'Đồng bộ đa thiết bị',
      icon: <DevicesRoundedIcon sx={{ fontSize: 20 }} />,
      position: { top: '18%', right: '4%' }
    },
    {
      label: 'Gạch nợ tự động',
      icon: <CreditScoreRoundedIcon sx={{ fontSize: 20 }} />,
      position: { bottom: '22%', left: '8%' }
    },
    {
      label: 'Hỗ trợ marketing',
      icon: <CampaignRoundedIcon sx={{ fontSize: 20 }} />,
      position: { bottom: '12%', right: '2%' }
    }
  ]

  return (
    <Box
      component="section"
      className="home-section"
      sx={{
        pt: { xs: 7, md: 9 },
        pb: { xs: 7, md: 8 },
        backgroundImage:
          'linear-gradient(180deg, rgba(238, 248, 255, 0.95) 0%, rgba(245, 251, 255, 0.92) 100%), url(/images/bg-banner.webp)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      <Container maxWidth="lg">
        <Box
          className="home-section-content"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) minmax(0, 0.95fr)' },
            alignItems: 'center',
            gap: { xs: 5, md: 3 }
          }}>
          <Stack spacing={3.2} sx={{ maxWidth: 620 }}>
            <Chip
              label="🏠 RRMS v3 - nền tảng quản lý nhà cho thuê"
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 800,
                color: '#3ab8e2',
                backgroundColor: 'rgba(57, 181, 74, 0.12)'
              }}
            />

            <Box component="article">
              <Typography
                sx={{
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  lineHeight: 1.15,
                  fontWeight: 900,
                  color: '#3ab8e2'
                }}>
                Phần mềm quản lý nhà cho thuê
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: '1.7rem', md: '2.4rem' },
                  lineHeight: 1.15,
                  fontWeight: 900,
                  color: '#ff5f3a'
                }}>
                Điện thoại - iPad - Máy tính
              </Typography>
              <Typography
                sx={{
                  mt: 2.5,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  lineHeight: 1.85,
                  color: '#4d6582'
                }}>
                Quản lý nhẹ nhàng như chiếc smartphone bạn đang cầm trên tay. Từ khách thuê, hợp đồng, hoá đơn đến báo
                cáo tài chính đều được số hoá theo một giao diện trực quan, dễ học và dễ vận hành.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                to="/introduce"
                variant="contained"
                startIcon={<PlayCircleRoundedIcon />}
                className="home-cta-button"
                sx={{
                  background: 'linear-gradient(135deg, #ffb33c 0%, #ff8f1f 100%)',
                  color: '#17304e',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ffac2c 0%, #ff7f0f 100%)'
                  }
                }}>
                Xem giới thiệu
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                startIcon={<SupportAgentRoundedIcon />}
                className="home-cta-button secondary"
                sx={{
                  background: 'linear-gradient(135deg, #69cfd3 0%, #3588b8 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #69cfd3 0%, #3588b8 100%)'
                  }
                }}>
                Liên hệ tư vấn
              </Button>
            </Stack>

            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.5}>
              {['13,493+ chủ nhà đang dùng', '202,395+ căn hộ được quản lý', '505,988+ khách thuê đồng hành'].map(
                (item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderRadius: '999px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#31506f',
                      border: '1px solid rgba(55, 100, 164, 0.12)',
                      backgroundColor: 'rgba(255, 255, 255, 0.84)'
                    }}>
                    {item}
                  </Box>
                )
              )}
            </Stack>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 360, md: 520 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: '12% 8%', md: '10% 8%' },
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(92, 191, 255, 0.38) 0%, rgba(92, 191, 255, 0.08) 52%, rgba(92, 191, 255, 0) 74%)',
                filter: 'blur(2px)'
              }}
            />
            <Box
              component="img"
              src="/images/quan-ly-tro-smart.png"
              alt="Giao diện quản lý nhà trọ đa nền tảng"
              sx={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: 500,
                height: 'auto',
                filter: 'drop-shadow(0 26px 40px rgba(38, 76, 132, 0.2))'
              }}
            />

            {heroBadges.map((badge) => (
              <Box
                key={badge.label}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  position: 'absolute',
                  zIndex: 2,
                  ...badge.position,
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: '18px',
                  backgroundColor: '#fff',
                  color: '#31506f',
                  border: '1px solid rgba(55, 100, 164, 0.12)',
                  boxShadow: '0 16px 28px rgba(44, 87, 151, 0.12)'
                }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    background: 'linear-gradient(135deg, #35b85a 0%, #1ecde0 100%)'
                  }}>
                  {badge.icon}
                </Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{badge.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
