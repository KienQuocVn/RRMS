import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

function OwnerBookingSection({ stats }) {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 7,
        overflow: 'hidden',
        borderRadius: 6,
        border: '1px solid rgba(15, 23, 42, 0.06)',
        background: 'linear-gradient(135deg, #ecfeff 0%, #f0fdf4 42%, #fff7ed 100%)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)'
      }}>
      <Grid container spacing={0} alignItems="center">
        <Grid item xs={12} md={7}>
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha('#f59e0b', 0.16),
                  color: '#ea580c'
                }}>
                <BoltRoundedIcon />
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
                Dành Cho Chủ Nhà
              </Typography>
            </Stack>

            <Typography sx={{ mt: 2, fontSize: { xs: 28, md: 38 }, fontWeight: 900, lineHeight: 1.15, color: '#0f172a' }}>
              Sale phòng trọ, lấp phòng trống nhanh hơn với một flow đăng tin rõ ràng và dễ chuyển đổi.
            </Typography>

            <Typography sx={{ mt: 1.5, color: '#ea580c', fontWeight: 800, fontSize: { xs: 18, md: 22 } }}>
              Hiệu quả - Tiết kiệm - Chất lượng
            </Typography>

            <Typography sx={{ mt: 1.5, maxWidth: 680, color: '#475569', lineHeight: 1.8 }}>
              RRMS đang hiển thị {stats.totalRooms} tin hoạt động, trong đó có {stats.readyRooms} lựa chọn có thể vào ở ngay. Đây là nền tảng phù hợp để chủ nhà tăng khả năng lấp đầy nhanh và theo dõi hiệu quả hiển thị tốt hơn.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
              <Button
                href="/register"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 50,
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #c2410c 100%)'
                  }
                }}>
                Lấp phòng trống ngay
              </Button>

              <Button
                href="/login"
                variant="outlined"
                sx={{
                  minHeight: 50,
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 800,
                  color: '#0f766e',
                  borderColor: 'rgba(15, 118, 110, 0.28)'
                }}>
                Đăng nhập để đăng tin
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            sx={{
              minHeight: { xs: 240, md: 360 },
              height: '100%',
              background:
                "radial-gradient(circle at top left, rgba(16,185,129,0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(249,115,22,0.2), transparent 24%), url('/groups_baner.png') center/280px no-repeat"
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default OwnerBookingSection
