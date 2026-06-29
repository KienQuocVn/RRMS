import { Box, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { DASHBOARD_COLORS } from '../../constants/dashboardTheme'
import { formatDashboardNumber } from '../../hooks/useDashboardData'
import DashboardCard from '../DashboardCard'

const TopCitiesBarChart = ({ cities = [] }) => {
  const topFive = cities.slice(0, 5)
  const cityNames = topFive.map((item) => item.city)
  const values = topFive.map((item) => item.count)

  return (
    <DashboardCard sx={{ height: '100%' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 2 }}>
        Top 5 tỉnh thành có nhiều tin nhất
      </Typography>
      <Box sx={{ width: '100%', height: 280 }}>
        <BarChart
          layout="horizontal"
          yAxis={[{ scaleType: 'band', data: cityNames }]}
          xAxis={[{ min: 0 }]}
          series={[
            {
              data: values,
              color: DASHBOARD_COLORS.primary,
              valueFormatter: (value) => `${formatDashboardNumber(value)} tin`
            }
          ]}
          height={280}
          margin={{ top: 10, right: 50, bottom: 20, left: 90 }}
        />
      </Box>
    </DashboardCard>
  )
}

export default TopCitiesBarChart
