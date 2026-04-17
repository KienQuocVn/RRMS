import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Box, Container } from '@mui/material'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { insertSupport } from '~/apis/supportAPI'
import SupportHeroSection from './sections/SupportHeroSection'
import SupportRequestSection from './sections/SupportRequestSection'
import { SUPPORT_PRICE_OPTIONS } from './hooks/support.constants'

const initialFormValues = {
  name: '',
  phone: '',
  dateOfStay: null,
  priceRange: ''
}

function Support({ setIsAdmin }) {
  const { t } = useTranslation()
  const [formValues, setFormValues] = useState(initialFormValues)

  const validateForm = () => {
    const validations = [
      { invalid: !formValues.name.trim(), message: t('support.validation.nameRequired') },
      { invalid: !formValues.phone.trim(), message: t('support.validation.phoneRequired') },
      { invalid: !formValues.dateOfStay, message: t('support.validation.dateRequired') },
      { invalid: !formValues.priceRange, message: t('support.validation.priceRequired') }
    ]

    const invalidField = validations.find((item) => item.invalid)

    if (!invalidField) return true

    Swal.fire({
      icon: 'error',
      title: t('support.alerts.noticeTitle'),
      text: invalidField.message
    })

    return false
  }

  const handleFieldChange = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleDateChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      dateOfStay: value
    }))
  }

  const handlePriceRangeChange = (event) => {
    setFormValues((prev) => ({
      ...prev,
      priceRange: event.target.value
    }))
  }

  const handleSupportRequest = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    const selectedPriceRange = SUPPORT_PRICE_OPTIONS.find((option) => option.value === formValues.priceRange)
    const user = JSON.parse(sessionStorage.getItem('user') || 'null')
    const payload = {
      ...(user?.username ? { account: { username: user.username } } : {}),
      nameContact: formValues.name.trim(),
      phoneContact: formValues.phone.trim(),
      dateOfStay: dayjs(formValues.dateOfStay).format('YYYY-MM-DD'),
      priceFirst: selectedPriceRange?.priceFirst ?? '',
      priceEnd: selectedPriceRange?.priceEnd ?? ''
    }

    try {
      const response = await insertSupport(payload)

      if (response.code === 201) {
        Swal.fire({
          icon: 'success',
          title: t('support.alerts.successTitle'),
          text: t('support.alerts.successText')
        })
        setFormValues(initialFormValues)
        return
      }

      Swal.fire({
        icon: 'error',
        title: t('support.alerts.noticeTitle'),
        text: response.message || t('support.alerts.errorDefault')
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('support.alerts.noticeTitle'),
        text: error.response?.data?.message || t('support.alerts.errorLater')
      })
    }
  }

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box component="main" sx={{ backgroundColor: '#fff', py: { xs: 4, md: 5 } }}>
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: 1348, mx: 'auto' }}>
          <SupportHeroSection />
          <Box sx={{ mt: 4 }}>
            <SupportRequestSection
              formValues={formValues}
              onFieldChange={handleFieldChange}
              onDateChange={handleDateChange}
              onPriceRangeChange={handlePriceRangeChange}
              onSubmit={handleSupportRequest}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Support
