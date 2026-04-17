import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { env } from '~/configs/environment'
import { checkRegister } from '~/apis/accountAPI'

export const useLogin = ({ setUsername, setAvatar }) => {
  const { t } = useTranslation()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [validCaptcha, setValidCaptcha] = useState(false)
  const navigate = useNavigate()

  const showError = (text) => Swal.fire({ icon: 'error', title: t('auth.login.alerts.errorTitle'), text })

  const saveSessionAndNavigate = ({ phone, username, avatar, token, roles }) => {
    sessionStorage.setItem('user', JSON.stringify({ phone, username, avatar, token, roles }))
    setUsername(username)
    setAvatar(avatar)
    navigate('/RRMS')
  }

  const loginSocial = async (phoneValue, pass) => {
    try {
      const response = await axios.post(`${env.API_URL}/authen/login`, {
        phone: phoneValue,
        password: pass
      })

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: t('auth.login.alerts.successTitle'),
          text: t('auth.login.alerts.successText')
        })

        const { username, avatar, token } = response.data.data

        if (!username) throw new Error(t('auth.login.alerts.usernameMissing'))

        saveSessionAndNavigate({ phone: phoneValue, username, avatar, token })
      }
    } catch {
      showError(t('auth.login.alerts.genericError'))
    }
  }

  const registerAndLoginSocial = async (id) => {
    try {
      const response = await axios.post(
        `${env.API_URL}/authen/register`,
        { username: id, phone: id, password: id },
        { headers: { 'ngrok-skip-browser-warning': '69420' } }
      )

      if (response.data.status === true) {
        await loginSocial(id, id)
      } else {
        showError(t('auth.login.alerts.genericError'))
      }
    } catch (error) {
      showError(error.response?.data?.message || t('auth.login.alerts.genericError'))
    }
  }

  const loginWithGoogle = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      if (!decoded) return

      const response = await checkRegister(decoded.sub)
      if (!response.result) {
        await registerAndLoginSocial(decoded.sub)
      } else {
        await loginSocial(decoded.sub, decoded.sub)
      }
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  const loginWithFacebook = async (param) => {
    try {
      const id = param?.data?.userID
      if (!id) return

      const response = await checkRegister(id)
      if (!response.result) {
        await registerAndLoginSocial(id)
      } else {
        await loginSocial(id, id)
      }
    } catch (error) {
      console.error('Facebook login error:', error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validCaptcha) {
      toast.error(t('auth.login.alerts.captchaFailed'))
      return
    }

    if (!phone || !password) {
      Swal.fire({ icon: 'warning', title: t('auth.login.alerts.noticeTitle'), text: t('auth.login.alerts.missingFields') })
      return
    }

    try {
      const response = await axios.post(`${env.API_URL}/authen/login`, { phone, password })

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: t('auth.login.alerts.successTitle'),
          text: t('auth.login.alerts.successText')
        })

        const { username, avatar, token, roles } = response.data.data

        if (!username) throw new Error(t('auth.login.alerts.usernameMissing'))

        saveSessionAndNavigate({ phone, username, avatar, token, roles })
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status
        if (status === 401) {
          showError(t('auth.login.alerts.passwordWrong'))
        } else if (status === 404) {
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
    handleSubmit,
    loginWithGoogle,
    loginWithFacebook
  }
}
