import { Badge, Box, Checkbox, FormControlLabel, IconButton, InputBase, Paper, Typography } from '@mui/material'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Colors } from '~/theme'

const FILTER_CONFIGS = [
  { key: 'ACTIVE', label: 'Trong thoi han hop dong', color: Colors.success },
  { key: 'ReportEnd', label: 'Dang bao ket thuc', color: Colors.success },
  { key: 'IATExpire', label: 'Sap den han', color: Colors.warning },
  { key: 'ENDED', label: 'Da qua han', color: Colors.grey }
]

const ContractFilters = ({ counts, statusFilters, onStatusFilterChange, searchTerm, onSearchTermChange }) => {
  const activeFilterCount = Object.values(statusFilters || {}).filter(Boolean).length

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FilterAltOutlinedIcon sx={{ color: '#666', fontSize: 28 }} />
          <Badge
            badgeContent={activeFilterCount}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              '& .MuiBadge-badge': {
                bgcolor: Colors.success,
                color: 'white',
                minWidth: '16px',
                height: '16px',
                fontSize: '10px',
                padding: '0 4px'
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {FILTER_CONFIGS.map((filter) => (
            <FormControlLabel
              key={filter.key}
              control={
                <Checkbox
                  size="small"
                  checked={Boolean(statusFilters?.[filter.key])}
                  onChange={(event) => onStatusFilterChange?.(filter.key, event.target.checked)}
                  sx={{ color: '#ccc', '&.Mui-checked': { color: '#9e9e9e' } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '13px' }}>
                    {filter.label}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: filter.color,
                      color: 'white',
                      borderRadius: '10px',
                      px: 0.8,
                      py: 0.1,
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                    {counts?.[filter.key] ?? 0}
                  </Box>
                </Box>
              }
            />
          ))}
        </Box>
      </Box>

      <Paper
        component="form"
        onSubmit={(event) => event.preventDefault()}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 250,
          border: '1px solid #ddd',
          boxShadow: 'none',
          borderRadius: '4px',
          height: '36px'
        }}>
        <InputBase
          value={searchTerm}
          onChange={(event) => onSearchTermChange?.(event.target.value)}
          sx={{ ml: 1, flex: 1, fontSize: '14px' }}
          placeholder="Tim ten phong..."
          inputProps={{ 'aria-label': 'tim ten phong' }}
        />
        <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
          <SearchIcon sx={{ color: '#999' }} />
        </IconButton>
      </Paper>
    </Box>
  )
}

export default ContractFilters
