import TagRoundedIcon from '@mui/icons-material/TagRounded'
import { Box, Button, Stack } from '@mui/material'
import SectionHeading from './SectionHeading'

function SuggestSpecialSection({ title, items, onSelectHashtag }) {
  if (!items.length) {
    return null
  }

  return (
    <Box id="sugget-special-ssection" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="Suggest Special Section"
        title={title}
        description="Chọn nhanh hashtag theo trường học và điểm quan tâm lớn để chuyển thẳng sang trang tìm kiếm, vẫn giữ nguyên bộ lọc tỉnh thành đầy đủ như hiện tại."
      />

      <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap">
        {items.map((item) => (
          <Button
            key={item.label}
            variant="outlined"
            startIcon={<TagRoundedIcon />}
            onClick={() => onSelectHashtag(item.query)}
            sx={{
              borderRadius: 999,
              px: 2,
              py: 1.1,
              fontWeight: 700,
              justifyContent: 'flex-start',
              color: '#0f172a',
              borderColor: 'rgba(15, 23, 42, 0.12)',
              backgroundColor: '#fff',
              '&:hover': {
                borderColor: '#0f766e',
                color: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.04)'
              }
            }}>
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}

export default SuggestSpecialSection
