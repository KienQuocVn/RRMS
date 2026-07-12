import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WalletRoundedIcon from '@mui/icons-material/WalletRounded'
import { Box, Button, Typography } from '@mui/material'
import { formatterAmount } from '~/utils/formatterAmount'
import ProfileSectionCard from './ProfileSectionCard'

const summaryCards = [
  {
    title: 'Chi tiêu trong tháng',
    value: formatterAmount(1000000),
    accent: '#f59e0b',
    icon: <WalletRoundedIcon sx={{ fontSize: 22 }} />
  },
  {
    title: 'Chi tiêu so với tháng trước',
    value: formatterAmount(1300000),
    accent: '#16a34a',
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 22 }} />
  },
  {
    title: 'Dư nợ phải trả',
    value: formatterAmount(0),
    accent: '#ef4444',
    icon: <TrendingDownRoundedIcon sx={{ fontSize: 22 }} />
  }
]

function BillingSummarySection() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 2
      }}
    >
      {summaryCards.map((item) => (
        <ProfileSectionCard key={item.title} title={item.title}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 900, color: item.accent }}>{item.value}</Typography>
              <Button variant="text" sx={{ mt: 0.75, px: 0, minWidth: 'auto', fontWeight: 700 }}>
                Xem chi tiết
              </Button>
            </Box>

            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                color: item.accent,
                backgroundColor: `${item.accent}14`
              }}
            >
              {item.icon}
            </Box>
          </Box>
        </ProfileSectionCard>
      ))}
    </Box>
  )
}

export default BillingSummarySection
