import { Box, Divider, Typography } from '@mui/material'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { DASHBOARD_COLORS } from '../constants/dashboardTheme'
import DashboardCard from './DashboardCard'

const ACTIVITY_ICON_MAP = {
  post_new: { icon: PostAddOutlinedIcon, color: DASHBOARD_COLORS.primary },
  post_approved: { icon: CheckCircleOutlineIcon, color: DASHBOARD_COLORS.green },
  account_new: { icon: PersonAddOutlinedIcon, color: DASHBOARD_COLORS.purple },
  report: { icon: FlagOutlinedIcon, color: DASHBOARD_COLORS.danger },
  post_rejected: { icon: CancelOutlinedIcon, color: DASHBOARD_COLORS.orange }
}

const RecentActivityFeed = ({ activities = [] }) => (
  <DashboardCard sx={{ height: '100%' }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 2 }}>
      Hoạt động gần đây
    </Typography>
    <Box>
      {activities.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: DASHBOARD_COLORS.textMuted, py: 2 }}>
          Chưa có hoạt động gần đây
        </Typography>
      ) : (
        activities.map((activity, index) => {
          const config = ACTIVITY_ICON_MAP[activity.type] || ACTIVITY_ICON_MAP.post_new
          const Icon = config.icon
          return (
            <Box key={activity.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  py: 1.25
                }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: `${config.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                  <Icon sx={{ fontSize: 18, color: config.color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, color: DASHBOARD_COLORS.textDark, lineHeight: 1.4 }}>
                    {activity.text}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: DASHBOARD_COLORS.textMuted,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                  {activity.timeAgo}
                </Typography>
              </Box>
              {index < activities.length - 1 && (
                <Divider sx={{ borderColor: DASHBOARD_COLORS.border, opacity: 0.6 }} />
              )}
            </Box>
          )
        })
      )}
    </Box>
  </DashboardCard>
)

export default RecentActivityFeed
