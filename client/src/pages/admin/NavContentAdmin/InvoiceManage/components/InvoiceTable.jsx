import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Colors } from '~/theme'
import EmptyInvoiceState from './EmptyInvoiceState'

const cellBorder = { borderRight: '1px solid #eeeeee' }

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0 đ'
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const getStatusChip = (status) => {
  if (status === 'Đã thu xong') {
    return (
      <Chip
        label={status}
        sx={{ bgcolor: '#7dc242', color: '#fff', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  }
  if (status === 'Đã bị hủy') {
    return (
      <Chip
        label={status}
        sx={{ bgcolor: '#B0B0B0', color: '#fff', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  }
  return (
    <Chip
      label={status || 'Chưa thu'}
      sx={{ bgcolor: '#ED6004', color: '#fff', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
    />
  )
}

const getAvatarColor = (status) => {
  if (status === 'Đã thu xong') return Colors.success
  if (status === 'Đã bị hủy') return '#bdbdbd'
  return '#ED6004'
}

const InvoiceTable = ({ data, services = [], onActionClick }) => {
  if (data.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <EmptyInvoiceState />
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 380px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#fff', width: 72 }} />
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Tên phòng
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Tiền phòng
              </TableCell>
              {services.map((serviceName) => (
                <TableCell
                  key={serviceName}
                  align="center"
                  sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                  {serviceName}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Thu/Trả cọc
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Cộng thêm/Giảm trừ
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Tổng cộng
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Cần thu
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', ...cellBorder }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ bgcolor: '#fff', width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover key={row.invoiceId} sx={{ bgcolor: index % 2 === 0 ? '#fff5f2' : '#ffffff' }}>
                <TableCell sx={cellBorder}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MenuIcon sx={{ color: 'action.active', fontSize: 20 }} />
                    <Avatar sx={{ width: 24, height: 24, bgcolor: getAvatarColor(row.status) }}>
                      <ReceiptIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                  </Box>
                </TableCell>

                <TableCell sx={cellBorder}>
                  <Typography variant="body2" fontWeight="bold">
                    {row.roomName}
                  </Typography>
                </TableCell>

                <TableCell sx={cellBorder}>
                  <Typography variant="caption" fontWeight="bold" display="block">
                    {formatCurrency(row.roomPrice)}
                  </Typography>
                </TableCell>

                {services.map((serviceName) => (
                  <TableCell key={`${row.invoiceId}-${serviceName}`} align="center" sx={cellBorder}>
                    <Typography variant="caption" fontWeight="bold">
                      {formatCurrency(row[serviceName])}
                    </Typography>
                  </TableCell>
                ))}

                <TableCell sx={cellBorder}>
                  <Typography variant="caption" fontWeight="bold">
                    {formatCurrency(row.deposit)}
                  </Typography>
                </TableCell>

                <TableCell sx={cellBorder}>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color={Number(row.adjustments) < 0 ? 'error.main' : 'text.primary'}>
                    {formatCurrency(row.adjustments)}
                  </Typography>
                </TableCell>

                <TableCell sx={cellBorder}>
                  <Typography variant="caption" fontWeight="bold">
                    {formatCurrency(row.total)}
                  </Typography>
                </TableCell>

                <TableCell sx={cellBorder}>
                  <Typography variant="caption" fontWeight="bold" color="primary">
                    {formatCurrency(row.total)}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={cellBorder}>
                  {getStatusChip(row.status)}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => onActionClick(e, row.invoiceId)}
                    sx={{ border: '1px solid #e0e0e0', p: 0.5 }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default InvoiceTable
