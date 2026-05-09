import { Card, CardContent, CardHeader, Typography, Divider, Box, Avatar, Chip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const TenantListCard = ({ contract }) => {
  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Danh sách khách thuê"
        subheader="Thông tin khách thuê của phòng"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent>
        {contract?.tenant ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
            data-bs-toggle="modal"
            data-bs-target="#addCustomer" // Keeping the original bootstrap modal trigger if needed
          >
            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {contract.tenant.fullname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contract.tenant.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Chip label="Người liên hệ" color="info" size="small" />
              <Chip label="Đại diện hợp đồng" color="success" size="small" />
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            Chưa có khách thuê
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default TenantListCard
