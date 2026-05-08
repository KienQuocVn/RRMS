import { Turnstile } from '@marsidev/react-turnstile'
import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import { ValidCaptchaAPI } from '~/apis/captchaAPI'

import { env } from '~/configs/environment'

const ValidCaptcha = ({ setValidCaptcha, resetSignal = 0 }) => {
  const turnstileRef = useRef(null)
  const captchaLanguage = navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en'

  const clearCaptchaState = () => {
    setValidCaptcha(false)
  }

  const handleCaptchaError = () => {
    clearCaptchaState()
    return true
  }

  const resetCaptcha = () => {
    clearCaptchaState()
    turnstileRef.current?.reset?.()
  }

  useEffect(() => {
    if (resetSignal > 0) {
      setValidCaptcha(false)
      turnstileRef.current?.reset?.()
    }
  }, [resetSignal, setValidCaptcha])

  const handleTokenReceived = async (token) => {
    try {
      const response = await ValidCaptchaAPI(token)
      const success = response?.data?.success === true
      setValidCaptcha(success)
      if (success) {
        console.log('CAPTCHA passed!')
      } else {
        console.log('CAPTCHA failed. Try again.')
        resetCaptcha()
      }
    } catch (error) {
      console.error('Error verifying CAPTCHA:', error)
      resetCaptcha()
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Turnstile
        ref={turnstileRef}
        siteKey={env.SITE_KEY}
        options={{
          theme: 'light',
          action: 'login',
          execution: 'render',
          language: captchaLanguage,
          retry: 'never'
        }}
        onSuccess={(token) => handleTokenReceived(token)}
        onError={handleCaptchaError}
        onExpire={clearCaptchaState}
      />
    </Box>
  )
}

export default ValidCaptcha
