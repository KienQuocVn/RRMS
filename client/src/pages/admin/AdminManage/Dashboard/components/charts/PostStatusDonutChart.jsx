import { Box, Stack, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { DASHBOARD_COLORS, POST_STATUS_CONFIG } from '../../constants/dashboardTheme'
import DashboardCard from '../DashboardCard'

const PostStatusDonutChart = ({ postStatus = { total: 0, segments: [] } }) => {
  const chartData = POST_STATUS_CONFIG.map((config, index) => {
    const segment = postStatus.segments.find((s) => s.key === config.key) || { value: 0, percent: 0 }
    return {
      id: index,
      value: segment.value,
      label: config.label,
      color: config.color
    }
  }).filter((item) => item.value > 0)

  const displayData =
    chartData.length > 0
      ? chartData
      : POST_STATUS_CONFIG.map((config, index) => ({
          id: index,
          value: 1,
          label: config.label,
          color: config.color
        }))

  return (
    <DashboardCard sx={{ height: '100%' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 2 }}>
        Tỷ lệ trạng thái bài
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', width: '100%', height: 220 }}>
          <PieChart
            series={[
              {
                data: displayData,
                innerRadius: 62,
                outerRadius: 88,
                paddingAngle: 2,
                cornerRadius: 3
              }
            ]}
            height={220}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            slotProps={{ legend: { hidden: true } }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
            <Typography sx={{ fontSize: 22, fontWeight: 600, color: DASHBOARD_COLORS.textDark, lineHeight: 1 }}>
              {postStatus.total}
            </Typography>
            <Typography sx={{ fontSize: 12, color: DASHBOARD_COLORS.textMuted }}>bài đăng</Typography>
          </Box>
        </Box>
        <Stack spacing={1.2} sx={{ width: '100%', mt: 1 }}>
          {POST_STATUS_CONFIG.map((config) => {
            const segment = postStatus.segments.find((s) => s.key === config.key) || { percent: 0 }
            return (
              <Box key={config.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: config.color }} />
                  <Typography sx={{ fontSize: 12, color: DASHBOARD_COLORS.textDark }}>{config.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: DASHBOARD_COLORS.textDark }}>
                  {segment.percent}%
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </DashboardCard>
  )
}

export default PostStatusDonutChart
