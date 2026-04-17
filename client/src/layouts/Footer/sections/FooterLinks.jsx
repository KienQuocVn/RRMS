import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box, Link as MuiLink, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { footerLinks } from '../footer.data'

export function FooterLinks() {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography sx={{ mb: 1.75, fontSize: 18, fontWeight: 800, color: '#1f2937' }}>{t('footer.linksTitle')}</Typography>

      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', display: 'grid', gap: 1 }}>
        {footerLinks.map((link) => (
          <Box component="li" key={link.key}>
            <MuiLink
              component={link.isInternal ? RouterLink : 'a'}
              to={link.isInternal ? link.href : undefined}
              href={link.isInternal ? undefined : link.href}
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 15,
                color: link.highlight ? '#1d72f3' : '#475467',
                fontWeight: link.highlight ? 700 : 500,
                transition: 'transform 0.2s ease, color 0.2s ease',
                '&:hover': {
                  color: '#111827',
                  transform: 'translateX(2px)'
                }
              }}
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 18, color: 'inherit' }} />
              {t(`footer.links.${link.key}`)}
            </MuiLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
