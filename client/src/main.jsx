import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'react-toastify/dist/ReactToastify.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import theme from './theme.js'
import './i18n/i18n.js'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { env } from './configs/environment.js'

const appContent = (
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  </>
)

createRoot(document.getElementById('root')).render(
  env.GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>{appContent}</GoogleOAuthProvider>
  ) : (
    appContent
  )
)
