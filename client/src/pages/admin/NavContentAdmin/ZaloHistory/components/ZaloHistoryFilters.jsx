import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material'

const getFilterCardStyles = (isActive) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  minHeight: 42,
  px: 1.25,
  py: 0.75,
  borderRadius: 2,
  border: '1px solid',
  borderColor: isActive ? '#20a9e7' : '#d8e1eb',
  backgroundColor: isActive ? '#eff8ff' : '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#20a9e7',
    backgroundColor: '#f8fcff'
  }
})

const getBadgeStyles = (backgroundColor) => ({
  position: 'absolute',
  top: -11,
  right: 8,
  minWidth: 20,
  height: 20,
  px: 0.5,
  borderRadius: 999,
  backgroundColor,
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 6px 14px rgba(15, 23, 42, 0.15)'
})

const FilterCard = ({ active, label, count, badgeColor, checked, icon, onClick }) => {
  return (
    <Box onClick={onClick} sx={getFilterCardStyles(active)}>
      {typeof count === 'number' ? <Box sx={getBadgeStyles(badgeColor)}>{count}</Box> : null}
      {icon}
      {typeof checked === 'boolean' ? (
        <Checkbox checked={checked} size="small" sx={{ p: 0.25, pointerEvents: 'none' }} />
      ) : null}
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
        {label}
      </Typography>
    </Box>
  )
}

const actionButtonStyles = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
  py: 1,
  boxShadow: 'none'
}

const ZaloHistoryFilters = ({
  totalCount,
  successCount,
  errorCount,
  showSuccess,
  showError,
  onToggleSuccess,
  onToggleError,
  onResetFilters,
  onSendTest,
}) => {
  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: '#d8e1eb',
        borderRadius: 2.5,
        backgroundColor: '#fff'
      }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', xl: 'center' }}>
          <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
            <FilterCard
              active={false}
              label=""
              count={totalCount}
              badgeColor="#20a9e7"
              onClick={onResetFilters}
              icon={<FilterAltOutlinedIcon sx={{ color: '#1f2937' }} />}
            />

            <FilterCard
              active={showSuccess}
              label="Đã gửi thành công"
              count={successCount}
              badgeColor="#20a9e7"
              checked={showSuccess}
              onClick={onToggleSuccess}
            />

            <FilterCard
              active={showError}
              label="Đã gửi thất bại"
              count={errorCount}
              badgeColor="#ef4444"
              checked={showError}
              onClick={onToggleError}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<ReceiptLongOutlinedIcon />}
              onClick={onSendTest}
              sx={{
                ...actionButtonStyles,
                backgroundColor: '#facc15',
                color: '#111827',
                '&:hover': { backgroundColor: '#eab308' }
              }}>
              Gửi thử hóa đơn qua ZALO
            </Button>

            <Button
              variant="contained"
              startIcon={<DescriptionOutlinedIcon />}
              sx={{
                ...actionButtonStyles,
                backgroundColor: '#20a9e7',
                '&:hover': { backgroundColor: '#2b7ed7' }
              }}>
              Bật/tắt tính năng gửi hóa đơn qua ZALO
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ZaloHistoryFilters
