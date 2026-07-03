import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Colors } from '~/theme'

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

// eslint-disable-next-line no-unused-vars
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

const TenantFilterBarV2 = ({ filters, statusFilters, onStatusFilterChange, searchValue, onSearchChange }) => {
  const activeFilterCount = Object.values(statusFilters || {}).filter(Boolean).length

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        minHeight: 38
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <FilterAltOutlinedIcon sx={{ color: '#888', fontSize: 22 }} />
          {activeFilterCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                minWidth: 15,
                height: 15,
                borderRadius: '999px',
                bgcolor: Colors.info,
                color: '#fff',
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0.3
              }}>
              {activeFilterCount}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
          {filters.map((filter) => {
            const isChecked = Boolean(statusFilters?.[filter.key])

            return (
              <FormControlLabel
                key={filter.key}
                control={
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    onChange={(event) => onStatusFilterChange?.(filter.key, event.target.checked)}
                    sx={{
                      p: '3px 4px',
                      color: '#ccc',
                      '&.Mui-checked': { color: '#ccc' },
                      '& .MuiSvgIcon-root': { fontSize: 16 }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '12px',
                        color: isChecked ? '#222' : '#666',
                        fontWeight: isChecked ? 600 : 400,
                        whiteSpace: 'nowrap',
                        userSelect: 'none'
                      }}>
                      {filter.label}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: filter.badgeColor,
                        color: '#fff',
                        borderRadius: '10px',
                        px: 0.7,
                        py: 0,
                        fontSize: '10px',
                        fontWeight: 700,
                        minWidth: 18,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}>
                      {filter.count}
                    </Box>
                  </Box>
                }
                sx={{ m: 0, mr: 1 }}
              />
            )
          })}
        </Box>
      </Box>

      <Paper
        component="form"
        onSubmit={(event) => event.preventDefault()}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 260,
          border: '1px solid #ddd',
          borderRadius: '4px',
          height: 34,
          px: '6px',
          bgcolor: '#fff',
          flexShrink: 0,
          '&:focus-within': {
            borderColor: Colors.info,
            boxShadow: `0 0 0 2px ${Colors.info}20`
          }
        }}>
        <InputBase
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          sx={{ flex: 1, fontSize: '13px', color: '#333' }}
          placeholder="Tìm tên hoặc số điện thoại..."
          inputProps={{ 'aria-label': 'Tim kiem khach thue' }}
        />
        {searchValue ? (
          <Tooltip title="Xoa">
            <IconButton
              size="small"
              onClick={() => onSearchChange?.('')}
              sx={{ p: '2px', color: '#aaa', '&:hover': { color: Colors.error } }}>
              <ClearIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <SearchIcon sx={{ color: '#aaa', fontSize: 18, flexShrink: 0 }} />
        )}
      </Paper>
    </Box>
  )
}

export default TenantFilterBarV2
