import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function SecurityDangerZoneSection() {
  const { t } = useTranslation()

  return (
    <ProfileSectionCard
      title={t('profile.dangerZone.title')}
      description={t('profile.dangerZone.description')}
      sx={{
        borderColor: 'rgba(248, 113, 113, 0.26)',
        background: 'linear-gradient(180deg, #ffffff 0%, #fff7f7 100%)'
      }}
      action={<WarningAmberRoundedIcon sx={{ color: '#ef4444' }} />}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Typography sx={{ fontSize: 14, color: '#7a271a' }}>{t('profile.dangerZone.warning')}</Typography>
        <Button variant="contained" color="error" sx={{ minWidth: { md: 240 }, borderRadius: 2.5, fontWeight: 700 }}>
          {t('profile.dangerZone.button')}
        </Button>
      </Box>
    </ProfileSectionCard>
  )
}

export default SecurityDangerZoneSection
