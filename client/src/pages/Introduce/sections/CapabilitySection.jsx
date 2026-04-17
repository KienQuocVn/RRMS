import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { capabilityItemKeys } from '../hooks/introduceData'
import SectionTitle from './SectionTitle'

const CapabilitySection = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 } }}>
      <SectionTitle title={t('introduce.capability.title')} />
      <Stack spacing={1.75}>
        {capabilityItemKeys.map((key) => (
          <Paper
            key={key}
            elevation={0}
            sx={{
              px: { xs: 2, md: 2.5 },
              py: 1.75,
              borderRadius: 2.5,
              border: '1px solid #9be7a8',
              backgroundColor: '#fbfffc'
            }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <CheckCircleRoundedIcon sx={{ color: '#2e7d32' }} />
              <Typography sx={{ color: '#334155', lineHeight: 1.7 }}>{t(key)}</Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  )
}

export default CapabilitySection
