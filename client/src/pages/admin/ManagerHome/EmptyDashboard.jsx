import { useState } from 'react'
import { Box, Typography, Button, Paper, Container } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ModalCreateMotel from './ModalCreateMotel'

const EmptyDashboard = () => {
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null
  const [selectedMotelId, setSelectedMotelId] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {
    setSelectedMotelId('Create')
    setOpenModal(true)
  }

  return (
    <Box sx={{ p: 3, minHeight: 'calc(100vh - 80px)' }}>
      <Paper elevation={0} sx={{ borderRadius: 3, p: 4, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Box
            component="img"
            src="/empty-box.webp"
            alt="Empty Box"
            sx={{ width: 200, height: 'auto', mb: 3 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
            Bạn chưa có tòa nhà cho thuê nào! Vui lòng thêm nhà trọ trước khi tiếp tục.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Với thiết kế đơn giản - thân thiện - dễ sử dụng. Quản lý nhà trọ của bạn dễ hơn bao giờ hết.
          </Typography>
        </Box>

        {/* Getting Started Section */}
        <Container maxWidth="md">
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundImage: 'url(/building.webp)',
              backgroundPosition: 'right 10% bottom',
              backgroundSize: { xs: '0%', md: '30%' }, // Hide image on small screens
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#cde9f1',
              borderRadius: 4,
              p: 5,
              position: 'relative',
              overflow: 'hidden'
            }}>
            
            <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
              <Typography variant="h4" fontWeight="bold" color="primary.dark" gutterBottom>
                Bắt đầu tạo nhà cho thuê của bạn
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Để nhập nhanh hơn hãy bắt đầu nhập từ tập tin Excel
              </Typography>

              <Box component="ul" sx={{ pl: 2, mb: 4, color: 'text.secondary' }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Bước 1: Tải file mẫu
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Bước 2: Nhập dữ liệu của bạn vào file mẫu
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Bước 3: Upload file mẫu lên để nhập liệu
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  boxShadow: 3
                }}>
                Tạo nhà trọ đầu tiên
              </Button>
            </Box>
          </Paper>
        </Container>
      </Paper>

      {/* modal create motel */}
      <ModalCreateMotel 
        username={username} 
        MotelId={selectedMotelId} 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
      />
    </Box>
  )
}

export default EmptyDashboard
