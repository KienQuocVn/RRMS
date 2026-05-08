import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import { Box, Card, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SectionHeading from './SectionHeading'

function DistrictSearchSection({ items, onSelectDistrict }) {
  if (!items.length) {
    return null
  }

  const featuredDistrict = items[0]
  const remainingDistricts = items.slice(1, 7)

  return (
    <Box id="district-search" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="District Search"
        title="Tìm phòng trọ theo quận huyện"
        description="Từ dữ liệu thật đang hoạt động, hệ thống gom lại các quận huyện có nhiều tin để người dùng đi sâu vào đúng khu vực đang quan tâm."
      />

      <Grid container spacing={3}>
        {featuredDistrict ? (
          <Grid item xs={12} lg={6}>
            <Card
              elevation={0}
              onClick={() => onSelectDistrict(featuredDistrict.label)}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: 100,
                borderRadius: 6,
                cursor: 'pointer',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
              }}>
              <CardMedia
                component="img"
                image={featuredDistrict.sampleRoom?.bulletinBoardImages?.[0]?.imageLink || '/banner1.png'}
                alt={featuredDistrict.label}
                sx={{ height: 440 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  p: 3,
                  display: 'flex',
                  alignItems: 'flex-end',
                  background: 'linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.88) 100%)',
                  color: '#fff'
                }}>
                <Box>
                  <Chip
                    icon={<PlaceRoundedIcon sx={{ color: '#fff !important' }} />}
                    label={`${featuredDistrict.count} tin đang hiển thị`}
                    sx={{ bgcolor: alpha('#ffffff', 0.16), color: '#fff', fontWeight: 700 }}
                  />
                  <Typography sx={{ mt: 1.5, fontSize: 30, fontWeight: 900 }}>{featuredDistrict.label}</Typography>
                  <Typography sx={{ mt: 0.8, color: 'rgba(255,255,255,0.8)' }}>
                    Chạm để mở toàn bộ danh sách tại khu vực này.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ) : null}

        <Grid item xs={12} lg={6}>
          <Grid container spacing={3}>
            {remainingDistricts.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <Card
                  elevation={0}
                  onClick={() => onSelectDistrict(item.label)}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 6,
                    cursor: 'pointer',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)'
                  }}>
                  <CardMedia component="img" image={item.sampleRoom?.bulletinBoardImages?.[0]?.imageLink || '/banner2.png'} alt={item.label} sx={{ height: 208 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      p: 2,
                      display: 'flex',
                      alignItems: 'flex-end',
                      background: 'linear-gradient(180deg, transparent 18%, rgba(15, 23, 42, 0.84) 100%)',
                      color: '#fff'
                    }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                      <Box>
                        <Typography sx={{ fontSize: 21, fontWeight: 800 }}>{item.label}</Typography>
                        <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>{item.count} tin đang có mặt</Typography>
                      </Box>
                      <ArrowForwardRoundedIcon />
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DistrictSearchSection
