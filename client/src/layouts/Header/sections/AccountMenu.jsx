import { Link } from 'react-router-dom'
import { Box, Avatar } from '@mui/material'
import { useTranslation } from 'react-i18next'

const MenuItem = ({ to, icon, label, highlight, badge, onClick }) => (
  <Box sx={{ p: 0 }}>
    <Box
      component={to ? Link : 'a'}
      to={to}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        width: '100%',
        px: 1.5,
        textDecoration: 'none',
        color: '#222222',
        fontSize: '1rem',
        cursor: 'pointer',
        bgcolor: highlight ? '#ebfaff' : 'transparent',
        '&:hover': { bgcolor: '#E8E8E8', color: '#222222' }
      }}>
      <Box component="img" src={icon} alt="" sx={{ width: 24, height: 24 }} />
      <Box component="span" sx={{ ml: 1.5, lineHeight: '24px', flex: 1 }}>
        {label}
      </Box>
      {badge && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#4bcffa', fontSize: '0.875rem', mr: 1.25 }}>
          <strong>{badge}&nbsp;</strong>
          <Box component="img" src="/chervon_right_orange.svg" alt="" />
        </Box>
      )}
    </Box>
  </Box>
)

const SectionLabel = ({ label }) => (
  <Box sx={{ height: 38, bgcolor: '#f5f5f5', px: 1.5, py: '10px 0 10px' }}>
    <Box
      component="span"
      sx={{ color: '#777777', lineHeight: '18px', fontSize: '0.875rem', fontWeight: 700, display: 'block' }}>
      {label}
    </Box>
  </Box>
)

export default function AccountMenu({ username, avatar, tokenExists, onMenuClose, onLogout }) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        position: 'absolute',
        width: 300,
        maxHeight: '80vh',
        overflowY: 'auto',
        top: 50,
        right: -5,
        bgcolor: '#FFFFFF',
        py: 1,
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        borderTop: 'none',
        zIndex: 1001
      }}>
      <Box sx={{ position: 'relative', p: 1.5, height: 70 }}>
        {username ? (
          <Box component={Link} to="/profile" onClick={onMenuClose} sx={{ display: 'flex', textDecoration: 'none' }}>
            <Avatar sx={{ width: 48, height: 48 }}>{username[0]}</Avatar>
            <Box sx={{ ml: 1, mt: '14px', fontWeight: 700, fontSize: '1rem', color: '#222222' }}>{username}</Box>
          </Box>
        ) : (
          <Box component={Link} to="/login" onClick={onMenuClose} sx={{ display: 'flex', textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'block',
                backgroundImage: `url(${avatar || '/default_user.png'})`,
                backgroundSize: '100%',
                borderRadius: '50%',
                height: 48,
                width: 48,
                flexShrink: 0
              }}
            />
            <Box sx={{ ml: 1, mt: '14px', fontWeight: 700, fontSize: '1rem', color: '#222222' }}>
              {t('header.accountMenu.loginRegister')}
            </Box>
          </Box>
        )}
      </Box>

      {tokenExists && (
        <>
          <SectionLabel label={t('header.accountMenu.sections.utilities')} />
          <MenuItem
            to="/heart"
            icon="/menu-saved-ad.svg"
            label={t('header.accountMenu.items.savedPosts')}
            onClick={onMenuClose}
          />
          <MenuItem
            to="/rating-history"
            icon="/menu-rating-management.svg"
            label={t('header.accountMenu.items.myRatings')}
            onClick={onMenuClose}
          />
        </>
      )}
      <SectionLabel label={t('header.accountMenu.sections.others')} />
      {tokenExists && (
        <MenuItem
          to="/profile"
          icon="/setting.svg"
          label={t('header.accountMenu.items.accountSettings')}
          onClick={onMenuClose}
        />
      )}
      {tokenExists && <MenuItem icon="/setting.svg" label={t('header.accountMenu.items.logout')} onClick={onLogout} />}
    </Box>
  )
}
