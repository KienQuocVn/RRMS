import { Box } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { changePassword } from '~/apis/profileAPI'
import SecurityDangerZoneSection from './sections/SecurityDangerZoneSection'
import SecurityOptionsSection from './sections/SecurityOptionsSection'
import SecurityPasswordSection from './sections/SecurityPasswordSection'

function SecurityTab({ username }) {
  const { t } = useTranslation()
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setPasswordData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData
    const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null')
    const effectiveUsername = username || storedUser?.username || ''

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.info(t('profile.alerts.passwordMissing'))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.info(t('profile.alerts.passwordMismatch'))
      return
    }

    if (!effectiveUsername) {
      toast.error(t('profile.alerts.passwordError'))
      return
    }

    try {
      await changePassword({
        username: effectiveUsername,
        oldPassword,
        newPassword
      })
      toast.success(t('profile.alerts.passwordSuccess'))
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Change password failed:', error)
      toast.error(t('profile.alerts.passwordError'))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <Box sx={{ display: 'grid', gap: 2.25 }}>
      <SecurityPasswordSection
        passwordData={passwordData}
        showPassword={showPassword}
        onFieldChange={handleChange}
        onTogglePassword={handleClickShowPassword}
        onSubmit={handleChangePassword}
      />
      <SecurityOptionsSection />
      <SecurityDangerZoneSection />
    </Box>
  )
}

export default SecurityTab
