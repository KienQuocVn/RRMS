import { Box, Stack, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { DASHBOARD_COLORS, MONTH_LABELS } from '../../constants/dashboardTheme'
import DashboardCard from '../DashboardCard'

const NewUsersLineChart = ({ hostsMonthly = [], tenantsMonthly = [] }) => (
  <DashboardCard sx={{ height: '100%' }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 2 }}>
      Người dùng mới theo tháng
    </Typography>
    <Box sx={{ width: '100%', height: 280 }}>
      <LineChart
        xAxis={[{ scaleType: 'point', data: MONTH_LABELS }]}
        yAxis={[{ min: 0 }]}
        series={[
          {
            data: hostsMonthly,
            label: 'Chủ trọ',
            color: DASHBOARD_COLORS.primary,
            showMark: true,
            curve: 'linear'
          },
          {
            data: tenantsMonthly,
            label: 'Người thuê',
            color: DASHBOARD_COLORS.primaryHover,
            showMark: true,
            curve: 'linear'
          }
        ]}
        height={280}
        margin={{ top: 20, right: 20, bottom: 30, left: 45 }}
        sx={{
          '& .MuiLineElement-root:nth-of-type(2)': {
            strokeDasharray: '6 4'
          }
        }}
      />
    </Box>
    <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 2, bgcolor: DASHBOARD_COLORS.primary, borderRadius: 1 }} />
        <Typography sx={{ fontSize: 12, color: DASHBOARD_COLORS.textMuted }}>Chủ trọ</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 0,
            borderTop: `2px dashed ${DASHBOARD_COLORS.primaryHover}`
          }}
        />
        <Typography sx={{ fontSize: 12, color: DASHBOARD_COLORS.textMuted }}>Người thuê</Typography>
      </Box>
    </Stack>
  </DashboardCard>
)

export default NewUsersLineChart
