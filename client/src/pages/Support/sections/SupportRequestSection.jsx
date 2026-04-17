import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SupportFormFieldsSection from './SupportFormFieldsSection'
import SupportPolicySection from './SupportPolicySection'

export default function SupportRequestSection({
  formValues,
  onFieldChange,
  onDateChange,
  onPriceRangeChange,
  onSubmit
}) {
  const { t } = useTranslation()

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        px: { xs: 2, md: 4 },
        py: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        border: '2px dashed #b7d9ff',
        background: 'linear-gradient(180deg, #eef6ff 0%, #f7fbff 100%)',
        boxShadow: '0 18px 40px rgba(88, 118, 165, 0.08)'
      }}
    >
      <Stack spacing={2.4}>
        <Stack direction="row" spacing={1.75} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              backgroundColor: '#e4f0ff',
              color: '#f3a400'
            }}
          >
            <TipsAndUpdatesRoundedIcon sx={{ fontSize: 24 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 900, color: '#111827' }}>
              {t('support.bannerTitle')}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: { xs: 14, md: 16 }, color: '#1f2937' }}>
              {t('support.bannerDescription')}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            px: 1.75,
            py: 1.2,
            borderRadius: 1.5,
            border: '1px solid rgba(109, 133, 167, 0.35)',
            backgroundColor: 'rgba(255, 255, 255, 0.38)'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <PlaceOutlinedIcon sx={{ fontSize: 22, color: '#2296e3' }} />
            <Typography
              sx={{
                fontSize: { xs: 14, md: 16 },
                color: '#111827',
                textDecoration: 'underline'
              }}
            >
              {t('support.searchLabel')}{' '}
              <Box component="span" sx={{ fontWeight: 800 }}>
                {t('support.location')}
              </Box>
            </Typography>
          </Stack>
        </Box>

        <Box component="form" noValidate onSubmit={onSubmit}>
          <SupportFormFieldsSection
            formValues={formValues}
            onFieldChange={onFieldChange}
            onDateChange={onDateChange}
            onPriceRangeChange={onPriceRangeChange}
          />
          <SupportPolicySection />
        </Box>
      </Stack>
    </Box>
  )
}
