import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { POST_APPROVAL_STATS_THEME } from './postApprovalUtils'

const STAT_ICONS = {
  pending: ScheduleOutlinedIcon,
  approvedToday: CheckRoundedIcon,
  rejectedToday: CloseRoundedIcon,
  monthTotal: DescriptionOutlinedIcon
}

const PostApprovalStatsBar = ({ stats }) => (
  <Grid container spacing={1.5}>
    {POST_APPROVAL_STATS_THEME.map((item) => {
      const Icon = STAT_ICONS[item.key]
      return (
        <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Box
            sx={{
              height: 72,
              borderRadius: '10px',
              bgcolor: item.background,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(255,255,255,0.58)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color
              }}>
              <Icon sx={{ fontSize: 22 }} />
            </Box>
            <Stack spacing={0.25}>
              <Typography sx={{ fontSize: 20, lineHeight: 1, fontWeight: 600, color: item.color }}>
                {stats[item.key]}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#4b5563' }}>{item.label}</Typography>
            </Stack>
          </Box>
        </Grid>
      )
    })}
  </Grid>
)

export default PostApprovalStatsBar
