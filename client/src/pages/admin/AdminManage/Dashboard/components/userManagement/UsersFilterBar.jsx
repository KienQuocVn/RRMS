import { Box, Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {
  BORDER,
  JOIN_TIME_OPTIONS,
  PRIMARY,
  PRIMARY_HOVER,
  ROLE_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  VERIFICATION_OPTIONS
} from './userManagementUtils'

const selectSx = {
  minWidth: 156,
  '& .MuiOutlinedInput-root': {
    height: 40,
    borderRadius: '8px',
    fontSize: 13
  },
  '& .MuiInputLabel-root': {
    fontSize: 12
  }
}

const UsersFilterBar = ({ filters, searchValue, onFilterChange, onSearchChange }) => (
  <Stack
    direction={{ xs: 'column', xl: 'row' }}
    spacing={1.5}
    justifyContent="space-between"
    sx={{
      bgcolor: '#ffffff',
      border: BORDER,
      borderRadius: '10px',
      p: '12px 16px'
    }}>
    <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', flex: 1 }}>
      <TextField
        select
        label="Vai trò"
        value={filters.role}
        onChange={(event) => onFilterChange('role', event.target.value)}
        sx={selectSx}>
        {ROLE_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Trạng thái tài khoản"
        value={filters.status}
        onChange={(event) => onFilterChange('status', event.target.value)}
        sx={selectSx}>
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Xác minh"
        value={filters.verification}
        onChange={(event) => onFilterChange('verification', event.target.value)}
        sx={selectSx}>
        {VERIFICATION_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Thời gian tham gia"
        value={filters.joinedAt}
        onChange={(event) => onFilterChange('joinedAt', event.target.value)}
        sx={selectSx}>
        {JOIN_TIME_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Sắp xếp"
        value={filters.sort}
        onChange={(event) => onFilterChange('sort', event.target.value)}
        sx={selectSx}>
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>

    <Stack direction="row" spacing={1.25} sx={{ width: { xs: '100%', xl: 'auto' } }}>
      <TextField
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo tên, email, số điện thoại..."
        sx={{
          width: { xs: '100%', md: 300 },
          '& .MuiOutlinedInput-root': {
            height: 40,
            borderRadius: '8px',
            fontSize: 13
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
            </InputAdornment>
          )
        }}
      />
      <Button
        variant="outlined"
        startIcon={<FilterAltOutlinedIcon />}
        sx={{
          minWidth: 92,
          textTransform: 'none',
          color: PRIMARY,
          borderColor: PRIMARY,
          borderRadius: '8px',
          '&:hover': {
            borderColor: PRIMARY_HOVER,
            color: PRIMARY_HOVER,
            backgroundColor: '#F0F9FF'
          }
        }}>
        Lọc
      </Button>
    </Stack>
  </Stack>
)

export default UsersFilterBar
