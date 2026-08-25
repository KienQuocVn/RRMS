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

const RoomServicesCard = ({ roomServices }) => {
  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Dịch vụ sử dụng"
        subheader="Danh sách dịch vụ sử dụng"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small" aria-label="room services table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Tên dịch vụ
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Chỉ số
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Loại
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Đơn giá
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomServices && roomServices.length > 0 ? (
                roomServices.map((roomService, index) => {
                  const service = roomService?.service || roomService || {}
                  const chargetype = service?.chargetype || roomService?.chargetype || 'Lần'
                  const unit = chargetype === 'Theo người' ? 'người' : chargetype
                  const nameService = service?.nameService || roomService?.nameService || 'Dịch vụ'
                  const price = service?.price ?? roomService?.price ?? 0
                  const quantity = roomService?.quantity ?? 1

                  return (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {nameService}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {quantity} {unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          Cố định
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="500" color="primary">
                          {price.toLocaleString('vi-VN')}đ/{unit}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Không có dịch vụ nào
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

export default RoomServicesCard
