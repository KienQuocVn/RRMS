import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import PieChartIcon from '@mui/icons-material/PieChart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import NavWData from '~/layouts/navbar-admin/NavWData'
import RentalStatusTab from './components/RentalStatusTab'
import FinancialReportTab from './components/FinancialReportTab'

const RentalStatus = ({ setIsAdmin, setIsNavAdmin, isNavAdmin, motels, setmotels }) => {
  const [value, setValue] = useState(0)
  const [username, setUsername] = useState('')

  useEffect(() => {
    setIsAdmin(true)
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const user = userData?.username || ''
    setUsername(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={isNavAdmin}
      />

      {/* Thêm navbar thứ 2 cho trang báo cáo */}
      <Box sx={{ bgcolor: '#eef2f6', borderBottom: '1px solid #e0e0e0' }}>
        <NavWData motels={motels} />
      </Box>
      {/* Custom Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '50px', p: '4px', display: 'flex', gap: 1 }}>
          <Button
            variant={value === 0 ? 'contained' : 'text'}
            onClick={() => setValue(0)}
            sx={{
              borderRadius: '50px',
              bgcolor: value === 0 ? '#20a9e7' : 'transparent',
              color: value === 0 ? '#fff' : '#333',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              '&:hover': { bgcolor: value === 0 ? '#2b7ed7' : '#f5f5f5' }
            }}
            startIcon={<PieChartIcon />}>
            Tình trạng nhà cho thuê
          </Button>
          <Button
            variant={value === 1 ? 'contained' : 'text'}
            onClick={() => setValue(1)}
            sx={{
              borderRadius: '50px',
              bgcolor: value === 1 ? '#20a9e7' : 'transparent',
              color: value === 1 ? '#fff' : '#333',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              '&:hover': { bgcolor: value === 1 ? '#2b7ed7' : '#f5f5f5' }
            }}
            startIcon={<AttachMoneyIcon />}>
            Báo cáo tài chính
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      <Box p={3}>
        {value === 0 && <RentalStatusTab username={username} />}
        {value === 1 && <FinancialReportTab username={username} />}
      </Box>
    </Box>
  )
}

export default RentalStatus
