import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function ProfilePersonalSection({ profile, formik, updateFieldValue }) {
  const { t } = useTranslation()

  return (
    <ProfileSectionCard title={t('profile.personal.title')} description={t('profile.personal.description')}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
            <InputLabel id="gender-select-label">{t('profile.personal.gender')}</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              name="gender"
              value={formik.values.gender}
              onChange={(event) => updateFieldValue('gender', event.target.value)}
              onBlur={formik.handleBlur}
              label={t('profile.personal.gender')}
            >
              <MenuItem value="MALE">{t('profile.personal.male')}</MenuItem>
              <MenuItem value="FEMALE">{t('profile.personal.female')}</MenuItem>
              <MenuItem value="OTHER">{t('profile.personal.other')}</MenuItem>
            </Select>
            <FormHelperText>{formik.touched.gender && formik.errors.gender}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label={t('profile.personal.birthday')}
            fullWidth
            type="date"
            name="birthday"
            InputLabelProps={{ shrink: true }}
            value={formik.values.birthday}
            onChange={(event) => updateFieldValue('birthday', event.target.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
            helperText={formik.touched.birthday && formik.errors.birthday}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t('profile.personal.cccd')}
            fullWidth
            name="cccd"
            value={formik.values.cccd}
            onChange={(event) => updateFieldValue('cccd', event.target.value)}
            onBlur={formik.handleBlur}
            InputLabelProps={{ shrink: Boolean(profile.cccd || formik.values.cccd) }}
            error={formik.touched.cccd && Boolean(formik.errors.cccd)}
            helperText={formik.touched.cccd && formik.errors.cccd}
          />
        </Grid>
      </Grid>
    </ProfileSectionCard>
  )
}

export default ProfilePersonalSection
