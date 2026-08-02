import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function NotificationPreferencesSection() {
  const { t } = useTranslation()
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [systemEnabled, setSystemEnabled] = useState(true)

  return (
    <Box sx={{ display: 'grid', gap: 2.25 }}>
      <ProfileSectionCard title={t('profile.notifications.title')} description={t('profile.notifications.description')}>
        <Stack spacing={1.5}>
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <EmailOutlinedIcon sx={{ color: '#155eef' }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#101828' }}>
                  {t('profile.notifications.emailTitle')}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#667085' }}>
                  {t('profile.notifications.emailDescription')}
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={<Switch checked={emailEnabled} onChange={(event) => setEmailEnabled(event.target.checked)} />}
              label=""
            />
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <NotificationsOutlinedIcon sx={{ color: '#2b7ed7' }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#101828' }}>
                  {t('profile.notifications.systemTitle')}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#667085' }}>
                  {t('profile.notifications.systemDescription')}
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={<Switch checked={systemEnabled} onChange={(event) => setSystemEnabled(event.target.checked)} />}
              label=""
            />
          </Box>
        </Stack>
      </ProfileSectionCard>
    </Box>
  )
}

export default NotificationPreferencesSection
