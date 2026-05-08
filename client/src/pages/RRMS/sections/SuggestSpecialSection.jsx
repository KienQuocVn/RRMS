import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import SectionHeading from './SectionHeading'
import { formatterAmount } from '~/utils/formatterAmount'
import { getEffectivePrice } from './rrmsData'

function SuggestSpecialSection({ items, onOpenRoom }) {
  if (!items.length) {
    return null
  }

  return (
    <Box id="sugget-special-ssection" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="Suggest Special Section"
        title="Gợi ý đặc biệt để bắt đầu duyệt nhanh"
        description="Những tin dưới đây được chọn từ dữ liệu thật dựa trên mức giá tốt, độ đầy đủ thông tin, khả năng dọn vào sớm hoặc tín hiệu quan tâm từ người dùng."
      />

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={6} key={item.room?.bulletinBoardId}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 6,
                border: '1px solid rgba(15, 23, 42, 0.06)',
                boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
              }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f766e' }}>
                  {item.badge}
                </Typography>
                <Typography sx={{ mt: 1.2, fontSize: 22, fontWeight: 900, lineHeight: 1.3, color: '#0f172a' }}>
                  {item.room?.title || item.room?.address}
                </Typography>
                <Typography sx={{ mt: 1, color: '#475569', lineHeight: 1.75 }}>{item.description}</Typography>

                <Stack spacing={0.8} sx={{ mt: 2 }}>
                  <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{item.room?.address}</Typography>
                  <Typography sx={{ color: '#dc2626', fontWeight: 900 }}>{formatterAmount(getEffectivePrice(item.room))}</Typography>
                </Stack>

                <Button
                  onClick={() => onOpenRoom(item.room?.bulletinBoardId)}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ mt: 2, px: 0, fontWeight: 800, color: '#0f766e', '&:hover': { bgcolor: 'transparent' } }}>
                  Xem chi tiết đề xuất
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SuggestSpecialSection
