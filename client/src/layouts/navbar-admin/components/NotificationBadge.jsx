import { Box } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

/**
 * NotificationBadge
 * Renders the bell icon with dropdown skeleton.
 * Wiring to real data is handled by the parent (NavAdmin).
 */
const NotificationBadge = ({ count = 0 }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    {count > 0 && (
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          minWidth: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: '#ff9800',
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {count}
      </Box>
    )}
    <NotificationsIcon />
  </Box>
)

export default NotificationBadge
