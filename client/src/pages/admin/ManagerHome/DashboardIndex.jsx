/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Box } from '@mui/material'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import EmptyDashboard from './EmptyDashboard'
import MotelDashboard from './MotelDashboard/MotelDashboard'
import './Admin.css'

const DashboardIndex = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  useEffect(() => {
    setIsAdmin(true)
  }, [])

  return (
    <Box sx={{ backgroundColor: '#e4eef5', minHeight: '100vh' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />
      {motels.length === 0 ? <EmptyDashboard /> : <MotelDashboard Motel={motels} />}
    </Box>
  )
}

export default DashboardIndex
