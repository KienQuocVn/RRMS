import { Box, Typography } from '@mui/material'

const TitleAttribute = ({ title, description }) => {
  return (
    <Box sx={{ fontStyle: 'normal', display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
      <Box sx={{ bgcolor: '#20a9e7', width: '4px', height: '45px', mr: 1, borderRadius: '4px' }}></Box>
      <Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>{description}</Typography>
      </Box>
    </Box>
  )
}

export default TitleAttribute
