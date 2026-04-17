import { Box, Container, Typography } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import { Link } from 'react-router-dom'

const features = [
  {
    img: 'https://quanlytro.me/images/home_feature/feature-2-gui-hoa-don-tu-dong-doc.jpg',
    title: 'Gửi hóa đơn TỰ ĐỘNG tới khách thuê ZALO/APP'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-1-app-danh-rieng-cho-khac-thue-doc.jpg',
    title: 'App dành riêng cho khách thuê'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-3-thanh-toan-online-doc.jpg',
    title: 'Thanh toán HÓA ĐƠN ONLINE, GẠCH NỢ TỰ ĐỘNG'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-4-giao-dien-de-su-dung-doc.jpg',
    title: 'Giao diện cực kỳ dễ sử dụng'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-5-lap-day-phong-trong-doc.jpg',
    title: 'Lấp phòng trống nhanh chóng'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/dang-ky-tam-tru-tu-dong-online.jpg',
    title: 'Đăng ký tạm trú TỰ ĐỘNG ONLINE'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/nhap-du-lieu-excel-de-dang.jpg',
    title: 'Nhập dữ liệu từ file excel dễ dàng'
  },
  {
    img: '	https://quanlytro.me/images/home_feature/ket-noi-he-thong-nha-thong-minh.jpg',
    title: 'Kết nối hệ thống IOT nhà thông minh'
  },
  {
    img: '	https://quanlytro.me/images/home_feature/phan-quyen-nhan-vien-va-nguoi-than-quan-ly.jpg',
    title: 'Phân quyền nhân viên & người thân quản lý'
  },
  {
    img: '	https://quanlytro.me/images/home_feature/hop-dong-online.jpg',
    title: 'Ký HỢP ĐỒNG ONLINE nhanh chóng, tiện lợi'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/de-dang-nam-cac-bao-cao-tinh-trang-phong.jpg',
    title: 'Dễ dàng theo dõi qua báo cáo tài chính, tình trạng phòng'
  }
]

function ReportFeatureThumb() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: '18px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffc877 0%, #ffdd9b 100%)'
      }}>
      <Typography
        sx={{
          pt: 2.6,
          px: 1.8,
          textAlign: 'center',
          fontSize: '0.72rem',
          fontWeight: 900,
          lineHeight: 1.35,
          color: '#fff',
          textTransform: 'uppercase'
        }}>
        Dễ dàng nắm các báo cáo tài chính, tình trạng phòng
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          left: '12%',
          right: '12%',
          bottom: '16%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 1.1
        }}>
        {[44, 68, 88].map((height, index) => (
          <Box
            key={height}
            sx={{
              width: 18,
              height,
              borderRadius: '8px 8px 4px 4px',
              background: index === 2 ? '#4ab87d' : '#5fa6ff',
              boxShadow: '0 10px 20px rgba(55, 100, 164, 0.18)'
            }}
          />
        ))}
        <ShowChartRoundedIcon
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 34,
            fontSize: 62,
            color: '#46b86f',
            transform: 'rotate(-6deg)'
          }}
        />
        <PaidRoundedIcon
          sx={{
            position: 'absolute',
            left: 10,
            bottom: 2,
            fontSize: 34,
            color: '#f0b534'
          }}
        />
        <PaidRoundedIcon
          sx={{
            position: 'absolute',
            left: 32,
            bottom: -6,
            fontSize: 28,
            color: '#eab12f'
          }}
        />
      </Box>
    </Box>
  )
}

export default function HighlightsSection() {
  return (
    <Box component="section" className="home-section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Box className="home-section-content">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              mx: 'auto',
              maxWidth: 980
            }}>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.4rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                textTransform: 'uppercase',
                color: '#000',
                textAlign: 'center'
              }}>
              Điểm nổi bật
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 920,
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: '#384860',
                textAlign: 'center'
              }}>
              Một số điểm nổi bật của phần mềm bạn có thể tham khảo ngoài ra còn có nhiều tính năng đang chờ bạn khám
              phá!
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4.5,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(6, minmax(0, 1fr))'
              },
              gap: { xs: 2, md: 2.8 }
            }}>
            {features.map((feature) => (
              <Box key={feature.title} className="home-hover-card" sx={{ display: 'flex', flexDirection: 'column' }}>
                {feature.variant === 'report' ? (
                  <ReportFeatureThumb />
                ) : (
                  <Box
                    component="img"
                    src={feature.img}
                    alt={feature.title}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      borderRadius: '18px',
                      display: 'block'
                    }}
                  />
                )}

                <Typography
                  sx={{
                    mt: 1.2,
                    fontSize: { xs: '0.95rem', md: '0.98rem' },
                    fontWeight: 700,
                    lineHeight: 1.45,
                    color: '#111'
                  }}>
                  {feature.title}
                </Typography>
              </Box>
            ))}

            <Box className="home-hover-card" sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(180deg, #fff0a8 0%, #ffe57c 100%)'
                }}>
                <Link
                  to="#all-function"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#111',
                    textDecoration: 'underline'
                  }}>
                  Xem thêm
                  <ArrowForwardRoundedIcon fontSize="small" />
                </Link>
              </Box>

              <Typography
                sx={{
                  mt: 1.2,
                  fontSize: { xs: '0.95rem', md: '0.98rem' },
                  fontWeight: 700,
                  lineHeight: 1.45,
                  color: '#111'
                }}>
                Nhiều tính năng khác đang chờ khám phá
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
