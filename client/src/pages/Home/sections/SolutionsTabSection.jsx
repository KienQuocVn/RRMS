import { Box, Button, Container, Typography } from '@mui/material'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded'
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Link } from 'react-router-dom'

const promoBanners = [
  {
    image: '/banner1.png',
    alt: 'Tìm nhà nhanh chóng'
  },
  {
    image: '/banner2.png',
    alt: 'Để lại thông tin cho chuyên viên RRMS'
  }
]

const featureCards = [
  {
    title: 'Quản lý nhiều nhà trọ - chung cư - KTX, homestay',
    description:
      'Có thể cùng lúc quản lý nhiều nhà trọ, toà nhà chung cư mini, KTX hoặc homestay với góc nhìn tổng quan và chi tiết.',
    icon: HomeWorkRoundedIcon
  },
  {
    title: 'Quản lý phòng trọ, căn hộ, giường - sleepbox',
    description:
      'Theo dõi trạng thái phòng, số điện thoại khách thuê, lịch sử sử dụng và tình trạng lấp đầy chỉ trên một giao diện.',
    icon: ApartmentRoundedIcon
  },
  {
    title: 'Quản lý cọc giữ chỗ và hợp đồng thuê nhà',
    description:
      'Lưu giữ toàn bộ thông tin khách thuê, tiền cọc, thời gian cọc và lịch ký hợp đồng để không bỏ sót bất kỳ giao dịch nào.',
    icon: DescriptionRoundedIcon
  },
  {
    title: 'Hóa đơn tiền phòng, thu tiền',
    description:
      'Tự động tính tiền phòng, điện, nước, dịch vụ hằng tháng, in hóa đơn và hỗ trợ đối soát thanh toán nhanh chóng.',
    icon: ReceiptLongRoundedIcon
  },
  {
    title: 'Quản lý xe, tài sản',
    description: 'Theo dõi phương tiện, tài sản của khách thuê và lịch sử bàn giao trong suốt quá trình sử dụng phòng.',
    icon: DirectionsCarRoundedIcon
  },
  {
    title: 'Đăng tin tìm khách thuê',
    description:
      'Hỗ trợ đăng tin trên nhiều nền tảng, kết hợp đội ngũ marketing giúp bạn lấp phòng trống nhanh và chuyên nghiệp hơn.',
    icon: CampaignRoundedIcon
  },
  {
    title: 'Quản lý tài chính',
    description: 'Mọi khoản thu, chi và tổng kết kinh doanh được lưu trữ tự động để bạn nắm dòng tiền rõ ràng hơn.',
    icon: SavingsRoundedIcon
  },
  {
    title: 'Thống kê báo cáo',
    description:
      'Theo dõi tổng quan hiệu suất vận hành, tỷ lệ lấp đầy, doanh thu và các chỉ số quan trọng để ra quyết định chính xác.',
    icon: QueryStatsRoundedIcon
  },
  {
    title: 'Quản lý khách thuê',
    description:
      'Quản lý thông tin khách thuê, giấy tờ tuỳ thân, tình trạng cư trú và hỗ trợ đăng ký tạm trú online trên dịch vụ công.',
    icon: BadgeRoundedIcon
  },
  {
    title: 'Ghi chú việc cần làm',
    description:
      'Ghi chú công việc, nhắc lịch xử lý sự cố phát sinh và tạo danh sách tác vụ cần thực hiện cho từng cơ sở.',
    icon: StickyNote2RoundedIcon
  },
  {
    title: 'Quản lý nhân viên',
    description:
      'Phân quyền theo vai trò để đội nhóm, người thân hoặc nhân sự vận hành có thể cùng tham gia quản lý an toàn.',
    icon: SupervisorAccountRoundedIcon
  },
  {
    title: 'Quản lý môi giới',
    description:
      'Theo dõi môi giới, ghi nhận hợp đồng và phí môi giới giúp tăng tốc độ lấp đầy phòng trống hiệu quả hơn.',
    icon: HandshakeRoundedIcon
  }
]

export default function SolutionsTabSection() {
  return (
    <Box
      id="all-function"
      component="section"
      className="home-section home-section--pattern"
      sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box className="home-section-content">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
                fontSize: { xs: '2rem', md: '2.4rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                textTransform: 'uppercase',
                color: '#000',
                textAlign: 'center'
              }} className='home-section-title'>
              Với những tính năng tuyệt vời phần mềm quản lý sẽ <br /> <span className="accent">hỗ trợ bạn</span>
            </Typography>
            <Typography sx={{
                mt: 1.5,
                maxWidth: 920,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: '#384860',
                textAlign: 'center'
              }}>
              Nhiều tính năng căn bản và mở rộng sẽ giúp công việc quản lý nhà cho thuê của bạn dễ dàng hơn bao giờ hết.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2.5
            }}>
            {promoBanners.map((banner) => (
              <Box
                key={banner.alt}
                className="home-hover-card"
                sx={{
                  overflow: 'hidden',
                  borderRadius: '24px',
                  border: '1px solid rgba(55, 100, 164, 0.08)',
                  backgroundColor: '#fff',
                  boxShadow: '0 18px 38px rgba(44, 87, 151, 0.1)'
                }}>
                <Box
                  component="img"
                  src={banner.image}
                  alt={banner.alt}
                  sx={{ width: '100%', display: 'block', aspectRatio: '970 / 250', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 2.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2.25
            }}>
            {featureCards.map((feature) => {
              const Icon = feature.icon

              return (
                <Box
                  key={feature.title}
                  className="home-hover-card"
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    p: { xs: 2.2, md: 2.6 },
                    borderRadius: '24px',
                    border: '1px solid rgba(55, 100, 164, 0.1)',
                    backgroundColor: '#fff',
                    boxShadow: '0 16px 34px rgba(44, 87, 151, 0.08)'
                  }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: '18px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#3ab8e2',
                      backgroundColor: 'rgba(57, 181, 74, 0.12)'
                    }}>
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.5, color: '#1f3557' }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ mt: 0.75, fontSize: '0.95rem', lineHeight: 1.75, color: '#617692' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/introduce"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              className="home-cta-button secondary"
              sx={{
                background: 'linear-gradient(135deg, #63cd72 0%, #36b95d 100%)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4bc45d 0%, #259f49 100%)'
                }
              }}>
              Xem toàn bộ tính năng
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
