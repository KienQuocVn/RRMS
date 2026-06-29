import { Box, Stack, Typography } from '@mui/material'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'

const ICONS = {
  groups: Groups2RoundedIcon,
  apartment: ApartmentRoundedIcon,
  person: PersonRoundedIcon,
  lock: LockRoundedIcon
}

const UserStatsBar = ({ stats }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
      gap: 1.5
    }}>
    {stats.map((item) => {
      const Icon = ICONS[item.icon]
      return (
        <Stack
          key={item.key}
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            minHeight: 72,
            px: 2,
            borderRadius: '10px',
            bgcolor: item.bg
          }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Icon sx={{ fontSize: 22, color: item.color }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: item.color }}>{item.value}</Typography>
            <Typography sx={{ fontSize: 11, color: 'rgba(17, 24, 39, 0.68)' }}>{item.label}</Typography>
          </Box>
        </Stack>
      )
    })}
  </Box>
)

export default UserStatsBar
