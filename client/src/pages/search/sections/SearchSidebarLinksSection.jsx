import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import SearchSurfaceCard from './SearchSurfaceCard'

function SearchSidebarLinksSection({ title, description, items, variant = 'chip' }) {
  return (
    <SearchSurfaceCard sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#101828' }}>{title}</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, lineHeight: 1.65, color: '#667085' }}>{description}</Typography>
        </Box>

        {variant === 'grid' ? (
          <Grid container spacing={1.1}>
            {items.map((item) => (
              <Grid item xs={6} key={item}>
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ChevronRightRoundedIcon />}
                  sx={{
                    justifyContent: 'space-between',
                    minHeight: 42,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  {item}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {items.map((item) => (
              <Button
                key={item}
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        )}
      </Stack>
    </SearchSurfaceCard>
  )
}

export default SearchSidebarLinksSection

