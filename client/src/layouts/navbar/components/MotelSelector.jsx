import { Box, Button } from '@mui/material'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

const MotelSelector = ({ motelName = 'Nhà trọ RRMS' }) => (
  <Button
    variant="contained"
    sx={{
      bgcolor: 'white',
      height: 100,
      color: 'black',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      textTransform: 'none',
      '&:hover': { bgcolor: '#f5f5f5' },
    }}
  >
    <Box
      sx={{
        background: '#5eb7ff',
        borderRadius: '50%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 1,
        flexShrink: 0,
      }}
    >
      <HomeWorkIcon sx={{ color: 'white' }} />
    </Box>
    <Box sx={{ textAlign: 'left' }}>
      Đang quản lý
      <br />
      <b style={{ color: '#5eb7ff' }}>{motelName}</b>
    </Box>
  </Button>
)

export default MotelSelector
