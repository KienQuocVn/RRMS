import { Link, useNavigate } from 'react-router-dom'
import { Box, InputBase, IconButton } from '@mui/material'
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

const CATEGORY_ITEMS = ['Muốn thuê', 'Cho thuê', 'Dự án']

export default function SearchBar({ onSearchKeywordChange }) {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isRentTypeOpen, setIsRentTypeOpen] = useState(false)
  const [searchKeyWord, setSearchKeyWord] = useState('')
  const iconColor = theme.palette.mode === 'light' ? '#212121' : '#E8E8E8'
  const bgColor = theme.palette.mode === 'light' ? '#f4f4f4' : '#1f1f1f'

  const handleSearch = () => navigate('/search', { state: { searchKeyWord } })

  const handleKeywordChange = (e) => {
    setSearchKeyWord(e.target.value)
    onSearchKeywordChange?.(e.target.value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        width: '100%',
        bgcolor: theme.palette.mode === 'light' ? '#fff' : '#1f1f1f'
      }}
    >
      {/* Logo + Category button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '20%',
          mr: 1.5,
          gap: 1
        }}
      >
        <Box
          component={Link}
          to="/RRMS"
          sx={{ display: 'inline-flex', alignItems: 'center', height: 52, width: 142, textDecoration: 'none' }}
        >
          <Box
            component="img"
            src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Flogo.png?alt=media&token=719c4675-1dc4-42d2-af36-ec52626519e4"
            alt="Nhà trọ"
            sx={{ height: 35, width: 188, objectFit: 'contain', objectPosition: '0 0' }}
          />
        </Box>

        {/* Category dropdown */}
        <Box
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            height: 32,
            px: 1.5,
            py: 1,
            gap: 1,
            fontSize: '0.875rem',
            userSelect: 'none'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
            <BurgerIcon color={iconColor} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#8C8C8C' }}>
              <Box
                component="span"
                sx={{ fontSize: '0.875rem', color: theme.palette.mode === 'light' ? '#8C8C8C' : '#e8e8e8' }}
              >
                {t('danh-muc')}
              </Box>
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.67154 5.99959C4.9323 5.74067 5.35336 5.74141 5.6132 6.00125L8.19653 8.58458L10.7863 6.00048C11.0461 5.74125 11.4668 5.74148 11.7263 6.00099C11.986 6.26071 11.986 6.68179 11.7263 6.94151L8.90364 9.76414C8.51312 10.1547 7.87995 10.1547 7.48943 9.76414L4.66987 6.94459C4.40872 6.68344 4.40947 6.25981 4.67154 5.99959Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Search input */}
      <Box sx={{ flex: 1, py: 1.25 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: bgColor,
            borderRadius: '4px',
            position: 'relative',
            height: 36
          }}
        >
          {/* Rent type dropdown */}
          <Box
            onClick={() => setIsRentTypeOpen(!isRentTypeOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              width: 110,
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            <Box component="span" sx={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', color: '#222' }}>
              {t('muon-thue')}
            </Box>
            <ChevronDownIcon />
            {/* Divider */}
            <Box sx={{ width: 1, height: 28, borderRight: '1px solid #E8E8E8', ml: 0.5 }} />

            {isRentTypeOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 42,
                  left: 0,
                  width: 105,
                  bgcolor: '#fff',
                  boxShadow: '0px 2px 4px rgba(0,0,0,.5)',
                  borderRadius: '4px',
                  zIndex: 10
                }}
              >
                {CATEGORY_ITEMS.map((item, idx) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.5,
                      py: 1.5,
                      borderBottom: idx < CATEGORY_ITEMS.length - 1 ? '1px solid #E8E8E8' : 'none',
                      display: 'flex',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f4f4f4' }
                    }}
                  >
                    {item}
                    {idx === 0 && (
                      <svg viewBox="0 0 16 12" width="1em" height="1em" fill="none" style={{ marginTop: 4, marginLeft: 4, color: '#FF8800' }}>
                        <path fill="currentColor" d="M6.096 12L0 6.154l2.104-2.04 3.935 3.773L13.839 0 16 1.986z" />
                      </svg>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Text input */}
          <InputBase
            onChange={handleKeywordChange}
            placeholder={t('nhap-thong-tin')}
            autoComplete="off"
            sx={{
              flex: 1,
              pl: 1.5,
              pr: '52px',
              fontSize: '0.9375rem',
              height: 36
            }}
          />

          {/* Search button */}
          <IconButton
            onClick={handleSearch}
            aria-label="Search"
            sx={{
              position: 'absolute',
              right: 4,
              bgcolor: '#4bcffa',
              borderRadius: '4px',
              width: 48,
              height: 28,
              display: { xs: 'none', md: 'flex' },
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

      {/* Dropdown category overlay for desktop */}
      {isCategoryOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 92,
            left: 170,
            zIndex: 189
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
            {[
              { label: 'Muốn thuê', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_muban.png?alt=media&token=0a78f985-f7dc-4211-b14c-cc64c9892136', to: '#', active: true },
              { label: 'Cho thuê', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_chothue.png?alt=media&token=6ebeeb22-5d71-45e9-b02c-3c03499ce555', to: '#' },
              { label: 'Dự án', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_duan.png?alt=media&token=88b33caf-3f11-4025-a18c-653c0a6056c4', to: '#' },
              { label: 'Tìm môi giới', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_timmoigioi.png?alt=media&token=a08d9169-cf8a-4fdd-aa1c-200a888b0abd', to: '#' },
              { label: 'Biểu đồ biến động giá', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_bieudogia.png?alt=media&token=e62c4212-ee82-4985-b2a5-02e225c1e4d1', to: '/chart' },
              { label: 'Vay mua nhà', icon: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2FPTY_lv1_cat_vaymuanha.png?alt=media&token=ec55ddd5-2e94-408d-b167-d8f02582ac73', to: '#' }
            ].map((item) => (
              <Box
                key={item.label}
                component={Link}
                to={item.to}
                onClick={() => setIsCategoryOpen(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  height: 48,
                  px: 1.5,
                  py: '14px 12px 10px',
                  fontSize: '0.875rem',
                  color: '#222222',
                  textDecoration: 'none',
                  boxShadow: 'inset 0px -1px 0px #f4f4f4',
                  bgcolor: item.active ? '#F4F4F4' : 'transparent',
                  '&:hover': { bgcolor: '#F4F4F4' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 24, height: 24 }}>
                    <Box component="img" src={item.icon} alt="" sx={{ width: 24, height: 24 }} />
                  </Box>
                  <span>{item.label}</span>
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
  )
}
