import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SearchSurfaceCard from './SearchSurfaceCard'

function SearchInsightsSection({ popularAreaColumns, postingSteps, searchStats }) {
  const { t } = useTranslation()

  return (
    <Stack spacing={3}>
      <SearchSurfaceCard sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#101828' }}>{t('searchPage.insights.popularTitle')}</Typography>
            <Typography sx={{ mt: 0.6, fontSize: 14.5, lineHeight: 1.7, color: '#667085' }}>
              {t('searchPage.insights.popularDescription')}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {popularAreaColumns.map((column, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box component="ul" sx={{ pl: 2.25, m: 0, display: 'grid', gap: 0.85 }}>
                  {column.map((item) => (
                    <Typography component="li" key={item} sx={{ fontSize: 14.5, color: '#344054' }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </SearchSurfaceCard>

      <SearchSurfaceCard sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#101828' }}>{t('searchPage.insights.postTitle')}</Typography>
            <Typography sx={{ mt: 0.6, fontSize: 14.5, color: '#667085' }}>{t('searchPage.insights.postDescription')}</Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2
            }}
          >
            {postingSteps.map((step, index) => {
              const accentColors = ['#34d399', '#60a5fa', '#fbbf24']
              return (
                <Box
                  key={step.step}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: `${accentColors[index]}16`,
                    border: `1px solid ${accentColors[index]}33`
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 900,
                      color: '#fff',
                      backgroundColor: accentColors[index]
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography sx={{ mt: 1.25, fontSize: 17, fontWeight: 800, color: '#101828' }}>{t(step.titleKey)}</Typography>
                  <Typography sx={{ mt: 0.6, fontSize: 14, lineHeight: 1.7, color: '#475467' }}>{t(step.descriptionKey)}</Typography>
                </Box>
              )
            })}
          </Box>
        </Stack>
      </SearchSurfaceCard>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 2
        }}
      >
        {searchStats.map((stat) => (
          <SearchSurfaceCard key={stat.labelKey} sx={{ p: 2, textAlign: 'center' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                mx: 'auto',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: '#ecfdf3',
                color: '#16a34a'
              }}
            >
              {stat.labelKey === 'luot-truy-cap' ? <InsightsRoundedIcon /> : <TrendingUpRoundedIcon />}
            </Box>
            <Typography sx={{ mt: 1.25, fontSize: 26, fontWeight: 900, color: '#101828' }}>{stat.value}</Typography>
            <Typography sx={{ mt: 0.35, fontSize: 14, color: '#667085' }}>{t(stat.labelKey)}</Typography>
          </SearchSurfaceCard>
        ))}
      </Box>
    </Stack>
  )
}

export default SearchInsightsSection
