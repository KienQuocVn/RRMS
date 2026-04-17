import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Box, Link as MuiLink, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { footerBadges, footerSocialLinks } from '../footer.data'

export function FooterSocial() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2.5
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        {footerBadges.map((badge) => (
          <Box
            key={badge.titleKey}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.9,
              borderRadius: 999,
              border: '1px solid rgba(148, 163, 184, 0.25)',
              backgroundColor: '#fff'
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 22, color: badge.accent }} />
            <Box>
              <Typography sx={{ fontSize: 12, lineHeight: 1.1, fontWeight: 800, color: badge.accent, textTransform: 'uppercase' }}>
                {t(`footer.badges.${badge.titleKey}`)}
              </Typography>
              <Typography sx={{ fontSize: 11.5, lineHeight: 1.1, color: '#475467' }}>
                {t(`footer.badges.${badge.subtitleKey}`)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, justifyContent: { xs: 'center', md: 'flex-end' } }}>
        {footerSocialLinks.map((link) => (
          <MuiLink
            key={link.key}
            href={link.href}
            underline="none"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 1.75,
              border: `1px solid ${link.accent}`,
              backgroundColor: '#fff',
              color: link.accent,
              fontSize: 14,
              fontWeight: 700,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 10px 18px ${link.accent}22`
              }
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                backgroundColor: link.logo ? 'transparent' : `${link.accent}14`
              }}
            >
              {link.logo ? (
                <Box component="img" src={link.logo} alt={t(`footer.social.${link.key}`)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography sx={{ fontSize: 14, fontWeight: 900, lineHeight: 1, color: link.accent }}>{link.shortLabel}</Typography>
              )}
            </Box>
            {t(`footer.social.${link.key}`)}
          </MuiLink>
        ))}
      </Box>
    </Box>
  )
}
