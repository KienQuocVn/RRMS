import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchSurfaceCard from './SearchSurfaceCard'

function SearchArticleSection({ keyword, totalRooms, articleSections }) {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  return (
    <SearchSurfaceCard sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900, textAlign: 'center', color: '#101828' }}>
            {t('searchPage.article.title')}
          </Typography>
          <Typography sx={{ mt: 1, fontSize: 15, lineHeight: 1.8, color: '#667085', textAlign: 'center' }}>
            {t('searchPage.article.subtitle', {
              count: totalRooms,
              keyword: keyword || t('searchPage.article.defaultKeyword')
            })}
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {articleSections.slice(0, showMore ? articleSections.length : 1).map((section) => (
            <Box key={section.titleKey} sx={{ display: 'grid', gap: 1.5 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#101828' }}>{t(section.titleKey)}</Typography>
              <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: '#475467' }}>{t(section.descriptionKey)}</Typography>
              <Box
                component="img"
                src={section.image}
                alt={t(section.titleKey)}
                sx={{
                  width: '100%',
                  maxHeight: 360,
                  objectFit: 'cover',
                  borderRadius: 3
                }}
              />
            </Box>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => setShowMore((prev) => !prev)}
            endIcon={
              <ExpandMoreRoundedIcon
                sx={{
                  transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            }
            sx={{ fontWeight: 800 }}
          >
            {showMore ? t('searchPage.article.showLess') : t('searchPage.article.showMore')}
          </Button>
        </Box>
      </Stack>
    </SearchSurfaceCard>
  )
}

export default SearchArticleSection
