import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useState } from 'react'

const headerCellStyles = {
  fontWeight: 700,
  color: '#101828',
  backgroundColor: '#f8fafc',
  borderColor: '#d8e1eb'
}

const bodyCellStyles = {
  verticalAlign: 'top',
  color: '#344054',
  borderColor: '#eaecf0'
}

const emptyStateStyles = {
  py: 8,
  textAlign: 'center'
}

const renderStatusChip = (status) => {
  const isSuccess = status === 'success'

  return (
    <Chip
      size="small"
      label={isSuccess ? 'Thành công' : 'Xảy ra lỗi'}
      sx={{
        fontWeight: 700,
        backgroundColor: isSuccess ? '#20a9e7' : '#ef4444',
        color: '#fff'
      }}
    />
  )
}

const ZaloHistoryTable = ({ rows, onOpenDetails, onOpenReceipt, onOpenExpense }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden', borderColor: '#d8e1eb' }}>
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader sx={{ minWidth: 1280 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellStyles, width: 74 }} />
              <TableCell sx={{ ...headerCellStyles, minWidth: 170 }}>Phòng</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 150 }}>Số điện thoại</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 420 }}>Mô tả</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 100 }}>Tháng</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 160 }}>Thời gian gửi</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 120 }}>Trạng thái</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 150 }}>Ngày thanh toán</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 100 }}>Loại hình</TableCell>
              <TableCell sx={{ ...headerCellStyles, width: 110, textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} sx={emptyStateStyles}>
                  <Stack spacing={1} alignItems="center">
                    <PaymentsOutlinedIcon sx={{ fontSize: 30, color: '#98a2b3' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344054' }}>
                      Không có lịch sử gửi Zalo phù hợp
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#667085' }}>
                      Hãy thử đổi bộ lọc hoặc chọn một tháng khác.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}

            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={bodyCellStyles}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <LocalMallOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                </TableCell>

                <TableCell sx={bodyCellStyles}>
                  <Typography sx={{ color: '#101828', fontWeight: 500 }}>{row.roomName}</Typography>
                </TableCell>

                <TableCell sx={bodyCellStyles}>
                  <Typography sx={{ color: '#101828', fontWeight: 700 }}>{row.phone}</Typography>
                </TableCell>

                <TableCell sx={bodyCellStyles}>
                  <Typography sx={{ color: '#344054' }}>{row.description}</Typography>
                  {row.detail ? (
                    <Typography sx={{ color: '#ef4444', fontStyle: 'italic', mt: 0.25 }}>{row.detail}</Typography>
                  ) : null}
                </TableCell>

                <TableCell sx={bodyCellStyles}>
                  {row.month}/{row.year}
                </TableCell>

                <TableCell sx={bodyCellStyles}>{row.sentAt}</TableCell>

                <TableCell sx={bodyCellStyles}>{renderStatusChip(row.status)}</TableCell>

                <TableCell sx={bodyCellStyles}>
                  <Typography sx={{ color: row.paymentDate === 'Chưa thanh toán' ? '#ef4444' : '#98a2b3' }}>
                    {row.paymentDate}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellStyles}>
                  <Chip
                    size="small"
                    label={row.billingType}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#20a9e7',
                      color: '#fff'
                    }}
                  />
                </TableCell>

                <TableCell sx={{ ...bodyCellStyles, textAlign: 'center' }}>
                  <IconButton onClick={(event) => handleMenuOpen(event, row)}>
                    <MoreVertRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 210
          }
        }}>
        <MenuItem
          onClick={() => {
            onOpenDetails(selectedRow)
            handleMenuClose()
          }}>
          <VisibilityOutlinedIcon sx={{ mr: 1.25, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() => {
            onOpenReceipt(selectedRow)
            handleMenuClose()
          }}>
          <ReceiptLongOutlinedIcon sx={{ mr: 1.25, fontSize: 18 }} />
          Thêm phiếu thu
        </MenuItem>
        <MenuItem
          onClick={() => {
            onOpenExpense(selectedRow)
            handleMenuClose()
          }}>
          <PaymentsOutlinedIcon sx={{ mr: 1.25, fontSize: 18 }} />
          Thêm phiếu chi
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default ZaloHistoryTable
