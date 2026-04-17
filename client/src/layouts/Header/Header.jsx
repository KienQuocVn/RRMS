import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { env } from '~/configs/environment'
import TopBar from './sections/TopBar'
import SearchBarDesktop from './sections/SearchBarDesktop'
import DesktopActionsDesktop from './sections/DesktopActionsDesktop'
import MobileNav from './sections/MobileNav'
import NotificationPanel from './sections/NotificationPanel'
import WarningEmailNotExits from './WarningEmailNotExits'

const Header = ({
  username,
  avatar,
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

  const tokenExists = useMemo(() => sessionStorage.getItem('user') !== null, [])

  const handleLogout = useCallback(async () => {
    const token = sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')).token
      : null

    if (!token) {
      Swal.fire({ icon: 'warning', title: t('header.alerts.noticeTitle'), text: t('header.alerts.tokenMissing') })
      return
    }

    try {
      const response = await fetch(`${env.API_URL}/authen/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        sessionStorage.removeItem('user')
        setToken(null)
        setUsername('')
        setAvatar('')
        navigate('/login')
        Swal.fire({ icon: 'success', title: t('header.alerts.logoutSuccessTitle'), text: t('header.alerts.logoutSuccessText') })
      } else {
        const errorData = await response.json()
        Swal.fire({ icon: 'error', title: t('header.alerts.logoutFailedTitle'), text: `Error: ${errorData.message}` })
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: t('header.alerts.errorTitle'),
        text: t('header.alerts.logoutErrorText')
      })
    }
  }, [navigate, setAvatar, setToken, setUsername, t])

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
