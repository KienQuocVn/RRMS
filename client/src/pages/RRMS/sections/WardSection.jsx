import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SectionHeading from './SectionHeading'

function WardSection({ items, onSelectWard }) {
  if (!items.length) {
    return null
  }

  return (
    <Box id="ward-section" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="Ward Section"
        title="Tìm phòng trọ theo phường / xã"
        description="Khi người dùng đã khoanh vùng khá kỹ, danh sách phường xã giúp rút ngắn thêm một bước trong hành trình tìm kiếm."
      />

      <Stack direction="row" flexWrap="wrap" useFlexGap gap={1.25}>
        {items.slice(0, 18).map((item) => (
          <Chip
            key={item.label}
            icon={<LocationOnRoundedIcon sx={{ color: '#0f766e !important' }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {item.label}
                </Typography>
                <Typography component="span" sx={{ fontSize: 12, color: '#64748b' }}>
                  {item.count} tin
                </Typography>
                <ChevronRightRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
              </Box>
            }
            onClick={() => onSelectWard(item.label)}
            sx={{
              height: 42,
              pl: 0.5,
              pr: 0.75,
              borderRadius: 999,
              bgcolor: alpha('#0f766e', 0.08),
              border: '1px solid rgba(15, 118, 110, 0.14)',
              '& .MuiChip-label': {
                px: 0.5
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default WardSection
