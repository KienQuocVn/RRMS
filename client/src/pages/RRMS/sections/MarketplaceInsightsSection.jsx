import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded'
import DomainRoundedIcon from '@mui/icons-material/DomainRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { Box, Card, CardActionArea, CardContent, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SectionHeading from './SectionHeading'

const StatCard = ({ icon, value, label, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      height: '100%',
      borderRadius: 5,
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)'
    }}>
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        bgcolor: alpha(color, 0.12),
        color
      }}>
      {icon}
    </Box>
    <Typography sx={{ mt: 2, fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{value}</Typography>
    <Typography sx={{ mt: 0.75, color: '#475569', lineHeight: 1.65 }}>{label}</Typography>
  </Paper>
)

const StepCard = ({ step, title, description, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: '100%',
      borderRadius: 5,
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)'
    }}>
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: alpha(color, 0.14),
        color,
        fontWeight: 900
      }}>
      {step}
    </Box>
    <Typography sx={{ mt: 2, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{title}</Typography>
    <Typography sx={{ mt: 1, color: '#64748b', lineHeight: 1.7 }}>{description}</Typography>
  </Paper>
)

function MarketplaceInsightsSection({ stats, keywords, onSelectKeyword, onOpenSupport, onOpenBroker }) {
  return (
    <Box sx={{ mt: 7 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 22px 55px rgba(15, 23, 42, 0.08)' }}>
            <CardActionArea onClick={onOpenBroker}>
              <Box
                sx={{
                  minHeight: 220,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff',
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(37,99,235,0.68) 100%), url('/banner1.png') center/cover no-repeat"
                }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Hợp tác viên
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 26, fontWeight: 900, lineHeight: 1.15 }}>
                  Mở rộng nguồn khách và mạng lưới môi giới cùng RRMS
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 22px 55px rgba(15, 23, 42, 0.08)' }}>
            <CardActionArea onClick={onOpenSupport}>
              <Box
                sx={{
                  minHeight: 220,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff',
                  background:
                    "linear-gradient(135deg, rgba(15,118,110,0.78) 0%, rgba(245,158,11,0.68) 100%), url('/banner2.png') center/cover no-repeat"
                }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Hỗ trợ tìm phòng
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 26, fontWeight: 900, lineHeight: 1.15 }}>
                  Kết nối nhanh tới danh sách phù hợp thay vì phải tự dò từng bài đăng
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 7 }}>
        <SectionHeading
          eyebrow="Từ Khóa Phổ Biến"
          title="Các khu vực đang được tìm kiếm nhiều trên RRMS"
          description="Danh sách được suy ra từ dữ liệu phòng đang hoạt động để người dùng chạm một lần là mở thẳng kết quả tìm kiếm."
        />

        <Paper
          elevation={0}
          sx={{
            p: 2.25,
            borderRadius: 6,
            border: '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)'
          }}>
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1.25}>
            {keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                onClick={() => onSelectKeyword(keyword)}
                sx={{
                  height: 40,
                  borderRadius: 999,
                  bgcolor: alpha('#2563eb', 0.08),
                  border: '1px solid rgba(37, 99, 235, 0.12)',
                  fontWeight: 700
                }}
              />
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ mt: 7 }}>
        <SectionHeading
          eyebrow="Các Bước Đăng Tin"
          title="Đăng tin bài trên RRMS theo một flow ngắn, rõ và dễ thực thi"
          description="Thay vì trải nghiệm rời rạc, giao diện mới gom lại thành ba bước trực quan để chủ nhà hoặc cộng tác viên dễ theo dõi."
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StepCard step="1" title="Đăng nhập hoặc tạo tài khoản" description="Bắt đầu bằng tài khoản cá nhân để quản lý danh sách, trạng thái và lịch sử thao tác." color="#16a34a" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StepCard step="2" title="Đăng tin với thông tin rõ ràng" description="Bổ sung giá thuê, địa chỉ, diện tích, ảnh và điều kiện nhận phòng để tăng chất lượng hiển thị." color="#2563eb" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StepCard step="3" title="Xét duyệt và tiếp cận khách thuê" description="Tin được đưa vào luồng hiển thị để người thuê, môi giới và đội ngũ hỗ trợ tiếp cận nhanh hơn." color="#f59e0b" />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 7 }}>
        <SectionHeading
          eyebrow="RRMS Có Gì?"
          title="Tại sao RRMS đáng để người thuê và chủ nhà cùng sử dụng"
          description="Các chỉ số dưới đây lấy trực tiếp từ tập dữ liệu RRMS hiện có để phản ánh quy mô hiển thị và mức độ bao phủ của hệ thống."
        />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard icon={<DomainRoundedIcon />} value={stats.totalRooms} label="Tin cho thuê đang hoạt động và sẵn sàng cho hành trình tìm kiếm." color="#16a34a" />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard icon={<PlaceRoundedIcon />} value={stats.provinces} label="Tỉnh thành đang có dữ liệu thực tế để người dùng đi từ rộng đến hẹp." color="#2563eb" />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard icon={<InsightsRoundedIcon />} value={stats.districts} label="Quận huyện được gom nhóm để giúp người thuê khoanh vùng nhanh hơn." color="#0f766e" />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard icon={<Diversity3RoundedIcon />} value={stats.wards} label="Phường xã cho phép chốt vị trí chính xác hơn khi đã có khu vực mục tiêu." color="#ea580c" />
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 6,
            border: '1px solid rgba(15, 23, 42, 0.06)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
          }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha('#0f766e', 0.12),
                color: '#0f766e'
              }}>
              <VerifiedRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                RRMS ưu tiên trải nghiệm tìm là có, xem là hiểu, và quản lý là rõ.
              </Typography>
              <Typography sx={{ mt: 0.75, color: '#475569', lineHeight: 1.8 }}>
                Với cấu trúc section mới, người dùng không còn phải lướt qua các khối dư thừa. Chủ nhà có CTA rõ ràng hơn, người thuê có hành trình tìm kiếm trực quan hơn và frontend cũng dễ bảo trì hơn khi tiếp tục phát triển.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}

export default MarketplaceInsightsSection
