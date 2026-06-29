import { Box, Typography } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { DASHBOARD_COLORS } from '../constants/dashboardTheme'
import DashboardCard from './DashboardCard'

const StatCard = ({ label, value, subLabel, icon, valueColor, iconColor, subColor = DASHBOARD_COLORS.success }) => (
  <DashboardCard sx={{ height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: DASHBOARD_COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            mb: 1
          }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 500,
            color: valueColor || DASHBOARD_COLORS.textDark,
            lineHeight: 1.2
          }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          {subColor === DASHBOARD_COLORS.success && <TrendingUpIcon sx={{ fontSize: 14, color: subColor }} />}
          <Typography sx={{ fontSize: 11, color: subColor }}>{subLabel}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          color: iconColor || DASHBOARD_COLORS.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: 1
        }}>
        {icon}
      </Box>
    </Box>
  </DashboardCard>
)

export default StatCard
