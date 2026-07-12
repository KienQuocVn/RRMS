import { Box, Typography } from '@mui/material'

function ProfileSectionCard({ title, description, children, action, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        backgroundColor: '#fff',
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
        ...sx
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 1.5
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#101828' }}>{title}</Typography>
          {description ? (
            <Typography sx={{ mt: 0.5, fontSize: 14, color: '#667085' }}>{description}</Typography>
          ) : null}
        </Box>
        {action}
      </Box>

      {children}
    </Box>
  )
}

export default ProfileSectionCard
