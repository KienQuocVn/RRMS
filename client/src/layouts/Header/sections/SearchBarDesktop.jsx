import { Link, useNavigate } from 'react-router-dom'
import { Box, IconButton, InputBase } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="none">
    <path fill="currentColor" d="M6.4 0a6.369 6.369 0 00-4.525 1.873A6.425 6.425 0 00.502 3.906v.002A6.383 6.383 0 000 6.398a6.372 6.372 0 001.875 4.524 6.385 6.385 0 008.428.537l-.006.006 4.295 4.293a.827.827 0 001.166-1.166l-4.295-4.295a6.368 6.368 0 00-.537-8.424A6.372 6.372 0 006.4 0zm0 1.615a4.75 4.75 0 013.383 1.4c.44.44.785.95 1.028 1.522h-.002c.249.59.377 1.214.377 1.861 0 .648-.128 1.27-.377 1.862h.002a4.783 4.783 0 01-2.55 2.545c-.59.25-1.213.377-1.86.377a4.761 4.761 0 01-1.864-.377A4.749 4.749 0 013.016 9.78c-.44-.44-.783-.95-1.024-1.521a4.735 4.735 0 01-.377-1.862c0-.647.127-1.272.377-1.863a4.75 4.75 0 011.024-1.52 4.754 4.754 0 013.384-1.4z" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path fill="#000" d="M6 6L11 11.5 1 11.5z" opacity=".8" transform="matrix(1 0 0 -1 0 17.5)" />
    </g>
  </svg>
)

const BurgerIcon = ({ color }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 18.5H20C20.55 18.5 21 18.05 21 17.5C21 16.95 20.55 16.5 20 16.5H4C3.45 16.5 3 16.95 3 17.5C3 18.05 3.45 18.5 4 18.5ZM4 13.5H20C20.55 13.5 21 13.05 21 12.5C21 11.95 20.55 11.5 20 11.5H4C3.45 11.5 3 11.95 3 12.5C3 13.05 3.45 13.5 4 13.5ZM3 7.5C3 8.05 3.45 8.5 4 8.5H20C20.55 8.5 21 8.05 21 7.5C21 6.95 20.55 6.5 20 6.5H4C3.45 6.5 3 6.95 3 7.5Z" fill={color} />
  </svg>
)

const CATEGORY_KEYS = ['wantRent', 'forRent', 'project']

const CATEGORY_MENU_ITEMS = [
  {
    key: 'wantRent',
    icon: '/public/PTY_lv1_cat_muban.png',
    to: '#',
    active: true
  },
  {
    key: 'forRent',
    icon: '/public/PTY_lv1_cat_chothue.png',
    to: '#'
  },
  {
    key: 'project',
    icon: '/public/PTY_lv1_cat_duan.png',
    to: '#'
  },
  {
    key: 'findBroker',
    icon: '/public/PTY_lv1_cat_timmoigioi.png',
    to: '#'
  },
  {
    key: 'priceChart',
    icon: '/public/PTY_lv1_cat_bieudogia.png',
    to: '/chart'
  },
  {
    key: 'homeLoan',
    icon: '/public/PTY_lv1_cat_vaymuanha.png',
    to: '#'
  }
]

export default function SearchBarDesktop({ onSearchKeywordChange }) {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isRentTypeOpen, setIsRentTypeOpen] = useState(false)
  const [searchKeyWord, setSearchKeyWord] = useState('')

  const iconColor = theme.palette.mode === 'light' ? '#212121' : '#E8E8E8'
  const bgColor = theme.palette.mode === 'light' ? '#f4f4f4' : '#2a2a2a'
  const borderColor = theme.palette.mode === 'light' ? '#e8e8e8' : '#3b3b3b'
  const textColor = theme.palette.mode === 'light' ? '#222222' : '#E8E8E8'
  const secondaryTextColor = theme.palette.mode === 'light' ? '#8C8C8C' : '#bdbdbd'

  const handleSearch = () => navigate('/search', { state: { searchKeyWord } })

  const handleKeywordChange = (event) => {
    setSearchKeyWord(event.target.value)
    onSearchKeywordChange?.(event.target.value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        gap: { md: 2 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { md: 1.5 },
          flexShrink: 0,
          minWidth: 'fit-content',
          position: 'relative'
        }}
      >
        <Box
          component={Link}
          to="/RRMS"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 44,
            width: { xs: 124, md: 140 },
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <Box
            component="img"
            src="/RRMS.png"
            alt={t('header.search.logoAlt')}
            sx={{ width: '100%', height: 34, objectFit: 'contain', objectPosition: 'left center' }}
          />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
          <Box
            onClick={() => setIsCategoryOpen((open) => !open)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: 40,
              px: 1.5,
              borderRadius: '4px',
              color: secondaryTextColor,
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <BurgerIcon color={iconColor} />
            <Box component="span" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              {t('danh-muc')}
            </Box>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.67154 5.99959C4.9323 5.74067 5.35336 5.74141 5.6132 6.00125L8.19653 8.58458L10.7863 6.00048C11.0461 5.74125 11.4668 5.74148 11.7263 6.00099C11.986 6.26071 11.986 6.68179 11.7263 6.94151L8.90364 9.76414C8.51312 10.1547 7.87995 10.1547 7.48943 9.76414L4.66987 6.94459C4.40872 6.68344 4.40947 6.25981 4.67154 5.99959Z"
                fill="currentColor"
              />
            </svg>
          </Box>

          {isCategoryOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                zIndex: 20
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 320,
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  bgcolor: '#fff',
                  boxShadow: '0px 0px 6px rgba(0,0,0,0.15)',
                  borderRadius: '4px'
                }}
              >
                {CATEGORY_MENU_ITEMS.map((item) => (
                  <Box
                    key={item.key}
                    component={Link}
                    to={item.to}
                    onClick={() => setIsCategoryOpen(false)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      minHeight: 48,
                      px: 1.5,
                      py: 1.25,
                      fontSize: '0.875rem',
                      color: '#222222',
                      textDecoration: 'none',
                      boxShadow: 'inset 0px -1px 0px #f4f4f4',
                      bgcolor: item.active ? '#F4F4F4' : 'transparent',
                      '&:hover': { bgcolor: '#F4F4F4' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box sx={{ width: 24, height: 24, flexShrink: 0 }}>
                        <Box component="img" src={item.icon} alt="" sx={{ width: 24, height: 24 }} />
                      </Box>
                      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                        {t(`header.search.menuItems.${item.key}`)}
                      </Box>
                    </Box>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.1949 11.525C5.93598 11.2642 5.93672 10.8432 6.19657 10.5833L8.7799 8L6.19579 5.41026C5.93656 5.15046 5.93679 4.72977 6.19631 4.47026C6.45602 4.21054 6.8771 4.21054 7.13682 4.47026L9.95946 7.29289C10.35 7.68342 10.35 8.31658 9.95946 8.70711L7.1399 11.5267C6.87875 11.7878 6.45512 11.7871 6.1949 11.525Z" fill="#222222" />
                    </svg>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          flex: 1,
          minWidth: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            height: 44,
            bgcolor: bgColor,
            borderRadius: '6px',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <Box
            onClick={() => setIsRentTypeOpen((open) => !open)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: 140,
              height: '100%',
              px: 1.5,
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              whiteSpace: 'nowrap'
            }}
          >
            <Box component="span" sx={{ fontSize: '0.875rem', color: textColor, whiteSpace: 'nowrap' }}>
              {t('muon-thue')}
            </Box>
            <ChevronDownIcon />
            <Box sx={{ width: 1, height: 28, ml: 0.5, borderRight: `1px solid ${borderColor}` }} />

            {isRentTypeOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: 148,
                  bgcolor: '#fff',
                  boxShadow: '0px 2px 4px rgba(0,0,0,.18)',
                  borderRadius: '4px',
                  zIndex: 20
                }}
              >
                {CATEGORY_KEYS.map((item, index) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.5,
                      py: 1.5,
                      borderBottom: index < CATEGORY_KEYS.length - 1 ? '1px solid #E8E8E8' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: '#f4f4f4' }
                    }}
                  >
                    <Box component="span">{t(`header.search.categoryItems.${item}`)}</Box>
                    {index === 0 && (
                      <svg viewBox="0 0 16 12" width="1em" height="1em" fill="none" style={{ color: '#FF8800' }}>
                        <path fill="currentColor" d="M6.096 12L0 6.154l2.104-2.04 3.935 3.773L13.839 0 16 1.986z" />
                      </svg>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <InputBase
            value={searchKeyWord}
            onChange={handleKeywordChange}
            placeholder={t('nhap-thong-tin')}
            autoComplete="off"
            sx={{
              flex: 1,
              minWidth: 0,
              pl: 1.5,
              pr: '64px',
              fontSize: '0.9375rem',
              height: '100%',
              color: textColor,
              '& input': {
                minWidth: 0
              }
            }}
          />

          <IconButton
            onClick={handleSearch}
            aria-label={t('header.search.searchButtonAria')}
            sx={{
              position: 'absolute',
              right: 6,
              width: 60,
              height: 34,
              bgcolor: '#4bcffa',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              '&:hover': { bgcolor: '#3ab8e2' }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
