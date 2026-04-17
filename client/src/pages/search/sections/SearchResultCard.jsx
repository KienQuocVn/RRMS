import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { Avatar, Box, Button, Chip, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatterAmount } from '~/utils/formatterAmount'
import SearchSurfaceCard from './SearchSurfaceCard'

function SearchResultCard({
  item,
  isFavorite,
  phoneVisible,
  phoneNumber,
  onViewDetail,
  onTogglePhone,
  onAddFavorite,
  onCopyLink,
  onAlreadyFavorite
}) {
  const { t } = useTranslation()

  return (
    <SearchSurfaceCard sx={{ p: { xs: 1.5, md: 2 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '240px minmax(0, 1fr) 150px' },
          gap: 2
        }}
      >
        <Box
          component="img"
          src={item?.bulletinBoardImages?.[0]?.imageLink || 'https://picsum.photos/800/600?random=12'}
          alt={item?.title}
          onClick={onViewDetail}
          sx={{
            width: '100%',
            height: { xs: 220, md: 180 },
            objectFit: 'cover',
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'transform 0.25s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />

        <Stack spacing={1.2} sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                onClick={onViewDetail}
                sx={{
                  fontSize: { xs: 18, md: 21 },
                  fontWeight: 800,
                  lineHeight: 1.35,
                  color: '#101828',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#155eef'
                  }
                }}
              >
                {item?.title}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap" sx={{ mt: 0.6 }}>
                <Chip label={t('searchPage.card.priority')} size="small" color="success" />
                <Typography sx={{ fontSize: 12.5, color: '#667085' }}>{t('searchPage.card.verified')}</Typography>
              </Stack>
            </Box>

            <IconButton
              onClick={isFavorite ? onAlreadyFavorite : onAddFavorite}
              sx={{
                color: isFavorite ? '#ef4444' : '#98a2b3',
                backgroundColor: isFavorite ? '#fff1f2' : '#f8fafc',
                '&:hover': {
                  backgroundColor: isFavorite ? '#ffe4e6' : '#eef2f6'
                }
              }}
            >
              <FavoriteRoundedIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#667085' }} />
            <Typography sx={{ fontSize: 14, color: '#475467' }}>{item?.address}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={`${formatterAmount(item?.rentPrice)} / ${t('searchPage.units.month')}`}
              sx={{ fontWeight: 800, color: '#b42318', backgroundColor: '#fff1f3' }}
            />
            <Chip label={`${item?.area || 0} m²`} variant="outlined" />
            {item?.waterPrice ? <Chip label={`${formatterAmount(item?.waterPrice)} / ${t('searchPage.units.block')}`} variant="outlined" /> : null}
            {item?.electricityPrice ? <Chip label={`${formatterAmount(item?.electricityPrice)} / ${t('searchPage.units.kw')}`} variant="outlined" /> : null}
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1.1} alignItems="center">
            <Avatar src={item?.account?.avatar || ''} alt={item?.account?.username || 'Avatar'} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#344054' }}>
                {item?.account?.username || t('searchPage.card.unknownUser')}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <VerifiedRoundedIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                <Typography sx={{ fontSize: 12.5, color: '#667085' }}>{t('searchPage.card.updated')}</Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Stack spacing={1.2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ShareRoundedIcon />}
            onClick={onCopyLink}
            sx={{
              height: 46,
              borderRadius: 2.5,
              fontWeight: 800
            }}
          >
            {t('searchPage.card.copyLink')}
          </Button>

          <Button
            variant={phoneVisible ? 'contained' : 'outlined'}
            startIcon={<PhoneOutlinedIcon />}
            onClick={onTogglePhone}
            sx={{
              height: 46,
              borderRadius: 2.5,
              fontWeight: 800
            }}
          >
            {phoneVisible ? phoneNumber : t('searchPage.card.viewPhone')}
          </Button>

          <Button
            variant="text"
            startIcon={<ContentCopyRoundedIcon />}
            onClick={onViewDetail}
            sx={{
              justifyContent: 'flex-start',
              px: 0,
              fontWeight: 700
            }}
          >
            {t('searchPage.card.viewDetail')}
          </Button>
        </Stack>
      </Box>
    </SearchSurfaceCard>
  )
}

export default SearchResultCard
