import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, Button, Typography } from '@mui/material'

const IncomeSummaryHeader = ({ motelName, onImportClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 1.5,
        flexWrap: 'wrap'
      }}>
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
          Khoản thu / chi - tổng kết {motelName || 'Nhà trọ'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
          Bạn sẽ thống kê được các khoản thu / chi qua hàng tháng, quý, năm.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<DescriptionOutlinedIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={onImportClick}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          backgroundColor: '#20a9e7',
          boxShadow: '0 10px 24px rgba(98, 178, 70, 0.22)',
          '&:hover': {
            backgroundColor: '#2b7ed7'
          }
        }}>
        Import thu/chi
      </Button>
    </Box>
  )
}

export default IncomeSummaryHeader
