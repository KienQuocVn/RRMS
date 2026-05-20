import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useGoogleLogin } from '@react-oauth/google'
import { env } from '~/configs/environment'

export const useLogin = ({ setUsername, setAvatar }) => {
  const LOGIN_ENDPOINT = `${env.API_URL}/authen/login`
  const SOCIAL_LOGIN_ENDPOINT = `${env.API_URL}/authen/social-login`
  const GOOGLE_USER_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo'
  const { t } = useTranslation()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [validCaptcha, setValidCaptcha] = useState(false)
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const navigate = useNavigate()

  const showError = (text) => Swal.fire({ icon: 'error', title: t('auth.login.alerts.errorTitle'), text })

  const resetCaptcha = () => {
    setValidCaptcha(false)
    setCaptchaResetKey((previous) => previous + 1)
  }

  const saveSessionAndNavigate = ({ phone, username, fullName, avatar, token, roles }) => {
    const displayName = fullName?.trim() || username

    sessionStorage.setItem(
      'user',
      JSON.stringify({
        phone,
        username,
        displayName,
        avatar,
        token,
        roles
      })
    )

    setUsername(displayName)
    setAvatar(avatar)
    resetCaptcha()
    navigate('/RRMS')
  }

  const handleLoginSuccess = (result) => {
    const { username, fullName, phone, avatar, token, roles } = result || {}

    if (!username) {
      throw new Error(t('auth.login.alerts.usernameMissing'))
    }

    Swal.fire({
      icon: 'success',
      title: t('auth.login.alerts.successTitle'),
      text: t('auth.login.alerts.successText')
    })

    saveSessionAndNavigate({ phone, username, fullName, avatar, token, roles })
  }

  const loginWithSocialProfile = async ({ provider, providerId, email, name, avatar }) => {
    try {
      const response = await axios.post(SOCIAL_LOGIN_ENDPOINT, {
        provider,
        providerId,
        email,
        name,
        avatar
      })

      if (response.status === 200) {
        handleLoginSuccess(response.data.result)
      }
    } catch (error) {
      showError(error.response?.data?.message || t('auth.login.alerts.genericError'))
    }
  }

  const googleAuthLogin = useGoogleLogin({
    scope: 'openid profile email',
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      try {
        const profileResponse = await axios.get(GOOGLE_USER_INFO_ENDPOINT, {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })

        const profile = profileResponse.data

        await loginWithSocialProfile({
          provider: 'GOOGLE',
          providerId: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture
        })
      } catch (error) {
        showError(error.response?.data?.message || t('auth.login.alerts.genericError'))
      }
    },
    onError: () => showError(t('auth.login.alerts.genericError'))
  })

  const loginWithGoogle = () => {
    googleAuthLogin()
  }

  const loginWithFacebook = async (params) => {
    const profile = params?.data
    const providerId = profile?.id || profile?.userID

    if (!providerId) {
      showError(t('auth.login.alerts.genericError'))
      return
    }

    await loginWithSocialProfile({
      provider: 'FACEBOOK',
      providerId,
      email: profile?.email || '',
      name: profile?.name || '',
      avatar: profile?.picture?.data?.url || profile?.picture?.url || ''
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validCaptcha) {
      toast.error(t('auth.login.alerts.captchaFailed'))
      return
    }

    if (!phone || !password) {
      Swal.fire({
        icon: 'warning',
        title: t('auth.login.alerts.noticeTitle'),
        text: t('auth.login.alerts.missingFields')
      })
      return
    }

    try {
      const response = await axios.post(LOGIN_ENDPOINT, { phone, password })

      if (response.status === 200) {
        handleLoginSuccess(response.data.result)
      }
    } catch (error) {
      resetCaptcha()

      if (error.response) {
        const status = error.response.status
        const backendMessage = String(error.response?.data?.message || '').toLowerCase()

        if (status === 400 && backendMessage.includes('password')) {
          showError(t('auth.login.alerts.passwordWrong'))
        } else if (status === 401 || status === 404) {
          showError(t('auth.login.alerts.accountMissing'))
        } else {
          showError(t('auth.login.alerts.serverError'))
        }
      } else {
        showError(t('auth.login.alerts.serverError'))
      }
    }
  }

  return {
    phone,
    setPhone,
    password,
    setPassword,
    validCaptcha,
    setValidCaptcha,
    captchaResetKey,
    handleSubmit,
    loginWithGoogle,
    loginWithFacebook
  }
}
