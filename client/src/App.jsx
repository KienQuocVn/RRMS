import { Routes, useLocation } from 'react-router-dom'
import { useEffect, Suspense, useRef, useMemo, useCallback } from 'react'
import Header from './layouts/Header/Header'
import Footer from './layouts/Footer/Footer'
import { getMotelByUsername } from './apis/motelAPI'
import i18n from './i18n/i18n'
import { Box, CircularProgress } from '@mui/material'
import { getAccountByUsername } from './apis/accountAPI'
import ErrorBoundary from './components/ErrorBoundary'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { MotelProvider } from './contexts/MotelContext'
import { useAuth } from './hooks/useAuth'
import { useMotel } from './hooks/useMotel'

function AppShell() {
  const location = useLocation()
  const auth = useAuth()
  const motel = useMotel()
  const { username, setUsername, avatar, setAvatar, account, setAccount, token, setToken, isAdmin } = auth
  const { motels, setMotels } = motel
  const lastFetchedUsernameRef = useRef(null)
  const languageRef = useRef(localStorage.getItem('language') || i18n.language)
  const authRoutesWithoutChrome = ['/login', '/register', '/forgot-password']
  const shouldHidePublicChrome = authRoutesWithoutChrome.includes(location.pathname)

  const fetchMotelsByUsername = useCallback(async (targetUsername) => {
    getMotelByUsername(targetUsername).then((res) => {
      setMotels(res.data.result)
    })
  }, [setMotels])

  const toggleLanguage = () => {
    const newLanguage = languageRef.current === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(newLanguage)
    languageRef.current = newLanguage
    localStorage.setItem('language', newLanguage)
  }

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (!storedUser) return

    const user = JSON.parse(storedUser)
    if (!user?.username) return

    setUsername(user.username)
    setAvatar(user.avatar)
    setToken(user.token)

    if (lastFetchedUsernameRef.current === user.username) return

    lastFetchedUsernameRef.current = user.username
    getAccountByUsername(user.username).then((res) => {
      setAccount(res.data)
    })
    fetchMotelsByUsername(user.username)
  }, [fetchMotelsByUsername, location.pathname, setAccount, setAvatar, setToken, setUsername])

  const routeContext = useMemo(() => ({ auth, motel }), [auth, motel])

  return (
    <Box>
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
          currentLanguage={languageRef.current}
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
