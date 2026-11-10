import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { acceptChangePassword, sendOTP } from '~/apis/accountAPI'

export const useForgotPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Step 1: nhập email
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  // Step 2: nhập OTP + mật khẩu mới
  const [otp, setOtp] = useState('')
  const [passNew, setPassNew] = useState('')
  const [passConf, setPassConf] = useState('')
  const [step2Errors, setStep2Errors] = useState({ otp: '', passNew: '', passConf: '', identical: '' })

  // UI state
  const [step, setStep] = useState(1) // 1 = nhập email, 2 = nhập OTP + mật khẩu
  const [loading, setLoading] = useState(false)

  // ─── Validation ────────────────────────────────────────────────────────────

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError(t('auth.forgotPassword.errors.emailRequired'))
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setEmailError(t('auth.forgotPassword.errors.emailFormat'))
      return false
    }
    setEmailError('')
    return true
  }

  const validateStep2 = () => {
    const next = { otp: '', passNew: '', passConf: '', identical: '' }
    let ok = true

    if (!otp || otp.length < 5) {
      next.otp = t('auth.forgotPassword.errors.otpRequired')
      ok = false
    }
    if (!passNew) {
      next.passNew = t('auth.forgotPassword.errors.passwordRequired')
      ok = false
    } else if (passNew.length < 6) {
      next.passNew = t('auth.forgotPassword.errors.passwordTooShort')
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

    setStep2Errors(next)
    return ok
  }

  // ─── Step 1: Gửi OTP ──────────────────────────────────────────────────────

  const requestOtp = async () => {
    if (!validateEmail()) return

    setLoading(true)
    try {
      const otpRes = await sendOTP(email.trim())
      if (otpRes?.result) {
        setStep(2)
        Swal.fire({
          icon: 'success',
          title: t('auth.forgotPassword.alerts.sendOtpSuccessTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpSuccessText'),
          timer: 3000,
          showConfirmButton: false
        })
      } else {
        // result=false: gửi mail thất bại (SMTP lỗi hoặc rate limit), không phải email không tồn tại
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.sendOtpErrorTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpErrorText')
        })
      }
    } catch (err) {
      // Timeout: SMTP chậm nhưng mail vẫn đã gửi → chuyển sang step 2
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')
      if (isTimeout) {
        setStep(2)
        Swal.fire({
          icon: 'info',
          title: t('auth.forgotPassword.alerts.sendOtpSuccessTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpSuccessText'),
          timer: 3000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.sendOtpErrorTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpErrorText')
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Gửi lại OTP ──────────────────────────────────────────────────────────

  const resendOtp = async () => {
    setLoading(true)
    try {
      const otpRes = await sendOTP(email.trim())
      if (otpRes?.result) {
        Swal.fire({
          icon: 'success',
          title: t('auth.forgotPassword.alerts.sendOtpSuccessTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpSuccessText'),
          timer: 3000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.sendOtpErrorTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpErrorText')
        })
      }
    } catch (err) {
      // Timeout nhưng mail vẫn gửi đi → thông báo success
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')
      if (isTimeout) {
        Swal.fire({
          icon: 'info',
          title: t('auth.forgotPassword.alerts.sendOtpSuccessTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpSuccessText'),
          timer: 3000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: t('auth.forgotPassword.alerts.sendOtpErrorTitle'),
          text: t('auth.forgotPassword.alerts.sendOtpErrorText')
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 2: Xác thực OTP + đổi mật khẩu ─────────────────────────────────

  const handleAcceptChangePass = async () => {
    if (!validateStep2()) return

    setLoading(true)
    try {
      const response = await acceptChangePassword({ email: email.trim(), newPassword: passNew, code: otp })
      if (response?.result) {
        await Swal.fire({
          icon: 'success',
          title: t('auth.forgotPassword.alerts.changeSuccessTitle'),
          text: t('auth.forgotPassword.alerts.changeSuccessText'),
          timer: 3000,
          showConfirmButton: false
        })
        navigate('/login')
      } else {
        setStep2Errors((prev) => ({ ...prev, otp: t('auth.forgotPassword.errors.otpInvalid') }))
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: t('auth.forgotPassword.alerts.changeErrorTitle'),
        text: t('auth.forgotPassword.alerts.changeErrorText')
      })
    } finally {
      setLoading(false)
    }
  }

  const goBackToStep1 = () => {
    setStep(1)
    setOtp('')
    setPassNew('')
    setPassConf('')
    setStep2Errors({ otp: '', passNew: '', passConf: '', identical: '' })
  }

  return {
    // step 1
    email,
    setEmail,
    emailError,
    requestOtp,
    // step 2
    otp,
    setOtp,
    passNew,
    setPassNew,
    passConf,
    setPassConf,
    step2Errors,
    resendOtp,
    handleAcceptChangePass,
    goBackToStep1,
    // shared
    step,
    loading
  }
}
