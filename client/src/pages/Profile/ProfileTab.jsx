import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { subYears } from 'date-fns'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { updateProfile } from '~/apis/profileAPI'
import { storage } from '~/configs/firebaseConfig'
import { useAuth } from '~/hooks/useAuth'
import ProfileAccountSection from './sections/ProfileAccountSection'
import ProfilePersonalSection from './sections/ProfilePersonalSection'
import ProfileSaveSection from './sections/ProfileSaveSection'

function ProfileTab({ profile, setProfile, selectedImage, setSelectedImage, username }) {
  const { t } = useTranslation()
  const [isSaving, setIsSaving] = useState(false)
  const { setAccount, setAvatar } = useAuth()

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, t('profile.validation.emailInvalid'))
      .required(t('profile.validation.emailRequired')),
    gender: Yup.string().required(t('profile.validation.genderRequired')),
    birthday: Yup.date()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .required(t('profile.validation.birthdayRequired'))
      .max(subYears(new Date(), 16), t('profile.validation.birthdayMinAge')),
    cccd: Yup.string().matches(/^\d{12}$/, t('profile.validation.cccdInvalid'))
  })

  const formik = useFormik({
    initialValues: {
      fullName: profile.fullName || profile.fullname || '',
      email: profile.email || '',
      birthday: profile.birthday ? profile.birthday.split('T')[0] : '',
      gender: profile.gender || '',
      cccd: profile.cccd || ''
    },
    validationSchema,
    onSubmit: () => {}
  })

  useEffect(() => {
    formik.setValues({
      fullName: profile.fullName || profile.fullname || '',
      email: profile.email || '',
      birthday: profile.birthday ? profile.birthday.split('T')[0] : '',
      gender: profile.gender || '',
      cccd: profile.cccd || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.fullName, profile.fullname, profile.email, profile.birthday, profile.gender, profile.cccd])

  const updateFieldValue = (field, value) => {
    formik.setFieldValue(field, value)
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    const validationErrors = await formik.validateForm()

    if (Object.keys(validationErrors).length > 0) {
      formik.setTouched({
        fullName: true,
        email: true,
        birthday: true,
        gender: true,
        cccd: true
      })
      return
    }

    setIsSaving(true)
    toast.info(t('profile.alerts.savingInfo'))

    try {
      const profileToSave = {
        ...profile,
        username: profile.username || username
      }
      let nextProfile = profileToSave

      if (selectedImage) {
        const imageName = v4()
        const storageRef = ref(storage, `images/account-avatar/${imageName}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedImage)

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            reject,
            async () => {
              try {
                const avatarUrl = await getDownloadURL(uploadTask.snapshot.ref)
                const updatedProfile = await updateProfile({ ...profileToSave, avatar: avatarUrl })
                setProfile(updatedProfile)
                nextProfile = updatedProfile
                resolve()
              } catch (error) {
                reject(error)
              }
            }
          )
        })
      } else {
        nextProfile = await updateProfile(profileToSave)
        setProfile(nextProfile)
      }

      const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null')
      if (storedUser) {
        const nextStoredUser = {
          ...storedUser,
          username: nextProfile.username || storedUser.username,
          avatar: nextProfile.avatar || storedUser.avatar
        }

        sessionStorage.setItem('user', JSON.stringify(nextStoredUser))
        setAvatar(nextStoredUser.avatar || '')
      }

      setAccount(nextProfile)

      formik.resetForm({
        values: {
          fullName: nextProfile.fullName || nextProfile.fullname || '',
          email: nextProfile.email || '',
          birthday: nextProfile.birthday ? nextProfile.birthday.split('T')[0] : '',
          gender: nextProfile.gender || '',
          cccd: nextProfile.cccd || ''
        }
      })
      setSelectedImage(null)
      toast.success(t('profile.alerts.saveSuccess'))
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error(t('profile.alerts.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 2.25 }}>
      <ProfileAccountSection profile={profile} formik={formik} updateFieldValue={updateFieldValue} />
      <ProfilePersonalSection profile={profile} formik={formik} updateFieldValue={updateFieldValue} />
      <ProfileSaveSection
        isSaving={isSaving}
        canSubmit={formik.isValid && (formik.dirty || Boolean(selectedImage))}
        onSave={handleSaveProfile}
      />
    </Box>
  )
}

export default ProfileTab
