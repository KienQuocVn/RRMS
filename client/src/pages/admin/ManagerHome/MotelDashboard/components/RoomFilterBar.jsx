import { useState } from 'react'
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import DescriptionIcon from '@mui/icons-material/Description'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const RoomFilterBar = ({
  filters,
  setFilters,
  onSearchChange,
  onExportExcel,
  onAddRoom,
  counts = {}, // Object containing counts for each status
  columns, // Array of column objects { id, label, visible }
  onToggleColumn
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleCheckboxChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked
    })
  }

  const handleColumnMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleColumnMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
        {/* Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              bgcolor: '#20a9e722',
              p: 1,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2b7ed7'
            }}>
            <HomeIcon />
          </Box>
          <Box sx={{ borderLeft: '3px solid #20a9e7', pl: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
              Quản lý danh sách phòng
            </Typography>
            <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
              Tất cả danh sách phòng
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          

          <IconButton
            onClick={onAddRoom}
            sx={{ bgcolor: '#20a9e7', color: 'white', '&:hover': { bgcolor: '#2b7ed7' }, width: 36, height: 36 }}>
            <AddIcon />
          </IconButton>

          <Button
            variant="contained"
            onClick={handleColumnMenuClick}
            sx={{
              bgcolor: '#212529',
              color: 'white',
              '&:hover': { bgcolor: '#000' },
              textTransform: 'none',
              borderRadius: 1,
              px: 2
            }}
            startIcon={<ViewColumnIcon />}
            endIcon={<ArrowDropDownIcon />}>
            Ẩn/Hiện cột
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleColumnMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {columns &&
              columns.map((col) => (
                <MenuItem key={col.id} onClick={() => onToggleColumn(col.id)} dense>
                  <Checkbox size="small" checked={col.visible} />
                  <Typography variant="body2">{col.label}</Typography>
                </MenuItem>
              ))}
          </Menu>

          <Button
            variant="contained"
            onClick={onExportExcel}
            sx={{
              bgcolor: '#20a9e7',
              color: 'white',
              '&:hover': { bgcolor: '#2b7ed7' },
              textTransform: 'none',
              borderRadius: 1,
              px: 2
            }}
            startIcon={<DescriptionIcon />}>
            Xuất excel
          </Button>
        </Box>
      </Box>

      {/* Filter Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#fafafa',
          p: 1,
          borderRadius: 1,
          border: '1px solid #eeeeee',
          flexWrap: 'wrap',
          gap: 2
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={1} color="info" overlap="circular">
            <FilterAltOutlinedIcon sx={{ color: '#2b7ed7' }} />
          </Badge>

          <FormGroup row sx={{ gap: 2 }}>
            {[
              { name: 'isActive', label: 'Đang ở', color: 'success', count: counts.active || 0 },
              { name: 'isEmpty', label: 'Đang trống', color: 'default', count: counts.empty || 0 },
              { name: 'isReportEnd', label: 'Đang báo kết thúc', color: 'warning', count: counts.reportEnd || 0 },
              { name: 'isIATExpire', label: 'Sắp hết hạn hợp đồng', color: 'warning', count: counts.expire || 0 },
              { name: 'isOverdue', label: 'Đã quá hạn hợp đồng', color: 'error', count: counts.overdue || 0 },
              { name: 'isStake', label: 'Đang cọc giữ chỗ', color: 'primary', count: counts.stake || 0 },
              { name: 'isDebt', label: 'Đang nợ tiền', color: 'error', count: counts.debt || 0 }
            ].map((item) => (
              <Badge
                key={item.name}
                badgeContent={item.count}
                color={item.color === 'default' ? 'secondary' : item.color}
                sx={{
                  '& .MuiBadge-badge': {
                    right: 0,
                    top: 0,
                    fontSize: '0.6rem',
                    height: 16,
                    minWidth: 16
                  }
                }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filters[item.name]}
                      onChange={handleCheckboxChange}
                      name={item.name}
                      sx={{ padding: '0 8px' }}
                    />
                  }
                  label={<Typography variant="caption">{item.label}</Typography>}
                  sx={{ m: 0 }}
                />
              </Badge>
            ))}
          </FormGroup>
        </Box>

        <TextField
          size="small"
          placeholder="Tìm tên phòng..."
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: { bgcolor: 'white', borderRadius: 1, height: 32, fontSize: '0.875rem' }
          }}
          sx={{ minWidth: 200 }}
        />
      </Box>
    </Box>
  )
}

export default RoomFilterBar
