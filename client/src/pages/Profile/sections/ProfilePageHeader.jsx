import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function ProfilePageHeader({ profile, username }) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        p: { xs: 2.25, md: 3.25 },
        borderRadius: 4,
        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 58%, #38bdf8 100%)',
        color: '#fff',
        boxShadow: '0 30px 80px rgba(29, 78, 216, 0.25)'
      }}
    >
      <Stack spacing={1.1}>
        <Chip
          icon={<BadgeRoundedIcon sx={{ color: '#155eef !important' }} />}
          label={t('profile.header.badge')}
          sx={{
            alignSelf: 'flex-start',
            px: 0.5,
            fontWeight: 700,
            color: '#155eef',
            backgroundColor: 'rgba(255,255,255,0.92)'
          }}
        />
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 900, lineHeight: 1.15 }}>
          {t('profile.header.title')}
        </Typography>
        <Typography sx={{ maxWidth: 760, fontSize: { xs: 14, md: 16 }, lineHeight: 1.75, color: 'rgba(255,255,255,0.82)' }}>
          {t('profile.header.description')}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ pt: 0.5 }}>
          <Chip
            icon={<MailOutlineRoundedIcon sx={{ color: '#fff !important' }} />}
            label={profile.email || t('profile.header.missingEmail')}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.14)'
            }}
          />
          <Chip
            label={`@${profile.username || username || 'user'}`}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.14)'
            }}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

export default ProfilePageHeader
