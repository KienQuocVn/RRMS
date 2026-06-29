import { Box } from '@mui/material'
import { dashboardCardSx } from '../constants/dashboardTheme'

const DashboardCard = ({ children, sx = {}, noPadding = false }) => (
  <Box
    sx={{
      ...dashboardCardSx,
      p: noPadding ? 0 : 2.5,
      ...sx
    }}>
    {children}
  </Box>
)

export default DashboardCard
