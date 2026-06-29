import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { DASHBOARD_COLORS, dashboardCardSx } from '../../Dashboard/constants/dashboardTheme'

const selectSx = {
  minWidth: 150,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DASHBOARD_COLORS.border },
  '& .MuiSelect-select': { py: 1.1, fontSize: 13 }
}

const PostApprovalFilters = ({
  filters,
  roomTypeOptions,
  cityOptions,
  priceOptions,
  timeOptions,
  statusOptions,
  onFilterChange
}) => (
  <Box
    sx={{
      ...dashboardCardSx,
      p: 2,
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 1.5,
      flexDirection: { xs: 'column', xl: 'row' }
    }}>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
      {[
        { key: 'status', label: 'Trạng thái', options: statusOptions },
        { key: 'roomType', label: 'Loại phòng', options: roomTypeOptions },
        { key: 'city', label: 'Tỉnh thành', options: cityOptions },
        { key: 'priceRange', label: 'Khoảng giá', options: priceOptions },
        { key: 'timeRange', label: 'Thời gian', options: timeOptions }
      ].map((field) => (
        <Box key={field.key}>
          <Typography sx={{ fontSize: 12, color: '#4b5563', mb: 0.75 }}>{field.label}</Typography>
          <FormControl size="small">
            <Select
              value={filters[field.key]}
              onChange={(event) => onFilterChange(field.key, event.target.value)}
              sx={selectSx}>
              {field.options.map((option) => (
                <MenuItem key={option} value={option} sx={{ fontSize: 13 }}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}
    </Box>

    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: { xs: 'flex-start', xl: 'flex-end' }
      }}>
      <Box>
        <Typography sx={{ fontSize: 12, color: '#4b5563', mb: 0.75 }}>Tìm kiếm</Typography>
        <OutlinedInput
          size="small"
          value={filters.keyword}
          onChange={(event) => onFilterChange('keyword', event.target.value)}
          placeholder="Tìm theo tiêu đề, địa chỉ, chủ trọ..."
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            </InputAdornment>
          }
          sx={{
            width: { xs: '100%', sm: 260 },
            fontSize: 13,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: DASHBOARD_COLORS.border }
          }}
        />
      </Box>

      <Button
        variant="outlined"
        startIcon={<FilterListRoundedIcon />}
        sx={{
          height: 40,
          textTransform: 'none',
          borderRadius: '8px',
          px: 2,
          color: '#374151',
          borderColor: DASHBOARD_COLORS.border,
          '&:hover': {
            borderColor: DASHBOARD_COLORS.primary,
            bgcolor: '#f8fbfe'
          }
        }}>
        Lọc
      </Button>
    </Box>
  </Box>
)

export default PostApprovalFilters
