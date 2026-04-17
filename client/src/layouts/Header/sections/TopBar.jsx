import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { to: '/', labelKey: 'trang-chu' },
  { to: '/search', labelKey: 'tim-kiem' },
  { to: '/contact', labelKey: 'lien-he' },
  { to: '/support', labelKey: 'tro-giup' }
]

const SIDE_LINKS = [
  {
    to: 'https://docs.google.com/forms/d/e/1FAIpQLSc5begvG3B5NE29iy3JnXya_6zY_DyHdIIfb3TnnQTNqr5ZVQ/viewform',
    labelKey: 'dong-gop',
    external: true
  },
  { to: '/', labelKey: 'tai-ung-dung' },
  { to: '/introduce', labelKey: 've-chung-toi' }
]

const linkStyle = {
  textDecoration: 'none',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  '&:hover': { opacity: 0.7 }
}

export default function TopBar() {
  const theme = useTheme()
  const { t } = useTranslation()
  const textColor = theme.palette.mode === 'light' ? '#222222' : '#E8E8E8'

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: '6px',
        bgcolor: theme.palette.mode === 'light' ? '#fff' : '#1f1f1f',
        height: 40,
        position: 'sticky',
        top: 0,
        zIndex: 190,
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1440,
          mx: 'auto'
        }}
      >
        {/* Left nav links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5, minWidth: 0 }}>
          {NAV_LINKS.map((item) => (
            <Box
              key={item.to}
              component={Link}
              to={item.to}
              sx={{ ...linkStyle, color: textColor }}
            >
              {t(item.labelKey)}
            </Box>
          ))}
        </Box>

        {/* Right side links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
          {SIDE_LINKS.map((item) => (
            <Box
              key={item.labelKey}
              component={Link}
              to={item.to}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'nofollow' : undefined}
              sx={{ ...linkStyle, color: '#6b7280' }}
            >
              {t(item.labelKey)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
