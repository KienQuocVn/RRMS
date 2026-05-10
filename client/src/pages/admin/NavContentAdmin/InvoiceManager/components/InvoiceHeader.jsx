import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import PrintIcon from '@mui/icons-material/Print'
import TableViewIcon from '@mui/icons-material/TableView'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useState } from 'react'

const PRIMARY = '#20a9e7'
const PRIMARY_DARK = '#1792ca'
const GREEN = '#43a047'
const GREEN_DARK = '#388e3c'
const AMBER = '#f59e0b'
const AMBER_DARK = '#d97706'

const InvoiceHeader = ({ selectedMonth, selectedYear, onCreateInvoice }) => {
  const [anchorElExcel, setAnchorElExcel] = useState(null)
  const openExcel = Boolean(anchorElExcel)

  const handleExcelClick = (e) => setAnchorElExcel(e.currentTarget)
  const handleExcelClose = () => setAnchorElExcel(null)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        mb: 1.5,
      }}
    >
      {/* Left: Title */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem', lineHeight: 1.3 }}
        >
          Tất cả hóa đơn -{' '}
          <Box component="span" sx={{ color: PRIMARY }}>
            {String(selectedMonth).padStart(2, '0')}/{selectedYear}
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: '#777', fontStyle: 'italic' }}>
          Tất cả hóa đơn thu tiền nhà xuất hiện ở đây
        </Typography>
      </Box>

      {/* Right: Action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* Add button */}
        <Tooltip title="Tạo hóa đơn mới" placement="top">
          <IconButton
            onClick={onCreateInvoice}
            sx={{
              backgroundColor: '#20a9e7',
              color: '#fff',
              width: 42,
              height: 42,
              '&:hover': { backgroundColor: '#1791c8' },
              boxShadow: '0 2px 8px rgba(67,160,71,0.4)',
            }}
          >
            <AddIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>

        {/* Cài đặt hóa đơn */}
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          sx={{
            backgroundColor: '#20a9e7',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.82rem',
            px: 2,
            py: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
            '&:hover': { backgroundColor: '#1791c8' },
          }}
        >
          Cài đặt hóa đơn
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* In hóa đơn */}
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: '#20a9e7',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.82rem',
            px: 2,
            py: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
            '&:hover': { backgroundColor: '#1791c8' },
          }}
        >
          In h.đơn
        </Button>

        {/* Xuất Excel (dropdown) */}
        <ButtonGroup
          variant="contained"
          sx={{
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Button
            startIcon={<TableViewIcon />}
            sx={{
              backgroundColor: AMBER,
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              px: 2,
              py: 1,
              '&:hover': { backgroundColor: AMBER_DARK },
              border: 'none',
            }}
          >
            Xuất excel
          </Button>
          <Button
            size="small"
            onClick={handleExcelClick}
            sx={{
              backgroundColor: AMBER,
              color: '#fff',
              px: 0.5,
              minWidth: '32px',
              '&:hover': { backgroundColor: AMBER_DARK },
              border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.3) !important',
            }}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Menu
          anchorEl={anchorElExcel}
          open={openExcel}
          onClose={handleExcelClose}
          PaperProps={{
            sx: { borderRadius: '10px', minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
          }}
        >
          <MenuItem
            onClick={handleExcelClose}
            sx={{ fontSize: '0.85rem', gap: 1 }}
          >
            <TableViewIcon fontSize="small" sx={{ color: AMBER }} />
            Xuất excel (Rút gọn)
          </MenuItem>
          <MenuItem
            onClick={handleExcelClose}
            sx={{ fontSize: '0.85rem', gap: 1 }}
          >
            <TableViewIcon fontSize="small" sx={{ color: AMBER }} />
            Xuất excel (Đầy đủ)
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}

export default InvoiceHeader
