import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { PRIMARY_COLOR, renderAssetIcon, formatCurrency } from './assetConstants.jsx'

const TABLE_HEADERS = [
  '',
  'Tên tài sản',
  'Giá trị nhập vào',
  'Giá trị tài sản',
  'Tổng số lượng',
  'Tổng số đang sử dụng',
  'Tổng số còn dư',
  'Đơn vị',
  'Tình trạng',
  ''
]

const AssetTable = ({ devices, onMenuOpen }) => {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map((header, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{
                    backgroundColor: '#f8f9fa',
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '0.82rem',
                    borderBottom: '2px solid #e0e0e0',
                    whiteSpace: 'nowrap',
                    py: 1.5
                  }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.length > 0 ? (
              devices.map((row, idx) => (
                <TableRow
                  key={row.motel_device_id || idx}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
                    '&:hover': { backgroundColor: '#f0f7ff' },
                    transition: 'background-color 0.15s'
                  }}>
                  {/* Icon */}
                  <TableCell align="center" sx={{ py: 1.2 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        mx: 'auto',
                        backgroundColor: '#20a9e722',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      {renderAssetIcon(row.icon, 22)}
                    </Box>
                  </TableCell>
                  {/* Tên */}
                  <TableCell sx={{ fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>{row.deviceName}</TableCell>
                  {/* Giá trị nhập vào */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem', color: '#555' }}>
                    {formatCurrency(row.valueInput)}
                  </TableCell>
                  {/* Giá trị tài sản */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 600, color: PRIMARY_COLOR }}>
                    {formatCurrency(row.value)}
                  </TableCell>
                  {/* Tổng số lượng */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {row.totalQuantity || 0}
                  </TableCell>
                  {/* Đang sử dụng */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {row.totalUsing || 0}
                  </TableCell>
                  {/* Còn dư */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {row.totalNull || 0}
                  </TableCell>
                  {/* Đơn vị */}
                  <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                    {row.unitLabel}
                  </TableCell>
                  {/* Tình trạng */}
                  <TableCell align="center">
                    <Chip
                      label={row.totalNull > 0 ? 'Đang hoạt động' : 'Hết hàng'}
                      size="small"
                      sx={{
                        backgroundColor: row.totalNull > 0 ? '#20a9e722' : '#ffebee',
                        color: row.totalNull > 0 ? PRIMARY_COLOR : '#e53935',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  {/* Actions */}
                  <TableCell align="center" sx={{ py: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => onMenuOpen(e, row)}
                      sx={{ color: '#999', '&:hover': { color: '#555' } }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                    Không tìm thấy dữ liệu!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default AssetTable
