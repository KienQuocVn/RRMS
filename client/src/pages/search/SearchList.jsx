import SortRoundedIcon from '@mui/icons-material/SortRounded'
import { Box, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SearchSurfaceCard from './sections/SearchSurfaceCard'

function SearchList({ totalRooms, setFilter, setArea }) {
  const { t } = useTranslation()

  return (
    <SearchSurfaceCard sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5}>
        <Box>
          <Typography sx={{ fontSize: 16, color: '#475467' }}>
            {t('searchPage.results.countText', { count: totalRooms })}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <Select
              defaultValue=""
              displayEmpty
              startAdornment={<SortRoundedIcon sx={{ mr: 1, color: '#667085' }} />}
              onChange={(event) => setFilter(event.target.value)}
            >
              <MenuItem value="">{t('searchPage.results.sortPrice')}</MenuItem>
              <MenuItem value="asc">{t('tu-thap-den-cao')}</MenuItem>
              <MenuItem value="desc">{t('tu-cao-den-thap')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <Select defaultValue="" displayEmpty onChange={(event) => setArea(event.target.value)}>
              <MenuItem value="">{t('searchPage.results.sortArea')}</MenuItem>
              <MenuItem value="asc">{t('nho-den-lon')}</MenuItem>
              <MenuItem value="desc">{t('lon-den-nho')}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </SearchSurfaceCard>
  )
}

export default SearchList
