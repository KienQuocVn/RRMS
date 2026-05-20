import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { env } from '~/configs/environment'

export const useRegister = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    username: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    userType: 'CUSTOMER'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const updateField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }))
  }

  const validate = () => {
    const username = form.username.trim()
    const phone = form.phone.trim()
    const { password, passwordConfirmation, userType } = form

    if (!userType || !username || !phone || !password || !passwordConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: t('auth.register.alerts.warningTitle'),
        text: t('auth.register.alerts.missingFields')
      })
      return false
    }

    if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.errorTitle'),
        text: t('auth.register.alerts.invalidPhone')
      })
      return false
    }

    if (password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.errorTitle'),
        text: t('auth.register.alerts.passwordTooShort')
      })
      return false
    }

    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.errorTitle'),
        text: t('auth.register.alerts.passwordMismatch')
      })
      return false
    }

    return true
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const username = form.username.trim()
      const phone = form.phone.trim()
      const { password, userType } = form

      const response = await axios.post(
        `${env.API_URL}/api/v1/authen/register`,
        { username, phone, password, userType },
        { headers: { 'ngrok-skip-browser-warning': '69420' } }
      )

      Swal.fire({
        icon: 'success',
        title: t('auth.register.alerts.successTitle'),
        text: response.data?.message || t('auth.register.alerts.successText')
      })

      navigate('/login')
    } catch (error) {
      const message =
        error.code === 'ERR_NETWORK'
          ? t('auth.register.alerts.backendUnavailable')
          : error.response?.data?.message || t('auth.register.alerts.genericError')
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.errorTitle'),
        text: message
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    updateField,
    setForm,
    loading,
    handleRegister
  }
}
