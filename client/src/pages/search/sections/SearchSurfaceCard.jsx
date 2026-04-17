import { Box } from '@mui/material'

function SearchSurfaceCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)',
        backdropFilter: 'blur(10px)',
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

export default SearchSurfaceCard

