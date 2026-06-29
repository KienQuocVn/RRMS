import Grid from '@mui/material/Grid2'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { DASHBOARD_COLORS } from '../constants/dashboardTheme'
import { formatDashboardNumber, formatRevenue } from '../hooks/useDashboardData'
import StatCard from './StatCard'

const StatCardsRow = ({ stats }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <StatCard
        label="Tổng người dùng"
        value={formatDashboardNumber(stats.totalUsers)}
        subLabel={`+${stats.usersThisMonth} người tháng này`}
        icon={<PeopleOutlineIcon sx={{ fontSize: 28 }} />}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <StatCard
        label="Nhà trọ hoạt động"
        value={formatDashboardNumber(stats.activeMotels)}
        subLabel={`+${stats.motelsThisWeek} tuần này`}
        icon={<BusinessOutlinedIcon sx={{ fontSize: 28 }} />}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <StatCard
        label="Bài chờ duyệt"
        value={formatDashboardNumber(stats.pendingPosts)}
        valueColor={DASHBOARD_COLORS.warning}
        subLabel="cần xử lý ngay"
        subColor={DASHBOARD_COLORS.warning}
        iconColor={DASHBOARD_COLORS.warning}
        icon={<ScheduleOutlinedIcon sx={{ fontSize: 28 }} />}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <StatCard
        label="Doanh thu tháng"
        value={formatRevenue(stats.monthlyRevenue)}
        subLabel={`+${stats.revenueGrowth}% so với tháng trước`}
        icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28 }} />}
      />
    </Grid>
  </Grid>
)

export default StatCardsRow
