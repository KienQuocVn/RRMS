import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import { Box, Card, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SectionHeading from './SectionHeading'
import { formatterAmount } from '~/utils/formatterAmount'

function ProvinceSearchSection({ items, onSelectProvince }) {
  if (!items.length) {
    return null
  }

  return (
    <Box id="province-search" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="Province Search"
        title="Tìm phòng trọ theo tỉnh thành"
        description="Danh sách được lấy trực tiếp từ dữ liệu đang hoạt động trên hệ thống để bạn đi từ phạm vi lớn đến cụ thể hơn."
      />

      <Grid container spacing={3}>
        {items.slice(0, 6).map((item) => (
          <Grid item xs={12} sm={6} lg={4} key={item.label}>
            <Card
              elevation={0}
              onClick={() => onSelectProvince(item.label)}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 6,
                cursor: 'pointer',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 24px 68px rgba(15, 23, 42, 0.12)'
                }
              }}>
              <CardMedia
                component="img"
                image={item.sampleRoom?.bulletinBoardImages?.[0]?.imageLink || '/banner2.png'}
                alt={item.label}
                sx={{ height: 250 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'flex-end',
                  color: '#fff',
                  background: 'linear-gradient(180deg, transparent 22%, rgba(15, 23, 42, 0.84) 100%)'
                }}>
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                    <Chip
                      icon={<LocationOnRoundedIcon sx={{ color: '#fff !important' }} />}
                      label={`${item.count} tin đang hiển thị`}
                      sx={{ bgcolor: alpha('#ffffff', 0.16), color: '#fff', fontWeight: 700 }}
                    />
                    <ArrowForwardRoundedIcon />
                  </Stack>

                  <Typography sx={{ mt: 1.5, fontSize: 28, fontWeight: 900 }}>{item.label}</Typography>
                  <Typography sx={{ mt: 0.6, color: 'rgba(255,255,255,0.84)' }}>
                    Giá thuê trung bình khoảng {formatterAmount(item.averagePrice)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProvinceSearchSection
