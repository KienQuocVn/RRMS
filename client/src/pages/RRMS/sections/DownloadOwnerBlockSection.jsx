import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'

function DownloadOwnerBlockSection({ stats }) {
  return (
    <Paper
      id="download-owner-block"
      elevation={0}
      sx={{
        mt: 7,
        overflow: 'hidden',
        borderRadius: 6,
        border: '1px solid rgba(15, 23, 42, 0.06)',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 56%, #fff7ed 100%)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)'
      }}>
      <Grid container spacing={0} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
              Download Owner Block
            </Typography>
            <Typography sx={{ mt: 1.2, fontSize: { xs: 28, md: 38 }, fontWeight: 900, lineHeight: 1.12, color: '#0f172a' }}>
              Chủ nhà có thể quản lý tin đăng và vận hành danh sách phòng chuyên nghiệp hơn trên RRMS.
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 680, color: '#475569', lineHeight: 1.8 }}>
              Hệ thống hiện đang hiển thị {stats.totalRooms} tin hoạt động trên {stats.provinces} tỉnh thành. Giao diện mới giúp đội ngũ quản trị tách rõ phần tìm kiếm cho người thuê và phần vận hành cho chủ nhà.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
              <Button
                href="/register"
                variant="contained"
                startIcon={<DownloadRoundedIcon />}
                sx={{
                  minHeight: 50,
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #115e59 0%, #0f766e 100%)'
                  }
                }}>
                Tạo tài khoản chủ trọ
              </Button>

              <Button
                href="/login"
                variant="outlined"
                startIcon={<LoginRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 50,
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 800,
                  borderColor: 'rgba(15, 118, 110, 0.3)',
                  color: '#0f766e'
                }}>
                Đăng nhập quản lý
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            sx={{
              height: '100%',
              minHeight: 320,
              background:
                "radial-gradient(circle at top left, rgba(16,185,129,0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(249,115,22,0.18), transparent 24%), url('/owner.png') center 72% / 240px no-repeat"
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DownloadOwnerBlockSection
