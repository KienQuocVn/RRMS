import { Box, Stack, Typography } from '@mui/material'
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import { EMPTY_QUICK_STATS } from './violationReportConstants'

const ICON_MAP = {
  flag: OutlinedFlagRoundedIcon,
  eye: VisibilityOutlinedIcon,
  check: CheckCircleOutlineRoundedIcon,
  chart: BarChartRoundedIcon
}

const ViolationStatsRow = ({ stats = EMPTY_QUICK_STATS }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))'
        },
        gap: 1.5,
        width: '100%'
      }}>
      {stats.map((item) => {
        const Icon = ICON_MAP[item.iconKey]
        return (
          <Box
            key={item.label}
            sx={{
              minHeight: 78,
              width: '100%',
              borderRadius: '10px',
              bgcolor: item.background,
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.42)',
                flexShrink: 0
              }}>
              <Icon sx={{ fontSize: 20, color: item.color }} />
            </Box>
            <Stack spacing={0.35} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1 }}>
                {item.value}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: 'rgba(17, 24, 39, 0.72)', lineHeight: 1.3 }}>
                {item.label}
              </Typography>
            </Stack>
          </Box>
        )
      })}
    </Box>
  )
}

export default ViolationStatsRow
