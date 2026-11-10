import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import { Box, Button, Card, CardContent, CardMedia, Grid, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { formatterAmount } from '~/utils/formatterAmount'
import SectionHeading from './SectionHeading'
import { getEffectivePrice, getMoveInLabel, getPromotionPercent, hasPromotionalPrice } from './rrmsData'
import { useAddressResolver } from '~/utils/addressResolver'

const SummaryMetric = ({ value, label, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 4,
      bgcolor: alpha(color, 0.08),
      border: `1px solid ${alpha(color, 0.14)}`
    }}>
    <Typography sx={{ fontSize: 24, fontWeight: 900, color }}>{value}</Typography>
    <Typography sx={{ mt: 0.5, color: '#475569', lineHeight: 1.65 }}>{label}</Typography>
  </Paper>
)

function PromotionSection({ room, stats, onExplorePromotions }) {
  const resolvedAddress = useAddressResolver(room?.address)

  if (!room) {
    return null
  }

  const effectivePrice = getEffectivePrice(room)
  const promotionPercent = getPromotionPercent(room)

  return (
    <Box id="promotion-section" sx={{ mt: 7 }}>
      <SectionHeading
        title="Ưu đãi và những tin đáng xem ngay lúc này"
        description="Section này tập trung vào giá thuê tốt, tỷ lệ giảm giá và những tín hiệu giúp người thuê ra quyết định nhanh hơn."
        actionLabel="Xem tất cả tin mới"
        onAction={onExplorePromotions}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card
            component={Link}
            to={`/detail/${room.bulletinBoardId}`}
            elevation={0}
            sx={{
              height: '100%',
              overflow: 'hidden',
              borderRadius: 6,
              textDecoration: 'none',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)'
            }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia component="img" image={room?.bulletinBoardImages?.[0]?.imageLink || '/banner1.png'} alt={room?.title || resolvedAddress} sx={{ height: '100%', minHeight: 300 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ height: '100%', p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha('#ea580c', 0.12),
                        color: '#ea580c'
                      }}>
                      <LocalFireDepartmentRoundedIcon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: '#ea580c' }}>
                      {hasPromotionalPrice(room) ? `Đang giảm ${promotionPercent}%` : 'Tin đang được quan tâm'}
                    </Typography>
                  </Stack>

                  <Typography sx={{ mt: 2, fontSize: 28, fontWeight: 900, lineHeight: 1.18, color: '#0f172a' }}>
                    {room?.title || resolvedAddress}
                  </Typography>

                  <Typography sx={{ mt: 1.5, color: '#475569', lineHeight: 1.8 }}>
                    {room?.description || 'Tin đăng có thông tin rõ ràng về vị trí, giá thuê và thời gian nhận phòng để người thuê so sánh nhanh.'}
                  </Typography>

                  <Stack spacing={1.1} sx={{ mt: 2.5 }}>
                    <Typography sx={{ color: '#0f766e', fontWeight: 700 }}>{resolvedAddress}</Typography>
                    <Typography sx={{ color: '#2563eb', fontWeight: 700 }}>{getMoveInLabel(room)}</Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 3 }}>
                    {hasPromotionalPrice(room) ? (
                      <Typography sx={{ fontSize: 15, color: '#94a3b8', textDecoration: 'line-through' }}>{formatterAmount(room?.rentPrice || 0)}</Typography>
                    ) : null}
                    <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#dc2626' }}>{formatterAmount(effectivePrice)}</Typography>
                  </Stack>

                  <Button
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ mt: 3, px: 0, fontWeight: 800, color: '#0f766e', '&:hover': { bgcolor: 'transparent' } }}>
                    Mở chi tiết tin đăng
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2.25}>
            <SummaryMetric value={stats.promotionRooms} label="Tin đang có mức giá tốt hoặc chênh lệch ưu đãi nổi bật." color="#dc2626" />
            <SummaryMetric value={stats.readyRooms} label="Phòng có thể vào ở ngay, phù hợp người cần chốt nhanh." color="#0f766e" />
            <SummaryMetric value={stats.latestRooms} label="Bài đăng mới đã được đồng bộ để người dùng không bỏ lỡ lựa chọn." color="#2563eb" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PromotionSection
