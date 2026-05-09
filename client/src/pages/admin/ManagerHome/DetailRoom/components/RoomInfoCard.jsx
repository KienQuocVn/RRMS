import { Card, CardContent, CardHeader, Typography, Grid, Chip, Divider, Box } from '@mui/material'

const RoomInfoCard = ({ room, contract }) => {
  if (!room) return null

  const getContractStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Đang ở" color="success" size="small" />
      case 'IATExpire':
        return <Chip label="Sắp hết hạn" color="warning" size="small" />
      default:
        return <Chip label="Đang trống" color="error" size="small" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định'
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString))
  }

  const infoRows = [
    { label: 'Tên phòng', value: room.name || 'N/A' },
    { label: 'Nhóm phòng', value: room.group || 'N/A' },
    { label: 'Giá thuê', value: room.price ? `${room.price.toLocaleString('vi-VN')}đ` : 'N/A' },
    { label: 'Diện tích', value: `${room.area || 0} m2` },
    { label: 'Ưu tiên', value: room.prioritize || 'N/A' },
    { label: 'Ngày lập hóa đơn', value: `Ngày ${room.invoiceDate || 'N/A'}` },
    { label: 'Ngày vào ở', value: formatDate(contract?.moveinDate) },
    { label: 'Thời hạn hợp đồng', value: formatDate(contract?.closeContract) },
    { label: 'Trạng thái', value: getContractStatusChip(contract?.status) },
    {
      label: 'Trạng thái tài chính',
      value:
        room.finance === 'wait' ? (
          <Chip label="Chờ kỳ thu tới" color="success" size="small" />
        ) : (
          <Typography variant="body2">Không xác định</Typography>
        )
    }
  ]

  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Thông tin phòng"
        subheader="Thông tin chi tiết của phòng"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {infoRows.map((row, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {row.label}
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {row.value}
                </Typography>
              </Box>
              {index < infoRows.length - 1 && <Divider sx={{ mt: 1, borderStyle: 'dashed' }} />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default RoomInfoCard
