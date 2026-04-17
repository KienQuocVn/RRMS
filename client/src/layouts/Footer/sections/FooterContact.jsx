import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const contacts = [
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />,
    key: 'officeRepresentative'
  },
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />,
    key: 'officeWorking'
  },
  {
    icon: <AlternateEmailRoundedIcon sx={{ fontSize: 20 }} />,
    key: 'email'
  },
  {
    icon: <AccessTimeRoundedIcon sx={{ fontSize: 20 }} />,
    key: 'workingHours'
  },
  {
    icon: <LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} />,
    key: 'hotline'
  }
]

export function FooterContact() {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography sx={{ mb: 1.75, fontSize: 18, fontWeight: 800, color: '#1f2937' }}>{t('footer.contactTitle')}</Typography>

      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', display: 'grid', gap: 1.25 }}>
        {contacts.map((item) => (
          <Box component="li" key={item.key} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
            <Box sx={{ color: '#667085', mt: 0.15 }}>{item.icon}</Box>
            <Typography sx={{ fontSize: 15, lineHeight: 1.5, color: '#667085' }}>
              <Box component="span" sx={{ fontWeight: 700, color: '#475467' }}>
                {t(`footer.contacts.${item.key}.title`)}
              </Box>{' '}
              {t(`footer.contacts.${item.key}.content`)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
