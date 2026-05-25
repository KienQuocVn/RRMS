import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, Checkbox, InputAdornment, Stack, TextField, Typography } from '@mui/material'

const getCardStyles = (isActive) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  minHeight: 44,
  px: 1.25,
  py: 0.75,
  borderRadius: 2,
  border: '1px solid',
  borderColor: isActive ? 'primary.main' : '#d8e1eb',
  backgroundColor: isActive ? '#f0f8ff' : '#fff',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'primary.main',
    backgroundColor: '#f7fbff'
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

const TenantFilterBar = ({ totalCount, filters, activeFilter, onFilterChange, searchValue, onSearchChange }) => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 1.5,
        border: '1px solid',
        borderColor: '#d8e1eb',
        borderRadius: 2,
        backgroundColor: '#fff'
      }}>
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', xl: 'center' }}>
        <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
          <Box onClick={() => onFilterChange('all')} sx={getCardStyles(activeFilter === 'all')}>
            <Box sx={getBadgeStyles('#20a9e7')}>{totalCount}</Box>
            <FilterAltOutlinedIcon sx={{ color: '#1f2937' }} />
          </Box>

          {filters.map((filter) => (
            <Box
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              sx={getCardStyles(activeFilter === filter.key)}>
              <Box sx={getBadgeStyles(filter.badgeColor)}>{filter.count}</Box>
              <Checkbox checked={activeFilter === filter.key} size="small" sx={{ p: 0.25, pointerEvents: 'none' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
                {filter.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        <TextField
          size="small"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Tìm tên hoặc SĐT..."
          sx={{
            minWidth: { xs: '100%', md: 320 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#fff'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
        />
      </Stack>
    </Box>
  )
}

export default TenantFilterBar
