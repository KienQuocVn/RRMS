import {
  Box,
  Checkbox,
  FormControlLabel,
  Chip,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  Typography,
  Tooltip
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'

const PRIMARY = '#20a9e7'

const StatusCount = ({ count, color }) => (
  <Box
    component="span"
    sx={{
      ml: 0.5,
      minWidth: 20,
      height: 18,
      px: 0.6,
      borderRadius: '50px',
      backgroundColor: color,
      color: '#fff',
      fontSize: '0.7rem',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1
    }}>
    {count}
  </Box>
)

const InvoiceFilterBar = ({
  invoices,
  filterStatus,
  handleFilterChange,
  filteredData,
  sortValue,
  onSortChange,
  searchText,
  onSearchChange
}) => {
  const paidCount = invoices.filter((inv) => inv.paymentStatus === 'PAID').length
  const unpaidCount = invoices.filter((inv) => inv.paymentStatus !== 'PAID' && inv.paymentStatus !== 'CANCELED').length
  const debtCount = 0
  const canceledCount = invoices.filter((inv) => inv.paymentStatus === 'CANCELED').length

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        py: 0.5,
        borderTop: '1px solid #f0f0f0',
        mt: 0.5
      }}>
      {/* Left: Filter checkboxes */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
        {/* Filter icon with total count */}
        <Tooltip title="Lọc hóa đơn" placement="top">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              mr: 0.5,
              cursor: 'default'
            }}>
            <FilterListIcon sx={{ fontSize: '1.3rem', color: '#555' }} />
            <Box
              sx={{
                minWidth: 18,
                height: 18,
                px: 0.6,
                borderRadius: '50%',
                backgroundColor: PRIMARY,
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              {filteredData.length}
            </Box>
          </Box>
        </Tooltip>

        {/* Hóa đơn đã thu */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              id="done"
              checked={filterStatus.done}
              onChange={handleFilterChange}
              sx={{
                color: '#aaa',
                '&.Mui-checked': { color: '#20a9e7' },
                p: 0.4
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#444' }}>
                Hóa đơn đã thu
              </Typography>
              <StatusCount count={paidCount} color="#20a9e7" />
            </Box>
          }
          sx={{ mr: 0.5, ml: 0 }}
        />

        {/* Hóa đơn chưa thu */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              id="new"
              checked={filterStatus.new}
              onChange={handleFilterChange}
              sx={{
                color: '#aaa',
                '&.Mui-checked': { color: '#f59e0b' },
                p: 0.4
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#444' }}>
                Hóa đơn chưa thu
              </Typography>
              <StatusCount count={unpaidCount} color="#f59e0b" />
            </Box>
          }
          sx={{ mr: 0.5, ml: 0 }}
        />

        {/* Hóa đơn đang nợ */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              id="debt"
              sx={{
                color: '#aaa',
                '&.Mui-checked': { color: '#ef5350' },
                p: 0.4
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#444' }}>
                Hóa đơn đang nợ
              </Typography>
              <StatusCount count={debtCount} color="#ef5350" />
            </Box>
          }
          sx={{ mr: 0.5, ml: 0 }}
        />

        {/* Hóa đơn đã hủy */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              id="cancel"
              sx={{
                color: '#aaa',
                '&.Mui-checked': { color: '#9e9e9e' },
                p: 0.4
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#444' }}>
                Hóa đơn đã hủy
              </Typography>
              <StatusCount count={canceledCount} color="#9e9e9e" />
            </Box>
          }
          sx={{ mr: 0, ml: 0 }}
        />
      </Box>

      {/* Right: Sort + Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Select
          value={sortValue || 'room-asc'}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
          size="small"
          startAdornment={
            <InputAdornment position="start">
              <SortIcon sx={{ fontSize: '1rem', color: '#777' }} />
            </InputAdornment>
          }
          sx={{
            fontSize: '0.78rem',
            height: 36,
            minWidth: 190,
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY }
          }}>
          <MenuItem value="room-asc" sx={{ fontSize: '0.8rem' }}>
            Thứ tự phòng tăng dần
          </MenuItem>
          <MenuItem value="room-desc" sx={{ fontSize: '0.8rem' }}>
            Thứ tự phòng giảm dần
          </MenuItem>
          <MenuItem value="date-desc" sx={{ fontSize: '0.8rem' }}>
            Sắp xếp theo ngày giảm dần
          </MenuItem>
          <MenuItem value="date-asc" sx={{ fontSize: '0.8rem' }}>
            Sắp xếp theo ngày tăng dần
          </MenuItem>
        </Select>

        <OutlinedInput
          size="small"
          placeholder="Tìm tên phòng..."
          value={searchText || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon sx={{ fontSize: '1.1rem', color: '#aaa' }} />
            </InputAdornment>
          }
          sx={{
            fontSize: '0.78rem',
            height: 36,
            minWidth: 180,
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY }
          }}
        />
      </Box>
    </Box>
  )
}

export default InvoiceFilterBar
