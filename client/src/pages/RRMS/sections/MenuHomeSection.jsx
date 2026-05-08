import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import DomainRoundedIcon from '@mui/icons-material/DomainRounded'
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded'
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded'
import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const MenuCard = ({ icon, title, description, onClick, color }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 2.25,
      height: '100%',
      borderRadius: 5,
      cursor: 'pointer',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
      transition: 'transform 180ms ease, box-shadow 180ms ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 24px 68px rgba(15, 23, 42, 0.12)'
      }
    }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        bgcolor: alpha(color, 0.12),
        color
      }}>
      {icon}
    </Box>

    <Typography sx={{ mt: 2, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{title}</Typography>
    <Typography sx={{ mt: 1, color: '#64748b', lineHeight: 1.7 }}>{description}</Typography>
  </Paper>
)

function MenuHomeSection({ onJumpToSection }) {
  return (
    <Box id="menu-home" sx={{ mt: { xs: -2, md: -6 } }}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<LocationCityRoundedIcon sx={{ fontSize: 28 }} />}
            title="Theo tỉnh thành"
            description="Bắt đầu từ địa bàn lớn để thấy nhanh khu vực đang có nhiều lựa chọn."
            color="#0f766e"
            onClick={() => onJumpToSection('province-search')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<DomainRoundedIcon sx={{ fontSize: 28 }} />}
            title="Theo quận huyện"
            description="Đi sâu hơn vào từng quận, huyện có mật độ tin đăng cao."
            color="#2563eb"
            onClick={() => onJumpToSection('district-search')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<ApartmentRoundedIcon sx={{ fontSize: 28 }} />}
            title="Theo phường xã"
            description="Tìm sát hơn tới phường, xã để khoanh vùng và so sánh tiện hơn."
            color="#7c3aed"
            onClick={() => onJumpToSection('ward-section')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 28 }} />}
            title="Ưu đãi nổi bật"
            description="Tập hợp những tin có giá tốt hoặc đang có mức thuê hấp dẫn."
            color="#ea580c"
            onClick={() => onJumpToSection('promotion-section')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<RoomPreferencesRoundedIcon sx={{ fontSize: 28 }} />}
            title="Dọn vào ngay"
            description="Các phòng đã sẵn sàng hoặc có thể nhận phòng trong thời gian ngắn."
            color="#0891b2"
            onClick={() => onJumpToSection('ready-to-move-rooms')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={2}>
          <MenuCard
            icon={<NewReleasesRoundedIcon sx={{ fontSize: 28 }} />}
            title="Tin mới nhất"
            description="Danh sách bài đăng mới được cập nhật để không bỏ lỡ lựa chọn tốt."
            color="#dc2626"
            onClick={() => onJumpToSection('latest-rooms')}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default MenuHomeSection
