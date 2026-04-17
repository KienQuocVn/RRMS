import { Box, Container, Typography } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'

const testimonials = [
  {
    name: 'Bà Lê Thanh Nhàn',
    rooms: '40 phòng',
    role: 'Chủ nhà',
    feedback: 'Ứng dụng dễ dàng sử dụng và miễn phí, đầy đủ chức năng giúp tôi có thể quản lý cùng lúc nhiều nhà trọ.',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-01-80x80.webp?version=29842'
  },
  {
    name: 'Chị Lê Thị Huyên',
    rooms: '8 phòng',
    role: 'Chủ nhà',
    feedback:
      'Tôi rất thích ứng dụng vì rất tiện lợi, phòng của tôi không nhiều nhưng trước khi biết đến ứng dụng tôi phải quản lý sổ sách rất cực. Giờ thì khoẻ hơn nhiều. Cảm ơn RRMS!',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-02-80x80.webp?version=29842'
  },
  {
    name: 'Anh Lê Văn Tân',
    rooms: '30 phòng',
    role: 'Chủ nhà',
    feedback:
      'Phòng trọ của mình tương đối nhiều. Trước đây mình thường rất mất nhiều thời gian trong công việc quản lý. Từ khi được bạn giới thiệu ứng dụng mọi việc tốt hơn.',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-03-80x80.webp?version=29842'
  },
  {
    name: 'Chị Đoàn Thị Hòa',
    rooms: '20 phòng',
    role: 'Chủ nhà',
    feedback:
      'Tôi có nhiều thời gian cho bản thân hơn từ khi biết đến ứng dụng quản lý nhà trọ của RRMS. Thật sự cảm ơn các bạn đã giới thiệu và hỗ trợ tôi!',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-04-80x80.webp?version=29842'
  }
]

export default function TestimonialsSection() {
  return (
    <Box component="section" className="home-section" sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fff' }}>
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
            }}
            
            className="home-section-title">
              Lý do chủ nhà chọn chúng tôi <span className="accent">cảm nhận từ khách hàng</span>
            </Typography>
            <Typography sx={{
                mt: 1.5,
                mx: 'auto',
                maxWidth: 920,
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: '#384860',
                textAlign: 'center'
              }} >
              Sự hài lòng của khách hàng là động lực giúp chúng tôi hoàn thiện ứng dụng, đồng thời mở ra thêm nhiều cơ
              hội tăng trưởng trong tương lai.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
              gap: 3
            }}>
            {testimonials.map((testimonial) => (
              <Box
                key={testimonial.name}
                className="home-hover-card"
                sx={{
                  position: 'relative',
                  pt: 6.5,
                  px: 2.5,
                  pb: 3,
                  borderRadius: '32px',
                  border: '1px solid rgba(55, 100, 164, 0.1)',
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  boxShadow: '0 20px 42px rgba(44, 87, 151, 0.08)'
                }}>
                <Box
                  component="img"
                  src={testimonial.image}
                  alt={testimonial.name}
                  sx={{
                    position: 'absolute',
                    top: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 82,
                    height: 82,
                    borderRadius: '50%',
                    border: '5px solid #fff',
                    boxShadow: '0 14px 30px rgba(44, 87, 151, 0.14)'
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.3, color: '#ffb339' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarRoundedIcon key={index} sx={{ fontSize: 18 }} />
                  ))}
                </Box>

                <Typography sx={{ mt: 1.2, fontSize: '1rem', fontWeight: 800, color: '#1f3557' }}>
                  {testimonial.name}
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: '0.92rem', fontWeight: 700, color: '#3ab8e2' }}>
                  {testimonial.rooms} • {testimonial.role}
                </Typography>
                <Typography sx={{ mt: 1.5, fontSize: '0.95rem', lineHeight: 1.8, color: '#617692' }}>
                  {testimonial.feedback}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
