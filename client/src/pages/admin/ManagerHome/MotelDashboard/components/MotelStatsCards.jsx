import { cloneElement } from 'react'
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import PersonIcon from '@mui/icons-material/Person'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const StatCard = ({ title, value, icon, color, loading }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
      <Box>
        <Typography color="text.secondary" variant="subtitle2" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {cloneElement(icon, { sx: { fontSize: 32, color: color } })}
      </Box>
    </CardContent>
  </Card>
)

const MotelStatsCards = ({ rooms = [], loading = false }) => {
  // Calculate stats based on rooms array
  // Assuming room.status or room.latestContract.status determines these
  const totalDebt = rooms.reduce((sum, r) => sum + (Number(r.debt) || 0), 0)

  const emptyRooms = rooms.filter((r) => !r.latestContract?.status && !r.reserveAPlace?.status).length
  const occupiedRooms = rooms.filter(
    (r) => r.latestContract?.status === 'ACTIVE' || r.latestContract?.status === 'IATExpire'
  ).length
  const depositedRooms = rooms.filter((r) => r.reserveAPlace?.status).length

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="TỔNG TIỀN NỢ"
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDebt)}
          icon={<AccountBalanceWalletIcon />}
          color="#f44336" // Red
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="TRỐNG"
          value={emptyRooms}
          icon={<MeetingRoomIcon />}
          color="#ff9800" // Orange
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="ĐANG Ở"
          value={occupiedRooms}
          icon={<PersonIcon />}
          color="#20a9e7" // Green
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="ĐÃ CỌC"
          value={depositedRooms}
          icon={<AttachMoneyIcon />}
          color="#2196f3" // Blue
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}

export default MotelStatsCards
