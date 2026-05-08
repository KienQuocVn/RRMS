import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { env } from '~/configs/environment'
import { acceptAuthenticationRegister, email_valid, sendOTPRegister } from '~/apis/accountAPI'

export const useRegister = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    username: '',
    gmail: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    userType: 'CUSTOMER'
  })
  const [gmailErr, setGmailErr] = useState('')
  const [pageOTP, setPageOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const { username, phone, gmail, password, passwordConfirmation } = form

    if (!username || !phone || !gmail || !password || !passwordConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: t('auth.register.alerts.warningTitle'),
        text: t('auth.register.alerts.missingFields')
      })
      return false
    }
    if (!/^(0[3-9]{1}[0-9]{8})$/.test(phone)) {
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
    if (!validate()) return

    try {
      const { username, phone, gmail } = form
      const response = await axios.post(`${env.API_URL}/api/v1/authen/checkregister`, { username, phone, email: gmail })
      if (response.data.result) {
        requestEmailVerification()
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.register.alerts.errorTitle'),
          text: response.data.message || t('auth.register.alerts.invalidInfo')
        })
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.errorTitle'),
        text: t('auth.register.alerts.checkInfoFailed')
      })
    }
  }

  const requestEmailVerification = async () => {
    const response = await email_valid(form.gmail)
    if (response.result === false) {
      setGmailErr('')
      setPageOTP(true)
      await handleSendOtp()
    } else {
      setGmailErr(t('auth.register.alerts.invalidEmail'))
    }
  }

  const handleSendOtp = async () => {
    setLoading(true)
    const response = await sendOTPRegister({ gmail: form.gmail, code: otp })
    setTimeout(() => {
      setLoading(false)
      if (response.result === true) {
        Swal.fire({
          icon: 'success',
          title: t('auth.register.alerts.sendOtpSuccessTitle'),
          text: t('auth.register.alerts.sendOtpSuccessText')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.register.alerts.sendOtpErrorTitle'),
          text: t('auth.register.alerts.sendOtpErrorText')
        })
      }
    }, 1000)
  }

  const handleAcceptChangePass = async () => {
    setLoading(true)
    const response = await acceptAuthenticationRegister({ gmail: form.gmail, code: otp })
    if (response.result === true) {
      setTimeout(() => {
        setLoading(false)
        registerAccount()
      }, 1000)
    } else {
      Swal.fire({
        icon: 'error',
        title: t('auth.register.alerts.invalidOtpTitle'),
        text: t('auth.register.alerts.invalidOtpText')
      })
      setLoading(false)
    }
  }

  const registerAccount = async () => {
    const { username, phone, gmail, password, userType } = form
    try {
      const response = await axios.post(
        `${env.API_URL}/api/v1/authen/register`,
        { username, phone, email: gmail, password, userType },
        { headers: { 'ngrok-skip-browser-warning': '69420' } }
      )
      Swal.fire({
        icon: 'success',
        title: t('auth.register.alerts.successTitle'),
        text: response.data.message || t('auth.register.alerts.successText')
      })
      navigate('/login')
    } catch (error) {
      const msg = error.response?.data?.message || t('auth.register.alerts.genericError')
      Swal.fire({ icon: 'error', title: t('auth.register.alerts.errorTitle'), text: msg })
    }
  }

  return {
    form,
    updateField,
    setForm,
    gmailErr,
    pageOTP,
    loading,
    otp,
    setOtp,
    handleRegister,
    handleSendOtp,
    handleAcceptChangePass
  }
}
