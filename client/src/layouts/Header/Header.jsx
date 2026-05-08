import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { getStoredAuthUser, logout as logoutRequest } from '~/apis/accountAPI'
import TopBar from './sections/TopBar'
import SearchBarDesktop from './sections/SearchBarDesktop'
import DesktopActionsDesktop from './sections/DesktopActionsDesktop'
import MobileNav from './sections/MobileNav'
import NotificationPanel from './sections/NotificationPanel'
import WarningEmailNotExits from './WarningEmailNotExits'

const Header = ({
  username,
  avatar,
  token,
  setUsername,
  setAvatar,
  setToken,
  toggleLanguage,
  currentLanguage,
  motelId,
  account
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false)

  const tokenExists = Boolean(token)

  const resetClientSession = useCallback(() => {
    sessionStorage.removeItem('user')
    setToken(null)
    setUsername('')
    setAvatar('')
  }, [setAvatar, setToken, setUsername])

  const handleLogout = useCallback(async () => {
    const storedUser = getStoredAuthUser()
    const nextToken = storedUser?.token ?? token ?? null

    if (!nextToken) {
      resetClientSession()
      navigate('/login')
      Swal.fire({ icon: 'warning', title: t('header.alerts.noticeTitle'), text: t('header.alerts.tokenMissing') })
      return
    }

    try {
      const response = await logoutRequest(nextToken)
      resetClientSession()
      navigate('/login')
      Swal.fire({
        icon: 'success',
        title: t('header.alerts.logoutSuccessTitle'),
        text: response?.message || t('header.alerts.logoutSuccessText')
      })
    } catch (error) {
      if (error?.response?.status === 401) {
        resetClientSession()
        navigate('/login')
        Swal.fire({
          icon: 'success',
          title: t('header.alerts.logoutSuccessTitle'),
          text: t('header.alerts.logoutSuccessText')
        })
        return
      }

      Swal.fire({
        icon: 'error',
        title: t('header.alerts.logoutFailedTitle'),
        text: error?.response?.data?.message || t('header.alerts.logoutErrorText')
      })
    }
  }, [navigate, resetClientSession, t, token])

  return (
    <Box component="header" sx={{ fontFamily: 'Helvetica, Arial, Roboto, sans-serif' }}>
      <TopBar />

      <Box
        sx={{
          bgcolor: theme.palette.mode === 'light' ? '#fff' : '#1f1f1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'sticky',
          top: { xs: 0, md: 40 },
          zIndex: 100
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1440,
            minWidth: 320,
            minHeight: { xs: 56, md: 76 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            py: { xs: 0.75, md: 1.25 },
            gap: { md: 2 }
          }}
        >
          <SearchBarDesktop />

          <DesktopActionsDesktop
            username={username}
            avatar={avatar}
            motelId={motelId}
            tokenExists={tokenExists}
            onLogout={handleLogout}
            toggleLanguage={toggleLanguage}
            currentLanguage={currentLanguage}
          />
        </Box>
      </Box>

      {account?.email || !account ? null : <WarningEmailNotExits />}

      {isNotifyOpen && <NotificationPanel />}

      <MobileNav
        isNotifyOpen={isNotifyOpen}
        setIsNotifyOpen={setIsNotifyOpen}
        isMobileAccountOpen={isMobileAccountOpen}
        setIsMobileAccountOpen={setIsMobileAccountOpen}
      />
    </Box>
  )
}

export default memo(Header)
