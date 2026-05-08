import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

function SectionHeading({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      sx={{ mb: 3 }}>
      <Box>
        {eyebrow ? (
          <Chip
            label={eyebrow}
            size="small"
            sx={{
              mb: 1.25,
              bgcolor: alpha('#0f766e', 0.1),
              color: '#0f766e',
              fontWeight: 800
            }}
          />
        ) : null}

        <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 900, letterSpacing: '-0.03em' }}>
          {title}
        </Typography>
        {description ? (
          <Typography sx={{ mt: 1, maxWidth: 760, color: '#475569', lineHeight: 1.75 }}>{description}</Typography>
        ) : null}
      </Box>

      {actionLabel ? (
        <Button
          onClick={onAction}
          endIcon={<EastRoundedIcon />}
          sx={{
            px: 0,
            fontWeight: 800,
            color: '#0f766e',
            '&:hover': {
              bgcolor: 'transparent',
              color: '#115e59'
            }
          }}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  )
}

export default SectionHeading
