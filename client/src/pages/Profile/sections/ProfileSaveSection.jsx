import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function ProfileSaveSection({ isSaving, canSubmit, onSave }) {
  const { t } = useTranslation()

  return (
    <ProfileSectionCard
      title={t('profile.save.title')}
      description={t('profile.save.description')}
      sx={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)' }}
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
        <Typography sx={{ fontSize: 14, color: '#667085' }}>{t('profile.save.note')}</Typography>

        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={onSave}
          disabled={!canSubmit || isSaving}
          sx={{
            minWidth: { md: 180 },
            height: 44,
            borderRadius: 2.5,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)'
            }
          }}
        >
          {isSaving ? t('profile.save.saving') : t('profile.save.button')}
        </Button>
      </Box>
    </ProfileSectionCard>
  )
}

export default ProfileSaveSection
