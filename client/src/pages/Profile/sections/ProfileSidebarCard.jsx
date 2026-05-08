import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'
import { Avatar, Box, Divider, IconButton, Paper, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

function ProfileSidebarCard({ profile, avatarPreview, metrics, onImageChange }) {
  const { t } = useTranslation()
  const displayName = profile.fullName || profile.fullname || t('profile.sidebar.anonymous')

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        position: { lg: 'sticky' },
        top: { lg: 108 },
        borderRadius: 4,
        borderColor: 'rgba(148, 163, 184, 0.18)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.06)',
        backgroundColor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
        <Avatar
          alt={displayName}
          src={avatarPreview}
          sx={{
            width: 108,
            height: 108,
            border: '4px solid #fff',
            boxShadow: '0 16px 30px rgba(59, 130, 246, 0.18)'
          }}
        />
        <IconButton
          component="label"
          aria-label={t('profile.sidebar.changeAvatarAria')}
          sx={{
            position: 'absolute',
            right: -2,
            bottom: 2,
            width: 34,
            height: 34,
            color: '#155eef',
            backgroundColor: '#fff',
            border: '1px solid rgba(148, 163, 184, 0.22)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
            '&:hover': {
              backgroundColor: '#eef4ff'
            }
          }}
        >
          <CameraAltRoundedIcon sx={{ fontSize: 18 }} />
          <VisuallyHiddenInput type="file" accept="image/*" onChange={onImageChange} />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#101828' }}>{displayName}</Typography>
        <Typography sx={{ mt: 0.4, fontSize: 14, color: '#667085' }}>@{profile.username || 'user'}</Typography>
      </Box>

      <Stack spacing={1.2} sx={{ mt: 2.25 }}>
        {metrics.map((item) => (
          <Box
            key={item.label}
            sx={{
              px: 1.5,
              py: 1.3,
              borderRadius: 2.5,
              backgroundColor: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#475467' }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2.25 }} />
    </Paper>
  )
}

export default ProfileSidebarCard
