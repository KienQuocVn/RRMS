import { Avatar, Button, Grid } from '@mui/material'
import HouseCheckIcon from '@mui/icons-material/HomeWork'
import PieChartIcon from '@mui/icons-material/PieChart'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import LoginIcon from '@mui/icons-material/Login'

const NAV_BUTTONS = [
  { icon: <HouseCheckIcon fontSize="large" />, label: 'Quản lí nhà' },
  { icon: <PieChartIcon fontSize="large" />, label: 'Tổng báo cáo' },
  { icon: <AddIcon fontSize="large" />, label: 'Đăng tin' },
  { icon: <PeopleIcon fontSize="large" />, label: 'Môi giới' },
  { icon: <BusinessIcon fontSize="large" />, label: 'Công ty/nhóm' },
  { icon: <SettingsIcon fontSize="large" />, label: 'Cài đặt chung' },
  { icon: <NotificationsIcon fontSize="large" />, label: 'Thông báo' },
  { icon: <PersonIcon fontSize="large" />, label: 'Tài khoản' },
  { icon: <LoginIcon fontSize="large" />, label: 'Đăng nhập' },
]

const NavButton = ({ icon, label }) => (
  <Button
    variant="contained"
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textTransform: 'none',
    }}
  >
    {icon}
    <span>{label}</span>
  </Button>
)

const TopBar = () => (
  <Grid container spacing={1} alignItems="center">
    {/* Logo */}
    <Grid item xs={12} sm={2} md={2}>
      <Avatar
        alt="Logo"
        src="/src/assets/imglogo.jpg"
        sx={{ height: 100, width: 100, img: { objectFit: 'cover', objectPosition: 'center' } }}
      />
    </Grid>

    {/* Nav Buttons */}
    <Grid item xs={12} sm={10} md={10}>
      <Grid container spacing={1}>
        {NAV_BUTTONS.map(({ icon, label }) => (
          <Grid key={label} item xs={12} sm={1} md={1}>
            <NavButton icon={icon} label={label} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default TopBar
