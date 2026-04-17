import { Box, Container, Typography } from '@mui/material'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import DomainRoundedIcon from '@mui/icons-material/DomainRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'

const stats = [
  { value: '13,493+', label: 'Chủ nhà cho thuê', icon: HomeWorkRoundedIcon },
  { value: '202,395+', label: 'Số căn hộ', icon: DomainRoundedIcon },
  { value: '505,988+', label: 'Khách thuê phòng', icon: GroupsRoundedIcon },
  { value: '240+', label: 'Đối tác tiêu biểu', icon: FavoriteRoundedIcon }
]

const logos = [
  'https://quanlytro.me/images/logo-customer/logo-1.png',
  'https://quanlytro.me/images/logo-customer/logo-4.png',
  'https://quanlytro.me/images/logo-customer/logo-2.png',
  'https://quanlytro.me/images/logo-customer/logo-3.png',
  'https://quanlytro.me/images/logo-customer/logo-5.png',
  'https://quanlytro.me/images/logo-customer/logo-6.png',
  'https://quanlytro.me/images/logo-customer/logo-7.png',
  'https://quanlytro.me/images/logo-customer/logo-1.png',
  'https://quanlytro.me/images/logo-customer/logo-4.png',
  'https://quanlytro.me/images/logo-customer/logo-2.png',
  'https://quanlytro.me/images/logo-customer/logo-3.png',
  'https://quanlytro.me/images/logo-customer/logo-5.png'
]

const aboutCards = [
  {
    title: 'Sự ra đời của RRMS - Quản lý nhà cho thuê',
    body: 'Với số lượng phòng trọ ngày càng tăng theo nhu cầu, các chủ nhà sẽ gặp nhiều khó khăn nếu tiếp tục quản lý bằng sổ sách hoặc file Excel phức tạp. RRMS được xây dựng để chia sẻ bớt gánh nặng ấy bằng một nền tảng trực quan, hiện đại và dễ triển khai.'
  },
  {
    title: 'Giá trị cốt lõi RRMS - Quản lý nhà cho thuê',
    body: 'Mục tiêu của đội ngũ RRMS là mang sản phẩm chất lượng, tiện ích và luôn được cập nhật sát với nghiệp vụ quản lý thực tế. Chúng tôi đặt lợi ích khách hàng lên hàng đầu, phục vụ tận tình và không ngừng hoàn thiện mỗi ngày.'
  }
]

export default function PartnersSection() {
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
            }}
            className="home-section-title">
              Đồng hành <span className="accent">cùng chúng tôi</span>
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
              }}
            className="home-section-desc">
              Cùng hướng đến sự phát triển bền vững, mang lại giá trị thực cho cộng đồng và hệ sinh thái nhà cho thuê.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4.5,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              gap: 2
            }}>
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <Box
                  key={stat.label}
                  className="home-hover-card"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2.2,
                    borderRadius: '22px',
                    border: '1px solid rgba(55, 100, 164, 0.1)',
                    backgroundColor: '#fff',
                    boxShadow: '0 16px 34px rgba(44, 87, 151, 0.08)'
                  }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#f3a11f',
                      backgroundColor: 'rgba(255, 183, 56, 0.18)'
                    }}>
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: '1.12rem', md: '1.3rem' }, fontWeight: 900, color: '#3ab8e2' }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', color: '#667d99' }}>{stat.label}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Box className="home-logo-wall" sx={{ mt: 4.5 }}>
            {logos.map((logo, index) => (
              <Box key={`${logo}-${index}`} className="home-logo-card home-hover-card">
                <Box component="img" src={logo} alt={`Đối tác ${index + 1}`} />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2.5
            }}>
            {aboutCards.map((card) => (
              <Box
                key={card.title}
                className="home-hover-card"
                sx={{
                  p: { xs: 2.4, md: 2.8 },
                  borderRadius: '26px',
                  border: '1px solid rgba(55, 100, 164, 0.1)',
                  backgroundColor: '#fff',
                  boxShadow: '0 18px 38px rgba(44, 87, 151, 0.08)'
                }}>
                <FormatQuoteRoundedIcon sx={{ fontSize: 44, color: '#3ab8e2' }} />
                <Typography sx={{ mt: 1, fontSize: '1.1rem', fontWeight: 900, color: '#1f3557' }}>
                  {card.title}
                </Typography>
                <Typography sx={{ mt: 1.5, fontSize: '0.98rem', lineHeight: 1.85, color: '#617692' }}>
                  {card.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
