import { Box, Button, Container, Typography } from '@mui/material'

const platforms = [
  {
    img: 'https://quanlytro.me/images/banner_mobile_flatform.webp',
    title: 'Quản lý nhà trọ trên điện thoại',
    buttonLabel: 'Quản lý trên điện thoại',
    buttonColor: 'linear-gradient(135deg, #2ed573 0%, #24c76b 100%)',
    description:
      'Quản lý ngay trên chiếc điện thoại. Nhẹ nhàng, thuận tiện, linh hoạt với đầy đủ tính năng và được đồng bộ với các nền tảng khác.'
  },
  {
    img: 'https://quanlytro.me/images/banner_ipad_flatform.webp',
    title: 'Quản lý nhà trọ trên iPad',
    buttonLabel: 'Quản lý trên máy tính bảng',
    buttonColor: 'linear-gradient(135deg, #7a6dff 0%, #59a2ff 100%)',
    description:
      'Nếu bạn đang có chiếc máy tính bảng là một lợi thế. Bạn có thể kết hợp được sự linh hoạt giữa điện thoại và máy tính.'
  },
  {
    img: 'https://quanlytro.me/images/banner_desktop_flatform.webp',
    title: 'Quản lý nhà trọ trên máy tính',
    buttonLabel: 'Quản lý trên máy tính',
    buttonColor: 'linear-gradient(135deg, #5dc3ff 0%, #34b1ff 100%)',
    description:
      'Quản lý ngay trên website mà không cần cài đặt app. Tất cả các tính năng sẽ rất chi tiết, sẽ giúp bạn quản lý thuận tiện đầy đủ.'
  }
]

export default function MultiPlatformSection() {
  return (
    <Box component="section" className="home-section home-section--pattern" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box className="home-section-content">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.4rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                textTransform: 'uppercase',
                color: '#000',
                textAlign: 'center'
              }} className='home-section-title'>
              Quản lý trên <span className="accent">đa nền tảng</span>
            </Typography>
            <Typography
              sx={{
                mt: 1.2,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 800,
                color: '#24c4d9'
              }}>
              Điện thoại - iPad - Máy tính - Website
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                mx: 'auto',
                maxWidth: 920,
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: '#384860',
                textAlign: 'center'
              }}>
              Với sự đa dạng về nền tảng sẽ giúp bạn quản lý linh động hơn, thay vì file Excel phức tạp hay sổ sách rườm
              rà.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2.5
            }}>
            {platforms.map((platform) => (
              <Box
                key={platform.title}
                className="home-hover-card"
                sx={{
                  p: { xs: 2, md: 2.25 },
                  borderRadius: '28px',
                  border: '1px solid rgba(55, 100, 164, 0.1)',
                  backgroundColor: '#fff',
                  boxShadow: '0 20px 44px rgba(44, 87, 151, 0.08)'
                }}>
                <Box
                  component="img"
                  src={platform.img}
                  alt={platform.title}
                  sx={{
                    width: '100%',
                    borderRadius: '20px',
                    aspectRatio: '383 / 282',
                    objectFit: 'cover',
                    backgroundColor: '#f0f6ff'
                  }}
                />
                <Box sx={{ textAlign: 'center', my: 2.5 }}>
                  <Button
                    variant="contained"
                    sx={{
                      px: 2.6,
                      py: 1.15,
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      background: platform.buttonColor
                    }}>
                    {platform.buttonLabel}
                  </Button>
                </Box>
                <Typography sx={{ fontSize: '0.98rem', lineHeight: 1.8, color: '#5d718f', textAlign: 'center' }}>
                  {platform.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
