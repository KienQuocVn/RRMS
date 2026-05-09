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
  Paper
} from '@mui/material'

const InvoiceHistoryCard = () => {
  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Lịch sử hóa đơn"
        subheader="Lịch sử thu tiền của phòng"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small" aria-label="invoice history table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Thông tin khách</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Tháng lập phiếu</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Tiền phòng</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Thu/Trả tiền cọc</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Tiền dịch vụ</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Cộng thêm - giảm trừ</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Tổng tiền</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Tổng đã trả</Typography></TableCell>
                <TableCell><Typography variant="subtitle2" fontWeight="bold">Ngày tạo & Trạng thái</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch sử hóa đơn
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default InvoiceHistoryCard
