import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WalletRoundedIcon from '@mui/icons-material/WalletRounded'
import { Box, Paper, Stack, Typography } from '@mui/material'

const SUMMARY_ITEMS = [
  {
    key: 'income',
    label: 'Tổng khoản thu (tiền vào)',
    valueKey: 'totalIncome',
    color: '#137c57',
    background: '#edf8f2',
    icon: <TrendingUpRoundedIcon sx={{ color: '#16a34a', fontSize: 28 }} />
  },
  {
    key: 'expense',
    label: 'Tổng khoản chi (tiền ra)',
    valueKey: 'totalExpense',
    color: '#d92d20',
    background: '#fff1f2',
    icon: <TrendingDownRoundedIcon sx={{ color: '#ef4444', fontSize: 28 }} />
  },
  {
    key: 'profit',
    label: 'Lợi nhuận',
    valueKey: 'profit',
    color: '#0f766e',
    background: '#eefbf7',
    icon: <WalletRoundedIcon sx={{ color: '#0f9f79', fontSize: 28 }} />
  }
]

const IncomeSummaryStats = ({ summary, formatCurrency }) => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
      {SUMMARY_ITEMS.map((item) => (
        <Paper
          key={item.key}
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 0,
            p: 2,
            borderRadius: 2.5,
            backgroundColor: item.background,
            borderColor: '#dbe4ea'
          }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)'
              }}>
              {item.icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: '#475467', mb: 0.5 }}>
                {item.label}
              </Typography>
              <Typography variant="h6" sx={{ color: item.color, fontWeight: 800 }}>
                {formatCurrency(summary?.[item.valueKey] || 0)}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

export default IncomeSummaryStats
