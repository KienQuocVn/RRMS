import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import { Box, Typography } from '@mui/material'
import SearchSurfaceCard from './SearchSurfaceCard'

function SearchEmptyState({ title, description }) {
  return (
    <SearchSurfaceCard sx={{ p: 3 }}>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: '#eef4ff',
            color: '#155eef'
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#101828' }}>{title}</Typography>
        <Typography sx={{ mt: 0.8, maxWidth: 520, mx: 'auto', fontSize: 14, lineHeight: 1.7, color: '#667085' }}>
          {description}
        </Typography>
      </Box>
    </SearchSurfaceCard>
  )
}

export default SearchEmptyState

