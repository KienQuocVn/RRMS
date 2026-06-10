/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileByUsername } from '~/apis/accountAPI'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { Box, Container, Typography, CircularProgress } from '@mui/material'

import AccountHeader from './components/AccountHeader'
import AccountTabs from './components/AccountTabs'
import AccountInfoTab from './components/AccountInfoTab'
import LoginDevicesTab from './components/LoginDevicesTab'

const ManagerMyAccount = ({ setIsAdmin, TaiKhoan, motels, setmotels }) => {
  const [account, setAccount] = useState({})
  const [loading, setLoading] = useState(true)
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
    if (!username) return
    setLoading(true)
    try {
      const accountResponse = await getProfileByUsername(username)
      setAccount(accountResponse ?? {})
    } catch (error) {
      console.error('Error fetching account:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Callback khi AccountInfoTab lưu thành công → cập nhật state account
   * để AccountHeader re-render ngay mà không cần fetch lại
   */
  const handleAccountUpdated = (updatedAccount) => {
    if (updatedAccount) {
      setAccount((prev) => ({ ...prev, ...updatedAccount }))
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <AccountHeader account={account} />
            <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 0 && (
              <AccountInfoTab
                account={account}
                onAccountUpdated={handleAccountUpdated}
              />
            )}

            {activeTab === 1 && (
              <LoginDevicesTab username={TaiKhoan} />
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default ManagerMyAccount
