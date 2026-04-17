import { Box, Container, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import AllInclusiveRoundedIcon from '@mui/icons-material/AllInclusiveRounded'
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded'
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded'

const reasons = [
  {
    title: 'Tiết kiệm thời gian, chi phí',
    description:
      'Với thiết kế thông minh, giao diện dễ sử dụng, bám sát nghiệp vụ quản lý giúp bạn tiết kiệm thời gian và chi phí vận hành.',
    icon: CheckCircleRoundedIcon
  },
  {
    title: 'Nền tảng ổn định',
    description:
      'Hệ thống luôn sẵn sàng phục vụ khách hàng, dữ liệu được sao lưu định kỳ và tối ưu cho quá trình vận hành dài hạn.',
    icon: SecurityRoundedIcon
  },
  {
    title: 'Quản lý mọi lúc, mọi nơi',
    description:
      'Chỉ với thiết bị di động trên tay bạn có thể quản lý nhà trọ, phòng trọ bất cứ nơi đâu, dù ở nhà hay đi công tác.',
    icon: PublicRoundedIcon
  },
  {
    title: 'Không giới hạn quy mô',
    description:
      'Ứng dụng hướng đến nhiều mô hình cho thuê khác nhau, từ vài phòng đến hàng trăm căn hộ vẫn vận hành mượt mà.',
    icon: AllInclusiveRoundedIcon
  },
  {
    title: 'Tiếp cận tới người thuê phòng',
    description:
      'Nhiều nền tảng đăng tin và kết nối người thuê giúp bạn rút ngắn thời gian lấp phòng, giảm thất thoát doanh thu.',
    icon: ThumbUpAltRoundedIcon
  },
  {
    title: 'Tận tình, phục vụ chuyên nghiệp',
    description:
      'Đội ngũ trẻ, nhiệt huyết và đồng hành xuyên suốt giúp bạn yên tâm sử dụng ngay từ những ngày đầu triển khai.',
    icon: HeadsetMicRoundedIcon
  }
]

export default function DigitalTransformSection() {
  return (
    <Box component="section" className="home-section home-section--pattern" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box className="home-section-content">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
                fontSize: { xs: '2rem', md: '2.4rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                textTransform: 'uppercase',
                textAlign: 'center'
              }} className='home-section-title'>
              Vì sao nên chọn <span className="accent">phần mềm quản lý nhà trọ</span> miễn phí RRMS?
            </Typography>
            <Typography sx={{
                mt: 1.5,
                mx: 'auto',
                maxWidth: 920,
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: '#384860',
                textAlign: 'center'
              }}>
              Với xu hướng ứng dụng công nghệ vào thực tiễn, nền tảng được xây dựng để giải quyết đúng những khó khăn
              thường gặp trong quá trình quản lý nhà cho thuê.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2.5
            }}>
            {reasons.map((reason) => {
              const Icon = reason.icon

              return (
                <Box
                  key={reason.title}
                  className="home-hover-card"
                  sx={{
                    position: 'relative',
                    p: { xs: 2.4, md: 2.8 },
                    pt: { xs: 4.8, md: 5.4 },
                    borderRadius: '26px',
                    border: '1px solid rgba(55, 100, 164, 0.1)',
                    backgroundColor: '#fff',
                    boxShadow: '0 18px 40px rgba(44, 87, 151, 0.08)'
                  }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -22,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      background: 'linear-gradient(135deg, #6cd26a 0%, #3caf4a 100%)',
                      boxShadow: '0 14px 28px rgba(57, 181, 74, 0.26)'
                    }}>
                    <Icon sx={{ fontSize: 32 }} />
                  </Box>

                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, textAlign: 'center', color: '#1f3557' }}>
                    {reason.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.1,
                      fontSize: '0.95rem',
                      lineHeight: 1.8,
                      textAlign: 'center',
                      color: '#647a96'
                    }}>
                    {reason.description}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
