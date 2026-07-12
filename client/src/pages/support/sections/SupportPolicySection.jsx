import SendRoundedIcon from '@mui/icons-material/SendRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function SupportPolicySection() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            backgroundColor: '#fff1dc',
            color: '#bc7a16'
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
        </Box>

        <Typography sx={{ fontSize: { xs: 12, md: 13 }, lineHeight: 1.75, color: '#58657a' }}>
          {t('support.privacyNote')}{' '}
          <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
            (
            <Link href="#" underline="hover" sx={{ fontWeight: 700, color: '#228be6' }}>
              {t('support.privacyLinkLabel')}
            </Link>
            )
          </Box>
        </Typography>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        startIcon={<SendRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          alignSelf: { xs: 'stretch', md: 'center' },
          minWidth: { md: 180 },
          px: 2.75,
          py: 1.3,
          borderRadius: 1.5,
          fontWeight: 800,
          color: '#fff',
          background: 'linear-gradient(135deg, #63d7ff 0%, #36b8f1 100%)',
          boxShadow: '0 14px 26px rgba(54, 184, 241, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5acfff 0%, #2caee8 100%)'
          }
        }}
      >
        {t('support.submit')}
      </Button>
    </Box>
  )
}
