import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import { Breadcrumbs, Chip, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SearchSurfaceCard from './sections/SearchSurfaceCard'

function ListSearch({ cityValue, keyword, districtValue }) {
  const { t } = useTranslation()
  const resolvedArea = districtValue || keyword || cityValue || t('searchPage.list.allPriority')

  return (
    <SearchSurfaceCard sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack spacing={1.35}>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <MuiLink component={Link} to="/" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <HomeRoundedIcon sx={{ fontSize: 16 }} />
            {t('trang-chu')}
          </MuiLink>
          <MuiLink component={Link} to="/search" underline="hover">
            {t('tim-kiem')}
          </MuiLink>
          <Typography color="text.primary">{keyword || t('searchPage.list.allAreas')}</Typography>
        </Breadcrumbs>

        <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900, lineHeight: 1.2, color: '#101828' }}>
          {t('searchPage.list.titlePrefix')} {keyword || cityValue || t('searchPage.list.fullArea')}
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
          <Chip icon={<PlaceRoundedIcon />} label={t('searchPage.list.radiusLabel')} color="primary" variant="outlined" />
          <Chip label={t('searchPage.list.priorityLabel', { area: resolvedArea })} variant="outlined" />
        </Stack>

        <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: '#667085' }}>{t('searchPage.list.nearbyNote')}</Typography>
      </Stack>
    </SearchSurfaceCard>
  )
}

export default ListSearch
