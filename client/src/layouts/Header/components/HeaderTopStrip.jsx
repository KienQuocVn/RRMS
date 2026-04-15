import React from 'react'
import { Box, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import { topPrimaryLinks, topSecondaryLinks } from './headerData'

const HeaderTopStrip = ({ t, themeMode }) => {
  const isLight = themeMode === 'light'

  return (
    <Box
      sx={{
        height: '40px',
        width: '100%',
        backgroundColor: isLight ? '#ffffff' : '#1f1f1f',
        display: 'flex',
        alignItems: 'center',
        zIndex: 190,
        position: 'sticky',
        top: 0,
        borderBottom: '1px solid',
        borderColor: isLight ? '#eeeeee' : '#333333'
      }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 16px'
        }}>
        {/* Left side - Primary Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
          {topPrimaryLinks.map((item, index) => (
            <React.Fragment key={item.to}>
              <MuiLink
                component={Link}
                to={item.to}
                underline="none"
                sx={{
                  color: '#222222',
                  fontSize: '0.75rem',
                  '&:hover': { color: '#FF8800' }
                }}>
                {t(item.labelKey)}
              </MuiLink>

              {index < topPrimaryLinks.length - 1 && (
                <Box
                  sx={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#CCCCCC',
                    borderRadius: '50%'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Right side - Secondary Links + Đối với môi giới */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Secondary Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.75rem' }}>
            {topSecondaryLinks.map((item) => (
              <MuiLink
                key={item.labelKey}
                component={Link}
                to={item.to}
                underline="none"
                target={item.target}
                rel={item.rel}
                sx={{
                  color: '#8C8C8C',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: '#222222'
                  }
                }}>
                {t(item.labelKey)}
              </MuiLink>
            ))}
          </Box>

          {/* Link "Dành cho môi giới" */}
          <MuiLink
            component={Link}
            to="https://www.nhatot.com/kenh-moi-gioi"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '190px',
              height: '32px',
              padding: '6px 12px',
              backgroundColor: isLight ? '#E8E8E8' : '#000000',
              color: isLight ? '#1f1f1f' : '#E8E8E8',
              borderRadius: '0 8px 0 8px',
              fontSize: '0.75rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: isLight ? '#D8D8D8' : '#222222'
              }
            }}>
            <Box
              sx={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <img
                src="https://storage.googleapis.com/static-chotot-com/storage/APP_WRAPPER/icons/icon-suitcase.png"
                alt=""
                style={{ width: '20px', height: '20px' }}
              />
            </Box>
            <span>{t('danh-cho-moi-gioi')}</span>
          </MuiLink>
        </Box>
      </Box>
    </Box>
  )
}

export default HeaderTopStrip
