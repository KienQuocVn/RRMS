import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Link
} from '@mui/material'

const RentalHistoryCard = ({ contract }) => {
  const getContractStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Trong thời hạn hợp đồng" color="info" size="small" />
      case 'IATExpire':
        return <Chip label="Sắp hết hạn" color="warning" size="small" />
      default:
        return <Chip label="Đang trống" color="error" size="small" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString))
  }

  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Lịch sử thuê của phòng"
        subheader="Ghi nhận lại các phiên khách ở qua thời kỳ của phòng"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small" aria-label="rental history table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Chủ hợp đồng</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Số điện thoại</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Giá phòng - Giá cọc</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Ngày ký hợp đồng</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Ngày kết thúc hợp đồng</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Trạng thái</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Hành động</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contract?.tenant ? (
                <TableRow hover sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {contract.tenant.fullname}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{contract.tenant.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {contract.price ? contract.price.toLocaleString('vi-VN') : 0}đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contract.deposit ? contract.deposit.toLocaleString('vi-VN') : 0}đ (Cọc)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{contract.createdate || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(contract.closeContract)}</Typography>
                  </TableCell>
                  <TableCell align="center">{getContractStatusChip(contract.status)}</TableCell>
                  <TableCell align="center">
                    <Link href="#" underline="hover" variant="body2">
                      Xem chi tiết
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có lịch sử thuê phòng
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default RentalHistoryCard
