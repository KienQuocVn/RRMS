import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { acceptChangePassword, email_valid, sendOTP } from '~/apis/accountAPI'

export const useForgotPassword = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [passNew, setPassNew] = useState('')
  const [passConf, setPassConf] = useState('')
  const [errors, setErrors] = useState({ email: '', passNew: '', passConf: '', identical: '' })
  const [pageOTP, setPageOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const next = { email: '', passNew: '', passConf: '', identical: '' }
    let ok = true

    if (!email) {
      next.email = t('auth.forgotPassword.errors.emailRequired')
      ok = false
    }
    if (!passNew) {
      next.passNew = t('auth.forgotPassword.errors.passwordRequired')
      ok = false
    }
    if (!passConf) {
      next.passConf = t('auth.forgotPassword.errors.passwordRequired')
      ok = false
    }
    if (passNew && passConf && passNew !== passConf) {
      next.identical = t('auth.forgotPassword.errors.passwordMismatch')
      ok = false
    }

    setErrors(next)
    return ok
  }

  const requestChangePassword = async () => {
    if (!validate()) return

    const response = await email_valid(email)
    if (response.result === true) {
      setErrors((prev) => ({ ...prev, email: '' }))
      setPageOTP(true)
      await handleSendOtp()
    } else {
      setErrors((prev) => ({ ...prev, email: t('auth.forgotPassword.errors.emailInvalid') }))
    }
  }

  const handleSendOtp = async () => {
    setLoading(true)
    const response = await sendOTP({ email, newPassword: passNew, code: otp })
    setTimeout(() => {
      setLoading(false)
      if (response.result === true) {
        Swal.fire({
          icon: 'success',
          title: t('auth.forgotPassword.alerts.sendOtpSuccessTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpSuccessText')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.sendOtpErrorTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpErrorText')
        })
      }
    }, 1000)
  }

  const handleAcceptChangePass = async () => {
    setLoading(true)
    const response = await acceptChangePassword({ email, newPassword: passNew, code: otp })
    setTimeout(() => {
      setLoading(false)
      if (response.result === true) {
        Swal.fire({
          icon: 'success',
          title: t('auth.forgotPassword.alerts.changeSuccessTitle'),
          text: t('auth.forgotPassword.alerts.changeSuccessText')
        })
        navigate('/login')
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.changeErrorTitle'),
          text: t('auth.forgotPassword.alerts.changeErrorText')
        })
        setPageOTP(false)
        navigate('/forgot-password')
      }
    }, 1000)
  }

  return {
    email,
    setEmail,
    passNew,
    setPassNew,
    passConf,
    setPassConf,
    errors,
    pageOTP,
    loading,
    otp,
    setOtp,
    requestChangePassword,
    handleSendOtp,
    handleAcceptChangePass
  }
}
