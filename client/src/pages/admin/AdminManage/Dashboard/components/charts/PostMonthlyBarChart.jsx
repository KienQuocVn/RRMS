import { Box, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { DASHBOARD_COLORS, MONTH_LABELS } from '../../constants/dashboardTheme'
import DashboardCard from '../DashboardCard'

const PostMonthlyBarChart = ({ data = [] }) => (
  <DashboardCard sx={{ height: '100%' }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 2 }}>
      Bài đăng theo tháng
    </Typography>
    <Box sx={{ width: '100%', height: 280 }}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: MONTH_LABELS }]}
        yAxis={[{ min: 0 }]}
        series={[
          {
            data,
            color: DASHBOARD_COLORS.primary,
            valueFormatter: (value) => `${value} bài`
          }
        ]}
        height={280}
        margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
        sx={{
          '& .MuiBarElement-root': {
            rx: 4,
            ry: 4
          },
          '& .MuiBarElement-root:hover': {
            fill: DASHBOARD_COLORS.primaryHover
          }
        }}
      />
    </Box>
  </DashboardCard>
)

export default PostMonthlyBarChart
