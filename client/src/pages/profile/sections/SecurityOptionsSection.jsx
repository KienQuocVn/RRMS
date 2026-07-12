import { Box, FormControlLabel, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function SecurityOptionsSection() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: '0.92fr 1.08fr' },
        gap: 2.25
      }}
    >
      <ProfileSectionCard
        title={t('profile.securityOptions.twoFactorTitle')}
        description={t('profile.securityOptions.twoFactorDescription')}
      >
        <Typography sx={{ fontSize: 14, color: '#667085' }}>{t('profile.securityOptions.twoFactorHint')}</Typography>

        <Box sx={{ mt: 1.75 }}>
          <FormControlLabel control={<Switch defaultChecked />} label={t('profile.securityOptions.enableAdvanced')} />
        </Box>

        <TextField
          label={t('profile.securityOptions.phoneLabel')}
          fullWidth
          placeholder={t('profile.securityOptions.phonePlaceholder')}
          sx={{ mt: 1.5 }}
        />
      </ProfileSectionCard>

      <ProfileSectionCard
        title={t('profile.securityOptions.privacyTitle')}
        description={t('profile.securityOptions.privacyDescription')}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#101828' }}>
          {t('profile.securityOptions.privacyHeading')}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: '#667085' }}>{t('profile.securityOptions.privacyHint')}</Typography>
        <RadioGroup defaultValue="public" sx={{ mt: 1 }}>
          <FormControlLabel value="public" control={<Radio />} label={t('profile.securityOptions.public')} />
          <FormControlLabel value="private" control={<Radio />} label={t('profile.securityOptions.private')} />
        </RadioGroup>

        <Typography sx={{ mt: 2, fontSize: 15, fontWeight: 700, color: '#101828' }}>
          {t('profile.securityOptions.dataSharingHeading')}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: '#667085' }}>
          {t('profile.securityOptions.dataSharingHint')}
        </Typography>
        <RadioGroup defaultValue="yes" sx={{ mt: 1 }}>
          <FormControlLabel value="yes" control={<Radio />} label={t('profile.securityOptions.shareYes')} />
          <FormControlLabel value="no" control={<Radio />} label={t('profile.securityOptions.shareNo')} />
        </RadioGroup>
      </ProfileSectionCard>
    </Box>
  )
}

export default SecurityOptionsSection
