import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { FILTER_OPTIONS } from './violationReportConstants'
import { BORDER, CARD_BG, PRIMARY, PRIMARY_HOVER } from './violationReportStyles'

const selectSx = {
  minWidth: 152,
  height: 38,
  borderRadius: '8px',
  bgcolor: '#ffffff',
  '& .MuiOutlinedInput-notchedOutline': { border: BORDER },
  '& .MuiSelect-select': { fontSize: 13, py: 1.05 }
}

const ViolationFiltersBar = ({ filters, searchValue, onFilterChange, onSearchChange }) => {
  return (
    <Box
      sx={{
        bgcolor: CARD_BG,
        border: BORDER,
        borderRadius: '10px',
        p: { xs: 1.5, md: '12px 16px' }
      }}>
      <Stack direction={{ xs: 'column', xl: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
          <FormControl size="small">
            <Select value={filters.status} onChange={(event) => onFilterChange('status', event.target.value)} sx={selectSx}>
              {FILTER_OPTIONS.statuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select value={filters.reason} onChange={(event) => onFilterChange('reason', event.target.value)} sx={selectSx}>
              {FILTER_OPTIONS.reasons.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select value={filters.subjectType} onChange={(event) => onFilterChange('subjectType', event.target.value)} sx={selectSx}>
              {FILTER_OPTIONS.subjectTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select value={filters.severity} onChange={(event) => onFilterChange('severity', event.target.value)} sx={selectSx}>
              {FILTER_OPTIONS.severities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select value={filters.time} onChange={(event) => onFilterChange('time', event.target.value)} sx={{ ...selectSx, minWidth: 128 }}>
              {FILTER_OPTIONS.times.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <OutlinedInput
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo nội dung, người báo cáo..."
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
              </InputAdornment>
            }
            sx={{
              width: { xs: '100%', sm: 240 },
              height: 38,
              borderRadius: '8px',
              bgcolor: '#ffffff',
              fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': { border: BORDER }
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListRoundedIcon />}
            sx={{
              height: 38,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              color: PRIMARY,
              borderColor: PRIMARY,
              '&:hover': {
                borderColor: PRIMARY_HOVER,
                color: PRIMARY_HOVER,
                bgcolor: '#ffffff'
              }
            }}>
            Lọc
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ViolationFiltersBar
