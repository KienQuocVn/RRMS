/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAccountByUsername } from '~/apis/accountAPI'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { Box, Container, Typography } from '@mui/material'

import AccountHeader from './components/AccountHeader'
import AccountTabs from './components/AccountTabs'
import AccountInfoTab from './components/AccountInfoTab'
import LoginDevicesTab from './components/LoginDevicesTab'

const ManagerMyAccount = ({ setIsAdmin, TaiKhoan, motels, setmotels }) => {
  const [account, setAccount] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const { motelId } = useParams()

  useEffect(() => {
    setIsAdmin(true)
    fetchAccountByUsername(TaiKhoan)
  }, [TaiKhoan])

  useEffect(() => {
    if (!motelId && motels?.[0]?.motelId) {
      navigate(`/tai-khoan/${motels[0].motelId}`, { replace: true })
    }
  }, [motelId, motels, navigate])

  const fetchAccountByUsername = async (username) => {
    try {
      const accountResponse = await getAccountByUsername(username)
      setAccount(accountResponse ?? {})
    } catch (error) {
      console.error('Error fetching account:', error)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh', pb: 5 }}>
      <NavAdmin setIsAdmin={setIsAdmin} motels={motels} setmotels={setmotels} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Tài khoản
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các thiết lập tài khoản
          </Typography>
        </Box>

        <AccountHeader account={account} />
        <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 0 && <AccountInfoTab account={account} />}
        {activeTab === 1 && <LoginDevicesTab />}
      </Container>
    </Box>
  )
}

export default ManagerMyAccount
