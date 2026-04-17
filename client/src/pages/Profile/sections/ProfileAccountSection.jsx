import { Grid, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function ProfileAccountSection({ profile, formik, updateFieldValue }) {
  const { t } = useTranslation()

  return (
    <ProfileSectionCard title={t('profile.account.title')} description={t('profile.account.description')}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('profile.account.username')}
            fullWidth
            disabled
            value={profile.username || ''}
            InputLabelProps={{ shrink: Boolean(profile.username) }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('profile.account.fullName')}
            fullWidth
            value={formik.values.fullname || ''}
            onChange={(event) => updateFieldValue('fullname', event.target.value)}
            InputLabelProps={{ shrink: Boolean(formik.values.fullname) }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('profile.account.email')}
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={(event) => updateFieldValue('email', event.target.value)}
            onBlur={formik.handleBlur}
            InputLabelProps={{ shrink: Boolean(formik.values.email) }}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('profile.account.phone')}
            fullWidth
            disabled
            value={profile.phone || ''}
            InputLabelProps={{ shrink: Boolean(profile.phone) }}
          />
        </Grid>
      </Grid>
    </ProfileSectionCard>
  )
}

export default ProfileAccountSection
