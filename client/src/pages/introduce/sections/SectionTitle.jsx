import { Box, Stack, Typography } from '@mui/material'

const SectionTitle = ({ title, description, align = 'left' }) => {
  const isCenter = align === 'center'

  return (
    <Stack
      spacing={1.25}
      alignItems={isCenter ? 'center' : 'flex-start'}
      textAlign={isCenter ? 'center' : 'left'}
      sx={{ mb: { xs: 3, md: 4 } }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 28, md: 34 },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#1f2937'
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: 86,
          height: 5,
          borderRadius: 999,
          bgcolor: '#ffc928'
        }}
      />
      {description ? (
        <Typography sx={{ maxWidth: 760, color: 'text.secondary', fontSize: { xs: 15, md: 16 }, lineHeight: 1.75 }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default SectionTitle
