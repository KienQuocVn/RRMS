import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, Suspense, useRef, useMemo, useCallback, useState } from 'react'
import Header from './layouts/Header/Header'
import Footer from './layouts/Footer/Footer'
import { getMotelByUsername } from './apis/motelAPI'
import httpClient from './apis/httpClient'
import i18n from './i18n/i18n'
import { Box, CircularProgress } from '@mui/material'
import { getProfileByUsername } from './apis/accountAPI'
import ErrorBoundary from './components/ErrorBoundary'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { MotelProvider } from './contexts/MotelContext'
import { useAuth } from './hooks/useAuth'
import { useMotel } from './hooks/useMotel'
import { normalizeProfileResponse } from './apis/profileAPI'
import ChatAI from './pages/AI/ChatAI.jsx'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx'

function AppShell() {
  const location = useLocation()
  const auth = useAuth()
  const motel = useMotel()
  const { username, setUsername, avatar, setAvatar, account, setAccount, token, setToken, isAdmin } = auth
  const { motels, setMotels } = motel
  const lastFetchedUsernameRef = useRef(null)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('language')
    const activeLanguage = storedLanguage || i18n.resolvedLanguage || i18n.language || 'vi'
    return activeLanguage.startsWith('vi') ? 'vi' : 'en'
  })
  const authRoutesWithoutChrome = ['/login', '/register', '/forgot-password']
  const shouldHidePublicChrome =
    authRoutesWithoutChrome.includes(location.pathname) ||
    location.pathname.toLowerCase().startsWith('/residenceform')

  const fetchMotelsByUsername = useCallback(async (targetUsername, role) => {
    try {
      if (['EMPLOYEE', 'CUSTOMER'].includes(role?.[0] ?? role)) {
        const profileResponse = await getProfileByUsername(targetUsername)
        const profile = normalizeProfileResponse(profileResponse ?? {})
        const userEmail = profile.email
        const rentalResponse = await httpClient.get('/contracts/account/me')
        const contracts = rentalResponse?.data?.result ?? rentalResponse?.data ?? []
        const rentals = await Promise.all((Array.isArray(contracts) ? contracts : [contracts])
          .filter((contract) => contract?.tenant?.email === userEmail && ['ACTIVE', 'EXPIRING', 'TERMINATED'].includes(contract.status))
          .map(async (contract) => {
            const room = contract.room ?? {}
            const tenant = contract.tenant ?? {}
            let motel = {}
            try {
              const motelResponse = await getMotelByUsername(contract.username?.username)
              motel = motelResponse?.data?.result?.find((item) => item.motelId === room.motelId) ?? {}
            } catch { /* Contract and room remain usable if owner motel details are unavailable. */ }
            const owner = motel.account ?? contract.username ?? {}
            const address = tenant.motelAddress ?? tenant.address ?? motel.address
            const normalizedRoom = {
              ...room,
              roomName: room.name,
              address,
              motelName: motel.motelName,
              ownerName: tenant.hostName ?? owner.fullName,
              ownerPhone: owner.phone,
              ownerEmail: owner.email,
              ownerAvatar: owner.avatar,
              startDate: contract.moveInDate,
              floor: room.group,
              maxPeople: contract.countTenant
            }
            return {
              ...motel,
              motelId: room.motelId ?? motel.motelId,
              address,
              ownerName: tenant.hostName ?? owner.fullName,
              ownerPhone: owner.phone,
              ownerEmail: owner.email,
              ownerAvatar: owner.avatar,
              roomId: room.roomId,
              room: normalizedRoom,
              contract
            }
          }))
        setMotels(rentals)
        return
      }

      const res = await getMotelByUsername(targetUsername)
      setMotels(res.data.result ?? [])
    } catch (err) {
      // 403 = user không phải chủ trọ hoặc chưa có motel → bỏ qua
      console.error('fetchMotelsByUsername error:', err?.response?.status, err?.response?.data ?? err?.message)
      setMotels([])
    }
  }, [setMotels])

  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(newLanguage)
  }, [currentLanguage])

  useEffect(() => {
    const normalizedLanguage = currentLanguage.startsWith('vi') ? 'vi' : 'en'

    if ((i18n.resolvedLanguage || i18n.language) !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage)
    }

    localStorage.setItem('language', normalizedLanguage)
  }, [currentLanguage])

  useEffect(() => {
    const handleLanguageChanged = (language) => {
      setCurrentLanguage(language?.startsWith('vi') ? 'vi' : 'en')
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (!storedUser) {
      lastFetchedUsernameRef.current = null
      setAccount(undefined)
      return
    }

    const user = JSON.parse(storedUser)
    if (!user?.username) {
      lastFetchedUsernameRef.current = null
      setAccount(undefined)
      return
    }

    setUsername(user.displayName || user.username)
    setAvatar(user.avatar)
    setToken(user.token)

    if (lastFetchedUsernameRef.current === user.username) return

    lastFetchedUsernameRef.current = user.username
    fetchMotelsByUsername(user.username, user.roles?.[0])
    getProfileByUsername(user.username).then((accountResponse) => {
      const profile = normalizeProfileResponse(accountResponse ?? {})
      setAccount(profile)
    })
  }, [fetchMotelsByUsername, location.pathname, setAccount, setAvatar, setToken, setUsername])

  const routeContext = useMemo(() => ({ auth, motel }), [auth, motel])

  return (
    <Box>
      {!isAdmin && !shouldHidePublicChrome ? <ChatAI /> : null}
      {!isAdmin && !shouldHidePublicChrome ? (
        <Header
          account={account}
          username={username}
          avatar={avatar}
          token={token}
          setUsername={setUsername}
          setAvatar={setAvatar}
          setToken={setToken}
          toggleLanguage={toggleLanguage}
          currentLanguage={currentLanguage}
          motelId={motels[0]?.motelId}
        />
      ) : null}
      <ErrorBoundary>
        <Suspense
          fallback={
            <Box sx={{ width: '100%', py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            {PublicRoutes({ auth: routeContext.auth })}
            {AdminRoutes({ auth: routeContext.auth, motel: routeContext.motel })}
            <Route path="*" element={<NotFoundPage styled />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {!isAdmin && !shouldHidePublicChrome ? <Footer /> : null}
    </Box>
  )
}

function App() {
  return (
    <AuthProvider>
      <MotelProvider>
        <AppShell />
      </MotelProvider>
    </AuthProvider>
  )
}

export default App
